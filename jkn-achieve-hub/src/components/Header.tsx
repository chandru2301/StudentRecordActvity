import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, ChevronDown, LogOut, User, Eye, Settings } from "lucide-react";
import { useRole } from "../hooks/useRole";
import { useAuth } from "../contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { 
    displayName, 
    profileInfo, 
    navigationItems, 
    isStudent, 
    isFaculty, 
    isAdmin,
    defaultRoute 
  } = useRole();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDashboardClick = () => {
    navigate(defaultRoute);
  };

  const handleViewProfile = () => {
    if (isStudent) {
      navigate('/student/profile');
    } else if (isFaculty) {
      navigate('/faculty/profile');
    } else if (isAdmin) {
      navigate('/admin/profile');
    }
  };

  // Filter navigation items based on authentication and permissions
  const filteredNavigation = navigationItems.filter(item => {
    if (item.requiresAuth && !user) return false;
    return true;
  });

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Enhanced Logo */}
          <div className="flex items-center space-x-4 group">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <span className="text-white font-bold text-xl"></span>
            </div>
            <div>
              <h1 className="font-heading font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                EduTracker
              </h1>
            </div>
          </div>

          {/* Conditional Navigation - Only show for non-logged in users */}
          {!user && (
            <nav className="hidden lg:flex items-center space-x-2">
              {filteredNavigation.map((item, index) => (
                item.href.startsWith('#') ? (
                  <a
                    key={item.name}
                    href={item.href}
                    className="relative px-4 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all duration-300 rounded-lg hover:bg-blue-50 group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className="relative z-10">{item.name}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="relative px-4 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all duration-300 rounded-lg hover:bg-blue-50 group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className="relative z-10">{item.name}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                )
              ))}
            </nav>
          )}

          {/* Enhanced Action Buttons & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              // User is logged in - show simplified layout with user dropdown
              <>
                <div className="hidden sm:flex items-center space-x-3">
                  <Badge 
                    variant={isStudent ? 'default' : isFaculty ? 'secondary' : 'destructive'} 
                    className={`px-3 py-1 text-xs font-semibold shadow-md hover:shadow-lg transition-all duration-300 ${
                      isStudent 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' 
                        : isFaculty
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
                        : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                    }`}
                  >
                    {isStudent ? '🎓 Student' : isFaculty ? '👨‍🏫 Faculty' : '⚙️ Admin'}
                  </Badge>
                  <span className="text-sm font-medium text-gray-700">
                    {profileInfo.name}
                  </span>
                </div>
                
                {/* User Dropdown Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-10 w-10 rounded-full border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      <User className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium text-gray-900">{profileInfo.name}</p>
                      <p className="text-xs text-gray-500">{profileInfo.email}</p>
                      <p className="text-xs text-gray-400">{profileInfo.role}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleViewProfile} className="cursor-pointer">
                      <Eye className="h-4 w-4 mr-2" />
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDashboardClick} className="cursor-pointer">
                      <Settings className="h-4 w-4 mr-2" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              // User is not logged in - show login and register buttons
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="hidden sm:inline-flex px-4 py-2 border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 shadow-md hover:shadow-lg"
                  onClick={handleLoginClick}
                >
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  className="hidden sm:inline-flex px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  onClick={handleRegisterClick}
                >
                  <span className="mr-2">✨</span>
                  Register
                </Button>
              </>
            )}
            
            {/* Enhanced Mobile menu button - Only show for non-logged in users */}
            {!user && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-3 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <div className="relative w-6 h-6">
                  <Menu 
                    size={24} 
                    className={`absolute inset-0 transition-all duration-300 ${isMenuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`} 
                  />
                  <X 
                    size={24} 
                    className={`absolute inset-0 transition-all duration-300 ${isMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} 
                  />
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Enhanced Mobile Navigation - Only show for non-logged in users */}
        {!user && (
          <div className={`lg:hidden transition-all duration-500 ease-in-out overflow-hidden ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="py-6 border-t border-gray-200/50 bg-white/95 backdrop-blur-sm">
              <div className="flex flex-col space-y-3">
                {filteredNavigation.map((item, index) => (
                  item.href.startsWith('#') ? (
                    <a
                      key={item.name}
                      href={item.href}
                      className="flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all duration-300 rounded-xl hover:bg-blue-50 group"
                      onClick={() => setIsMenuOpen(false)}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <span>{item.name}</span>
                      <ChevronDown className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </a>
                  ) : (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all duration-300 rounded-xl hover:bg-blue-50 group"
                      onClick={() => setIsMenuOpen(false)}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <span>{item.name}</span>
                      <ChevronDown className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>
                  )
                ))}
                <div className="pt-4 space-y-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full px-6 py-3 border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 shadow-md hover:shadow-lg"
                    onClick={handleLoginClick}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={handleRegisterClick}
                  >
                    <span className="mr-2">✨</span>
                    Register Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;