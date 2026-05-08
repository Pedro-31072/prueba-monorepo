import { Appointment, AppointmentStatusFilter } from "@appointment-calendar/model";

export const filteredAppointmentByStatus = (appointment:Appointment,activeFilter:AppointmentStatusFilter) => activeFilter===AppointmentStatusFilter.NONE?true:(appointment.status as unknown) as AppointmentStatusFilter === activeFilter
