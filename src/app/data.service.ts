import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';
import { Observable } from 'rxjs';
import { HolidayList } from './holiday-list';
import { AttendanceRegister } from './attendance-register';
import { EmployeeDetails } from './employee-details';

interface LoginResponse {
  message: string;
  notetechId: string;
  firstName: string;
}
@Injectable({
  providedIn: 'root'
})
export class DataService {
  add(arg0: { severity: string; summary: string; detail: string; }) {
    throw new Error('Method not implemented.');
  }

  constructor(private http: HttpClient) { }
  RegisterUser(firstName: string, lastName: string, notetechId: string,
    userName: string, userPassword: string, birthDate: string, hiredDate: string
  ) {
    const dataUrl = `${environment.apiUrl}Registration/registration`
    const requestData = {
      firstName: firstName,
      lastName: lastName,
      userName: userName,
      userPassword: userPassword,
      notetechId: notetechId,
      birthDate: birthDate,
      hiredDate: hiredDate
    }
    return this.http.post(dataUrl, requestData, { responseType: 'text', });
  }
  UserLogin(userName: string, userPassword: string) {
    const dataUrl = `${environment.apiUrl}Login_/login`
    const requestData = {
      userName: userName,
      userPassword: userPassword
    }
    return this.http.post<any>(dataUrl, requestData);
  }
  GetattandanceDetails(emp_id: string) {
    const dataUrl = `${environment.apiUrl}User/userAttandance/${emp_id} `
    const requestData = {
      emp_id: emp_id
    }
    return this.http.post<any>(dataUrl, requestData)
  }
  GetattandanceByToday(emp_id: string) {
    const dataUrl = `${environment.apiUrl}User/checkinTime/${emp_id} `
    const requestData = {
      emp_id: emp_id
    }
    return this.http.post<any>(dataUrl, requestData)
  }
  GetHolidayList() {
    const dataUrl = `${environment.apiUrl}User/holidayList`
    return this.http.get<any>(dataUrl)
  }
  GetFullHolidayList() {
    const dataUrl = `${environment.apiUrl}User/GetFullHolidayList`
    return this.http.get<any>(dataUrl)
  }
  GetMonthlyOt(emp_id: string, startDate: Date, endDate: Date) {
    const dataUrl = `${environment.apiUrl}User/${emp_id}/${startDate}/${endDate}`;
    const requestData = {
      empId: emp_id,
      startDate: startDate,
      EndDate: endDate
    }
    return this.http.post<any>(dataUrl, requestData)
  }
  GetemployeeFullData() {
    const dataUrl = `${environment.apiUrl}Admin/attandance`
    return this.http.get<any>(dataUrl);
  }

  GetAdimMonthlyOtCalculator(startDate: Date, endDate: Date) {
    const dataUrl = `${environment.apiUrl}Admin/overTime/${startDate}/${endDate}`;
    const requestData = {
      startDate: startDate,
      endDate: endDate
    }
    return this.http.post<any>(dataUrl, requestData)
  }

  getUpcomingBirthdays(): Observable<any> {
    const dataUrl = `${environment.apiUrl}User/upcomingBirthday`
    return this.http.get<any>(dataUrl);
  }
  insertHoliday(holidayDate: string, festival: string, day: string): Observable<any> {
    const dataUrl = `${environment.apiUrl}User/upload`;
    const requestData: HolidayList[] = [
      {
        holidayDate: holidayDate,
        festival: festival,
        day: day
      }
    ];
    return this.http.post(dataUrl, requestData, { responseType: 'text' });
  }
  insertAttendanceRegister(record: AttendanceRegister): Observable<any> {
    const dataUrl = `${environment.apiUrl}User/uploadAttendance`;
    return this.http.post<any>(dataUrl, record);
  }

  getUanNumber(emp_id: string) {
    const dataUrl = `${environment.apiUrl}User/UANdetails/${emp_id}`;
    const requestData = {
      emp_id: emp_id
    }
    return this.http.post<any>(dataUrl, requestData)
  }
  getWorkAnniversaries() {
    const dataUrl = `${environment.apiUrl}User/Work Anniversaries`;
    return this.http.get<any>(dataUrl)
  }
  GetUserAttendance() {
    const dataUrl = `${environment.apiUrl}User/attendanceRegister`;
    return this.http.get<any>(dataUrl)
  }
  GetleaveRecordById(emp_id: number) {
    const dataUrl = `${environment.apiUrl}User/attendanceRegisterByid/${emp_id}`;
    const requestData = {
      emp_id: emp_id
    }
    return this.http.post<any>(dataUrl, requestData)
  }
  GetEmployeeIdAnName() {
    const dataUrl = `${environment.apiUrl}User/GetemployeeIdandName`;
    return this.http.get<any>(dataUrl)
  }
  postMonthlySlip(emp_id: number, request: string, requestDate: string) {
    const dataUrl = `${environment.apiUrl}User/monthlyRequest/${emp_id}/${request}/${requestDate}`
    const requestData = {
      emp_id: emp_id,
      request: request,
      requestDate: requestDate
    }
    return this.http.post<any>(dataUrl, requestData)
  }
  Monthlyslip() {
    const dataUrl = `${environment.apiUrl}User/Monthlysliprequest`
    return this.http.get<any>(dataUrl)

  }
  MonthlyRequestCount() {
    const dataUrl = `${environment.apiUrl}User/MonthlySlipRequestCount`
    return this.http.get(dataUrl, { responseType: 'text' })
  }
  employeeDetailsById(emp_id: string) {
    const dataUrl = `${environment.apiUrl}User/GetEmployeeDetailsById/${emp_id}`
    const requestData = {
      emp_id: emp_id,
    }
    return this.http.post<EmployeeDetails>(dataUrl, requestData,)
  }
  updateEmployeeDetails(employeeDetails: EmployeeDetails): Observable<any> {
    const dataUrl = `${environment.apiUrl}User/updateEmployeeById`
    return this.http.put(dataUrl, employeeDetails, { responseType: 'text' });
  }
}


