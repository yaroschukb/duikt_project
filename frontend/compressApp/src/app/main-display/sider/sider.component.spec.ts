import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SiderComponent } from './sider.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('SiderComponent', () => {
  let component: SiderComponent;
  let fixture: ComponentFixture<SiderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiderComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [ApiService, provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SiderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Додаємо тест
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
