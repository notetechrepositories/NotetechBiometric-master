import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { EncryptionService } from '../encryption.service';
import { EmployeeDetails } from '../employee-details';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  providers: [DatePipe]
})
export class UserProfileComponent {
  emp_id: any;
  formattedDate: any
  employeeDetails: EmployeeDetails = {
    emp_id: '',
    employeeName: '',
    birthDate: '',
    hiredDate: '',
    uanNumber: '',
    gender: '',
    maritalStatus: '',
    email: '',
    contactInformation: '',
    permanentAddress: '',
    current_Residential_Address: '',
    department_Project: '',
    designation: '',
    educationalQualifications: '',
    previousEmploymentHistory: '',
    skillsAndCompetencies: '',
    certificationsAndTraining: '',
    languagesKnown: ''
  };
  constructor(private ds: DataService, private encryptionService: EncryptionService, private datePipe: DatePipe) {
    this.emp_id = this.encryptionService.getDecryptedUserId();

  }
  ngOnInit() {
    // this.ds.employeeDetailsById(this.emp_id).subscribe({
    //   next: (response) => {
    //     this.employeeDetails = response;
    //     console.log(this.employeeDetails)
    //   }
    // })
    this.formattedDate = this.datePipe.transform(this.employeeDetails.birthDate, this.employeeDetails.hiredDate, 'dd/MM/yyyy');
    this.ds.employeeDetailsById(this.emp_id).subscribe({
      next: (response) => {
        console.log('API Response:', response);
        this.employeeDetails = response;
      },
      error: (error) => {
        console.error('Error refreshing employee details', error);
      }
    });
  }

  onSaveClick(employeeForm: NgForm) {
    console.log('Form Data:', this.employeeDetails);
    if (this.employeeDetails) {
      this.ds.updateEmployeeDetails(this.employeeDetails).subscribe({
        next: (response) => {
          alert('Updated SuccessFully')
        },

      });
    }
  }

}

