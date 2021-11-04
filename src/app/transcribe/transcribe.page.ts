import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../base-component';
import { AlertManagerService } from '../services/alert-manager.service';
import { LoaderService } from '../services/loader.service';
import { TranscribeTabNavService } from '../services/transcribe-tab-nav.service';

@Component({
  selector: 'app-transcribe',
  templateUrl: './transcribe.page.html',
  styleUrls: ['./transcribe.page.scss'],
})
export class TranscribePage extends BaseComponent implements OnInit {

  @ViewChild('publisherList', {read: ElementRef}) publisherListElem: ElementRef;

  public publishers: any;

  constructor(private navService: TranscribeTabNavService,
              private alertManager: AlertManagerService,
              public loaderService: LoaderService) {
    super(loaderService);
  }

  ngOnInit() { }

  async ionViewWillEnter() {
    this.publishers = [];
    this.publisherListElem.nativeElement.classList.remove('loaded');

    this.navService.getPublisherList()
        .subscribe(
            (data) => {
              console.log(data)
              this.publishers = data;
              this.publisherListElem.nativeElement.classList.add('loaded');
            },
            (err) => this.alertManager
                .showErrorAlert(err.status, err.statusText),
        );
  }

}
