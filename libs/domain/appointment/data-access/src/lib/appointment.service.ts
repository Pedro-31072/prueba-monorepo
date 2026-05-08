import { Injectable } from '@angular/core';
import { TeamMember, Appointment } from '@appointment-calendar/model';
import { Observable, of, delay } from 'rxjs';
import { MOCK_MEMBERS, MOCK_APPOINTMENTS } from './__mocks__/data';
import { localStorageKeys } from './constants/local-storage';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private storageKey = localStorageKeys.appointmentsKey;

  getTeamMembers(): Observable<TeamMember[]> {
    return of(MOCK_MEMBERS).pipe(delay(300));
  }

  getAppointments(): Observable<Appointment[]> {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      const parsed = JSON.parse(stored).map((appointment: Appointment) => ({
        ...appointment,
        startTime: new Date(appointment.startTime),
        endTime: new Date(appointment.endTime),
      }));
      return of(parsed).pipe(delay(300));
    }
    this.saveToStorage(MOCK_APPOINTMENTS);
    return of(MOCK_APPOINTMENTS).pipe(delay(300));
  }

  saveAppointments(appointments: Appointment[]): Observable<void> {
    this.saveToStorage(appointments);
    return of(undefined).pipe(delay(200));
  }

  private saveToStorage(apps: Appointment[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(apps));
  }
}
