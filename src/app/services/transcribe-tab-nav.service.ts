import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Constants } from '../constants';
import { SharedFolder } from '../interfaces/shared-folder';
import { AlertManagerService } from './alert-manager.service';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class TranscribeTabNavService {
  SERVER_URL = Constants.SERVER_URL;
  public sharedTextsList = new Subject<any>();
  public requestMade = new Subject<any>();

  constructor(
    private http: HttpClient,
    public authenticationService: AuthenticationService,
    private alertService: AlertManagerService) { }

  getPublisherList() {
    this.requestMade.next(true);
    const url = this.SERVER_URL + '/api/publishers/';
    return this.http.get(url);
  }

  getInfoForPublisher(publisherId: string) {
    this.requestMade.next(true);
    const url = this.SERVER_URL + `/api/publishers/${publisherId}/`;
    return this.http.get(url);
  }

  loadContentsOfSharedFolder(folderId: string) {
    this.requestMade.next(true);
    const url = this.SERVER_URL + `/api/edt/sharedfolders/${folderId}/`;

    return this.http.get<SharedFolder>(url).subscribe(
        (data) => {
          this.sharedTextsList.next(data);
        },
        (err) => this.alertService
            .showErrorAlert(err.status, err.statusText),
    );
  }
  getInfoForSharedfolder(folderId: string) {
    const url = this.SERVER_URL + `/api/edt/sharedfolders/${folderId}/`;
    return this.http.get(url);
  }
}
