import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getCompressedPhoto(): Observable<any> {
    return this.http.get<any>('/getphoto').pipe(
      catchError(this.handleError) // Обробка помилок
    );
  }

  uploadImageToServer(data: any): Observable<HttpEvent<any>> {
    console.log('file in api service', data);
    const formData = new FormData();
    formData.append('image', data.file);
    console.log('formdata in api service', formData);
    return this.http.post('/api/upload', formData, {
      reportProgress: true,
      observe: 'events',
      headers: new HttpHeaders({
        enctype: 'multipart/form-data',
      }),
    });
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

  getTestData(): string[] {
    return ['data1', 'data2', 'data3'];
  }
}
