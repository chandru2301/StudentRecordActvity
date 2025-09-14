import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

const Analytics = () => {
  const studentData = [
    { name: "Excellent", value: 35, fill: "hsl(var(--primary))" },
    { name: "Good", value: 28, fill: "hsl(var(--secondary))" },
    { name: "Average", value: 25, fill: "hsl(var(--accent))" },
    { name: "Below Average", value: 12, fill: "hsl(var(--muted))" }
  ];

  const staffEngagementData = [
    { department: "Computer Science", engagement: 85 },
    { department: "Mathematics", engagement: 78 },
    { department: "Physics", engagement: 82 },
    { department: "Chemistry", engagement: 74 },
    { department: "Literature", engagement: 79 },
    { department: "History", engagement: 71 }
  ];

  const chartConfig = {
    engagement: {
      label: "Engagement %",
      color: "hsl(var(--primary))"
    },
    excellent: {
      label: "Excellent",
      color: "hsl(var(--primary))"
    },
    good: {
      label: "Good", 
      color: "hsl(var(--secondary))"
    },
    average: {
      label: "Average",
      color: "hsl(var(--accent))"
    },
    belowAverage: {
      label: "Below Average",
      color: "hsl(var(--muted))"
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
            Performance Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">
            Comprehensive insights into student performance and staff engagement metrics
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Student Performance Pie Chart */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-heading">Student Performance Distribution</CardTitle>
              <CardDescription>
                Academic performance breakdown across all enrolled students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="min-h-[300px]">
                <PieChart>
                  <Pie
                    data={studentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {studentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Staff Engagement Bar Chart */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-heading">Staff Engagement by Department</CardTitle>
              <CardDescription>
                Faculty engagement levels across different academic departments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="min-h-[300px]">
                <BarChart data={staffEngagementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="department" 
                    fontSize={12}
                    tick={{ fill: "hsl(var(--foreground))" }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    fontSize={12}
                    tick={{ fill: "hsl(var(--foreground))" }}
                  />
                  <Bar 
                    dataKey="engagement" 
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">2,847</div>
              <p className="text-xs text-muted-foreground">+12% from last semester</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">78.5%</div>
              <p className="text-xs text-muted-foreground">+5.2% improvement</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Faculty Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">78.2%</div>
              <p className="text-xs text-muted-foreground">+3.1% this month</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">94.3%</div>
              <p className="text-xs text-muted-foreground">+1.8% this year</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;