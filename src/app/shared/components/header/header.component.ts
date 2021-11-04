import { Component, OnInit } from '@angular/core';
import { AuthService, UserService } from '@auth/services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  host: { class: 'navbar navbar-expand-md navbar-dark bg-dark' }
})
export class HeaderComponent implements OnInit {

  constructor(
    public user: UserService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
  }

  logOut(): void {
    this.auth.logoutUser();
    this.user.destroy();
  }
}
