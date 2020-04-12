import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BookComponentModel} from "./book.component.model";

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(public http : HttpClient) { }

  getAllbook():any {
    return this.http.get<BookComponentModel>(
      `http://localhost:8080/api/book`);
  }

  addBook(book: BookComponentModel):any {
    let header = new HttpHeaders();
    header= header.append('content-type', 'application/json');
    alert(JSON.stringify(book));
    return this.http.post<BookComponentModel>(
      `http://localhost:8080/api/book`,book, {headers : header});
  }
}
