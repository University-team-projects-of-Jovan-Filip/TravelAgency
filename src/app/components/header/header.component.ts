import {Component, inject} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {RouterModule} from '@angular/router';
import { LanguageService } from '../../services/language.service';

export interface NavItem {
  labelSr: string;
  labelEn: string;
  route: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  lang = inject(LanguageService)
  isMobileMenuOpen = false;

  navItems: NavItem[] = [
    {
      labelSr: 'Почетна',
      labelEn: 'Home',
      route: '/'
    },
    {
      labelSr: 'Галерија',
      labelEn: 'Gallery',
      route: '/galerija'
    },
    {
      labelSr: 'Аранжмани',
      labelEn: 'Arrangements',
      route: '/aranzmani'
    },
    {
      labelSr: 'Мој налог',
      labelEn: 'My Account',
      route: '/moj-nalog'
    },
    {
      labelSr: 'О нама',
      labelEn: 'About',
      route: '/o-nama'
    },
  ];

  getLabel(item: NavItem): string {
    return this.lang.currentLang() === 'sr' ? item.labelSr : item.labelEn;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
}
