import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ExpenseService } from '../../core/service/expense.service';
import { IExpense } from '../../core/models/common.model';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './expense-form.component.html',
  styleUrl: './expense-form.component.scss',
})
export class ExpenseFormComponent {
  expenseForm!: FormGroup;
  expenseId:string="";

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private router: Router,
    private activatedRoute:ActivatedRoute
  ) {
    this.expenseForm = this.fb.group({
      price: new FormControl('', [Validators.required]),
      title: new FormControl('', [Validators.required]),
      description: new FormControl(''),
    });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe({
      next:(params) =>{
        this.expenseId=params['Id'];
        this.getExpense(this.expenseId);
      }
    })
    console.log("isis",this.expenseId)

  }

 

  onSubmit() {
    if (this.expenseForm.valid) {
      console.log(this.expenseForm.value);
      if (this.expenseId) { 
        this.expenseService.updateExpense(this.expenseId, this.expenseForm.value);
      } else {
        this.expenseService.addExpense(this.expenseForm.value);
      }
      this.router.navigate(['/']);
    } else {
      this.expenseForm.markAllAsTouched();
    }
  }
  
  // getExpense(key: string) {
  //   this.expenseService.getExpense(key).snapshotChanges().subscribe({
  //     next: (data) => {
  //       const expense = data.payload.toJSON() as IExpense;
  //       console.log('Fetched expense:', expense); // Add this line to debug
  //       this.expenseForm.patchValue(expense);
  //     },
  //     error: (err) => {
  //       console.error('Failed to get expense:', err);
  //     }
  //   });
  // }
  
  getExpense(key: string) {
    this.expenseService.getExpense(key).subscribe({
      next: (expense) => {
        if (expense) {
          console.log('Fetched expense:', expense);
          this.expenseForm.patchValue(expense);
        } else {
          console.log('No data found for key:', key);
        }
      },
      error: (err) => {
        console.error('Failed to get expense:', err);
      }
    });
  }
  
}
