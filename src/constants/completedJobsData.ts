type SignOfStatus = "pending" | "Signed-off" | "Declined";
type PaymentStatus = "pending" | "Paid" | "Disputed";

interface CompletedJobData {
    id?: number;
    name?: string;
    serviceStartDate?: string;
    serviceEndDate?: string;
    careType?: string;
    visitLogs?: number;
    careNotes?: number;
    signOfStatus?: SignOfStatus;
    paymentStatus?: PaymentStatus;
  }
  
  export const completedJobData: CompletedJobData[] = [
      {
          id: 1,
          name: "Trent Graham",
          serviceStartDate: "05.02.2025",
          serviceEndDate: "05.02.2025",
          careType: "Hourly",
          visitLogs: 5,
          careNotes: 5,
          signOfStatus: "Signed-off",
          paymentStatus:"pending",
        },
      {
          id: 2,
          name: "Trent Graham",
          serviceStartDate: "05.02.2025",
          serviceEndDate: "05.02.2025",
          careType: "Hourly",
          visitLogs: 5,
          careNotes: 5,
          signOfStatus: "Signed-off",
          paymentStatus:"Disputed",
        },
      {
          id: 3,
          name: "Trent Graham",
          serviceStartDate: "05.02.2025",
          serviceEndDate: "05.02.2025",
          careType: "Hourly",
          visitLogs: 5,
          careNotes: 5,
          signOfStatus: "pending",
          paymentStatus:"Paid",
        },
      {
          id: 4,
          name: "Trent Graham",
          serviceStartDate: "05.02.2025",
          serviceEndDate: "05.02.2025",
          careType: "Hourly",
          visitLogs: 5,
          careNotes: 5,
          signOfStatus: "Declined",
          paymentStatus:"Disputed",
        },
      {
          id: 5,
          name: "Trent Graham",
          serviceStartDate: "05.02.2025",
          serviceEndDate: "05.02.2025",
          careType: "Hourly",
          visitLogs: 5,
          careNotes: 5,
          signOfStatus: "Signed-off",
          paymentStatus:"Paid",
        },
      {
          id: 6,
          name: "Trent Graham",
          serviceStartDate: "05.02.2025",
          serviceEndDate: "05.02.2025",
          careType: "Hourly",
          visitLogs: 5,
          careNotes: 5,
          signOfStatus: "Declined",
          paymentStatus:"pending",
        },
      {
          id: 7,
          name: "Trent Graham",
          serviceStartDate: "05.02.2025",
          serviceEndDate: "05.02.2025",
          careType: "Hourly",
          visitLogs: 5,
          careNotes: 5,
          signOfStatus: "Signed-off",
          paymentStatus:"Paid",
        },
      {
          id: 8,
          name: "Trent Graham",
          serviceStartDate: "05.02.2025",
          serviceEndDate: "05.02.2025",
          careType: "Hourly",
          visitLogs: 5,
          careNotes: 5,
          signOfStatus: "Declined",
          paymentStatus:"Paid",
        },
      {
          id: 9,
          name: "Trent Graham",
          serviceStartDate: "05.02.2025",
          serviceEndDate: "05.02.2025",
          careType: "Hourly",
          visitLogs: 5,
          careNotes: 5,
          signOfStatus: "Declined",
          paymentStatus:"pending",
        },
      {
          id: 10,
          name: "Trent Graham",
          serviceStartDate: "05.02.2025",
          serviceEndDate: "05.02.2025",
          careType: "Hourly",
          visitLogs: 5,
          careNotes: 5,
          signOfStatus: "Declined",
          paymentStatus:"Disputed",
        },
  
  ];