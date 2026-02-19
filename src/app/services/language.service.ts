import {Injectable, signal} from '@angular/core';

export type Lang = 'sr' | 'en'

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  currentLang = signal<Lang>('sr')

  toggle(): void {
    this.currentLang.set(this.currentLang() == 'sr' ? 'en' : 'sr')
  }

  setLang(lang: Lang): void {
    this.currentLang.set(lang)
    localStorage.setItem('lang', lang)
  }

  loadSaved(): void {
    const saved = localStorage.getItem('lang') as Lang
    if (saved) this.currentLang.set(saved)
  }
}
