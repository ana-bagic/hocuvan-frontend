import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { User } from 'src/app/models/user/user';


import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })

export class AuthService {

  @Output() loggedIn: EventEmitter<boolean> = new EventEmitter();

  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;
  private isActive = false;
  private baseUrl = 'http://localhost:8080';


  constructor(
    private router: Router,
    private http: HttpClient) {
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  login(username, password) {
    return this.http.post<User>(`${this.baseUrl}/auth`, { username, password })
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        this.loggedIn.emit(true);
        this.isActive = true;
        console.log(user.username + "  logged in successfully!")
        return user;
      }), catchError(this.handleError));
  }


  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }



  register(user: Object, typeOfUser: String): Observable<Object> {


    return this.http.post<User>(`${this.baseUrl}` + `/` + typeOfUser + `/register`, user)
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        this.isActive = true;
        console.log(user.username + "  registered  successfully!")
        this.loggedIn.emit(true);
        return user;
      }), catchError(this.handleError));
  }


  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
      throwError(error.error)
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error.message}`);

      return throwError(error.error)
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Došlo je do pogreške, molimo pokušajte kasnije.');
  }

  isLoggedIn(): boolean {
    return this.isActive;
  }
}
