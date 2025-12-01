import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CommonCard from "@/components/Cards/Common";
import CommonChip from "@/components/CommonChip";
import ApproveButton from "../ApproveButton";
import { useMediaQuery, useTheme } from "@mui/material";

interface SpecialisationsProps {
  isApproveButton?: boolean | null;
  title?: string;
  specialisations?: [{ name: string; value: number }];
  onApprovalClick?: () => void;
  isRejectButton?: boolean | null;
  onRejectClick?: () => void;
  showButtons?: boolean | null;
}

const Specialisations: React.FC<SpecialisationsProps> = ({
  isApproveButton,
  title,
  specialisations,
  onApprovalClick,
  isRejectButton,
  onRejectClick,
  showButtons,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <CommonCard>
      <Typography variant="h6" fontWeight={500}>
        {title}
      </Typography>
      <Box
        mt={isMobile ? 2 : 3}
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {specialisations?.map((specialisation) => (
          <CommonChip
            key={specialisation.name}
            title={specialisation.name}
            variant="primary"
            style={{
              backgroundColor: theme?.palette?.common?.white,
              border: `1px solid ${theme.ShadowAndBorder.border2}`,
            }}
            textStyle={{ fontWeight: 500 }}
          />
        ))}
      </Box>

      {specialisations && showButtons && (
        <Box mt={isMobile ? 2 : 4} sx={{ display: "flex", gap: 2 }}>
          {!isApproveButton ? (
            <ApproveButton onClick={onApprovalClick} />
          ) : (
            <ApproveButton
              title="Approved"
              sx={{
                cursor: "default",
                backgroundColor: theme.accepted.background.primary,
              }}
              buttonTextStyleSx={{ color: theme.accepted.main }}
            />
          )}
          {!isRejectButton ? (
            <ApproveButton onClick={onRejectClick} title="Decline" />
          ) : (
            <ApproveButton
              title="Declined"
              sx={{
                cursor: "default",
                backgroundColor: theme.declined.background.primary,
              }}
              buttonTextStyleSx={{ color: theme.declined.main }}
            />
          )}
        </Box>
      )}
    </CommonCard>
  );
};

export default Specialisations;
