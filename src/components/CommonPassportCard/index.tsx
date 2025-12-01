import React from "react";
import Image from "next/image";
import { IconButton } from "@mui/material";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

interface PassportProps {
  isRightButton?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
  path?: string;
  email?: string;
  date?: string;
}

const CommonPassportCard: React.FC<PassportProps> = ({
  isRightButton = true,
  style,
  path,
  onClick,
  email,
  date,
}) => {
  return (
    <Stack
      mt={2}
      direction={"row"}
      alignItems={"center"}
      justifyContent={"space-between"}
      sx={{
        border: "1px solid #E2E6EB",
        p: 2,
        borderRadius: "10px",
        ...style,
      }}
      onClick={onClick}
    >
      <Stack direction={"row"} alignItems={"center"} spacing={2}>
        {path && (
          <Image
            src={path ? path : "/assets/images/user_profile.jpg"}
            alt="User Profile"
            width={50}
            height={50}
          />
        )}
        <Box>
          <Typography variant="body1" fontWeight={"500"}>
            {email ? email : "N/A"}
          </Typography>
          <Typography variant="body2">
            Last opened: {date ? date : "N/A"}
          </Typography>
        </Box>
      </Stack>
      {isRightButton && (
        <Box>
          <IconButton>
            <ArrowForwardIosIcon sx={{ color: "#000000", fontSize: 16 }} />
          </IconButton>
        </Box>
      )}
    </Stack>
  );
};

export default CommonPassportCard;
