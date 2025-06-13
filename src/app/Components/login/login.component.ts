import { Component } from '@angular/core';
import { FormControl, FormGroup , Validators } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule,
    ReactiveFormsModule,CommonModule],
  providers: [Router],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {

  constructor(private _AuthService:AuthService, private _Router:Router){

  }

  password: string = '';
  showPassword: boolean = false;
  isDialogOpen: boolean = false;

  errorMsg:string ='';

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    
  });

 handleLogin(): void {
  if (this.loginForm.valid) {
    this._AuthService.loginForm(this.loginForm.value).subscribe({
      next: (response) => {
        if (response) {
          localStorage.setItem('_token', response.token);
          this._AuthService.setAdminInfo(response); // ✅ Store full user info

          this._Router.navigate(['/home']);
        }
      },
      error: (err) => {
        if (err.status == '401') {
          this.errorMsg = 'Invalid Email or Password';
        } else if (err.status == '400') {
          this.errorMsg = 'Email Can Not Be Empty';
        } else {
          this.errorMsg = `Unexpected status: ${err.status}`;
        }
      }
    });
  }
} 

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  openDialog(): void {
    this.isDialogOpen = true;
  }

  closeDialog(): void {
    this.isDialogOpen = false;
  }

}
