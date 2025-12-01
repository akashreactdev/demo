"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import CommonCard from "@/components/Cards/Common";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
// Import Yup and react-hook-form
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CommonButton from "@/components/CommonButton";
import CommonInput from "@/components/CommonInput";
import { CircularProgress } from "@mui/material";
import { useRouterLoading } from "@/hooks/useRouterLoading";
import SelectCancelModal from "@/components/CommonModal";
import CMSEditor from "@/components/CMSEditor";
import CommonSelect from "@/components/CommonSelect";
import { createProviderFAQ } from "@/services/api/supportApi";

interface FormData {
  question: string | null;
  answer: string | null;
  userType: number | null;
}

const UserTypeOptions = [
  { label: "All", value: 1 },
  { label: "Users", value: 2 },
  { label: "Carers", value: 3 },
  { label: "Clinicals", value: 4 },
  { label: "Providers", value: 5 },
];


interface AddResourcesResponse {
  data: {
    success: boolean;
    message: string;
  };
}

const schema: yup.ObjectSchema<FormData> = yup.object({
  question: yup.string().required("Required"),
  answer: yup.string().required("Required"),
  userType: yup
    .number()
    .typeError("Please select a user type")
    .required("Required"),
});

const AddNewFAQ: React.FC = () => {
  const theme = useTheme();
    const { navigateWithLoading } = useRouterLoading();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const onModalClose = () => {
    setIsModalOpen(false);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      question: "",
      answer: "",
      userType: null,
    },
  });

  const handleCreateClick = async () => {
    const isValid = await trigger();
    if (isValid) {
      setIsModalOpen(true);
    } else {
    }
  };

  const onSubmit = async (data: FormData) => {
    console.log(data, "data ==>");
    try {
      let userTypeArray: number[] = [];

      if (data.userType === 1) {
        userTypeArray = [2, 3, 4, 5];
      } else if (data.userType) {
        userTypeArray = [data.userType];
      }
      const payload = {
        question: data.question || "",
        answer: data.answer || "",
        userType: userTypeArray,
      };

      console.log(payload, "payload");
      setIsModalOpen(false);
        const response = (await createProviderFAQ(
          payload
        )) as AddResourcesResponse;
        if (response?.data?.success) {
          toast.success(response?.data?.message);
          navigateWithLoading("/support/resources");
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
                  Add FAQ
                </Typography>
                <Typography variant="body1" fontWeight={400}>
                  Add all required text and images
                </Typography>
              </Box>
              <Stack flexDirection={"row"} gap={2}>
                <CommonButton
                  buttonText="Done"
                  onClick={handleCreateClick}
                  // type="submit"
                  type="button"
                  sx={{ width: "max-content", height: "45px" }}
                  buttonTextStyle={{ fontSize: "14px" }}
                />
              </Stack>
            </Stack>
          </CommonCard>
        </Box>

        <Box mt={3}>
          <CommonCard>
            <Typography variant="body1" fontSize={"16px"}>
              Add FAQ
            </Typography>
            <Box mt={3}>
              <Controller
                name={`question`}
                control={control}
                render={({ field }) => (
                  <CommonInput
                    fullWidth
                    placeholder="Add question"
                    {...field}
                    error={!!errors.question}
                    value={field.value || ""}
                    onChange={field.onChange}
                    helperText={errors.question?.message}
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

            <Box mt={3}>
              <Controller
                name={`answer`}
                control={control}
                render={({ field }) => (
                  <CMSEditor
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Please provide details..."
                    height={200}
                  />
                )}
              />
              {errors.answer && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  {errors.answer?.message}
                </Typography>
              )}
            </Box>
          </CommonCard>
        </Box>

        <Box mt={3}>
          <CommonCard>
            <Box>
              <Controller
                name="userType"
                control={control}
                render={({ field }) => (
                  <CommonSelect
                    label="Resource section"
                    placeholder="Please select"
                    value={field.value}
                    onChange={(val) => field.onChange(val)}
                    options={UserTypeOptions}
                    helperText={errors.userType?.message}
                    error={!!errors.userType}
                    sx={{
                      width: "40%",
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
        </Box>

        <SelectCancelModal
          title="Create faq"
          question="Are you sure the faq is complete"
          buttonText="Done"
          isOpen={isModalOpen}
          onClose={onModalClose}
          onRemove={onApprove}
        />
      </form>
    </Box>
  );
};

export default AddNewFAQ;
