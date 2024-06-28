import { Time } from "@angular/common";
import { Data } from "@angular/router";

export interface Employeeattandance {
    emp_id: string;
    employeeName: string;
    work_hours: Time;
    work_date: Data;
    check_in_time: Time;
    check_out_time: Time;
}
