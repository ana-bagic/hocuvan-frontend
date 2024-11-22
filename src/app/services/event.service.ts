import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { AppConfig } from 'src/app/app.config'
import { HVEvent } from 'src/app/models/event/event';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { User } from '../models/user/user';
import { AuthService } from 'src/app/services/auth.service';
import { EventLocation } from '../models/event/event-location';
import { HVPhoto } from '../models/photo';
import { Reply } from '../models/reply';

@Injectable({ providedIn: 'root' })

export class EventService {

    private baseUrl = AppConfig.BASE_URL

    constructor(private httpClient: HttpClient, private authService: AuthService) { }

    selectImComing(eventId: String): Observable<Reply> {
        let user = this.authService.userValue;
        let header = new HttpHeaders().set("Authorization", 'Basic ' + user.authBasic);

        return this.httpClient.get<Reply>(`${this.baseUrl}/events/addToFavourites/${eventId}`, { headers: header })
            .pipe(map(response => {
                console.log(response);
                return response;
            }), catchError(this.handleError));
    }

    deselectImComing(eventId: String): Observable<Reply> {
        let user = this.authService.userValue;
        let header = new HttpHeaders().set("Authorization", 'Basic ' + user.authBasic);

        return this.httpClient.get<Reply>(`${this.baseUrl}/events/removeFromFavourites/${eventId}`, { headers: header })
            .pipe(map(response => {
                console.log(response);
                return response;
            }), catchError(this.handleError));
    }

    showEventsVisitors(eventId: String): Observable<User[]> {
        let user = this.authService.userValue;
        let header = new HttpHeaders().set("Authorization", 'Basic ' + user.authBasic);

        return this.httpClient.get<User[]>(`${this.baseUrl}/events/visitors/${eventId}`, { headers: header })
            .pipe(map(users => {
                return users;
            }), catchError(this.handleError));
    }

    getEventById(eventId: String): Observable<HVEvent> {
        return this.httpClient.get<HVEvent>(`${this.baseUrl}/events/${eventId}`)
            .pipe(map(event => {
                event.date = new Date(event.date.toString().slice(0, 16));
                return event;
            }), catchError(this.handleError));
    }

    getEventLocation(eventId: String): Observable<EventLocation>{
        return this.httpClient.get<EventLocation>(`${this.baseUrl}/events/${eventId}/getEventLocation`).pipe(map(location => {
            return location;
        }), catchError(this.handleError));
    }

    createEvent(event: HVEvent): Observable<HVEvent> {
        let user = this.authService.userValue;
        let header = new HttpHeaders().set("Authorization", 'Basic ' + user.authBasic);

        return this.httpClient.post<HVEvent>(`${this.baseUrl}/events/${user.username}/createEvent`, event, { headers: header })
            .pipe(map(event => {
                event.date = new Date(event.date.toString().slice(0, 16));
                return event;
            }), catchError(this.handleError));
    }

    updateEvent(event: HVEvent): Observable<HVEvent> {
        let user = this.authService.userValue;
        let header = new HttpHeaders().set("Authorization", 'Basic ' + user.authBasic);

        return this.httpClient.put<HVEvent>(`${this.baseUrl}/events/${user.username}/updateEvent/${event.eventId}`, event, { headers: header })
            .pipe(map(event => {
                event.date = new Date(event.date.toString().slice(0, 16));
                return event;
            }), catchError(this.handleError));
    }

    deleteEvent(eventId): Observable<HVEvent> {
        let user = this.authService.userValue;
        let header = new HttpHeaders().set("Authorization", 'Basic ' + user.authBasic);

        return this.httpClient.delete<HVEvent>(`${this.baseUrl}/events/${user.username}/deleteEvent/${eventId}`, { headers: header })
            .pipe(map(event => {
                event.date = new Date(event.date.toString().slice(0, 16));
                return event;
            }), catchError(this.handleError));
    }

    getPhoto(eventId: string): Observable<HVPhoto> {
        return this.httpClient.get<HVPhoto>(`${this.baseUrl}/events/image/${eventId}`)
            .pipe(map(photo => {
                console.log(photo);
                return photo;
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