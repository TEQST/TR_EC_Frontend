import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertManagerService } from '../services/alert-manager.service';
import { LoaderService } from '../services/loader.service';
import { ManageFolderService } from '../services/manage-folder.service';
import { ManageFolderUiService } from './manage-folder-ui.service';
import { ManageTranscriptionUiService } from './manage-transcription-ui.service';
import { Folder } from './manage.folder';
import { Transcription } from './manage.transcription';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.page.html',
  styleUrls: ['./manage.page.scss'],
})
export class ManagePage implements OnInit {

  @ViewChild('transcriptionList', { read: ElementRef }) transcriptionListElem: ElementRef
  @ViewChild('folderList', { read: ElementRef }) folderListElem: ElementRef
  // There's another one here, but it looks like it's not used

  public currentFolder: Folder
  public subfolders: Folder[]
  public transcriptions: Transcription[]
  public isLoading = false;
  public username: string

  constructor(
    private manageFolderService: ManageFolderService,
    private manageFolderUIService: ManageFolderUiService,
    private manageTranscriptionUIService: ManageTranscriptionUiService,
    private router: Router,
    private route: ActivatedRoute,
    private alertManager: AlertManagerService,
    private loaderService: LoaderService
  ) {

    Folder.setServiceProvider(manageFolderService);
    Transcription.setServiceProvider(manageFolderService);

    this.username = localStorage.getItem('username');

    const routeParams = this.router.getCurrentNavigation().extras.state;
    if (typeof routeParams !== 'undefined' && 'folder' in routeParams) {
      this.currentFolder = routeParams.folder;
    } else {
      this.currentFolder = new Folder(null, '', false);
    }

    this.subfolders = [];
    this.transcriptions = [];
    this.loaderService.getIsLoading().subscribe((isLoading) => this.isLoading = isLoading);
  }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.subfolders = [];
    this.transcriptions = [];
    this.folderListElem.nativeElement.classList.remove('loaded');
    this.transcriptionListElem.nativeElement.classList.remove('loaded');

    const folderId = this.route.snapshot.paramMap.get('folderId');
    if (folderId == null) {
      this.currentFolder.id = '';
      this.currentFolder.name = '/';
    } else {
      this.currentFolder.id = folderId;
    }
    this.getFolderInfo();
  }

  async getFolderInfo() {
    this.currentFolder.getSubfolderList().subscribe(async (data) => {
      if (Array.isArray(data)) { // toplevel
        this.subfolders = this.manageFolderUIService.initSubfolderList(data);
        this.folderListElem.nativeElement.classList.add('loaded');
      } else { // not toplevel
        this.currentFolder.name = data['name'];
        this.currentFolder.is_sharedfolder = data['is_sharedfolder'];
        const subfolderInfo = data['subfolder'];

        if (this.currentFolder.is_sharedfolder) {
          await this.manageTranscriptionUIService.initTranscriptionList(this.currentFolder, (transcriptions) => {
            this.transcriptions = transcriptions;
            this.transcriptionListElem.nativeElement.classList.add('loaded');
          });
        } else {
          this.subfolders = this.manageFolderUIService.initSubfolderList(subfolderInfo);
          this.folderListElem.nativeElement.classList.add('loaded');
        }
      }
    }, (err) => {
      this.alertManager.showErrorAlert(
        err.status, err.statusText, '/manage'
      );
    });
  }

}
