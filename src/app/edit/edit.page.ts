import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../services/loader.service';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../constants';
import { MediaService } from './media.service';

interface WordInfo {
  word: string;
  start: number;
  end: number;
}

interface TranscriptionDetail {
  id: number;
  transcription_title: string;
  content: WordInfo[][];
}

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {

  public isLoaded: boolean;
  public isPlaying: boolean;
  public paragraphs: WordInfo[][];

  private correctionId: string = null;
  private textId: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private http: HttpClient,
              private mediaService: MediaService,
              public loaderService: LoaderService) { }

ngOnInit() {
    this.textId = this.route.snapshot.paramMap.get('textId');

    const routeParams = this.router.getCurrentNavigation().extras.state;
    if (typeof routeParams !== 'undefined' && 'correctionId' in routeParams) {
      this.correctionId = routeParams.correctionId;
      this.loadCorrection();
    }else {
      // TODO: load correction id from backend
      // ... callback: loadCorrection()
    }
    this.mediaService.isLoaded.subscribe(isLoaded => {
      console.log(isLoaded);
      this.isLoaded = isLoaded;
    });
    this.mediaService.isPlaying.subscribe(isPlaying => {
      console.log(isPlaying);
      this.isPlaying = isPlaying;
    });
    this.mediaService.loadAudio(this.textId);
  }

  loadCorrection() {
    if (this.correctionId === null) {
      this.createCorrection();
    } else {
      this.loadDetail();
    }
  }

  createCorrection() {
    const url = Constants.SERVER_URL + `/api/edt/corrections/`;
    this.http.post(url, {transcription: this.textId}).subscribe((data: any) => {
      this.correctionId = data.id;
      this.loadDetail();
    }, (err) => {
      console.log('and error occurred');
    });
  }

  loadDetail() {
    const url = Constants.SERVER_URL + `/api/edt/corrections/${this.correctionId}/`;
    this.http.get(url).subscribe((data: TranscriptionDetail) => {
      console.log(data);
      this.paragraphs = data.content;
    }, (err) => {
      console.log(err);
      console.log('an error occurred');
    });
  }

  mediaStop() {
    this.mediaService.stop();
  }

  mediaToggle() {
    this.mediaService.toggle();
  }

  ionViewWillLeave() {
    this.mediaService.cleanup();
  }

}
