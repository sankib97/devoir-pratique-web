import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ModeleML } from '../models/modele.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ModeleService {

  private readonly apiUrl = `${environment.apiBaseUrl}/modeles`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<ModeleML[]> {
    return this.http.get<ModeleML[]>(this.apiUrl);
  }

  findById(id: number): Observable<ModeleML> {
    return this.http.get<ModeleML>(`${this.apiUrl}/${id}`);
  }

  create(modele: ModeleML): Observable<ModeleML> {
    return this.http.post<ModeleML>(this.apiUrl, modele);
  }

  update(id: number, modele: ModeleML): Observable<ModeleML> {
    return this.http.put<ModeleML>(`${this.apiUrl}/${id}`, modele);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
