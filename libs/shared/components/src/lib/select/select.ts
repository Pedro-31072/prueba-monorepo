import { Component, forwardRef, input, signal } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';

type SelectOption<T = any> = { value: T; label: string; selected?: boolean };
type SelectOptions<T = any> = SelectOption<T>[];

@Component({
  selector: 'lib-select',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => SelectComponent),
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: forwardRef(() => SelectComponent),
    },
  ],
  template: `
    <label
      class="mb-2 flex items-start gap-2 flex-col text-sm font-medium text-gray-900 dark:text-gray-400"
    >
      <span>{{ label() }}</span>
      <select
        [value]="value()"
        (change)="onSelectChange($any($event).target.value)"
        [disabled]="disabled()"
        class="
        bg-gray-50 border-none ring-2
        border-gray-300 text-gray-800 text-sm rounded-xs
        focus:ring-blue-500 block w-full p-2.5
        appearance-none
        py-2 pl-4 pr-10
        focus:outline-none focus:ring-2
        bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M6%208l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')]
        bg-size-[1.5em_1.5em]
        bg-position-[right_0.5rem_center]
        bg-no-repeat
        "
      >
        <option selected disabled>Select a option</option>
        @for (option of options(); track option.value) {
          <option [selected]="isSelected(option.value)" [value]="option.value">
            {{ option.label }}
          </option>
        }
      </select>
    </label>
  `,
})
export class SelectComponent implements ControlValueAccessor, Validator {
  label = input.required<string>();
  options = input.required<SelectOptions>();
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

  isSelected(optionValue: any): boolean {
    return this.value() === this.formatValue(optionValue);
  }

  writeValue(obj: any): void {
    const formatted = this.formatValue(obj);
    if (!formatted && this.options().length > 0) {
      const firstOption = this.options()[0];
      const firstValue = this.formatValue(firstOption.value);
      this.value.set(firstValue);
      Promise.resolve().then(() => this.onChange(firstValue));
    } else {
      this.value.set(formatted);
    }
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