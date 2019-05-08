import { Injectable, OnInit } from '@angular/core';
import { User } from './types'

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit {
  constructor() {}
  userId: string;
  users: User[] = [
    {name: 'Eric', userId: '5cd1c80e80dd8973784de539'},
    {name: 'Jose', userId: '5cd1c82380dd8973784de53a'}
  ];

  ngOnInit() {
    this.userId = this.users[0].userId
  }

  getAllUsers() {
    return this.users
  }

  setCurrentUserId(userId: string) {
    this.userId = userId
  }

  getCurrentUserId() {
    if (!this.userId) {
      this.userId = this.users[0].userId
    }
    return this.userId
  }
}
