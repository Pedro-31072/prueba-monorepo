import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
@Component({
  selector: 'lib-modal',
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-gray-800">{{ title() }}</h2>
            <button type="button" (click)="onCLose()" >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <ng-content></ng-content >
        </div>
      </div>
    }
  `,
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ModalComponent {
  isOpen = input.required<boolean>();
  title = input.required<string>();
  closeDialog = output<void>();
  onCLose(){
    this.closeDialog.emit();
  }
}
