import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Component, OnInit} from '@angular/core';
import {ModalController, NavController} from '@ionic/angular';
import {HttpClient} from '@angular/common/http';

import {ServicesAgreementComponent}
  from './services-agreement/services-agreement.component';
import {UsermgmtService} from 'src/app/services/usermgmt.service';
import {UsernameValidator} from './../../validators/username';
import {AuthenticationService} from 'src/app/services/authentication.service';
import {AlertManagerService} from 'src/app/services/alert-manager.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  public showPassword = false;
  public stepOneForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public http: HttpClient,
    public authenticationService: AuthenticationService,
    private alertService: AlertManagerService,
    private formBuilder: FormBuilder,
    private usernameValidator: UsernameValidator,
    private modalController: ModalController,
    private usermgmtService: UsermgmtService) {

    this.stepOneForm = this.formBuilder.group({
      username: ['',
        Validators.required,
        this.usernameValidator.checkUsername.bind(this.usernameValidator),
      ],
      password: ['', Validators.required],
      checkbox: [, Validators.requiredTrue],
    });
  }

  ngOnInit() {}

  get errorControl() {
    return this.stepOneForm.controls;
  }

  submit() {
    // combine the value object of the forms into one
    const registrationData = this.stepOneForm.value;
    // extract username and password into a new object
    const loginData = (({username, password}) => ({username, password}))(this.stepOneForm.value);

    this.authenticationService.register(registrationData).subscribe(() => {
      this.authenticationService.login(loginData);
    }, (error: any) => {
      this.alertService.showErrorAlertNoRedirection('Username already exists',
          `A user with that username already exists,
          please choose another username`);
    });
  }

  async presentServicesAgreement() {
    const popover = await this.modalController.create({
      component: ServicesAgreementComponent,
    });
    return await popover.present();
  }
}
