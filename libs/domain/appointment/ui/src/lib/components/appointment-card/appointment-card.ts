import { TeamMember,Appointment, AppointmentStatus } from '@appointment-calendar/model';
import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'appointment-card',
  standalone: true,
  imports: [DatePipe],
  host:{
    "(click)":"edit.emit(appointment().id)"
  },
  template: `
    <div
      class="relative p-3 rounded-lg border-l-4  shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      [class]="{
        'border-emerald-500':appointment().status === AppointmentStatus.CONFIRMED,
        'border-yellow-500':appointment().status === AppointmentStatus.PENDING,
        'border-red-500':appointment().status === AppointmentStatus.CANCELLED,
        'bg-emerald-50':appointment().status === AppointmentStatus.CONFIRMED,
        'bg-yellow-50':appointment().status === AppointmentStatus.PENDING,
        'bg-red-50':appointment().status === AppointmentStatus.CANCELLED
      }"

    >
      <div class="flex justify-between items-start">
        <div >
          <p class="font-semibold text-gray-900">{{ appointment().clientName }}</p>
          <p class="text-sm text-gray-600">{{ appointment().serviceName }}</p>
          <div class="flex items-center gap-2 mt-1">
            <span class="w-2 h-2 rounded-full" [class]="memberColor()"></span>
            <span class="text-xs text-gray-500">{{ memberName() }}</span>
          </div>
        </div>
        <span
          class="px-2 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide"
          [class.bg-emerald-100.text-emerald-700]="appointment().status === AppointmentStatus.CONFIRMED"
          [class.bg-yellow-100.text-yellow-700]="appointment().status === AppointmentStatus.PENDING"
          [class.bg-red-100.text-red-700]="appointment().status === AppointmentStatus.CANCELLED"
        >
          {{ appointment().status }}
        </span>
      </div>
      <div class="mt-2 text-xs text-gray-500 font-mono">
        {{ appointment().startTime | date:'MMM d, h:mm:ss a' }} - {{ appointment().endTime | date:'MMM d, h:mm:ss a' }}
      </div>
    </div>
  `,
})
export class AppointmentCard {
  appointment = input.required<Appointment>();
  members = input.required<TeamMember[]>();
  AppointmentStatus= AppointmentStatus
  edit = output<string>();

  memberName = () => this.members().find(m => m.id === this.appointment().teamMemberId)?.name || 'Unknown';
  memberColor = () => this.members().find(m => m.id === this.appointment().teamMemberId)?.color || 'bg-gray-400';
}
