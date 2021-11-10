import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants } from '../constants';
import { User } from '../interfaces/user';
import { Folder } from '../manage/manage.folder';

@Injectable({
  providedIn: 'root'
})
export class ManageFolderService {

  SERVER_URL = Constants.SERVER_URL;

  constructor(
    private http: HttpClient,
  ) { }

  // getFolderInfoFor

  getSubfolderListFor(folderId: string): Observable<object> {
    let url = this.SERVER_URL + `/api/folders/`;
    if (folderId) {
      url += folderId + '/';
    }
    return this.http.get(url);
  }

  getTranscriptionListFor(folderId: string): Observable<object> {
    const url = this.SERVER_URL + `/api/pub/transcripts/?sharedfolder=${folderId}`;
    return this.http.get(url);
  }

  createFolder(parentId: string, folderName: string) {
    const url = this.SERVER_URL + `/api/folders/`;

    return this.http.post(url,
      {
        parent: parentId,
        name: folderName,
      });
  }

  deleteFolder(folderId: string) {
    const url = this.SERVER_URL + `/api/folders/${folderId}/`;
    return this.http.delete(url);
  }

  createTranscriptionSingle(params: any[]) {
    const formData = new FormData();
    for (const param in params) {
      if ({}.hasOwnProperty.call(params, param)) {
        const paramValue = params[param];
        if (param === 'srcfile' || param === 'trfile') {
          formData.append(param, paramValue, paramValue.name);
        } else {
          formData.append(param, paramValue);
        }
      }
    }
    const url = this.SERVER_URL + `/api/pub/transcripts/`;

    return this.http.post(url, formData);
  }

  createTranscriptionMulti(params: any[]) {
    const formData = new FormData();
    for (const param in params) {
      if ({}.hasOwnProperty.call(params, param)) {
        const paramValue = params[param];
        if (param === 'zfile') {
          formData.append(param, paramValue, paramValue.name);
        } else {
          formData.append(param, paramValue);
        }
      }
    }
    const url = this.SERVER_URL + `/api/pub/transcripts/multiupload/`;

    return this.http.post(url, formData);
  }

  deleteTranscription(transcriptionId: string) {
    const url = this.SERVER_URL + `/api/pub/transcripts/${transcriptionId}/`;
    return this.http.delete(url);
  }

  // getTranscriptionInfo

  getEditors(sharedfolderId: number) {
    const url =
    this.SERVER_URL + `/api/sharedfolders/${sharedfolderId}/`;
    return this.http.get<JSON[]>(url);
  }

  setEditors(
    sharedfolderId: number,
    speakers: number[]) {

  const url = this.SERVER_URL + `/api/sharedfolders/${sharedfolderId}/`;
  return this.http.put<JSON>(url, {editor_ids: speakers});
}

getAllUsers() {
  const url = this.SERVER_URL + `/api/users/`;
  return this.http.get<User[]>(url);
}

  downloadFolder(folder: Folder) {
    // TODO
  }
}
