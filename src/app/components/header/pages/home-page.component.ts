import { Component, inject } from '@angular/core';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  template: `
    <section>
      <h1>{{ lang.currentLang() === 'sr' ? 'Почетна' : 'Home' }}</h1>
    </section>
  `
})
export class HomePageComponent {
  lang = inject(LanguageService);
}
