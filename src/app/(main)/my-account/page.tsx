"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { useMediaQuery, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
// import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
// import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
//relative path imports
import CommonCard from "@/components/Cards/Common";
import KeyValueDetails from "@/components/Cards/KeyValueDetails";
import CommonButton from "@/components/CommonButton";
import CommonInput from "@/components/CommonInput";
import ApproveButton from "@/components/carers/profile/ApproveButton";
import ChangeEmail from "@/components/MyAccount/Modal/ChangeEmail";
import VerifyEmail from "@/components/MyAccount/Modal/VerifyEmail";
import EmailUpdated from "@/components/MyAccount/Modal/EmailUpdated";
import VerifyEmailAddress from "@/components/MyAccount/Modal/VerifyEmailAddress";
import EmailCodeModal from "@/components/MyAccount/Modal/EmailCode";
import EmailSuccess from "@/components/MyAccount/Modal/EmailSuccess";
import {
  getEmailVerify,
  getMyAccountSummary,
  updateEmailAddress,
  updateMyAccountDetails,
  verifyOTP,
} from "@/services/api/myAccountApi";
// import { generateCaptcha } from "@/utils/helper";
import { FileUploadData, uploadFile } from "@/services/api/fileUploadApi";
import { useRouterLoading } from "@/hooks/useRouterLoading";
import ChangePassword from "@/components/MyAccount/Modal/ChangePassword";

interface MyAccountData {
  agoraUserId: string | null;
  notes: string | null;
  profile?: string | null;
  countryCode: string | number | null;
  mobileNumber: string | null;
  approvedDate: string | null;
  originalUserId: string | null;
  googleTokens: string | null;
  _id: string | null;
  username: string | null;
  email: string | null;
  title?: string | null;
  firstName: string | null;
  lastName: string | null;
  gender: string | null;
  password: string | null;
  dob: string | null;
  role: number;
  authType: number;
  googleId: string | null;
  appleId: string | null;
  facebookId: string | null;
  isTermsAccept: boolean;
  isEmailVerify: boolean;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string | null;
  updatedAt: string | null;
  isFaceIbEnabled: boolean;
  isSharedAccount: boolean;
  status: number;
  address: string | null;
}

interface AccountDetailsResponse {
  data: {
    success: boolean;
    message: string;
    data: MyAccountData;
  };
}

interface UpdateEmailResponse {
  data: {
    success: boolean;
    message: string;
  };
}

interface verifyEmailResponse {
  data: {
    success: boolean;
    message: string;
  };
}

interface updateAccountPayloadData {
  firstName?: string | null;
  profile?: string | null;
  userName?: string | null;
  lastName?: string | null;
  dob?: string | null;
  address?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  password?: string | null;
  confirmPassword?: string | null;
}

interface UpdateAccountResponse {
  data: {
    success: boolean;
    message: string;
    data: MyAccountData;
  };
}

