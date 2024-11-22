import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AppConfig } from 'src/app/app.config'
import { AuthService } from './auth.service';
import { CategoryCard } from '../models/categoryCard';
import { CategoryPost } from '../models/categoryPost';

@Injectable({ providedIn: 'root' })

export class CategoriesService {

    private baseUrl = AppConfig.BASE_URL


    constructor(private router: Router, private http: HttpClient, private authService: AuthService) { }



    setFavouriteCategories(categories: CategoryCard[]): Observable<any> {  //jedna po jedna kategorija... radi konfiguracije backenda
        categories.forEach(cat => {

            var categoryPost = new CategoryPost;
            categoryPost = { "categoryId": cat.categoryId, "categoryName": cat.categoryName }
            this.setFavouriteCategory(categoryPost).subscribe(result => console.log(result));
        });
        return null;
    }

    setFavouriteCategory(category: CategoryPost): Observable<any> {
        let user = this.authService.userValue;
        let header = new HttpHeaders().set("Authorization", 'Basic ' + user.authBasic);

        console.log(category.categoryName);
        return this.http.post<CategoryPost>(`${this.baseUrl}/preferences/addFavourites`, category, { headers: header })
            .pipe(map(message => {
                console.log("saved category");
                return message;
            }), catchError(this.handleError));
    }

    getFavouriteCategoriesForUser(): Observable<CategoryCard[]> {
        let user = this.authService.userValue;
        let header = new HttpHeaders().set("Authorization", 'Basic ' + user.authBasic);

        return this.http.get<CategoryCard[]>(`${this.baseUrl}/preferences/${user.username}/getCategories`, { headers: header })
            .pipe(map(categories => {
                return categories;
            }), catchError(this.handleError));
    }

    deleteAllCategoriesForUser(): Observable<String> {
        let user = this.authService.userValue;
        let header = new HttpHeaders().set("Authorization", 'Basic ' + user.authBasic);

        return this.http.delete<String>(`${this.baseUrl}/preferences/${user.username}/deleteFavourites`, { headers: header })
            .pipe(map(message => {
                console.log(message);
                return message;
            }), catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse) {
        console.log("neka greska");

        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
            throwError(error.error)
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong.
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.message}`);

            return throwError(error.error)
        }
        // Return an observable with a user-facing error message.
        return throwError(
            'Došlo je do pogreške, molimo pokušajte kasnije.');
    }

}