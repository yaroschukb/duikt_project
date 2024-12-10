import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getCompressedPhoto(): Observable<
    { id: string; filename: string; data: string }[]
  > {
    return this.http
      .get<any>('/api/getphoto')
      .pipe(catchError(this.handleError));
  }

  uploadImageToServer(data: any): Observable<HttpEvent<any>> {
    return this.http.post('/api/upload', data, {
      reportProgress: true,
      observe: 'events',
      responseType: 'json',
    });
  }

  deleteImageService(id: string): Observable<HttpEvent<any>> {
    console.log(id);

    return this.http.delete<HttpEvent<any>>(`/api/images/${id}`, {
      observe: 'events',
    });
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error && error.error.message) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server-side error: ${error.status} - ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
