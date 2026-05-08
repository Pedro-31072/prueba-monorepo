import {Appointment, TeamMember,AppointmentStatus} from "@appointment-calendar/model"
export const MOCK_MEMBERS: TeamMember[] = [
  { id: '1', name: 'Ana García', color: 'bg-blue-500' },
  { id: '2', name: 'Carlos Ruiz', color: 'bg-emerald-500' },
  { id: '3', name: 'María López', color: 'bg-violet-500' },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: '101',
    clientName: 'Juan Pérez',
    serviceName: 'Hair Cut',
    teamMemberId: '1',
    startTime: new Date(2026, 4, 6, 9, 0),
    endTime: new Date(2026, 4, 6, 9, 30),
    status: AppointmentStatus.CONFIRMED,
  },
  {
    id: '102',
    clientName: 'Laura Martínez',
    serviceName: 'Hair Paiting',
    teamMemberId: '1',
    startTime: new Date(2026, 4, 6, 10, 0),
    endTime: new Date(2026, 4, 6, 11, 30),
    status: AppointmentStatus.PENDING,
  },
  {
    id: '103',
    clientName: 'Zara',
    serviceName: 'Hair Paiting',
    teamMemberId: '2',
    startTime: new Date(2026, 4, 6, 11, 0),
    endTime: new Date(2026, 4, 7, 12, 30),
    status: AppointmentStatus.CANCELLED,
  },
];
