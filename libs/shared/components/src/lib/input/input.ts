import {
  ChangeDetectorRef,
  Component,
  forwardRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';

@Component({
  selector: 'lib-input',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => InputComponent),
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: forwardRef(() => InputComponent),
    },
  ],
  template: `
    <label
      class="mb-2 flex items-start gap-2 flex-col text-sm font-medium text-gray-900 dark:text-gray-400"
    >
      <span>
        {{ label() }}
      </span>
      <input
        [value]="value()"
        (input)="onSelectChange($any($event).target.value)"
        [disabled]="disabled()"
        [type]="type()"
        [placeholder]="'Example: ' + placeholder()"
        class=" bg-gray-50 border-none ring-2
        border-gray-300 text-gray-800 text-sm rounded-xs
        focus:ring-blue-500 block w-full p-2.5"
      />
    </label>
  `,
})
export class InputComponent implements ControlValueAccessor, Validator {
  label = input.required<string>();
  type = input.required<string>();
  placeholder = input.required<string>();
  value = signal<any>('');
  disabled = signal<boolean>(false);
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  private formatValue(obj: any): string {
    if (obj === null || obj === undefined) {
      return '';
    }

    if (obj instanceof Date) {
      return this.toDatetimeLocal(obj);
    }

    if (typeof obj === 'string') {
      return obj;
    }

    return String(obj);
  }

  writeValue(obj: any): void {
    this.value.set(this.formatValue(obj));
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return null;
  }

  registerOnValidatorChange?(fn: () => void): void {}

  onSelectChange(newValue: any): void {
    this.value.set(newValue);
    this.onChange(newValue);
    this.onTouched();
  }

  private toDatetimeLocal(date: Date): string {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  }
}
