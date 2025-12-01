export type CarerProfile = {
  success: boolean;
  message: string;
  data: CarerProfileData;
};

export interface CareDay {
  name: string;
  value: number;
}

export interface TimeSlot {
  name: string;
  value: number;
}

export interface CareSchedule {
  _id: string | null;
  careDays: CareDay;
  timeSlots: TimeSlot[];
}
export interface Subcondition {
  subcondition: string;
}

export interface ConditionResponse {
  [category: string]: Subcondition[];
}

export type CarerProfileData = {
  isIdImageApproved: boolean | null;
  isIdFrontApproved: boolean | null;
  isIdBackApproved: boolean | null;
  isAccountDetailsApproved: boolean | null;
  isPaidAlert: boolean | null;
  conditionExperienceGrouped: ConditionResponse;
  urgentCareSchedule: CareSchedule[];
  createdAt: string;
  isOnfidoIdVerified: boolean;
  rateNegotiable: boolean | string | null;
  sortCode: string;
  accountNumber: string;
  drivingLicense: boolean;
  clinicalTittle: string | null;
  accountName: string;
  countryOfResidence: string | null;
  mobileNumber: string | null;
  DBScertificate: [
    {
      documentUrl: string | null;
      isApproved: boolean;
      isRejected?: boolean;
      _id: string | null;
    }
  ];
  documentType: number | null;
  specifyOther: string | null;
  isProfileCompleted: boolean;
  isIdInfoCompleted: boolean;
  isInsuranceCompleted: boolean;
  _id: string;
  userId: string;
  dob: string | null;
  address: string;
  houseNo: string;
  postCode: string;
  country: string;
  profile: string | null;
  experience: string | null;
  interestsHobbit: string | null;
  householdDuties: string | null;
  personalDuties: string | null;
  conditionExperience: string | null;
  language: string | null;
  medicalSpecialties: [
    {
      name: string;
      value: number;
    }
  ];
  careType: [
    {
      walkingRate: number | null;
      type: number | null;
      urgentCare: boolean | null;
      hourlyCare: boolean | null;
      overnightCare: boolean | null;
      liveInCare: boolean | null;
      ratePerHour: number | null;
      ratePerWeek: number | null;
      _id: string | null;
    }
  ];
  rating: string | number | null;
  urgentCare: boolean;
  hourlyCare: boolean;
  overnightCare: boolean;
  liveInCare: boolean;
  ratePerHours: number | null;
  ratePerWeek: number | null;
  negotiable: boolean;
  personalStatement: string | null;
  car: boolean;
  drivingLicence: boolean;
  dogs: boolean;
  cats: boolean;
  timeSlots: TimeSlot[];
  calender: string | null;
  nationality: {
    name: string | null;
    value: number | null;
  };
  nationInsuranceNo: string | null;
  DBSorPVG: boolean;
  DBSorPVGDocument: {
    name: string;
    value: number | null;
  };
  DBSfor?: {
    name: string;
    value: number | null;
  };
  vatNumber?: string | number | null;
  registerBusinessAddress?: string | null;
  DBS_issueDate: string | null;
  DBSNo: string | null;
  pinNumber: string | null;
  dateOfRegistration: string | null;
  regulatoryBody: string | null;
  expiryDate: string | null;
  refrence1Firstname: string | null;
  refrence1Lastname: string | null;
  refrence1Email: string | null;
  refrence1Contactno: string | null;
  refrence1Relation: string | null;
  refrence1RelationTime: string | null;
  refrence2Firstname: string | null;
  refrence2Lastname: string | null;
  refrence2Email: string | null;
  refrence2Contactno: string | null;
  refrence2Relation: string | null;
  refrence2RelationTime: string | null;
  additionalDocument: [
    {
      documentUrl: string | null;
      isApproved?: boolean;
      isRejected?: boolean;
      _id: string | null;
    }
  ];
  identificationDocument: string | null;
  identificationFrontCard: string | null;
  identificationBack: string | null;
  photo: string | null;
  trainingHoists: boolean;
  physiotherapy: boolean;
  PEG: boolean;
  stoma: boolean;
  workingStatus: string | null;
  workInUK: boolean;
  selfEmployed: boolean;
  smoker: boolean;
  workHome: boolean;
  personalAssistant: boolean;
  taxReferenceNo: boolean;
  taxNo: string | null;
  insuranceDocument: [
    {
      documentUrl: string | null;
      isApproved: boolean;
      _id: string | null;
    }
  ];
  dateApproved: string | null;
  approvedBy: string | null;
  status: number | null;
  verificationStatus: string;
  responseRate: number;
  completedJobs: number;
  // activeJobs: number;
  activeJobs: {
    activeCount: number;
    percentage: number;
  };
  page: number;
  isActive: boolean;
  legalSigned: string | null;
  amount: number | null;
  paymentStatus: number;
  qualifications: Qualification[];
  bankDetails: BankDetail[];
  serviceAgreement: ServiceAgreement[];
  visitLog: VisitLog[];
  __v: number;
  // careSchedule: CareSchedule[];
  reference: Reference[];
  fullName: string;
  email: string;
  updatedAt: string;
  isProfileImageApproved: boolean | null;
  isProfileImageRejected: boolean | null;
  isSpecializationApproved: boolean | null;
  isSpecializationRejected: boolean | null;
  onfidoIdVerificationDate: string | null;
  gender: number[];
  assessment: {
    _id: string | null;
    isApproved: boolean | null;
    createdAt: string | null;
    updatedAt: string | null;
    feedBackMessage?: string | null;
  };
  lastLogin?: string | null;
  ZorbeePayVerificationDate?: string | null;
  isZorbeePayVerified?: boolean | null;
  isIdCompleted?: boolean | null;
  passport: {
    _id: string | null;
    status: number;
    approvedAt: string | null;
    createdAt: string | null;
    rejectionReason: string | null;
    userId: string | null;
  };
};

export interface TimeSlot {
  day: string;
  slots: {
    startTime: string;
    endTime: string;
  }[];
}

export interface Qualification {
  qualificationTitle: string;
  institutionName: string;
  fieldOfStudy?: string;
  certificateFile?: string;
  certificateUrl?: string;
  year: string;
  type?: number;
  dateObtained?: string;
  expiryDate?: string;
  notes?: string;
  status?: number;
  isDeleted?: boolean;
  isApproved?: boolean;
  isRejected?: boolean;
  _id: string;
  certificate: Certificate[];
}

interface Certificate {
  expiryDate: string;
  certificateFile: string;
  _id: string;
}

export interface BankDetail {
  accountName: string;
  accountNumber: string;
  sortCode: string;
  bankName: string;
  _id?: string;
}

export interface ServiceAgreement {
  name: string;
  signature: string;
  date: string;
  _id?: string;
}

export interface VisitLog {
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  notes: string;
  _id?: string;
}

export interface Reference {
  contactNo: string;
  email: string;
  firstName: string;
  lastName: string;
  referenceRelation: string;
  referenceRelationDuration: string;
  isApproved?: boolean;
  _id?: string;
}
