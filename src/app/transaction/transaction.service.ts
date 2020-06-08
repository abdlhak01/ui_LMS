import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {TransactionModule} from './transaction.module';
import {BookComponentModel} from "../book/book.component.model";

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(public http : HttpClient) { }

  getFirstTrans():any{
    return this.http.get<TransactionModule>(
      `http://localhost:8080/api/transaction/first`);
  }
  deleteTrans(trans : TransactionModule):any{
    return this.http.delete<TransactionModule>(
      `http://localhost:8080/api/transaction/${trans.transId}`);
  }

  getAllTrans():any{
    return this.http.get<TransactionModule>(
      `http://localhost:8080/api/transaction`);
  }
  addTrans(trans : TransactionModule) {
    let header = new HttpHeaders();
    header= header.append('content-type', 'application/json');
    return this.http.post<TransactionModule>(
      `http://localhost:8080/api/transaction`,trans, {headers : header});
  }

  updateTrans(trans : TransactionModule){
    let header = new HttpHeaders();
    header= header.append('content-type', 'application/json');
    return this.http.put<TransactionModule>(
      `http://localhost:8080/api/transaction`,trans, {headers : header});
  }

  getNewCode(){
    return this.http.get<TransactionModule>(
      `http://localhost:8080/api/transaction`);
  }

  findTransactionByCode(codeTrans :String){
   return this.http.get<TransactionModule>(
  `http://localhost:8080/api/transaction/${codeTrans}`);
  }
}
