import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { EncryptionService } from '../encryption.service';
import * as CryptoJS from 'crypto-js';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  userName!: string;
  userPassword!: string;
  secretKey: string = '4f6c830d'
  userId!: string
  constructor(private ds: DataService, private route: Router) {
  }
  ngOnInit() {
  }
  loginCheck(): void {
    this.ds.UserLogin(this.userName, this.userPassword).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response.result === '2' && response.message === 'Admin Login Successful') {
          this.route.navigateByUrl('/admin');
        } else if (response.result === '1' && response.message === 'Login successful') {
          localStorage.setItem('userName', response.firstName);
          const encryptedUserId = CryptoJS.AES.encrypt(response.notetechId.toString(), this.secretKey).toString();
          localStorage.setItem('userId', encryptedUserId);
          this.route.navigateByUrl('/dashboard');
        } else {
          window.alert("User name or password is incorrect.");
        }
      },
      error: (err) => {
        console.error('Login failed:', err);
        window.alert("User Name or Password is Incorrect . Please try again later.");
      }
    });
  }


}


