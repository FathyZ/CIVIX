import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './Components/home/home.component';
import { LoginComponent } from './Components/login/login.component';
import { authGuard } from './auth.guard';
import { OverviewComponent } from './Components/home/pages/overview/overview.component';
import { StatisticsComponent } from './Components/home/pages/statistics/statistics.component';
import { ActiveIssuesComponent } from './Components/home/pages/active-issues/active-issues.component';
import { FixingTeamsComponent } from './Components/home/pages/fixing-teams/fixing-teams.component';

export const routes: Routes = [

    {path:'', redirectTo: '/home', pathMatch: 'full'},
    {path:'login', component:LoginComponent},
    {
     path:'home',
     canActivate:[authGuard],
     component:HomeComponent,
     children:[
        {path:'overview', component:OverviewComponent},
        {path:'statistics',component:StatisticsComponent},
        {path:'active-issues',component:ActiveIssuesComponent},
        {path:'fixing-teams',component:FixingTeamsComponent},
        {path:'', redirectTo: 'overview', pathMatch: 'full'}
        
     ]},
    
];
