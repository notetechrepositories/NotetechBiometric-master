import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  isLoggedIn(): boolean {
    var token = localStorage.getItem("userId");
    if (token != null) {
      return true;
    }
    else {
      return false;
    }
  }
}
