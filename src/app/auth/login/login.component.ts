import {Component} from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  constructor() {}

  // redirect to cas auth server
  performLogin(): void {
    const url = 'https://teqst-beta.dataforlearningmachines.com/api/login/';

    document.location.href = url;
  }
}
