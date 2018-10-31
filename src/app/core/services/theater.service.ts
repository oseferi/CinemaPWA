import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Theater, TheaterRequest } from '../models/theater.model';

@Injectable({
  providedIn: 'root'
})
export class TheaterService {
  constructor(private http: HttpClient) {}

  public getTheaters = (): Observable<Theater[]> => this.http.get<Theater[]>(`${environment.apiUrl}/theaters?validity=true`);
  public createTheater = (request: TheaterRequest): Observable<Theater> => this.http.post<Theater>(`${environment.apiUrl}/theaters`, { ...request.formGroup.value, validity: true });
  public updateTheater = (id: number, request: TheaterRequest): Observable<Theater> => this.http.patch<Theater>(`${environment.apiUrl}/theaters/${id}`, request.formGroup.value);
  public deleteTheater = (id: number): Observable<void> => this.http.patch<void>(`${environment.apiUrl}/theaters/${id}`, { validity: false });
  public restoreTheater = (id: number): Observable<void> => this.http.patch<void>(`${environment.apiUrl}/theaters/${id}`, { validity: true });
}
