import { AppointmentStatus } from "../enums/appointment-status.enum";

export interface Appointment {
  id: string;
  clientName: string;
  serviceName: string;
  teamMemberId: string;
  startTime: Date;
  endTime: Date;
  status: AppointmentStatus;
}


export interface AppointmentDraft {
  clientName: string;
  serviceName: string;
  teamMemberId: string;
  startTime: Date;
  endTime: Date;
  status: AppointmentStatus;
}
