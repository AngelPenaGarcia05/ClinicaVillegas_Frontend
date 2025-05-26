import { Routes } from '@angular/router';
import { HomeLayoutComponent } from './main/layouts/home-layout/home-layout.component';
import { HomeComponent } from './main/pages/home/home.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {path: 'home', component: HomeLayoutComponent, title: 'Clinica Dental Villegas', children: [
        {path: '', component: HomeComponent, title: 'Clinica Dental Villegas'}
    ]}
];
