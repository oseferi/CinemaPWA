import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Schedule } from '../models/schedule.model';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  constructor(private http: HttpClient) {}

  public getSchedules = (): Observable<Schedule[]> => this.http.get<Schedule[]>(`${environment.apiUrl}/schedules?validity=true`);
}
