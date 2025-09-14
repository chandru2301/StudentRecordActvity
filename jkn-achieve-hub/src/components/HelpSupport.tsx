import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Book, 
  HelpCircle, 
  Wrench, 
  MessageCircle, 
  Mail, 
  Video, 
  MessageSquare, 
  Accessibility 
} from "lucide-react";

const HelpSupport = () => {
  const supportSections = [
    {
      icon: Book,
      title: "Getting Started",
      description: "Complete quick-start guide for new users to navigate the platform effectively",
      action: "View Guide",
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: HelpCircle,
      title: "Frequently Asked Questions",
      description: "Find answers to commonly asked questions about platform features and usage",
      action: "Browse FAQs",
      color: "bg-green-50 text-green-600"
    },
    {
      icon: Wrench,
      title: "Technical Support",
      description: "Troubleshooting guides and technical assistance for platform issues",
      action: "Get Help",
      color: "bg-orange-50 text-orange-600"
    },
    {
      icon: MessageCircle,
      title: "Live Chat Support",
      description: "Real-time assistance from our support team during business hours",
      action: "Start Chat",
      color: "bg-purple-50 text-purple-600"
    },
    {
      icon: Mail,
      title: "Contact Us",
      description: "Reach out via email, phone, or contact form for detailed assistance",
      action: "Contact",
      color: "bg-red-50 text-red-600"
    },
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Step-by-step video tutorials covering all platform features",
      action: "Watch Now",
      color: "bg-indigo-50 text-indigo-600"
    },
    {
      icon: MessageSquare,
      title: "Feedback & Suggestions",
      description: "Share your feedback, report bugs, or suggest new features",
      action: "Give Feedback",
      color: "bg-pink-50 text-pink-600"
    },
    {
      icon: Accessibility,
      title: "Accessibility Support",
      description: "Inclusive support resources and accessibility features information",
      action: "Learn More",
      color: "bg-teal-50 text-teal-600"
    }
  ];

  return (
    <section id="help" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Help & Support Center
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Comprehensive support resources to help you make the most of the 
            Student Achievement Tracking Platform. We're here to assist you every step of the way.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {supportSections.map((section, index) => {
            const IconComponent = section.icon;
            return (
              <Card key={index} className="shadow-card hover:shadow-soft transition-smooth group cursor-pointer">
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 rounded-lg ${section.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg font-heading">{section.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="leading-relaxed">
                    {section.description}
                  </CardDescription>
                  <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                    {section.action}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-primary text-white rounded-2xl p-8 shadow-card">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h3 className="text-2xl font-heading font-bold">Need Immediate Assistance?</h3>
              <p className="text-white/90 leading-relaxed">
                Our dedicated support team is available to help you with any questions 
                or technical issues you may encounter while using the platform.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-white/80" />
                  <span className="text-white/90">support@jkedutracker.gov.in</span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-5 w-5 text-white/80" />
                  <span className="text-white/90">Live Chat: Monday - Friday, 9 AM - 6 PM</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-heading font-semibold">Quick Actions</h4>
              <div className="space-y-3">
                <Button variant="secondary" className="w-full justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Start Live Chat
                </Button>
                <Button variant="outline" className="w-full justify-start bg-white/10 text-white border-white/30 hover:bg-white/20">
                  <Book className="h-4 w-4 mr-2" />
                  Download User Manual
                </Button>
                <Button variant="outline" className="w-full justify-start bg-white/10 text-white border-white/30 hover:bg-white/20">
                  <Video className="h-4 w-4 mr-2" />
                  Watch Training Videos
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HelpSupport;