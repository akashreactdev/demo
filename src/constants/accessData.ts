type Status = "Suspended" | "Active";

interface UsersData {
  id?: number;
  name?: string;
  type?: string;
  dateJoined?: string;
  lastLogin?: string;
  status?: Status;
}

export const accessData: UsersData[] = [
  {
    id: 1,
    name: "Kat hall",
    type: "Super-admin",
    dateJoined: "05.02.2025",
    lastLogin: "05.02.2025",
    status: "Suspended",
  },
  {
    id: 2,
    name: "Kate Peacock",
    type: "Sub-admin",
    dateJoined: "05.02.2025",
    lastLogin: "05.02.2025",
    status: "Active",
  },
  {
    id: 3,
    name: "Kat hall",
    type: "Super-admin",
    dateJoined: "05.02.2025",
    lastLogin: "05.02.2025",
    status: "Suspended",
  },
  {
    id: 4,
    name: "Kate Peacock",
    type: "Sub-admin",
    dateJoined: "05.02.2025",
    lastLogin: "05.02.2025",
    status: "Active",
  },
  {
    id: 5,
    name: "Kate Peacock",
    type: "Sub-admin",
    dateJoined: "05.02.2025",
    lastLogin: "05.02.2025",
    status: "Active",
  },
  {
    id: 6,
    name: "Kat hall",
    type: "Super-admin",
    dateJoined: "05.02.2025",
    lastLogin: "05.02.2025",
    status: "Suspended",
  },
  {
    id: 7,
    name: "Kate Peacock",
    type: "Sub-admin",
    dateJoined: "05.02.2025",
    lastLogin: "05.02.2025",
    status: "Active",
  },
  {
    id: 8,
    name: "Kat hall",
    type: "Super-admin",
    dateJoined: "05.02.2025",
    lastLogin: "05.02.2025",
    status: "Suspended",
  },
  {
    id: 9,
    name: "Kat hall",
    type: "Super-admin",
    dateJoined: "05.02.2025",
    lastLogin: "05.02.2025",
    status: "Suspended",
  },
  {
    id: 10,
    name: "Kat hall",
    type: "Super-admin",
    dateJoined: "05.02.2025",
    lastLogin: "05.02.2025",
    status: "Suspended",
  },
  {
    id: 11,
    name: "Kat hall",
    type: "Super-admin",
    dateJoined: "05.02.2025",
    lastLogin: "05.02.2025",
    status: "Suspended",
  },
  {
    id: 12,
    name: "Kat hall",
    type: "Super-admin",
    dateJoined: "05.02.2025",
    lastLogin: "05.02.2025",
    status: "Suspended",
  },
  {
    id: 13,
    name: "Kat hall",
    type: "Super-admin",
    dateJoined: "05.02.2025",
    lastLogin: "05.02.2025",
    status: "Suspended",
  },
  {
    id: 14,
    name: "Kat hall",
    type: "Super-admin",
    dateJoined: "05.02.2025",
    lastLogin: "05.02.2025",
    status: "Suspended",
  },
  {
    id: 15,
    name: "Kat hall",
    type: "Super-admin",
    dateJoined: "05.02.2025",
    lastLogin: "05.02.2025",
    status: "Suspended",
  },
  {
    id: 16,
    name: "Kat hall",
    type: "Super-admin",
    dateJoined: "05.02.2025",
    lastLogin: "05.02.2025",
    status: "Suspended",
  },
  {
    id: 17,
    name: "Kat hall",
    type: "Super-admin",
    dateJoined: "05.02.2025",
    lastLogin: "05.02.2025",
    status: "Suspended",
  },
  {
    id: 18,
    name: "Kat hall",
    type: "Super-admin",
    dateJoined: "05.02.2025",
    lastLogin: "05.02.2025",
    status: "Suspended",
  },
  {
    id: 19,
    name: "Kat hall",
    type: "Super-admin",
    dateJoined: "05.02.2025",
    lastLogin: "05.02.2025",
    status: "Suspended",
  },
  {
    id: 20,
    name: "Kat hall",
    type: "Super-admin",
    dateJoined: "05.02.2025",
    lastLogin: "05.02.2025",
    status: "Suspended",
  },
];

export enum userType {
  "Super-admin" = 6,
  "Sub-admin" = 1,
}

export enum accessDataStatus {
  "Approve" = 3,
  "Suspended" = 8,
}

export enum AdminUserPermission {
  VIEW_USER_DETAILS = 1,
  DEACTIVATE_USER_ACCOUNT = 2,
  CREATE_HEALTH_VIDEO = 3,
}

export enum AdminCarerPermission {
  VIEW_CARER_DETAILS = 1,
  VERIFY_NEW_CARER_DETAILS = 2,
  VIEW_CARER_PAYMENT_DISPUTE = 3,
}

export enum AdminClinicalPermission {
  VIEW_CLINICAL_DETAILS = 1,
  VERIFY_NEW_CLINICAL_DETAILS = 2,
  VIEW_CLINICAL_PAYMENT_DISPUTE = 3,
}

export enum AdminProviderPermission {
  VIEW_PROVIDER_DETAILS = 1,
  VERIFY_NEW_PROVIDER_DETAILS = 2,
  VIEW_PROVIDER_PAYMENT_DISPUTE = 3,
  CREATE_PROVIDER_RESOURCE = 4,
}
