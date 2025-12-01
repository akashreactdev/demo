"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import { CircularProgress, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import CommonButton from "@/components/CommonButton";
import moment from "moment";
import CommonChip from "@/components/CommonChip";
import { getSingleResources } from "@/services/api/supportApi";
import { useRouterLoading } from "@/hooks/useRouterLoading";

// const article: PreviewResources = {
//   _id: "1",
//   title: "React js Development",
//   category: ["frontend", "node"],
//   thumbnailUrl:
//     "https://dev-zorbee.s3.eu-west-2.amazonaws.com/image/healthVideos/thumbnail/image.jpg-67742b48-af12-487e-9cef-1e4908c97c6b-688a0d31b3e801b15d509b5c.jpg",
//   article: [
//     {
//       subTitle: "Introduction",
//       text: `Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam suspendisse morbi eleifend faucibus eget vestibulum felis. Dictum quis montes, sit sit. Tellus aliquam enim urna, etiam. Mauris posuere vulputate arcu amet, vitae nisi, tellus tincidunt. At feugiat sapien varius id.

// Eget quis mi enim, leo lacinia pharetra, semper. Eget in volutpat mollis at volutpat lectus velit, sed auctor. Porttitor fames arcu quis fusce augue enim. Quis at habitant diam at. Suscipit tristique risus, at donec. In turpis vel et quam imperdiet. Ipsum molestie aliquet sodales id est ac volutpat. `,
//       subText: `Dolor enim eu tortor urna sed duis nulla. Aliquam vestibulum, nulla odio nisl vitae. In aliquet pellentesque aenean hac vestibulum turpis mi bibendum diam. Tempor integer aliquam in vitae malesuada fringilla.

// Elit nisi in eleifend sed nisi. Pulvinar at orci, proin imperdiet commodo consectetur convallis risus. Sed condimentum enim dignissim adipiscing faucibus consequat, urna. Viverra purus et erat auctor aliquam. Risus, volutpat vulputate posuere purus sit congue convallis aliquet. Arcu id augue ut feugiat donec porttitor neque. Mauris, neque ultricies eu vestibulum, bibendum quam lorem id. Dolor lacus, eget nunc lectus in tellus, pharetra, porttitor.

// Ipsum sit mattis nulla quam nulla. Gravida id gravida ac enim mauris id. Non pellentesque congue eget consectetur turpis. Sapien, dictum molestie sem tempor. Diam elit, orci, tincidunt aenean tempus. Quis velit eget ut tortor tellus. Sed vel, congue felis elit erat nam nibh orci.`,
//       imageUrl:
//         "https://dev-zorbee.s3.eu-west-2.amazonaws.com/image/healthVideos/thumbnail/download (2).jpeg-d7d5f34b-c3f2-47fb-8b11-b1abf927892b-688a0d31b3e801b15d509b5c.jpg",
//       caption: `“In a world older and more complete than ours they move finished and complete, gifted with extensions of the senses we have lost or never attained, living by voices we shall never hear.”
      
//       — Olivia Rhye, Meditation`,
//     },
//     {
//       subTitle: "Software and tools",
//       text: `Pharetra morbi libero id aliquam elit massa integer tellus. Quis felis aliquam ullamcorper porttitor. Pulvinar ullamcorper sit dictumst ut eget a, elementum eu. Maecenas est morbi mattis id in ac pellentesque ac.`,
//     },
//     {
//       subTitle: "Other resources",
//       text: `Sagittis et eu at elementum, quis in. Proin praesent volutpat egestas sociis sit lorem nunc nunc sit. Eget diam curabitur mi ac. Auctor rutrum lacus malesuada massa ornare et. Vulputate consectetur ac ultrices at diam dui eget fringilla tincidunt. Arcu sit dignissim massa erat cursus vulputate gravida id. Sed quis auctor vulputate hac elementum gravida cursus dis.

// 1. Lectus id duis vitae porttitor enim gravida morbi.
// 2. Eu turpis posuere semper feugiat volutpat elit, ultrices suspendisse. Auctor vel in vitae placerat.
// 3. Suspendisse maecenas ac donec scelerisque diam sed est duis purus.`,
//       imageUrl:
//         "https://dev-zorbee.s3.eu-west-2.amazonaws.com/image/healthVideos/thumbnail/premium_photo-1664474619075-644dd191935f.jpeg-3ae949b1-d132-4024-b66a-0527a8cf7507-688a0d31b3e801b15d509b5c.jpg",
//       subText: `Lectus leo massa amet posuere. Malesuada mattis non convallis quisque. Libero sit et imperdiet bibendum quisque dictum vestibulum in non. Pretium ultricies tempor non est diam. Enim ut enim amet amet integer cursus. Sit ac commodo pretium sed etiam turpis suspendisse at.
        
// Tristique odio senectus nam posuere ornare leo metus, ultricies. Blandit duis ultricies vulputate morbi feugiat cras placerat elit. Aliquam tellus lorem sed ac. Montes, sed mattis pellentesque suscipit accumsan. Cursus viverra aenean magna risus elementum faucibus molestie pellentesque. Arcu ultricies sed mauris vestibulum.`,
//     },
//   ],
//   conclusion: [
//     {
//       subTitle: "Conclusion",
//       text: `Morbi sed imperdiet in ipsum, adipiscing elit dui lectus. Tellus id scelerisque est ultricies ultricies. Duis est sit sed leo nisl, blandit elit sagittis. Quisque tristique consequat quam sed. Nisl at scelerisque amet nulla purus habitasse.
// Nunc sed faucibus bibendum feugiat sed interdum. Ipsum egestas condimentum mi massa. In tincidunt pharetra consectetur sed duis facilisis metus. Etiam egestas in nec sed et. Quis lobortis at sit dictum eget nibh tortor commodo cursus.

// Odio felis sagittis, morbi feugiat tortor vitae feugiat fusce aliquet. Nam elementum urna nisi aliquet erat dolor enim. Ornare id morbi eget ipsum. Aliquam senectus neque ut id eget consectetur dictum. Donec posuere pharetra odio consequat scelerisque et, nunc tortor.

// Nulla adipiscing erat a erat. Condimentum lorem posuere gravida enim posuere cursus diam.`,
//     },
//   ],
//   createdAt: "2025-09-26T10:45:00.557Z",
// };

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

  // useEffect(() => {
  //   setPreviewResourceData(article);
  // }, []);

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
          onClick={() =>
            navigateWithLoading(
              `/providers/resources/create-new-article?id=${id}`
            )
          }
          buttonTextStyle={{ fontSize: "14px" }}
        />
        <CommonButton
          buttonText="Create Article"
          type="button"
          onClick={() =>
            navigateWithLoading("/providers/resources/create-new-article")
          }
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
        <Box p={3}>
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
                  whiteSpace={"pre-line"}
                >
                  {doc.text}
                </Typography>
              )}
              {doc.imageUrl && (
                <Box p={3}>
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
                    whiteSpace={"pre-line"}
                  >
                    {doc.caption}
                  </Typography>
                </Box>
              )}
              {doc.subText && (
                <Typography
                  variant="body1"
                  fontSize="18px"
                  mb={2}
                  whiteSpace={"pre-line"}
                >
                  {doc.subText}
                </Typography>
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
                  whiteSpace={"pre-line"}
                >
                  {doc.text}
                </Typography>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default PreviewArticle;
