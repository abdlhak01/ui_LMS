import {Component, OnInit} from '@angular/core';
import {BillComponentModel} from './bill.model';
import {BillService} from "./bill.service";
import {SnackBarComponent} from "../snack-bar-component/snack-bar-component";
import {MatSnackBar} from '@angular/material';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmationDialogComponent} from "../confirmation-dilog/confirmation-dialog.component";
import {MemberRecordComponentModel} from "../membre/member-record.model";
import {MemberRecordService} from "../membre/member-record.service";
import {DatePipe} from "@angular/common";
@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss']
})
export class BillComponent implements OnInit {

  private billOldeModel: BillComponentModel = new BillComponentModel();
  durationInSeconds = 5;

  constructor(private billservice: BillService,
              private _snackBar: MatSnackBar,
              public dialog: MatDialog,
              public datepipe: DatePipe,
              private memberService: MemberRecordService) {
  }

  openSnackBar(message) {
    this._snackBar.openFromComponent(SnackBarComponent, {
      duration: this.durationInSeconds * 1000,
      data: message
    });
  }
  getFirstBill(){
    this.billservice.getFirstBill().subscribe( result =>{
        if(result)
          this.billComponentModel = result;
      }
    )
  }

  billComponentModel: BillComponentModel = new BillComponentModel();
  private currentItem: BillComponentModel;
  action: string = null;
  titleAction: string = 'Consultation';

  ngOnInit() {
    this.getFirstBill();
    this.getDropDownInMember();
  }

  memberList: MemberRecordComponentModel[] = [];

  getDropDownInMember(){
    this.memberService.getAllmemberRecord().subscribe(result => {
      result.forEach(element => {
        this.memberList.push(element)
      })
    })
  }



  startAction(action: string) {
    switch (action) {
      case 'add': {
        this.billOldeModel = {...this.billComponentModel};
        this.billComponentModel = new BillComponentModel();
        this.action = 'add';
        this.titleAction = 'Creation';
        break;
      }
      case 'update': {
        this.billOldeModel = {...this.billComponentModel};
        this.action = 'update';
        this.titleAction = 'Modification';
        break;
      }
      case 'delete': {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          width: '850px',
          data: "Est-ce que vous confirmez la suppression de ce livre?"
        });
        dialogRef.afterClosed().subscribe(result => {
          if(result) {
            this.billservice.deleteBill(this.billComponentModel).subscribe( result =>{
                this.openSnackBar(this.initData('La facture est supprimé avec succès', 'success'));
                this.getFirstBill();
              }
            )
          }
        });
        break;
      }
      case null: {
        this.billComponentModel = this.billOldeModel;
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
        this.billservice.addBill(this.billComponentModel).subscribe(resp => {
          this.billComponentModel = resp;
          this.currentItem = resp;
          this.action = null;
          this.titleAction = 'Consultation';
          this.openSnackBar(this.initData('La facture est ajouté avec succès', 'success'));
        }, error => {
          this.openSnackBar(this.initData(error.error.message, 'error'));
        });
        break;
      }
      case 'update': {
        this.billservice.updateBill(this.billComponentModel).subscribe(resp => {
          this.billComponentModel = resp;
          this.currentItem = resp;
          this.action = null;
          this.titleAction = 'Consultation';
          this.openSnackBar(this.initData('La Facture est modifié avec succès', 'success'));
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

  async export($event) {
    $event.stopPropagation();
    $event.preventDefault();

    const result = this.billservice.exportDataFile(this.billComponentModel.billId);
    const fileName = 'FACTURE' + this.datepipe.transform(new Date(), 'dd_MM_yyyy hh_mm') + '' + '.xls';
    result.subscribe(
      (response: any) => {
        const blob = new Blob([response.body],
          {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'});
        //FileSaver.saveAs(blob, fileName);
      },
      err => {
      }
    );
  }
}
