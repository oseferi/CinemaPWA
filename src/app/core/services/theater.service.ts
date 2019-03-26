import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Update } from '@ngrx/entity';
import { Theater, TheaterRequest } from '../../home/theaters/models/theater.model';

@Injectable({
  providedIn: 'root'
})
export class TheaterService {
  constructor(private http: HttpClient) {}

  public getTheaters = (): Observable<Theater[]> => this.http.get<Theater[]>(`${environment.apiUrl}/theaters?validity=true`);
  public createTheater = (request: TheaterRequest): Observable<Theater> => this.http.post<Theater>(`${environment.apiUrl}/theaters`, { ...request.formGroup.value, validity: true });
  public updateTheater = (request: Update<Theater>): Observable<Theater> => this.http.patch<Theater>(`${environment.apiUrl}/theaters/${request.id}`, request.changes);
  public deleteTheater = (id: string | number): Observable<void> => this.http.patch<void>(`${environment.apiUrl}/theaters/${id}`, { validity: false });
  public restoreTheater = (id: string | number): Observable<void> => this.http.patch<void>(`${environment.apiUrl}/theaters/${id}`, { validity: true });
}
