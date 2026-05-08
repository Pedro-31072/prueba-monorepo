import { Component, computed, input, output, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { filteredAppointmentByStatus } from '@appointment-calendar/data-access';
import { AppointmentCard } from '../appointment-card/appointment-card';
import {
  Appointment,
  AppointmentStatusFilter,
  TeamMember,
} from '@appointment-calendar/model';
@Component({
  selector: 'lib-week-view',
  standalone: true,
  imports: [DatePipe, AppointmentCard],
  template: `
    <div class="w-full mb-3 justify-between flex">
      <h2 class="text-2xl">{{ selectedDate() | date: 'MMMM, y' }}</h2>
      <button
        type="button"
        (click)="onToggleDates()"
        class=" hover:bg-gray-200 rounded-full cursor-pointer"
        [class.rotate-180]="isDatesVisible()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="30px"
          viewBox="0 -960 960 960"
          width="30px"
          fill="#000"
        >
          <path d="M480-384 288-576h384L480-384Z" />
        </svg>
      </button>
    </div>
    <div class="space-y-4 h-[calc(100%-100px)]">
      @if (isDatesVisible()) {
        <div class="grid grid-cols-5 sm:grid-cols-7 gap-2 ">
          @for (day of weekDays(); track day.date) {
            <button
              (click)="onDayClick(day)"
              class="text-center p-2 flex flex-col items-center rounded-lg hover:ring-2 hover:ring-blue-500"
              [class.bg-blue-50]="day.isToday"
              [class]="
                selectedDay() === day.dayNum ? 'ring-2 ring-blue-500' : ''
              "
            >
              <p class="text-xs text-gray-500 uppercase">{{ day.name }}</p>
              <p class="text-lg font-bold" [class.text-blue-600]="day.isToday">
                {{ day.dayNum }}
              </p>
            </button>
          }
        </div>
      }
      <div class=" h-full overflow-y-auto">
        @for (day of weekDays(); track day.date) {
          <div class="min-h-25  bg-gray-100 mb-2">
            <span
              class="text-lg border-2 block   text-white ps-3  uppercase "
              [class]="
                selectedDay() === day.dayNum ? ' bg-blue-500' : 'bg-gray-500'
              "
            >
              {{ day.dayNum }}
            </span>
            @for (app of day.appointments; track app.id) {
              <div class="my-4">
                <appointment-card
                  [appointment]="app"
                  [members]="teamMembers()"
                  (edit)="onEdit($event)"
                />
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class WeekView {
  selectedDate = input.required<Date>();
  weekAppointments = input.required<Appointment[]>();
  activeFilter = input.required<AppointmentStatusFilter>();
  teamMembers = input.required<TeamMember[]>();
  appointments = input.required<Appointment[]>();
  editAppointment = output<Appointment>();
  protected isDatesVisible = signal<boolean>(true);
  dayClick = output<Date>();
  onToggleDates() {
    this.isDatesVisible.update((v) => !v);
  }
  weekDays = computed(() => {
    const date = this.selectedDate();
    const apps = this.weekAppointments();
    const activeFilter = this.activeFilter();

    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const dayApps = apps.filter((a) => {
        const ad = new Date(a.startTime);
        return ad.getDate() === d.getDate() && ad.getMonth() === d.getMonth();
      });

      days.push({
        date: d.toISOString(),
        month: d.getMonth(),
        year: d.getFullYear(),
        name: d.toLocaleDateString('us-ES', { weekday: 'short' }),
        dayNum: d.getDate(),
        isToday: this.isToday(d),
        appointments: dayApps.filter((appointment) =>
          filteredAppointmentByStatus(appointment, activeFilter),
        ),
      });
    }
    return days;
  });

  onDayClick(day: any) {
    this.dayClick.emit(new Date(day.year, day.month, day.dayNum));
  }

  private isToday(d: Date): boolean {
    const t = new Date();
    return (
      d.getDate() === t.getDate() &&
      d.getMonth() === t.getMonth() &&
      d.getFullYear() === t.getFullYear()
    );
  }

  selectedDay = computed(() => this.selectedDate().getDate());

  onEdit(id: string) {
    const app = this.appointments().find((a) => a.id === id);
    if (!app) return;
    this.editAppointment.emit(app);
  }
}
