import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './Components/home/home.component';
import { LoginComponent } from './Components/login/login.component';

export const routes: Routes = [
    {
        path:'home', component:HomeComponent, pathMatch: 'full'
    }
    ,
    {
        path:'login', component:LoginComponent
    }
    ,
    {
        path:'', redirectTo: '/login', pathMatch: 'full'
    }
];
