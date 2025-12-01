"use client";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Grid2";
import CommonCard from "@/components/Cards/Common";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
// Import Yup and react-hook-form
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CommonButton from "@/components/CommonButton";
import CommonInput from "@/components/CommonInput";
import CommonSelect from "@/components/CommonSelect";
import Image from "next/image";
import { FileUploadData, uploadFile } from "@/services/api/fileUploadApi";
import { addHealthVideo } from "@/services/api/usersApi";
import { CircularProgress } from "@mui/material";
import { useRouterLoading } from "@/hooks/useRouterLoading";

interface FormData {
  videoTitle: string | null;
  videoLink: string | null;
  videoCategory: string | null;
  thumbnailUrl: File | null;
  videoFile: File | null;
}

interface FileUploadResponse {
  data: {
    success: boolean;
    message: string;
    data: {
      filePath: string;
    };
  };
}

interface VideoUploadResponse {
  data: {
    success: boolean;
    message: string;
    data: {
      filePath: string;
    };
  };
}

interface AddHealthVideoResposne {
  data: {
    success: boolean;
    message: string;
  };
}

const schema: yup.ObjectSchema<FormData> = yup.object({
  videoTitle: yup.string().trim().required("Required"),
  videoLink: yup.string().trim().required("Required"),
  videoCategory: yup.string().required("Required"),
  thumbnailUrl: yup.mixed<File>().required("Thumbnail is required"),
  videoFile: yup.mixed<File>().required("Video file is required"),
});

