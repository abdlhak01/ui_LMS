import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {AuthService} from "../../_services/auth.service";
import {TokenStorageService} from "../../_services/token-storage.service";
import {Title} from "@angular/platform-browser";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  title = 'app works!';
  private roles: string[];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username: string;
  localStorage = window.localStorage;

  constructor(private titleService: Title, router: Router,
              activatedRoute: ActivatedRoute,
              private tokenStorageService: TokenStorageService) {
  }

  private user: any = {};

  ngOnInit() {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');
      this.localStorage.setItem("showAdminBoard",this.showAdminBoard.toString());
      this.username = user.username;
    }
  }


}
