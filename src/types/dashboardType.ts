// Dashboard Account Info Response
export interface DashboardAccountInfoResponse {
  data: {
    success: boolean;
    message: string;
    data: DashboardAccountInfoData;
  };
}

export interface DashboardAccountInfoData {
  activeUsers: CountWithChange;
  activeCarers: CountWithChange;
  activeClinicians: CountWithChange;
  activeProviders: CountWithChange;
  activeBrokerage: CountWithChange;
  inactiveAccounts: CountWithChange;
  totalAgreements: CountWithChange;
  totalCompletedCare: CountWithChange;
  totalResources: CountWithChange;
  totalJobs: CountWithChange;
}

export interface CountWithChange {
  count: number;
  percentageChange: string;
}

// Dashboard Pending Info Response
export interface DashboardPendingInfoResponse {
  data: {
    success: boolean;
    message: string;
    data: DashboardPendingInfoData;
  };
}

export interface DashboardPendingInfoData {
  toVerify: number;
  supportTickets: number;
  recruitmentPassport: number;
  pendingDisputes: number;
}

// Dashboard Demographics Info Response
export interface DashboardDemographicsInfoResponse {
  data: {
    success: boolean;
    message: string;
    data: DashboardDemographicsInfoData;
  };
}

export interface DashboardDemographicsInfoData {
  userDemographic: Demographic;
  carerDemographic: Demographic;
  clinicianDemographic: Demographic;
  providerAnalytics: Demographic;
  brokerageAnalytics: Record<string, number>;
}

export interface Demographic {
  byGender: GenderCount;
  byAge: AgeCount;
}

export interface GenderCount {
  Male: number;
  Female: number;
  DontMind: number;
}

export interface AgeCount {
  "18-24": number;
  "25-34": number;
  "35-44": number;
  "45+": number;
}

export interface BrokerageRoleCounts {
  "HR and Care Service Manager": number;
  "Financial Officer": number;
  "Full Service": number;
}

// Dashboard Verification Info Response
export interface DashboardVerificationInfoResponse {
  data: {
    success: boolean;
    message: string;
    data: DashboardVerificationInfoData;
  };
}

export interface DashboardVerificationInfoData {
  userVerification: VerificationItem;
  paymentDisputes: VerificationItem;
  recruitmentPassport: VerificationItem;
  supportTickets: VerificationItem;
  jobList: VerificationItem;
}

export interface VerificationItem {
  [key: string]: number;
  processingRate: number;
}
