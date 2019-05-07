import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor() { }
  userId: string;

  setCurrentUserId(userId: string) {
    this.userId = userId
  }

  getCurrentUserId() {
    return this.userId
  }
}
