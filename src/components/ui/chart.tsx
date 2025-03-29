import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface ChartProps {
  data: { name: string; সেল: number }[];
  title?: string;
  description?: string;
  color?: string;
  dataKey?: string;
}

const Chart = ({
  data,
  title,
  description,
  color = 'hsl(var(--primary))',
  dataKey = 'সেল',
}: ChartProps) => {
  return (
    <div className="rounded-md border">
      <div className="border-b px-4 py-2 font-medium">
        {title}
      </div>
      <div className="px-4 py-6">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              fillOpacity={1}
              fill="url(#area-gradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {description ? (
        <div className="border-t px-4 py-2 text-sm text-muted-foreground">
          {description}
        </div>
      ) : null}
    </div>
  );
};

export default Chart;
