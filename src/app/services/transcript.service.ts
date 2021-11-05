import { Injectable } from '@angular/core';
import { Constants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class TranscriptService {

  SERVER_URL = Constants.SERVER_URL;

  constructor() { }
}
