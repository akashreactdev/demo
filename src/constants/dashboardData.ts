export interface StaticData {
  icon: string;
  title: string;
  desc: string;
}

export interface PendingVerificationProps {
  icon: string;
  title: string;
  review_status?: string;
  total_pending?: number;
  // urgent_review?: number;
  process_rate?: number;
  total_verified?: number;
  total_failed?: number;
}

export interface StatusProps {
  title: string;
  count: string;
  days: string;
  icon: string;
}

export interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

export interface CardConfig {
  title: string;
  filter: string;
  chartTitle: string;
  chartSubtitle: string;
  data?: ChartDataItem[];
  genderData?: ChartDataItem[];
  ageData?: ChartDataItem[];
}

export const data: StaticData[] = [
  {
    icon: "verify",
    title: "To verify",
    desc: "102 Pending",
  },
  {
    icon: "support_tickets_new",
    title: "Support tickets",
    desc: "12 unresolved",
  },
  {
    icon: "review_application",
    title: "Recruitment passports",
    desc: "54 new",
  },
  {
    icon: "currency",
    title: "Payment disputes",
    desc: "12 unresolved",
  },
];

export const status: StatusProps[] = [
  {
    title: "Active clients",
    count: "1,450",
    days: "+12% vs last 30 days",
    icon: "active_users",
  },
  {
    title: "Active carers",
    count: "1,450",
    days: "+12% vs last 30 days",
    icon: "active_carers",
  },
  {
    title: "Active clinicians",
    count: "1,450",
    days: "+12% vs last 30 days",
    icon: "active_clinicals",
  },
  {
    title: "Active providers",
    count: "1,450",
    days: "+12% vs last 30 days",
    icon: "active_providers",
  },
  {
    title: "Inactive accounts",
    count: "1,450",
    days: "+12% vs last 30 days",
    icon: "inactive_accounts",
  },
  {
    title: "Total agreements",
    count: "1,450",
    days: "+12% vs last 30 days",
    icon: "agreements",
  },
  {
    title: "Total completed care",
    count: "504",
    days: "+23% vs last 30 days",
    icon: "currency",
  },
  {
    title: "Total partners",
    count: "06",
    days: "+23% vs last 30 days",
    icon: "total_partners",
  },
  {
    title: "Total resources",
    count: "65",
    days: "+23% vs last 30 days",
    icon: "inactive_accounts",
  },
  {
    title: "Total job listings",
    count: "06",
    days: "+23% vs last 30 days",
    icon: "agreements",
  },
];

export const pending_verifications: PendingVerificationProps[] = [
  {
    icon: "single",
    title: "User verifications",
    review_status: "Pending",
    total_pending: 23,
    // urgent_review: 5,
    process_rate: 65,
  },
  {
    icon: "paginate_text",
    title: "Payment disputes",
    review_status: "Pending",
    total_pending: 23,
    // urgent_review: 5,
    process_rate: 65,
  },
  {
    icon: "study_owl",
    title: "Recruitment Passport",
    review_status: "Pending",
    total_pending: 23,
    // urgent_review: 5,
    process_rate: 65,
  },
  {
    icon: "doc",
    title: "Job listing",
    review_status: "Pending",
    total_pending: 23,
    // urgent_review: 5,
    process_rate: 65,
  },
  {
    icon: "face_id",
    title: "Support ticket",
    review_status: "Pending",
    total_pending: 23,
    // urgent_review: 5,
    process_rate: 65,
  },
];

export const time_period_data: string[] = [
  "1 Month",
  "3 Months",
  "6 Months",
  "9 Months",
  "12 Months",
  "18 Months",
  "24 Months",
];

