import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ButtonComponent,
  InputComponent,
  ModalComponent,
  SelectComponent,
} from '@shared/components';
import {
  endTimeAfterStart,
  noOverlap,
  startTimeNotInPast,
  toDatetimeLocal,
} from '@appointment-calendar/data-access';
import {
  Appointment,
  AppointmentDraft,
  AppointmentStatus,
  TeamMember,
} from '@appointment-calendar/model';
@Component({
  selector: 'appointment-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalComponent,
    SelectComponent,
    InputComponent,
    ButtonComponent,
  ],
  template: `
    <lib-modal
      [isOpen]="isOpen()"
      [title]="appointment() ? 'Edit Appointment' : 'New Appointment'"
      (closeDialog)="onCloseForm()"
    >
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
        <input type="hidden" formControlName="id" />

        <div>
          <lib-input
            placeholder="Zara"
            label="Name"
            type="text"
            formControlName="clientName"
          ></lib-input>
          @if (
            form.get('clientName')?.invalid && form.get('clientName')?.touched
          ) {
            <div class="text-red-500 text-xs mt-1 space-y-0.5">
              @if (form.get('clientName')?.errors?.['required']) {
                <p>Client name is required</p>
              }
            </div>
          }
        </div>

        <div>
          <lib-input
            placeholder="Hair Cut"
            label="Service"
            type="text"
            formControlName="serviceName"
          ></lib-input>
          @if (
            form.get('serviceName')?.invalid && form.get('serviceName')?.touched
          ) {
            <div class="text-red-500 text-xs mt-1 space-y-0.5">
              @if (form.get('serviceName')?.errors?.['required']) {
                <p>Service name is required</p>
              }
            </div>
          }
        </div>

        <div>
          <lib-select
            formControlName="teamMemberId"
            label="Team Member"
            [options]="members().map((m,i) => ({ value: m.id, label: m.name,selected:i===0 }))"
          >
          </lib-select>
          @if (
            form.get('teamMemberId')?.invalid &&
            form.get('teamMemberId')?.touched
          ) {
            <p class="text-red-500 text-xs mt-1">Please select a team member</p>
          }
        </div>

        <div>
          <div class="grid grid-cols-2 gap-4">
            <lib-input
              placeholder=""
              label="Start"
              type="datetime-local"
              formControlName="startTime"
            ></lib-input>
            <lib-input
              placeholder=""
              label="End"
              type="datetime-local"
              formControlName="endTime"
            ></lib-input>
          </div>
          @if (form.errors?.['endBeforeStart']) {
            <p class="text-red-500 text-xs">
              End time must be after start time
            </p>
          }

          @if (form.errors?.['overlap']) {
            <p class="text-red-500 text-xs">
              This time slot overlaps with another appointment of the same
              professional
            </p>
          }
          @if (form.errors?.['startTimeInPast']) {
            <p class="text-red-500 text-xs">Start time cannot be in the past</p>
          }
        </div>

        <lib-select
          formControlName="status"
          label="Status"
          [options]="statuses"
        >
        </lib-select>

        <div class="flex justify-end mt-4 gap-3 pt-2">
          <lib-button
            variant="primary"
            buttonType="filled"
            [disabled]="form.invalid"
            type="submit"
            (click)="onDelete()"
          >
            Save Changes
          </lib-button>
          @if (appointment()) {
            <lib-button type="button" variant="warning" (click)="onDelete()">
              Remove
            </lib-button>
          }
        </div>
      </form>
    </lib-modal>
  `,
})
export class AppointmentForm implements OnInit {
  private fb = inject(FormBuilder);
  public currentAppointments = input.required<Appointment[]>();
  private destroyRef = inject(DestroyRef);
  AppointmentStatus = AppointmentStatus;
  statuses = Object.values(AppointmentStatus).map((el) => ({
    value: el,
    label: el.toUpperCase(),
  }));
  isOpen = input.required<boolean>();
  appointment = input<Appointment | null>(null);
  members = input.required<TeamMember[]>();
  
  submitAppointment = output<{ id?: string; draft: AppointmentDraft }>();
  closeDialog = output<void>();
  deleteAppointment = output<string>();

  form!: FormGroup;

  constructor() {
    const ref = effect(() => {
      const app = this.appointment();
      if (app) {
        this.form.patchValue({
          ...app,
          startTime: toDatetimeLocal(app.startTime),
          endTime: toDatetimeLocal(app.endTime),
        });
      } else {
        this.reset();
      }
    });
    this.destroyRef.onDestroy(() => ref.destroy());
  }
  ngOnInit(): void {
    this.form = this.fb.group(
      {
        id: [''],
        clientName: ['', Validators.required],
        serviceName: ['', Validators.required],
        teamMemberId: ['', Validators.required],
        startTime: ['', Validators.required],
        endTime: ['', Validators.required],
        status: [AppointmentStatus.PENDING, Validators.required],
      },
      {
        validators: [
          endTimeAfterStart,
          startTimeNotInPast,
          noOverlap(() => this.currentAppointments()),
        ],
      },
    );
  }
  onCloseForm() {
    this.closeDialog.emit();
    this.reset();
  }
  reset() {
    this.form.reset({ status: AppointmentStatus.PENDING });
  }
  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue() as unknown as AppointmentDraft & {
      id?: string;
    };
    const draft: AppointmentDraft = {
      clientName: raw.clientName,
      serviceName: raw.serviceName,
      teamMemberId: raw.teamMemberId,
      startTime: new Date(raw.startTime),
      endTime: new Date(raw.endTime),
      status: raw.status as AppointmentStatus,
    };
    this.submitAppointment.emit({ id: raw.id, draft });
  }

  onDelete() {
    const id = this.form.value.id;
    this.deleteAppointment.emit(id);
  }
}
