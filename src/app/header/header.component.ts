import {Component, inject, OnInit} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {LanguageService} from "../services/language.service";

export interface NavChild {
  labelSr: string;
  labelEn: string;
  route: string;
}

export interface NavItem {
  labelSr: string;
  labelEn: string;
  route?: string;
  children?: NavChild[];
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  lang = inject(LanguageService)
  isMenuOpen = false
  activeDropdown: string | null = null

  navItems: NavItem[] = [
    {
      labelSr: 'Početna',
      labelEn: 'Home',
      route: '/'
    },
    {
      labelSr: 'Aranžmani',
      labelEn: 'Arrangements',
      children: [
        { labelSr: 'Evropa',    labelEn: 'Europe',      route: '/aranzmani/evropa'    },
        { labelSr: 'Leto 2025', labelEn: 'Summer 2025', route: '/aranzmani/leto-2025' },
        { labelSr: 'Zima 2025', labelEn: 'Winter 2025', route: '/aranzmani/zima-2025' },
      ]
    },
    {
      labelSr: 'Galerija',
      labelEn: 'Gallery',
      route: '/galerija'
    },
    {
      labelSr: 'Moj nalog',
      labelEn: 'My Account',
      route: '/moj-nalog'
    },
    {
      labelSr: 'O nama',
      labelEn: 'About',
      route: '/o-nama'
    },
  ];

  getLabel(item: NavItem | NavChild): string {
    return this.lang.currentLang() === 'sr' ? item.labelSr : item.labelEn;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleDropdown(label: string): void {
    this.activeDropdown = this.activeDropdown === label ? null : label;
  }

  closeDropdown(): void {
    this.activeDropdown = null;
  }

}
