import {Component} from '@angular/core';
import {NavController, PopoverController} from '@ionic/angular';
import {Constants} from '../constants';
import {BaseComponent} from '../base-component';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage extends BaseComponent {

  SERVER_URL = Constants.SERVER_URL;

  constructor(
    public navCtrl: NavController,
    public popoverController: PopoverController,
    public loaderService: LoaderService) {
    super(loaderService);
  }

  redirect(): void {
    window.open(this.SERVER_URL + '/admin');
  }

  redirectToHelp(): void {
    window.open(this.SERVER_URL + '/documentation');
  }

}
