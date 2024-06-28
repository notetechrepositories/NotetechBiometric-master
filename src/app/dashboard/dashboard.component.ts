import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { AttendanceDetails } from '../attendance-details';
import { HolidayList } from '../holiday-list';
import * as XLSX from 'xlsx';
import { Router, Data } from '@angular/router';
import { MatCalendarCellClassFunction, MatCalendarCellCssClasses } from '@angular/material/datepicker';
import Swal from 'sweetalert2';
import { WorkWorkAnniversaries } from '../work-work-anniversaries';
import { AuthService } from '../auth.service';
import 'jspdf-autotable';
import { AttendanceRegister } from '../attendance-register';
import { ChartData, ChartType } from 'chart.js';
import { EncryptionService } from '../encryption.service';
import { format } from 'date-fns/format';
interface ExportColumn {
  title: string;
  dataKey: string;
}
interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  selected!: Date | null;
  currentDate: Date = new Date();
  userId: any;
  CheckInTime: string = ''
  userAttendance!: AttendanceDetails[];
  monthlyOt!: AttendanceDetails[];
  Holiday: HolidayList[] = [];
  AnniversariesDetails: WorkWorkAnniversaries[] = [];
  firstName!: string | null
  selectMonth: string = '';
  startDate!: Date;
  endDate!: Date;
  users: any[] = [];
  UanNumber: string = '';
  dialog: any;
  currentTooltip: string = '';
  date!: Date;
  showFirstCard: boolean = true;
  showSecondCard: boolean = false;
  Attendance: AttendanceRegister[] = [];
  selectedDate = new Date();
  message: string = '';

  totalSum = 0;
  allNumbers: number[] = [];
  transformedData: number[] = [];

  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Total Leave', 'Leave Taken'],
    datasets: [
      {
        data: [0, 0], // Initialize with zero
        backgroundColor: ['blue', 'pink'],
      },
    ],
  };
  public pieChartType: ChartType = 'pie';

  constructor(private ds: DataService, private encryptionService: EncryptionService) {
    setInterval(() => {
      this.currentDate = new Date();
    }, 1000);

    this.userId = this.encryptionService.getDecryptedUserId();
    if (this.userId) {
      console.log('Decrypted User ID:', this.userId);
    } else {
      console.log('No user ID found in localStorage.');
    }

  }

  ngOnInit() {
    this.fetchData();
    this.getuserAttendance();
    this.firstName = localStorage.getItem("userName")
    this.ds.GetattandanceDetails(this.userId).subscribe((data) =>
      this.userAttendance = data
    )
    this.ds.GetattandanceByToday(this.userId).subscribe({
      next: (response) => {
        console.log(response)
        this.CheckInTime = response[0].check_in_time
      }
    })
    this.selectMonth = this.getCurrentMonth();

    this.ds.GetHolidayList().subscribe(data => {
      this.Holiday = data;
    });

    this.ds.getUpcomingBirthdays().subscribe({
      next: (response) => {
        this.users = response;
      }
    })
    this.ds.GetattandanceByToday(this.userId).subscribe({
      next: (response) => {
        this.CheckInTime = response.message;
      }
    })

    this.GetWorkAnniversaries();
    this.onDateSelect(this.date);
    this.checkForAnniversaries();

  }


  fetchData(): void {
    this.ds.GetleaveRecordById(this.userId).subscribe({
      next: (response) => {
        if (response && response.length > 0) {
          const data = response[0]; // Assuming data is the first element
          this.processData(data);
        }
      },
      error: (err) => console.error('Error fetching data:', err)
    });
  }

  processData(data: any): void {
    const excludeKeys = ['Opening_Balance', 'Year'];
    this.allNumbers = [];
    for (const key in data) {
      if (typeof data[key] === 'number' && !excludeKeys.includes(key)) {
        this.allNumbers.push(data[key]);
      }
    }

    const openingBalance = data.Opening_Balance ?? 0;
    const year = data.Year ?? 0;
    this.totalSum = openingBalance + year;

    this.transformData();
    this.updateChart();
  }

  transformData(): void {
    this.transformedData = this.allNumbers;
  }

  updateChart(): void {
    this.pieChartData.datasets[0].data = [this.totalSum, this.transformedData.reduce((acc, curr) => acc + curr, 0)];
  }
  onMonthChange(): void {
    console.log('Selected Month and Year:', this.selectMonth);
  }

  getCurrentMonth() {
    const today = new Date();
    return today.toISOString().slice(0, 7);
  }

  getmonthlyot() {
    this.ds.GetMonthlyOt(this.userId, this.startDate, this.endDate).subscribe({
      next: (response) => {
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(response);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'data.xlsx');
      }
    })
  }

  otView() {
    this.ds.GetMonthlyOt(this.userId, this.startDate, this.endDate).subscribe(
      {
        next: (response) => {
          this.monthlyOt = response
        }
      }
    )
    this.showFirstCard = false;
    this.showSecondCard = true;

  }

  closeDialog() {
    this.showSecondCard = false;
    this.showFirstCard = true;
  }

  getuserAttendance() {
    this.ds.GetleaveRecordById(this.userId).subscribe({
      next: (response) => {
        this.Attendance = response;
        console.log(this.Attendance)
      },
      error: (err) => {
        console.error('Error retrieving attendance:', err);
      }
    });
  }

  logout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
  }

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view): string => {
    if (view === 'month') {
      const offset = cellDate.getTimezoneOffset();
      const localDate = new Date(cellDate.getTime() - offset * 60 * 1000);
      const dateStr = localDate.toISOString().split('T')[0];
      const isHoliday = this.Holiday.some(holiday => {
        const holidayDateStr = holiday.holidayDate.split('T')[0];
        return holidayDateStr === dateStr;
      });

      const isWorkExperience = this.AnniversariesDetails.some(anniversary => {
        const anniversaryDateStr = anniversary.next_anniversary.toISOString().split('T')[0];
        return anniversaryDateStr === dateStr;
      });

      if (isHoliday) {
        return 'holiday-date';
      } else if (isWorkExperience) {
        return 'work-experience-date';
      }
    }
    return '';
  };

  GetWorkAnniversaries() {
    this.ds.getWorkAnniversaries().subscribe({
      next: (response) => {
        this.AnniversariesDetails = response.map((item: any) => ({
          ...item,
          hiredDate: new Date(item.hiredDate),
          next_anniversary: new Date(item.next_anniversary)
        }));
        console.log(this.AnniversariesDetails)
      },
      error: (error) => console.error('Failed to load anniversaries:', error)
    });
  }
  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear();
  }

  checkForAnniversaries() {
    const anniversaryEmployees = this.encryptionService.checkAnniversaries(this.AnniversariesDetails);
    anniversaryEmployees.forEach(employee => {
      const anniversarydetails = employee.employeeName + employee.Data
      alert(`Today is ${employee.employeeName}'s work anniversary!`);
    });
  }
  onDateSelect(selectedDate: Date): void {
    console.log("Selected Raw Date:", selectedDate);
    const dateString = this.formatDate(selectedDate);
    console.log("Formatted Date:", dateString);

    const transformedEmployees = this.AnniversariesDetails.map(emp => ({
      ...emp,
      hiredDate: this.formatDate(emp.hiredDate),
      next_anniversary: this.formatDate(emp.next_anniversary)
    }));

    const specialDay = transformedEmployees.find(d => d.next_anniversary === dateString);
    if (specialDay) {
      Swal.fire(`Work Anniversary <br>  ${specialDay.employeeName} Celebrating ${specialDay.years_of_service} Year of Excellence`);
      console.log("Found Special Day:", specialDay);
    } else {
      console.log("No special day found for:", dateString);
    }
  }

  formatDate(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  monthlySlip() {
    Swal.fire({
      title: "Do You Want To Request Monthly Slip?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        this.message = this.firstName + ' Requested For Monthly slip';
        this.postMonthlySlip();
        Swal.fire("Sent!", "", "success");
      } else if (result.isDenied) {
      }
    });
  }

  getUanNumber() {
    this.ds.getUanNumber(this.userId).subscribe({
      next: (response) => {
        this.UanNumber = response
        Swal.fire("Your UAN Number : " + this.UanNumber);
      }
    })
  }
  getinsurance() {
    Swal.fire(" Not Updated !!");
  }
  postMonthlySlip() {
    const currentDate = new Date();
    const formattedDate = format(this.currentDate, 'yyyy-MM-dd HH:mm:ss');
    console.log(formattedDate)
    this.ds.postMonthlySlip(this.userId, this.message, formattedDate).subscribe({
      next: (response) => {
        console.log(response);
      }
    })

  }
  showModal(dialog: HTMLDialogElement) {
    dialog.showModal();
  }
  closeModal(dialog: HTMLDialogElement) {
    dialog.close();
  }
}