const AddNewHealthVideo: React.FC = () => {
  const theme = useTheme();
const { navigateWithLoading } = useRouterLoading();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [minutes, setMinutes] = useState<string | number | null>(null);
  const [seconds, setSeconds] = useState<string | number | null>(null);
  const [videoUploadLoading, setVideoUploadLoading] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      videoTitle: "",
      videoLink: "",
      videoCategory: "",
      thumbnailUrl: null,
      videoFile: null,
    },
  });

  const videoCategoryOptions = [
    { label: "General Wellness", value: 1 },
    { label: "Emergency Care", value: 2 },
    { label: "Nutrition And Diet", value: 3 },
    { label: "Mental Health", value: 4 },
  ];

  const handleThumbnailChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void
  ) => {
    const file = e.target.files?.[0];
    // console.log(file, "file");
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        toast.error("File size should be less than 8MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }
      try {
        const localPreview = URL.createObjectURL(file);
        setPreview(localPreview);

        const uploadData: FileUploadData = {
          file: file,
          fileName: file.name,
          fileType: file.type,
          moduleName: "healthVideos",
          documentType: "thumbnail",
        };

        const response = (await uploadFile(uploadData)) as FileUploadResponse;

        if (response?.data?.success) {
          const fullUrl = `${process.env.NEXT_PUBLIC_ASSETS_URL}/${response.data.data.filePath}`;
          setPreview(fullUrl);
          onChange(fullUrl);
        } else {
          toast.error("Failed to upload thumbnail");
        }
      } catch (error) {
        console.error("Upload failed:", error);
        toast.error("Error uploading thumbnail");
      }
    }
  };

  const handleVideoChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void
  ) => {
    setVideoUploadLoading(true);
    const file = e.target.files?.[0];
    // console.log(file, "video file ==>");
    if (file) {
      if (file.size > 500 * 1024 * 1024) {
        toast.error("File size should be less than 500MB");
        return;
      }
      if (!file.type.startsWith("video/")) {
        toast.error("Please select a valid video file");
        return;
      }

      try {
        const localPreview = URL.createObjectURL(file);
        const video = document.createElement("video");

        video.preload = "metadata";
        video.src = localPreview;

        video.onloadedmetadata = () => {
          URL.revokeObjectURL(video.src); // Clean up
          const durationInSeconds = video.duration;
          const minutes = Math.floor(durationInSeconds / 60);
          const seconds = Math.floor(durationInSeconds % 60);
          setMinutes(String(minutes).padStart(2, "0"));
          setSeconds(String(seconds).padStart(2, "0"));

          // console.log("Duration:", `${minutes} minutes ${seconds} seconds`);
        };
        const uploadData: FileUploadData = {
          file: file,
          fileName: file.name,
          fileType: file.type,
          moduleName: "healthVideos",
          documentType: "video",
        };
        const response = (await uploadFile(uploadData)) as VideoUploadResponse;
        if (response?.data?.success) {
          setVideoUploadLoading(false);
          const fullUrl = `${process.env.NEXT_PUBLIC_ASSETS_URL}/${response.data.data.filePath}`;
          setVideoPreview(localPreview);
          setVideoPreview(fullUrl);
          onChange(fullUrl);
        } else {
          setVideoUploadLoading(false);
          toast.error("Failed to upload video");
        }
      } catch (error) {
        console.error("Upload failed:", error);
        toast.error("Error uploading video");
      } finally {
        setVideoUploadLoading(false);
      }
    }
  };

  // console.log(errors, "errors ==>");
  const onSubmit = async (data: FormData) => {
    // console.log("Form Data Submitted: ", data);
    try {
      const payload = {
        title: data?.videoTitle,
        videoUrl: data?.videoFile,
        thumbnailUrl: data?.thumbnailUrl,
        durationMinutes: minutes,
        durationSeconds: seconds,
        category: [Number(data?.videoCategory)],
      };
      // console.log(payload, "payload");
      const response = (await addHealthVideo(
        payload
      )) as AddHealthVideoResposne;
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        navigateWithLoading("/users/health-videos");
      }
    } catch (error) {
      console.error("Error while adding health videos:", error);
      toast.error("Failed add health videos.");
    }
  };

  return (
    <Box>
      <Grid2 container spacing={3}>
        <Grid2
          size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}
          sx={{ display: "flex" }}
        >
          <CommonCard
            sx={{ flex: 1, display: "flex", flexDirection: "column" }}
          >
            <Typography variant="h6" fontWeight={500}>
              New Video
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Controller
                name="videoTitle"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    label="Video Title"
                    placeholder="Enter video title"
                    error={!!errors.videoTitle}
                    helperText={errors.videoTitle?.message}
                    sx={{
                      "&.MuiOutlinedInput-root": {
                        border: `1px solid ${theme.pending.secondary}`,
                        padding: "5px",
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          border: `1px solid ${theme.accepted.background.fourth}`,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          border: `1px solid ${theme.palette.common.black}`,
                        },
                        "&.Mui-error": {
                          border: `1px solid ${theme.declined.secondary}`,
                        },
                      },
                    }}
                    {...field}
                  />
                )}
              />
            </Box>
            <Box mt={3}>
              <Controller
                name="videoCategory"
                control={control}
                render={({ field }) => (
                  <CommonSelect
                    label="Video category"
                    placeholder="Please select"
                    value={field.value}
                    onChange={field.onChange}
                    options={videoCategoryOptions}
                    helperText={errors.videoCategory?.message}
                    error={!!errors.videoCategory}
                    sx={{
                      width: "100%",
                      height: "50px",
                      fontSize: "16px",
                      backgroundColor: theme.palette.common.white,
                      border: `1px solid ${theme.pending.secondary}`,
                    }}
                  />
                )}
              />
            </Box>

            {/* Thumbnail Upload with Controller */}
            <Box sx={{ mt: 3 }}>
              <Controller
                name="thumbnailUrl"
                control={control}
                render={({ field: { onChange } }) => (
                  <Box>
                    <Typography
                      variant="body1"
                      sx={{ mb: 2, fontSize: "1rem", fontWeight: 400 }}
                    >
                      Thumbnail Image
                    </Typography>

                    <Paper
                      onClick={() => fileInputRef.current?.click()}
                      sx={{
                        width: 200,
                        height: 200,
                        border: errors.thumbnailUrl
                          ? `2px solid ${theme.declined.main}`
                          : `2px solid ${theme.inProgress.main}`,
                        borderRadius: "16px",
                        backgroundColor: theme.inProgress.background.primary,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        overflow: "hidden",
                      }}
                      elevation={0}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg, image/jpg, image/png"
                        // accept="image/*"
                        onChange={(e) => handleThumbnailChange(e, onChange)}
                        style={{ display: "none" }}
                      />

                      {preview ? (
                        <div
                          style={{
                            position: "relative",
                            width: "100%",
                            height: "100%",
                          }}
                        >
                          <Image
                            src={preview}
                            alt="Preview"
                            fill
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                      ) : (
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                          }}
                        >
                          <Image
                            src="/assets/svg/health-videos/add_thumbnail.svg"
                            alt="Add thumbnail"
                            width={60}
                            height={60}
                            style={{ objectFit: "contain" }}
                          />
                        </Box>
                      )}
                    </Paper>

                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        File size limit: 8MB
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Accepted files: JPEG, PNG, JPG
                      </Typography>
                      {errors.thumbnailUrl && (
                        <Typography
                          variant="body2"
                          color="error"
                          sx={{ mt: 1 }}
                        >
                          {errors.thumbnailUrl?.message}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}
              />
            </Box>
          </CommonCard>
        </Grid2>

        <Grid2
          size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}
          sx={{ display: "flex" }}
        >
          <CommonCard
            sx={{ flex: 1, display: "flex", flexDirection: "column" }}
          >
            <Typography variant="h6" fontWeight={500}>
              Upload file
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Controller
                name="videoLink"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    label="Video Link"
                    placeholder="Enter video link"
                    error={!!errors.videoLink}
                    helperText={errors.videoLink?.message}
                    sx={{
                      "&.MuiOutlinedInput-root": {
                        border: `1px solid ${theme.pending.secondary}`,
                        padding: "5px",
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          border: `1px solid ${theme.accepted.background.fourth}`,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          border: `1px solid ${theme.palette.common.black}`,
                        },
                        "&.Mui-error": {
                          border: `1px solid ${theme.declined.secondary}`,
                        },
                      },
                    }}
                    {...field}
                  />
                )}
              />
            </Box>

            {/* Video Upload Section */}
            <Box sx={{ mt: 3 }}>
              <Controller
                name="videoFile"
                control={control}
                render={({ field: { onChange } }) => (
                  <Box>
                    <Typography
                      variant="body1"
                      sx={{ mb: 2, fontSize: "1rem", fontWeight: 400 }}
                    >
                      Video File
                    </Typography>

                    <Paper
                      onClick={() =>
                        !videoUploadLoading && videoInputRef.current?.click()
                      }
                      sx={{
                        width: "100%",
                        height: 200,
                        borderRadius: "16px",
                        backgroundColor: theme.ShadowAndBorder.border2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        overflow: "hidden",
                      }}
                      elevation={0}
                    >
                      <input
                        ref={videoInputRef}
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleVideoChange(e, onChange)}
                        style={{ display: "none" }}
                      />

                      {videoUploadLoading ? (
                        <Box
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          height="100%"
                        >
                          <CircularProgress size={30} color={"primary"} />
                        </Box>
                      ) : videoPreview ? (
                        <video
                          src={videoPreview}
                          controls
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                          }}
                        >
                          <Image
                            src="/assets/svg/health-videos/upload_video.svg"
                            alt="Upload video"
                            width={60}
                            height={60}
                            style={{
                              objectFit: "contain",
                              marginBottom: "16px",
                            }}
                          />
                          <Typography variant="body1" sx={{ fontWeight: 400 }}>
                            Click here to upload or drop media here
                          </Typography>
                        </Box>
                      )}
                    </Paper>

                    {errors.videoFile && (
                      <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                        {errors.videoFile?.message}
                      </Typography>
                    )}

                    {/* <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        File size limit: 500MB
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Accepted files: MP4, AVI, MOV, WMV
                      </Typography>
                      {errors.videoFile && (
                        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                          {errors.videoFile?.message}
                        </Typography>
                      )}
                    </Box> */}
                  </Box>
                )}
              />
            </Box>
          </CommonCard>
        </Grid2>
      </Grid2>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          mt: 3,
          justifyContent: "end",
        }}
      >
        <CommonButton
          buttonText="Save video"
          type="submit"
          onClick={handleSubmit(onSubmit)}
          sx={{ width: "max-content" }}
        />
      </Box>
    </Box>
  );
};

export default AddNewHealthVideo;
