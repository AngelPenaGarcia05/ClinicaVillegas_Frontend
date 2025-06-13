import { Component, ElementRef, inject, OnInit, signal, viewChild, viewChildren } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { UserCardComponent } from '../../../shared/components/user-card/user-card.component';
import { AuthService } from '../../../auth/services/auth.service';
import { Usuario } from '../../../shared/interfaces/usuario';
import { AsyncPipe } from '@angular/common';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet, RouterLink, AsyncPipe, UserCardComponent],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css'
})
export class DashboardLayoutComponent {

  user$: Observable<Usuario>;
  menuItems: MenuItem[] = [];
  filteredMenuItems$: Observable<MenuItem[]>;

  isNavVisible = signal(false);
  activeLink = signal('Dashboard');

  constructor(private authService: AuthService, private router: Router) {
    this.user$ = this.authService.fetchUser();
    this.menuItems = [
      { label: 'Reserva', link: '/dashboard/reserva', icon: 'bi bi-calendar3', roles: ["PACIENTE", 'DENTISTA', "ADMINISTRADOR"] },
      { label: 'Historial', link: '/dashboard/historial', icon: 'bi bi-clock-history', roles: ["PACIENTE", "ADMINISTRADOR"] },
      { label: 'Administrador', link: '/dashboard/administrador', icon: 'bi bi-database-fill', roles: ["ADMINISTRADOR"] },
      { label: 'Reportes', link: '/dashboard/reportes', icon: 'bi bi-bar-chart', roles: ["DENTISTA", "ADMINISTRADOR"] },
      { label: 'Agregar Horario', link: '/dashboard/agregarhorario', icon: 'bi bi-calendar', roles: ["DENTISTA"] },
      { label: 'Gestion de citas', link: '/dashboard/gestioncitas', icon: 'bi bi-bandaid', roles: ["DENTISTA"] },
    ];
    this.filteredMenuItems$ = this.user$.pipe(
      map(user =>
        this.menuItems.filter(menu =>
          user ? menu.roles.includes(user.rol) : false
        )
      )
    );
  }
  
  toggleNav(): void {
    this.isNavVisible.update(v => !v);
  }

  setActive(link: string): void {
    this.activeLink.set(link);
  }

  onLogout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/auth/login']);
    });
  }
}
export interface MenuItem {
  label: string,
  link: string,
  icon: string,
  roles: string[]
}

