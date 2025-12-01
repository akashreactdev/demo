import { createTheme } from "@mui/material/styles";
import localFont from "next/font/local";
import {
  PendingTextStyle,
  PendingBackgroundStyle,
  AcceptedTextStyle,
  AcceptedBackgroundStyle,
  DeclinedTextStyle,
  DeclinedBackgroundStyle,
  InProgressTextStyle,
  InProgressBackgroundStyle,
  ShadowAndBorder,
} from "@/utils/colors";

declare module "@mui/material/styles" {
  interface Theme {
    pending: {
      main: string;
      secondary: string;
      third: string;
      pageButton: string;
      paymentPending: string;
      background: {
        primary: string;
        secondary: string;
      };
    };
    accepted: {
      main: string;
      background: {
        primary: string;
        secondary: string;
        third: string;
        fourth: string;
      };
    };
    declined: {
      main: string;
      cancelled: string;
      secondary: string;
      background: {
        primary: string;
        secondary: string;
      };
    };
    inProgress: {
      main: string;
      secondary: string;
      third: string;
      background: {
        primary: string;
        secondary: string;
        third: string;
        fourth: string;
        fifth: string;
        border: string;
        secondaryborder: string;
      };
    };
    ShadowAndBorder: {
      shadow1: string;
      shadow2: string;
      border1: string;
      border2: string;
      color1: string;
      color2: string;
      color3: string;
      border3:string;
    };
  }

  // allow configuration using `createTheme`
  interface ThemeOptions {
    pending?: Theme["pending"];
    accepted?: Theme["accepted"];
    declined?: Theme["declined"];
    inProgress?: Theme["inProgress"];
    ShadowAndBorder?: Theme["ShadowAndBorder"];
  }
}
// Load custom font
const atypTextTrial = localFont({
  src: [
    { path: "/fonts/AtypTextTRIALLight.otf", weight: "300", style: "normal" },
    {
      path: "/fonts/AtypTextTRIALLightItalic.otf",
      weight: "300",
      style: "italic",
    },
    { path: "/fonts/AtypTextTRIALRegular.otf", weight: "400", style: "normal" },
    { path: "/fonts/AtypTextTRIALMedium.otf", weight: "500", style: "normal" },
    {
      path: "/fonts/AtypTextTRIALMediumItalic.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "/fonts/AtypTextTRIALSemibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "/fonts/AtypTextTRIALSemiboldItalic.otf",
      weight: "600",
      style: "italic",
    },
    { path: "/fonts/AtypTextTRIALBold.otf", weight: "700", style: "normal" },
    {
      path: "/fonts/AtypTextTRIALBoldItalic.otf",
      weight: "700",
      style: "italic",
    },
  ],
});

