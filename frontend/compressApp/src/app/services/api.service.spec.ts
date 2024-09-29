import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should handle error correctly', () => {
    service.getCompressedPhoto().subscribe(
      () => fail('Expected an error, but got a response'),
      (error) => {
        expect(error.message).toBe(
          'Server-side error: 404 - Http failure response for api/getphoto: 404 Not Found'
        );
      }
    );

    // Імітуємо помилку 404
    const req = httpMock.expectOne('api/getphoto');
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  });
});
