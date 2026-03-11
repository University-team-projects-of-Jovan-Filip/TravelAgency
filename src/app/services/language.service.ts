import {Injectable, signal} from '@angular/core';

export type Lang = 'sr' | 'en'

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  currentLang = signal<Lang>('sr')

  toggle(): void {
    this.setLang(this.currentLang() === 'sr' ? 'en' : 'sr')
  }

  setLang(lang: Lang): void {
    this.currentLang.set(lang)
    localStorage.setItem('lang', lang)
  }

  loadSaved(): void {
    const saved = localStorage.getItem('lang')
    if (saved === 'sr' || saved === 'en') this.currentLang.set(saved)
  }
}
