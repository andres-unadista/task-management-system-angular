// theme.service.ts
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'dark-theme';
  private darkMode = false;

  constructor(@Inject(DOCUMENT) private document: Document) {
      const localStorage = document.defaultView?.localStorage;
  
      if (localStorage) { 
        this.darkMode = localStorage.getItem(this.THEME_KEY) === 'true';
        this.updateTheme();

      }
  }

  isDarkMode() {
    return this.darkMode;
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    localStorage.setItem(this.THEME_KEY, String(this.darkMode));
    this.updateTheme();
  }

  private updateTheme() {
    document.body.classList.toggle('dark-theme', this.darkMode);
  }
}