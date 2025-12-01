import React from "react";
import moment from "moment";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CommonCard from "@/components/Cards/Common";
import CommonChip from "@/components/CommonChip";
import { useTheme } from "@mui/material/styles";
import { Divider } from "@mui/material";
import { ConditionResponse } from "@/types/carerProfileType";

interface AccordionItem {
  title: string;
  type: "text" | "chip";
  content: string | string[];
}

interface ProfileInformationProps {
  accordionData: AccordionItem[];
  heading: string;
  conditionalExperience?: boolean | null;
  DBSorPVG?: boolean | null;
  DBSorPVGDocument?: {
    name: string;
    value: number | null;
  };
  DBSfor?: {
    name: string;
    value: number | null;
  };
  DBSIssueDate?: string | null;
  DBSNo?: string | null;
  conditionExperienceGrouped?: ConditionResponse;
}

const ProfileInformation: React.FC<ProfileInformationProps> = ({
  accordionData,
  heading,
  conditionalExperience = false,
  DBSorPVG = false,
  DBSorPVGDocument,
  DBSfor,
  DBSIssueDate,
  DBSNo,
  conditionExperienceGrouped,
}) => {
  const theme = useTheme();

  const renderItemContent = (item: AccordionItem) => (
    <Box sx={{ pb: 1 }}>
      {item.type === "text" ? (
        <Box>
          <Typography variant="body1" fontWeight={500}>
            {item.title}
          </Typography>
          <Divider sx={{ marginBlock: 1 }} />
          {item.title === "Experience" && (
            <Typography variant="caption" mt={2} fontWeight={400}>
              years of experience
            </Typography>
          )}
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
            <Typography>{item.content}</Typography>
          </Box>
        </Box>
      ) : (
        <Box>
          <Typography variant="body1" fontWeight={500}>
            {item.title}
          </Typography>
          <Divider sx={{ marginBlock: 1 }} />
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              mt: 3,
            }}
          >
            {(item.content as string[]).map((ele) => (
              <CommonChip
                key={ele}
                title={ele}
                textStyle={{ fontSize: "15px" }}
                variant="primary"
                style={{
                  backgroundColor: theme?.palette?.common?.white,
                  border: `1px solid ${theme.ShadowAndBorder.border2}`,
                }}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );

  return (
    <CommonCard>
      <Typography variant="h6" fontWeight={500} mb={2}>
        {heading}
      </Typography>
      <Box mt={3}>
        {accordionData.map((item, index) => (
          <Box key={item.title} mt={index > 0 ? 2 : 0}>
            {renderItemContent(item)}
          </Box>
        ))}
      </Box>
      {conditionExperienceGrouped && (
        <Box mt={3}>
          <Typography variant="body1" fontWeight={500}>
            Conditional Experience
          </Typography>
          <Divider sx={{ marginBlock: 1 }} />
          {Object.entries(conditionExperienceGrouped).map(
            ([category, subconditions]) => (
              <Box key={category} marginBlock={2}>
                <Typography variant="body1" fontSize={"15px"} fontWeight={500}>
                  {category}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 1 }}>
                  {subconditions.map((s) => (
                    <CommonChip
                      key={s.subcondition}
                      title={s.subcondition}
                      textStyle={{ fontSize: "15px" }}
                      variant="primary"
                      style={{
                        backgroundColor: "#fff",
                        border: "1px solid #ccc",
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )
          )}
        </Box>
      )}
      {conditionalExperience && (
        <Box mt={3}>
          <Typography variant="body1" fontWeight={500}>
            Conditional Experience
          </Typography>
          <Divider sx={{ marginBlock: 1 }} />
          <Typography mt={3} mb={2}>
            Do you have DBS/PVG/Acess NI certificate?
          </Typography>
          <CommonChip
            title={DBSorPVG ? "Yes" : "No"}
            textStyle={{ fontSize: "15px" }}
            variant="primary"
            style={{
              backgroundColor: theme?.palette?.common?.white,
              border: `1px solid ${theme.ShadowAndBorder.border2}`,
            }}
          />
          <Typography mt={3} mb={2}>
            Type of DBS/PVG/Acess NI certificate
          </Typography>
          <CommonChip
            title={DBSorPVGDocument?.name || "N/A"}
            textStyle={{ fontSize: "15px" }}
            variant="primary"
            style={{
              backgroundColor: theme?.palette?.common?.white,
              border: `1px solid ${theme.ShadowAndBorder.border2}`,
            }}
          />
          <Typography mt={3} mb={2}>
            Select DBS for
          </Typography>
          <CommonChip
            title={DBSfor?.name || "N/A"}
            textStyle={{ fontSize: "15px" }}
            variant="primary"
            style={{
              backgroundColor: theme?.palette?.common?.white,
              border: `1px solid ${theme.ShadowAndBorder.border2}`,
            }}
          />
        </Box>
      )}
      {DBSIssueDate && (
        <Box mt={3}>
          <Typography variant="body1" fontWeight={500}>
            Issue date
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
            <Typography>
              {moment(DBSIssueDate, "DD-MM-YYYY").format("Do MMMM YYYY") ||
                "N/A"}
            </Typography>
          </Box>
        </Box>
      )}
      {DBSNo && (
        <Box mt={3}>
          <Typography variant="body1" fontWeight={500}>
            DBS/PVG/Acess NI certificate number
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
            <Typography>{DBSNo}</Typography>
          </Box>
        </Box>
      )}
    </CommonCard>
  );
};

export default ProfileInformation;
