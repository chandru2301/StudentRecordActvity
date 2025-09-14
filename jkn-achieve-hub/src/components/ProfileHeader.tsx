import React from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  MessageCircle, 
  Phone, 
  Edit, 
  ExternalLink,
  MapPin,
  Calendar,
  GraduationCap,
  Building,
  User,
  Mail
} from 'lucide-react';

interface ProfileInfo {
  dateOfBirth?: string;
  enrollment?: string;
  orderNumber?: string;
  bloodType?: string;
  allergies?: string;
  chronicDisease?: string;
  dateOfJoining?: string;
  role?: string;
  specialization?: string;
  officeHours?: string;
  facultyId?: string;
}

interface ProfileHeaderProps {
  profileImage: string;
  name: string;
  classOrDepartment: string;
  location: string;
  profileInfo: ProfileInfo;
  isStudent: boolean;
  onEdit?: () => void;
  onMessage?: () => void;
  onCall?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profileImage,
  name,
  classOrDepartment,
  location,
  profileInfo,
  isStudent,
  onEdit,
  onMessage,
  onCall
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Profile Section */}
      <div className="lg:col-span-2">
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Profile Picture */}
              <div className="relative">
                <Avatar className="w-24 h-24 ring-4 ring-purple-100 shadow-lg">
                  <AvatarImage src={profileImage} alt={name} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-400 to-purple-600 text-white text-2xl font-bold">
                    {name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-3">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">{name}</h1>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <span className="font-medium">{classOrDepartment}</span>
                    <ExternalLink className="w-4 h-4 text-purple-500" />
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>{location}</span>
                  </div>
                </div>

                {/* Contact Buttons */}
                <div className="flex gap-3">
                  <Button
                    size="sm"
                    className="bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full p-2 h-10 w-10"
                    onClick={onMessage}
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    className="bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full p-2 h-10 w-10"
                    onClick={onCall}
                  >
                    <Phone className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Details */}
      <div className="lg:col-span-1">
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Personal Details</h3>
              <Button
                size="sm"
                variant="ghost"
                className="text-gray-500 hover:text-gray-700 p-1 h-8 w-8"
                onClick={onEdit}
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {isStudent ? (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">Date of Birth</span>
                    </div>
                    <span className="text-sm font-medium text-gray-800">
                      {profileInfo.dateOfBirth}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <GraduationCap className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">Enrollment</span>
                    </div>
                    <span className="text-sm font-medium text-gray-800">
                      {profileInfo.enrollment}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">Order N</span>
                    </div>
                    <span className="text-sm font-medium text-gray-800">
                      {profileInfo.orderNumber}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="text-sm">Blood Type</span>
                    </div>
                    <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                      {profileInfo.bloodType}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="text-sm">Allergies</span>
                    </div>
                    <span className="text-sm font-medium text-gray-800">
                      {profileInfo.allergies}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="text-sm">Chronic Disease</span>
                    </div>
                    <span className="text-sm font-medium text-gray-800">
                      {profileInfo.chronicDisease}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">Date of Joining</span>
                    </div>
                    <span className="text-sm font-medium text-gray-800">
                      {profileInfo.dateOfJoining}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Building className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">Role</span>
                    </div>
                    <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                      {profileInfo.role}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <GraduationCap className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">Specialization</span>
                    </div>
                    <span className="text-sm font-medium text-gray-800">
                      {profileInfo.specialization}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">Office Hours</span>
                    </div>
                    <span className="text-sm font-medium text-gray-800">
                      {profileInfo.officeHours}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">Faculty ID</span>
                    </div>
                    <span className="text-sm font-medium text-gray-800">
                      {profileInfo.facultyId}
                    </span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileHeader;
