import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { HttpError } from '@models/interfaces';
// import { ErrorService } from '@services/error/error.service';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';


@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  // private errorMsg: HttpError;

  constructor(
    // private _error: ErrorService
  ) {
    // this.errorMsg = { status: null, message: null }
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('hola a todos');

    return next.handle(request).pipe(
      retry(1),
      // catchError(response => {
      //   // this.errorMsg.status = response.status;
      //   // this.errorMsg.message = response.error.message || 'Server Error';
      //   // this._error.show(this.errorMsg);
      //   // return throwError(this.errorMsg);
      // })
    );
  }
}
