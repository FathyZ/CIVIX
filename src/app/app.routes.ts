import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './Components/home/home.component';
import { LoginComponent } from './Components/login/login.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [

    {path:'', redirectTo: '/home', pathMatch: 'full'},
    {path:'home',canActivate:[authGuard], component:HomeComponent, pathMatch: 'full'},
    {path:'login', component:LoginComponent},
];
