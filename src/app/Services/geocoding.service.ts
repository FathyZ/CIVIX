import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeocodingService {
  private apiUrl = 'https://nominatim.openstreetmap.org/reverse';

  constructor(private http: HttpClient) {}

  getAddressFromCoords(lat: string, lon:string): Observable<any> {
    return this.http.get(this.apiUrl, {
      params: {
        lat: lat.toString(),
        lon: lon.toString(),
        format: 'json',
      },
    });
  }
}
