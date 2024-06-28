import { Component } from '@angular/core';
import { DataService } from '../data.service';



@Component({
  selector: 'app-date-popup-dialog',
  templateUrl: './date-popup-dialog.component.html',
  styleUrls: ['./date-popup-dialog.component.css']
})
export class DatePopupDialogComponent {
  totalSum = 0;
  allNumbers: number[] = [];

  constructor(private ds: DataService) { }

  ngOnInit(): void {
    const userId = Number(localStorage.getItem('userId'));
    this.ds.GetleaveRecordById(userId).subscribe({
      next: (response) => {
        if (response && response.length > 0) {
          const data = response[0]; // Assuming data is the first element
          this.processData(data);
        }
      },
    });
  }

  processData(data: any): void {
    // Extracting numbers, excluding Opening Balance and Year
    const excludeKeys = ['Opening_Balance', 'Year']; // Keys to exclude from allNumbers
    for (const key in data) {
      if (typeof data[key] === 'number' && !excludeKeys.includes(key)) {
        this.allNumbers.push(data[key]);
      }
    }

    // Calculating the sum of Opening Balance and Year
    const openingBalance = data.Opening_Balance ?? 0;
    const year = data.Year ?? 0;
    this.totalSum = openingBalance + year;
  }
}

