import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BookComponentModel} from "./book.component.model";

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(public http : HttpClient) { }

  getFirstBook():any {
    return this.http.get<BookComponentModel>(
      `http://localhost:8080/api/book/first`);
  }
  deleteBook(book : BookComponentModel):any {
    let header = new HttpHeaders();
    header= header.append('content-type', 'application/json');
    return this.http.delete<BookComponentModel>(
      `http://localhost:8080/api/book/${book.bookId}`);
  }

  getAllbook():any {
    return this.http.get<BookComponentModel>(
      `http://localhost:8080/api/book`);
  }

  addBook(book: BookComponentModel) {
    let header = new HttpHeaders();
    header= header.append('content-type', 'application/json');
    return this.http.post<BookComponentModel>(
      `http://localhost:8080/api/book`,book, {headers : header});
  }

  updateBook(book: BookComponentModel) {
    let header = new HttpHeaders();
    header= header.append('content-type', 'application/json');
    return this.http.put<BookComponentModel>(
      `http://localhost:8080/api/book`,book, {headers : header});
  }
  getNewCode() {
    return this.http.get<BookComponentModel>(
      `http://localhost:8080/api/book/code`);
  }

  findBookByCode(codeBook: string) {
    return this.http.get<BookComponentModel>(
      `http://localhost:8080/api/book/${codeBook}`);
  }
}
