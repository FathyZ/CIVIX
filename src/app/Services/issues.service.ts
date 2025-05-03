import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse, Issue, issueUpdate } from '../models/issue';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IssuesService {
  private apiUrl = 'https://civix.runasp.net/api/Issues';

  constructor(private http: HttpClient) {}

  // Updated method to accept pageIndex for proper pagination
  getIssues(pageIndex: number = 1, pageSize: number = 50): Observable<ApiResponse> {
    const token = localStorage.getItem('_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<ApiResponse>(
      `${this.apiUrl}?pageIndex=${pageIndex}&pageSize=${pageSize}`,
      { headers }
    );
  }

  getIssueById(id: string): Observable<Issue> {
    const token = localStorage.getItem('_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<Issue>(`${this.apiUrl}/${id}`, { headers });
  }

  getTotalIssuesCount(): Observable<any> {
    const token = localStorage.getItem('_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any>(`${this.apiUrl}`, { headers });
  }

  getAllIssuesData(): Observable<ApiResponse> {
    const token = localStorage.getItem('_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<ApiResponse>(`${this.apiUrl}`, { headers });
  }

  deleteIssue(id: string): Observable<any> {
    const token = localStorage.getItem('_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers });
  }



updateIssueStatus(id: string, status: string): Observable<any> {
  const token = localStorage.getItem('_token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  return this.http.put<any>(`${this.apiUrl}/${id}/toggle-status/${status}`, null, { headers });
}

getIssueUpdates(id:string):Observable<issueUpdate[]>{
  const token = localStorage.getItem('_token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
    });

  return this.http.get<issueUpdate[]>(`https://civix.runasp.net/api/fixingteams/issue/${id}/statuses`, { headers });

}

}