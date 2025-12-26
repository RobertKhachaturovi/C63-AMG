import { Injectable, OnDestroy } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService implements OnDestroy {
  private audio: HTMLAudioElement;

  constructor() {
    // High-quality C63 AMG engine sound
    this.audio = new Audio('https://www.sound-fishing.net/mp3/mercedes-c63-amg-engine-sound.mp3');
    this.audio.volume = 0.5; // Set volume to 50%
    this.audio.loop = true; // Loop the audio
  }

  playEngineSound() {
    this.audio.currentTime = 0; // Rewind to start
    this.audio.play().catch(error => {
      console.warn('Audio playback failed:', error);
      // Fallback to a different audio source if the first one fails
      this.audio.src = 'https://www.soundjay.com/mechanical/sounds/engine-starting-01.mp3';
      this.audio.play().catch(e => console.warn('Fallback audio also failed:', e));
    });

    // Stop after 5 seconds
    setTimeout(() => {
      this.audio.pause();
    }, 5000);
  }

  ngOnDestroy() {
    if (this.audio) {
      this.audio.pause();
      this.audio = null as any;
    }
  }
}
