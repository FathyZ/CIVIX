import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/issue';
import { tap, catchError, of, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private baseUrl = 'https://civix.runasp.net/api/Issues/count-by-status';
  private priorityBaseUrl = 'https://civix.runasp.net/api/Issues/count-by-priority';
  private lastDayUrl = 'https://civix.runasp.net/api/Issues/count-last-24-hours'
  private issuesUrl = 'https://civix.runasp.net/api/Issues';

  constructor(private http: HttpClient) {}

  getTaskPerformance(): Observable<{ name: string; count: number }[]> {
    const token = localStorage.getItem('_token');
    if (!token) {
      console.error('Token not found!');
      return new Observable(); // Return empty observable to prevent API call without token
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get<{ name: string; count: number }[]>(this.baseUrl, { headers });
  }

  getPriorityDistribution(): Observable<{name:string; count:number}[]> {
    const token = localStorage.getItem('_token');
    if (!token) {
      console.error('Token not found!');
      return new Observable();
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get<{ name: string; count: number }[]>(this.priorityBaseUrl, { headers });
  }

  getIssuesStatusCount(): Observable<any>{
    const token = localStorage.getItem('_token');
    if (!token) {
      console.error('Token not found!');
      return new Observable();
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get<any>(this.baseUrl, { headers });
  }

  getLastDayIssuesCount(): Observable<any> {
    const token = localStorage.getItem('_token');
    if (!token) {
      console.error('Token not found!');
      return new Observable();
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get<any>(this.lastDayUrl, { headers }).pipe(
      tap(response => console.log('Last 24 hours API response:', response)),
      catchError(error => {
        console.error('Error fetching last 24 hours count:', error);
        return of(0);
      })
    );
  }

  getUnassignedIssuesCount(): Observable<number> {
    const token = localStorage.getItem('_token');
    if (!token) {
      console.error('Token not found!');
      return new Observable();
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get<any>(this.issuesUrl, { headers }).pipe(
      map(response => {
        const unassignedCount = response.data.filter((issue: any) => 
          issue.fixingStatus === 'Unassigned'
        ).length;
        return unassignedCount;
      }),
      tap(count => console.log('Unassigned issues count:', count)),
      catchError(error => {
        console.error('Error fetching unassigned issues count:', error);
        return of(0);
      })
    );
  }
}