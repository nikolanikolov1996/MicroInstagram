import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { IPhoto } from "./photos";
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class PhotosService {
    baseUrl: string = 'https://jsonplaceholder.typicode.com/photos';

    constructor(private http: HttpClient) { }

    getPhotos(): Observable<IPhoto[]> {
        return this.http.get<IPhoto[]>(this.baseUrl).pipe(
            catchError(this.handleError)
        )
    }

    private handleError(err: HttpErrorResponse) {
        let errorMessage = '';
        // A client side error
        if (err.error instanceof ErrorEvent) {
            errorMessage = `An error occured:  ${err.error.message}`;
        }
        else {
            // Unsuccessful response code
            errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
        }
        console.error(errorMessage);
        return throwError(errorMessage);
    }

    getPhoto(id: number): Observable<IPhoto> {
        const url = `${this.baseUrl}/${id}`;
        return this.http.get<IPhoto>(url).pipe(
            catchError(this.handleError)
        )
    }

    updatePhoto(photo: IPhoto): Observable<IPhoto> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const url = `${this.baseUrl}/${photo.id}`;
        return this.http.put<IPhoto>(url, photo, { headers })
            .pipe(
                tap(() => console.log('updatePhoto: ' + photo.id)),
                // Return the product on an update
                map(() => photo),
                catchError(this.handleError)
            );
    }

    deletePhoto(id: number): Observable<{}> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const url = `${this.baseUrl}/${id}`;
        return this.http.delete<IPhoto>(url, { headers })
            .pipe(
                tap(data => console.log('deletePhoto: ' + id)),
                catchError(this.handleError)
            );
    }

    uploadPhoto(photo: IPhoto): Observable<IPhoto> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<IPhoto>(this.baseUrl, photo, { headers })
            .pipe(
                tap(data => console.log('uploadPhoto: ' + JSON.stringify(data))),
                catchError(this.handleError)
            );
    }

}

