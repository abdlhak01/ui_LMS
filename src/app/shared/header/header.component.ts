import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {TokenStorageService} from "../../_services/token-storage.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private tokenStorageService: TokenStorageService) { }

  ngOnInit() {
  }
  logout() {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
