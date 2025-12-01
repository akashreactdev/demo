import Image from "next/image";
import React from "react";
import { useTheme } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import { Menu, MenuItem } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

type RawCategory = {
  name: string;
  value: number;
};

interface VideoData {
  _id: string;
  title: string;
  category: RawCategory[];
  thumbnailUrl: string;
  durationMinutes: number;
  durationSeconds: number;
  updatedAt: string;
  isBookmarked: boolean;
  status: number;
}

interface HealthVideoCardProps {
  video: VideoData;
  onActionClick: (
    event: React.MouseEvent<HTMLButtonElement>,
    rowId: string
  ) => void;
  onActionItemClick: (rowId: string, actionIndex: number) => void;
  onClose: () => void;
  anchorEl: HTMLElement | null;
  selectedRow: string | null;
}

const StyledCard = styled(Card)(({ theme }) => ({
  width: "100%",
  borderRadius: "16px",
  overflow: "hidden",
  backgroundColor: theme.palette.common.white,
}));

const ThumbnailWrapper = styled(Box)(({}) => ({
  position: "relative",
  height: 250,
  width: "100%",
}));

const PlaceholderWrapper = styled(Box)(({}) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
  width: "100%",
}));

interface ActionItem {
  label: string;
  value: 3 | 4;
}

const HealthVideoCard: React.FC<HealthVideoCardProps> = ({
  video,
  anchorEl,
  selectedRow,
  onActionClick,
  onActionItemClick,
  onClose,
}) => {
  const theme = useTheme();

  const actionItems: ActionItem[] = [
    { label: "Archieve video", value: 3 },
    { label: "Delete video", value: 4 },
  ];

  return (
    <StyledCard elevation={0}>
      <ThumbnailWrapper>
        {video?.thumbnailUrl ? (
          <Image
            src={
              video.thumbnailUrl
                ? video.thumbnailUrl
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
              width={48}
              height={48}
              style={{ borderRadius: "10px" }}
            />
          </PlaceholderWrapper>
        )}
      </ThumbnailWrapper>

      <CardContent
        sx={{
          px: 2,
          py: 0,
          pt: 3,
        }}
      >
        <Box
          display="flex"
          flexDirection={"column"}
          justifyContent="center"
          alignItems="start"
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              mb: 1,
            }}
          >
            <Typography
              noWrap
              sx={{
                fontSize: { xs: 14, lg: 16 },
                fontWeight: 400,
              }}
            >
              {video.durationMinutes} : {video.durationSeconds}
            </Typography>
            <Box
              component={"button"}
              onClick={(event) => onActionClick(event, video._id)}
              sx={{
                justifyContent: "end",
                backgroundColor: theme.palette.common.white,
                cursor: "pointer",
                border: "none",
                display: "flex",
                alignItems: "center",
                padding: 0,
                margin: 0,
              }}
            >
              <MoreHorizIcon
                style={{ color: theme.palette.common.black }}
                sx={{ width: "35px", height: "35px" }}
              />
            </Box>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl) && selectedRow === video._id}
              onClose={onClose}
            >
              {actionItems
                .filter((action) => !(video.status === 3 && action.value === 3))
                .map((action, index) => (
                  <MenuItem
                    key={index}
                    onClick={() => onActionItemClick(video._id, action.value)}
                    sx={{
                      color:
                        index === 1
                          ? theme.declined.main
                          : theme.palette.common.black,
                    }}
                  >
                    {action.label}
                  </MenuItem>
                ))}
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            sx={{
              fontSize: { xs: 16, lg: 20 },
              fontWeight: "bold",
              maxWidth: "80%",
            }}
          >
            {video.title}
          </Typography>
          {video?.category.length > 0 && (
            <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
              <Typography
                noWrap
                sx={{
                  fontSize: { xs: 14, lg: 16 },
                  fontWeight: 400,
                }}
              >
                {video.category.map((c) => c.name).join(", ")}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default HealthVideoCard;
