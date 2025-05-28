import { Routes } from '@angular/router';
import { HomeLayoutComponent } from './main/layouts/home-layout/home-layout.component';
import { HomeComponent } from './main/pages/home/home.component';
import { TreatmentsComponent } from './main/pages/treatments/treatments.component';
import { BlogComponent } from './main/pages/blog/blog.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {path: 'home', component: HomeLayoutComponent, title: 'Clinica Dental Villegas', children: [
        {path: '', component: HomeComponent, title: 'Clinica Dental Villegas'},
        {path: 'treatments', component: TreatmentsComponent, title: 'Tratamientos | Clinica Dental Villegas'},
        {path: 'blog', component: BlogComponent, title: 'Blog | Clinica Dental Villegas'}
    ]}
];
