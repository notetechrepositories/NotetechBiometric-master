import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdmindashboardComponent } from './admindashboard/admindashboard.component';
import { AttendanceRegisterComponent } from './attendance-register/attendance-register.component';
import { authguardGuard } from './authguard.guard';
import { authguard2Guard } from './authguard2.guard';
import { UserProfileComponent } from './user-profile/user-profile.component';

const routes: Routes = [
  {
    path: '', component: LoginComponent,
    canActivate: [authguard2Guard]
  },
  {
    path: 'register', component: RegistrationComponent
  },
  {
    path: 'dashboard', component: DashboardComponent,
    canActivate: [authguardGuard]
  },
  {
    path: 'admin', component: AdmindashboardComponent
  },
  {
    path: 'attendance', component: AttendanceRegisterComponent
  },
  {
    path: 'user-profile', component: UserProfileComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


