import { Routes } from '@angular/router';
import { HomeLayoutComponent } from './main/layouts/home-layout/home-layout.component';
import { HomeComponent } from './main/pages/home/home.component';
import { TreatmentsComponent } from './main/pages/treatments/treatments.component';
import { BlogComponent } from './main/pages/blog/blog.component';
import { AuthLayoutComponent } from './auth/layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './auth/pages/login/login.component';
import { RegisterComponent } from './auth/pages/register/register.component';
import { DashboardLayoutComponent } from './dashboard/layouts/dashboard-layout/dashboard-layout.component';
import { DynamicReportComponent } from './dashboard/pages/dynamic-report/dynamic-report.component';
import { authGuard } from './shared/guards/auth.guard';
import { HistorialComponent } from './dashboard/pages/historial/historial.component';
import { GestionCitasComponent } from './dashboard/pages/gestion-citas/gestion-citas.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
        path: 'home', component: HomeLayoutComponent, title: 'Clinica Dental Villegas', children: [
            { path: '', component: HomeComponent, title: 'Clinica Dental Villegas' },
            { path: 'treatments', component: TreatmentsComponent, title: 'Tratamientos | Clinica Dental Villegas' },
            { path: 'blog', component: BlogComponent, title: 'Blog | Clinica Dental Villegas' }
        ]
    },
    {
        path: 'auth', component: AuthLayoutComponent, children: [
            { path: 'login', component: LoginComponent, title: 'Inicio de sesión' },
            { path: 'register', component: RegisterComponent, title: 'Registro' }
        ]
    },
    {
        path: 'dashboard', component: DashboardLayoutComponent, children: [
            { path: 'history', component: HistorialComponent, title: 'Historial | Clinica Dental Villegas', canActivate: [authGuard], data: { roles: ['PACIENTE', 'ADMINISTRADOR'] } },
            { path: 'assigned', component: GestionCitasComponent, title: 'Gestión de citas | Clinica Dental Villegas', canActivate: [authGuard], data: { roles: ['DENTISTA'] }},
            { path: 'reports', component: DynamicReportComponent, title: 'Reportes Dinámicos | Clinica Dental Villegas', canActivate: [authGuard], data: { roles: ['DENTISTA', 'ADMINISTRADOR'] } },
        ],
        canActivate: [authGuard], data: { roles: ['DENTISTA', 'ADMINISTRADOR', 'PACIENTE'] }
    }
];
