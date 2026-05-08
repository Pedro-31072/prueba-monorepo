import { NgClass } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'default';
@Component({
  selector: 'lib-button',
  imports: [NgClass],
  template: `
    <button
      [type]="type()"
      class="middle none flex items-center gap-2  center rounded-sm   py-2  font-sans    transition-all   focus:opacity-[0.85]  active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none select-none"
      [disabled]="disabled()"
      [ngClass]="[
        color(),
        buttonType() === 'outline' ? 'border-2 text-gray-900' : 'text-gray-100',
        isIconButton() ? 'px-2' : 'px-4',
      ]"
      (click)="clickButton.emit($event)"
    >
      <ng-content />
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  public type = input.required<'button' | 'submit'>();
  public variant = input<ButtonVariant>();
  buttonType = input<'outline' | 'filled'>('filled');
  isIconButton = input(false, { transform: booleanAttribute });
  public disabled = input(false, { transform: booleanAttribute });
  protected color = computed(() => {
    let textColor = 'text-gray-900';
    let variantColor = 'bg-gray-500';
    if (this.buttonType() === 'filled') {
      textColor = 'text-gray-100';
      if (this.variant() === 'primary') variantColor = 'bg-blue-500';
      else if (this.variant() === 'secondary') variantColor = 'bg-red-500';
      else if (this.variant() === 'success') variantColor = 'bg-green-500';
      else if (this.variant() === 'warning') variantColor = 'bg-red-500';

    } else {
      switch (this.variant()) {
        case 'primary':
          variantColor = 'border-blue-500';
          break;
        case 'secondary':
          variantColor = 'border-red-500';
          break;
        case 'success':
          variantColor = 'border-green-500';
          break;
        case 'warning':
          variantColor = 'border-red-500';
          break;
        default:
          variantColor = 'border-gray-500';
          break;
      }
    }
    return `${variantColor} ${textColor}`;
  });
  clickButton = output<PointerEvent>();
}
