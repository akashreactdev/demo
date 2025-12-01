export interface UserInfo {
  _id: string;
  userId: string;
  dob: string;
  address: string;
  houseNo: string;
  postCode: string;
  isActive: boolean;
  country: string;
  fundingType: {
    name: string;
    value: number;
  };
  careHelp: Array<{
    name: string;
    value: number;
  }>;
  careService: Array<{
    name: string;
    value: number;
  }>;
  carerGender: {
    name: string;
    value: number;
  };
  carerLanguage: Array<{
    name: string;
    value: number;
  }>;
  driver: boolean;
  smoker: boolean;
  pets: boolean;
  petDetails: string;
  carerInterests: Array<{
    name: string;
    value: number;
  }>;
  carerDetails: string;
  serviceRequirements: Array<{
    name: string;
    value: number;
  }>;
  careStart: {
    name: string;
    value: number;
  };
  overallBookings: string | number;
  activeAgreements: string | number;
  totalSafetyAlerts: string | number;
  supportTickets: string | number;
  careStartTime: string;
  careEndTime: string;
  careStartDate: string;
  hoursPerWeek: number;
  flexibleTime: boolean;
  hourlyRate: number;
  page: number;
  specialtySearch: Record<string, unknown>;
  isBloodPressureEnable: boolean;
  isFitnessTrackerEnable: boolean;
  isHeartRateMonitor: boolean;
  isFaceIbEnabled: boolean;
  isProfileCompleted: boolean;
  isAboutMeCompleted: boolean;
  isCarePreferenceCompleted: boolean;
  wearableDevice: boolean;
  careSchedules: Record<string, unknown>;
  topspecialtySearch: Record<string, unknown>;
  __v: number;
  expectedDuration: {
    name: string;
    value: number;
  };
  fullName: string;
  email: string;
  careDays?: number[];
  timeSlots?: number[];
  createdAt?: string;
  gender: number[];
  authType?: number;
  firstName?: string;
  lastName?: string;
  profile?: string | null;
  summary: {
    activeAgreement: number | null;
    supportTicket: number | null;
    totalBooking: number | null;
    totalSafetyAlert: number | null;
  };
  activeAgreement: activeAgreement[];
  completedAgreement: activeAgreement[];
  mobileNumber: string | null;
  status: number;
}

export interface activeAgreement {
  _id: string;
  agreementId: string;
  endDate: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
  };
}

export interface UserInfoResponse {
  data: {
    success: boolean;
    data: UserInfo;
  };
}

export interface FiltersObjects {
  emailVerification?: string | number | null;
  accountStatus?: string | number | null;
  carePlan?: string | number | null;
  dateFilter?: string | number | null;
  logStatus?: string | number | null;
  logType?: boolean;
  agreementStatus?: string | number | null;
  passportStatus?: string | number | null;
  jobListingStatus?: string | number | null;
  careTypeValue?: string | number | null;
  visitLogStatusValue?: string | number | null;
  supportDateCreated?: string | number | null;
  supportTicketStatus?: string | number | null;
  supportUrgencyLevel?: string | number | null;
  jobListing?: string | number | null;
  accessAccountStatus?: string | number | null;
  accessUserType?: string | number | null;
  transactionPaymentStatus?: string | number | null;
  transactionPaymentType?: string | number | null;
  transactionDate?: string | number | null;
}

export const getSelectedFilters = (): FiltersObjects => {
  try {
    const saved = localStorage.getItem("selectedFilters");
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};
