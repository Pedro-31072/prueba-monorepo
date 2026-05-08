import { Injectable, signal, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Appointment,
  AppointmentDraft,
  AppointmentStatusFilter,
  DateType,
  TeamMember,
} from '@appointment-calendar/model';
import { AppointmentService } from '../appointment.service';
import { filteredAppointmentByStatus } from '../utils/active-filter.util';

@Injectable({ providedIn: 'root' })
export class SchedulingFacade {
  private service = inject(AppointmentService);
  // private
  private readonly _appointments = signal<Appointment[]>([]);
  private readonly _selectedDate = signal<Date>(new Date());
  private readonly _viewMode = signal<DateType>(DateType.DAY);
  private readonly _loading = signal(false);
  private readonly _members = toSignal(this.service.getTeamMembers(), {
    initialValue: [] as TeamMember[],
  });
  private readonly _activeFilter = signal<AppointmentStatusFilter>(
    AppointmentStatusFilter.NONE,
  );
  // public
  readonly appointments = this._appointments.asReadonly();
  readonly selectedDate = this._selectedDate.asReadonly();
  readonly viewMode = this._viewMode.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly activeFilter = this._activeFilter.asReadonly();
  readonly teamMembers = computed(() => this._members());

  readonly filteredAppointments = computed(() => {
    const date = this._selectedDate();
    const apps = this._appointments();
    const startOfDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );
    const endOfDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      23,
      59,
      59,
    );

    return apps
      .filter((a) => {
        const d = new Date(a.startTime);
        return d >= startOfDay && d <= endOfDay;
      })
      .filter((appointment) =>
        filteredAppointmentByStatus(appointment, this._activeFilter()),
      )
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  });

  readonly weekAppointments = computed(() => {
    const date = this._selectedDate();
    const apps = this._appointments();

    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return apps
      .filter((a) => {
        const d = new Date(a.startTime);
        return d >= startOfWeek && d <= endOfWeek;
      })
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  });

  get currentAppointments(): Appointment[] {
    return this._appointments();
  }

  constructor() {
    this.loadAppointments();
  }

  loadAppointments() {
    this._loading.set(true);
    this.service.getAppointments().subscribe({
      next: (apps) => {
        this._appointments.set(apps);
        this._loading.set(false);
      },
      error: () => this._loading.set(false),
    });
  }

  setDate(date: Date) {
    this._selectedDate.set(date);
  }

  setViewMode(mode: DateType) {
    this._viewMode.set(mode);
  }

  private navigateDay(delta: number) {
    const current = this._selectedDate();
    const next = new Date(current);
    next.setDate(current.getDate() + delta);
    this._selectedDate.set(next);
  }
  private navigateWeek(delta: number) {
    const current = this._selectedDate();
    const next = new Date(current);
    next.setDate(current.getDate() + delta * 7);
    this._selectedDate.set(next);
  }
  navigate(delta: number) {
    if (this._viewMode() === DateType.DAY) {
      this.navigateDay(delta);
    } else {
      this.navigateWeek(delta);
    }
  }

  setFilter(filter: AppointmentStatusFilter) {
    this._activeFilter.set(filter);
  }

  createAppointment(draft: AppointmentDraft) {
    const newApp: Appointment = {
      ...draft,
      id: crypto.randomUUID(),
    };
    const updated = [...this._appointments(), newApp];
    this.persist(updated);
  }

  updateAppointment(id: string, draft: Partial<AppointmentDraft>) {
    const updated = this._appointments().map((a) =>
      a.id === id ? { ...a, ...draft } : a,
    );
    this.persist(updated);
  }

  deleteAppointment(id: string) {
    const updated = this._appointments().filter((a) => a.id !== id);
    this.persist(updated);
  }

  private persist(apps: Appointment[]) {
    this.service.saveAppointments(apps).subscribe(() => {
      this._appointments.set(apps);
    });
  }
}
