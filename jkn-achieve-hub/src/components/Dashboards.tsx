import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  User,
  GraduationCap,
  Activity,
  Upload,
  Bell,
  FileText,
  Shield,
  BarChart3,
  Database,
  MessageCircle
} from "lucide-react";

const Dashboards = () => {
  const studentFeatures = [
    {
      icon: Activity,
      title: "Student Activity Tracker",
      description: "Comprehensive tracking of academic, co-curricular, and extracurricular achievements"
    },
    {
      icon: Upload,
      title: "Document Upload & Verification",
      description: "Secure upload system with automated verification and approval workflows"
    },
    {
      icon: Bell,
      title: "Event & Deadline Alerts",
      description: "Smart notifications for upcoming events, deadlines, and important announcements"
    },
    {
      icon: FileText,
      title: "Comprehensive Reports",
      description: "Generate detailed academic and achievement reports for various purposes"
    }
  ];

  const facultyFeatures = [
    {
      icon: Shield,
      title: "Faculty Validation Portal",
      description: "Streamlined validation interface for reviewing and approving student achievements"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Advanced analytics and insights for institutional performance monitoring"
    },
    {
      icon: Database,
      title: "Institutional Data Management",
      description: "Centralized management of student records and institutional data"
    },
    {
      icon: MessageCircle,
      title: "Feedback & Support System",
      description: "Integrated communication tools for student mentoring and support"
    }
  ];

  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Specialized Dashboards
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Tailored interfaces designed for students and faculty to maximize productivity 
            and streamline achievement tracking workflows.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Student Dashboard */}
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-heading font-bold text-foreground">Student Dashboard</h3>
                  <p className="text-muted-foreground">Empowering students with comprehensive tracking tools</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {studentFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <Card key={index} className="shadow-card border-l-4 border-l-primary">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-heading font-semibold text-foreground">{feature.title}</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Button variant="primary" className="w-full lg:w-auto">
              Access Student Dashboard
            </Button>
          </div>

          {/* Faculty Dashboard */}
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="text-2xl font-heading font-bold text-foreground">Faculty Dashboard</h3>
                  <p className="text-muted-foreground">Advanced tools for faculty and institutional management</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {facultyFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <Card key={index} className="shadow-card border-l-4 border-l-secondary">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <IconComponent className="h-5 w-5 text-secondary" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-heading font-semibold text-foreground">{feature.title}</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Button variant="secondary" className="w-full lg:w-auto">
              Access Faculty Dashboard
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboards;