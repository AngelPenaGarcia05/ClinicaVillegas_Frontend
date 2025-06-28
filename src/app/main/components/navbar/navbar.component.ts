import { AfterViewInit, Component, inject, input, OnInit } from '@angular/core';
import { UserCardComponent } from '../../../shared/components/user-card/user-card.component';
import { Observable } from 'rxjs';
import { Usuario } from '../../../shared/interfaces/usuario';
import { AuthService } from '../../../auth/services/auth.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: '[app-navbar]',
  imports: [UserCardComponent, AsyncPipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  navItems = input<NavItem[]>();
  authService = inject(AuthService);
  user$!: Observable<Usuario | null>;
  constructor() {
    this.user$ = this.authService.fetchUser();
  }
}

export interface NavItem {
  name: string,
  link: string
}

