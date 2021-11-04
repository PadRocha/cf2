import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor(
    private injector: Injector,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authService = this.injector.get(AuthService);
    const tokenizedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authService.getToken}`),
    });
    return next.handle(tokenizedReq);
  }
}
