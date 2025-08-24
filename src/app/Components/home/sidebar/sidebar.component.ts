import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule , NgClass , CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit {
  area: string = '';
  areaImage: string = '';
  isOpen = true;

  constructor(
    private _AuthService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit() {
    const admin = this._AuthService.getAdminInfo();
    if (admin) {
      this.area = admin.area;
      console.log( "Area Is : " + this.area);

      switch (this.area.toLowerCase()) {
        case 'el shorouk':
          this.areaImage = 'assets/El_Shorouk_city_logo.png';
          break;
      }
      
      this.cdr.detectChanges();
    }
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;
    this.cdr.detectChanges();
  }
}
