
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface ProgressChartProps {
  data: any[];
  lines: Array<{
    dataKey: string;
    name: string;
    color: string;
  }>;
  title: string;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ data, lines, title }) => {
  return (
    <Card className="overflow-hidden h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="month" 
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: '#888' }}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: '#888' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px', 
                  border: 'none', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                }}
                labelStyle={{ fontWeight: 'bold', marginBottom: '5px' }}
              />
              <Legend />
              {lines.map((line, index) => (
                <Area
                  key={index}
                  type="monotone"
                  dataKey={line.dataKey}
                  name={line.name}
                  stroke={line.color}
                  fill={line.color}
                  fillOpacity={0.1}
                  activeDot={{ r: 6 }}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressChart;
