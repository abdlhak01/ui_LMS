import {Component, Inject, OnInit} from '@angular/core';
import {MAT_SNACK_BAR_DATA} from "@angular/material/snack-bar";

@Component({
  selector: 'app-snack-bar-component',
  templateUrl: './snack-bar-component.html',
  styleUrls: ['./snack-bar-component.scss']
})
export class SnackBarComponent implements OnInit {
  message;
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }

  ngOnInit() {
    alert(JSON.stringify(this.data))
  }

}
