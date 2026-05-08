import { UpperCasePipe } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { AppointmentStatusFilter } from '@appointment-calendar/model';
import { DropboxComponent } from '@shared/components';

@Component({
  selector: 'filter',
  imports: [DropboxComponent,UpperCasePipe],
  template: `
    <div class="md:flex gap-3 mt-4 pt-4 border-t items-center hidden">
      @for (status of statuses; track status) {
        <button
          (click)="toggleFilter(status)"
          [class]="getClass(status)"
          [class.bg-red-200]="
            status === activeFilter() &&
            status === AppointmentStatusFilter.CANCELLED
          "
          [class.bg-green-200]="
            status === activeFilter() &&
            status === AppointmentStatusFilter.CONFIRMED
          "
          [class.bg-yellow-200]="
            status === activeFilter() &&
            status === AppointmentStatusFilter.PENDING
          "
          class="cursor-pointer ring-2 px-3 py-1 rounded-full text-xs font-medium transition uppercase"
        >
          {{ status |uppercase}}
        </button>
      }
      @if (activeFilter()) {
        <button
          (click)="toggleFilter(AppointmentStatusFilter.NONE)"
          class="text-xs cursor-pointer text-gray-400 hover:text-gray-600 underline"
        >
          Clear
        </button>
      }
    </div>

    <div class="flex pt-4 items-center md:hidden gap-2">
      <lib-dropbox [options]="optionsStatuses">
        <button
          type="button"
          class="hover:bg-gray-200 rounded-full cursor-pointer"
        >
          @if(activeFilter()!==AppointmentStatusFilter.NONE){
            <svg
            class="fill-gray-900"
            xmlns="http://www.w3.org/2000/svg"
            height="35px"
            viewBox="0 -960 960 960"
            width="35px"
            fill="#e3e3e3"
          >
            <path
              d="M456.18-192Q446-192 439-198.9t-7-17.1v-227L197-729q-9-12-2.74-25.5Q200.51-768 216-768h528q15.49 0 21.74 13.5Q772-741 763-729L528-443v227q0 10.2-6.88 17.1-6.89 6.9-17.06 6.9h-47.88ZM480-498l162-198H317l163 198Zm0 0Z"
            />
          </svg>
          }@else {
            <svg class="fill-gray-900" xmlns="http://www.w3.org/2000/svg" height="35px" viewBox="0 -960 960 960" width="35px" fill="#e3e3e3"><path d="m569-492-51-52 125-152H366l-72-72h450q15 0 21.5 13.5T763-729L569-492ZM768-90 528-330v114q0 10-7 17t-17 7h-48q-10 0-17-7t-7-17v-210L90-768l51-51 678 678-51 51ZM518-544Z"/></svg>
          }

        </button>
      </lib-dropbox>
      @if (activeFilter()) {
        <button
          (click)="toggleFilter(AppointmentStatusFilter.NONE)"
          class="text-sm cursor-pointer text-gray-400 hover:text-gray-600 underline"
        >
          Clear
        </button>
      }
    </div>
  `,
})
export class FilterComponent {
  AppointmentStatusFilter = AppointmentStatusFilter;
  activeFilter = input.required();
  getClass(filter: AppointmentStatusFilter) {
    if (filter === AppointmentStatusFilter.CONFIRMED)
      return 'hover:bg-green-200 ring-green-400 bg-green-50 border-green-200 text-green-700';
    if (filter === AppointmentStatusFilter.PENDING)
      return 'hover:bg-yellow-200 ring-yellow-400 bg-yellow-50 border-yellow-200 text-yellow-700';
    if (filter === AppointmentStatusFilter.CANCELLED)
      return 'hover:bg-red-200 ring-red-400 bg-red-50 border-red-200 text-red-700';
    return 'hover:border-grey-300 ring-grey-400 bg-grey-50 border-grey-200 text-grey-700';
  }
  changeFilter = output<AppointmentStatusFilter>();
  toggleFilter(status: AppointmentStatusFilter) {
    this.changeFilter.emit(status);
  }
  options = []

  statuses = Object.values(AppointmentStatusFilter).filter(
    (el) => (el as AppointmentStatusFilter) !== AppointmentStatusFilter.NONE,
  );
  optionsStatuses = this.statuses.map((status)=>({
    label:status,
    action:()=>{
      this.toggleFilter(status)
    }
  }))
}
