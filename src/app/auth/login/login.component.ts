// login.component.ts
import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  router = inject(Router);
  private authService: AuthService = inject(AuthService);
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  constructor(private themeService: ThemeService) {}

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }

  login(email: string, password: string) {
    this.authService.login({email, password}).subscribe({
      next: (response) => {
        console.log(response)
        this.router.navigate(['/projects'])
      },
      error: (error) => {
        // Handle error
        console.error('Error', error)
      }
    });  
  }

  logout(){
    this.authService.logout();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      let email = this.loginForm.value.email!;
      let password = this.loginForm.value.password!;
      this.login(email, password);
      console.log(this.loginForm.value);
    }
  }
}