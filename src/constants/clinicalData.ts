interface ClinicalData {
  id?: number;
  name?: string;
  dateApproved?: string;
  approvedBy?: string;
  hourlyRate?: string;
  responseRate?: string;
  completedJobs?: number;
  activeJobs?: number;
}
export const clinicalData: ClinicalData[] = [
  {
    id: 1,
    name: "Trent Graham",
    dateApproved: "05.02.2025",
    approvedBy: "Reuben Hale",
    hourlyRate: "£18.00",
    responseRate: "98%",
    completedJobs: 103,
    activeJobs: 5,
  },
  {
    id: 2,
    name: "Haylee Owen",
    dateApproved: "05.02.2025",
    approvedBy: "Reuben Hale",
    hourlyRate: "£18.00",
    responseRate: "98%",
    completedJobs: 103,
    activeJobs: 5,
  },
  {
    id: 3,
    name: "Trent Graham",
    dateApproved: "05.02.2025",
    approvedBy: "Reuben Hale",
    hourlyRate: "£18.00",
    responseRate: "98%",
    completedJobs: 103,
    activeJobs: 5,
  },
  {
    id: 4,
    name: "Flynn James",
    dateApproved: "05.02.2025",
    approvedBy: "Reuben Hale",
    hourlyRate: "£18.00",
    responseRate: "98%",
    completedJobs: 103,
    activeJobs: 5,
  },
  {
    id: 5,
    name: "Trent Graham",
    dateApproved: "05.02.2025",
    approvedBy: "Reuben Hale",
    hourlyRate: "£18.00",
    responseRate: "98%",
    completedJobs: 103,
    activeJobs: 5,
  },
  {
    id: 6,
    name: "Gideon Perez",
    dateApproved: "05.02.2025",
    approvedBy: "Reuben Hale",
    hourlyRate: "£18.00",
    responseRate: "98%",
    completedJobs: 103,
    activeJobs: 5,
  },
  {
    id: 7,
    name: "Zyaire Dejesus",
    dateApproved: "05.02.2025",
    approvedBy: "Reuben Hale",
    hourlyRate: "£18.00",
    responseRate: "98%",
    completedJobs: 103,
    activeJobs: 5,
  },
  {
    id: 8,
    name: "Zara Yu",
    dateApproved: "05.02.2025",
    approvedBy: "Reuben Hale",
    hourlyRate: "£18.00",
    responseRate: "98%",
    completedJobs: 103,
    activeJobs: 5,
  },
  {
    id: 9,
    name: "Zara Yu",
    dateApproved: "05.02.2025",
    approvedBy: "Reuben Hale",
    hourlyRate: "£18.00",
    responseRate: "98%",
    completedJobs: 103,
    activeJobs: 5,
  },
  {
    id: 10,
    name: "Zara Yu",
    dateApproved: "05.02.2025",
    approvedBy: "Reuben Hale",
    hourlyRate: "£18.00",
    responseRate: "98%",
    completedJobs: 103,
    activeJobs: 5,
  },
  {
    id: 11,
    name: "Zara Yu",
    dateApproved: "05.02.2025",
    approvedBy: "Reuben Hale",
    hourlyRate: "£18.00",
    responseRate: "98%",
    completedJobs: 103,
    activeJobs: 5,
  },
  {
    id: 12,
    name: "Zara Yu",
    dateApproved: "05.02.2025",
    approvedBy: "Reuben Hale",
    hourlyRate: "£18.00",
    responseRate: "98%",
    completedJobs: 103,
    activeJobs: 5,
  },
  {
    id: 13,
    name: "Zara Yu",
    dateApproved: "05.02.2025",
    approvedBy: "Reuben Hale",
    hourlyRate: "£18.00",
    responseRate: "98%",
    completedJobs: 103,
    activeJobs: 5,
  },
];

export enum RelationshipType {
  "Friend" = 1,
  "Family member" = 2,
  "Colleague" = 3,
  "Neighbor" = 4,
}
export enum RelationshipDuration {
  "Less than six months" = 1,
  "Six months to one year" = 2,
  "One to two years" = 3,
  "Two to five years" = 4,
  "Five to ten years" = 5,
  "More than ten years" = 6,
}

export enum TypeOfCare {
  "Urgent care" = 1,
  "Hourly care" = 2,
  "Overnight care" = 3,
  "Live in care" = 4,
}

export enum CareType {
  "Urgent care" = 1,
  "Hourly" = 2,
  "Overnight" = 3,
  "Live in" = 4,
}

export enum PaymentStatusList {
  "Pending" = 1,
  "Paid" = 2,
  "Disputed" = 3,
}

export enum ServiceStatus {
  "In-progress" = 1,
  "Completed" = 2,
}

export enum SignOffStatus {
  "Pending" = 1,
  "Sign off" = 2,
  "Declined" = 3,
}
