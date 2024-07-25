import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { IExpense } from '../models/common.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private dbPath='/expense';
  expenseRef:AngularFireList<any> | undefined;
  constructor(private db:AngularFireDatabase) { 
    this.expenseRef=db.list(this.dbPath);
  }

  getAllExpense(){
    return this.expenseRef;
  }

  // getExpense(key:string){
  //   return this.db.object(`${this.dbPath}/${key}`);
  // }

  getExpense(key: string): Observable<IExpense | null> {
    return this.db.object<IExpense>(`${this.dbPath}/${key}`).valueChanges();
  }

  addExpense(expense:IExpense){
    this.expenseRef?.push(expense);
  }
  updateExpense(key:string, expense:IExpense){
    this.expenseRef?.update(key,expense);
  }

  deleteExpense(key:string){
    return this.expenseRef?.remove(key);
  }
}
