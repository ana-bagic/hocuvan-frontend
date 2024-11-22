import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppConfig } from 'src/app/app.config'
import { Reply } from '../models/reply';
import { Review } from '../models/review';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })

export class ReviewService {
    private baseUrl = AppConfig.BASE_URL

    constructor(private httpClient: HttpClient, private authService: AuthService) { }

    updateReview(review: Review, reviewId: String): Observable<Review> {
        let user = this.authService.userValue;
        let header = new HttpHeaders().set("Authorization", 'Basic ' + user.authBasic);

        return this.httpClient.put<Review>(`${this.baseUrl}/reviews/${reviewId}/updateReview`, review, { headers: header })
            .pipe(map(review => {
                return review;
            }), catchError(this.handleError));
    }

    deleteReview(reviewId: String): Observable<Review> {
        let user = this.authService.userValue;
        let header = new HttpHeaders().set("Authorization", 'Basic ' + user.authBasic);

        return this.httpClient.delete<Review>(`${this.baseUrl}/reviews/${reviewId}/deleteReview`, { headers: header })
            .pipe(map(review => {
                return review;
            }), catchError(this.handleError));
    }

    updateReply(reply: Reply, reviewId: String): Observable<Reply> {
        let user = this.authService.userValue;
        let header = new HttpHeaders().set("Authorization", 'Basic ' + user.authBasic);

        return this.httpClient.put<Reply>(`${this.baseUrl}/reviews/${reviewId}/updateReply`, reply, { headers: header })
            .pipe(map(reply => {
                return reply;
            }), catchError(this.handleError));
    }

    replyToReview(reviewId: String, reply: Reply): Observable<Review> {
        let user = this.authService.userValue;
        let header = new HttpHeaders().set("Authorization", 'Basic ' + user.authBasic);

        return this.httpClient.post<Review>(`${this.baseUrl}/reviews/${reviewId}/replyToReview`, reply, { headers: header })
            .pipe(map(reply => {
                return reply;
            }), catchError(this.handleError));
    }

    createReview(review: Review, eventId: String) {
        let user = this.authService.userValue;
        let header = new HttpHeaders().set("Authorization", 'Basic ' + user.authBasic);

        return this.httpClient.post<Review>(`${this.baseUrl}/reviews/${eventId}/createReview`, review, { headers: header })
            .pipe(map(review => {
                review.date = new Date();
                return review;
            }), catchError(this.handleError));
    }

    getAllReviewsOfEvent(eventId: String): Observable<Review[]> {
        let user = this.authService.userValue;
        let header = new HttpHeaders().set("Authorization", 'Basic ' + user.authBasic);

        return this.httpClient.get<Review[]>(`${this.baseUrl}/reviews/${eventId}/getEventReviews`, { headers: header })
            .pipe(map(reviews => {
                return reviews;
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