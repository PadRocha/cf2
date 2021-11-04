import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '@auth/services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoggedGuard implements CanActivate {
  constructor(
    private user: UserService,
    private router: Router,
  ) { }

  canActivate(): Observable<boolean> {
    return this.user.userSync.pipe(
      map(({ identifier }) => {
        if (!!identifier) {
          return true;
        } else {
          this.router.navigate(['/auth']);
          return false;
        }
      }),
    );
  }
}
