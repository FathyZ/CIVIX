import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse, Issue } from '../models/issue';

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
}
