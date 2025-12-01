"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  CircularProgress,
  Grid2,
  Typography,
  useMediaQuery,
  Menu,
  MenuItem,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import moment from "moment";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import Image from "next/image";
//relative path imports
import CommonCard from "@/components/Cards/Common";
import KeyValueDetails from "@/components/Cards/KeyValueDetails";
import CommonNoteCard from "@/components/CommonNoteCard";
import CommonAttachmentCard from "@/components/CommonAttachmentCard";
import CommonButton from "@/components/CommonButton";
import CommonGetHelpCard from "@/components/CommonGetHelpCard";
import {
  assignSupportToUser,
  getAllAdminList,
  getSupportInfo,
  sendMail,
  updateSupport,
} from "@/services/api/supportApi";
import CMSEditor from "@/components/CMSEditor";
import CommonInput from "@/components/CommonInput";
import { IssueType, UrgencyLevel } from "@/constants/supportData";
import { useRouterLoading } from "@/hooks/useRouterLoading";
import IconButton from "@mui/material/IconButton";
import MoreVertSharpIcon from "@mui/icons-material/MoreVertSharp";
import SupportMessageModal from "@/components/SupportMessageModal";
import {
  AdminList,
  AdminListOptions,
  AdminListResponse,
} from "@/app/(main)/support/carer/page";
import SelectModal from "@/components/CommonSelectModal";

interface ParamsProps {
  id: string;
}

interface CarerUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface NewMessage {
  subject: string;
  email: string;
  message: string;
  createdAt: string;
  _id: string;
  userId: {
    email: string;
    firstName: string;
    lastName: string;
    _id: string;
  };
}

