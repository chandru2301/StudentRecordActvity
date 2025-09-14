import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider, SidebarInset } from './ui/sidebar';
import { AppSidebar } from './AppSidebar';
import Header from './Header';
import Footer from './Footer';
import { 
  Calendar,
  List,
  Plus,
  BarChart3,
  Users,
  CalendarDays
} from "lucide-react";
import EventForm from './EventForm';
import EventList from './EventList';

type ViewMode = 'form' | 'list';

const EventManagement: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('list');

  const switchView = (view: ViewMode) => {
    setCurrentView(view);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex">
        {/* Sidebar */}
        <AppSidebar />
        
        {/* Main Content Area */}
        <SidebarInset className="flex-1 flex flex-col">
          {/* Header Component */}
          <Header />
          
          {/* Main Content */}
          <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <CalendarDays className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Event Management System</h1>
                  <p className="text-gray-600">Manage student events and track participation</p>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex gap-2 mb-6">
                <Button
                  onClick={() => switchView('list')}
                  variant={currentView === 'list' ? 'default' : 'outline'}
                  className="flex items-center gap-2"
                >
                  <List className="h-4 w-4" />
                  View Events
                </Button>
                <Button
                  onClick={() => switchView('form')}
                  variant={currentView === 'form' ? 'default' : 'outline'}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create Event
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Total Events</p>
                      <p className="text-2xl font-bold text-blue-900">--</p>
                    </div>
                    <Calendar className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Participants</p>
                      <p className="text-2xl font-bold text-green-900">--</p>
                    </div>
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">This Month</p>
                      <p className="text-2xl font-bold text-purple-900">--</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600">Departments</p>
                      <p className="text-2xl font-bold text-orange-900">9</p>
                    </div>
                    <CalendarDays className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                <CardTitle className="flex items-center gap-2">
                  {currentView === 'form' ? (
                    <>
                      <Plus className="h-5 w-5 text-green-600" />
                      Create New Event
                    </>
                  ) : (
                    <>
                      <List className="h-5 w-5 text-blue-600" />
                      Event List & Management
                    </>
                  )}
                </CardTitle>
                <CardDescription>
                  {currentView === 'form' 
                    ? 'Fill out the form below to create a new event with participants'
                    : 'View, filter, and manage all events and their participants'
                  }
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-0">
                {currentView === 'form' ? <EventForm /> : <EventList />}
              </CardContent>
            </Card>

            {/* Features Overview */}
            <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">System Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Event Creation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Create academic, cultural, and sports events with detailed participant information.
                  Support for multiple participants per event with validation.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5 text-green-600" />
                  Participant Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Track student participation across different departments and classes.
                  Export data to CSV for reporting and analysis.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  Analytics & Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  View comprehensive statistics and filter events by type, department,
                  and date range for better insights.
                </p>
              </CardContent>
            </Card>
              </div>
            </div>
          </main>
        
        {/* Footer Component */}
        <Footer />
      </SidebarInset>
    </div>
  </SidebarProvider>
  );
};

export default EventManagement;
