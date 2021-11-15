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

  @ViewChild('paragraphsList', {read: ElementRef}) paragraphsElem: ElementRef;

  public isLoaded: boolean;
  public isPlaying: boolean;
  public paragraphs: WordInfo[][];
  public title = 'Editor';
  public audioStartTime: number;
  public audioEndTime: number;
  public audioDuration: number;
  public currentAudioTime: number;
  public justSplitted = false;

  private wordIndex = 0;
  private paragraphIndex = 0;

  private correctionId: string = null;
  private textId: string;
  private highlightingInterval = null;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private http: HttpClient,
              private mediaService: MediaService,
              public loaderService: LoaderService) { }

ngOnInit() {
    this.textId = this.route.snapshot.paramMap.get('textId');
    this.isLoaded = false;
    this.isPlaying = false;

    const routeParams = this.router.getCurrentNavigation().extras.state;
    if (typeof routeParams !== 'undefined' && 'correctionId' in routeParams) {
      this.correctionId = routeParams.correctionId;
      this.loadCorrection();
    }else {
      const url = Constants.SERVER_URL + `/api/edt/transcripts/${this.textId}/`;
      this.http.get(url).subscribe((data: any) => {
        this.title = data.title;
        if (Number.isInteger(data.correction)) {
          this.correctionId = data.correction as string;
        }
        this.loadCorrection();
      }, (err) => { console.log('couldnt get correction id'); });

    }
    this.mediaService.isLoaded.subscribe(isLoaded => {
      this.isLoaded = isLoaded;
    });
    this.mediaService.isPlaying.subscribe(isPlaying => {
      this.isPlaying = isPlaying;

      if (this.isPlaying) {
        if (!this.highlightingInterval) {
          this.highlightingInterval = setInterval(() => { this.updateWordHighlight(); }, 250);
        }
      }else {
        if (this.highlightingInterval) {
          clearInterval(this.highlightingInterval);
          this.highlightingInterval = null;
        }
      }
    });

    this.mediaService.currentTime.subscribe(currentTime => {
      this.currentAudioTime = currentTime;
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
      this.paragraphs = data.content;
      const lastParagraph = this.paragraphs[this.paragraphs.length - 1];
      this.audioStartTime = this.paragraphs[0][0].start;
      this.audioEndTime = lastParagraph[lastParagraph.length - 1].end;
      this.audioDuration = this.audioEndTime - this.audioStartTime;
    }, (err) => {
      console.log(err);
      console.log('an error occurred');
    });
  }

  saveTranscript() {
    const url = Constants.SERVER_URL + `/api/edt/corrections/${this.correctionId}/`;

    this.http.put(url, {trfile_json: this.paragraphs}).subscribe((data) => {}, (err) => {
      alert('could not save!');
    });
  }

  mediaStop() {
    this.mediaService.stop();
  }

  mediaPause() {
    this.mediaService.pause();
  }

  mediaToggle() {
    this.mediaService.toggle();
  }

  mediaPlay() {
    this.mediaService.play();
  }

  setAudioTimeByParagraphIndex(pIndex) {
    this.paragraphIndex = pIndex;
    this.wordIndex = 0;

    const paragraph = this.paragraphs[pIndex];
    this.mediaService.setTime(paragraph[0].start);
  }

  ionViewWillLeave() {
    this.mediaService.cleanup();
  }

  interpolate(wordList, start, end) {
    const duration = end - start;
    const numOfChars = wordList.join('').length;
    let currChar = 0;
    const newWords: WordInfo[] = [];

    for (const word of wordList) {
      const wordStart = start + currChar / numOfChars * duration;
      const wordEnd = start + (currChar+word.length) / numOfChars * duration;
      const wordInfo = {word,
                       start: this.round2(wordStart),
                       end: this.round2(wordEnd)};
      newWords.push(wordInfo);
      currChar += word.length;
    }
    return newWords;
  }

  paragraphTextToWordList(text) {
    return text.replace(/ +(?= )/g,'').trim().split(' ');
  }

  updateTimestamps(ev, pIndex) {
    // Chrome fires the focusout event when a paragraph is splitted,
    // which causes a bug. this.justSplitted serves to prevent updateTimestamps
    // from being called upon a paragraph split.
    if (this.justSplitted) { return; }
    // Alternative way to get target:
    //const item = this.paragraphsElem.nativeElement.childNodes[pIndex];
    //const target = item.querySelector('.paragraph-wrapper');
    const target = ev.target;
    let content = '';
    for (const elem of target.children) {
      content += elem.innerHTML;
    }
    const text = content.replace(/&nbsp;/gi, ' ');
    if (this.deleteParagraphIfEmpty(text, pIndex)) {
      return;
    }
    const wordList = this.paragraphTextToWordList(text);
    const paragraph = this.paragraphs[pIndex];
    const start = paragraph[0].start;
    const end = paragraph[paragraph.length-1].end;

    this.paragraphs[pIndex] = this.interpolate(wordList, start, end);
  }

  splitParagraphIfEnter(ev, pIndex) {
    if (ev.key !== 'Enter') {
      return;
    }
    ev.preventDefault();
    this.justSplitted = true;
    // find where enter was pressed
    const caretIndex = this.getCaretIndex(ev.target);
    const paragraph = this.paragraphs[pIndex];
    // get paragraph content as word list
    let content = '';
    for (const elem of ev.target.children) {
      content += elem.innerHTML;
    }
    content = content.replace(/&nbsp;/gi, ' ');
    if (this.deleteParagraphIfEmpty(content, pIndex)) {
      return;
    }
    // split content
    const content1 = content.slice(0, caretIndex);
    const content2 = content.slice(caretIndex, content.length);
    const startTime = paragraph[0].start;
    const endTime = paragraph[paragraph.length - 1].end;
    const splitTime = startTime + (content1.length / content.length) * (endTime - startTime);

    // interpolate both new paragraphs
    const wordList1 = this.paragraphTextToWordList(content1);
    const wordList2 = this.paragraphTextToWordList(content2);
    const wordObjList1 = this.interpolate(wordList1, startTime, splitTime);
    const wordObjList2 = this.interpolate(wordList2, splitTime, endTime);

    // replace paragraphs
    this.paragraphs.splice(pIndex, 1, wordObjList1, wordObjList2);
    return false;
  }

  mergeParagraphUp(pIndex) {
    this.mediaService.pause();
    // get both paragraphs
    const p1 = this.paragraphs[pIndex-1];
    const p2 = this.paragraphs[pIndex];
    // merge
    const newParagraph = p1.concat(p2);
    // replace in this.paragraphs
    this.paragraphs.splice(pIndex - 1, 2, newParagraph);
    this.paragraphIndex--;
    this.wordIndex += p1.length;


  }

  getCaretIndex(element) {
    let position = 0;
    const selection = window.getSelection();
    if (selection.rangeCount !== 0) {
      const range = window.getSelection().getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      position = preCaretRange.toString().length;
    }
    return position;
  }

  round2(n) {
    return Math.round(n*100) / 100;
  }

  deleteParagraphIfEmpty(content, pIndex) {
    if (content.trim() === '') {
      this.paragraphs.splice(pIndex, 1);
      return true;
    }
    return false;
  }


  updateWordHighlight() {
    const time = this.mediaService.getTime();

    const updated = this.updateNextParagraphAndWordIndex(time);
    if (!updated) {
      return;
    }


    const paragraphElem = this.paragraphsElem.nativeElement.childNodes[this.paragraphIndex];
    const wordElems = paragraphElem.querySelectorAll('.paragraph-wrapper span.word');
    const wordElem = wordElems[this.wordIndex];
    // if (wordElem.classList.contains('highlight')) {
    //   wordElem.classList.remove('highlight');
    // }

    // what if word longer than animation?
    if (!wordElem.classList.contains('highlight')) {
      wordElem.classList.add('highlight');
      wordElem.addEventListener('animationend', () => {
        wordElem.classList.remove('highlight');
      });
    }
  }

  updateNextParagraphAndWordIndex(time) {
    let wIndex = this.wordIndex;
    for (let pIndex = this.paragraphIndex; pIndex < this.paragraphs.length; pIndex++) {
      const paragraph = this.paragraphs[pIndex];
      for (; wIndex < paragraph.length; wIndex++) {
        const word = paragraph[wIndex];
        if (time >= word.start && time < word.end) {
          this.paragraphIndex = pIndex;
          this.wordIndex = wIndex;
          return true;
        }
      }
      wIndex = 0;
    }
    return false;
  }



  // getElementIndex (element) {
  //   return Array.from(element.parentNode.children).indexOf(element);
  // }

}
