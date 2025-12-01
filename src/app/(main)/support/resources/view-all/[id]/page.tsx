"use client";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Grid2";
import CommonCard from "@/components/Cards/Common";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { Divider, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
// Import Yup and react-hook-form
import * as yup from "yup";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CommonButton from "@/components/CommonButton";
import CommonInput from "@/components/CommonInput";
import CommonSelect from "@/components/CommonSelect";
import Image from "next/image";
import { FileUploadData, uploadFile } from "@/services/api/fileUploadApi";
// import { addHealthVideo } from "@/services/api/usersApi";
import { CircularProgress } from "@mui/material";
// import { useRouterLoading } from "@/hooks/useRouterLoading";
import CommonNoteCard from "@/components/CommonNoteCard";
import SelectCancelModal from "@/components/CommonModal";

interface SectionItem {
  id: string;
  type: "subtitle" | "text" | "image" | "subtext";
  subTitle?: string;
  note?: string;
  imageUrl?: string;
  imageFile?: File;
}

interface Section {
  id: string;
  items: SectionItem[];
}

interface FormData {
  articleTitle: string | null;
  articleCategory: number[];
  videoFile: File | null;
  sections: Section[];
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


const schema: yup.ObjectSchema<FormData> = yup.object({
  articleTitle: yup.string().required("Required"),
  articleCategory: yup
    .array()
    .of(yup.number().typeError("Invalid number").required("Required"))
    .min(1, "Select at least 1 category")
    .max(3, "You can select maximum 3 categories")
    .required("Required"),
  videoFile: yup.mixed<File>().required("Video file is required"),
  sections: yup
    .array()
    .of(
      yup.object({
        id: yup.string().required(),
        items: yup
          .array()
          .of(
            yup.object({
              id: yup.string().required(),
              type: yup
                .string()
                .oneOf(["subtitle", "text", "image", "subtext"])
                .required(),
              subTitle: yup.string().when("type", {
                is: (val: string) => val === "subtitle" || val === "subtext",
                then: (schema) => schema.required("This field is required"),
                otherwise: (schema) => schema.optional(),
              }),
              note: yup.string().when("type", {
                is: "text",
                then: (schema) => schema.required("This field is required"),
                otherwise: (schema) => schema.optional(),
              }),
              imageUrl: yup.string().when("type", {
                is: "image",
                then: (schema) => schema.required("Image is required"),
                otherwise: (schema) => schema.optional(),
              }),
            })
          )
          .required(),
      })
    )
    .required("At least 1 section is required")
    .min(1, "At least 1 section is required"),
});

const ViewArticlePage: React.FC = () => {
  const theme = useTheme();
  // const { navigateWithLoading } = useRouterLoading();
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [minutes, setMinutes] = useState<string | number | null>(null);
  const [seconds, setSeconds] = useState<string | number | null>(null);
  const [videoUploadLoading, setVideoUploadLoading] = useState<boolean>(false);
  const [imageUploadLoading, setImageUploadLoading] = useState<
    Record<string, boolean>
  >({});
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const onModalClose = () => {
    setIsModalOpen(false);
  };

  const onApprove = () => {
    setIsModalOpen(false);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      articleTitle: "",
      articleCategory: [],
      videoFile: null,
      sections: [
        {
          id: `section-${Date.now()}`,
          items: [
            {
              id: `item-${Date.now()}-1`,
              type: "subtitle",
              subTitle: "",
            },
            {
              id: `item-${Date.now()}-2`,
              type: "text",
              note: "",
            },
          ],
        },
      ],
    },
  });

  const {
    fields: sectionFields,
    append: appendSection,
    remove: removeSection,
  } = useFieldArray({
    control,
    name: "sections",
  });

  const watchedSections = watch("sections");

  const videoCategoryOptions = [
    { label: "General Wellness", value: 1 },
    { label: "Emergency Care", value: 2 },
    { label: "Nutrition And Diet", value: 3 },
    { label: "Mental Health", value: 4 },
  ];

  // Add new item to a specific section
  const addItemToSection = (
    sectionIndex: number,
    itemType: "image" | "subtext"
  ) => {
    const currentSections = getValues("sections");
    const targetSection = currentSections[sectionIndex];

    const newItem: SectionItem = {
      id: `item-${Date.now()}-${Math.random()}`,
      type: itemType,
      ...(itemType === "image"
        ? { imageUrl: "", imageFile: undefined }
        : { subTitle: "" }),
    };

    const updatedItems = [...targetSection.items, newItem];
    setValue(`sections.${sectionIndex}.items`, updatedItems);
  };


  // Image upload handler
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    sectionIndex: number,
    itemIndex: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      toast.error("File size should be less than 8MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    const itemId = `${sectionIndex}-${itemIndex}`;
    setImageUploadLoading((prev) => ({ ...prev, [itemId]: true }));

    try {
      const uploadData: FileUploadData = {
        file: file,
        fileName: file.name,
        fileType: file.type,
        moduleName: "article",
        documentType: "content-image",
      };

      const response = (await uploadFile(uploadData)) as FileUploadResponse;

      if (response?.data?.success) {
        const fullUrl = `${process.env.NEXT_PUBLIC_ASSETS_URL}/${response.data.data.filePath}`;

        setValue(
          `sections.${sectionIndex}.items.${itemIndex}.imageUrl`,
          fullUrl
        );
        setValue(`sections.${sectionIndex}.items.${itemIndex}.imageFile`, file);
        toast.success("Image uploaded successfully");
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Error uploading image");
    } finally {
      setImageUploadLoading((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  // Video Upload API call
  const handleVideoChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void
  ) => {
    setVideoUploadLoading(true);
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024 * 1024) {
        toast.error("File size should be less than 500MB");
        setVideoUploadLoading(false);
        return;
      }
      if (!file.type.startsWith("video/")) {
        toast.error("Please select a valid video file");
        setVideoUploadLoading(false);
        return;
      }

      try {
        const localPreview = URL.createObjectURL(file);
        const video = document.createElement("video");

        video.preload = "metadata";
        video.src = localPreview;

        video.onloadedmetadata = () => {
          URL.revokeObjectURL(video.src);
          const durationInSeconds = video.duration;
          const minutes = Math.floor(durationInSeconds / 60);
          const seconds = Math.floor(durationInSeconds % 60);
          setMinutes(String(minutes).padStart(2, "0"));
          setSeconds(String(seconds).padStart(2, "0"));
        };

        const uploadData: FileUploadData = {
          file: file,
          fileName: file.name,
          fileType: file.type,
          moduleName: "article",
          documentType: "video",
        };

        const response = (await uploadFile(uploadData)) as VideoUploadResponse;
        if (response?.data?.success) {
          const fullUrl = `${process.env.NEXT_PUBLIC_ASSETS_URL}/${response.data.data.filePath}`;
          setVideoPreview(fullUrl);
          onChange(fullUrl);
        } else {
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

  const onSubmit = async (data: FormData) => {
    console.log(data, "data ==>");
    try {
      const payload = {
        title: data?.articleTitle,
        videoUrl: data?.videoFile,
        // thumbnailUrl: data?.thumbnailUrl,
        durationMinutes: minutes,
        durationSeconds: seconds,
        category: [Number(data?.articleCategory)],
        sections: data.sections.map((section) => ({
          items: section.items.map((item) => ({
            type: item.type,
            subTitle: item.subTitle || "",
            note: item.note || "",
            imageUrl: item.imageUrl || "",
          })),
        })),
      };

      console.log(payload, "payload");
      // const response = (await addHealthVideo(
      //   payload
      // )) as AddHealthVideoResposne;
      // if (response?.data?.success) {
      //   toast.success(response?.data?.message);
      //   navigateWithLoading("/users/health-videos");
      // }
    } catch (error) {
      console.error("Error while adding health videos:", error);
      toast.error("Failed add health videos.");
    }
  };

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <CommonCard>
            <Stack
              flexDirection={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
              gap={2}
            >
              <Box>
                <Typography variant="h6" fontWeight={500}>
                  Create New Article
                </Typography>
                <Typography variant="body1" fontWeight={400}>
                  Add all required text and images
                </Typography>
              </Box>
              <CommonButton
                buttonText="Create Article"
                // type="submit"
                onClick={() => setIsModalOpen(true)}
                // onClick={handleSubmit(onSubmit)}
                sx={{ width: "max-content", height: "45px" }}
                buttonTextStyle={{ fontSize: "14px" }}
              />
            </Stack>
          </CommonCard>
        </Box>

        <Grid2 container spacing={3} mt={3}>
          <Grid2
            size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}
            sx={{ display: "flex" }}
          >
            <CommonCard
              sx={{ flex: 1, display: "flex", flexDirection: "column" }}
            >
              <Typography variant="h6" fontWeight={500}>
                Create New Article
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Controller
                  name="articleTitle"
                  control={control}
                  render={({ field }) => (
                    <CommonInput
                      label="Article title"
                      placeholder="Enter article title"
                      error={!!errors.articleTitle}
                      helperText={errors.articleTitle?.message}
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
                  name="articleCategory"
                  control={control}
                  render={({ field }) => (
                    <CommonSelect
                      label="Article category (3 Max)"
                      placeholder="Please select"
                      multiple
                      value={field.value || []}
                      onChange={(val) => field.onChange(val)}
                      options={videoCategoryOptions}
                      helperText={errors.articleCategory?.message}
                      error={!!errors.articleCategory}
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

          <Grid2
            size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}
            sx={{ display: "flex" }}
          >
            <CommonCard
              sx={{ flex: 1, display: "flex", flexDirection: "column" }}
            >
              <Typography variant="h6" fontWeight={500}>
                Video file
              </Typography>

              <Box sx={{ mt: 3 }}>
                <Controller
                  name="videoFile"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <Box>
                      <Paper
                        onClick={() =>
                          !videoUploadLoading && videoInputRef.current?.click()
                        }
                        sx={{
                          width: "100%",
                          height: 330,
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
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 400 }}
                            >
                              Click here to upload or drop media here
                            </Typography>
                          </Box>
                        )}
                      </Paper>

                      {errors.videoFile && (
                        <Typography
                          variant="body2"
                          color="error"
                          sx={{ mt: 1 }}
                        >
                          {errors.videoFile?.message}
                        </Typography>
                      )}
                    </Box>
                  )}
                />
              </Box>
            </CommonCard>
          </Grid2>
        </Grid2>

        <Divider sx={{ mt: 3 }} />

        {/* Dynamic Sections */}
        <Box mt={3}>
          {sectionFields.map((section, sectionIndex) => (
            <CommonCard key={section.id} sx={{ mb: 3 }}>
              <Box>
                {/* Section Header */}
                {sectionFields.length > 1 && (
                  <Box sx={{ textAlign: "end", mb: 2 }}>
                    <IconButton
                      onClick={() => removeSection(sectionIndex)}
                      sx={{
                        color: theme.declined.main,
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}

                {/* Dynamic Items */}
                {watchedSections[sectionIndex]?.items?.map(
                  (item, itemIndex) => (
                    <Box key={item.id} sx={{ mb: 2 }}>
                      {/* Remove Item Button */}

                      {/* Render based on item type */}
                      {item.type === "subtitle" && (
                        <Box>
                          <Typography variant="body1" fontSize={"16px"} mb={1}>
                            Sub-title
                          </Typography>
                          <Controller
                            name={`sections.${sectionIndex}.items.${itemIndex}.subTitle`}
                            control={control}
                            render={({ field }) => (
                              <CommonInput
                                fullWidth
                                placeholder="Enter subtitle"
                                {...field}
                                error={
                                  !!errors.sections?.[sectionIndex]?.items?.[
                                    itemIndex
                                  ]?.subTitle
                                }
                                value={field.value || ""}
                                onChange={field.onChange}
                                helperText={
                                  errors.sections?.[sectionIndex]?.items?.[
                                    itemIndex
                                  ]?.subTitle?.message
                                }
                                sx={{
                                  height: "50px",
                                  "&.MuiOutlinedInput-root": {
                                    border: `1px solid ${theme.pending.secondary}`,
                                    padding: "5px",
                                    "& .MuiOutlinedInput-notchedOutline": {
                                      border: "none",
                                    },
                                    "&.Mui-error": {
                                      border: `1px solid ${theme.declined.secondary}`,
                                    },
                                  },
                                }}
                              />
                            )}
                          />
                        </Box>
                      )}

                      {item.type === "text" && (
                        <Box>
                          <Typography variant="body1" fontSize={"16px"} mb={1}>
                            Add text
                          </Typography>
                          <Controller
                            name={`sections.${sectionIndex}.items.${itemIndex}.note`}
                            control={control}
                            render={({ field }) => (
                              <CommonNoteCard
                                placeholder="Please provide details..."
                                value={field.value || ""}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                name={field.name}
                                error={
                                  !!errors.sections?.[sectionIndex]?.items?.[
                                    itemIndex
                                  ]?.note
                                }
                                helperText={
                                  errors.sections?.[sectionIndex]?.items?.[
                                    itemIndex
                                  ]?.note?.message
                                }
                                rows={2}
                                maxLength={500}
                                showCharacterCount={true}
                              />
                            )}
                          />
                        </Box>
                      )}

                      {item.type === "image" && (
                        <Box>
                          <Typography variant="body1" fontSize={"16px"} mb={1}>
                            Image
                          </Typography>
                          {item.imageUrl ? (
                            <Box
                              sx={{
                                position: "relative",
                                width: "100%",
                              }}
                            >
                              <Paper
                                sx={{
                                  width: "100%",
                                  height: 200,
                                  borderRadius: 2,
                                  overflow: "hidden",
                                  position: "relative",
                                }}
                              >
                                <Image
                                  src={item.imageUrl}
                                  alt="Uploaded image"
                                  fill
                                  style={{ objectFit: "contain" }}
                                />
                              </Paper>
                              <IconButton
                                onClick={() => {
                                  setValue(
                                    `sections.${sectionIndex}.items.${itemIndex}.imageUrl`,
                                    ""
                                  );
                                  setValue(
                                    `sections.${sectionIndex}.items.${itemIndex}.imageFile`,
                                    undefined
                                  );
                                }}
                                sx={{
                                  position: "absolute",
                                  top: 8,
                                  right: 8,
                                  backgroundColor:
                                    theme.pending.background.secondary,
                                  borderRadius: "8px",
                                  width: 32,
                                  height: 32,
                                }}
                                size="small"
                              >
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          ) : (
                            <Box>
                              <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png"
                                onChange={(e) =>
                                  handleImageUpload(e, sectionIndex, itemIndex)
                                }
                                style={{ display: "none" }}
                                id={`image-upload-${sectionIndex}-${itemIndex}`}
                              />
                              <label
                                htmlFor={`image-upload-${sectionIndex}-${itemIndex}`}
                              >
                                <Paper
                                  component="span"
                                  sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: "100%",
                                    height: 200,
                                    borderRadius: 2,
                                    border: `1px dashed ${theme.palette.common.black}`,
                                    cursor: "pointer",
                                    backgroundColor:
                                      theme.pending.background.secondary,
                                  }}
                                  elevation={0}
                                >
                                  {imageUploadLoading[
                                    `${sectionIndex}-${itemIndex}`
                                  ] ? (
                                    <CircularProgress size={24} />
                                  ) : (
                                    <Typography variant="body2">
                                      Click to upload image
                                    </Typography>
                                  )}
                                </Paper>
                              </label>
                            </Box>
                          )}
                        </Box>
                      )}

                      {item.type === "subtext" && (
                        <Box>
                          <Typography variant="body1" fontSize={"16px"} mb={1}>
                            Add sub-text
                          </Typography>
                          <Controller
                            name={`sections.${sectionIndex}.items.${itemIndex}.subTitle`}
                            control={control}
                            render={({ field }) => (
                              <CommonInput
                                fullWidth
                                placeholder="Enter sub-text"
                                value={field.value || ""}
                                onChange={field.onChange}
                                // {...field}
                                error={
                                  !!errors.sections?.[sectionIndex]?.items?.[
                                    itemIndex
                                  ]?.subTitle
                                }
                                helperText={
                                  errors.sections?.[sectionIndex]?.items?.[
                                    itemIndex
                                  ]?.subTitle?.message
                                }
                                sx={{
                                  height: "50px",
                                  "&.MuiOutlinedInput-root": {
                                    border: `1px solid ${theme.pending.secondary}`,
                                    padding: "5px",
                                    "& .MuiOutlinedInput-notchedOutline": {
                                      border: "none",
                                    },
                                    "&.Mui-error": {
                                      border: `1px solid ${theme.declined.secondary}`,
                                    },
                                  },
                                }}
                              />
                            )}
                          />
                        </Box>
                      )}
                    </Box>
                  )
                )}

                {/* Add Image and Add Sub-text Buttons */}
                <Stack
                  flexDirection={"row"}
                  gap={2}
                  alignItems={"center"}
                  mt={2}
                >
                  <Box>
                    <CommonButton
                      buttonText="Add image"
                      onClick={() => addItemToSection(sectionIndex, "image")}
                      sx={{
                        height: "35px",
                        backgroundColor:
                          theme.inProgress.background.secondaryborder,
                      }}
                      startIcon={
                        <Image
                          alt="img file"
                          src={"/assets/svg/provider/profile/img_file.svg"}
                          height={16}
                          width={16}
                        />
                      }
                      buttonTextStyle={{
                        fontSize: "14px",
                        fontWeight: 400,
                        marginTop: 0.5,
                      }}
                    />
                  </Box>
                  <Box>
                    <CommonButton
                      buttonText="Add sub-text"
                      onClick={() => addItemToSection(sectionIndex, "subtext")}
                      sx={{
                        height: "35px",
                        backgroundColor:
                          theme.inProgress.background.secondaryborder,
                      }}
                      startIcon={
                        <Image
                          alt="text format"
                          src={
                            "/assets/svg/provider/profile/text_format_img.svg"
                          }
                          height={16}
                          width={16}
                        />
                      }
                      buttonTextStyle={{
                        fontSize: "14px",
                        fontWeight: 400,
                        marginTop: 0.5,
                      }}
                    />
                  </Box>
                </Stack>
              </Box>
            </CommonCard>
          ))}
        </Box>

        {/* Add New Section Button */}
        <Box mt={3}>
          <CommonCard>
            <Stack
              flexDirection={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography variant="body1" fontSize={"18px"}>
                New section
              </Typography>
              <CommonButton
                buttonText="Add new section"
                onClick={() =>
                  appendSection({
                    id: `section-${Date.now()}`,
                    items: [
                      {
                        id: `item-${Date.now()}-1`,
                        type: "subtitle",
                        subTitle: "",
                      },
                      {
                        id: `item-${Date.now()}-2`,
                        type: "text",
                        note: "",
                      },
                    ],
                  })
                }
                sx={{
                  width: "max-content",
                  height: "35px",
                  backgroundColor: theme.inProgress.background.secondaryborder,
                }}
                buttonTextStyle={{ fontSize: "14px", fontWeight: 400 }}
              />
            </Stack>
          </CommonCard>
        </Box>
      </form>
      <SelectCancelModal
        title="Create article"
        question="Are you sure the article is complete"
        buttonText="Done"
        isOpen={isModalOpen}
        onClose={onModalClose}
        onRemove={onApprove}
      />
    </Box>
  );
};

export default ViewArticlePage;
