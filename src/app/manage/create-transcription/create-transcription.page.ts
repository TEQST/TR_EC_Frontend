import { HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { catchError, share } from 'rxjs/operators';
import { renderFlagCheckIfStmt } from '@angular/compiler/src/render3/view/template';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { upload, Upload } from 'ngx-operators';
import { Observable } from 'rxjs';
import { ManageFolderService } from 'src/app/services/manage-folder.service';
import { AlertManagerService } from 'src/app/services/alert-manager.service';

@Component({
  selector: 'app-create-transcription',
  templateUrl: './create-transcription.page.html',
  styleUrls: ['./create-transcription.page.scss'],
})
export class CreateTranscriptionPage implements OnInit {

  public formValidSingle: boolean;
  public formValidMulti: boolean;
  public titleValid: boolean;
  public formatValidSingle: boolean;
  public formatValidMulti: boolean;
  public srcFileSelected: boolean;
  public trFileSelected: boolean;
  public zipFileSelected: boolean;
  public createTranscriptionFormSingle: FormGroup;
  public createTranscriptionFormMulti: FormGroup;
  public singleUpload = true;
  public formats = new Array();
  public upload$: Observable<Upload>;



  /* allow any characters except \,/,:,*,<,>,| and whitespaces
     but not filenames starting with the character . */
  private validatorPattern = new RegExp('^(?!\\.)[^\\\\\/:\\*"<>\\| ]+$');
  private srcFile: File;
  private trFile: File;
  private zipFile: File;
  private existingTranscriptionNames: string[];
  private currentFolder: number;

  constructor(
    private formBuilder: FormBuilder,
    private viewCtrl: ModalController,
    private manageFolderService: ManageFolderService,
    private alertManager: AlertManagerService
  ) {
    this.createTranscriptionFormSingle = this.formBuilder.group({
      title: ['', (control) => this.transcriptionTitleValidator(control)],
      format: ['', (control) => this.transcriptionFormatValidatorSingle(control)]
    });
    this.createTranscriptionFormSingle.valueChanges.subscribe(() => {
      this.updateFormValiditySingle();
    });
    this.createTranscriptionFormMulti = this.formBuilder.group({
      format: ['', (control) => this.transcriptionFormatValidatorMulti(control)]
    });
    this.createTranscriptionFormMulti.valueChanges.subscribe(() => {
      this.updateFormValidityMulti();
    });
  }

  ngOnInit() {
    this.manageFolderService.getFormats().subscribe((res: {'formats': string[]}) => {
      this.formats = res.formats;
    }, (err) => {
      console.log('couldnt get formats');
    });
  }

  dismiss() {
    // close the modal without passing data
    this.viewCtrl.dismiss();
  }

  switchToMulti() {
    if (this.singleUpload) {
      this.singleUpload = false;
    }
  }

  switchToSingle() {
    if (!this.singleUpload) {
      this.singleUpload = true;
    }
  }



  createTranscriptionSingle(formData) {

    const returnData = {
      shared_folder: this.currentFolder,
      title: formData.title,
      srcfile: this.srcFile,
      trfile: this.trFile,
      format: formData.format};

    //start the upload an get progress data
    this.upload$ = this.manageFolderService.createTranscriptionSingle(returnData)
    .pipe(
      upload(),
      share());
    this.upload$.subscribe((status) => {
      if(status.state === 'DONE') {
        this.viewCtrl.dismiss();
      }}, (err) => this.handleError(err));
  }

  createTranscriptionMulti(formData) {

    const returnData = {
      shared_folder: this.currentFolder,
      zfile: this.zipFile,
      format: formData.format
    };

    //start the upload an get progress data
    this.upload$ = this.manageFolderService.createTranscriptionMulti(returnData)
    .pipe(
      upload(),
      share());
    this.upload$.subscribe((status) => {
      if(status.state === 'DONE') {
        this.viewCtrl.dismiss();
      }}, (err) => this.handleError(err));
  }

  setSrcFile(target) {
    const file = (target as HTMLInputElement).files.item(0);
    this.srcFile = file;
    this.srcFileSelected = true;
    this.updateFormValiditySingle();
  }

  setTrFile(target) {
    const file = (target as HTMLInputElement).files.item(0);
    this.trFile = file;
    this.trFileSelected = true;
    this.updateFormValiditySingle();
  }

  setZipFile(target) {
    const file = (target as HTMLInputElement).files.item(0);
    this.zipFile = file;
    this.zipFileSelected = true;
    this.updateFormValidityMulti();
  }

  transcriptionTitleValidator(control: FormControl) {
    const title = control.value;
    this.titleValid = (this.validatorPattern.test(title) &&
                       title.trim() !== '' && // title not empty
                      !this.existingTranscriptionNames.includes(title));

    if (!this.titleValid) {
      return {textTitle: true};
    }
    return null;
  }

  transcriptionFormatValidatorSingle(control: FormControl) {
    const format = control.value;
    this.formatValidSingle = this.formats.includes(format);
    if (!this.formatValidSingle) {
      return {textFormat: true};
    }
    return null;
  }

  transcriptionFormatValidatorMulti(control: FormControl) {
    const format = control.value;
    this.formatValidMulti = this.formats.includes(format);
    if (!this.formatValidMulti) {
      return {textFormat: true};
    }
    return null;
  }

  updateFormValiditySingle() {
    this.formValidSingle = this.titleValid &&
                           this.srcFileSelected &&
                           this.trFileSelected &&
                           this.formatValidSingle;
  }

  updateFormValidityMulti() {
    this.formValidMulti = this.zipFileSelected &&
                          this.formatValidMulti;
  }

  private handleError(err) {
    this.alertManager.showErrorAlertNoRedirection(
      err.status, err.statusText
    );
  }
}
