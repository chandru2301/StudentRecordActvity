import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ 
  title, 
  value, 
  icon, 
  color, 
  subtitle 
}) => {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} shadow-lg group-hover:shadow-xl transition-all duration-300`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface BarChartCardProps {
  title: string;
  subtitle: string;
  data: any[];
  dataKey: string;
  xAxisKey: string;
  color: string;
}

export const BarChartCard: React.FC<BarChartCardProps> = ({ 
  title, 
  subtitle, 
  data, 
  dataKey, 
  xAxisKey, 
  color 
}) => {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold text-gray-800">{title}</CardTitle>
        <CardDescription className="text-gray-600">{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey={xAxisKey} 
              stroke="#666"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#666"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar 
              dataKey={dataKey} 
              fill={color}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

interface PieChartCardProps {
  title: string;
  subtitle: string;
  data: any[];
  dataKey: string;
  nameKey: string;
}

export const PieChartCard: React.FC<PieChartCardProps> = ({ 
  title, 
  subtitle, 
  data, 
  dataKey, 
  nameKey 
}) => {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold text-gray-800">{title}</CardTitle>
        <CardDescription className="text-gray-600">{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey={dataKey}
              nameKey={nameKey}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-600">{item[nameKey]}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

interface DataTableProps {
  title: string;
  subtitle: string;
  columns: string[];
  data: any[];
  renderCell?: (value: any, column: string, row: any) => React.ReactNode;
}

export const DataTable: React.FC<DataTableProps> = ({ 
  title, 
  subtitle, 
  columns, 
  data, 
  renderCell 
}) => {
  const defaultRenderCell = (value: any, column: string, row: any) => {
    if (column.toLowerCase().includes('status')) {
      const isPositive = value.toLowerCase().includes('passed') || 
                        value.toLowerCase().includes('approved') || 
                        value.toLowerCase().includes('scheduled');
      return (
        <Badge 
          variant={isPositive ? 'default' : 'secondary'}
          className={isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
        >
          {value}
        </Badge>
      );
    }
    return <span className="text-gray-700">{value}</span>;
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold text-gray-800">{title}</CardTitle>
        <CardDescription className="text-gray-600">{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                {columns.map((column, index) => (
                  <th 
                    key={index}
                    className="text-left py-3 px-4 font-semibold text-gray-700 text-sm"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr 
                  key={rowIndex}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                >
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="py-3 px-4">
                      {(renderCell || defaultRenderCell)(row[column.toLowerCase().replace(/\s+/g, '')], column, row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

interface NotificationListProps {
  title: string;
  subtitle: string;
  notifications: any[];
}

export const NotificationList: React.FC<NotificationListProps> = ({ 
  title, 
  subtitle, 
  notifications 
}) => {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold text-gray-800">{title}</CardTitle>
        <CardDescription className="text-gray-600">{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div 
              key={notification.id}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="text-2xl">{notification.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  {notification.title}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-500">
                  {notification.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="w-full text-center text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors duration-200">
            View All
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
