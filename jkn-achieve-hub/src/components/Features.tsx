import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CheckCircle, 
  BarChart3, 
  Calendar,
  MessageSquare,
  Calendar as EventIcon,
  FileCheck,
  Clock,
  Bell,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import CGPACalculator from "./CGPACalculator";

const Features = () => {
  const features = [
    {
      icon: CheckCircle,
      title: "Student Activity Validation",
      description: "Comprehensive validation system for academic and extracurricular achievements",
      color: "text-green-600"
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Advanced analytics for course performance and progress tracking",
      color: "text-blue-600"
    },
    {
      icon: Calendar,
      title: "Attendance Monitoring",
      description: "Real-time attendance tracking with automated notifications",
      color: "text-purple-600"
    },
    {
      icon: MessageSquare,
      title: "Feedback & Mentoring",
      description: "Digital mentoring logs and structured feedback system",
      color: "text-orange-600"
    },
    {
      icon: EventIcon,
      title: "Event Participation",
      description: "Track and validate participation in various institutional events",
      color: "text-indigo-600"
    },
    {
      icon: FileCheck,
      title: "Document Management",
      description: "Secure document upload, review, and approval workflows",
      color: "text-teal-600"
    },
    {
      icon: Clock,
      title: "Faculty Scheduling",
      description: "Integrated calendar and schedule management for faculty",
      color: "text-red-600"
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Real-time alerts for deadlines, events, and important updates",
      color: "text-yellow-600"
    },
    {
      icon: TrendingUp,
      title: "Dashboard Analytics",
      description: "Comprehensive insights and data visualization tools",
      color: "text-pink-600"
    },
    {
      icon: AlertTriangle,
      title: "Risk Indicators",
      description: "Early warning system for academic performance risks",
      color: "text-red-500"
    }
  ];

  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Platform Features & Tools
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Comprehensive suite of digital tools designed to streamline achievement tracking, 
            validation, and institutional management for enhanced educational outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* CGPA Calculator - Special interactive component */}
          <CGPACalculator />
          
          {/* Regular feature cards */}
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="shadow-card hover:shadow-soft transition-smooth border-0 bg-card/50 hover:bg-card">
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-3`}>
                    <IconComponent className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-lg font-heading">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;