export const cardConfigs: CardConfig[] = [
  {
    title: "User demographic",
    filter: "Demographic",
    chartTitle: "Most popular",
    chartSubtitle: "26-32 years (35%)",
    ageData: [
      { name: "18-24 years", value: 60, color: "#FFD62E" },
      { name: "25-34 years", value: 20, color: "#4E95ED" },
      { name: "35-44 years", value: 10, color: "#10B981" },
      { name: "45+ years", value: 10, color: "#F87171" },
    ],
    genderData: [
      { name: "Males", value: 60, color: "#FFD62E" },
      { name: "Females", value: 20, color: "#4E95ED" },
      { name: "Others", value: 20, color: "#10B981" },
    ],
  },
  {
    title: "Carer demographic",
    filter: "Demographic",
    chartTitle: "Most popular",
    chartSubtitle: "26-32 years (35%)",
    ageData: [
      { name: "18-24 years", value: 60, color: "#FFD62E" },
      { name: "25-34 years", value: 20, color: "#4E95ED" },
      { name: "35-44 years", value: 10, color: "#10B981" },
      { name: "45+ years", value: 10, color: "#F87171" },
    ],
    genderData: [
      { name: "Males", value: 60, color: "#FFD62E" },
      { name: "Females", value: 20, color: "#4E95ED" },
      { name: "Others", value: 20, color: "#10B981" },
    ],
  },
  {
    title: "Clinician demographic",
    filter: "Demographic",
    chartTitle: "Most popular",
    chartSubtitle: "26-32 years (35%)",
    ageData: [
      { name: "18-24 years", value: 60, color: "#FFD62E" },
      { name: "25-34 years", value: 20, color: "#4E95ED" },
      { name: "35-44 years", value: 10, color: "#10B981" },
      { name: "45+ years", value: 10, color: "#F87171" },
    ],
    genderData: [
      { name: "Males", value: 60, color: "#FFD62E" },
      { name: "Females", value: 20, color: "#4E95ED" },
      { name: "Others", value: 20, color: "#10B981" },
    ],
  },
  {
    title: "Provider analytics",
    filter: "Demographic",
    chartTitle: "Most popular",
    chartSubtitle: "Care home (35%)",
    ageData: [
      { name: "18-24 years", value: 60, color: "#FFD62E" },
      { name: "25-34 years", value: 20, color: "#4E95ED" },
      { name: "35-44 years", value: 10, color: "#10B981" },
      { name: "45+ years", value: 10, color: "#F87171" },
    ],
    genderData: [
      { name: "Males", value: 60, color: "#FFD62E" },
      { name: "Females", value: 20, color: "#4E95ED" },
      { name: "Others", value: 20, color: "#10B981" },
    ],
  },
  {
    title: "Partners",
    filter: "",
    chartTitle: "Most popular",
    chartSubtitle: "Financial Offer",
    ageData: [
      { name: "Financial Offer", value: 60, color: "#FFD62E" },
      { name: "Full service", value: 20, color: "#4E95ED" },
      { name: "HR Managed", value: 20, color: "#10B981" },
    ],
  },
  // {
  //   title: "Brokerage analytics",
  //   filter: "Booking Status",
  //   chartTitle: "Most popular",
  //   chartSubtitle: "26-32 years (35%)",
  //   data: [
  //     { name: "Completed", value: 60, color: "#FFD62E" },
  //     { name: "In Progress", value: 20, color: "#4E95ED" },
  //     { name: "In-progress", value: 10, color: "#10B981" },
  //     { name: "Canceled", value: 10, color: "#F87171" },
  //   ],
  // },
  // {
  //   title: "Booking analytics",
  //   filter: "Booking Status",
  //   chartTitle: "Most popular",
  //   chartSubtitle: "26-32 years (35%)",
  //   data: [
  //     { name: "Completed", value: 60, color: "#FFD62E" },
  //     { name: "In Progress", value: 20, color: "#4E95ED" },
  //     { name: "In-progress", value: 10, color: "#10B981" },
  //     { name: "Canceled", value: 10, color: "#F87171" },
  //   ],
  // },
];

export const filterOptions: Record<string, { label: string; value: string }[]> =
  {
    Demographic: [
      { label: "Age", value: "age" },
      { label: "Gender", value: "gender" },
    ],
    Age: [
      { label: "18-24 years", value: "18-24" },
      { label: "25-34 years", value: "25-34" },
      { label: "35-44 years", value: "35-44" },
      { label: "45+ years", value: "45+" },
    ],
    Type: [
      { label: "Care home", value: "care_home" },
      { label: "Independent", value: "independent" },
    ],
    "Booking Status": [
      { label: "Completed", value: "completed" },
      { label: "In Progress", value: "in_progress" },
      { label: "Canceled", value: "canceled" },
    ],
  };
