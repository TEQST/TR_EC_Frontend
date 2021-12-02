import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonNav, NavParams, ModalController } from '@ionic/angular';
import { FolderStats } from 'src/app/interfaces/folder-stats';
import { StatisticsService } from 'src/app/services/statistics.service';

@Component({
  selector: 'app-editor-list',
  templateUrl: './editor-list.page.html',
  styleUrls: ['./editor-list.page.scss'],
})
export class EditorListPage implements OnInit {

  @ViewChild('content', {read: ElementRef}) contentElem: ElementRef;

  public navComponent: IonNav;
  public folderId: number;
  public folderName: string;
  public folderStats: FolderStats;

  constructor(public navParams: NavParams,
    private viewCtrl: ModalController,
    private statsServices: StatisticsService) {

    this.navComponent = navParams.get('navComponent');
    this.folderId = navParams.get('folderId');
    this.folderName = navParams.get('folderName');

    this.statsServices.getSharedFolderStats(this.folderId)
    .subscribe((folderStats) => {
      console.log(folderStats);
      // this.addCompletedCountToSpeakers(folderStats);
      this.folderStats = folderStats;
      this.contentElem.nativeElement.classList.add('loaded');
    });
  }


  ngOnInit() {
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
