import { Component, computed, inject, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoginComponent } from '../auth/login/login.component';

import { AuthService } from '../auth/auth.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, LoginComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
[x: string]: any;
    loginService = inject(AuthService);
    isLogin = this.loginService.isLogin;

}
