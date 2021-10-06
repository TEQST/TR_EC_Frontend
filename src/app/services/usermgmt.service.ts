
import {Injectable, Injector} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NavController} from '@ionic/angular';
import {BehaviorSubject, Observable} from 'rxjs';

import {User} from './../interfaces/user';
import {AlertManagerService} from './alert-manager.service';
import {Constants} from '../constants';

@Injectable({
  providedIn: 'root',
})


export class UsermgmtService {

  SERVER_URL = Constants.SERVER_URL;

  public isPublisher = new BehaviorSubject<boolean>(undefined);
  // tslint:disable: no-string-literal

  constructor(public http: HttpClient,
              public navCtrl: NavController,
              private alertService: AlertManagerService,
              private injector: Injector) {}

  // check if username is available
  checkUsername(username: string): Observable<object> {
    const url = this.SERVER_URL + '/api/users/checkname/?username=' + username;
    return this.http.get(url);
  }

  // deletes Authtoken and clears localStorage
  deleteStoredUserData(): void {
    localStorage.clear();
  }

  storeUserData(userData: User): void {
    localStorage.setItem(
        'isPublisher',
        JSON.stringify(this.isPublisher.getValue()));
    localStorage.setItem('userId', userData.id.toString());
    localStorage.setItem('username', userData.username);
  }
  // returns boolean if a user is a publisher
  getIsPublisher(): Observable<boolean> {
    this.isPublisher.next(JSON.parse(localStorage.getItem('isPublisher')));
    return this.isPublisher.asObservable();
  }
}
