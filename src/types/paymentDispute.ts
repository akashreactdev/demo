export interface Client {
  _id: string;
  firstName: string;
  lastName: string;
  profile?: string | null;
}

export interface Invoice {
  _id: string;
  totalAmount: number;
}

export interface PassportItem {
  _id: string;
  userId: Client;
  clientId: string;
  agreementId: string;
  invoiceId: Invoice;
  status: number; // you can replace with an enum if you know meanings (e.g. 1 = open, 2 = resolved)
  reason?: string | null;
  isResolveRequest?: unknown | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}

export interface Meta {
  totalResolved: number;
  totalResolvedAmount: number;
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export interface PassportListResponse {
  data: {
    success: true;
    message: string;
    data: PassportItem[];
    meta: Meta;
  };
}

export interface singleDisputeData {
  dispute: Dispute;
  notes: Note[];
  visitLogs: VisitLog[];
}

export interface DisputeResponse {
  data: {
    success: boolean;
    message: string;
    data: singleDisputeData;
  };
}

export interface Dispute {
  _id: string;
  userId: string;
  clientId: ClientDetail;
  agreementId: Agreement;
  invoiceId: InvoiceDetail;
  status: number; // e.g. 1=open, 2=resolved
  reason: string | null;
  isResolveRequest: unknown | null;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  __v: number;
}

export interface Request {
  _id: string | number | null;
  requestType: number;
  status: number;
  reason: string | null;
  rejectionReason: string | null;
  requestedDate: string | null;
  responseDate: string | null;
  proposedExtendDate: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface ClientDetail {
  _id: string;
  firstName: string;
  lastName: string;
  profile: string;
}

export interface Agreement {
  _id: string;
  clientDetail: {
    name: string;
    address: string;
    createdAt: string;
    updatedAt: string;
  };
  userSignatureDate: string;
  agreementId: string;
  requests: Request[]; // you can replace with proper type if known
}

export interface InvoiceDetail {
  isExtendedServiceInvoice: boolean;
  _id: string;
  userId: string;
  clientId: string;
  agreementId: string;
  clientDetail: {
    name: string;
    address: string;
    contactNo: string;
    createdAt: string;
    updatedAt: string;
  };
  invoiceId: string;
  additionalNote: string;
  amount: number;
  totalAmount: number;
  approvedAt: string | null;
  invoiceStatus: number;
  paymentStatus: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Note {
  _id: string;
  noteId: string;
  dateOfVisit: string; // YYYY-MM-DD
  carerName: string;
}

export interface VisitLog {
  _id: string;
  visitDate: string; // ISO date
  visitTime: string; // e.g. "10:03 AM"
  visitNumber: number;
}
