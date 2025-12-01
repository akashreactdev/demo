type LegalSignedStatus = "Pending" | "Yes";

interface CarerData {
  id?: number;
  name?: string;
  dateApproved?: string;
  approvedBy?: string;
  hourlyRate?: string;
  responseRate?: string;
  completedJobs?: number;
  activeJobs?: number;
  legalSigned?: LegalSignedStatus;
}
export const carerData: CarerData[] = [
  {
    id: 1,
    name: "Trent Graham",
    dateApproved: "05.02.2025",
    approvedBy: "Reuben Hale",
    hourlyRate: "£18.00",
    responseRate: "98%",
    completedJobs: 103,
    activeJobs: 5,
    legalSigned: "Pending",
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
    legalSigned: "Pending",
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
    legalSigned: "Yes",
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
    legalSigned: "Pending",
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
    legalSigned: "Yes",
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
    legalSigned: "Yes",
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
    legalSigned: "Pending",
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
    legalSigned: "Pending",
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
    legalSigned: "Pending",
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
    legalSigned: "Pending",
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
    legalSigned: "Pending",
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
    legalSigned: "Pending",
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
    legalSigned: "Pending",
  },
];

export enum PassportStatus {
  Pending = 2,
  UnderReview = 1,
  PassportIssued = 3,
  Declined = 4,
}

export const AccountStatusMap: Record<number, string> = {
  1: "pending",
  3: "active",
  6: "deactivated",
};

export enum IdCardType {
  "Passport" = 1,
  "Driving license" = 2,
  "National ID" = 3,
  "Residencepermit" = 4,
  "Other" = 5,
}

export enum WorkingStatus {
  "Employed" = 1,
  "Un Employed" = 2,
  "Contractor" = 3,
  "part time" = 4,
}