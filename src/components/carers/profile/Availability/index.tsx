import React from "react";
import Box from "@mui/material/Box";
import { Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CommonCard from "@/components/Cards/Common";
import ApproveButton from "@/components/carers/profile/ApproveButton";

interface TimeSlot {
  name: string;
  value: number;
}

interface CareDay {
  name: string;
  value: number;
}

interface ScheduleEntry {
  careDays: CareDay;
  timeSlots: TimeSlot[];
  _id: string;
}

interface AvailabilityData {
  _id?: string;
  urgentCareSchedule?: ScheduleEntry[];
  hourlyCareSchedule?: ScheduleEntry[];
  overnightCareSchedule?: ScheduleEntry[];
  liveInCareSchedule?: ScheduleEntry[];
  isAvailabilityApproved?: boolean | null;
}

interface AvailabilityProps {
  data?: AvailabilityData;
  onApprovalClick?: (index: string) => void;
  onRejectClick?: (index: string) => void;
  showButton?: boolean | null;
}

const groupByDay = (schedule: ScheduleEntry[] = []) => {
  const grouped: Record<string, string[]> = {};
  schedule.forEach(({ careDays, timeSlots }) => {
    const day = careDays.name;
    const slots = timeSlots.map((slot) => slot.name);
    if (!grouped[day]) grouped[day] = [];
    grouped[day].push(...slots);
  });
  return grouped;
};

const Availability: React.FC<AvailabilityProps> = ({
  data,
  onApprovalClick,
  onRejectClick,
  showButton = false,
}) => {
  const theme = useTheme();
  const sections = [
    { label: "Urgent care", data: groupByDay(data?.urgentCareSchedule) },
    { label: "Hourly care", data: groupByDay(data?.hourlyCareSchedule) },
    { label: "Overnight care", data: groupByDay(data?.overnightCareSchedule) },
    { label: "Live in caer", data: groupByDay(data?.liveInCareSchedule) },
  ];

  const filteredSections = sections.filter(
    (section) => Object.keys(section.data).length > 0
  );

  return (
    <CommonCard>
      <Typography variant="h6" fontWeight={500}>
        Availability
      </Typography>

      <Stack spacing={3} mt={3}>
        {filteredSections.map((section) => (
          <Box key={section.label}>
            <Typography variant="subtitle2" fontWeight={500}>
              {section.label}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Stack spacing={0.5}>
              {Object.entries(section.data).map(([day, slots]) => (
                <Typography key={day} fontWeight={500}>
                  {day} - {slots.join(" | ")}
                </Typography>
              ))}
            </Stack>
          </Box>
        ))}
        {showButton && (
          <Box mt={2} sx={{ display: "flex", gap: 2 }}>
            {!data?.isAvailabilityApproved ||
            data?.isAvailabilityApproved === null ? (
              <ApproveButton
                sx={{ backgroundColor: "#F9D835", border: "none" }}
                onClick={() => {
                  if (data?._id !== undefined && onApprovalClick) {
                    onApprovalClick(data._id);
                  }
                }}
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
            {data?.isAvailabilityApproved === true ||
            data?.isAvailabilityApproved === null ? (
              <ApproveButton
                title="Decline"
                onClick={() => {
                  if (data?._id !== undefined && onRejectClick) {
                    onRejectClick(data._id);
                  }
                }}
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
      </Stack>
    </CommonCard>
  );
};

export default Availability;
