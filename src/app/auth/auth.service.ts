import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';

import { User } from './user.model';

export interface AuthResponseData {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    isLogin = signal<boolean>(false);
//   user = new BehaviorSubject<User>(null);
//   private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  signUp(email: string, password: string, name: string) {
    const url = 'http://localhost:8000/api/user/create/';
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });

    return this.http
      .post<AuthResponseData>(
        url,
        {
          email: email,
          password: password,
          name: name,
        },
        { headers }
      )
      .pipe(
        catchError(this.handleError),

      );
  }

  getToken(email: string, password: string) {
    const url = 'http://localhost:8000/api/user/token/';
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        // 'Access-Control-Allow-Origin': '*'
      });

    return this.http
      .post<AuthResponseData>(
        url,
        {
          email: email,
          password: password,
        },
        { headers }
      )
      .pipe(
        catchError(this.handleError),
         tap(resData => {
            localStorage.setItem('userData', JSON.stringify(resData.token));
        })
      );
  }

  login(token: string) {
    const url = 'http://localhost:8000/api/recipe/recipes/';
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      });

    return this.http
      .get<AuthResponseData>(
        url,
        { headers }
      )
      .pipe(
        catchError(this.handleError),
        tap(resData => {
            this.isLogin.update(prevState => !prevState)
        })
      );
  }

  logout() {
    console.log("LOGOUT")
    this.isLogin.update(prevState => !prevState)
    this.router.navigate(['']);
    localStorage.removeItem('userData');
  }


//   autoLogout(expirationDuration: number) {
//     this.tokenExpirationTimer = setTimeout(() => {
//       this.logout();
//     }, expirationDuration);
//   }

//   private handleAuthentication(
//     token: string,

//   ) {
//     // const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
//     const user = new User(this.e, userId, token, expirationDate);
//     this.user.next(user);
//     this.autoLogout(expiresIn * 1000);
//     localStorage.setItem('userData', JSON.stringify(user));
//   }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct.';
        break;
    }
    return throwError(errorMessage);
  }
}
