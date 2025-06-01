import { Component, input } from '@angular/core';
import { UserCardComponent } from '../../../shared/components/user-card/user-card.component';

@Component({
  selector: '[app-navbar]',
  imports: [UserCardComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  navItems = input<NavItem[]>();
  user: User = {
    name: 'PEÑA GARCÍA, ANGEL MARTÍN',
    role: 'ADMIN',
    image: 'media/logo.jpg'
  }
  isLogged = false;
  
}
interface User{
  name: string,
  role: string,
  image: string
}
export interface NavItem{
  name: string,
  link: string
}

