import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TabViewModule } from 'primeng/tabview';
import { KnobModule } from 'primeng/knob';
import { TableModule } from 'primeng/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { AdmindashboardComponent } from './admindashboard/admindashboard.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatePopupDialogComponent } from './date-popup-dialog/date-popup-dialog.component';
import { CalendarModule } from 'primeng/calendar';
import { TooltipModule } from 'primeng/tooltip';
import { MenubarModule } from 'primeng/menubar';
import { DropdownModule } from 'primeng/dropdown';
import { NgChartsModule } from 'ng2-charts';
import { AttendanceRegisterComponent } from './attendance-register/attendance-register.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    DashboardComponent,
    AdmindashboardComponent,
    DatePopupDialogComponent,
    AttendanceRegisterComponent,
    UserProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    TabViewModule,
    MatDatepickerModule,
    KnobModule,
    MatCardModule,
    BrowserAnimationsModule,
    MatNativeDateModule,
    TableModule,
    MatTooltipModule,
    CalendarModule,
    TooltipModule,
    MenubarModule,
    DropdownModule,
    NgChartsModule,


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
