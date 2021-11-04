import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { IUser } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  protected url: String;
  private headersJSON: HttpHeaders

  constructor(
    protected http: HttpClient,
    protected router: Router,
    @Inject(PLATFORM_ID) protected platformId: Object,
  ) {
    this.url = environment.httpUrl;
    this.headersJSON = new HttpHeaders().set('Content-Type', 'application/json');
  }

  setToken(value: string, expiry = true): void {
    const now = new Date();
    // `item` is an object which contains the original value
    // as well as the time when it's supposed to expire
    const item = { value, expiry: expiry ? now.getTime() + 86_400_000 : false, }
    if (isPlatformBrowser(this.platformId))
      sessionStorage.setItem('token', JSON.stringify(item));
  }

  loginUser(user: IUser) {
    const params = JSON.stringify(user);
    return this.http.post<{ token: string }>(`${this.url}/login`, params, { headers: this.headersJSON });
  }

  logoutUser(): void {
    if (isPlatformBrowser(this.platformId))
      sessionStorage.removeItem('token');
    this.router.navigate(['/auth']);
  }

  get getToken(): string | null {
    const token = isPlatformBrowser(this.platformId) ? sessionStorage.getItem('token') : null;
    if (!token)
      return null;

    const { expiry, value } = JSON.parse(token);
    const now = new Date();
    if (!!expiry && now.getTime() > expiry) {
      this.logoutUser();
      return null;
    }

    return value ?? null;
  }

  get loggedIn(): boolean {
    return isPlatformBrowser(this.platformId) ? !!sessionStorage.getItem('token') : false;
  }
}
