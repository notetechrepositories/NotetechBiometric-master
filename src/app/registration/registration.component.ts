import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { format } from 'date-fns';
import { Router } from '@angular/router';


interface employee {
  emp_id: string;
  employeeName: string;
}
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  firstName: string = ''
  lastName: string = ''
  notetechId: string = ''
  userName: string = ''
  userPassword: string = ''
  repeatPassword: string = ''
  password: string = ''
  birthDate!: Date
  hiredDate!: Date
  showDropdown = false;
  employees: any[] = [];
  showPassword: boolean = false;
  constructor(private ds: DataService, private route: Router) {
  }
  ngOnInit() {
    this.ds.GetEmployeeIdAnName().subscribe({
      next: (response) => {
        this.employees = response;
        console.log('Employees loaded:', this.employees);
      },
      error: (error) => {
        console.error('Error fetching employee data:', error);
      }
    });
  }

  submit() {
    const formattedBirthDate = format(this.birthDate, 'yyyy-MM-dd');
    const formattedHiredDate = format(this.hiredDate, 'yyyy-MM-dd');
    if (this.userPassword === this.repeatPassword) {
      this.password = this.userPassword;
      this.ds.RegisterUser(this.firstName, this.lastName, this.notetechId, this.userName, this.userPassword, formattedBirthDate, formattedHiredDate).subscribe({
        next: (response) => {
          if (response) {
            alert("Registration success")
            this.route.navigateByUrl('')
          }
        },
        error: (err) => {
          alert('Registration failed:');
        }
      });
    } else {
      alert("Passwords do not match.");
    }
  }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  selectEmployeeId(emp_id: string) {
    this.notetechId = emp_id;
    this.showDropdown = false; // Hide the dropdown after selection
  }
}
