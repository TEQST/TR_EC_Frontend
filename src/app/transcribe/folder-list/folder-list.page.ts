import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseComponent } from 'src/app/base-component';
import { AlertManagerService } from 'src/app/services/alert-manager.service';
import { LoaderService } from 'src/app/services/loader.service';
import { TranscribeTabNavService } from 'src/app/services/transcribe-tab-nav.service';

@Component({
  selector: 'app-folder-list',
  templateUrl: './folder-list.page.html',
  styleUrls: ['./folder-list.page.scss'],
})
export class FolderListPage extends BaseComponent implements OnInit {

  @ViewChild('folderList', {read: ElementRef}) folderListElem: ElementRef;

  public publisherId: string;
  public folders: any;
  publisherName: any;

  constructor(private navService: TranscribeTabNavService,
              private router: Router,
              private route: ActivatedRoute,
              private alertManager: AlertManagerService,
              public loaderService: LoaderService) {

    super(loaderService);

    const routeParams = this.router.getCurrentNavigation().extras.state;
    if (typeof routeParams !== 'undefined' && 'publisherName' in routeParams) {
      this.publisherName = routeParams.publisherName;
    }
  }

  ngOnInit(): void {
    this.publisherId = this.route.snapshot.paramMap.get('publisherId');
  }

  async ionViewWillEnter(): Promise<void> {
    this.folders = [];
    this.folderListElem.nativeElement.classList.remove('loaded');
    this.navService.getInfoForPublisher(this.publisherId)
        .subscribe(
            (data) => {
              this.publisherName = data['username'];
              this.folders = data['freedfolders'];
              this.folderListElem.nativeElement.classList.add('loaded');
            },
            (err) => this.alertManager
                .showErrorAlert(err.status, err.statusText),
        );
  }

}
