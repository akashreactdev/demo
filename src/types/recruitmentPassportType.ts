export interface ViewPassportResponse {
  data: {
    success: boolean;
    message: string;
    data: PassportDetails;
  };
}

export interface ApprovalProfileResponse {
  data: {
    success: boolean;
    message: string;
  };
}

export interface PassportDetails {
  _id: string;
  userId: string;
  dob: string;
  address: string;
  houseNo: string;
  postCode: string;
  country: string;
  latitude: number;
  longitude: number;
  location: {
    type: string;
    coordinates: number[];
  };
  profile: string;
  experience: number;
  interestsHobbit: number[];
  householdDuties: number[];
  personalDuties: number[];
  language: number[];
  conditionExperience: string[];
  isNegotiable: boolean;
  rateNegotiable: string;
  personalStatement: string;
  car: boolean;
  drivingLicense: boolean;
  dogs: boolean;
  cats: boolean;
  clinicalDuties: string[] | null;
  overnightCareDays: number[];
  liveInCareDays: number[];
  calender: string | null;
  nationality: number;
  countryOfResidence: string;
  DBSorPVG: boolean;
  DBSorPVGDocument: number;
  DBSfor: number;
  DBS_issueDate: string;
  DBSNo: string;
  documentType: number | null;
  identificationFrontCard: string;
  identificationBack: string;
  photo: string;
  dateApproved: string;
  approvedBy: string;
  responseRate: number;
  completedJobs: number;
  activeJobs: number;
  rating: number;
  trainingHoists: boolean;
  physiotherapy: boolean;
  PEG: boolean;
  stoma: boolean;
  workingStatus: number;
  workInUK: boolean;
  selfEmployed: boolean;
  smoker: boolean;
  workHome: boolean;
  personalAssistant: boolean;
  taxReferenceNo: boolean;
  taxNo: string;
  accountName: string;
  accountNumber: string;
  sortCode: string;
  page: number;
  isProfileCompleted: boolean;
  isIdCompleted: boolean;
  isPaymentAccountCompleted: boolean;
  syncZorbeeCalendar: boolean;
  review: string | null;
  isOnBoardProfile: boolean;
  isOnBoardAddress: boolean;
  isOnfidoIdVerified: boolean;
  onfidoIdVerificationDate: string | null;
  isProfileImageApproved: boolean;
  isSpecializationApproved: boolean | null;
  isCarerCompletedProfile: boolean;
  legalSignApproved: boolean | null;
  interviewCompleted: boolean | null;
  isAssessmentApproved: boolean;
  assessmentCount: number;
  aboutMe: string | null;
  nationInsuranceNo: string;

  // nested objects
  passportInfo: PassportInfo;
  emergencyContacts: EmergencyContact[];
  references: Reference[];
  userInfo: UserInfo;
  careType: CareType[];
  qualifications: Qualification[];
  urgentCareSchedule: ScheduleEntry[];
  hourlyCareSchedule: ScheduleEntry[];
  overNightCareSchedule: ScheduleEntry[];
  liveInCareSchedule: ScheduleEntry[];
  reference: ReferenceOld[];
  DBScertificate: Document[];
  additionalDocument: Document[];
  insuranceDocument: Document[];
  insurances: Document[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  isIdBackApproved: boolean | null;
  isIdFrontApproved: boolean | null;
}

interface TimeSlot {
  name: string;
  value: number;
}

interface CareDay {
  name: string;
  value: number;
}

interface ScheduleEntry {
  careDays: CareDay;
  timeSlots: TimeSlot[];
  _id: string;
}

export interface PassportInfo {
  _id: string;
  userId: string;
  passportId: string;
  isDetailsCompleted: boolean;
  isDocsCompleted: boolean;
  isContactsCompleted: boolean;
  isReferencesCompleted: boolean;
  status: number;
  approvedAt: string;
  rejectionReason: string | null;
  linkUrl: string | null;
  downloadPDFCount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  approvedBy: string;
}

export interface EmergencyContact {
  _id: string;
  userId: string;
  contactName: string;
  contactNumber: string;
  countryCode: string;
  countryShortCode: string;
  email: string;
  isTrustedContact: boolean;
  isEmergencyContact: boolean;
  isRequestAccepted: boolean;
  isMobileVerified: boolean;
  relationship: number;
  contactPriority: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Reference {
  _id: string;
  userId: string;
  fullName: string;
  jobTitle: string;
  company: string;
  contactNumber: string;
  countryCode: string;
  countryShortCode: string;
  email: string;
  isRequestAccepted: boolean;
  referenceRelationDuration: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// aa che purana references je array ma ave che (firstName, lastName walu)
export interface ReferenceOld {
  firstName: string;
  lastName: string;
  email: string;
  contactNo: string;
  referenceRelation: string;
  referenceRelationDuration: string;
  isApproved: boolean;
  _id: string;
}

export interface UserInfo {
  firstName: string;
  lastName: string;
  gender: number[];
  email: string;
  role: number;
  profile: string;
  countryCode: string;
  mobileNumber: string;
}

export interface CareType {
  type: number;
  urgentCare: boolean | null;
  hourlyCare: boolean | null;
  overnightCare: boolean | null;
  liveInCare: boolean | null;
  ratePerHour: string | null;
  ratePerWeek: string | null;
  walkingRate: string | null;
  _id: string;
}

export interface Qualification {
  type: number;
  qualificationTitle: string;
  institutionName: string;
  fieldOfStudy: string;
  dateObtained: string;
  expiryDate: string;
  certificateFile: string;
  notes: string;
  isApproved: boolean;
  status: number;
  isDeleted: boolean;
  _id: string;
}

export interface CareSchedule {
  careDays: number;
  timeSlots: number[];
  _id: string;
}

export interface Document {
  documentUrl: string;
  isApproved: boolean;
  expiryDate?: string | null;
  _id: string;
}

export interface RecentPassportData {
  _id: string;
  isBlocked: boolean;
  email: string;
  viewedAt: string; // ISO date string
  viewCount: number;
}

export interface RecentPassportMeta {
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export interface RecentPassportResponse {
  data: {
    success: boolean;
    message: string;
    data: RecentPassportData[];
    meta: RecentPassportMeta;
  };
}

export interface PassportUserData {
  isBlocked: boolean;
  viewCount: number;
  viewedAt: string[]; // array of ISO date strings
  lastViewedAt: string; // ISO date string
  email: string;
}

export interface PassportUserDataMeta {
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export interface PassportUserDataResponse {
  data: {
    success: boolean;
    message: string;
    data: PassportUserData[];
    meta: PassportUserDataMeta;
  };
}
