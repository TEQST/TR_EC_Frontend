import { Injectable } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { AlertManagerService } from '../services/alert-manager.service';
import { Folder } from './manage.folder';

@Injectable({
  providedIn: 'root'
})
export class ManageFolderUiService {

  constructor(
    private alertController: AlertController,
    private modalController: ModalController,
    private alertManager: AlertManagerService
  ) { }

  initSubfolderList(subfolderInfo) {
    const subfolders = [];
    for (const folderInfo of subfolderInfo) {
      const folder = new Folder(
        folderInfo.id, folderInfo.name, folderInfo.is_sharedfolder
      );
      subfolders.push(folder);
    }
    return subfolders;
  }
}
