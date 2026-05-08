import { Component, input, output } from '@angular/core';
import { DateType } from '@appointment-calendar/model';
import { ButtonComponent, DropboxComponent } from '@shared/components';

@Component({
  selector: 'lib-toggle-view',
  host: {
    class: 'items-center flex items-center',
  },
  imports: [ButtonComponent, DropboxComponent],
  template: `
    <div class="hidden md:flex bg-gray-100 rounded-lg p-1 ">
      @for (button of buttons; track button) {
        <button
          (click)="viewModeChange.emit(button.label)"
          [class.bg-white.shadow-sm]="viewMode() === button.label"
          class="px-4 py-1.5 rounded-md text-sm font-medium transition"
        >
          {{ button.label }}
        </button>
      }
    </div>
    <lib-dropbox [options]="buttons">
      <lib-button type="button" [buttonType]="'outline'">
        <div class="gap-1.25 flex flex-col">
          <span class="w-5 h-0.5 rounded bg-gray-800"></span>
          <span class="w-full h-0.5 rounded bg-gray-800"></span>
          <span class="w-full h-0.5 rounded bg-gray-800"></span>
        </div>
      </lib-button>
    </lib-dropbox>
  `,
})
export class ToggleViewComponent {
  DateType = DateType;
  viewModeChange = output<DateType>();
  viewMode = input<DateType>(DateType.DAY);
  buttons = Object.values(DateType).map((button) => ({
    label:button,
    action: () => {
      this.viewModeChange.emit(button);
    },
  }));
}
