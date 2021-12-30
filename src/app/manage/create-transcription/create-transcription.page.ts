import { renderFlagCheckIfStmt } from '@angular/compiler/src/render3/view/template';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ManageFolderService } from 'src/app/services/manage-folder.service';

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
  public acceptedTypes = '';

  /* allow any characters except \,/,:,*,<,>,| and whitespaces
     but not filenames starting with the character . */
  private validatorPattern = new RegExp('^(?!\\.)[^\\\\\/:\\*"<>\\| ]+$');
  private srcFile: File;
  private trFile: File;
  private zipFile: File;
  private existingTranscriptionNames: string[];

  constructor(
    private formBuilder: FormBuilder,
    private viewCtrl: ModalController,
    private manageFolderService: ManageFolderService
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
      console.log(res);
      this.formats = res.formats;
      //TODO: dynamically update once api includes file types
      this.acceptedTypes = '.json, .vtt';
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
    // close the modal and pass its data back to the view
    const returnData = {
      single: true,
      title: formData.title,
      srcfile: this.srcFile,
      trfile: this.trFile,
      format: formData.format};
    this.viewCtrl.dismiss(returnData);
  }

  createTranscriptionMulti(formData) {
    const returnData = {
      single: false,
      zfile: this.zipFile,
      format: formData.format
    };
    this.viewCtrl.dismiss(returnData);
  }

  setSrcFile(file) {
    this.srcFile = file;
    this.srcFileSelected = true;
    this.updateFormValiditySingle();
  }

  setTrFile(file) {
    this.trFile = file;
    this.trFileSelected = true;
    this.updateFormValiditySingle();
  }

  setZipFile(file) {
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

}
