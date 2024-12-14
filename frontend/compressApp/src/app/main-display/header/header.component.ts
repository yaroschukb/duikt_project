import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzModalComponent, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NzButtonModule,
    NzFormModule,
    NzModalComponent,
    ReactiveFormsModule,
    CommonModule,
    NzCheckboxModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  providers: [NzModalService],
})
export class HeaderComponent {
  isSignUpVisible = false;
  isLogInVisible = false;
  signUpForm: FormGroup;
  logInForm: FormGroup;
  loading = false;
  constructor(private fb: FormBuilder) {
    this.signUpForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.logInForm = this.fb.group({
      username: this.fb.control('', [Validators.required]),
      password: this.fb.control('', [Validators.required]),
      remember: this.fb.control(true),
    });
  }
  showModal(i: string | number): void {
    i === 1 ? (this.isSignUpVisible = true) : (this.isLogInVisible = true);
  }

  handleCancel(): void {
    this.isSignUpVisible = false;
    this.isLogInVisible = false;
    this.signUpForm.reset();
    this.logInForm.reset();
  }

  onSubmit(): void {
    if (this.signUpForm.valid) {
      this.loading = true;
      console.log('Form data:', this.signUpForm.value);
    }
  }
}
