import { NgClass } from '@angular/common';
import { Component, ElementRef, inject, input, signal, viewChild } from '@angular/core';
type Button = { label: string; action: () => void };

@Component({
  selector: 'lib-dropbox',
  host: {
    '(click)': 'toggleDropBox()',
    "(document:click)":"onDocumentClick($event)"
  },
  imports: [NgClass],
  template: `
    <div
      class="dropdown  md:hidden block dropdown relative  "
      (clickButton)="toggleDropBox()"
    >
      <ng-content></ng-content>
      @if (dropBoxOpen()) {
        <ul class="dropdown-menu absolute  text-gray-700 z-50 pt-1 shadow-xl" #dropbox>
          @for (
            button of options();
            track button;
            let last = $last;
            let first = $first
          ) {
            <li

              class="hover:bg-gray-400 dark:hover:bg-gray-100 bg-gray-200 "
            >
              <button
                [ngClass]="{ 'rounded-t': first, 'rounded-b': last }"
                (click)="button.action()"
                class="   py-2 px-4 block whitespace-no-wrap w-full"
              >
                {{ button.label.toUpperCase() }}
              </button>
            </li>
          }
        </ul>
      }
    </div>
  `,
})
export class DropboxComponent {
  dropBoxOpen = signal(false);
  dropbox = viewChild<ElementRef<HTMLUListElement>>("dropbox");
  options = input.required<Button[]>();
  private elementRef = inject(ElementRef);
  toggleDropBox() {
    this.dropBoxOpen.update((expanded) => !expanded);
  }
  onDocumentClick(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (this.dropBoxOpen() && !clickedInside) {
      this.dropBoxOpen.set(false);
    }
  }
}
