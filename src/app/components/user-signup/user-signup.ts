import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Common } from '../../service/common';
import { CommonHttp } from '../../service/common-http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-signup',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-signup.html',
  styleUrl: './user-signup.scss'
})
export class UserSignup {
  commonHttp = inject(CommonHttp);
  router = inject(Router);

  activeTab: 'login' | 'register' = 'login';
  countryList = ['India', 'USA', 'UK', 'Canada', 'Australia'];
  registerForm: FormGroup;
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private toaster: Common) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.email]],
      country: ['', [Validators.required]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Async validator in third argument
      password: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  loginUser() {
    if (this.loginForm.valid) {
      this.commonHttp.login(this.loginForm.value).subscribe(res => {
        if (res?.status == 'success') {
          this.toaster.showSuccess('success', res.message);
          sessionStorage.setItem('token', res.data.token);
          this.router.navigateByUrl('chat');
        }
      }, err => {
        this.toaster.showSuccess('error', err.error.message);
      })
    }
  }

  registerUser() {
    if (this.registerForm.valid) {
      this.commonHttp.register(this.registerForm.value).subscribe(res => {
        if (res?.status == 'success') {
          this.toaster.showSuccess('success', res.message);
          sessionStorage.setItem('token', res.data.token);
          this.router.navigateByUrl('chat');
        }
      }, err => {
        this.toaster.showSuccess('error', err.error.message);
      })
    }
  }

}
