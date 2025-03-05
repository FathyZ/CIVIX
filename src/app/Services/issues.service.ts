import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse, Issue } from '../models/issue';

@Injectable({
  providedIn: 'root'
})
export class IssuesService {
 private apiUrl = 'https://civix.runasp.net/api/Issues';
  constructor(private http:HttpClient) { }

  getIssues():Observable<ApiResponse>{ // Return an observable of type ApiResponse (defined in models/issue.ts)
    const token = localStorage.getItem('_token'); // Retrieve token (update if stored elsewhere)
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`    // Set the Authorization header with the token
    });
    return this.http.get<ApiResponse>(this.apiUrl ,  { headers });
  }



  getIssueById(id:string):Observable<Issue>{ // Return an observable of type Issue (defined in models/issue.ts)
    const token = localStorage.getItem('_token'); // Retrieve token (update if stored elsewhere)
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`   // Set the Authorization header with the token
    });
    return this.http.get<Issue>(`${this.apiUrl}/${id}`,{ headers }); 
  }
}
