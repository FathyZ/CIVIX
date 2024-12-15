import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoginComponent } from "./Components/login/login.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink,RouterLinkActive,RouterOutlet, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'CIVIX';
}
