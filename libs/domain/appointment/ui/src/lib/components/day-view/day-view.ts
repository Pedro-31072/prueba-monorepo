import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AppointmentCard } from '../appointment-card/appointment-card';
import { Appointment, TeamMember } from '@appointment-calendar/model';
@Component({
  selector: 'lib-day-view',
  standalone: true,
  imports: [DatePipe, AppointmentCard],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-800">
          {{ selectedDate() | date: 'fullDate' }}
        </h3>
      </div>

      <div class="grid gap-3">
        @for (app of filteredAppointments(); track app.id) {
          <appointment-card
            [appointment]="app"
            [members]="teamMembers()"
            (edit)="onEdit($event)"
          />
        } @empty {
          <div
            class="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed"
          >
            <p class="text-lg">There are no appointments for this day.</p>
            <p class="text-sm">Click "+" to add one.</p>
          </div>
        }
      </div>
    </div>
  `,
})
export class DayView {
  selectedDate = input.required<Date>();
  filteredAppointments = input.required<Appointment[]>();
  appointments = input.required<Appointment[]>();
  teamMembers = input.required<TeamMember[]>();
  editAppointment = output<Appointment>();
  onEdit(id: string) {
    const app = this.appointments().find((a) => a.id === id);
    if (!app) return;
    this.editAppointment.emit(app);
  }
}
