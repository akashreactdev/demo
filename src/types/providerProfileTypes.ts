export interface Location {
  type: "Point";
  coordinates: [number, number];
  _id: string;
}

export interface TeamMember {
  // name: string;
  // role: string;
  // photoUrl?: string;
  _id: string;
  userId: string;
  memberName: string;
  memberEmail: string;
  jobRole: number;
  access: number;
  isInvitationAccepted: number;
  isMemberActive: boolean;
  isMemberDeleted: boolean;
  mobileNumber: string;
  __v: string | number;
}

export interface BankDetail {
  accountName: string;
  accountNumber: string;
  sortCode: string;
  bankName: string;
  _id?: string;
}

export interface ProviderProfile {
  serviceArea: string | null;
  yearInBusiness: number | null;
  turnover: number | null;
  cqcDocument: [
    {
      documentUrl: string | null;
      isApproved: boolean;
      isRejected: boolean;
      _id: string | null;
    }
  ];
  isBusinessProfileComplete: boolean;
  isCompanyVerified: boolean;
  services: [
    {
      name: string;
      value: number;
    }
  ];
  customServices: [
    {
      name: string;
      value: number;
    }
  ];
  currentlyAvailable: boolean;
  vacantBeds: number | null;
  _id: string;
  userId: string;
  dob: string;
  address: string | null;
  houseNo: string | null;
  postCode: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  video: string | null;
  coverImage: string | null;
  businessLogo: string | null;
  businessName: string | null;
  contactNo: string | null;
  typeOfProvider: [
    {
      name: string | null;
      value: number;
    }
  ];
  gender?: number[];
  about: string | null;
  bankDetails: BankDetail[];
  sortCode: string;
  accountNumber: string;
  accountName: string;
  vatNumber?: string | number | null;
  registerBusinessAddress?: string | null;
  isAccountDetailsApproved: boolean | null;
  isPaidAlert: boolean | null;
  companyNumber: string | null;
  yearinBusiness: number | null;
  headCount: number | null;
  tournOver: number | null;
  pricing: number | null;
  teamMember: TeamMember[];
  cqc: string | null;
  dateApproved: string | null;
  approvedBy: string | null;
  status: string | number;
  verificationStatus: string;
  responseRate: number;
  engagementRate: number;
  page: number;
  jobRole: number;
  location: Location;
  createdAt: string;
  updatedAt: string;
  __v: number;
  fullName: string;
  email: string;
  isActive: boolean;
  medicalSpecialties: [
    {
      name: string;
      value: number;
    }
  ];
  isProfileInfoApproved: boolean;
  isProfileInfoRejected: boolean;
  isServicesApproved: boolean;
  isServicesRejected: boolean;
  businessEmail: string | null;
  businessContactNo: string | null;
  assessment: {
    _id: string | null;
    isApproved: boolean | null;
    createdAt: string | null;
    updatedAt: string | null;
    feedBackMessage?: string | null;
  };
  lastLogin?: string | null;
  userSubType: number | null;
}

export interface ProviderProfileResponse {
  data: {
    success: boolean;
    data: ProviderProfile;
  };
}
