import { Component } from '@angular/core';
import { FormControl, FormGroup , Validators } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
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
  password: string = '';
  showPassword: boolean = false;
  isDialogOpen: boolean = false;

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    
  });

  handleLogin():void{
    console.log(this.loginForm)
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
