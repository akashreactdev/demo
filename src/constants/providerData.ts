interface ProviderData {
  id?: number;
  name?: string;
  dateApproved?: string;
  approvedBy?: string;
  providerCategory?: string;
  responseRate?: string;
  engagementRate?: string;
}
export const providerData: ProviderData[] = [
  {
    id: 1,
    name: "Guernsey Cheshire Home",
    dateApproved: "05.02.2025",
    approvedBy: "Kat Hall",
    providerCategory: "Care home",
    responseRate: "98%",
    engagementRate: "98%",
  },
  {
    id: 2,
    name: "Guernsey Cheshire Home",
    dateApproved: "05.02.2025",
    approvedBy: "Kat Hall",
    providerCategory: "Home care",
    responseRate: "98%",
    engagementRate: "98%",
  },
  {
    id: 3,
    name: "Guernsey Cheshire Home",
    dateApproved: "05.02.2025",
    approvedBy: "Kat Hall",
    providerCategory: "Voluntary care",
    responseRate: "98%",
    engagementRate: "98%",
  },
  {
    id: 4,
    name: "Guernsey Cheshire Home",
    dateApproved: "05.02.2025",
    approvedBy: "Kat Hall",
    providerCategory: "Retirement home",
    responseRate: "98%",
    engagementRate: "98%",
  },
  {
    id: 5,
    name: "Guernsey Cheshire Home",
    dateApproved: "05.02.2025",
    approvedBy: "Kat Hall",
    providerCategory: "Voluntary care",
    responseRate: "98%",
    engagementRate: "98%",
  },
  {
    id: 6,
    name: "Guernsey Cheshire Home",
    dateApproved: "05.02.2025",
    approvedBy: "Kat Hall",
    providerCategory: "Care home",
    responseRate: "98%",
    engagementRate: "98%",
  },
  {
    id: 7,
    name: "Guernsey Cheshire Home",
    dateApproved: "05.02.2025",
    approvedBy: "Kat Hall",
    providerCategory: "Voluntary care",
    responseRate: "98%",
    engagementRate: "98%",
  },
  {
    id: 8,
    name: "Guernsey Cheshire Home",
    dateApproved: "05.02.2025",
    approvedBy: "Kat Hall",
    providerCategory: "Home care",
    responseRate: "98%",
    engagementRate: "98%",
  },
  {
    id: 9,
    name: "Guernsey Cheshire Home",
    dateApproved: "05.02.2025",
    approvedBy: "Kat Hall",
    providerCategory: "Care home",
    responseRate: "98%",
    engagementRate: "98%",
  },
  {
    id: 10,
    name: "Guernsey Cheshire Home",
    dateApproved: "05.02.2025",
    approvedBy: "Kat Hall",
    providerCategory: "Home care",
    responseRate: "98%",
    engagementRate: "98%",
  },
];

export enum UserStatus {
  "Awaiting Verification" = 1,
  "Review" = 2,
  "Approved" = 3,
  "Pending" = 4,
  "Under Review" = 5,
  "Declined" = 6,
  "Awaiting Approval" = 7,
  "Suspended" = 8,
}

export enum TeamMemberJobStatus {
  "carer assistant" = 1,
  "senior carer assistant" = 2,
  "nurse" = 3,
  "clinical lead" = 4,
  "registered manager" = 5,
  "deputy manager" = 6,
  "operations" = 7,
}

export enum MemberAccessEnum {
  "Super Admin" = 1,
  "Admin" = 2,
  "Sub Admin" = 3,
}

export enum ProviderCateogry {
  "Home care" = 1,
  "Care home" = 2,
  "Voluntry care" = 3,
  "Retirement community" = 4,
}

export enum ProviderType {
  "Regulated" = 1,
  "Unregulated" = 2,
}

export enum JobFrequency {
  Hourly = 1,
  Urgent = 2,
  Overnight = 3,
  LiveIn = 4,
}
export enum CarerGender {
  Female = 1,
  Male = 2,
  None = 3,
}
export enum BudgetType {
  "Hourly price" = 1,
  "Fixed price" = 2,
}

export enum RequiredCertificates {
  "First Aid" = 1,
  "CPR" = 2,
  "Medication Management" = 3,
  "Dementia Care" = 4,
  "Palliative Care" = 5,
  "Mental Health Support" = 6,
  "No Specific Certificates" = 7,
}
