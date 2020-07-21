import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {TokenStorageService} from "../../_services/token-storage.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  localStorage = window.localStorage;
  showAdminBoard: boolean = false;

  constructor(private tokenStorageService: TokenStorageService) { }

  ngOnInit() {
    this.showAdminBoard = this.localStorage.getItem("showAdminBoard") ? this.localStorage.getItem("showAdminBoard")  == "true": false;
  }
  logout() {
    this.tokenStorageService.signOut();
    window.location.reload();
    window.location.replace("/#/login");
  }

  login() {

  }
}
