import {Component, OnInit} from '@angular/core';
import {TransactionModule} from './transaction.module';
import {TransactionService} from "./transaction.service";
import {SnackBarComponent} from "../snack-bar-component/snack-bar-component";
import {MatSnackBar} from '@angular/material';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmationDialogComponent} from "../confirmation-dilog/confirmation-dialog.component";
import {BookService} from "../book/book.service";
import {element} from "protractor";

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {

  private transOldModel: TransactionModule = new TransactionModule();
  durationInSeconds = 5;

  constructor(private transService: TransactionService, private _snackBar: MatSnackBar,
              public dialog: MatDialog) {
  }

  openSnackBar(message) {
    this._snackBar.openFromComponent(SnackBarComponent, {
      duration: this.durationInSeconds * 1000,
      data: message
    });
  }

  transList: TransactionModule[];
  transactionModule: TransactionModule = new TransactionModule();
  private currentItem: TransactionModule;
  action: string = null;
  titleAction: string = 'Consultation';

  ngOnInit() {
    this.getFirstTrans();
    this.getDropDownInBook();
  }

  getFirstTrans() {
    this.transService.getFirstTrans().subscribe(result => {
        this.transactionModule = result;
      }
    )
  }

  private bookservice: BookService ;
  private bookList: Array<String> = [];

  getDropDownInBook(){
    this.bookservice.getAllbook().subscribe(result => {
      result.forEach(element => {
        this.bookList.push(element["codeBook"])
      })
    })
  }

  getAllTrans() {
    this.transService.getAllTrans().subscribe(resp => {
      this.transList = resp;
    });
  }

  startAction(action: string) {
    switch (action) {
      case 'add': {
        this.transOldModel = {...this.transactionModule};
        this.transactionModule = new TransactionModule();
        this.action = 'add';
        this.titleAction = 'Creation';
        break;
      }
      case 'update': {
        this.transOldModel = {...this.transactionModule};
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
          if (result) {
            this.transService.deleteTrans(this.transactionModule).subscribe(result => {
                this.openSnackBar(this.initData('La transaction est supprimé avec succès', 'success'));
                this.getFirstTrans();
              }
            )
          }
        });
        break;
      }
      case null: {
        this.transactionModule = this.transOldModel;
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
        this.transService.addTrans(this.transactionModule).subscribe(resp => {
          this.transactionModule = resp;
          this.currentItem = resp;
          this.action = null;
          this.titleAction = 'Consultation';
          this.openSnackBar(this.initData('La transaction est ajouté avec succès', 'success'));
        }, error => {
          this.openSnackBar(this.initData(error.error.message, 'error'));
        });
        break;
      }
      case 'update': {
        this.transService.updateTrans(this.transactionModule).subscribe(resp => {
          this.transactionModule = resp;
          this.currentItem = resp;
          this.action = null;
          this.titleAction = 'Consultation';
          this.openSnackBar(this.initData('La transaction est modifié avec succès', 'success'));
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

  findTransByCode(){
    this.transService.findTransactionByCode(this.transactionModule.codeTrans).subscribe(resp => {
      this.transactionModule = resp ;
    });
  }


}
