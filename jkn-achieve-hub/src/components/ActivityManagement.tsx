import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Calendar,
  List,
  Plus,
  BarChart3,
  Users,
  Activity as ActivityIcon,
  Menu,
  LogOut,
  User
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ActivityForm from './ActivityForm';
import ActivityList from './ActivityList';
import ActivityDetail from './ActivityDetail';

interface ActivityManagementProps {
  studentId?: number;
  showAll?: boolean;
}

const ActivityManagement: React.FC<ActivityManagementProps> = ({ 
  studentId, 
  showAll = false 
}) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('list');
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<any>(null);

  const handleActivitySelect = (activityId: number) => {
    setSelectedActivityId(activityId);
    setActiveTab('detail');
  };

  const handleEditActivity = (activity: any) => {
    setEditingActivity(activity);
    setShowForm(true);
  };

  const handleDeleteActivity = (activityId: number) => {
    setSelectedActivityId(null);
    setActiveTab('list');
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingActivity(null);
    setActiveTab('list');
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingActivity(null);
  };

  const handleBackToList = () => {
    setSelectedActivityId(null);
    setActiveTab('list');
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Custom Header with Sidebar Trigger */}
        <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200/50">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-gray-100" />
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <ActivityIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="font-semibold text-lg text-gray-900">
                    {showAll ? 'All Activities' : 'My Activities'}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {showAll ? 'Manage all student activities' : 'Track your activities'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* User Menu */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">{user.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => window.location.href = '/dashboard'}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.location.href = user.role === 'STUDENT' ? '/student/profile' : '/faculty/profile'}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="space-y-6">
            {/* Header */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ActivityIcon className="h-6 w-6" />
                  Student Activity Management
                </CardTitle>
                <CardDescription>
                  {showAll 
                    ? 'Manage and track all student activities across the institution' 
                    : 'Track and manage your academic and extracurricular activities'
                  }
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Activities</p>
                      <p className="text-2xl font-bold text-gray-900">-</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <ActivityIcon className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">This Month</p>
                      <p className="text-2xl font-bold text-gray-900">-</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Active Students</p>
                      <p className="text-2xl font-bold text-gray-900">-</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <BarChart3 className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                      <p className="text-2xl font-bold text-gray-900">-</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <List className="h-4 w-4" />
                  Activity List
                </TabsTrigger>
                <TabsTrigger value="detail" disabled={!selectedActivityId} className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Activity Detail
                </TabsTrigger>
                <TabsTrigger value="form" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Activity
                </TabsTrigger>
              </TabsList>

              <TabsContent value="list" className="space-y-4">
                <ActivityList
                  studentId={studentId}
                  showAll={showAll}
                  onActivitySelect={handleActivitySelect}
                  onEditActivity={handleEditActivity}
                  onDeleteActivity={handleDeleteActivity}
                />
              </TabsContent>

              <TabsContent value="detail" className="space-y-4">
                {selectedActivityId ? (
                  <ActivityDetail
                    activityId={selectedActivityId}
                    onBack={handleBackToList}
                    onEdit={handleEditActivity}
                    onDelete={handleDeleteActivity}
                  />
                ) : (
                  <Card>
                    <CardContent className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Activity Selected</h3>
                      <p className="text-gray-500 mb-4">Select an activity from the list to view details.</p>
                      <Button onClick={handleBackToList}>
                        Back to List
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="form" className="space-y-4">
                <ActivityForm
                  onSuccess={handleFormSuccess}
                  onCancel={() => setActiveTab('list')}
                  initialData={editingActivity}
                  isEditing={!!editingActivity}
                  activityId={editingActivity?.id}
                />
              </TabsContent>
            </Tabs>

            {/* Form Modal (for editing) */}
            {showForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <ActivityForm
                    onSuccess={handleFormSuccess}
                    onCancel={handleFormCancel}
                    initialData={editingActivity}
                    isEditing={!!editingActivity}
                    activityId={editingActivity?.id}
                  />
                </div>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default ActivityManagement;
