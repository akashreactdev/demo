export enum AccountTypeEnum {
  "Zorbee Carer" = 3,
  "Clinical" = 4,
  "Provider" = 5,
}

export enum UserStatus {
  "Pending" = 1,
  "Review" = 2,
  "Approved" = 3,
  "AwaitingVerification" = 4,
  "UnderReview" = 5,
  "Declined" = 6,
  "AwaitingApproval" = 7,
  "Suspended" = 8,
}

type PathMapKey = `${AccountTypeEnum}-${UserStatus}`;

const redirectPathMap: Partial<Record<PathMapKey, string>> = {
  "3-1": "carers/verifications",
  "3-5": "carers/verifications",
  "3-3": "carers/overview",
  "4-1": "clinical/verifications",
  "4-5": "clinical/verifications",
  "4-3": "clinical/overview",
  "5-1": "providers/verifications",
  "5-5": "providers/verifications",
  "5-3": "providers/overview",
};

export const getUserRedirectPath = (
  userType: AccountTypeEnum,
  status: UserStatus
): string | null => {
  const key = `${userType}-${status}` as PathMapKey;
  return redirectPathMap[key] || null;
};

export enum UserMeetingStatus {
  Pending = 1,
  Accepted = 2,
  Declined = 3,
}
