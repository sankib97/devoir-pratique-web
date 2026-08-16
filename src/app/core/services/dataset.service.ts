import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dataset } from '../models/dataset.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DatasetService {

  private readonly apiUrl = `${environment.apiBaseUrl}/datasets`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<Dataset[]> {
    return this.http.get<Dataset[]>(this.apiUrl);
  }

  findById(id: number): Observable<Dataset> {
    return this.http.get<Dataset>(`${this.apiUrl}/${id}`);
  }

  create(dataset: Dataset): Observable<Dataset> {
    return this.http.post<Dataset>(this.apiUrl, dataset);
  }

  update(id: number, dataset: Dataset): Observable<Dataset> {
    return this.http.put<Dataset>(`${this.apiUrl}/${id}`, dataset);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
