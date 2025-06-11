import { Component, input } from '@angular/core';

@Component({
  selector: 'app-user-card',
  imports: [],
  template: `
    <div class="user-card">
      <div class="user-info">
        <h3 class="user-name">{{username()}}</h3>
        <p class="user-role">
          {{role()}}
        </p>
      </div>
      <img [src]="image()" alt="Profile Image" class="profile-img" />
    </div>
  `,
  styles: [`
    .user-card {
      display: flex;
      align-items: center;
      padding: 10px;
      gap: 20px;
      max-width: 500px;
      font-family: Arial, sans-serif;
    }

    .profile-img {
      border: 1px solid var(--first-color);
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
      margin-right: 15px;
    }

    .user-info {
      text-align: left;
    }

    .user-name {
      font-size: 15px;
      font-weight: bold;
      margin: 0;
      color: #333;
    }

    .user-role {
      font-size: 14px;
      color: #777;
      margin: 5px 0 0;
    }
    @media (width <= 1024px){
      .user-name, .user-role{
          font-size: 12px;
      }
    }

  `]
})
export class UserCardComponent {
  username = input.required<string | null>();
  role = input.required<string | null>();
  image = input.required<string | null>();
}
