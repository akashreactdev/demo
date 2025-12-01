"use client";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import dayjs from "dayjs";
import moment from "moment";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
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
import { FileUploadData, uploadFile } from "@/services/api/fileUploadApi";
import CommonDatePicker from "@/components/CommonDatePicker";
// import { addHealthVideo } from "@/services/api/usersApi";
// import { CircularProgress } from "@mui/material";
import { useRouterLoading } from "@/hooks/useRouterLoading";
import { addNewAccessUser } from "@/services/api/settingsAPI";

interface FormData {
  username: string | null;
  role: string | null;
  profile: File | null;
  email: string | null;
  address: string | null;
  dob: Date | null;
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

interface AddHealthVideoResposne {
  data: {
    success: boolean;
    message: string;
  };
}

const schema: yup.ObjectSchema<FormData> = yup.object({
  username: yup.string().trim().required("Required"),
  role: yup.string().required("Required"),
  profile: yup.mixed<File>().required("Thumbnail is required"),
  email: yup
    .string()
    .trim()
    .email("Please enter a valid email address")
    .required("Email is required"),
  address: yup.string().trim().required("Required"),
  dob: yup
    .date()
    .nullable()
    .required("Required")
    .max(new Date(), "Date of birth cannot be in the future."),
});

const AddNewUser: React.FC = () => {
  const theme = useTheme();
  const { navigateWithLoading } = useRouterLoading();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      username: "",
      role: "",
      profile: null,
      email: "",
      address: "",
      dob: null,
    },
  });

  const adminCategoryOptions = [
    { label: "Super Admin", value: 6 },
    { label: "Sub Admin", value: 1 },
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
          onChange(response.data.data.filePath);
        } else {
          toast.error("Failed to upload thumbnail");
        }
      } catch (error) {
        console.error("Upload failed:", error);
        toast.error("Error uploading thumbnail");
      }
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        username: data?.username || "",
        profile: data?.profile || "",
        role: Number(data?.role),
        email: data?.email || "",
        address: data?.address || "",
        dob: data?.dob ? moment(data.dob).format("YYYY-MM-DD") : null,
      };
      // console.log(payload, "payload");
      const response = (await addNewAccessUser(
        payload
      )) as AddHealthVideoResposne;
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        navigateWithLoading("/settings/access");
      }
    } catch (error) {
      console.error("Error while adding health videos:", error);
      toast.error("Failed add health videos.");
    }
  };

  return (
    <Box>
      <Box>
        <CommonCard>
          <Stack
            flexDirection={"row"}
            gap={2}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Box>
              <Typography variant="body1" fontWeight={500} fontSize={"18px"}>
                Add new admin
              </Typography>
              <Typography variant="caption">
                Add new super or sub-admin to Zorbee
              </Typography>
            </Box>
            <CommonButton
              buttonText="Done"
              type="submit"
              onClick={handleSubmit(onSubmit)}
              sx={{ width: "max-content", height: "45px" }}
            />
          </Stack>
        </CommonCard>
      </Box>
      <Grid2 container spacing={3} mt={4}>
        <Grid2
          size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}
          sx={{ display: "flex" }}
        >
          <CommonCard
            sx={{ flex: 1, display: "flex", flexDirection: "column" }}
          >
            {/* Thumbnail Upload with Controller */}
            <Box>
              <Controller
                name="profile"
                control={control}
                render={({ field: { onChange } }) => (
                  <Box>
                    <Typography
                      variant="body1"
                      sx={{ mb: 2, fontSize: "1rem", fontWeight: 400 }}
                    >
                      Profile Image
                    </Typography>

                    <Paper
                      onClick={() => fileInputRef.current?.click()}
                      sx={{
                        width: 200,
                        height: 200,
                        border: errors.profile
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
                      {errors.profile && (
                        <Typography
                          variant="body2"
                          color="error"
                          sx={{ mt: 1 }}
                        >
                          {errors.profile?.message}
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
            <Box>
              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    label="Name"
                    placeholder="Enter name"
                    error={!!errors.username}
                    helperText={errors.username?.message}
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
                name="role"
                control={control}
                render={({ field }) => (
                  <CommonSelect
                    label="Admin category"
                    placeholder="Please select"
                    value={field.value}
                    onChange={field.onChange}
                    options={adminCategoryOptions}
                    helperText={errors.role?.message}
                    error={!!errors.role}
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
            <Box mt={3}>
              <Controller
                name="dob"
                control={control}
                render={({ field }) => (
                  <CommonDatePicker
                    label="Date of Birth"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select date of birth"
                    error={!!errors.dob}
                    helperText={errors.dob?.message}
                    maxDate={dayjs()}
                    disablePast={false}
                  />
                )}
              />
            </Box>

            <Box mt={3}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    label="Email"
                    placeholder="Enter email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
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
                name="address"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    label="address"
                    placeholder="Enter address"
                    error={!!errors.address}
                    helperText={errors.address?.message}
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
          </CommonCard>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default AddNewUser;
