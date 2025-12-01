"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import { CircularProgress, Divider, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import CommonButton from "@/components/CommonButton";
import moment from "moment";
import CommonChip from "@/components/CommonChip";
import {
  createProviderResources,
  getSingleResources,
  // getSingleResources,
  updateProviderResources,
} from "@/services/api/supportApi";
import { useRouterLoading } from "@/hooks/useRouterLoading";
import { toast } from "react-toastify";
import SelectCancelModal from "@/components/CommonModal";
import { AddResourcesResponse } from "../create-new-article/page";

export interface ArticleItem {
  subTitle: string;
  text: string;
  subText?: string;
  caption?: string;
  imageUrl?: string;
}

export interface ConclusionItem {
  subTitle: string;
  text: string;
}

export interface PreviewResources {
  _id: string;
  title: string;
  category: string[];
  thumbnailUrl: string;
  article: ArticleItem[];
  conclusion: ConclusionItem[];
  status?: number;
  totalViews?: number;
  uniqueViews?: number;
  createdAt: string;
  updatedAt?: string;
  userType?: number[] | null;
  __v?: number;
}

export interface ResourceResponse {
  data: {
    success: boolean;
    message: string;
    data: PreviewResources;
  };
}

const PreviewArticle: React.FC = () => {
  const theme = useTheme();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { navigateWithLoading } = useRouterLoading();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [previewResourceData, setPreviewResourceData] =
    useState<PreviewResources | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const onModalClose = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (id) {
      fetchSingleResourceData(id);
    } else {
      const previewData = localStorage.getItem("PreviewArticle");
      setIsLoading(true);
      if (previewData) {
        try {
          setIsLoading(false);
          const parsedData: PreviewResources = JSON.parse(previewData);
          setPreviewResourceData(parsedData);
        } catch (err) {
          console.error("Error parsing PreviewArticle from localStorage:", err);
        }
      }
    }
  }, [id]);

  const fetchSingleResourceData = async (resourceId: string) => {
    setIsLoading(true);
    try {
      const response = (await getSingleResources(
        resourceId
      )) as ResourceResponse;
      if (response?.data?.success) {
        localStorage.setItem(
          "PreviewArticle",
          JSON.stringify(response?.data?.data)
        );
        setPreviewResourceData(response?.data?.data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const onApprove = async () => {
    try {
      const payload = {
        _id: previewResourceData?._id,
        title: previewResourceData?.title || "",
        category: previewResourceData?.category || [],
        userType: previewResourceData?.userType || [],
        conclusion: previewResourceData?.conclusion || [],
        videoUrl: "",
        thumbnailUrl: previewResourceData?.thumbnailUrl || "",
        article: previewResourceData?.article || [],
      };
      // console.log(payload, " payload ==>");
      // setIsModalOpen(false);

      console.log(payload, "payload");
      setIsModalOpen(false);

      let response;

      if (id) {
        console.log("update article");
        response = (await updateProviderResources(
          id,
          payload
        )) as AddResourcesResponse;
      } else {
        console.log("add article");

        response = (await createProviderResources(
          payload
        )) as AddResourcesResponse;
      }

      if (response?.data?.success) {
        toast.success(response?.data?.message);
        navigateWithLoading("/support/resources");
      }
    } catch (error) {
      console.error("Error while saving article:", error);
      toast.error("Failed to save article.");
    }
  };

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
      <Stack
        flexDirection={"row"}
        justifyContent={"end"}
        alignItems={"center"}
        gap={2}
        pt={0}
        mr={3}
      >
        <CommonButton
          buttonText="Edit"
          type="button"
          sx={{
            width: "max-content",
            height: "45px",
            backgroundColor: theme.pending.background.secondary,
          }}
          onClick={() => {
            if (id) {
              navigateWithLoading(
                `/support/resources/create-new-article?id=${id}`
              );
            } else {
              navigateWithLoading(`/support/resources/create-new-article`);
            }
          }}
          buttonTextStyle={{ fontSize: "14px" }}
        />
        <CommonButton
          buttonText={id ? "Update article" : "Create Article"}
          type="button"
          onClick={() => setIsModalOpen(true)}
          sx={{ width: "max-content", height: "45px" }}
          buttonTextStyle={{ fontSize: "14px" }}
        />
      </Stack>
      <Box mt={3}>
        <Typography variant="h1" fontWeight={500} fontSize={"56px"}>
          {previewResourceData?.title || "N/A"}
        </Typography>
        <Typography variant="body1">
          Created:{" "}
          {moment(previewResourceData?.createdAt).format("Do MMMM YYYY")}
        </Typography>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="start"
          sx={{ height: "100%" }}
        >
          {previewResourceData?.category &&
            previewResourceData?.category.length > 0 && (
              <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
                {previewResourceData?.category.map((c) => (
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
        </Box>
        <Box paddingBlock={3}>
          <img
            src={
              previewResourceData?.thumbnailUrl
                ? `${previewResourceData.thumbnailUrl}`
                : "/assets/images/video-image.jpg"
            }
            alt="Video Thumbnail"
            // fill
            style={{
              objectFit: "cover",
              borderRadius: "16px",
              height: "610px",
              width: "100%",
            }}
          />
        </Box>
        <Divider sx={{marginBottom : 2}} />
        {previewResourceData?.article?.map((doc, idx) => {
          return (
            <Box key={doc.subTitle} id={`article-section-${idx}`}>
              <Typography
                variant="body1"
                fontSize={"24px"}
                fontWeight={500}
                mb={2}
              >
                {doc.subTitle || "N/A"}
              </Typography>
              {doc.text && (
                <Typography
                  variant="body1"
                  fontSize="18px"
                  mb={2}
                  dangerouslySetInnerHTML={{ __html: doc.text }}
                />
              )}
              {doc.imageUrl && (
                <Box paddingBlock={3}>
                  <img
                    src={
                      doc.imageUrl
                        ? `${doc.imageUrl}`
                        : "/assets/images/video-image.jpg"
                    }
                    alt="Video Thumbnail"
                    // fill
                    style={{
                      objectFit: "cover",
                      borderRadius: "16px",
                      height: "610px",
                      width: "100%",
                    }}
                  />
                </Box>
              )}
              {doc.caption && (
                <Box
                  borderLeft={`2px solid ${theme.pending.main}`}
                  pl={2}
                  mb={2}
                >
                  <Typography
                    variant="body1"
                    fontSize="18px"
                    mb={2}
                    dangerouslySetInnerHTML={{ __html: doc.caption }}
                  />
                </Box>
              )}
              {doc.subText && (
                <Typography
                  variant="body1"
                  fontSize="18px"
                  mb={2}
                  dangerouslySetInnerHTML={{ __html: doc.subText }}
                />
              )}
            </Box>
          );
        })}
        {previewResourceData?.conclusion?.map((doc, idx) => {
          return (
            <Box
              key={doc.subTitle}
              id={`conclusion-section-${idx}`}
              sx={{
                padding: "32px 40px",
                borderRadius: "16px",
                backgroundColor: theme.inProgress.background.primary,
              }}
            >
              <Typography
                variant="body1"
                fontSize={"24px"}
                fontWeight={500}
                mb={2}
              >
                {doc.subTitle || "N/A"}
              </Typography>
              {doc.text && (
                <Typography
                  variant="body1"
                  fontSize="18px"
                  mb={2}
                  dangerouslySetInnerHTML={{ __html: doc.text }}
                />
              )}
            </Box>
          );
        })}
      </Box>
      <SelectCancelModal
        title={id ? "Update article" : "Create Article"}
        question="Are you sure the article is complete"
        buttonText="Done"
        isOpen={isModalOpen}
        onClose={onModalClose}
        onRemove={onApprove}
      />
    </Box>
  );
};

export default PreviewArticle;
