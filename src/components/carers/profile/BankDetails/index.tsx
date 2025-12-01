import React from "react";
import Image from "next/image";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
//relative path imports
import CommonCard from "@/components/Cards/Common";
import KeyValueDetails from "@/components/Cards/KeyValueDetails";
import { Divider } from "@mui/material";
import CommonChip from "@/components/CommonChip";
import ApproveButton from "../ApproveButton";

interface BankDetailsData {
  label: string;
  value: string;
  accountName?: string;
  accountNumber?: string;
  sortCode?: string;
  bankName?: string;
}
interface BankDetailsProps {
  descriptions?: string;
  bank_details?: BankDetailsData[];
  vatNumber?: string | number | null;
  registerBusinessAddress?: string | null;
  onApprovalClick?: (value: number) => void;
  isShowButton?: boolean | null;
  onRejectClick?: (value: number) => void;
  isApproved?: boolean | null;
  isPaidAlert?: boolean | null;
}

const BankDetails: React.FC<BankDetailsProps> = ({
  descriptions,
  bank_details,
  vatNumber,
  registerBusinessAddress,
  onApprovalClick,
  onRejectClick,
  isShowButton,
  isApproved,
  isPaidAlert,
}) => {
  const theme = useTheme();
  return (
    <CommonCard>
      <Typography variant="h6" fontWeight={500}>
        Account details
      </Typography>
      {descriptions && (
        <Stack direction={"row"} alignItems={"center"} spacing={1}>
          <Image
            src={"/assets/svg/carers/profile/lock.svg"}
            alt="lock"
            height={18}
            width={18}
          />
          <Typography variant="caption" fontWeight={400}>
            {descriptions}
          </Typography>
        </Stack>
      )}

      <Box mt={4}>
        <KeyValueDetails heading="Account Details" items={bank_details} />
      </Box>

      {vatNumber && (
      <Box mt={3}>
        <Typography variant="body1" fontWeight={500}>
          VAT Identification Number
        </Typography>
        <Divider sx={{ marginBlock: 1 }} />
        <Box
          sx={{
            border: `1px solid ${theme.pending.secondary}`,
            paddingInline: "20px",
            height: "50px",
            width: "100%",
            mt: 2,
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography>{vatNumber || "N/A"}</Typography>
        </Box>
      </Box>
       )} 
       {registerBusinessAddress && ( 
      <Box mt={3}>
        <Typography variant="body1" fontWeight={500}>
          Registered Business Address
        </Typography>
        <Divider sx={{ marginBlock: 1 }} />
        <Box
          sx={{
            border: `1px solid ${theme.pending.secondary}`,
            paddingInline: "20px",
            height: "50px",
            width: "100%",
            mt: 2,
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography>{registerBusinessAddress || "N/A"}</Typography>
        </Box>
      </Box>
       )} 
       {isPaidAlert && ( 
      <Box mt={3}>
        <Typography variant="body1" fontWeight={500} mb={1}>
          Get an alert when you get paid more than $86,000 in a given period?
        </Typography>
        <Divider sx={{mb : 2}}/>
        <CommonChip
          title={
            isPaidAlert === true ? "Yes" : isPaidAlert === false ? "No" : "N/A"
          }
          textStyle={{ fontSize: "15px" }}
          variant="primary"
          style={{
            backgroundColor: theme?.palette?.common?.white,
            border: `1px solid ${theme.ShadowAndBorder.border2}`,
          }}
        />
      </Box>
       )}

      {isShowButton && (
        <Box
          sx={{ display: "flex", justifyContent: "flex-start", mt: 2, gap: 2 }}
        >
          {isApproved === false || isApproved === null ? (
            <ApproveButton
              sx={{ backgroundColor: "#F9D835", border: "none" }}
              onClick={() => onApprovalClick && onApprovalClick(0)}
            />
          ) : (
            <ApproveButton
              title="Approved"
              sx={{
                cursor: "default",
                backgroundColor: theme.accepted.background.primary,
                borderColor: theme.accepted.main,
              }}
              buttonTextStyleSx={{ color: theme.accepted.main }}
            />
          )}
          {isApproved === true || isApproved === null ? (
            <ApproveButton
              title="Decline"
              onClick={() => onRejectClick && onRejectClick(0)}
            />
          ) : (
            <ApproveButton
              title="Declined"
              sx={{
                cursor: "default",
                backgroundColor: theme.declined.background.primary,
                borderColor: theme.declined.main,
              }}
              buttonTextStyleSx={{ color: theme.declined.main }}
            />
          )}
        </Box>
      )}
    </CommonCard>
  );
};

export default BankDetails;
