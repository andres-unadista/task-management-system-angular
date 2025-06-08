// register.component.ts
import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ThemeService } from '../../services/theme.service';
import { AuthService, UserRegistration } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  private authService: AuthService = inject(AuthService);
  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });
  router = inject(Router);

  constructor(private themeService: ThemeService) {}

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }

    
  register(user: UserRegistration) {
    this.authService.register(user).subscribe({
      next: () => {
        // Handle successful registration
        this.router.navigate(['/'])
      },
      error: (error) => {
        // Handle error
        console.error('Error', error)
      }
    });
  }


  onSubmit() {
    if (this.registerForm.valid) {
      let email = this.registerForm.value.email!;
      let name = this.registerForm.value.name!;
      let password = this.registerForm.value.password!;
      this.register({name, email, password})
    }
  }
}