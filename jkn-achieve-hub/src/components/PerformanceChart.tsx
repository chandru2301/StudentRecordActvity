import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { TrendingUp, Filter } from 'lucide-react';

interface PerformanceData {
  subject: string;
  score: number;
  fullMark: number;
}

interface PerformanceChartProps {
  title: string;
  data: PerformanceData[];
  timeFilters?: string[];
  onFilterChange?: (filter: string) => void;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({
  title,
  data,
  timeFilters = ['Last 7 Days', 'Last 30 Days', 'All Time'],
  onFilterChange
}) => {
  const [selectedFilter, setSelectedFilter] = React.useState('All Time');

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    onFilterChange?.(filter);
  };

  // Transform data for radar chart
  const chartData = data.map(item => ({
    subject: item.subject,
    A: item.score,
    fullMark: item.fullMark
  }));

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-xl font-semibold text-gray-800">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          {timeFilters.map(filter => (
            <Button
              key={filter}
              size="sm"
              variant={selectedFilter === filter ? "default" : "outline"}
              className={`text-xs px-3 py-1 h-7 ${
                selectedFilter === filter
                  ? 'bg-purple-500 hover:bg-purple-600 text-white'
                  : 'bg-white hover:bg-purple-50 text-gray-600 border-gray-200'
              }`}
              onClick={() => handleFilterChange(filter)}
            >
              {filter}
            </Button>
          ))}
        </div>

        {/* Chart */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fontSize: 12, fill: '#374151' }}
                className="text-gray-600"
              />
              <PolarRadiusAxis 
                angle={0} 
                domain={[0, 10]} 
                tick={{ fontSize: 10, fill: '#6b7280' }}
              />
              <Radar
                name="Performance"
                dataKey="A"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Summary */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(data.reduce((sum, item) => sum + item.score, 0) / data.length * 10) / 10}
            </div>
            <div className="text-sm text-gray-600">Average Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {data.filter(item => item.score >= 8).length}
            </div>
            <div className="text-sm text-gray-600">Strong Subjects</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
export type { PerformanceData };
