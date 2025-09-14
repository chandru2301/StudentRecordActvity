import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink,
  Heart,
  ArrowUp
} from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
      </div>
      
      <div className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Enhanced Brand & Description */}
              <div className="space-y-6 group">
                <div className="flex items-center space-x-4 group-hover:scale-105 transition-transform duration-300">
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300">
                    <span className="text-white font-bold text-2xl"></span>
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-2xl text-white group-hover:text-blue-300 transition-colors duration-300">
                      EduTracker
                    </h3>                    
                  </div>
                </div>
                <p className="text-blue-100 text-sm leading-relaxed font-medium">
                  Empowering educational excellence through innovative achievement tracking 
                  and validation systems.
                </p>
                <div className="flex space-x-4">
                  {[
                    { icon: Facebook, href: "#", color: "hover:text-blue-400" },
                    { icon: Twitter, href: "#", color: "hover:text-cyan-400" },
                    { icon: Linkedin, href: "#", color: "hover:text-blue-500" }
                  ].map((social, index) => (
                    <a 
                      key={index}
                      href={social.href} 
                      className={`w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:rotate-6 ${social.color} group/social`}
                    >
                      <social.icon className="h-5 w-5 text-blue-200 group-hover/social:text-white transition-colors duration-300" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Enhanced Quick Links */}
              <div className="space-y-6">
                <h4 className="font-heading font-bold text-xl text-white relative">
                  Quick Links
                  <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"></div>
                </h4>
                <div className="space-y-3">
                  {[
                    { name: "Home", href: "/" },
                    { name: "About Platform", href: "#about" },
                    { name: "Services", href: "#services" },
                    { name: "Student Login", href: "/login" },
                    { name: "Faculty Login", href: "/login" },
                  ].map((link, index) => (
                    <a 
                      key={link.name}
                      href={link.href} 
                      className="block text-blue-200 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-2 group/link"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 opacity-0 group-hover/link:opacity-100 transition-opacity duration-300"></span>
                        {link.name}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Enhanced Support */}
              <div className="space-y-6">
                <h4 className="font-heading font-bold text-xl text-white relative">
                  Support
                  <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"></div>
                </h4>
                <div className="space-y-3">
                  {[
                    { name: "Help Center", href: "#help" },
                    { name: "User Manual", href: "#" },
                    { name: "Video Tutorials", href: "#" },
                    { name: "Technical Support", href: "#" },
                    { name: "Report Issues", href: "#" },
                  ].map((link, index) => (
                    <a 
                      key={link.name}
                      href={link.href} 
                      className="block text-blue-200 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-2 group/link"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-3 opacity-0 group-hover/link:opacity-100 transition-opacity duration-300"></span>
                        {link.name}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Enhanced Contact */}
              <div className="space-y-6">
                <h4 className="font-heading font-bold text-xl text-white relative">
                  Contact Info
                  <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                </h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl hover:bg-white/10 transition-all duration-300 group/contact">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg group-hover/contact:shadow-xl transition-all duration-300">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-blue-200 text-sm font-medium">trichy, Tamil Nadu</span>
                    <div>
                     
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl hover:bg-white/10 transition-all duration-300 group/contact">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg group-hover/contact:shadow-xl transition-all duration-300">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-blue-200 text-sm font-medium">support@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl hover:bg-white/10 transition-all duration-300 group/contact">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover/contact:shadow-xl transition-all duration-300">
                      <Phone className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-blue-200 text-sm font-medium">+91-XXX-XXX-XXXX</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Bottom Bar */}
          <div className="border-t border-white/20 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-blue-200 text-sm text-center md:text-left font-medium">
                © 2025 Government of   . All rights reserved.
                <span className="flex items-center justify-center md:justify-start mt-2">
                  Made with <Heart className="h-4 w-4 text-red-400 mx-1 animate-pulse" /> for education
                </span>
              </div>
              <div className="flex items-center gap-6 text-sm">
                {[
                  { name: "Privacy Policy", href: "#" },
                  { name: "Terms of Service", href: "#" },
                  { name: "Accessibility", href: "#" }
                ].map((link, index) => (
                  <a 
                    key={link.name}
                    href={link.href} 
                    className="text-blue-200 hover:text-white transition-all duration-300 flex items-center gap-2 group/link hover:scale-105"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {link.name} 
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover/link:opacity-100 transition-opacity duration-300" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 z-50 group"
      >
        <ArrowUp className="h-6 w-6 mx-auto group-hover:-translate-y-1 transition-transform duration-300" />
      </button>
    </footer>
  );
};

export default Footer;