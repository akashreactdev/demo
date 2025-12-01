import React from "react";
import Box from "@mui/material/Box";
//relative path imports
import CommonCard from "@/components/Cards/Common";
import CommonNoteCard from "@/components/CommonNoteCard";
import ApproveButton from "../ApproveButton";

interface PersonalBioProps {
  isApproveButton?: boolean;
  value?: string;
  title?: string | null;
  description?: string | null;
}

const PersonalBio: React.FC<PersonalBioProps> = ({
  isApproveButton,
  value,
  title,
  description,
}) => {
  return (
    <CommonCard>
      <CommonNoteCard
        title={title ? title : "Personal bio"}
        description={
          description
            ? description
            : "These are the carer profiles pending verification. You can check the verification status, as another admin may have already initiated the process."
        }
        rows={1}
        value={value}
      />
      {isApproveButton && (
        <Box mt={4}>
          <ApproveButton />
        </Box>
      )}
    </CommonCard>
  );
};

export default PersonalBio;
