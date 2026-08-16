import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Experimentation } from '../models/experimentation.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ExperimentationService {

  private readonly apiUrl = `${environment.apiBaseUrl}/experimentations`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<Experimentation[]> {
    return this.http.get<Experimentation[]>(this.apiUrl);
  }

  findById(id: number): Observable<Experimentation> {
    return this.http.get<Experimentation>(`${this.apiUrl}/${id}`);
  }

  create(exp: Experimentation): Observable<Experimentation> {
    return this.http.post<Experimentation>(this.apiUrl, exp);
  }

  update(id: number, exp: Experimentation): Observable<Experimentation> {
    return this.http.put<Experimentation>(`${this.apiUrl}/${id}`, exp);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
