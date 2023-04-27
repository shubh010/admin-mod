import React, { useState, useEffect } from 'react';
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { CheckBox, CheckBoxProps, Box, Label } from '@adminjs/design-system';

export const ChartItem = ({
  data,
  barField,
  areaField,
  lineField,
}: {
  data: any;
  areaField: string;
  barField: string;
  lineField: any;
}) => {
  const [mode, setMode] = useState('All');

  return (
    <div>
      <Box p="xl">
        <select
          onChange={(e) => setMode(e.target.value)}
          style={{ width: '40%' }}
        >
          <option value="All">All</option>
          <option value="Bar">Bar</option>
          <option value="Line">Line</option>
          <option value="Area">Area</option>
        </select>
      </Box>

      <ComposedChart width={420} height={380} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />

        {(mode === 'All' || mode === 'Area') && (
          <Area
            type="monotone"
            dataKey={areaField}
            fill="#8884d8"
            stroke="#8884d8"
          />
        )}

        {(mode === 'All' || mode === 'Bar') && (
          <Bar dataKey={barField} fill="#8884d8" />
        )}

        {(mode === 'All' || mode === 'Line') && (
          <Line type="monotone" dataKey={lineField} stroke="#8884d8" />
        )}
      </ComposedChart>
    </div>
  );
};
