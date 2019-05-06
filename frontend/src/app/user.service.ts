import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor() { }

  getCurrentUserId() {
    return "5cc8ae000e2786e8f3ab32a4"
  }
}
