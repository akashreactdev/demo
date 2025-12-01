"use client";
import React from "react";
import Image from "next/image";
import moment from "moment";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import CommonChip from "@/components/CommonChip";
import { JobItem } from "@/app/(main)/providers/job-postings/page";
import { BudgetType, JobFrequency } from "@/constants/providerData";

interface ProviderJobListingCardProps {
  data: JobItem;
  isShowChip: boolean;
}

const ProviderJobListingCard: React.FC<ProviderJobListingCardProps> = ({
  data,
  isShowChip = false,
}) => {
  const theme = useTheme();

  return (
    <Box>
      <Stack
        flexDirection={"column"}
        border={`1px solid ${theme.inProgress.main}`}
        borderRadius={"10px"}
      >
        <Box
          sx={{
            backgroundColor: theme.inProgress.background.primary,
            padding: "10px",
            borderRadius: "10px 10px 0px 0px",
            width: "100%",
            borderBottom: `1px solid ${theme.inProgress.main}`,
          }}
        >
          <Stack
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            paddingInline={"10px"}
          >
            <Typography variant="body1" fontWeight={500} fontSize={"20px"}>
              {data?.jobTitle || "N/A"}
            </Typography>
            {isShowChip && (
              <CommonChip
                title={data?.status === 1 ? "Active" : "In-active"}
                style={{
                  backgroundColor:
                    data?.status === 1
                      ? theme.accepted.background.primary
                      : theme.declined.background.primary,
                  borderColor:
                    data?.status === 1
                      ? theme.accepted.main
                      : theme.declined.main,
                }}
              />
            )}
          </Stack>
        </Box>
        <Box
          padding={"20px"}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          gap={2}
        >
          <Stack flexDirection={"row"} gap={2}>
            <Image
              src={"/assets/svg/provider/overview/map_icon.svg"}
              alt="profile-pic"
              height={24}
              width={24}
            />
            <Typography variant="body1" fontSize={"15px"}>
              0.0 miles away | {data?.county || "N/A"}
            </Typography>
          </Stack>
          <Stack flexDirection={"row"} gap={2}>
            <Image
              src={"/assets/svg/provider/overview/calender_icon.svg"}
              alt="profile-pic"
              height={24}
              width={24}
            />
            <Typography variant="body1" fontSize={"15px"}>
              Start date :{" "}
              {data.startDate
                ? moment(data.startDate).format("DD.MM.YYYY")
                : "N/A"}
            </Typography>
          </Stack>
          <Stack flexDirection={"row"} gap={2}>
            {data?.requirement && (
              <CommonChip
                title={data?.requirement?.name || "N/A"}
                style={{
                  borderColor: theme.inProgress.main,
                  backgroundColor: theme.inProgress.background.primary,
                  borderRadius: "3px",
                }}
              />
            )}
            {data?.frequency && (
              <CommonChip
                title={
                  data?.frequency
                    ? JobFrequency[Number(data?.frequency)]
                    : "N/A"
                }
                style={{
                  borderColor: theme.inProgress.main,
                  backgroundColor: theme.inProgress.background.primary,
                  borderRadius: "3px",
                }}
              />
            )}
            {data?.preferredGender && (
              <CommonChip
                title={
                  data?.preferredGender === 1
                    ? "Female carer"
                    : data?.preferredGender === 2
                    ? "Male carer"
                    : "none"
                }
                style={{
                  borderColor: theme.inProgress.main,
                  backgroundColor: theme.inProgress.background.primary,
                  borderRadius: "3px",
                }}
              />
            )}
            {data?.budgetType && (
              <CommonChip
                title={
                  data?.budgetType
                    ? BudgetType[Number(data?.budgetType)]
                    : "N/A"
                }
                style={{
                  borderColor: theme.inProgress.main,
                  backgroundColor: theme.inProgress.background.primary,
                  borderRadius: "3px",
                }}
              />
            )}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};
export default ProviderJobListingCard;
