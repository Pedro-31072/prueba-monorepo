import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const endTimeAfterStart: ValidatorFn = (
  group: AbstractControl,
): ValidationErrors | null => {
  const start = group.get('startTime')?.value;
  const end = group.get('endTime')?.value;

  if (!start || !end) return null;

  const startDate = start instanceof Date ? start : new Date(start);
  const endDate = end instanceof Date ? end : new Date(end);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return null;

  return endDate.getTime() > startDate.getTime()
    ? null
    : { endBeforeStart: true };
};

export const noOverlap = (
  getAppointments: () => {
    startTime: Date;
    endTime: Date;
    id?: string;
    teamMemberId: string;
  }[],
): ValidatorFn => {
  return (group: AbstractControl): ValidationErrors | null => {
    const start = group.get('startTime')?.value;
    const end = group.get('endTime')?.value;
    const memberId = group.get('teamMemberId')?.value as string;
    const currentId = (group.get('id')?.value as string) || '';

    if (!start || !end || !memberId) return null;

    const startDate = start instanceof Date ? start : new Date(start);
    const endDate = end instanceof Date ? end : new Date(end);

    const hasOverlap = getAppointments().some((app) => {
      if (app.id === currentId) return false;

      if (app.teamMemberId !== memberId) return false;

      const appStart =
        app.startTime instanceof Date ? app.startTime : new Date(app.startTime);
      const appEnd =
        app.endTime instanceof Date ? app.endTime : new Date(app.endTime);

      return startDate < appEnd && endDate > appStart;
    });

    return hasOverlap ? { overlap: true } : null;
  };
};

export const startTimeNotInPast: ValidatorFn = (
  group: AbstractControl,
): ValidationErrors | null => {
  const start = group.get('startTime')?.value;

  if (!start) return null;

  const startDate = start instanceof Date ? start : new Date(start);

  if (isNaN(startDate.getTime())) return null;

  const now = new Date();

  now.setSeconds(0, 0);

  return startDate.getTime() >= now.getTime()
    ? null
    : { startTimeInPast: true };
};