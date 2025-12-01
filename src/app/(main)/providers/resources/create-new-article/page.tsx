"use client";
import React, { useEffect, useRef, useState } from "react";
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
import { useRouterLoading } from "@/hooks/useRouterLoading";
// import CommonNoteCard from "@/components/CommonNoteCard";
import {
  ArticleItem,
  createProviderResources,
  getSingleResources,
} from "@/services/api/supportApi";
import SelectCancelModal from "@/components/CommonModal";
import CMSEditor from "@/components/CMSEditor";
import { useSearchParams } from "next/navigation";
import { PreviewResources, ResourceResponse } from "../preview-article/page";

interface SectionItem {
  id: string;
  type: "subtitle" | "text" | "image" | "subtext" | "caption";
  subTitle?: string;
  note?: string;
  imageUrl?: string;
  imageFile?: File;
  caption?: string;
}

interface Section {
  id: string;
  items: SectionItem[];
}

interface FormData {
  articleTitle: string | null;
  articleCategory: number[];
  thumbnailFile: string | null;
  sections: Section[];
  conclusionText: string | null;
  conclusionDescription: string | null;
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

// interface VideoUploadResponse {
//   data: {
//     success: boolean;
//     message: string;
//     data: {
//       filePath: string;
//     };
//   };
// }

interface AddResourcesResponse {
  data: {
    success: boolean;
    message: string;
  };
}

const schema: yup.ObjectSchema<FormData> = yup.object({
  conclusionText: yup.string().required("Required"),
  conclusionDescription: yup.string().required("Required"),
  articleTitle: yup.string().required("Required"),
  articleCategory: yup
    .array()
    .of(yup.number().typeError("Invalid number").required("Required"))
    .min(1, "Select at least 1 category")
    .max(3, "You can select maximum 3 categories")
    .required("Required"),
  thumbnailFile: yup.string().required("Thumbnail is required"),
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
                .oneOf(["subtitle", "text", "image", "subtext", "caption"])
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
              caption: yup.string().when("type", {
                is: "caption",
                then: (schema) => schema.required("This field is required"),
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

const AddNewArticle: React.FC = () => {
  const theme = useTheme();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { navigateWithLoading } = useRouterLoading();
  const [previewResourceData, setPreviewResourceData] =
    useState<PreviewResources | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const videoInputRef = useRef<HTMLInputElement>(null);
  // const [videoPreview, setVideoPreview] = useState<string | null>(null);
  // const [minutes, setMinutes] = useState<string | number | null>(null);
  // const [seconds, setSeconds] = useState<string | number | null>(null);
  // const [videoUploadLoading, setVideoUploadLoading] = useState<boolean>(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [thumbnailUploadLoading, setThumbnailUploadLoading] = useState(false);
  const [imageUploadLoading, setImageUploadLoading] = useState<
    Record<string, boolean>
  >({});
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  console.log(previewResourceData, "preview Resource data ==>");

  const videoCategoryOptions = [
    { label: "General Wellness", value: 1 },
    { label: "Emergency Care", value: 2 },
    { label: "Nutrition And Diet", value: 3 },
    { label: "Mental Health", value: 4 },
  ];

  useEffect(() => {
    if (id) {
      fetchSingleResourceData(id);
      // console.log("Resource ID:", id);
    }
  }, [id]);

  const fetchSingleResourceData = async (resourceId: string) => {
    setIsLoading(true);
    try {
      const response = (await getSingleResources(
        resourceId
      )) as ResourceResponse;
      if (response?.data?.success) {
        const resource = response.data.data;
        setPreviewResourceData(resource);
        localStorage.setItem("PreviewArticle", JSON.stringify(resource));

        // Populate form
        setValue("articleTitle", resource.title || "");
        setValue(
          "articleCategory",
          resource.category
            ?.map((cat: string) => {
              const found = videoCategoryOptions.find(
                (opt) => opt.label.toLowerCase() === cat.toLowerCase()
              );
              return found?.value ?? null;
            })
            .filter((val): val is number => val !== null) || []
        );

        setValue("thumbnailFile", resource.thumbnailUrl);
        setThumbnailPreview(resource.thumbnailUrl);

        setValue(
          "sections",
          resource.article?.map(
            (section: ArticleItem, sectionIndex: number) => {
              const items: SectionItem[] = [];
              if (section.subTitle)
                items.push({
                  id: `item-${Date.now()}-${sectionIndex}-1`,
                  type: "subtitle",
                  subTitle: section.subTitle,
                });
              if (section.text)
                items.push({
                  id: `item-${Date.now()}-${sectionIndex}-2`,
                  type: "text",
                  note: section.text,
                });
              if (section.subText)
                items.push({
                  id: `item-${Date.now()}-${sectionIndex}-3`,
                  type: "subtext",
                  subTitle: section.subText,
                });
              if (section.caption)
                items.push({
                  id: `item-${Date.now()}-${sectionIndex}-4`,
                  type: "caption",
                  caption: section.caption,
                });
              if (section.imageUrl)
                items.push({
                  id: `item-${Date.now()}-${sectionIndex}-5`,
                  type: "image",
                  imageUrl: section.imageUrl,
                });
              return { id: `section-${Date.now()}-${sectionIndex}`, items };
            }
          ) || []
        );

        if (resource.conclusion?.length > 0) {
          setValue("conclusionText", resource.conclusion[0].subTitle || "");
          setValue("conclusionDescription", resource.conclusion[0].text || "");
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const onModalClose = () => {
    setIsModalOpen(false);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch,
    trigger,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      conclusionText: "",
      conclusionDescription: "",
      articleTitle: "",
      articleCategory: [],
      thumbnailFile: null,
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

  // Add new item to a specific section, only if not already added
  const addItemToSection = (
    sectionIndex: number,
    itemType: "image" | "subtext" | "caption"
  ) => {
    const currentSections = getValues("sections");
    const targetSection = currentSections[sectionIndex];
    const existingItem = targetSection.items.find(
      (item) => item.type === itemType
    );
    if (existingItem) {
      return;
    }

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

  const handleThumbnailChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      toast.error("Thumbnail size should be less than 8MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    setThumbnailUploadLoading(true);

    try {
      const uploadData: FileUploadData = {
        file: file,
        fileName: file.name,
        fileType: file.type,
        moduleName: "article",
        documentType: "thumbnail",
      };

      const response = (await uploadFile(uploadData)) as FileUploadResponse;

      if (response?.data?.success) {
        const fullUrl = `${process.env.NEXT_PUBLIC_ASSETS_URL}/${response.data.data.filePath}`;
        setThumbnailPreview(fullUrl);
        onChange(fullUrl);
        toast.success("Thumbnail uploaded successfully");
      } else {
        toast.error("Failed to upload thumbnail");
      }
    } catch (error) {
      console.error("Thumbnail upload failed:", error);
      toast.error("Error uploading thumbnail");
    } finally {
      setThumbnailUploadLoading(false);
    }
  };

  const handleCreateClick = async () => {
    const isValid = await trigger();
    if (isValid) {
      setIsModalOpen(true);
    } else {
    }
  };

  const handlePreviewClick = async () => {
    const isValid = await trigger();
    if (isValid) {
      navigateWithLoading("/providers/resources/preview-article");
    } else {
    }
  };

  const onSubmit = async (data: FormData) => {
    console.log(data, "data ==>");
    try {
      const selectedCategories = videoCategoryOptions
        .filter((option) => data.articleCategory.includes(option.value))
        .map((option) => option.label);

      const payload = {
        title: data.articleTitle || "",
        category: selectedCategories || [],
        conclusion: [
          {
            subTitle: data.conclusionText || "",
            text: data.conclusionDescription || "",
          },
        ],
        // conclusionText: data.conclusionText || "",
        // conclusionDescription: data.conclusionDescription || "",
        // videoUrl: videoPreview || "",
        videoUrl: "",
        thumbnailUrl: thumbnailPreview || "",
        // isSrtAvailable: false,
        article: data.sections.map((section) => {
          const sectionObj: Record<string, string> = {};
          section.items.forEach((item) => {
            if (item.type === "subtitle")
              sectionObj.subTitle = item.subTitle || "";
            if (item.type === "text") sectionObj.text = item.note || "";
            if (item.type === "subtext")
              sectionObj.subText = item.subTitle || "";
            if (item.type === "caption")
              sectionObj.caption = item.caption || "";
            if (item.type === "image")
              sectionObj.imageUrl = item.imageUrl || "";
          });
          return sectionObj as ArticleItem;
        }),
      };

      console.log(payload, "payload");
      setIsModalOpen(false);
      const response = (await createProviderResources(
        payload
      )) as AddResourcesResponse;
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        navigateWithLoading("/providers/resources");
      }
    } catch (error) {
      console.error("Error while adding health videos:", error);
      toast.error("Failed add health videos.");
    }
  };

  const onApprove = handleSubmit((data) => {
    onSubmit(data);
  });

  return isLoading ? (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      height={"calc(100vh - 300px)"}
    >
      <CircularProgress size={30} />
    </Box>
  ) : (
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
                  {id ? "Edit article" : "Create New Article"}
                </Typography>
                <Typography variant="body1" fontWeight={400}>
                  Add all required text and images
                </Typography>
              </Box>
              <Stack flexDirection={"row"} gap={2}>
                <CommonButton
                  buttonText="Preview"
                  type="button"
                  onClick={handlePreviewClick}
                  sx={{
                    width: "max-content",
                    height: "45px",
                    backgroundColor: theme.pending.background.secondary,
                  }}
                  buttonTextStyle={{ fontSize: "14px" }}
                />
                <CommonButton
                  buttonText={id ? "Update article" : "Create Article"}
                  onClick={handleCreateClick}
                  // type="submit"
                  type="button"
                  // onClick={handleSubmit(onSubmit)}
                  sx={{ width: "max-content", height: "45px" }}
                  buttonTextStyle={{ fontSize: "14px" }}
                />
              </Stack>
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
                {id ? "Edit article" : "Create New Article"}
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
                Thumbnail image
              </Typography>

              <Box sx={{ mt: 3 }}>
                <Controller
                  name="thumbnailFile"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <Box>
                      <Paper
                        onClick={() =>
                          !thumbnailUploadLoading &&
                          videoInputRef.current?.click()
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
                          accept="image/*"
                          onChange={(e) => handleThumbnailChange(e, onChange)}
                          style={{ display: "none" }}
                        />

                        {thumbnailUploadLoading ? (
                          <CircularProgress size={30} color={"primary"} />
                        ) : thumbnailPreview ? (
                          <Image
                            src={thumbnailPreview}
                            alt="Thumbnail"
                            width={500}
                            height={330}
                            style={{ objectFit: "cover" }}
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
                              alt="Upload thumbnail"
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
                              Click here to upload thumbnail
                            </Typography>
                          </Box>
                        )}
                      </Paper>

                      {errors.thumbnailFile && (
                        <Typography
                          variant="body2"
                          color="error"
                          sx={{ mt: 1 }}
                        >
                          {errors.thumbnailFile?.message}
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
                              <CMSEditor
                                value={field.value || ""}
                                onChange={field.onChange}
                                placeholder="Please provide details..."
                                height={200}
                              />
                              // <CommonNoteCard
                              //   placeholder="Please provide details..."
                              //   value={field.value || ""}
                              //   onChange={field.onChange}
                              //   onBlur={field.onBlur}
                              //   name={field.name}
                              //   error={
                              //     !!errors.sections?.[sectionIndex]?.items?.[
                              //       itemIndex
                              //     ]?.note
                              //   }
                              //   helperText={
                              //     errors.sections?.[sectionIndex]?.items?.[
                              //       itemIndex
                              //     ]?.note?.message
                              //   }
                              //   rows={2}
                              //   maxLength={500}
                              //   showCharacterCount={true}
                              // />
                            )}
                          />
                          {errors.sections?.[sectionIndex]?.items?.[itemIndex]
                            ?.note && (
                            <Typography
                              variant="body2"
                              color="error"
                              sx={{ mt: 1 }}
                            >
                              {
                                errors.sections?.[sectionIndex]?.items?.[
                                  itemIndex
                                ]?.note?.message
                              }
                            </Typography>
                          )}
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
                              <CMSEditor
                                value={field.value || ""}
                                onChange={field.onChange}
                                placeholder="Please provide details..."
                                height={200}
                              />
                              // <CommonInput
                              //   fullWidth
                              //   placeholder="Enter sub-text"
                              //   value={field.value || ""}
                              //   onChange={field.onChange}
                              //   // {...field}
                              //   error={
                              //     !!errors.sections?.[sectionIndex]?.items?.[
                              //       itemIndex
                              //     ]?.subTitle
                              //   }
                              //   helperText={
                              //     errors.sections?.[sectionIndex]?.items?.[
                              //       itemIndex
                              //     ]?.subTitle?.message
                              //   }
                              //   sx={{
                              //     height: "50px",
                              //     "&.MuiOutlinedInput-root": {
                              //       border: `1px solid ${theme.pending.secondary}`,
                              //       padding: "5px",
                              //       "& .MuiOutlinedInput-notchedOutline": {
                              //         border: "none",
                              //       },
                              //       "&.Mui-error": {
                              //         border: `1px solid ${theme.declined.secondary}`,
                              //       },
                              //     },
                              //   }}
                              // />
                            )}
                          />
                          {errors.sections?.[sectionIndex]?.items?.[itemIndex]
                            ?.subTitle && (
                            <Typography
                              variant="body2"
                              color="error"
                              sx={{ mt: 1 }}
                            >
                              {
                                errors.sections?.[sectionIndex]?.items?.[
                                  itemIndex
                                ]?.subTitle?.message
                              }
                            </Typography>
                          )}
                        </Box>
                      )}

                      {item.type === "caption" && (
                        <Box>
                          <Typography variant="body1" fontSize={"16px"} mb={1}>
                            Add caption
                          </Typography>
                          <Controller
                            name={`sections.${sectionIndex}.items.${itemIndex}.caption`}
                            control={control}
                            render={({ field }) => (
                              <CMSEditor
                                value={field.value || ""}
                                onChange={field.onChange}
                                placeholder="Please provide details..."
                                height={200}
                              />
                              // <CommonInput
                              //   fullWidth
                              //   placeholder="Enter sub-text"
                              //   value={field.value || ""}
                              //   onChange={field.onChange}
                              //   // {...field}
                              //   error={
                              //     !!errors.sections?.[sectionIndex]?.items?.[
                              //       itemIndex
                              //     ]?.caption
                              //   }
                              //   helperText={
                              //     errors.sections?.[sectionIndex]?.items?.[
                              //       itemIndex
                              //     ]?.caption?.message
                              //   }
                              //   sx={{
                              //     height: "50px",
                              //     "&.MuiOutlinedInput-root": {
                              //       border: `1px solid ${theme.pending.secondary}`,
                              //       padding: "5px",
                              //       "& .MuiOutlinedInput-notchedOutline": {
                              //         border: "none",
                              //       },
                              //       "&.Mui-error": {
                              //         border: `1px solid ${theme.declined.secondary}`,
                              //       },
                              //     },
                              //   }}
                              // />
                            )}
                          />
                          {errors.sections?.[sectionIndex]?.items?.[itemIndex]
                            ?.caption && (
                            <Typography
                              variant="body2"
                              color="error"
                              sx={{ mt: 1 }}
                            >
                              {
                                errors.sections?.[sectionIndex]?.items?.[
                                  itemIndex
                                ]?.caption?.message
                              }
                            </Typography>
                          )}
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
                  <Box>
                    <CommonButton
                      buttonText="Add caption"
                      onClick={() => addItemToSection(sectionIndex, "caption")}
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

        <Box mt={3}>
          <CommonCard>
            {/* <Stack
              flexDirection={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            > */}
            <Typography variant="body1" fontSize={"18px"}>
              Conclusion Section
            </Typography>
            {/* </Stack> */}
            <Box mt={2}>
              <Controller
                name="conclusionText"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    label=""
                    placeholder="Enter article title"
                    error={!!errors.conclusionText}
                    helperText={errors.conclusionText?.message}
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
                    {...field}
                  />
                )}
              />
            </Box>
            <Box mt={2}>
              <Controller
                name={`conclusionDescription`}
                control={control}
                render={({ field }) => (
                  <CMSEditor
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Please provide details..."
                    height={200}
                  />
                  // <CommonNoteCard
                  //   placeholder="Please provide details..."
                  //   value={field.value || ""}
                  //   onChange={field.onChange}
                  //   onBlur={field.onBlur}
                  //   name={field.name}
                  //   error={!!errors?.conclusionDescription}
                  //   helperText={errors?.conclusionDescription?.message}
                  //   rows={2}
                  //   maxLength={500}
                  //   showCharacterCount={true}
                  // />
                )}
              />
              {errors.conclusionDescription && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  {errors.conclusionDescription.message}
                </Typography>
              )}
            </Box>
          </CommonCard>
        </Box>
        <SelectCancelModal
          title="Create article"
          question="Are you sure the article is complete"
          buttonText="Done"
          isOpen={isModalOpen}
          onClose={onModalClose}
          onRemove={onApprove}
        />
      </form>
    </Box>
  );
};

export default AddNewArticle;
