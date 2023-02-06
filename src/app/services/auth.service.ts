import { Injectable } from '@angular/core';
import 'firebase/compat/auth';
import { Router } from '@angular/router';

import firebase from 'firebase/compat/app';
import { environment } from 'src/environments/environment';

import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  emailVerified: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any;

  constructor(private router: Router, private snackBar: MatSnackBar) {
    firebase.initializeApp(environment.firebase);
  }

  async SignIn(email: string, password: string) {
    try {
      let loginAction = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);

      this.router.navigate(['/users']);

      this.snackBar.open('Login Success', 'Success', {
        duration: 2 * 1000,
      });

      localStorage.setItem('userId', loginAction.user?.uid!);
      localStorage.setItem('token', loginAction.user?.refreshToken!);
      localStorage.setItem(
        'userData',
        JSON.stringify(loginAction.user?.providerData[0])
      );

      this.userData = loginAction.user;
    } catch (error) {
      this.snackBar.open('Login Failure/Invalid credentials', 'Failure', {
        duration: 2 * 1000,
      });
    }
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('userData')!);
    return user !== null ? true : false;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/landing']);
  }
}
