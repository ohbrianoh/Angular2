import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { UserService } from './user/user.service';
import { AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, AsyncPipe],
  template: `
  <main>
    <header>
      <a [routerLink]="['/']">
        <header class="brand-name">
          <img class="brand-logo" src="https://angular.dev/assets/logo.svg" alt="logo" aria-hidden="true" />
        </header>
      </a>
      <div class="user-status">
        @if (userService.isLoggedIn()) {
          <span>Welcome, {{ (userService.user$ | async)?.name }}!</span>
            <button (click)="userService.logout()">Logout</button>
        } @else {
          <a routerLink="/login">
            <button>Login</button>
          </a>
        }
      </div>

    </header>
    <section class="content">
      <router-outlet></router-outlet>
    </section>
  </main>
`,
  styleUrl: './app.sass'
})
export class App {
  userService = inject(UserService);
  protected readonly title = signal('example');
}
