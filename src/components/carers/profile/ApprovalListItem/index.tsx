import React from "react";
import { useMediaQuery, Menu, MenuItem, SxProps, Theme } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MoreVertSharpIcon from "@mui/icons-material/MoreVertSharp";
//relative path imports
import CommonChip from "@/components/CommonChip";

interface ApprovalListItemProps {
  amount?: number;
  profileName: string | null;
  profilePic: string;
  dateTitle: string;
  date: string;
  approvalTitle: string;
  approvalVariant: "primary" | "default" | undefined;
  onClickMenuBtn?: () => void;
  handleMenuItemClick?: (number: number) => void;
  isApproval?: boolean;
  handleActionClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleClose?: () => void;
  anchorEl?: null | HTMLElement;
  sx?: SxProps<Theme>;
  isRowButton?: boolean;
}

const ApprovalListItem: React.FC<ApprovalListItemProps> = ({
  amount,
  profileName,
  profilePic,
  dateTitle,
  date,
  approvalTitle,
  approvalVariant,
  onClickMenuBtn,
  isApproval,
  handleMenuItemClick,
  handleActionClick,
  handleClose,
  anchorEl,
  sx,
  isRowButton = false,
}) => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <Box>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        sx={{ ...sx }}
        {...(isRowButton && {
          component: "button",
          width: "100%",
          onClick: onClickMenuBtn,
        })}
      >
        <Stack direction={"row"} alignItems={"center"} spacing={2}>
          <Image
            src={profilePic}
            alt="user-profile-pic"
            height={60}
            width={60}
            style={{ borderRadius: "50px" }}
          />
          <Box>
            <Typography
              variant="h6"
              maxWidth={"600px"}
              sx={{ wordBreak: "break-all" }}
              fontWeight={500}
            >
              {profileName}
            </Typography>
            {isTablet && amount && (
              <Typography variant={isTablet ? "body2" : "h6"} fontWeight={500}>
                Amount: £{amount.toFixed(2)}
              </Typography>
            )}
          </Box>
        </Stack>
        {!isTablet && (
          <Box>
            {amount && (
              <Typography variant="h6" fontWeight={500}>
                Amount: £{amount.toFixed(2)}
              </Typography>
            )}
          </Box>
        )}

        {isTablet ? (
          <Stack direction={"row"} alignItems={"center"}>
            {!isRowButton && (
              <IconButton onClick={onClickMenuBtn}>
                <MoreVertSharpIcon
                  style={{ color: theme.palette.common.black }}
                />
              </IconButton>
            )}
          </Stack>
        ) : (
          <Stack direction={"row"} alignItems={"center"} spacing={3}>
            <Box textAlign={"right"}>
              <Typography variant="caption" fontWeight={400}>
                {dateTitle}
              </Typography>
              <Typography component={"p"} variant="caption" fontWeight={500}>
                {date}
              </Typography>
            </Box>
            <CommonChip title={approvalTitle} variant={approvalVariant} />
            {isApproval ? (
              <>
                <IconButton onClick={(event) => handleActionClick?.(event)}>
                  <MoreVertSharpIcon
                    style={{ color: theme.palette.common.black }}
                  />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  {["Approve Account", "Reject Account"].map(
                    (action, index) => (
                      <MenuItem
                        key={index}
                        sx={{
                          color:
                            index === 1
                              ? theme.declined.main
                              : theme.palette.common.black,
                        }}
                        onClick={() => handleMenuItemClick?.(index)}
                      >
                        {action}
                      </MenuItem>
                    )
                  )}
                </Menu>
              </>
            ) : (
              <>
                {!isRowButton && (
                  <IconButton onClick={onClickMenuBtn}>
                    <MoreVertSharpIcon
                      style={{ color: theme.palette.common.black }}
                    />
                  </IconButton>
                )}
              </>
            )}
          </Stack>
        )}
      </Stack>
      {isTablet && (
        <Stack
          mt={2}
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Box>
            <Typography variant="caption" fontWeight={400}>
              {dateTitle}
            </Typography>
            <Typography component={"p"} variant="caption" fontWeight={500}>
              {date}
            </Typography>
          </Box>

          <CommonChip title={approvalTitle} variant={approvalVariant} />
        </Stack>
      )}
    </Box>
  );
};

export default ApprovalListItem;
