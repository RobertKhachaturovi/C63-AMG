import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-overlay" [class.hidden]="!isLoading">
      <div class="animation-container">
        <div class="road"></div>
        <img
          src="https://platform.cstatic-images.com/medium/in/v2/stock_photos/a552cc70-131c-4cb9-9abd-e6cb0f677a5c/72f294e3-b9c7-4e17-985e-842a512a7bc3.png"
          alt="Mercedes C63 AMG"
          class="car"
        />
      </div>
    </div>
  `,
  styles: [
    `
      .loading-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);

        display: flex;
        justify-content: center;
        align-items: center;

        z-index: 10000;

        opacity: 1;
        visibility: visible;
        transition: opacity 0.6s ease, visibility 0.6s ease;
      }

      .loading-overlay.hidden {
        opacity: 0;
        visibility: hidden;
      }

      .animation-container {
        position: relative;
        width: 80%;
        max-width: 800px;
        height: 200px;
      }

      .car {
        position: absolute;
        bottom: 20px;
        right: -150px;
        width: 300px;
        animation: drive 4s forwards;
      }

      .road {
        position: absolute;
        bottom: 50px;
        width: 100%;
        height: 8px;
        background-color: #333;
        border-radius: 4px;
        animation: fadeRoad 3s forwards;
      }

      @keyframes drive {
        0% {
          transform: translateX(0);
        }
        20% {
          transform: translateX(-20vw);
        }
        100% {
          transform: translateX(-150vw);
          opacity: 0.5;
        }
      }

      @keyframes fadeRoad {
        0% {
          opacity: 1;
        }
        80% {
          opacity: 1;
        }
        100% {
          opacity: 0;
        }
      }
    `,
  ],
})
export class LoadingComponent implements OnInit {
  isLoading = true;

  ngOnInit() {
    // ზუსტად 2 წამში დაიწყოს ფონზე გაქრობა
    setTimeout(() => {
      this.isLoading = false;
    }, 1000); // 👈 აქ
  }
}
