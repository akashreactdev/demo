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
  _id: string;
  certificate: Certificate[];
}

export interface Certificate {
  expiryDate: string;
  certificateFile: string;
  _id: string;
}

export interface ServiceAgreement {
  documentName: string;
  signedDate: string;
  documentUrl: string;
}

export interface VisitLog {
  visitDate: string;
  duration: number;
  notes?: string;
}

export interface Reference {
  firstName: string;
  lastName: string;
  email: string;
  contactNo: string;
  relation: string;
  relationTime: string;
  referenceRelation: string;
  referenceRelationDuration: string;
  _id: string;
  isApproved?: boolean | null;
  isRejected: boolean;
}

export interface TimeSlot {
  day: string;
  slots: {
    startTime: string;
    endTime: string;
  }[];
}

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

export interface BankDetail {
  accountName: string;
  accountNumber: string;
  sortCode: string;
  bankName: string;
  _id?: string;
}
export interface ClinicalProfile {
  sortCode: string;
  accountNumber: string;
  accountName: string;
  vatNumber?: string | number | null;
  registerBusinessAddress?: string | null;
  isIdFrontApproved: boolean | null;
  isIdBackApproved: boolean | null;
  isAccountDetailsApproved: boolean | null;
  isPaidAlert: boolean | null;
  bankDetails: BankDetail[];
  createdAt: string;
  isOnfidoIdVerified: boolean;
  rateNegotiable: boolean;
  drivingLicense: boolean;
  clinicalTittle: string | null;
  countryOfResidence: string | null;
  DBScertificate: [
    {
      documentUrl: string | null;
      isApproved?: boolean | null;
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
  clinicalDuties: [
    {
      name: string;
      value: number;
    }
  ];
  language: [
    {
      name: string;
      value: number;
    }
  ];
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
  DBSorPVG: boolean;
  DBSorPVGDocument: {
    name: string;
    value: number | null;
  };
  DBSfor: {
    name: string;
    value: number | null;
  };
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
      isApproved?: boolean | null;
      isRejected: boolean;
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
      isApproved?: boolean | null;
      isRejected: boolean;
      _id: string | null;
    }
  ];
  dateApproved: string | null;
  approvedBy: string | null;
  status: number | null;
  verificationStatus: string;
  responseRate: number;
  completedJobs: number;
  activeJobs: {
    activeCount: number | null;
    percentage: number | null;
  };
  page: number;
  isActive: boolean;
  legalSigned: string | null;
  amount: number | null;
  paymentStatus: number;
  qualifications: Qualification[];
  serviceAgreement: ServiceAgreement[];
  visitLog: VisitLog[];
  // careSchedule: CareSchedule[];
  reference: Reference[];
  __v: number;
  fullName: string;
  email: string;
  isSpecializationApproved?: boolean | null;
  isProfileImageApproved?: boolean | null;
  isPinNumberApproved?: boolean | null;
  gender: number[];
  rating: string | number | null;
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
  mobileNumber: string | null;
  conditionExperienceGrouped: ConditionResponse;
  householdDuties: string | null;
  personalDuties: string | null;
  urgentCareSchedule: CareSchedule[];
  hourlyCareSchedule: CareSchedule[];
  nationInsuranceNo: string | null;
  isIdImageApproved: boolean | null;
  isIdCompleted: boolean | null;
}

export interface ClinicalProfileResponse {
  data: {
    success: boolean;
    data: ClinicalProfile;
  };
}
