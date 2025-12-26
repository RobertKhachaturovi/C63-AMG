import {
  Component,
  signal,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { LoadingComponent } from './loading.component';
import { routes } from './app.routes';
import { AudioService } from './audio.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, LoadingComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('cubeElement') cubeElement!: ElementRef<HTMLDivElement>;

  protected readonly title = signal('c63-amg');
  isScrolled = signal(false);
  menuOpen = signal(false);
  showMainContent = signal(true);
  private routerSubscription?: any;

  rotateY = 0;
  isDragging = false;
  startX = 0;

  // Mercedes C63 AMG images - using high-quality placeholder URLs
  // In production, replace with actual Mercedes C63 AMG images
  cubeImages = {
    front: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80',
    back: 'https://preview.free3d.com/img/2019/11/2408237387009230411/2qagmggn.jpg',
    right: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80',
    left: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80',
    top: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80',
    bottom: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80',
  };

  selectedFeature = signal<any>(null);
  isModalOpen = signal(false);
  hoveredSpec = signal<number | null>(null);

  features = signal([
    {
      icon: 'engine',
      title: 'V8 Engine',
      description: '4.0L Biturbo V8 engine with 469 horsepower',
      image: 'https://preview.free3d.com/img/2019/11/2408237387009230411/kzu5y3jp.jpg',
      details:
        'The heart of the C63 AMG is its powerful 4.0-liter V8 biturbo engine. This masterpiece delivers 469 horsepower and 650 Nm of torque, providing breathtaking acceleration and an unforgettable driving experience.',
    },
    {
      icon: 'transmission',
      title: 'AMG SPEEDSHIFT',
      description: '9-speed automatic transmission',
      image: 'https://preview.free3d.com/img/2019/11/2408237387009230411/86nigfzt.jpg',
      details:
        'The AMG SPEEDSHIFT MCT 9-speed transmission offers lightning-fast gear changes. With multiple driving modes, you can customize the shift characteristics to match your driving style perfectly.',
    },
    {
      icon: 'suspension',
      title: 'AMG RIDE CONTROL',
      description: 'Adaptive damping system',
      image:
        'https://www.mercedes-benz.ca/content/dam/mb-nafta/us/amg/performance/suspensions/2018-AMG-THEME-PAGE-PERFORMANCE-SUSPENSION-002-DR.jpg',
      details:
        'The adaptive damping system automatically adjusts to road conditions and driving style. Experience the perfect balance between comfort and sporty performance in every situation.',
    },
    {
      icon: 'modes',
      title: 'AMG DYNAMIC SELECT',
      description: '5 driving modes: Comfort, Sport, Sport+, Individual, Race',
      image: 'https://hips.hearstapps.com/autoweek/assets/s3fs-public/18c0583_031.jpg?resize=980:*',
      details:
        'Choose from five distinct driving modes: Comfort for daily driving, Sport and Sport+ for spirited driving, Individual for personalized settings, and Race mode for track performance.',
    },
    {
      icon: 'interior',
      title: 'Premium Interior',
      description: 'AMG Performance seats and luxury materials',
      image: 'https://preview.free3d.com/img/2019/11/2408237387009230411/evng9tus.jpg',
      details:
        'The interior combines luxury with sporty functionality. AMG Performance seats provide excellent support, while premium materials create an atmosphere of refined elegance.',
    },
    {
      icon: 'sound',
      title: 'Burmester Sound System',
      description: '13-speaker premium sound system',
      image: 'https://preview.free3d.com/img/2019/11/2408237387009230411/lxtzocsv.jpg',
      details:
        'Experience concert-hall quality sound with the Burmester High-End 3D Surround Sound System. 13 high-performance speakers deliver crystal-clear audio throughout the cabin.',
    },
  ]);

  specifications = signal([
    { label: 'Engine', value: '4.0L V8 Biturbo' },
    { label: 'Power', value: '469 HP (350 kW)' },
    { label: 'Torque', value: '650 Nm' },
    { label: '0-100 km/h', value: '4.0 seconds' },
    { label: 'Top Speed', value: '250 km/h (electronically limited)' },
    { label: 'Transmission', value: 'AMG SPEEDSHIFT MCT 9G' },
    { label: 'Drivetrain', value: 'AMG Performance (RWD)' },
    { label: 'Fuel Consumption', value: '10.8 L/100 km' },
    { label: 'CO2 Emissions', value: '247 g/km' },
    { label: 'Weight', value: '1,825 kg' },
  ]);

  constructor(private router: Router, private audioService: AudioService) {}

  // Method to play engine sound
  playEngineSound() {
    this.audioService.playEngineSound();
  }

  ngOnInit() {
    window.addEventListener('scroll', this.handleScroll.bind(this));
    this.setupCubeImages();

    // Track route changes to show/hide main content
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentUrl = event.urlAfterRedirects || event.url;
        this.showMainContent.set(currentUrl === '/' || currentUrl === '');
      }
    });

    // Check initial route
    const initialUrl = this.router.url;
    this.showMainContent.set(initialUrl === '/' || initialUrl === '');
    
    // Play engine sound when the page loads
    this.audioService.playEngineSound();
  }

  ngAfterViewInit() {
    this.setupCubeInteraction();
    this.setupScrollAnimations();
    this.setupCounterAnimations();
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.handleScroll.bind(this));
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe all sections and animated elements
    const elementsToAnimate = document.querySelectorAll(
      'section, .feature-card, .stat-item, .spec-row'
    );
    elementsToAnimate.forEach((el) => observer.observe(el));
  }

  handleScroll() {
    this.isScrolled.set(window.scrollY > 50);
  }

  toggleMenu() {
    this.menuOpen.update((val) => !val);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      this.closeMenu();
    }
  }

  setupCubeImages() {
    // Images will be set via CSS background-image
  }

  setupCubeInteraction() {
    if (!this.cubeElement) return;

    const cube = this.cubeElement.nativeElement;

    // Mouse events
    cube.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.startX = e.clientX;
      cube.style.cursor = 'grabbing';
    });

    document.addEventListener('mouseup', () => {
      this.isDragging = false;
      if (cube) cube.style.cursor = 'grab';
    });

    document.addEventListener('mousemove', (e) => {
      if (!this.isDragging || !cube) return;

      const deltaX = e.clientX - this.startX;
      this.rotateY += deltaX * 0.5;

      cube.style.transform = `rotateY(${this.rotateY}deg) rotateX(10deg)`;
      this.startX = e.clientX;
    });

    // Touch events for mobile
    let touchStartX = 0;

    cube.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      this.isDragging = true;
    });

    cube.addEventListener('touchend', () => {
      this.isDragging = false;
    });

    cube.addEventListener('touchmove', (e) => {
      if (!this.isDragging) return;
      e.preventDefault();

      const deltaX = e.touches[0].clientX - touchStartX;
      this.rotateY += deltaX * 0.5;

      cube.style.transform = `rotateY(${this.rotateY}deg) rotateX(10deg)`;
      touchStartX = e.touches[0].clientX;
    });

    // Auto-rotate when not dragging
    let autoRotateInterval = setInterval(() => {
      if (!this.isDragging && cube) {
        this.rotateY += 0.5;
        cube.style.transform = `rotateY(${this.rotateY}deg) rotateX(10deg)`;
      }
    }, 50);
  }

  openFeatureModal(feature: any) {
    this.selectedFeature.set(feature);
    this.isModalOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.selectedFeature.set(null);
    document.body.style.overflow = '';
  }

  getSpecPointPosition(index: number): { x: number; y: number } {
    // Position spec points around the car image
    const positions = [
      { x: 15, y: 30 }, // Engine
      { x: 25, y: 20 }, // Power
      { x: 35, y: 25 }, // Torque
      { x: 50, y: 15 }, // 0-100
      { x: 65, y: 20 }, // Top Speed
      { x: 75, y: 30 }, // Transmission
      { x: 20, y: 60 }, // Drivetrain
      { x: 50, y: 70 }, // Fuel Consumption
      { x: 70, y: 65 }, // CO2 Emissions
      { x: 40, y: 80 }, // Weight
    ];
    return positions[index] || { x: 50, y: 50 };
  }

  setupCounterAnimations() {
    const observerOptions = {
      threshold: 0.5,
      rootMargin: '0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const statItems = entry.target.querySelectorAll('.stat-item');
          statItems.forEach((item, index) => {
            setTimeout(() => {
              const numberElement = item.querySelector('.stat-number') as HTMLElement;
              const target = numberElement?.getAttribute('data-target');
              if (target && numberElement) {
                this.animateCounter(numberElement, parseFloat(target), index === 2);
              }
            }, index * 200);
          });
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const aboutSection = document.querySelector('.about-section');
    if (aboutSection) {
      observer.observe(aboutSection);
    }
  }

  animateCounter(element: HTMLElement, target: number, isDecimal: boolean = false) {
    const duration = 2000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      if (isDecimal) {
        element.textContent = current.toFixed(1);
      } else {
        element.textContent = Math.floor(current).toString();
      }
    }, 16);
  }

  onSubmit() {
    alert('Thank you for your message!');
  }
}
