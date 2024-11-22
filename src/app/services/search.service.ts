import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppConfig } from 'src/app/app.config'
import { HVEvent } from 'src/app/models/event/event';
import { Stats } from 'src/app/models/stats';
import { AuthService } from './auth.service';
import { CategoryCard } from '../models/categoryCard';


@Injectable({ providedIn: 'root' })

export class SearchService {

    private baseUrl = AppConfig.BASE_URL

    constructor(private http: HttpClient, private authService: AuthService) { }


    getAllEvents(): Observable<HVEvent[]> {
        return this.http.get<HVEvent[]>(`${this.baseUrl}/events`)
            .pipe(map(events => {
                console.log("returning all events...")
                console.log(events)
                events.forEach((e) => e.date = new Date(e.date.toString().slice(0, 16)));
                return events;
            }), catchError(this.handleError));
    }

    getRecommendedEvents(): Observable<HVEvent[]> {
        let user = this.authService.userValue;
        let header = new HttpHeaders().set("Authorization", 'Basic ' + user.authBasic);

        return this.http.get<HVEvent[]>(`${this.baseUrl}/preferences/${user.username}/favourites`, { headers: header })
            .pipe(map(events => {
                events.forEach((e) => e.date = new Date(e.date.toString().slice(0, 16)));
                return events;
            }), catchError(this.handleError));
    }

    getPopularEvents(): Observable<HVEvent[]> {
        return this.http.get<HVEvent[]>(`${this.baseUrl}/events/mostPopularEvents`)
            .pipe(map(events => {
                console.log(events);
                events.forEach((e) => e.date = new Date(e.date.toString().slice(0, 16)));
                return events;
            }), catchError(this.handleError));
    }

    getFilterdEvents(filter: Object): Observable<HVEvent[]> {
        return this.http.post<HVEvent[]>(`${this.baseUrl}/events/filterEvents`, filter)
            .pipe(map(events => {
                events.forEach((e) => e.date = new Date(e.date.toString().slice(0, 16)));
                return events;
            }), catchError(this.handleError));
    }



    getFavEventsForUser(): Observable<HVEvent[]> {
        let user = this.authService.userValue;
        let header = new HttpHeaders().set("Authorization", 'Basic ' + user.authBasic);

        return this.http.get<HVEvent[]>(`${this.baseUrl}/visitor/events`, { headers: header })
            .pipe(map(events => {
                events.forEach((e) => e.date = new Date(e.date.toString().slice(0, 16)));
                return events;
            }), catchError(this.handleError));
    }

    getOrganizerEvents(): Observable<HVEvent[]> {
        let user = this.authService.userValue;

        // ovo ce trebati promijeniti kad se doda da drugi korisnici mogu pretrazivati ovo
        return this.http.get<HVEvent[]>(`${this.baseUrl}/events/organizer/${user.username}`)
            .pipe(map(events => {
                events.forEach((e) => e.date = new Date(e.date.toString().slice(0, 16)));
                return events;
            }), catchError(this.handleError));
    }

    getLocations(): Observable<String[]> {
        return this.http.get<String[]>(`${this.baseUrl}/organizer/headquarters`)
            .pipe(map(events => {
                return events;
            }), catchError(this.handleError));
    }

    getCategories(): Observable<CategoryCard[]> {
        return this.http.get<CategoryCard[]>(`${this.baseUrl}/eventcategories`)
            .pipe(map(categories => {
                return categories;
            }), catchError(this.handleError));
    }

    getStats(): Observable<Stats> {
        return this.http.get<Stats>(`${this.baseUrl}/stats`)
            .pipe(map(stats => {
                return stats;
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









}
