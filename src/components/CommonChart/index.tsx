import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

interface CommonChartProps {
  data: ChartDataItem[];
  title?: string;
  subtitle?: string;
  innerRadius?: number;
  outerRadius?: number;
  paddingAngle?: number;
  cornerRadius?: number;
  minHeight?: number;
}

const CommonChart: React.FC<CommonChartProps> = ({
  data,
  title,
  subtitle,
  innerRadius = 90,
  outerRadius = 100,
  paddingAngle = 2,
  cornerRadius = 60,
  minHeight = 250,
}) => {
  return (
    <Box position="relative" height={minHeight} width="100%">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={paddingAngle}
            dataKey="value"
            strokeWidth={0.5}
            cornerRadius={cornerRadius}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <Box
        position="absolute"
        top="50%"
        left="50%"
        sx={{
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          width: "100%",
        }}
      >
        <Typography variant="body1" fontWeight={500}>
          {title}
        </Typography>
        <Typography variant="body1" fontWeight={400}>
          {subtitle}
        </Typography>
      </Box>
    </Box>
  );
};

export default CommonChart;
