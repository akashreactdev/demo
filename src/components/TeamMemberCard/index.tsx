import React from "react";
import { Box, Typography, Stack, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface TeamMemberProps {
  name: string;
  jobRole: string;
  email: string;
  status: string;
  permission: string;
}

const TeamMemberCard = ({
  name,
  jobRole,
  email,
  status,
  permission,
}: TeamMemberProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Box mt={4} sx={{ border: "1px solid #E2E6EB", borderRadius: "10px" }}>
      <Stack
        p={3}
        direction={isMobile ? "column" : "row"}
        sx={{ borderBottom: "1px solid #E2E6EB" }}
        spacing={isMobile ? 0 : 2}
      >
        <Box>
          <img src="/icon.svg" alt="icon" />
        </Box>
        <Box>
          <Typography variant="h6" fontSize={18} fontWeight={500}>
            {name}
          </Typography>
          <Typography fontSize={15} variant="subtitle1">
            Job role: {jobRole}
          </Typography>
          <Typography fontSize={15} variant="subtitle1">
            {email}
          </Typography>
        </Box>
      </Stack>
      <Box sx={{ padding: "12px 24px" }}>
        <Typography fontSize={15} variant="subtitle1">
          Account status: {status}
        </Typography>
        <Typography fontSize={15} variant="subtitle1">
          Permissions: {permission}
        </Typography>
      </Box>
    </Box>
  );
};

export default TeamMemberCard;
