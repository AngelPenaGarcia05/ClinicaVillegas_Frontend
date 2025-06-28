import { Component } from '@angular/core';
import { NavbarComponent, NavItem } from '../../components/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home-layout',
  imports: [NavbarComponent, RouterOutlet],
  template: `
    <nav app-navbar [navItems]="navItems"></nav>
    <router-outlet></router-outlet>
  `
})
export class HomeLayoutComponent {
  navItems: NavItem[] = [
    {name: 'Inicio', link: 'home'},
    {name: 'Tratamientos', link: 'home/treatments'},
    {name: 'Blog', link: 'home/blog'},
    {name: 'Contactos', link: '#contactos'},
  ]
}
