import {Component, OnInit} from '@angular/core';
import {BookComponentModel} from './book.component.model';
import {BookService} from "./book.service";
import {FormBuilder,FormGroup,} from "@angular/forms";


@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {

  constructor(private bookservice: BookService) {
  }

  action: string;

  bookList: BookComponentModel[];
  bookComponentModel: BookComponentModel = new BookComponentModel();

  ngOnInit() {
    this.getAllbook();
  }

  getAllbook() {
    this.bookservice.getAllbook().subscribe(resp => {
      this.bookList = resp;
      console.table(JSON.stringify(resp));
    });
  }
  addbook() {
    this.bookservice.addBook(this.bookComponentModel).subscribe(resp => {
      this.bookComponentModel = resp;
    });
  }


}
