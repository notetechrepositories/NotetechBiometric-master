import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { AttendanceRegister } from '../attendance-register';
interface employee {
  Name: string
  empid: Number
}


@Component({
  selector: 'app-attendance-register',
  templateUrl: './attendance-register.component.html',
  styleUrls: ['./attendance-register.component.css']
})
export class AttendanceRegisterComponent {
  file: any;
  data: Array<any> = [];
  Attendance: AttendanceRegister[] = [];
  clonedProducts: { [s: string]: AttendanceRegister } = {};
  EmployeeName: employee[] = [];
  selectEmployee: employee | undefined;
  dataofattendance: any;
  options: any
  constructor(private ds: DataService, private route: Router) { }
  ngOnInit() {
    this.getuserAttendance();
    this.getEmployeeName();
  }

  onFileChange(evt: Event): void {
    const target = evt.target as HTMLInputElement;
    if (!target.files || target.files.length !== 1) {
      throw new Error('Please select a single file');
    }

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const arrayBuffer: ArrayBuffer = e.target!.result as ArrayBuffer;
      const data = new Uint8Array(arrayBuffer);
      const arr = new Array();
      for (let i = 0; i !== data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      const bstr = arr.join('');

      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];

      this.data = XLSX.utils.sheet_to_json(ws, {
        header: 1,
        defval: 0  // Setting default value for empty cells to 0
      });
      console.log(this.data);
    };

    reader.readAsArrayBuffer(target.files[0]);
  }

  uploadfile() {
    const attendanceData: AttendanceRegister[] = this.data.slice(1).map((item) => ({
      emp_id: item[0].toString(),
      name: item[1],
      opening_Balance: parseFloat(item[2]) || 0,
      year: parseInt(item[3], 10),
      jan: parseFloat(item[4]) || 0,
      feb: parseFloat(item[5]) || 0,
      march: parseFloat(item[6]) || 0,
      april: parseFloat(item[7]) || 0,
      may: parseFloat(item[8]) || 0,
      june: parseFloat(item[9]) || 0,
      july: parseFloat(item[10]) || 0,
      august: parseFloat(item[11]) || 0,
      sept: parseFloat(item[12]) || 0,
      oct: parseFloat(item[13]) || 0,
      november: parseFloat(item[14]) || 0,
      december: parseFloat(item[15]) || 0,
    }));

    attendanceData.forEach(record => {
      this.ds.insertAttendanceRegister(record).subscribe(
        (response) => {
          console.log('Data uploaded successfully', response);
        },
        (error) => {
          console.error('Error uploading data', error);
        }
      );
    });
  }
  onRowEditInit(Attendance: AttendanceRegister) {
    this.clonedProducts[Attendance.emp_id as string] = { ...Attendance };
  }

  onRowEditSave(Attendance: AttendanceRegister) {
    if (Attendance.emp_id) {
      delete this.clonedProducts[Attendance.emp_id as string];
    }
  }

  onRowEditCancel(Attendance: AttendanceRegister, index: number) {
    this.Attendance[index] = this.clonedProducts[Attendance.emp_id as string];
    delete this.clonedProducts[Attendance.emp_id as string];
  }
  getuserAttendance() {
    this.ds.GetUserAttendance().subscribe({
      next: (response) => {
        this.Attendance = response;
        console.log(response);
      }
    })
  }
  getEmployeeName() {
    this.ds.GetUserAttendance().subscribe({
      next: (response) => {
        this.EmployeeName = response.map((item: any) => {
          return { emp_id: item.emp_id, Name: item.Name };
        });
        console.log(this.EmployeeName);
      },
      error: (err) => {
        console.error('Error fetching attendance data', err);
      }
    });
  }
  onEmployeeSelect(selectedEmployee: employee) {
    console.log('Selected employee:', selectedEmployee);

  }

}
