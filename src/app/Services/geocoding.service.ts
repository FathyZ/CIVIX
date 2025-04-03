import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';

interface GeocodingResponse {
  results: Array<{
    formatted: string;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  private cache = new Map<string, string>(); // In-memory cache

  constructor(private http: HttpClient) {}

  getAddressFromCoords(lat: string, lon: string): Observable<string> {
    const cacheKey = `${lat},${lon}`;

    // ✅ Check if address is in cache
    if (this.cache.has(cacheKey)) {
      console.log(`🟢 Using cached address for ${cacheKey}:`, this.cache.get(cacheKey));
      console.log('🔹 Current Cache:', this.cache);
      return of(this.cache.get(cacheKey)!);
    }

    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}%2C+${lon}&key=a753ef24340741c581367636f5d941e1`;

    return this.http.get<GeocodingResponse>(url).pipe(
      map(response => {
        // Use the `formatted` field from the response
        const address = response.results[0]?.formatted || 'Unknown location';
        this.cache.set(cacheKey, address); // ✅ Save to cache
        console.log(`🟡 Fetched from API: ${cacheKey} -> ${address}`);
        console.log('🔹 Updated Cache:', this.cache);
        return address;
      }),
      tap({
        error: (err) => {
          console.error('Error fetching address:', err);
        }
      })
    );
  }
}
