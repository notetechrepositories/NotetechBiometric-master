import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  constructor() { }
  encryId: string = '';
  ngOnInit() {
  }
  getDecryptedUserId(): string | null {
    const encryptedUserId = localStorage.getItem('userId');
    if (!encryptedUserId) return null; // Check if there actually is an item stored
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedUserId, '4f6c830d');
    const decryptedUserId = decryptedBytes.toString(CryptoJS.enc.Utf8);
    return decryptedUserId;
  }

  checkAnniversaries(employees: any[]): any[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return employees.filter(employee => {
      const nextAnniversary = new Date(employee.next_anniversary);
      nextAnniversary.setHours(0, 0, 0, 0);
      return nextAnniversary.getTime() === today.getTime();
    });
  }
}








