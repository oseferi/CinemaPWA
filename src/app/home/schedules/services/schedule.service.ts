import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Schedule } from '../models/schedule.model';
import { Update } from '@ngrx/entity';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  constructor(private http: HttpClient) {}

  public getSchedules = (): Observable<Schedule[]> => this.http.get<Schedule[]>(`${environment.apiUrl}/schedules?validity=true`);
  public createSchedule = (request: Partial<Schedule>): Observable<Schedule> => this.http.post<Schedule>(`${environment.apiUrl}/schedules`, { ...request, validity: true });
  public updateSchedule = (request: Update<Schedule>): Observable<Schedule> => this.http.patch<Schedule>(`${environment.apiUrl}/schedules/${request.id}`, request.changes);
  public deleteSchedule = (id: string): Observable<void> => this.http.patch<void>(`${environment.apiUrl}/schedules/${id}`, { validity: false });
  public restoreSchedule = (id: string): Observable<void> => this.http.patch<void>(`${environment.apiUrl}/schedules/${id}`, { validity: true });
}
