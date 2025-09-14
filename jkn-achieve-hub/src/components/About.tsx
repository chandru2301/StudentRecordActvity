import { Card, CardContent } from "@/components/ui/card";
import { 
  Award, 
  Shield, 
  Users, 
  BarChart3, 
  Lock, 
  Globe, 
  Smartphone, 
  Zap 
} from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Award,
      title: "Smart India Hackathon Development",     
    },
    {
      icon: Users,
      title: "Centralized Digital Records",
      description: "Centralized and digitized records of academic, co-curricular, and extracurricular achievements"
    },
    {
      icon: Shield,
      title: "Secure Validation System",
      description: "Secure and transparent validation system for faculty with comprehensive oversight"
    },
    {
      icon: Award,
      title: "Verified Digital Portfolios",
      description: "Verified digital portfolios for students showcasing authenticated achievements"
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Real-time analytics and reporting tools for data-driven decision making"
    },
    {
      icon: Lock,
      title: "Data Privacy & Security",
      description: "Ensures data privacy and robust backend architecture with enterprise-grade security"
    },
    {
      icon: Globe,
      title: "Scalable & Multilingual",
      description: "Scalable, multilingual, and mobile-responsive platform design"
    },
    {
      icon: Zap,
      title: "Future-Ready Integration",
      description: "Future-ready with integration capabilities into national educational systems"
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-hero">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            About the Platform
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            A revolutionary digital ecosystem transforming how Higher Education Institutions 
            in    track, validate, and celebrate student achievements.
          </p>
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent-foreground px-6 py-3 rounded-full text-sm font-semibold">
            <Award className="h-4 w-4" />
            Smart India Hackathon 2025 Initiative
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="shadow-card hover:shadow-soft transition-smooth bg-card/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-2 text-sm">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-8 shadow-card">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-heading font-bold text-foreground">
                  Transforming Education in J&K
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our platform represents a significant leap forward in educational technology, 
                  designed specifically for the unique needs of Higher Education Institutions 
                  across   .
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm text-muted-foreground">    Initiative</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <span className="text-sm text-muted-foreground">Multi-institutional Support</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-sm text-muted-foreground">Comprehensive Achievement Tracking</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary/5 rounded-lg p-4 text-center">
                <div className="text-2xl font-heading font-bold text-primary mb-1">50K+</div>
                <div className="text-sm text-muted-foreground">Students Enrolled</div>
              </div>
              <div className="bg-secondary/5 rounded-lg p-4 text-center">
                <div className="text-2xl font-heading font-bold text-secondary mb-1">100+</div>
                <div className="text-sm text-muted-foreground">Institutions</div>
              </div>
              <div className="bg-accent/5 rounded-lg p-4 text-center">
                <div className="text-2xl font-heading font-bold text-accent-foreground mb-1">1M+</div>
                <div className="text-sm text-muted-foreground">Records Managed</div>
              </div>
              <div className="bg-muted rounded-lg p-4 text-center">
                <div className="text-2xl font-heading font-bold text-foreground mb-1">24/7</div>
                <div className="text-sm text-muted-foreground">Platform Access</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;