import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { SchedulingFacade } from '@appointment-calendar/data-access';
import {
  Appointment,
  AppointmentDraft,
  AppointmentStatusFilter,
  DateType,
} from '@appointment-calendar/model';
import {
  DayView,
  WeekView,
  AppointmentForm,
  ToggleViewComponent,
  FilterComponent,
} from '@appointment-calendar/ui';
import { ButtonComponent } from '@shared/components';
@Component({
  imports: [
    DayView,
    WeekView,
    AppointmentForm,
    ButtonComponent,
    ToggleViewComponent,
    FilterComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="h-screen  bg-gray-100 p-6">
      <div class="max-w-5xl h-full mx-auto">
        <!-- Header -->
        <div class="bg-white rounded-xl shadow-sm p-6 mb-6 ">
          <div
            class="flex flex-col md:flex-row  md:items-center justify-between gap-4 "
          >
            <h1
              class="text-xl md:text-2xl font-bold text-gray-900 text-center md:text-start"
            >
              Appointment Calendar
            </h1>
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  (click)="navigate(-1)"
                  class="p-2 hover:bg-white rounded-md transition"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  (click)="onNowClick()"
                  class="px-3 py-1 hidden sm:block text-sm font-medium text-gray-700 hover:bg-white rounded-md transition"
                >
                  Today
                </button>
                <button
                  (click)="navigate(1)"
                  class="p-2 hover:bg-white rounded-md transition"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
              <div class="flex gap-2 items-center flex-row-reverse">
                <lib-toggle-view
                  (viewModeChange)="onViewModeChange($event)"
                  [viewMode]="facade.viewMode()"
                ></lib-toggle-view>
                <lib-button
                  type="button"
                  variant="primary"
                  (click)="openCreate()"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span class="hidden lg:block">New Appointments</span>
                </lib-button>
              </div>
            </div>
          </div>
          <filter
            class="hidden md:block"
            [activeFilter]="facade.activeFilter()"
            (changeFilter)="onChangeFilter($event)"
          ></filter>
        </div>
        <!-- body -->
        <div
          class=" rounded-xl h-[calc(100%-200px)]  shadow-sm  p-6   overflow-y-auto"
        >
          <filter
            class="md:hidden block mb-2"
            [activeFilter]="facade.activeFilter()"
            (changeFilter)="onChangeFilter($event)"
          ></filter>
          @if (facade.viewMode() === DateType.DAY) {
            <lib-day-view
              [selectedDate]="facade.selectedDate()"
              [appointments]="facade.appointments()"
              [filteredAppointments]="facade.filteredAppointments()"
              [teamMembers]="facade.teamMembers()"
              (editAppointment)="onEditEvent($event)"
            />
          } @else {
            <lib-week-view
              [selectedDate]="facade.selectedDate()"
              [teamMembers]="facade.teamMembers()"
              [activeFilter]="facade.activeFilter()"
              [appointments]="facade.appointments()"
              [weekAppointments]="facade.weekAppointments()"
              (editAppointment)="onEditEvent($event)"
              (dayClick)="onDayClick($event)"
            />
          }
        </div>
      </div>
    </div>
    @if (showForm()) {
      <appointment-form
        [currentAppointments]="currentAppointments"
        (submitAppointment)="onSubmitAppointment($event)"
        [isOpen]="showForm()"
        [appointment]="selectedAppointment()"
        [members]="facade.teamMembers()"
        (closeDialog)="showForm.set(false)"
        (deleteAppointment)="onDelete($event)"
      />
    }
  `,
})
export default class CalendarShellComponent {
  facade = inject(SchedulingFacade);
  currentAppointments = this.facade.currentAppointments;
  viewMode = signal<DateType>(DateType.DAY);
  showForm = signal(false);
  selectedAppointment = signal<Appointment | null>(null);
  DateType = DateType;
  newDate = new Date();
  onSaveForm() {
    this.showForm.set(false);
    this.selectedAppointment.set(null);
  }
  onViewModeChange(mode: DateType) {
    this.facade.setViewMode(mode);
  }
  onNowClick() {
    this.facade.setDate(new Date());
  }
  onChangeFilter(filter: AppointmentStatusFilter) {
    this.facade.setFilter(filter);
  }
  onFilter() {
    this.facade.filteredAppointments();
  }
  onSubmitAppointment({ draft, id }: { id?: string; draft: AppointmentDraft }) {
    if (id) {
      this.facade.updateAppointment(id, draft);
    } else {
      this.facade.createAppointment(draft);
    }
    this.onSaveForm();
  }
  onDelete(id: string) {
    if (id) {
      this.facade.deleteAppointment(id);
      this.onSaveForm();
    }
  }
  onEditEvent(event: Appointment) {
    this.selectedAppointment.set(event);
    this.showForm.set(true);
  }

  openCreate() {
    this.selectedAppointment.set(null);
    this.showForm.set(true);
  }
  navigate(delta: number) {
    this.facade.navigate(delta);
  }
  onDayClick(target:Date) {
    this.facade.setViewMode(DateType.DAY);
    this.facade.setDate(target);
  }
}
