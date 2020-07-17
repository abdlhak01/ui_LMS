import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {SnackBarComponent} from "../snack-bar-component/snack-bar-component";
import {ConfirmationDialogComponent} from "../confirmation-dilog/confirmation-dialog.component";
import {MemberRecordComponentModel} from "./member-record.model";
import {MemberRecordService} from "./member-record.service";

@Component({
  selector: 'app-membre-record',
  templateUrl: './member-record.component.html',
  styleUrls: ['./member-record.component.scss']
})
export class MemberRecordComponent implements OnInit {

  private memberRecordOldeModel: MemberRecordComponentModel = new MemberRecordComponentModel();
  durationInSeconds = 5;

  constructor(private memberRecordservice: MemberRecordService,
              private _snackBar: MatSnackBar,
              public dialog: MatDialog) {
  }

  openSnackBar(message) {
    this._snackBar.openFromComponent(SnackBarComponent, {
      duration: this.durationInSeconds * 1000,
      data: message
    });
  }

  memberRecordList: MemberRecordComponentModel[];
  memberRecordComponentModel: MemberRecordComponentModel = new MemberRecordComponentModel();
  private currentItem: MemberRecordComponentModel;
  action: string = null;
  titleAction: string = 'Consultation';

  ngOnInit() {
    this.getFirstMemberRecord();
  }

  getFirstMemberRecord() {
    this.memberRecordservice.getFirstMemberRecord().subscribe(result => {
        this.memberRecordComponentModel = result;
      }
    )
  }

  /*
  getAllmemberRecord() {
    this.memberRecordservice.getAllmemberRecord().subscribe(resp => {
      this.memberRecordList = resp;
    });
  }*/

  startAction(action: string) {
    switch (action) {
      case 'add': {
        this.memberRecordOldeModel = {...this.memberRecordComponentModel};
        this.memberRecordComponentModel = new MemberRecordComponentModel();
        this.memberRecordComponentModel.noBookIssued=0;
        this.action = 'add';
        this.titleAction = 'Creation';
        break;
      }
      case 'update': {
        this.memberRecordOldeModel = {...this.memberRecordComponentModel};
        this.action = 'update';
        this.titleAction = 'Modification';
        break;
      }
      case 'delete': {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          width: '850px',
          data: "Est-ce que vous confirmez la suppression de ce membre?"
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.memberRecordservice.deleteMemberRecord(this.memberRecordComponentModel).subscribe(result => {
                this.openSnackBar(this.initData('Le membre est supprimé avec succès', 'success'));
                this.getFirstMemberRecord();
              },error=>{
                this.openSnackBar(this.initData(error.error.message, 'error'));
              }
            )
          }
        });
        break;
      }
      case null: {
        this.memberRecordComponentModel = this.memberRecordOldeModel;
        this.action = null;
        this.titleAction = 'Consultation';
        break;
      }
    }
  }

  initData(error, messageType) {
    return {
      message: error,
      messageType: messageType
    };
  }

  callAction() {
    switch (this.action) {
      case 'add': {
        this.memberRecordservice.addMemberRecord(this.memberRecordComponentModel).subscribe(resp => {
          this.memberRecordComponentModel = resp;
          this.currentItem = resp;
          this.action = null;
          this.titleAction = 'Consultation';
          this.openSnackBar(this.initData('Le membre est ajouté avec succès', 'success'));
        }, error => {
          this.openSnackBar(this.initData(error.error.message, 'error'));
        });
        break;
      }
      case 'update': {
        this.memberRecordservice.updateMemberRecord(this.memberRecordComponentModel).subscribe(resp => {
          this.memberRecordComponentModel = resp;
          this.currentItem = resp;
          this.action = null;
          this.titleAction = 'Consultation';
          this.openSnackBar(this.initData('Le membre est modifié avec succès', 'success'));
        }, error => {
          this.openSnackBar(this.initData(error.error.message, 'error'));
        });
        break;
      }
      case '': {
        break;
      }
    }
  }

  findMemberRecordByCode() {
    this.memberRecordservice.findMemberRecordByCode(this.memberRecordComponentModel.codeMemberRecord).subscribe(resp => {
      this.memberRecordComponentModel = resp;
    });
  }
}
