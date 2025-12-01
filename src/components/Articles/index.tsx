import React, { useState } from "react";
import Image from "next/image";
import moment from "moment";
import { styled } from "@mui/material/styles";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Resource } from "@/app/(main)/support/resources/page";
import CommonChip from "../CommonChip";
import { UserBases } from "@/constants/usersData";

interface HealthVideoCardProps {
  video: Resource;
  onClick: () => void;
  onEdit?: (video: Resource) => void;
  onArchive?: (video: Resource) => void;
  onDelete?: (video: Resource) => void;
  isArchive?: boolean;
}

const StyledCard = styled(Card)(({ theme }) => ({
  width: "100%",
  borderRadius: "16px",
  overflow: "hidden",
  backgroundColor: theme.palette.common.white,
  position: "relative",
}));

const ThumbnailWrapper = styled(Box)(() => ({
  position: "relative",
  height: 250,
  width: "100%",
}));

const PlaceholderWrapper = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
  width: "100%",
}));

const ArticleCard: React.FC<HealthVideoCardProps> = ({
  video,
  onClick,
  onEdit,
  onArchive,
  onDelete,
  isArchive = false,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <StyledCard elevation={0}>
      <IconButton
        aria-label="options"
        onClick={handleMenuOpen}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          bgcolor: "white",
          zIndex: 1,
        }}
      >
        <MoreHorizIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            border: "1px solid #E2E6EB",
            borderRadius: "10px",
            marginTop: "5px",
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleMenuClose();
            onEdit?.(video);
          }}
        >
          Edit
        </MenuItem>
        {!isArchive && (
          <MenuItem
            onClick={() => {
              handleMenuClose();
              onArchive?.(video);
            }}
          >
            Archive
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            handleMenuClose();
            onDelete?.(video);
          }}
        >
          Delete
        </MenuItem>
      </Menu>

      <ThumbnailWrapper mb={1}>
        {video?.thumbnailUrl ? (
          <Image
            src={
              video.thumbnailUrl
                ? `${video.thumbnailUrl}`
                : "/assets/images/video-image.jpg"
            }
            alt="Video Thumbnail"
            fill
            style={{ objectFit: "cover", borderRadius: "10px" }}
          />
        ) : (
          <PlaceholderWrapper>
            <Image
              src="/assets/images/video-image.jpg"
              alt="survey placeholder"
              fill
              style={{ objectFit: "cover", borderRadius: "10px" }}
            />
          </PlaceholderWrapper>
        )}
      </ThumbnailWrapper>

      <CardContent sx={{ p: 0, pb: "0px !important" }}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="start"
          sx={{ height: "100%" }}
        >
          {video?.category.length > 0 && (
            <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
              {video.category.map((c) => (
                <CommonChip
                  key={c}
                  title={c}
                  style={{
                    borderColor: "#518ADD",
                    backgroundColor: "#ECF2FB",
                    borderRadius: "62px",
                    height: "34px",
                  }}
                  textStyle={{ color: "#518ADD", fontSize: "14px" }}
                />
              ))}
            </Box>
          )}
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: 16, lg: 20 },
              fontWeight: 500,
              mt: 1,
            }}
          >
            {video.title}
          </Typography>
          <Typography variant="body1">
            {video.userType && video.userType.length > 0
              ? video.userType.map((type) => UserBases[type]).join(", ")
              : "N/A"}{" "}
            | {moment(video.createdAt).format("Do MMMM YYYY")}
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Box
              component={"button"}
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 1,
                alignItems: "center",
                cursor: "pointer",
                backgroundColor: "transparent",
                border: "none",
              }}
              onClick={onClick}
            >
              <ArrowForwardIcon fontSize="small" htmlColor="#000000" />
              <Typography mt={"0.5"}>Read Article</Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default ArticleCard;
