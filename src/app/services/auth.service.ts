import { HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, from, Observable, throwError } from 'rxjs';
import { User } from 'src/app/models/user/user';
import { AppConfig } from '../app.config'
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HVPhoto } from '../models/photo';

@Injectable({ providedIn: 'root' })

export class AuthService {

  @Output() loggedIn: EventEmitter<boolean> = new EventEmitter();


  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;
  private baseUrl = AppConfig.BASE_URL;


  constructor(
    private router: Router,
    private http: HttpClient) {
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user'))); //!!NE MICAT!!!!!!
    this.user = this.userSubject.asObservable();

  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  isAdmin(): boolean {
    return this.isLoggedIn() && this.userSubject.value.username === "admin";
  }

  login(username, password) {
    return this.http.post<User>(`${this.baseUrl}/auth`, { username, password })
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        console.log(user);
        user.password = password;
        this.saveUser(user);
        return user;
      }), catchError(this.handleError));
  }


  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.loggedIn.emit(false);
  }

  delete(userToDelete: User) {
    let typeOfUser = userToDelete.isVisitor ? 'visitor' : 'organizer';
    let typeOfUser2 = userToDelete.isVisitor ? 'Visitor' : 'Organizer';
    let header = new HttpHeaders().set("Authorization", 'Basic ' + userToDelete.authBasic);

    return this.http.delete<User>(`${this.baseUrl}/${typeOfUser}/${userToDelete.username}/delete${typeOfUser2}`, { headers: header })
      .pipe(map(user => {
        console.log("Deleted account successfully!")
        this.logout();
        return user;
      }), catchError(this.handleError));
  }


  register(userToRegister: User, typeOfUser: String): Observable<Object> {

    return this.http.post<User>(`${this.baseUrl}/${typeOfUser}/register`, userToRegister)
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        user.password = userToRegister.password;
        this.saveUser(user);
        return user;
      }), catchError(this.handleError));
  }


  update(userToUpdate: User): Observable<Object> {
    let typeOfUser = userToUpdate.isVisitor ? 'visitor' : 'organizer';
    let typeOfUser2 = userToUpdate.isVisitor ? 'Visitor' : 'Organizer';
    let header = new HttpHeaders().set("Authorization", 'Basic ' + userToUpdate.authBasic);

    return this.http.put<User>(`${this.baseUrl}/${typeOfUser}/${userToUpdate.username}/update${typeOfUser2}`, userToUpdate, { headers: header })
      .pipe(map(user => {
        this.saveUser(userToUpdate);
        return user;
      }), catchError(this.handleError));
  }

  getPhoto(user: User): Observable<HVPhoto> {
    let typeOfUser = user.isVisitor ? 'visitor' : 'organizer';

    return this.http.get<HVPhoto>(`${this.baseUrl}/${typeOfUser}/image/${user.username}`)
      .pipe(map(photo => {
        console.log(photo);
        return photo;
      }), catchError(this.handleError));
  }

  getVisitorByUsername(username: string): Observable<User> {
    let header = new HttpHeaders().set("Authorization", 'Basic ' + this.userValue.authBasic);

    return this.http.get<User>(`${this.baseUrl}/visitor/${username}`, { headers: header })
    .pipe(map(user => {
      user.isVisitor = true;
      return user;
    }), catchError(this.handleError));
  }

  getOrganizerByUsername(username: string): Observable<User> {
  return this.http.get<User>(`${this.baseUrl}/organizer/${username}`)
    .pipe(map(user => {
      user.isVisitor = false;
      return user;
    }), catchError(this.handleError));
  }

  getAllVisitors(): Observable<User[]> {
    let header = new HttpHeaders().set("Authorization", 'Basic ' + this.userValue.authBasic);

    return this.http.get<User[]>(`${this.baseUrl}/visitor`, { headers: header })
    .pipe(map(users => {
      return users;
    }), catchError(this.handleError));
  }

  getAllOrganizers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/organizer`)
    .pipe(map(users => {
      return users;
    }), catchError(this.handleError));
  }

  saveUser(user: User) {
    localStorage.removeItem('user');
    user.authBasic = window.btoa(user.username + ':' + user.password);
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
    this.loggedIn.emit(true);
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
    return localStorage.getItem('user') !== null;
  }
}
