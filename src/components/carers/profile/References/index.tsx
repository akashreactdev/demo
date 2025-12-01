import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
//relative path imports
import KeyValueDetails from "@/components/Cards/KeyValueDetails";
import CommonCard from "@/components/Cards/Common";
import ApproveButton from "../ApproveButton";

interface ProfileReferencesProps {
  isApproveButton?: boolean;
}

interface ReferenceItem {
  label: string;
  value: string | number | null | React.ReactNode;
}

interface ProfileReferencesProps {
  isApproveButton?: boolean;
  reference1?: ReferenceItem[];
  reference2?: ReferenceItem[];
}

const ProfileReferences: React.FC<ProfileReferencesProps> = ({
  isApproveButton,
  reference1,
  reference2,
}) => {
  return (
    <CommonCard>
      <Typography fontWeight={500} variant="h6">
        References
      </Typography>
      <Typography variant="caption" fontWeight={400}>
        These are the carer profiles pending verification. You can check the
        verification status, as another admin may have already initiated the
        process.
      </Typography>
      <Box mt={3}>
        <Typography fontWeight={500} variant="h6">
          References 1
        </Typography>
        <Box mt={1}>
          <KeyValueDetails items={reference1} />
        </Box>

        {isApproveButton && (
          <Box mt={1}>
            <ApproveButton />
          </Box>
        )}
      </Box>
      <Box mt={3}>
        <Typography fontWeight={500} variant="h6">
          References 2
        </Typography>
        <Box mt={1}>
          <KeyValueDetails items={reference2} />
        </Box>
        {isApproveButton && (
          <Box mt={1}>
            <ApproveButton />
          </Box>
        )}
      </Box>
    </CommonCard>
  );
};

export default ProfileReferences;
