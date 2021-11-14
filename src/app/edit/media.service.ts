import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ManageFolderService } from '../services/manage-folder.service';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  public isPlaying = new BehaviorSubject<boolean>(false);
  public isLoaded  = new BehaviorSubject<boolean>(false);
  public currentTime  = new BehaviorSubject<number>(0);

  private audio;

  constructor(
    private manageFolderService: ManageFolderService,
  ) { }

  ngOnInit() { }

  async loadAudio(transcriptionId: string) {
    this.audio = new Audio();
    this.audio.addEventListener('canplaythrough', () => { this.setupAudioButtons(); });
    const blob = await this.manageFolderService.getTranscriptionAudio(transcriptionId);
    console.log(blob.type);
    this.audio.src = URL.createObjectURL(blob);
    this.audio.load();
    this.audio.addEventListener('timeupdate', () => {
      this.currentTime.next(this.audio.currentTime);
    });
  }

  setupAudioButtons() {
    this.isLoaded.next(true);
  }

  toggle() {
    if (this.isPlaying.getValue()) {
      this.audio.pause();
    } else {
      this.audio.play();
    }
    this.isPlaying.next(!this.isPlaying.getValue());
  }

  pause() {
    if (this.isPlaying.getValue()) {
      this.audio.pause();
      this.isPlaying.next(false);
    }
  }

  play() {
    if (!this.isPlaying.getValue()) {
      this.audio.play()
      this.isPlaying.next(true);
    }
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.isPlaying.next(false);
  }

  setTime(time) {
    this.audio.currentTime = time;
    if (!this.isPlaying.getValue()) {
      this.audio.play();
      this.isPlaying.next(true);
    }
  }

  getTime() {
    return this.audio.currentTime;
  }

  getProgressAsPercent() {
    return this.audio.currentTime / this.audio.duration * 100;
  }

  cleanup() {
    URL.revokeObjectURL(this.audio.src);  // to avoid memory leak
  }
}
