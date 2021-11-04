import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router, RoutesRecognized } from '@angular/router';
import { UserService } from '@auth/services';
import { Alert } from '@shared/functions';
import { NavigationService } from '@shared/services';
import { filter, pairwise } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  userData: FormGroup;

  constructor(
    public user: UserService,
    private router: Router,
    // private navigation: NavigationService
  ) {
    this.userData = new FormGroup({
      nickname: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.getPreviousUrl();
  }

  ngOnDestroy(): void {
    this.router.events.subscribe();

  }
  getPreviousUrl() {
    this.router.events
      .pipe(filter(event => event instanceof RoutesRecognized))
      .subscribe((event) => {
        // console.log(pre, next);

        // console.log(pre.url, next.url);
      });
  }

  onSubmit() {
    if (this.userData.valid) {
      this.user.loginUser(this.userData.getRawValue()).subscribe(
        ({ token }) => {
          this.user.setToken(token);
          this.user.update();
          this.router.navigate(['/home']);
        },
        err => {
          Alert.fire({
            title: 'Access Denied',
            text: 'Server error',
            icon: 'error',
          });
        }
      );
    }
  }
}
