"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
//relative path imports
import CMSEditor from "@/components/CMSEditor";
import CommonCard from "@/components/Cards/Common";
import CommonButton from "@/components/CommonButton";
import { getSingleCms, updateCms } from "@/services/api/cmsApi";
import { useRouterLoading } from "@/hooks/useRouterLoading";

interface cmsData {
  success: boolean;
  message: string;
  _id?: number;
  title?: string;
  description?: string;
  alias?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

interface singleCmsResponse {
  data: {
    success: boolean;
    message: string;
    data: cmsData;
  };
}

export interface UpdateCmsPayload {
  description: string | null;
  termsId: string | number | null;
}

interface updateCmsresponse {
  data: {
    success: boolean;
    message: string;
  };
}

const CmsEditPage = () => {
  const theme = useTheme();
const { navigateWithLoading } = useRouterLoading();
  const searchParams = useSearchParams();
  const alias = searchParams.get("alias");
  const title = searchParams.get("title");
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [singleCmsData, setSingleCmsData] = useState<cmsData | null>(null);
  const [editorContent, setEditorContent] = useState<string>("");

  useEffect(() => {
    if (title && alias) {
      fetchSingleCms(title, alias);
    }
  }, [title, alias]);

  useEffect(() => {
    if (singleCmsData?.description) {
      setEditorContent(singleCmsData.description);
    }
  }, [singleCmsData]);

  const fetchSingleCms = async (title: string, alias: string) => {
    try {
      const response = (await getSingleCms(title, alias)) as singleCmsResponse;
      if (response?.data?.success) {
        setSingleCmsData(response.data.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const saveCmsData = async () => {
    try {
      const payload: UpdateCmsPayload = {
        description: editorContent,
        termsId: singleCmsData?._id ?? null,
      };
      const response = (await updateCms(payload)) as updateCmsresponse;
      if (response?.data?.success) {
        toast.success(response?.data?.message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const saveCms = () => {
    saveCmsData();
    setTimeout(() => {
      navigateWithLoading("/settings/cms");
    }, 100);
  };

  return (
    <>
      <CommonCard>
        <Stack
          direction={isMobile ? "column" : "row"}
          alignItems={isMobile ? "flex-start" : "center"}
          justifyContent={"flex-end"}
          spacing={isMobile ? 2 : 2}
        >
          <CommonButton
            buttonText="Cancel"
            sx={{ backgroundColor: "#E2E6EB", maxWidth: "80px" }}
            buttonTextStyle={{ fontSize: "14px" }}
            onClick={() => navigateWithLoading("/settings/cms")}
          />
          <CommonButton
            buttonText="Save"
            sx={{ maxWidth: isMobile ? "100%" : "max-content" }}
            buttonTextStyle={{ fontSize: "14px !important" }}
            onClick={saveCms}
          />
        </Stack>
      </CommonCard>
      <Box mt={3}>
        <CMSEditor value={editorContent} onChange={setEditorContent} />
      </Box>
    </>
  );
};

export default CmsEditPage;
