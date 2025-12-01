"use client";
import React, { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { CircularProgress, useMediaQuery } from "@mui/material";
import { useTheme, styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid2 from "@mui/material/Grid2";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
//relative path imports
import CommonCard from "@/components/Cards/Common";
import DownloadDocumentButton from "@/components/DownloadDocumentBtn";
//recharts imports
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import CommonButton from "@/components/CommonButton";
import CommonFilterModal, {
  MONTH_FILTER_DATA,
} from "@/components/CommonFilterModal";
import {
  DownloadHealthReportDataPdf,
  getClientHealthReport,
} from "@/services/api/usersApi";
import { useParams } from "next/navigation";

type DateString = string;

interface BloodPressureDataPoint {
  name: DateString;
  Systolic: number;
  Diastolic: number;
}

interface SpO2DataPoint {
  name: DateString;
  SpO2: number;
}

interface TemperatureDataPoint {
  name: DateString;
  Temperature: number;
}

interface HeartRateDataPoint {
  name: DateString;
  HeartRate: number;
}

interface Filters {
  monthFilter: number | null;
}

interface ParamsProps {
  id: string;
  profile: string;
  report: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
}

export interface CreatedBy {
  _id: string;
  firstName: string;
  lastName: string;
}

export interface HealthReportItem {
  _id: string;
  userId: User;
  date: string; // ISO date string
  heartRate: number | null;
  systolic: number | null;
  diastolic: number | null;
  temperature: number | null;
  oxygenLevel: number | null;
  overallStatus: string | null;
  notes: string | null;
  isManuallyAdded: boolean;
  createdBy: CreatedBy;
  bookingId: string;
  createdAt: string;
  __v: number;
}

export interface Meta {
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export interface HealthReportResponse {
  data: {
    success: boolean;
    message: string;
    data: HealthReportItem[];
    meta: Meta;
  };
}

type HealthDataPoint =
  | BloodPressureDataPoint
  | SpO2DataPoint
  | TemperatureDataPoint
  | HeartRateDataPoint;

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
    dataKey: string;
    payload: HealthDataPoint;
    unit?: string;
  }>;
  label?: string;
}

const StyledTooltipWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  padding: "10px",
  border: `1px solid ${theme.ShadowAndBorder.border1}`,
  borderRadius: "4px",
  boxShadow: `0 2px 4px ${theme.ShadowAndBorder.shadow1}`,
}));

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <StyledTooltipWrapper>
        <Typography
          variant="caption"
          fontWeight={500}
        >{`Date: ${label}`}</Typography>
        {payload.map((entry, index) => (
          <Box
            key={index}
            sx={{ display: "flex", alignItems: "center", mt: 0.5 }}
          >
            <Box
              component="span"
              sx={{
                display: "inline-block",
                width: 8,
                height: 8,
                backgroundColor: entry.color,
                borderRadius: "2px",
                mr: 1,
              }}
            />
            <Typography variant="caption">{`${entry.name}: ${entry.value}${
              entry.unit || ""
            }`}</Typography>
          </Box>
        ))}
      </StyledTooltipWrapper>
    );
  }
  return null;
};

interface HealthGraphProps {
  title: string;
  subtitle: string;
  data: HealthDataPoint[];
  dataKeys: string | string[];
  colors: string[];
  maxValue?: number;
  unit?: string;
  barWidth?: number;
}

