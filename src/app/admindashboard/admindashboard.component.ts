import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { Employeeattandance } from './employeeattandance';
import * as XLSX from 'xlsx';
import { HolidayList } from '../holiday-list';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.css']
})
export class AdmindashboardComponent {
  userAttendance!: Employeeattandance[];
  startDate!: Date;
  endDate!: Date;
  data: Array<any> = [];
  Holiday: HolidayList[] = [];
  newHolidayDate: string = '';
  newFestival: string = '';
  newDay: string = ''
  monthlyslip: any[] = [];
  count: any;
  constructor(private ds: DataService, private route: Router) { }

  ngOnInit() {
    this.ds.GetemployeeFullData().subscribe((data) =>
      this.userAttendance = data)
    console.log(this.userAttendance)
    this.ds.GetFullHolidayList().subscribe((data) =>
      this.Holiday = data)
    console.log(this.Holiday)
    this.monthlySip();
    this.MonthlyOtCount();
  }
  getmonthlyot() {
    console.log(this.startDate, this.endDate);
    this.ds.GetAdimMonthlyOtCalculator(this.startDate, this.endDate).subscribe({
      next: (response) => {
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(response);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'data.xlsx');
      }
    })
  }
  getHolidays() {
    this.ds.GetHolidayList().subscribe({
      next: (response) => {
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(response);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'data.xlsx');
      }
    })
  }
  onFileChange(evt: Event): void {
    const target = evt.target as HTMLInputElement;
    if (!target.files || target.files.length !== 1) {
      throw new Error('Please select a single file');
    }

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      // The result is an ArrayBuffer
      const arrayBuffer: ArrayBuffer = e.target!.result as ArrayBuffer;
      const data = new Uint8Array(arrayBuffer);
      const arr = new Array();
      for (let i = 0; i !== data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      const bstr = arr.join('');

      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      this.data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      console.log(this.data)
    };
    reader.readAsArrayBuffer(target.files[0]);
  }
  uploadData() {
    if (!this.data || this.data.length < 2 || !this.data[0] || !this.data[1]) {
      console.error('Data is missing or not structured correctly');
      return;
    }

    const headers = this.data[0];
    const values = this.data[1];

    if (values.length !== headers.length) {
      console.error('Headers and values do not match in length');
      return;
    }

    const holidayData = headers.reduce((obj: any, key: string, index: number) => {
      obj[key] = values[index];
      return obj;
    }, {});

    if (holidayData.holidayDate && holidayData.festival && holidayData.day) {
      this.ds.insertHoliday(holidayData.holidayDate, holidayData.festival, holidayData.day).subscribe({
        next: (response: HolidayList[]) => {
          this.Holiday = response;
          alert("Holiday uploaded successfully");
        },
        error: (error) => {
          console.error('Failed to upload holiday', error);
          alert("Failed to upload holiday");

        }
      });
    } else {
      console.error('Data is missing in the input array');
      alert("Data is missing in the input array");
    }
  }

  attendance() {
    this.route.navigateByUrl('attendance')
  }
  monthlySip() {
    this.ds.Monthlyslip().subscribe({
      next: (response) => {
        this.monthlyslip = this.processMonthlySlipResponse(response);
      }
    })
  }
  processMonthlySlipResponse(response: any): any[] {
    return response.map((item: any) => {
      const match = item.Request.match(/(\w+)\sRequested\sFor\sMonthly\sslip/i);
      if (match) {
        const name = match[1];
        const firstTwoLetters = name.substring(0, 2);
        const modifiedRequest = item.Request.replace(`${name} `, '')
        return { name, request: modifiedRequest, firstTwoLetters };
      } else {
        return { name: 'Unknown', request: item.Request, firstTwoLetters: 'Un' };
      }
    });
  }
  MonthlyOtCount() {
    this.ds.MonthlyRequestCount().subscribe({
      next: (response) => {
        console.log(response)
        this.count = response[14]
      }
    })
  }
}
