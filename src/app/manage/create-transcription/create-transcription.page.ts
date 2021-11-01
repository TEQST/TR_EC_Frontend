import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-create-transcription',
  templateUrl: './create-transcription.page.html',
  styleUrls: ['./create-transcription.page.scss'],
})
export class CreateTranscriptionPage implements OnInit {

  public formValid: boolean;
  public titleValid: boolean;
  public srcFileSelected: boolean;
  public trFileSelected: boolean;
  public createTranscriptionForm: FormGroup;

  /* allow any characters except \,/,:,*,<,>,| and whitespaces
     but not filenames starting with the character . */
  private validatorPattern = new RegExp('^(?!\\.)[^\\\\\/:\\*"<>\\| ]+$');
  private srcFile: File;
  private trFile: File;
  private existingTranscriptionNames: string[];

  constructor(
    private formBuilder: FormBuilder,
    private viewCtrl: ModalController,
  ) {
    this.createTranscriptionForm = this.formBuilder.group({
      title: ['', (control) => this.transcriptionTitleValidator(control)]
    });
    this.createTranscriptionForm.valueChanges.subscribe(() => {
      this.updateFormValidity();
    });
  }

  ngOnInit() {
  }

  dismiss() {
    // close the modal without passing data
    this.viewCtrl.dismiss();
  }

  createTranscription(formData) {
    // close the modal and pass its data back to the view
    const returnData = {
      title: formData.title,
      srcfile: this.srcFile,
      trfile: this.trFile};
    this.viewCtrl.dismiss(returnData);
  }

  setSrcFile(file) {
    this.srcFile = file;
    this.srcFileSelected = true;
    this.updateFormValidity();
  }

  setTrFile(file) {
    this.trFile = file;
    this.trFileSelected = true;
    this.updateFormValidity();
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

  updateFormValidity() {
    this.formValid = this.titleValid &&
                     this.srcFileSelected &&
                     this.trFileSelected;
  }

}
