import { Component } from '@angular/core';
import { NavbarComponent, NavItem } from '../../components/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home-layout',
  imports: [NavbarComponent, RouterOutlet],
  template: `
    <app-navbar [navItems]="navItems"></app-navbar>
    <router-outlet></router-outlet>
  `,
  styleUrl: './home-layout.component.css'
})
export class HomeLayoutComponent {
  navItems: NavItem[] = [
    {name: 'Inicio', link: 'home'},
    {name: 'Tratamientos', link: 'home/treatments'},
    {name: 'Blog', link: 'blog'},
    {name: 'Contactos', link: '#contactos'},
  ]
}
