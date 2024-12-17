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
    return this._HttpClient.post(`https://civixappapi20241207014740.azurewebsites.net/api/Auth/login`,adminData)
  }

saveAdmin(){
  const encode = localStorage.getItem('_token');
  if(encode){
    const decode = jwtDecode(encode);
    this.adminData = decode;
  }
}

}
