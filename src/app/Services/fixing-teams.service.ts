import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FixingTeamsService {

  private baseUrl = 'https://civix.runasp.net/api/';

  constructor(private _HttpClient:HttpClient) { }

  getAllTeams():Observable<any>{
    const token = localStorage.getItem('_token');
    if (!token) {
      console.error('Token not found!');
      return new Observable(); // Return empty observable to prevent API call without token
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this._HttpClient.get<any>(`${this.baseUrl}FixingTeams`, { headers });
  }

}