interface CarerSupportProfile {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  ticketType: string | null;
  description: string;
  urgencyLevel: number;
  userType: number;
  attachments: string[];
  status: number;
  ticketId: string;
  newMessage: NewMessage[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  user: CarerUser;
}

interface CarerSupportProfileResponse {
  data: {
    success: boolean;
    data: CarerSupportProfile;
  };
}

interface FormData {
  recipient: string | null;
  subject: string | null;
  message: string;
}

interface SendMessageResponse {
  data: {
    success: boolean;
    message: string;
  };
}

interface StatusChangeResponse {
  data: {
    success: boolean;
    message: string;
  };
}

const schema: yup.ObjectSchema<FormData> = yup.object({
  recipient: yup
    .string()
    .required("Required")
    .email("Enter a valid email address"),
  subject: yup.string().required("Required"),
  message: yup.string().required("Required"),
});

const UserProfile = () => {
  const [message, setMessage] = useState(false);
  const theme = useTheme();
  const { navigateWithLoading } = useRouterLoading();
  const params = useParams() as unknown as ParamsProps;
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedMail, setSelectedMail] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [carerSupportProfileData, setCarerSupoortProfileData] =
    useState<CarerSupportProfile>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [messageModalOpen, setMessageModalOpen] = useState<boolean>(false);
  const [adminList, setAdminList] = useState<AdminListOptions[]>([]);
  const [adminId, setAdminId] = useState<string | number | null>(null);
  const [assignModalOpen, setAssignModalOpen] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      recipient: carerSupportProfileData?.userEmail,
      subject: "",
      message: "",
    },
  });

  useEffect(() => {
    if (params?.id) {
      fetchSingleUserInfo(params?.id);
      fetchAdminList();
    }
  }, [params?.id]);

  const fetchAdminList = async () => {
    try {
      const response = (await getAllAdminList()) as AdminListResponse;
      if (response?.data?.success) {
        const convertedOptions = response?.data?.data?.map(
          (item: AdminList, index) => ({
            label: `${item.firstName} ${item.lastName}`,
            id: item._id,
            value: index + 1,
          })
        );

        setAdminList(convertedOptions);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const fetchSingleUserInfo = async (id: string) => {
    setIsLoading(true);
    try {
      const response = (await getSupportInfo(
        id
      )) as CarerSupportProfileResponse;
      if (response?.data?.success) {
        setIsLoading(false);
        setCarerSupoortProfileData(response?.data?.data);
        setValue("recipient", response?.data?.data?.userEmail);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const Issue_overview = useMemo(() => {
    return [
      {
        label: "Name",
        value: carerSupportProfileData?.userName || "N/A",
      },
      {
        label: "Email",
        value: carerSupportProfileData?.userEmail || "N/A",
      },
      {
        label: "Issue type",
        value:
          typeof carerSupportProfileData?.ticketType === "number"
            ? IssueType[carerSupportProfileData.ticketType]
            : IssueType[7],
      },
      {
        label: "Urgency level",
        value:
          typeof carerSupportProfileData?.urgencyLevel === "number"
            ? UrgencyLevel[carerSupportProfileData.urgencyLevel]
            : "N/A",
      },
      {
        label: "Ticket Number",
        value: carerSupportProfileData?.ticketId || "N/A",
      },
    ];
  }, [carerSupportProfileData]);

  const dbsDocuments = useMemo(() => {
    return (
      carerSupportProfileData?.attachments?.map((doc) => {
        if (!doc) return { title: "N/A", url: "N/A" };
        const fullPath = doc;
        const lastSegment = fullPath.split("/document/").pop() || "";
        const match = lastSegment.match(/^(.+?\.[a-zA-Z0-9]{2,5})/);
        const cleanFilename = match ? match[1] : lastSegment;
        return {
          title:
            cleanFilename.length > 30
              ? cleanFilename.slice(0, 30) + "..."
              : cleanFilename,
          url: doc || "N/A",
          // isApproved: doc,
        };
      }) || []
    );
  }, [carerSupportProfileData]);

  const handleSendMessage = async (data: FormData) => {
    try {
      const payload = {
        email: data?.recipient,
        subject: data?.subject,
        message: data?.message,
        supportId: params?.id,
      };
      const response = (await sendMail(payload)) as SendMessageResponse;
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        setMessageModalOpen(false);
        setMessage(false);
        setValue("subject", "");
        setValue("recipient", "");
        setValue("message", "");
        setTimeout(() => {
          fetchSingleUserInfo(params?.id);
        }, 500);
      }
    } catch (error) {
      console.error("error:", error);
    }
  };

  const handleStatusChange = async (status: number) => {
    try {
      const payload = {
        supportId: params?.id,
        status: status,
      };
      const response = (await updateSupport(payload)) as StatusChangeResponse;
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        navigateWithLoading("/support/user");
      }
    } catch (error) {
      console.error("error:", error);
    }
  };

  const handleActionClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleActionItemClick = (index: number) => {
    if (index === 0) {
      setAssignModalOpen(true);
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const messageModalClose = () => {
    setMessageModalOpen(false);
  };

  const handleEventClose = () => {
    setAssignModalOpen(false);
    setAdminId(null);
    handleClose();
  };

  const handleEventSet = async () => {
    try {
      const payload = {
        supportId: params?.id,
        userId: adminId,
      };
      const response = (await assignSupportToUser(
        payload
      )) as AdminListResponse;
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        handleEventClose();
        handleClose();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleEventChange = (value: string | number | null) => {
    if (value !== null) {
      const selectedAdmin = adminList.find((item) => item.value === value);
      if (selectedAdmin) {
        setAdminId(selectedAdmin.id);
      }
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
      {/* <Box
        sx={{
          display: "flex",
          justifyContent: isMobile ? "space-between" : "end",
          gap: isMobile ? 1 : 3,
        }}
      >
        {carerSupportProfileData?.status != 3 && (
          <Typography
            sx={{
              background: "#ECF2FB",
              color: "#518ADD",
              fontSize: "15px",
              padding: isMobile ? "12px" : "20px",
              borderRadius: "8px",
              border: "none",
            }}
            component={"button"}
            disabled={carerSupportProfileData?.status === 2}
            onClick={() => handleStatusChange(2)}
          >
            {carerSupportProfileData?.status === 2
              ? "In-progess"
              : "Mark as in-progress"}
          </Typography>
        )}
        <Typography
          sx={{
            background: "#C8E4C0",
            color: "#6A9F69",
            fontSize: "15px",
            padding: isMobile ? "12px" : "20px",
            borderRadius: "8px",
            border: "none",
          }}
          component={"button"}
          disabled={carerSupportProfileData?.status === 3}
          onClick={() => handleStatusChange(3)}
        >
          {carerSupportProfileData?.status === 3
            ? "Resolved"
            : "Mark as resolved"}
        </Typography>
      </Box> */}

      <Box>
        <CommonCard
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", md: "flex-start" },
            gap: { xs: 2, md: 0 },
            padding: { xs: 2, md: 3 },
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight={500}>
              {carerSupportProfileData?.userName} support ticket
            </Typography>
            <Typography mt={1} fontSize={"12px"}>
              This support ticket was logged by{" "}
              {carerSupportProfileData?.userName}. Please review the details and
              take necessary action to resolve the issue.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1.5, sm: 2 },
            }}
          >
            {carerSupportProfileData?.status != 3 && (
              <Typography
                sx={{
                  background: "#ECF2FB",
                  color: "#518ADD",
                  fontSize: "14px",
                  padding: isMobile ? "12px" : "15px",
                  borderRadius: "8px",
                  border: "none",
                }}
                component={"button"}
                disabled={carerSupportProfileData?.status === 2}
                onClick={() => handleStatusChange(2)}
              >
                {carerSupportProfileData?.status === 2
                  ? "In-progress"
                  : "Mark as in-progress"}
              </Typography>
            )}

            <CommonButton
              buttonText="Mark as verified"
              sx={{
                padding: "10px 16px",
                width: { xs: "auto", sm: "auto" },
                minWidth: { sm: "140px" },
              }}
              onClick={() => handleStatusChange(3)}
              buttonTextStyle={{
                fontSize: "14px",
                fontWeight: "500",
              }}
            />
            <IconButton onClick={(event) => handleActionClick(event)}>
              <MoreVertSharpIcon
                style={{ color: theme.palette.common.black }}
              />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  border: "1px solid #E2E6EB",
                  borderRadius: "10px",
                },
              }}
            >
              {["Assign ticket"].map((action, index) => (
                <MenuItem
                  key={index}
                  onClick={() => handleActionItemClick(index)}
                >
                  {action}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </CommonCard>
      </Box>

      <Box mt={3}>
        <Grid2 container spacing={2}>
          <Grid2 size={{ md: 6, sm: 12, xs: 12, lg: 6, xl: 6 }}>
            <Box>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Issue overview
                </Typography>

                <Box mt={2}>
                  <KeyValueDetails items={Issue_overview} />
                </Box>
              </CommonCard>
            </Box>
          </Grid2>
          <Grid2 size={{ md: 6, sm: 12, xs: 12, lg: 6, xl: 6 }}>
            <Box>
              <CommonCard>
                <CommonNoteCard
                  title="Issue description"
                  rows={1}
                  value={carerSupportProfileData?.description}
                />
              </CommonCard>
            </Box>
            <Box mt={2}>
              <CommonAttachmentCard documents={dbsDocuments} />
            </Box>
          </Grid2>
        </Grid2>

        <Box mt={3}>
          <CommonCard>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="h6" fontWeight={500}>
                  Messaging
                </Typography>
                <Typography variant="body1" fontSize={"12px"}>
                  Shared communication with the user
                </Typography>
              </Box>
              <CommonButton
                sx={{
                  width: isMobile ? "150px" : "165px",
                  paddingInline: "16px",
                }}
                buttonText="New message"
                onClick={() => setMessageModalOpen(true)}
                buttonTextStyle={{ fontSize: "14px" }}
              />
            </Box>
          </CommonCard>
        </Box>
        <Box mt={3}>
          {message === false ? (
            <Grid2 container spacing={2}>
              {Array.isArray(carerSupportProfileData?.newMessage) &&
                carerSupportProfileData.newMessage.length > 0 && (
                  <>
                    <Grid2 size={{ md: 4, lg: 4, xl: 4, sm: 12, xs: 12 }}>
                      {carerSupportProfileData?.newMessage.map((ele, index) => {
                        return (
                          <Box key={index} mt={3}>
                            <CommonGetHelpCard
                              title={"Zorbee support"}
                              description={
                                ele.userId?.firstName +
                                " " +
                                ele.userId?.lastName
                              }
                              DateAndTime={moment(ele.createdAt).format(
                                "DD/MM/YYYY | HH:mm"
                              )}
                              onClick={() => setSelectedMail(index)}
                              selectedMail={index === selectedMail}
                            />
                          </Box>
                        );
                      })}
                    </Grid2>
                    <Grid2 size={{ md: 8, lg: 8, xl: 8, sm: 12, xs: 12 }}>
                      <Box mt={3}>
                        <Box>
                          <CommonCard
                            sx={{ padding: "16px 22px", display: "flex" }}
                          >
                            <Typography fontSize={"16px"} fontWeight={500}>
                              SUBJECT:
                            </Typography>
                            <Typography fontSize={"16px"}>
                              {
                                carerSupportProfileData?.newMessage[
                                  selectedMail
                                ]?.subject
                              }
                            </Typography>
                          </CommonCard>
                        </Box>
                        <Box mt={3}>
                          <CommonCard>
                            {/* <Typography>Hi Reuben,</Typography> */}
                            <Typography
                              variant="body1"
                              dangerouslySetInnerHTML={{
                                __html:
                                  carerSupportProfileData?.newMessage[
                                    selectedMail
                                  ]?.message || "",
                              }}
                            />
                          </CommonCard>
                        </Box>
                      </Box>
                    </Grid2>
                  </>
                )}
            </Grid2>
          ) : (
            <Grid2 container spacing={2}>
              <Grid2 size={{ md: 12, lg: 12, xl: 12, sm: 12, xs: 12 }}>
                <CommonCard
                  sx={{
                    padding: "16px 22px",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "start",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    fontSize={"16px"}
                    fontWeight={500}
                    marginBlock={1}
                  >
                    Recipient:
                  </Typography>
                  <Box sx={{ width: "100%" }}>
                    <Controller
                      name="recipient"
                      control={control}
                      render={({ field }) => (
                        <CommonInput
                          label=""
                          sx={{
                            border: "none",
                            paddingInline: "0",
                            width: "100%",
                            "&.Mui-error": {
                              border: "none !important",
                              backgroundColor: theme.palette.error.light + "10",
                            },
                          }}
                          height={"30px"}
                          placeholder={"Enter Recipient"}
                          {...field}
                        />
                      )}
                    />
                  </Box>
                </CommonCard>
                {errors.recipient && (
                  <Typography color="error" fontSize="12px" mt={1} ml={1}>
                    {errors.recipient.message}
                  </Typography>
                )}
              </Grid2>
              <Grid2 size={{ md: 12, lg: 12, xl: 12, sm: 12, xs: 12 }}>
                <CommonCard
                  sx={{
                    padding: "16px 22px",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "start",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    fontSize={"16px"}
                    fontWeight={500}
                    marginBlock={1}
                  >
                    SUBJECT:
                  </Typography>
                  <Box sx={{ width: "100%" }}>
                    <Controller
                      name="subject"
                      control={control}
                      render={({ field }) => (
                        <CommonInput
                          label=""
                          sx={{
                            border: "none",
                            paddingInline: "0",
                            width: "100%",
                            "&.Mui-error": {
                              border: "none !important",
                              backgroundColor: theme.palette.error.light + "10",
                            },
                          }}
                          height={"30px"}
                          placeholder={"Enter Subject"}
                          {...field}
                        />
                      )}
                    />
                  </Box>
                </CommonCard>
                {errors.subject && (
                  <Typography color="error" fontSize="12px" mt={1} ml={1}>
                    {errors.subject.message}
                  </Typography>
                )}
              </Grid2>
              <Grid2 size={{ md: 12, lg: 12, xl: 12, sm: 12, xs: 12 }}>
                <Controller
                  name="message"
                  control={control}
                  render={({ field }) => (
                    <CMSEditor value={field.value} onChange={field.onChange} />
                  )}
                />
                {errors.message && (
                  <Typography color="error" fontSize="12px" mt={1} ml={1}>
                    {errors.message.message}
                  </Typography>
                )}
                <Box mt={2} display={"flex"} justifyContent={"end"}>
                  <CommonCard
                    sx={{
                      padding: "16px 22px",
                      display: "flex",
                      justifyContent: "end",
                    }}
                  >
                    <Box
                      sx={{
                        padding: "13px",
                        border: "2px solid lightgray",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "5px",
                        marginRight: "19px",
                        cursor: "pointer",
                      }}
                      component={"button"}
                      onClick={() => {
                        clearErrors();
                        reset({
                          recipient: "",
                          subject: "",
                          message: "",
                        });
                      }}
                    >
                      <Image
                        src="/assets/svg/carers/profile/Bin.svg"
                        alt="bin"
                        height={20}
                        width={20}
                      />
                    </Box>
                    <Box
                      sx={{
                        padding: "13px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "5px",
                        background: theme.palette.primary.main,
                        cursor: "pointer",
                        border: "none",
                      }}
                      component={"button"}
                      onClick={handleSubmit(handleSendMessage)}
                    >
                      <Image
                        src="/assets/svg/carers/profile/Send.svg"
                        alt="send"
                        height={20}
                        width={20}
                      />
                    </Box>
                  </CommonCard>
                </Box>
              </Grid2>
            </Grid2>
          )}
        </Box>
      </Box>
      {messageModalOpen && (
        <SupportMessageModal
          isOpen={messageModalOpen}
          onClose={messageModalClose}
          onSend={handleSendMessage}
          defaultRecipient={carerSupportProfileData?.userEmail || ""}
        />
      )}
      {assignModalOpen && (
        <SelectModal
          title="Assign ticket"
          description="Select a sub-admin from the list below to assign this ticket"
          options={adminList}
          isOpen={assignModalOpen}
          onClose={handleEventClose}
          onSet={handleEventSet}
          onChangeEvent={handleEventChange}
        />
      )}
    </Box>
  );
};

export default UserProfile;
