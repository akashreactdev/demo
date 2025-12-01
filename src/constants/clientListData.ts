type ServiceStatus = "In-progress" | "Completed";

export interface ClientListData {
  id?: number;
  name?: string;
  serviceStartDate?: string;
  serviceEndDate?: string;
  careType?: string;
  visitLogs?: number;
  careNotes?: number;
  serviceStatus?: ServiceStatus;
}

export const clientListData: ClientListData[] = [
  {
    id: 1,
    name: "Trent Graham",
    serviceStartDate: "05.02.2025",
    serviceEndDate: "05.02.2025",
    careType: "Hourly",
    visitLogs: 5,
    careNotes: 5,
    serviceStatus: "In-progress",
  },
  {
    id: 2,
    name: "Trent Graham",
    serviceStartDate: "05.02.2025",
    serviceEndDate: "05.02.2025",
    careType: "Hourly",
    visitLogs: 5,
    careNotes: 5,
    serviceStatus: "Completed",
  },
  {
    id: 3,
    name: "Trent Graham",
    serviceStartDate: "05.02.2025",
    serviceEndDate: "05.02.2025",
    careType: "Hourly",
    visitLogs: 5,
    careNotes: 5,
    serviceStatus: "In-progress",
  },
  {
    id: 4,
    name: "Trent Graham",
    serviceStartDate: "05.02.2025",
    serviceEndDate: "05.02.2025",
    careType: "Hourly",
    visitLogs: 5,
    careNotes: 5,
    serviceStatus: "Completed",
  },
  {
    id: 5,
    name: "Trent Graham",
    serviceStartDate: "05.02.2025",
    serviceEndDate: "05.02.2025",
    careType: "Hourly",
    visitLogs: 5,
    careNotes: 5,
    serviceStatus: "In-progress",
  },
  {
    id: 6,
    name: "Trent Graham",
    serviceStartDate: "05.02.2025",
    serviceEndDate: "05.02.2025",
    careType: "Hourly",
    visitLogs: 5,
    careNotes: 5,
    serviceStatus: "Completed",
  },
  {
    id: 7,
    name: "Trent Graham",
    serviceStartDate: "05.02.2025",
    serviceEndDate: "05.02.2025",
    careType: "Hourly",
    visitLogs: 5,
    careNotes: 5,
    serviceStatus: "Completed",
  },
  {
    id: 8,
    name: "Trent Graham",
    serviceStartDate: "05.02.2025",
    serviceEndDate: "05.02.2025",
    careType: "Hourly",
    visitLogs: 5,
    careNotes: 5,
    serviceStatus: "In-progress",
  },
  {
    id: 9,
    name: "Trent Graham",
    serviceStartDate: "05.02.2025",
    serviceEndDate: "05.02.2025",
    careType: "Hourly",
    visitLogs: 5,
    careNotes: 5,
    serviceStatus: "Completed",
  },
  {
    id: 10,
    name: "Trent Graham",
    serviceStartDate: "05.02.2025",
    serviceEndDate: "05.02.2025",
    careType: "Hourly",
    visitLogs: 5,
    careNotes: 5,
    serviceStatus: "Completed",
  },
];
