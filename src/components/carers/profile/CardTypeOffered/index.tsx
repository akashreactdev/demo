import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
//relative path imports
import CommonCard from "@/components/Cards/Common";
import CareType from "@/components/Cards/CareType";
import { TypeOfCare } from "@/constants/clinicalData";
import { Divider } from "@mui/material";
import { useTheme } from "@mui/material";
import CommonChip from "@/components/CommonChip";

interface CareTypeEntry {
  type?: number | null;
  walkingRate?: number | null;
  urgentCare?: boolean | null;
  hourlyCare?: boolean | null;
  overnightCare?: boolean | null;
  liveInCare?: boolean | null;
  ratePerHour?: number | null;
  ratePerWeek?: number | null;
}

interface careTypeDataProps {
  careTypeData?: CareTypeEntry[];
  rateNegotiable?: string | boolean | null;
}

const CardTypeOffered: React.FC<careTypeDataProps> = ({
  careTypeData,
  rateNegotiable,
}) => {
  const theme = useTheme();

  const getNegotiableLabel = () =>
    rateNegotiable === true
      ? "Yes"
      : rateNegotiable === false
      ? "No"
      : !rateNegotiable
      ? "N/A"
      : String(rateNegotiable);

  return (
    <CommonCard>
      <Typography variant="h6" fontWeight={500}>
        Care type offered
      </Typography>
      <Typography variant="caption" fontWeight={400}>
        These are the carer profiles pending verification. You can check the
        verification status, as another admin may have already initiated the
        process.
      </Typography>

      <Box>
        {careTypeData?.map((type, index) => {
          const getPathByType = (typeNumber: number | string) => {
            const paths = {
              1: "/assets/svg/carers/profile/clock_fire.svg",
              2: "/assets/svg/carers/verifications/hourglass.svg",
              3: "/assets/svg/carers/profile/weather_night.svg",
              4: "/assets/svg/carers/profile/clock_fire.svg",
            };
            return paths[typeNumber as keyof typeof paths];
          };
          return (
            <CareType
              key={index}
              path={type.type ? getPathByType(type.type) : ""}
              heading={TypeOfCare[Number(type.type)]}
              title="Rates"
              ratePerHours={type?.ratePerHour}
              ratePerWeek={type?.ratePerWeek}
              walkingRate={type?.walkingRate}
            />
          );
        })}
      </Box>
      <Box mt={5}>
        <Typography variant="body1" fontWeight={500}>
          Are your rates negotiable?
        </Typography>
        <Divider sx={{ marginBlock: 1 }} />
        <CommonChip
          title={getNegotiableLabel()}
          variant="primary"
          style={{
            backgroundColor: theme?.palette?.common?.white,
            border: `1px solid ${theme.ShadowAndBorder.border2}`,
            marginTop: 1,
          }}
          textStyle={{ fontWeight: 500 }}
        />
      </Box>
    </CommonCard>
  );
};

export default CardTypeOffered;
