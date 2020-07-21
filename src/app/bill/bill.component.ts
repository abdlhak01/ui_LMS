import {Component, OnInit, ViewChild} from '@angular/core';
import {BillComponentModel} from './bill.model';
import {BillService} from "./bill.service";
import {SnackBarComponent} from "../snack-bar-component/snack-bar-component";
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmationDialogComponent} from "../confirmation-dilog/confirmation-dialog.component";
import {MemberRecordComponentModel} from "../membre/member-record.model";
import {MemberRecordService} from "../membre/member-record.service";
import {ColumnMode, DatatableComponent, SelectionType} from "@swimlane/ngx-datatable";

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss']
})
export class BillComponent implements OnInit {

  private billOldeModel: BillComponentModel = new BillComponentModel();
  durationInSeconds = 5;
  enableAtteindre: boolean = false;

  constructor(private billservice: BillService,
              private _snackBar: MatSnackBar,
              public dialog: MatDialog,
              private memberService: MemberRecordService) {
  }

  openSnackBar(message) {
    this._snackBar.openFromComponent(SnackBarComponent, {
      duration: this.durationInSeconds * 1000,
      data: message
    });
  }

  getFirstBill() {
    this.billservice.getFirstBill().subscribe(result => {
      this.billComponentModel = result;
    });
  }

  getAllBill() {
    this.billservice.getAllBill().subscribe(result => {
      this.billTempList = [...result];
      this.billList = result;
    });
  }

  billComponentModel: BillComponentModel = new BillComponentModel();
  private currentItem: BillComponentModel;
  action: string = null;
  titleAction: string = 'Consultation';

  ngOnInit() {
    this.getFirstBill();
    this.getDropDownInMember();
    this.getAllBill();
  }

  memberList = [];
  billList = [];
  billTempList = [];
  @ViewChild(DatatableComponent) table: DatatableComponent;
  SelectionType = SelectionType;
  ColumnMode = ColumnMode;
  columns: any[] = [
    {name: 'codeBill'},
    {name: 'date'},
    {name: 'memberCode'},
    {name: 'amount'},
  ];
  selected = [];
  @ViewChild('closebutton') closebutton;

  getDropDownInMember() {
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
          if (result) {
            this.billservice.deleteBill(this.billComponentModel).subscribe(result => {
                this.openSnackBar(this.initData('La facture est supprimé avec succès', 'success'));
                this.getFirstBill();
                this.getAllBill();
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
          this.getAllBill();
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
          this.getAllBill();
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

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.billTempList.filter(function (d) {
      if (d && d.codeBill)
        return d.codeBill.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.billList = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  onSelect() {
    this.enableAtteindre = true;
  }

  onActivate(event) {
    console.log('Activate Event', event);
  }

  atteindre() {
    this.billComponentModel = this.selected[0];
    this.closebutton.nativeElement.click()
  }

  /*async export($event) {
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
  }*/
}
