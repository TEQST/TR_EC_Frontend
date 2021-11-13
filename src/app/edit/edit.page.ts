import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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

  @ViewChild('paragraphs', {read: ElementRef}) paragraphsElem: ElementRef;

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
      //this.correctionId="3"
      //this.loadCorrection();
      // TODO: load correction id from backend
      // ... callback: loadCorrection()

      const url = Constants.SERVER_URL + `/api/edt/transcripts/${this.textId}/`;
      this.http.get(url).subscribe((data: any) => {
        if (Number.isInteger(data.correction)) {
          this.correctionId = data.correction as string;
        }
        this.loadCorrection();
      }, (err) => { console.log('couldnt get correction id'); });

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
      // renderParagraphs();
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

  // renderParagraphs() {
  //   let innerHTML = ''
  //   for (let paragraph of this.paragraphs) {
  //     for (let i=0; i<paragraph.length; i++) {
  //       word
  //     }
  //     let paragraph = this.paragraphs[i];
  //     for
  //   }
  // }

  updateTimestamps(ev) {
    const target = ev.target;
    let content = '';
    for (const elem of target.children) {
      content += elem.innerHTML;
    }

    const wordList = content.replace(/&nbsp;/gi, ' ').split(' ');
    const index = target.dataset.index;
    const paragraph = this.paragraphs[index];
    const start = paragraph[0].start;
    const end = paragraph[paragraph.length-1].end;
    const duration = end - start;
    const numOfChars = wordList.join('').length;
    let currChar = 0;
    const newWords: WordInfo[] = [];
    console.log(this.paragraphs[index]);

    for (const word of wordList) {
      const wordStart = start + currChar / numOfChars * duration;
      const wordEnd = start + (currChar+word.length) / numOfChars * duration;
      const wordInfo = {word,
                       start: wordStart,
                       end: wordEnd};
      newWords.push(wordInfo);
      currChar += word.length;
    }

    this.paragraphs[index] = newWords;
    console.log(this.paragraphs[index]);
  }



  // getElementIndex (element) {
  //   return Array.from(element.parentNode.children).indexOf(element);
  // }

}
