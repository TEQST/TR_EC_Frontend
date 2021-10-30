import { Injectable } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { AlertManagerService } from '../services/alert-manager.service';
import { ManageFolderService } from '../services/manage-folder.service';
import { Transcription } from './manage.transcription';

@Injectable({
  providedIn: 'root'
})
export class ManageTranscriptionUiService {

  constructor(
    private manageFolderService: ManageFolderService,
    private alertController: AlertController,
    private modelController: ModalController,
    private alertManager: AlertManagerService
  ) { }

  async initTranscriptionList(currentFolder, callback) {
    this.manageFolderService.getTranscriptionListFor(currentFolder.id).subscribe((data) => {
      if (Array.isArray(data)) {
        const transcriptions = [];
        for (const transcriptionInfo of data) {
          const transcription = new Transcription(transcriptionInfo.id, transcriptionInfo.title);
          transcriptions.push(transcription);
        }
        callback(transcriptions);
      } else {
        this.alertManager.showErrorAlert(
          '',
          'received invalid data from server!'
        );
      }
    }, (err) => {
      this.alertManager.showErrorAlert(
        err.status,
        err.statusText,
        '/manage'
      );
    });
  }

  async openCreateTranscriptionModal() {
    // TODO
    // see TEQST for possible adequate parameters
  }

  async openDeleteTranscriptionAlert(transcription, successCallback) {
    const alert = await this.alertController.create({
      header: 'Attention!',
      message: `Do you really want to delete Transcription "${transcription.title}"?`,
      buttons: [
        'No',
        {
          text: 'Yes',
          handler: async () => {
            transcription.delete()
                .subscribe(
                    successCallback,
                    (err) => this.alertManager.showErrorAlertNoRedirection(
                        err.status,
                        err.statusText),
                );
          },
        },
      ],
    });
    await alert.present();
  }
}
