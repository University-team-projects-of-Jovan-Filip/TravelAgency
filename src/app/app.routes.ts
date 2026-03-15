import { Routes } from '@angular/router';
import { HomePageComponent } from './components/header/pages/home-page.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { ArrangementsPageComponent } from './components/header/pages/arrangements-page.component';
import { AccountPageComponent } from './components/header/pages/account-page.component';
import { AboutPageComponent } from './components/header/pages/about-page.component';
import { ArrangementDetailPageComponent } from './components/arrangements/arrangement-detail-page.component';

export const routes: Routes = [
	{ path: '', component: HomePageComponent },
	{ path: 'galerija', component: GalleryComponent },
	{ path: 'aranzmani', component: ArrangementsPageComponent },
	{ path: 'aranzmani/:id', component: ArrangementDetailPageComponent },
	{ path: 'moj-nalog', component: AccountPageComponent },
	{ path: 'o-nama', component: AboutPageComponent },
	{ path: '**', redirectTo: '' }
];
