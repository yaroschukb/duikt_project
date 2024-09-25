import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getCompressedPhoto(): Observable<any> {
    return this.http.get<any>('api/getphoto').pipe(
      catchError(this.handleError) // Обробка помилок
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error && error.error.message) {
      // Client-side error
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server-side error: ${error.status} - ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
