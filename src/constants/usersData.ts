type EmailVerifiedStatus = "Pending" | "Verified";

interface UsersData {
  id?: number;
  name?: string;
  dateJoined?: string;
  lastLogin?: string;
  emailVerified?: EmailVerifiedStatus;
  loginMethod?: string;
}

export const usersData: UsersData[] = [
  {
    id: 1,
    name: "Trent Graham",
    dateJoined: "05.02.2025",
    lastLogin: "05.02.2025",
    emailVerified: "Pending",
    loginMethod: "Email",
  },
  {
    id: 2,
    name: "Haylee Owen",
    dateJoined: "05.02.2025",
    lastLogin: "05.02.2025",
    emailVerified: "Verified",
    loginMethod: "Apple",
  },
  {
    id: 3,
    name: "Trent Graham",
    dateJoined: "05.02.2025",
    lastLogin: "05.02.2025",
    emailVerified: "Verified",
    loginMethod: "Google",
  },
  {
    id: 4,
    name: "Flynn James",
    dateJoined: "05.02.2025",
    lastLogin: "05.02.2025",
    emailVerified: "Pending",
    loginMethod: "Facebook",
  },
  {
    id: 5,
    name: "Trent Graham",
    dateJoined: "05.02.2025",
    lastLogin: "05.02.2025",
    emailVerified: "Verified",
    loginMethod: "Email",
  },
  {
    id: 6,
    name: "Gideon Perez",
    dateJoined: "05.02.2025",
    lastLogin: "05.02.2025",
    emailVerified: "Pending",
    loginMethod: "Facebook",
  },
  {
    id: 7,
    name: "Zara Yu",
    dateJoined: "05.02.2025",
    lastLogin: "05.02.2025",
    emailVerified: "Verified",
    loginMethod: "Email",
  },
  {
    id: 8,
    name: "Zara Yu",
    dateJoined: "05.02.2025",
    lastLogin: "05.02.2025",
    emailVerified: "Pending",
    loginMethod: "Email",
  },
  {
    id: 9,
    name: "Trent Graham",
    dateJoined: "05.02.2025",
    lastLogin: "05.02.2025",
    emailVerified: "Verified",
    loginMethod: "Facebook",
  },
  {
    id: 10,
    name: "Trent Graham",
    dateJoined: "05.02.2025",
    lastLogin: "05.02.2025",
    emailVerified: "Pending",
    loginMethod: "Email",
  },
];

export enum GenderEnum {
  MALE = 1,
  FEMALE = 2,
}

export enum AuthType {
  Email = 1,
  Google = 2,
  Apple = 3,
  Facebook = 4,
}

export enum CarePlanStatus {
  Active = 1,
  Archieve = 2,
  Deleted = 3,
  Updated = 4,
}

export enum ServiceType {
  "Urgent care" = 1,
  "Hourly" = 2,
  "Overnight" = 3,
  "Live in" = 4,
}

export enum PaymentStatus {
  "Unpaid" = 1,
  "Paid" = 2,
}

export enum InvoiceStatus {
  "Pending" = 1,
  "Approved" = 2,
  "Rejected" = 3,
}

export enum AgreementStatus {
  "Pending" = 1,
  "Approved" = 2,
  "Rejected" = 3,
  "Cancelled" = 4,
}

export enum CareDay {
  "Monday" = 1,
  "Tuesday" = 2,
  "Wednesday" = 3,
  "Thursday" = 4,
  "Friday" = 5,
  "Saturday" = 6,
  "Sunday" = 7,
}

export enum Gender {
  "Male" = 1,
  "female" = 2,
}

export enum Frequency {
  "Hourly" = 1,
  "Daily" = 2,
  "Weekly" = 3,
  "BiWeekly" = 4,
  "Monthly" = 5,
  "AsNeeded" = 6,
  "Overnight" = 7,
  "LiveIn" = 8,
}

export enum UserBases {
  "All" = 1,
  "User" = 2,
  "Carer" = 3,
  "Clinical" = 4,
  "Provider" = 5,
}

export enum DateFilterEnum {
  LESS_THAN_MONTH = "less_than_month",
  WITHIN_6_MONTHS = "within_6_months",
  LESS_THAN_YEAR = "less_than_year",
  MORE_THAN_YEAR = "more_than_year",
}

export const DateFilterOptions = [
  {
    id: 1,
    label: "Less than a month",
    value: DateFilterEnum.LESS_THAN_MONTH,
  },
  {
    id: 2,
    label: "Within 6 months",
    value: DateFilterEnum.WITHIN_6_MONTHS,
  },
  {
    id: 3,
    label: "Less than a year",
    value: DateFilterEnum.LESS_THAN_YEAR,
  },
  {
    id: 4,
    label: "More than a year",
    value: DateFilterEnum.MORE_THAN_YEAR,
  },
];

export const getDateFilterLabel = (value?: string | number | null): string => {
  if (!value) return "";
  return DateFilterOptions.find((f) => f.value === value)?.label || "";
};

export const carePlanMap: Record<number, string | number | null> = {
  1: "Active",
  2: "Archived",
};

export const AgreementStatusMap: Record<string, string | number | null> = {
  active: "Active",
  completed: "Completed",
};

// Enum for Medication Log Type
export enum MedicationLogType {
  CarerLog = 0,
  Prescription = 1,
}

// Map to display string in UI
export const MedicationTypeMap: Record<MedicationLogType, string> = {
  [MedicationLogType.CarerLog]: "Carer Logs",
  [MedicationLogType.Prescription]: "Scanned Prescriptions",
};

export enum MedicationLogStatusEnum {
  Administered = "administered",
  Deleted = "deleted",
  Active = "active",
  Archived = "archived",
}

export const MedicationLogStatusLabels: Record<
  MedicationLogStatusEnum,
  string
> = {
  [MedicationLogStatusEnum.Administered]: "Administrated",
  [MedicationLogStatusEnum.Deleted]: "Deleted",
  [MedicationLogStatusEnum.Active]: "Active",
  [MedicationLogStatusEnum.Archived]: "Archived",
};
