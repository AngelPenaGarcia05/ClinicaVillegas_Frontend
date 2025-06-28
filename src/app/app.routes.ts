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
import { AppointmentComponent } from './dashboard/pages/appointment/appointment.component';
import { DentistScheduleComponent } from './dashboard/pages/dentist-schedule/dentist-schedule.component';
import { AdministratorComponent } from './dashboard/pages/administrator/administrator.component';

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
            { path: 'appointment', component: AppointmentComponent, title: 'Reserva de citas | Clinica Dental Villegas', canActivate: [authGuard], data: { roles: ['PACIENTE', 'DENTISTA', 'ADMINISTRADOR'] } },
            { path: 'history', component: HistorialComponent, title: 'Historial | Clinica Dental Villegas', canActivate: [authGuard], data: { roles: ['PACIENTE', 'ADMINISTRADOR'] } },
            { path: 'dentist-schedule', component: DentistScheduleComponent, title: 'Horarios | Clinica Dental Villegas', canActivate: [authGuard], data: { roles: ['DENTISTA'] } },
            { path: 'assigned', component: GestionCitasComponent, title: 'Gestión de citas | Clinica Dental Villegas', canActivate: [authGuard], data: { roles: ['DENTISTA'] }},
            { path: 'reports', component: DynamicReportComponent, title: 'Reportes Dinámicos | Clinica Dental Villegas', canActivate: [authGuard], data: { roles: ['DENTISTA', 'ADMINISTRADOR'] } },
            { path: 'administrator', component: AdministratorComponent, title: 'Administrador | Clinica Dental Villegas', canActivate: [authGuard], data: { roles: ['ADMINISTRADOR'] } }
        ],
        canActivate: [authGuard], data: { roles: ['DENTISTA', 'ADMINISTRADOR', 'PACIENTE'] }
    }
];
