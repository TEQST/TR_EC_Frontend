import {Injectable} from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';

import {UsermgmtService} from 'src/app/services/usermgmt.service';
import {AlertManagerService} from '../services/alert-manager.service';

@Injectable({
  providedIn: 'root',
})
export class ServerErrorInterceptorService implements HttpInterceptor {

  constructor(
    private alertService: AlertManagerService,
    private userService: UsermgmtService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {

    return next.handle(request).pipe(
        retry(1),
        catchError((error: HttpErrorResponse) => {

          if (error.error instanceof ErrorEvent) {
          // client side error
          } else {
          // server side error
            if (error.status === 401) {
            // If the client uses an invalid token delete the locally stored one
            // TODO: improve api error for easier checking
              if (error.error.detail === 'Invalid token.') {
                this.userService.deleteStoredUserData();
              }
              this.alertService.presentNotLoggedInAlert();
              return;
            }
          }
          return throwError(error);
        }),
    );
  }
}
