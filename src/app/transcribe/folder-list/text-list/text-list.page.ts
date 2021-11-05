import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseComponent } from 'src/app/base-component';
import { SharedFolder } from 'src/app/interfaces/shared-folder';
import { LoaderService } from 'src/app/services/loader.service';
import { TranscribeTabNavService } from 'src/app/services/transcribe-tab-nav.service';

@Component({
  selector: 'app-text-list',
  templateUrl: './text-list.page.html',
  styleUrls: ['./text-list.page.scss'],
})
export class TextListPage extends BaseComponent implements OnInit {

  @ViewChild('textList', {read: ElementRef}) textListElem: ElementRef;

  public publisherId: string;
  public folderId: string;
  public texts: any;
  folderName: any;
  public sharedFolderData: SharedFolder;

  constructor(private navService: TranscribeTabNavService,
              private router: Router,
              private route: ActivatedRoute,
              public loaderService: LoaderService) {

    super(loaderService);

    const routeParams = this.router.getCurrentNavigation().extras.state;
    if (typeof routeParams !== 'undefined' && 'folderName' in routeParams) {
      this.folderName = routeParams.folderName;
    }
    this.publisherId = '';
    this.texts = [];
    this.navService.sharedTextsList.subscribe((data) => {
      this.sharedFolderData = data;
      this.folderName = data.name;
      this.texts = data.transcripts;
      this.textListElem.nativeElement.classList.add('loaded');
    });
    // clear contents when data is being refreshed
    this.navService.requestMade.subscribe(() => {
      this.texts = [];
      this.textListElem.nativeElement.classList.remove('loaded');
    });
  }

  ngOnInit(): void {
    this.publisherId = this.route.snapshot.paramMap.get('publisherId');
    this.folderId = this.route.snapshot.paramMap.get('folderId');
  }

  async ionViewWillEnter(): Promise<void> {
    this.navService.loadContentsOfSharedFolder(this.folderId);
  }

}
