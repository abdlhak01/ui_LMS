import {Component, OnInit} from '@angular/core';
import {BookComponentModel} from './book.component.model';
import {BookService} from "./book.service";
import {SnackBarComponent} from "../snack-bar-component/snack-bar-component";
import {MatSnackBar} from '@angular/material';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmationDialogComponent} from "../confirmation-dilog/confirmation-dialog.component";

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {
  private bookOldeModel: BookComponentModel = new BookComponentModel();
  durationInSeconds = 5;

  constructor(private bookservice: BookService,
              private _snackBar: MatSnackBar,
              public dialog: MatDialog) {
  }

  openSnackBar(message) {
    this._snackBar.openFromComponent(SnackBarComponent, {
      duration: this.durationInSeconds * 1000,
      data: message
    });
  }

  bookList: BookComponentModel[];
  bookComponentModel: BookComponentModel = new BookComponentModel();
  private currentItem: BookComponentModel;
  action: string = null;
  titleAction: string = 'Consultation';

  ngOnInit() {
    this.getFirstBook();
  }
  getFirstBook(){
    this.bookservice.getFirstBook().subscribe( result =>{
        this.bookComponentModel = result;
      }
    )
  }
  /*
  getAllbook() {
    this.bookservice.getAllbook().subscribe(resp => {
      this.bookList = resp;
    });
  }*/

  startAction(action: string) {
    switch (action) {
      case 'add': {
        this.bookOldeModel = this.bookComponentModel;
        this.bookComponentModel = new BookComponentModel();
        this.action = 'add';
        this.titleAction = 'Creation';
        break;
      }
      case 'update': {
        this.bookOldeModel = this.bookComponentModel;
        this.action = 'update';
        this.titleAction = 'Modification';
        break;
      }
      case null: {
        this.bookComponentModel = this.bookOldeModel;
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

  callAction(action: string) {
    switch (action) {
      case 'add': {
        this.bookservice.addBook(this.bookComponentModel).subscribe(resp => {
          this.bookComponentModel = resp;
          this.currentItem = resp;
          this.action = null;
          this.titleAction = 'Consultation';
          this.openSnackBar(this.initData('Le livre est ajouté avec succès', 'success'));
        }, error => {
          this.openSnackBar(this.initData(error.error.message, 'error'));
        });
        break;
      }
      case 'update': {
        this.bookservice.updateBook(this.bookComponentModel).subscribe(resp => {
          this.bookComponentModel = resp;
          this.currentItem = resp;
          this.action = null;
          this.titleAction = 'Consultation';
          this.openSnackBar(this.initData('Le livre est modifié avec succès', 'success'));
        }, error => {
          this.openSnackBar(this.initData(error.error.message, 'error'));
        });
        break;
      }
      case 'delete': {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          width: '850px',
          data: "Est-ce que vous confirmez la suppression de ce livre?"
        });
        dialogRef.afterClosed().subscribe(result => {
          if(result) {
            alert('yes')
            this.bookservice.deleteBook(this.bookComponentModel).subscribe( result =>{
                this.openSnackBar(this.initData('Le livre est supprimé avec succès', 'success'));
                this.getFirstBook();
              }
            )
          }
        });
        break;
      }
      case 'update': {
        break;
      }

    }

  }

  findBookByCode() {
    this.bookservice.findBookByCode(this.bookComponentModel.codeBook).subscribe(resp => {
      this.bookComponentModel = resp;
    });
  }

}
