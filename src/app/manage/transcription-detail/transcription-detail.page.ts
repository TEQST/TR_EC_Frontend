/* eslint-disable guard-for-in */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ManageFolderService } from 'src/app/services/manage-folder.service';

interface WordInfo {
  word: string;
  start: number;
  end: number;
}

interface TranscriptionDetail {
  id: number;
  shared_folder: number;
  title: string;
  content: WordInfo[][];
}

@Component({
  selector: 'app-transcription-detail',
  templateUrl: './transcription-detail.page.html',
  styleUrls: ['./transcription-detail.page.scss'],
})

export class TranscriptionDetailPage implements OnInit {

  public isPlaying: boolean;
  public isLoaded: boolean;

  public paragraphs: string[];

  private audio;
  private transcriptionId: string;

  constructor(
    private manageFolderService: ManageFolderService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.paragraphs = new Array();
    this.isLoaded = false;
    this.isPlaying = false;
    this.transcriptionId = this.route.snapshot.paramMap.get('transcriptionId');
    this.loadAudio();
    this.loadDetail();
  }

  async loadAudio() {
    this.audio = new Audio();
    this.audio.addEventListener('canplaythrough', () => { this.setupAudioButtons(); });
    this.audio.addEventListener('progress', () => { console.log('made progress'); });
    const audioBlob = await this.manageFolderService.getTranscriptionAudio(this.transcriptionId);
    this.audio.src = URL.createObjectURL(audioBlob);
    this.audio.load();
  }

  loadDetail() {
    this.manageFolderService.getTranscriptionDetail(this.transcriptionId).subscribe((data: TranscriptionDetail) => {
      for (const paragraphInfo of data.content) {
        let paragraph = '';
        for (const wordInfo of paragraphInfo) {
          paragraph += wordInfo.word + ' ';
        }
        this.paragraphs.push(paragraph);
      }
    }, (err) => {
      console.log('an error occurred');
    });
  }

  setupAudioButtons() {
    console.log('loaded');
    this.isLoaded = true;
  }

  toggle() {
    if (this.isPlaying) {
      this.audio.pause();
    } else {
      this.audio.play();
    }
    this.isPlaying = !this.isPlaying;
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.isPlaying = false;
  }

  ionViewWillLeave() {
    URL.revokeObjectURL(this.audio.src);  // to avooid memory leak
  }
}
