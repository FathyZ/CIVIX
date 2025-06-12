import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule , NgClass , CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
isOpen = true;
toggleSidebar() {
  this.isOpen = !this.isOpen;
}
}
