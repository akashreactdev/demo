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
// import { addHealthVideo } from "@/services/api/usersApi";
// import { useRouterLoading } from "@/hooks/useRouterLoading";

interface FormData {
  companyName: string | null;
  emailAddress: string | null;
  thumbnailUrl: File | null;
  partnerCategory: number[];
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

const schema: yup.ObjectSchema<FormData> = yup.object({
  companyName: yup.string().required("Required"),
  emailAddress: yup
    .string()
    .email("Enter a valid email address")
    .required("Required"),
  partnerCategory: yup
    .array()
    .of(yup.number().typeError("Invalid number").required("Required"))
    .min(1, "Select at least 1 category")
    .required("Required"),
  thumbnailUrl: yup.mixed<File>().required("Required"),
});

const AddNewPartner: React.FC = () => {
  const theme = useTheme();
  //   const { navigateWithLoading } = useRouterLoading();
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
      companyName: "",
      emailAddress: "",
      partnerCategory: [],
      thumbnailUrl: null,
    },
  });

  const partnerCategoryOptions = [
    { label: "HR & care service management", value: 1 },
    { label: "Financial Officer", value: 2 },
    { label: "Full service", value: 3 },
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

  const onSubmit = async (data: FormData) => {
    // console.log("Form Data Submitted: ", data);
    try {
      const selectedCategories = partnerCategoryOptions
        .filter((option) => data.partnerCategory.includes(option.value))
        .map((option) => option.label);
      const payload = {
        companyName: data?.companyName,
        emailAddress: data?.emailAddress,
        thumbnailUrl: data?.thumbnailUrl,
        category: selectedCategories || [],
      };
      console.log(payload, "payload");
      //   const response = (await addHealthVideo(
      //     payload
      //   )) as AddHealthVideoResposne;
      //   if (response?.data?.success) {
      //     toast.success(response?.data?.message);
      //     navigateWithLoading("/partners/overview");
      //   }
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
              Add New Partner
            </Typography>

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
            <Box mt={3}>
              <Controller
                name="companyName"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    label="Company name"
                    placeholder="Enter company name"
                    error={!!errors.companyName}
                    helperText={errors.companyName?.message}
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
                name="emailAddress"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    label="Email Address"
                    placeholder="Enter email address"
                    error={!!errors.emailAddress}
                    helperText={errors.emailAddress?.message}
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
                name="partnerCategory"
                control={control}
                render={({ field }) => (
                  <CommonSelect
                    label="partner category"
                    placeholder="Please select"
                    multiple
                    value={field.value || []}
                    onChange={(val) => field.onChange(val)}
                    options={partnerCategoryOptions}
                    helperText={errors.partnerCategory?.message}
                    error={!!errors.partnerCategory}
                    sx={{
                      width: "100%",
                      minHeight: "50px",
                      maxHeight: "fit-content !important",
                      fontSize: "16px",
                      backgroundColor: theme.palette.common.white,
                      border: `1px solid ${theme.pending.secondary}`,
                    }}
                    chipStyle={{
                      borderColor: "#518ADD",
                      backgroundColor: "#ECF2FB",
                      borderRadius: "62px",
                      height: "34px",
                      minHeight: "34px",
                      padding: "0 12px",
                      lineHeight: "34px",
                      color: "#518ADD",
                      fontSize: "14px",
                    }}
                  />
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
          buttonText="Save partner"
          type="submit"
          onClick={handleSubmit(onSubmit)}
          sx={{ width: "max-content", height: "45px" }}
        />
      </Box>
    </Box>
  );
};
export default AddNewPartner;
