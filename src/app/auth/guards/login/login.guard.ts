import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '@auth/services';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
  ) { }

  canActivate(): boolean {
    if (this.auth.loggedIn) {
      this.router.navigate(['/home']);
      return false;
    } else {
      return true;
    }
  }
}
