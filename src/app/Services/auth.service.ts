import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = '_token';
  adminData: any;
  private roles: string[] = [];

  constructor(private _HttpClient: HttpClient) {
    this.loadUserFromToken();
  }

  
  loginForm(adminData: Object): Observable<any> {
    return this._HttpClient.post(`https://civix.runasp.net/api/Auth/login`, adminData);
  }

  
  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.decodeAndStoreToken(token);
  }


  private decodeAndStoreToken(token: string): void {
    try {
      const decoded: any = jwtDecode(token);
      this.adminData = decoded;
      this.roles = decoded?.roles || [];
    } catch (e) {
      this.adminData = null;
      this.roles = [];
    }
  }

  
  loadUserFromToken(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      this.decodeAndStoreToken(token);
    }
  }

setAdminInfo(info: any) {
  this.adminData = info;
  localStorage.setItem('adminInfo', JSON.stringify(info)); // optional: persist it
}

getAdminInfo(): any {
  if (this.adminData) return this.adminData;

  const info = localStorage.getItem('adminInfo');
  if (info) {
    this.adminData = JSON.parse(info);
    return this.adminData;
  }

  return null;
}



  isAdmin(): boolean {
    return this.roles.includes('Admin');
  }


  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }


  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }


  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.adminData = null;
    this.roles = [];
  }
}
