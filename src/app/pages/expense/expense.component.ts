  import { CommonModule } from '@angular/common';
  import { Component } from '@angular/core';
  import { Router, RouterLink } from '@angular/router';
  import { ExpenseService } from '../../core/service/expense.service';
  import { IExpense } from '../../core/models/common.model';
import { LoaderComponent } from '../loader/loader.component';


  @Component({
    selector: 'app-expense',
    standalone: true,
    imports: [CommonModule, RouterLink,LoaderComponent],
    templateUrl: './expense.component.html',
    styleUrl: './expense.component.scss'
  })
  export class ExpenseComponent {

    expenses:IExpense[]=[];
    totalExpense:number=0;
    isLoading:boolean=true;

    constructor(private expenseService: ExpenseService, private router:Router) {}

    ngOnInit() {
      this.getAllExpense();
    }

    getAllExpense() {
      this.expenseService.getAllExpense()?.snapshotChanges().subscribe({
        next: (data) => {
          this.expenses=[];
          data.forEach((item) => {
            let expense=item.payload.toJSON() as IExpense;
          
            this.expenses.push({
              key:item.key||'',
              title:expense.title,
              description:expense.description,
              price:expense.price,
            })
            this.totalExpense+=parseFloat(expense.price);
            this.isLoading=false
          })
        },
        error: (err) => {
          this.isLoading=true
          console.error('Error fetching expenses', err);
        }
      });
    }

  editExpense(key:string){
    console.log(key);
    this.router.navigate(['/expense-from/'+key])
  }

  removeExpense(key:string){
    if(confirm("Are you sure?")){
      this.expenseService.deleteExpense(key);
      this.getAllExpense();
    }
  }

  }
