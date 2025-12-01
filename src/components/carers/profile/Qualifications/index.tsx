import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
//relative path imports
import CommonCard from "@/components/Cards/Common";
import CommonIconText from "@/components/CommonIconText";
import ApproveButton from "../ApproveButton";
import { Qualification } from "@/types/carerProfileType";
import { useTheme } from "@mui/material/styles";
import CertificateModal from "../CertificatesModal";

interface PersonalBioProps {
  isShowButtons?: boolean | null;
  qualifications?: Qualification[];
  onApprovalClick?: (index: number) => void;
  onRejectClick?: (index: number) => void;
}

const Qualifications: React.FC<PersonalBioProps> = ({
  qualifications = [],
  onApprovalClick,
  onRejectClick,
  isShowButtons,
}) => {
  const theme = useTheme();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedCertificates, setSelectedCertificates] = useState<
    {
      expiryDate: string;
      certificateFile: string;
      _id: string;
    }[]
  >([]);
  return (
    <CommonCard>
      <Typography variant="h6" fontWeight={500}>
        Qualifications
      </Typography>

      <Box mt={2}>
        {qualifications.map((ele, index) => {
          const isEleApproved = ele.isApproved;
          return (
            <Box key={index}>
              <CommonIconText
                icon={"/assets/svg/carers/profile/single_neutral.svg"}
                title={ele.qualificationTitle ? ele.qualificationTitle : "N/A"}
                endIcon={true}
                onClick={() => {
                  setIsModalOpen(true);
                  setSelectedCertificates(ele.certificate || []);
                }}
              />
              {isShowButtons && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: 1,
                    mb: 2,
                    gap: 2,
                  }}
                >
                  {isEleApproved === false || isEleApproved === null ? (
                    <ApproveButton
                      onClick={() => onApprovalClick && onApprovalClick(index)}
                    />
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
                  {isEleApproved === true || isEleApproved === null ? (
                    <ApproveButton
                      title="Decline"
                      onClick={() => onRejectClick && onRejectClick(index)}
                    />
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
            </Box>
          );
        })}
      </Box>
      <CertificateModal
        isOpen={isModalOpen}
        certificates={selectedCertificates}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCertificates([]);
        }}
      />
    </CommonCard>
  );
};

export default Qualifications;