interface verifyOTPResponse {
  data: { success: boolean; message: string };
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

// const StyledCaptcha = styled(Box)(({ theme }) => ({
//   height: "80px",
//   border: `1px solid ${theme.inProgress.main}`,
//   backgroundColor: theme.inProgress.background.primary,
//   width: "100%",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   borderRadius: "12px",

//   [theme.breakpoints.down("md")]: {
//     height: "55px",
//   },
//   [theme.breakpoints.down("sm")]: {
//     height: "45px",
//   },
// }));

const MyAccount = () => {
  const { navigateWithLoading } = useRouterLoading();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [email, setEmail] = useState<string>("");
  // const [currentPassword, setCurrentPassword] = useState<string>("");
  // const [captcha, setCaptcha] = useState<string>("");
  // const [newPassword, setNewPassword] = useState<string>("");
  // const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] =
  //   useState<boolean>(false);
  // const [isNewPasswordVisible, setIsNewPasswordVisible] =
  //   useState<boolean>(false);
  const [imageSrc, setImageSrc] = useState("");
  const [isEditAccountInformation, setIsEditAccountInformation] =
    useState<boolean>(false);
  const [isOpenEmailModal, setIsOpenEmailModal] = useState<boolean>(false);
  const [isOpenVerifyEmailModal, setIsOpenVerifyEmailModal] =
    useState<boolean>(false);
  const [isOpenEmailUpdatedModal, setIsOpenEmailUpdatedModal] =
    useState<boolean>(false);
  const [isOpenVerifyEmailAddressModal, setIsOpenVerifyEmailAddressModal] =
    useState<boolean>(false);
  const [isOpenEmailCodeModal, setIsOpenEmailCodeModal] =
    useState<boolean>(false);
  const [isOpenSuccessModal, setIsSuccessModal] = useState<boolean>(false);
  const [updatedEmail, setUpdateEmail] = useState<string>("");
  const [accountDetails, setAccountDetails] = useState<MyAccountData | null>(
    null
  );
  const [isOpenPasswordModal, setIsPasswordModal] = useState<boolean>(false);
  // const [captchaCode, setCaptchaCode] = useState<string>(generateCaptcha());
  // const isCaptchaValid = captcha.toLowerCase() === captchaCode.toLowerCase();
  const [editFormData, setEditFormData] = useState({
    // title: "",
    firstName: "",
    lastName: "",
    dob: "",
    address: "",
    mobileNumber: "",
  });

  const fetchMyAccountDetails = async () => {
    try {
      const response = (await getMyAccountSummary()) as AccountDetailsResponse;
      if (response?.data?.success) {
        setAccountDetails(response?.data?.data);
        setEmail(response?.data?.data?.email || "");
        setEditFormData({
          // title: response?.data?.data?.title || "N/A",
          firstName: response?.data?.data?.firstName || "N/A",
          lastName: response?.data?.data?.lastName || "",
          dob: response?.data?.data?.dob || "N/A",
          address: response?.data?.data?.address || "N/A",
          mobileNumber: response?.data?.data?.mobileNumber || "N/A",
        });
        setImageSrc(
          response?.data?.data?.profile
            ? `${process.env.NEXT_PUBLIC_ASSETS_URL}/${response?.data?.data?.profile}`
            : ""
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchMyAccountDetails();
    // setCaptchaCode(generateCaptcha());
  }, []);

  const account_informations = useMemo(() => {
    return [
      // {
      //   key: "title",
      //   label: "Title",
      //   value: isEditAccountInformation
      //     ? editFormData.title
      //     : accountDetails?.title || "N/A",
      // },
      {
        key: "firstName",
        label: "First Name",
        value: isEditAccountInformation
          ? editFormData.firstName
          : accountDetails?.firstName || "N/A",
      },
      {
        key: "lastName",
        label: "Last Name",
        value: isEditAccountInformation
          ? editFormData.lastName
          : accountDetails?.lastName || "N/A",
      },
      {
        key: "dob",
        label: "Date of birth",
        value: isEditAccountInformation
          ? editFormData.dob
          : accountDetails?.dob || "N/A",
      },
      {
        key: "mobileNumber",
        label: "Mobile number",
        value: isEditAccountInformation
          ? editFormData.mobileNumber
          : accountDetails?.mobileNumber || "N/A",
      },
      {
        key: "address",
        label: "Location",
        value: isEditAccountInformation
          ? editFormData.address
          : accountDetails?.address || "N/A",
      },
    ];
  }, [accountDetails, isEditAccountInformation, editFormData]);

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (!file) return;
      try {
        const uploadData: FileUploadData = {
          file: file,
          fileName: file.name,
          fileType: file.type,
          moduleName: "superAdmin",
          documentType: "profileImage",
        };

        const response = (await uploadFile(uploadData)) as FileUploadResponse;
        if (response?.data?.success) {
          setImageSrc(
            `${process.env.NEXT_PUBLIC_ASSETS_URL}/${response.data?.data?.filePath}`
          );
          const payload = {
            profile: response.data?.data?.filePath,
          };
          updateAccountDetails(payload);
        }
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };
  const onClick = () => {
    setIsEditAccountInformation(true);
  };

  const onCancel = () => {
    setEditFormData({
      // title: accountDetails?.title || "N/A",
      firstName: accountDetails?.firstName || "N/A",
      lastName: accountDetails?.lastName || "",
      dob: accountDetails?.dob || "N/A",
      address: accountDetails?.address || "N/A",
      mobileNumber: accountDetails?.mobileNumber || "N/A",
    });
    setIsEditAccountInformation(false);
  };

  const onSave = async () => {
    try {
      const payload: updateAccountPayloadData = {
        firstName: editFormData.firstName || null,
        lastName: editFormData.lastName || null,
        dob: editFormData.dob || null,
        address: editFormData.address || null,
      };

      const response = (await updateMyAccountDetails(
        payload
      )) as UpdateAccountResponse;
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        setAccountDetails(response?.data?.data);
        setIsEditAccountInformation(false);
        fetchMyAccountDetails();
      }
    } catch (error) {
      console.error("Error updating account information:", error);
      toast.error("Failed to update account information");
    }
  };

  const handleFormChange = (key: string | undefined, value: string) => {
    if (key) {
      setEditFormData((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
  };

  const onCloseEmailModal = () => {
    setIsOpenEmailModal(false);
    setUpdateEmail("");
  };

  const onClosePasswordModal = () => {
    setIsPasswordModal(false);
  };

  const onSendLink = (value: string) => {
    verifyMail(email, value);
  };

  const verifyMail = async (newEmail: string, updateEmail: string) => {
    try {
      const response = (await getEmailVerify(newEmail)) as verifyEmailResponse;
      if (response?.data?.success) {
        setUpdateEmail(updateEmail);
        setIsOpenEmailModal(false);
        setIsOpenVerifyEmailModal(true);
      }
    } catch (error) {
      console.error("Error verify email address:", error);
    }
  };

  const onCloseVerifyEmailModal = () => {
    setIsOpenEmailModal(true);
    setIsOpenVerifyEmailModal(false);
  };

  const onClickVerifyEmailModal = (value: string) => {
    handleVerifyOTPforUpdateEmail(value);
  };

  const handleVerifyOTPforUpdateEmail = async (otp: string) => {
    try {
      const payload = {
        email: email,
        type: "verifyEmail",
        otp: otp,
      };
      const response = (await verifyOTP(payload)) as verifyOTPResponse;
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        handleUpdateMail(updatedEmail);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  const handleUpdateMail = async (newEmail: string) => {
    try {
      const payload = {
        email: newEmail,
      };
      const response = (await updateEmailAddress(
        payload
      )) as UpdateEmailResponse;
      if (response?.data?.success) {
        setIsOpenVerifyEmailModal(false);
        setIsOpenEmailUpdatedModal(true);
        fetchMyAccountDetails();
      }
    } catch (error) {
      console.error("Error updating email address:", error);
    }
  };

  const onCloseEmailUpdatedModal = () => {
    setIsOpenVerifyEmailModal(true);
    setIsOpenEmailUpdatedModal(false);
  };

  const onClickVerifyEmailAddress = () => {
    setIsOpenVerifyEmailAddressModal(true);
  };

  const onClickVerifyEmailAddressBtn = () => {
    onClickVerifyEmailAddressModal(email);
  };

  const onClickVerifyEmailAddressModal = async (newEmail: string) => {
    try {
      const response = (await getEmailVerify(newEmail)) as verifyEmailResponse;
      if (response?.data?.success) {
        setIsOpenVerifyEmailAddressModal(false);
        setIsOpenEmailCodeModal(true);
      }
    } catch (error) {
      console.error("Error verify email address:", error);
    }
  };

  const onCloseEmailCodeModal = () => {
    onClickVerifyEmailAddressModal(email);
  };

  const onClickEmailCodeModal = (value: string) => {
    handleVerifyOTP(value);
  };

  const handleVerifyOTP = async (otp: string) => {
    try {
      const payload = {
        email: email,
        type: "verifyEmail",
        otp: otp,
      };
      const response = (await verifyOTP(payload)) as verifyOTPResponse;
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        setIsOpenEmailCodeModal(false);
        setIsSuccessModal(true);
        fetchMyAccountDetails();
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  const updateAccountDetails = async (payload: updateAccountPayloadData) => {
    try {
      const response = (await updateMyAccountDetails(
        payload
      )) as UpdateAccountResponse;
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        fetchMyAccountDetails();
        // setNewPassword("");
        // setCurrentPassword("");
        // setCaptcha("");
        // setIsCurrentPasswordVisible(false);
        // setIsNewPasswordVisible(false);
        setIsPasswordModal(false);
      }
    } catch (error) {
      console.error("Error updating account details:", error);
    }
  };

  // const handleUpdatePassword = () => {
  //   if (!currentPassword || !newPassword || !isCaptchaValid) {
  //     toast.error("Please fill in all fields.");
  //     return;
  //   }
  //   if (!isCaptchaValid) {
  //     toast.error("Captcha does not match. Please try again.");
  //     setCaptcha("");
  //     setCaptchaCode(generateCaptcha());
  //     return;
  //   }

  //   const payload = {
  //     password: currentPassword,
  //     confirmPassword: newPassword,
  //   };
  //   updateAccountDetails(payload);
  // };

  const handlePasswordChange = async (payload: {
    password: string;
    confirmPassword: string;
  }) => {
    if (payload) {
      // console.log("Payload to API:", payload);
      updateAccountDetails(payload);
    }
  };

  return (
    <Box>
      <Box>
        <CommonCard>
          <Typography
            sx={{ fontSize: { xs: "20px", sm: "24px", md: "30px" } }}
            fontWeight={500}
            color="common.black"
          >
            Welcome back, {accountDetails?.firstName || "Kat"}!
          </Typography>
          <Typography variant="caption">
            This is your Zorbee admin account. Manage your details here.
          </Typography>
        </CommonCard>
      </Box>

      <Box mt={3}>
        <Grid2 container spacing={2}>
          <Grid2 size={{ md: 6, lg: 6, xl: 6, sm: 12, xs: 12 }}>
            <CommonCard>
              <Typography variant="h6" fontWeight={500}>
                Profile image
              </Typography>
              <Typography variant="caption" fontWeight={400}>
                {`You don't have a profile image yet. Add one to personalise and
                enhance your profile.`}
              </Typography>

              <Box mt={4}>
                <Image
                  src={imageSrc || "/assets/images/Rectangle.jpg"}
                  alt="profile-pic"
                  height={182}
                  width={182}
                />

                <input
                  type="file"
                  accept="image/*"
                  id="profile-image-upload"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />

                <Typography
                  component="label"
                  htmlFor="profile-image-upload"
                  sx={{
                    cursor: "pointer",
                    textDecoration: "underline",
                    mt: 1,
                    display: "block",
                  }}
                >
                  {imageSrc ? "Replace profile image" : "Add profile image"}
                </Typography>
              </Box>
            </CommonCard>

            {/* Email */}
            <Box mt={3}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Email
                </Typography>
                <Typography variant="caption">
                  Need to update your email? Enter your new address below—we’ll
                  send a confirmation to make sure it’s you.
                </Typography>
                <Box mt={3}>
                  <CommonInput
                    label="Current email address"
                    sx={{
                      border: `1px solid ${theme.ShadowAndBorder.border2} !important`,
                    }}
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </Box>
                <Box
                  mt={3}
                  display={"flex"}
                  justifyContent={"flex-end"}
                  gap={2}
                  alignItems={"center"}
                >
                  {!accountDetails?.isEmailVerify && (
                    <Typography
                      sx={{
                        cursor: "pointer",
                        textDecorationLine: "underline",
                      }}
                      onClick={onClickVerifyEmailAddress}
                    >
                      Verify email address
                    </Typography>
                  )}
                  <CommonButton
                    buttonText="Update email address"
                    sx={{
                      backgroundColor: theme.pending.secondary,
                      height: "36px",
                      width: "max-content",
                    }}
                    buttonTextStyle={{ fontSize: "12px !important" }}
                    onClick={() => setIsOpenEmailModal(true)}
                  />
                </Box>
              </CommonCard>
            </Box>
          </Grid2>
          <Grid2 size={{ md: 6, lg: 6, xl: 6, sm: 12, xs: 12 }}>
            <CommonCard>
              <Typography variant="h6" fontWeight={500}>
                Account information
              </Typography>
              <Box mt={isMobile ? 2 : 4}>
                <KeyValueDetails
                  items={account_informations}
                  isEditable={isEditAccountInformation}
                  onChange={handleFormChange}
                />
              </Box>
              <Box mt={3}>
                {isEditAccountInformation ? (
                  <Stack direction={"row"} alignItems={"center"} spacing={2}>
                    <ApproveButton title="Cancel" onClick={onCancel} />
                    <ApproveButton
                      title="Save"
                      onClick={onSave}
                      variant="primary"
                    />
                  </Stack>
                ) : (
                  <ApproveButton title="Edit information" onClick={onClick} />
                )}
              </Box>
            </CommonCard>

            {/* Permission */}
            <Box mt={3}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Permissions
                </Typography>
                <Typography variant="caption" fontWeight={400}>
                  {`You are currently a sub-admin for Zorbee Health. You can manage access and add Zorbee staff through the settings.`}
                </Typography>

                <Box
                  mt={3}
                  display={"flex"}
                  justifyContent={"flex-end"}
                  gap={2}
                  alignItems={"center"}
                >
                  <CommonButton
                    buttonText="Manage access"
                    sx={{
                      backgroundColor: theme.pending.secondary,
                      height: "36px",
                      width: "max-content",
                    }}
                    buttonTextStyle={{ fontSize: "12px !important" }}
                    onClick={() => navigateWithLoading("/settings/access")}
                  />
                </Box>
              </CommonCard>
            </Box>

            {/* Password */}
            <Box mt={3}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Password
                </Typography>
                <Typography variant="caption" fontWeight={400}>
                  Update your password to protect your account. Avoid reusing
                  old passwords and remember to save it securely.
                </Typography>

                <Box
                  mt={3}
                  display={"flex"}
                  justifyContent={"flex-end"}
                  gap={2}
                  alignItems={"center"}
                >
                  <CommonButton
                    buttonText="Update password"
                    sx={{
                      backgroundColor: theme.pending.secondary,
                      height: "36px",
                      width: "max-content",
                    }}
                    buttonTextStyle={{ fontSize: "12px !important" }}
                    onClick={() => setIsPasswordModal(true)}
                  />
                </Box>
              </CommonCard>
            </Box>

            {/* <Box mt={3}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Password
                </Typography>
                <Typography variant="caption">
                  Update your password to protect your account. Avoid reusing
                  old passwords and remember to save it securely.
                </Typography>
                <Box mt={3}>
                  <CommonInput
                    label="Current password"
                    sx={{
                      border: `1px solid ${theme.ShadowAndBorder.border2} !important`,
                    }}
                    type={isCurrentPasswordVisible ? "text" : "password"}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    value={currentPassword}
                    endAdornment={
                      <IconButton
                        onClick={() =>
                          setIsCurrentPasswordVisible(!isCurrentPasswordVisible)
                        }
                      >
                        {isCurrentPasswordVisible ? (
                          <VisibilityOffOutlinedIcon />
                        ) : (
                          <RemoveRedEyeOutlinedIcon />
                        )}
                      </IconButton>
                    }
                  />
                </Box>
                <Box mt={3}>
                  <StyledCaptcha>
                    <Typography
                      variant={"h2"}
                      letterSpacing={2.5}
                      fontWeight={400}
                      color={theme.inProgress.main}
                    >
                      {captchaCode}
                    </Typography>
                  </StyledCaptcha>
                </Box>
                <Box mt={3}>
                  <CommonInput
                    label="Enter captcha"
                    sx={{
                      border: `1px solid ${theme.ShadowAndBorder.border2} !important`,
                    }}
                    onChange={(e) => setCaptcha(e.target.value)}
                    value={captcha}
                  />
                </Box>
                <Box mt={3}>
                  <CommonInput
                    label="New password"
                    type={isNewPasswordVisible ? "text" : "password"}
                    sx={{
                      border: `1px solid ${theme.ShadowAndBorder.border2} !important`,
                    }}
                    onChange={(e) => setNewPassword(e.target.value)}
                    value={newPassword}
                    endAdornment={
                      <IconButton
                        onClick={() =>
                          setIsNewPasswordVisible(!isNewPasswordVisible)
                        }
                      >
                        {isNewPasswordVisible ? (
                          <VisibilityOffOutlinedIcon />
                        ) : (
                          <RemoveRedEyeOutlinedIcon />
                        )}
                      </IconButton>
                    }
                  />
                </Box>
                <Box mt={3}>
                  <Typography
                    textAlign={"right"}
                    sx={{
                      cursor: "pointer",
                      textDecorationLine: "underline",
                    }}
                    onClick={() => navigateWithLoading("/forgot-password")}
                  >
                    Forgot your password
                  </Typography>
                </Box>
                <Box mt={3} display={"flex"} justifyContent={"flex-end"}>
                  <CommonButton
                    buttonText="Update password"
                    sx={{
                      backgroundColor: theme.pending.secondary,
                      height: "36px",
                      width: "max-content",
                    }}
                    buttonTextStyle={{ fontSize: "12px !important" }}
                    onClick={handleUpdatePassword}
                  />
                </Box>
              </CommonCard>
            </Box> */}
          </Grid2>
        </Grid2>
      </Box>
      <ChangePassword
        isOpen={isOpenPasswordModal}
        onClose={onClosePasswordModal}
        onClick={handlePasswordChange}
      />
      <ChangeEmail
        isOpen={isOpenEmailModal}
        onClose={onCloseEmailModal}
        onClick={onSendLink}
      />
      <VerifyEmail
        isOpen={isOpenVerifyEmailModal}
        onClose={onCloseVerifyEmailModal}
        onClick={onClickVerifyEmailModal}
        updatedEmail={email}
      />
      <EmailUpdated
        isOpen={isOpenEmailUpdatedModal}
        onClose={onCloseEmailUpdatedModal}
        onClick={() => setIsOpenEmailUpdatedModal(false)}
        description={
          "Your email has been updated but not verified. As a next step, please verify your new email."
        }
        title="Email Updated"
      />
      <VerifyEmailAddress
        isOpen={isOpenVerifyEmailAddressModal}
        onClick={onClickVerifyEmailAddressBtn}
        onClose={() => setIsOpenVerifyEmailAddressModal(false)}
        email={email}
      />
      <EmailCodeModal
        isOpen={isOpenEmailCodeModal}
        onClose={onCloseEmailCodeModal}
        onClick={onClickEmailCodeModal}
      />
      <EmailSuccess
        isOpen={isOpenSuccessModal}
        onClose={() => setIsSuccessModal(false)}
        onClick={() => setIsSuccessModal(false)}
      />
    </Box>
  );
};

export default MyAccount;