const HealthGraph: React.FC<HealthGraphProps> = ({
  title,
  subtitle,
  data,
  dataKeys,
  colors,
  maxValue = 200,
  unit = "",
  barWidth,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const calculatedBarWidth = barWidth || (isMobile ? 14 : 18);

  return (
    <CommonCard
      sx={{
        height: "100%",
        p: { xs: 2, sm: 3 },
        boxShadow: `0px 2px 6px ${theme.ShadowAndBorder.shadow2}`,
        borderRadius: "8px",
      }}
    >
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography
          variant="h6"
          fontWeight={500}
          fontSize={{ xs: "16px", sm: "18px" }}
        >
          {title}
        </Typography>

        {Array.isArray(dataKeys) && dataKeys.length > 1 && (
          <Box display="flex" alignItems="center">
            {dataKeys.map((key, index) => (
              <Box key={key} display="flex" alignItems="center" ml={2}>
                <Box
                  component="span"
                  sx={{
                    display: "inline-block",
                    width: 12,
                    height: 12,
                    backgroundColor: colors[index],
                    borderRadius: "2px",
                    mr: 0.5,
                  }}
                />
                <Typography variant="caption" fontSize="12px">
                  {key}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <Typography
        variant="caption"
        color="text.secondary"
        fontSize="12px"
        sx={{ display: "block", mb: 2 }}
      >
        {subtitle}
      </Typography>

      <Box
        sx={{
          width: "100%",
          height: 220,
          border: `1px solid ${theme.ShadowAndBorder.border2}`,
          borderRadius: "4px",
          p: 1,
          overflowX: "auto",
          overflowY: "hidden",
        }}
      >
        <Box
          sx={{
            minWidth: data.length * (calculatedBarWidth + 20),
            height: "100%",
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
              barSize={calculatedBarWidth}
              barGap={4}
            >
              <CartesianGrid
                horizontal
                vertical={false}
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                tickMargin={10}
              />
              <YAxis
                domain={[0, maxValue]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                tickMargin={10}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: theme.ShadowAndBorder.shadow2 }}
              />
              {Array.isArray(dataKeys) ? (
                dataKeys.map((key, index) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={colors[index]}
                    radius={[3, 3, 0, 0]}
                    name={key}
                    unit={unit}
                  />
                ))
              ) : (
                <Bar
                  dataKey={dataKeys}
                  fill={colors[0]}
                  radius={[3, 3, 0, 0]}
                  name={dataKeys}
                  unit={unit}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </CommonCard>
  );
};

const HealthReport: React.FC = () => {
  const theme = useTheme();
  const params = useParams() as unknown as ParamsProps;
  const isLaptop = useMediaQuery(theme.breakpoints.down("lg"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [monthFilterOpen, setMonthFilterOpen] = useState<boolean>(false);
  const [reportData, setReportData] = useState<HealthReportItem[]>([]);
  const currentMonth = new Date().getMonth() + 1;
  const [filters, setFilters] = useState<Filters>({
    monthFilter: currentMonth,
  });

  const handleFilterChange = (
    key: keyof Filters,
    value: Filters[keyof Filters]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? null : value,
    }));
  };

  const selectedMonthLabel =
    filters.monthFilter != null
      ? MONTH_FILTER_DATA.monthFilter.find(
          (m) => m.value === filters.monthFilter
        )?.label
      : null;

  const fetcHealthReportData = async (
    agreementId: string,
    clientId: string,
    userId: string,
    month?: number | null
  ) => {
    setIsLoading(true);
    try {
      const response = (await getClientHealthReport({
        bookingId: agreementId,
        clientId: clientId,
        userId: userId,
        role: 4,
        limit: 200,
        month: month || undefined,
      })) as HealthReportResponse;
      if (response?.data?.success) {
        setIsLoading(false);
        setReportData(response?.data?.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const downloadHealthReport = async (
    agreementId: string,
    clientId: string,
    userId: string
  ) => {
    setIsLoading(true);
    try {
      const response = (await DownloadHealthReportDataPdf({
        bookingId: agreementId,
        clientId: clientId,
        userId: userId,
        role: 4,
      })) as AxiosResponse<Blob>;

      if (response && response.data) {
        setIsLoading(false);
        const fileURL = window.URL.createObjectURL(
          new Blob([response.data], { type: "application/pdf" })
        );

        window.open(fileURL);

        setTimeout(() => window.URL.revokeObjectURL(fileURL), 10000);
      }
    } catch (e) {
      console.error("Error downloading report:", e);
    }
  };

  useEffect(() => {
    if (params?.report) {
      fetcHealthReportData(
        params.report,
        params.profile,
        params.id,
        filters.monthFilter
      );
    }
  }, [params?.report, filters.monthFilter]);

  // console.log(reportData, "reportData ==>");

  const bloodPressureData: BloodPressureDataPoint[] = reportData.map(
    (item) => ({
      name: new Date(item.date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
      }),
      Systolic: item.systolic || 0,
      Diastolic: item.diastolic || 0,
    })
  );

  const spO2Data: SpO2DataPoint[] = reportData.map((item) => ({
    name: new Date(item.date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
    }),
    SpO2: item.oxygenLevel || 0,
  }));

  const temperatureData: TemperatureDataPoint[] = reportData.map((item) => ({
    name: new Date(item.date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
    }),
    Temperature: item.temperature || 0,
  }));

  const heartRateData: HeartRateDataPoint[] = reportData.map((item) => ({
    name: new Date(item.date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
    }),
    HeartRate: item.heartRate || 0,
  }));

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
    <Box sx={{ width: "100%" }}>
      <CommonCard sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
        <Stack
          direction={isLaptop ? "column" : "row"}
          alignItems={isLaptop ? "flex-start" : "center"}
          justifyContent="space-between"
          width="100%"
        >
          <Box>
            <Typography
              variant="h6"
              fontWeight={500}
              fontSize={{ xs: "18px", sm: "20px", md: "22px" }}
            >
              Health report
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              fontSize={{ xs: "13px", sm: "14px", md: "16px" }}
            >
              You are currently viewing the health report for Reuben Hale.
            </Typography>
          </Box>

          <Stack
            mt={isLaptop ? 2 : 0}
            direction={isMobile ? "column" : "row"}
            alignItems={isMobile ? "flex-start" : "center"}
            spacing={isMobile ? 2 : 4}
            width={isMobile ? "100%" : "auto"}
          >
            <Box>
              <Typography
                variant="caption"
                fontWeight={400}
                color="text.secondary"
              >
                Last updated
              </Typography>
              <Typography variant="caption" fontWeight={500} display="block">
                Today at 9:42 AM
              </Typography>
            </Box>
            <DownloadDocumentButton
              title="Download PDF"
              onClick={() =>
                downloadHealthReport(params.report, params.profile, params.id)
              }
            />
          </Stack>
        </Stack>
      </CommonCard>

      <Box mt={3}>
        <CommonCard>
          <Stack
            direction={isLaptop ? "column" : "row"}
            alignItems={isLaptop ? "flex-start" : "center"}
            justifyContent="space-between"
            width="100%"
          >
            <Box>
              <Typography
                variant="body1"
                fontWeight={500}
                fontSize={{ xs: "13px", sm: "16px", md: "18px" }}
              >
                Time period
              </Typography>
            </Box>

            <Box>
              <CommonButton
                buttonText={selectedMonthLabel || "Set month"}
                endIcon={
                  <CalendarMonthOutlinedIcon
                    sx={{ color: theme.palette.common.black }}
                  />
                }
                sx={{
                  backgroundColor: theme.pending.background.secondary,
                  height: "40px",
                }}
                buttonTextStyle={{
                  fontSize: "16px",
                  fontWeight: 500,
                  marginTop: 0.5,
                }}
                onClick={() => setMonthFilterOpen(true)}
              />
            </Box>
          </Stack>
        </CommonCard>
      </Box>

      <Grid2 container spacing={3} mt={3}>
        <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
          <HealthGraph
            title="Blood pressure"
            subtitle="The data presented here is displayed in mmHg"
            data={bloodPressureData}
            dataKeys={["Systolic", "Diastolic"]}
            colors={[
              theme.ShadowAndBorder.color1,
              theme.ShadowAndBorder.color2,
            ]}
            unit=" mmHg"
            barWidth={12}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
          <HealthGraph
            title="SpO2 (Oxygen)"
            subtitle="The data presented here is displayed as a percentage"
            data={spO2Data}
            dataKeys="SpO2"
            colors={[theme.ShadowAndBorder.color3]}
            maxValue={200}
            unit="%"
            barWidth={12}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
          <HealthGraph
            title="Temperature reading"
            subtitle="The data presented here is displayed in Celsius (°C)"
            data={temperatureData}
            dataKeys="Temperature"
            colors={[theme.ShadowAndBorder.color3]}
            maxValue={200}
            unit="°C"
            barWidth={12}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
          <HealthGraph
            title="Heart rate"
            subtitle="The data presented here is displayed in beats per minute (bpm)"
            data={heartRateData}
            dataKeys="HeartRate"
            colors={[theme.ShadowAndBorder.color3]}
            maxValue={200}
            unit=" bpm"
            barWidth={12}
          />
        </Grid2>
      </Grid2>
      <CommonFilterModal
        isOpen={monthFilterOpen}
        onClose={() => setMonthFilterOpen(false)}
        onDone={() => setMonthFilterOpen(false)}
        title="Filter results"
        filters={filters}
        onChange={handleFilterChange}
      />
    </Box>
  );
};

export default HealthReport;
