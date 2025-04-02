import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _HttpClient:HttpClient) { }

  adminData:any;

  loginForm(adminData:Object):Observable<any>{
    return this._HttpClient.post(`https://civix.runasp.net/api/Auth/login`,adminData)
  }

saveAdmin(){
  const encode = localStorage.getItem('_token');
  if(encode){
    const decode = jwtDecode(encode);
    this.adminData = decode;
  }
}

getToken(): string | null {
  return localStorage.getItem('_token'); // Retrieve token from local storage
}


}


