import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { provideHttpClient } from '@angular/common/http';

describe('ApiService', () => {
  let service: ApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [ApiService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Переконайтеся, що немає невирішених HTTP-запитів після кожного тесту
    httpTestingController.verify();
  });

  it('should handle error correctly', () => {
    service.getCompressedPhoto().subscribe(
      () => fail('Expected an error, but got a response'),
      (error) => {
        expect(error.message).toBe(
          'Server-side error: 404 - Http failure response for /getphoto: 404 Not Found'
        );
      }
    );

    // Симулюємо помилку 404
    const req = httpTestingController.expectOne('/getphoto');
    req.flush('404 Not Found', { status: 404, statusText: 'Not Found' });
  });
});