// Create MUI theme
const theme = createTheme({
  palette: {
    primary: { main: "#F9D835" },
    error: { main: "#FF0000" },
    common: { white: "#ffffff", black: "#000000" },
    background: { default: "#F7F6F9" },
    action: {
      disabledBackground: "#E2E6EB",
      disabled: "#B3B3B3",
    },
  },

  pending: {
    main: PendingTextStyle.primary,
    secondary: PendingTextStyle.secondary,
    third: PendingTextStyle.third,
    pageButton: PendingTextStyle.pageButton,
    paymentPending: PendingTextStyle.paymentPending,
    background: {
      primary: PendingBackgroundStyle.primary,
      secondary: PendingBackgroundStyle.secondary,
    },
  },
  accepted: {
    main: AcceptedTextStyle.primary,
    background: {
      primary: AcceptedBackgroundStyle.primary,
      secondary: AcceptedBackgroundStyle.secondary,
      third: AcceptedBackgroundStyle.third,
      fourth: AcceptedBackgroundStyle.fourth,
    },
  },
  declined: {
    main: DeclinedTextStyle.primary,
    cancelled: DeclinedTextStyle.cancled,
    secondary: DeclinedTextStyle.secondary,
    background: {
      primary: DeclinedBackgroundStyle.primary,
      secondary: DeclinedBackgroundStyle.secondary,
    },
  },
  inProgress: {
    main: InProgressTextStyle.primary,
    secondary: InProgressTextStyle.secondary,
    third: InProgressTextStyle.third,
    background: {
      primary: InProgressBackgroundStyle.primary,
      secondary: InProgressBackgroundStyle.secondary,
      third: InProgressBackgroundStyle.third,
      fourth: InProgressBackgroundStyle.fourth,
      fifth: InProgressBackgroundStyle.fifth,
      border: InProgressBackgroundStyle.border,
      secondaryborder: InProgressBackgroundStyle.secondaryborder,
    },
  },
  ShadowAndBorder: {
    shadow1: ShadowAndBorder.shadow1,
    shadow2: ShadowAndBorder.shadow2,
    border1: ShadowAndBorder.border1,
    border2: ShadowAndBorder.border2,
    color1: ShadowAndBorder.color1,
    color2: ShadowAndBorder.color2,
    color3: ShadowAndBorder.color3,
    border3 :ShadowAndBorder.border3,
  },

  typography: {
    fontFamily: `${atypTextTrial.style.fontFamily}, Arial, sans-serif`,

    h1: {
      fontSize: "2.5rem", // 40px
      fontWeight: 700,
      lineHeight: 1.2,
      "@media (max-width: 900px)": { fontSize: "2rem" }, // 32px
      "@media (max-width: 600px)": { fontSize: "1.75rem" }, // 28px
    },
    h2: {
      fontSize: "2rem", // 32px
      fontWeight: 600,
      lineHeight: 1.3,
      "@media (max-width: 900px)": { fontSize: "1.75rem" }, // 28px
      "@media (max-width: 600px)": { fontSize: "1.5rem" }, // 24px
    },
    h3: {
      fontSize: "1.75rem", // 28px
      fontWeight: 600,
      lineHeight: 1.3,
      "@media (max-width: 900px)": { fontSize: "1.5rem" }, // 24px
      "@media (max-width: 600px)": { fontSize: "1.25rem" }, // 20px
    },
    h4: {
      fontSize: "1.5rem", // 24px
      fontWeight: 500,
      lineHeight: 1.4,
      "@media (max-width: 900px)": { fontSize: "1.25rem" }, // 20px
      "@media (max-width: 600px)": { fontSize: "1.125rem" }, // 18px
    },
    h5: {
      fontSize: "1.25rem", // 20px
      fontWeight: 400,
      lineHeight: 1.5,
      "@media (max-width: 900px)": { fontSize: "1.125rem" }, // 18px
      "@media (max-width: 600px)": { fontSize: "1rem" }, // 16px
    },
    h6: {
      fontSize: "1.125rem", // 18px
      fontWeight: 400,
      lineHeight: 1.6,
      "@media (max-width: 900px)": { fontSize: "1rem" }, // 16px
      "@media (max-width: 600px)": { fontSize: "0.975rem" }, // 14px
    },
    body1: {
      fontSize: "1rem", // 16px
      fontWeight: 400,
      lineHeight: 1.6,
      "@media (max-width: 900px)": { fontSize: "0.875rem" }, // 14px
      "@media (max-width: 600px)": { fontSize: "0.8125rem" }, // 13px
    },
    body2: {
      fontSize: "0.875rem", // 14px
      fontWeight: 400,
      lineHeight: 1.6,
      "@media (max-width: 900px)": { fontSize: "0.8125rem" }, // 13px
      "@media (max-width: 600px)": { fontSize: "0.75rem" }, // 12px
    },
    caption: {
      fontSize: "0.75rem", // 12px
      fontWeight: 300,
      lineHeight: 1.6,
    },
    overline: {
      fontSize: "0.625rem", // 10px
      fontWeight: 300,
      textTransform: "uppercase",
      lineHeight: 1.6,
    },
  },

  components: {
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: "#000000", // Ensure it's always black
        },
      },
    },
  },
});

export default theme;
