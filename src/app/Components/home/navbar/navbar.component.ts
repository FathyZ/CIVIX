import { AuthService } from './../../../Services/auth.service';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  area: string = '';

  @ViewChild('logoutDialog') logoutDialog: any; 

  constructor(private router: Router , private _AuthService : AuthService) {}

  ngOnInit() {
    const admin = this._AuthService.getAdminInfo();
    if (admin) {
      this.area = admin.area;
      console.log( "Area Is : " + this.area);

    }
  }

  // Open the dialog
  openLogoutDialog(event: Event): void {
    event.preventDefault(); // Prevent the default link behavior
    this.logoutDialog.nativeElement.showModal(); // Open the dialog
  }

  // Close the dialog
  closeLogoutDialog(): void {
    this.logoutDialog.nativeElement.close(); // Close the dialog
  }

  // Confirm logout and remove token
  confirmLogout(): void {
    localStorage.removeItem('_token'); // Remove the token from localStorage
    this.closeLogoutDialog(); // Close the dialog
    window.location.reload();
  }}
