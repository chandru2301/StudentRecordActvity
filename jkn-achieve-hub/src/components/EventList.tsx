import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Calendar,
  Users,
  Calendar as EventIcon,
  Trash2,
  Filter,
  RefreshCw,
  AlertCircle,
  Eye,
  Download
} from "lucide-react";
import { toast } from "sonner";

interface Participant {
  id: number;
  name: string;
  className: string;
  department: string;
}

interface Event {
  id: number;
  eventType: string;
  fromDate: string;
  toDate: string;
  participants: Participant[];
}

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterDepartment, setFilterDepartment] = useState<string>('ALL');

  const eventTypes = [
    { value: 'ALL', label: 'All Events' },
    { value: 'ACADEMIC', label: 'Academic Events' },
    { value: 'CULTURAL', label: 'Cultural Events' },
    { value: 'SPORTS', label: 'Sports Events' }
  ];

  const departments = [
    'ALL',
    'Computer Science',
    'Electronics',
    'Mechanical',
    'Civil',
    'Electrical',
    'Science',
    'Arts',
    'Commerce',
    'Management'
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [events, filterType, filterDepartment]);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8081/api/events');
      
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        toast.error('Failed to fetch events');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('An error occurred while fetching events');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...events];

    // Filter by event type
    if (filterType !== 'ALL') {
      filtered = filtered.filter(event => event.eventType === filterType);
    }

    // Filter by department
    if (filterDepartment !== 'ALL') {
      filtered = filtered.filter(event => 
        event.participants.some(participant => participant.department === filterDepartment)
      );
    }

    setFilteredEvents(filtered);
  };

  const deleteEvent = async (eventId: number) => {
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8081/api/events/${eventId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Event deleted successfully');
        fetchEvents(); // Refresh the list
      } else {
        toast.error('Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('An error occurred while deleting the event');
    }
  };

  const getEventTypeColor = (eventType: string) => {
    switch (eventType) {
      case 'ACADEMIC':
        return 'bg-blue-100 text-blue-800';
      case 'CULTURAL':
        return 'bg-purple-100 text-purple-800';
      case 'SPORTS':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventTypeIcon = (eventType: string) => {
    switch (eventType) {
      case 'ACADEMIC':
        return '📚';
      case 'CULTURAL':
        return '🎭';
      case 'SPORTS':
        return '⚽';
      default:
        return '📅';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Event ID', 'Event Type', 'From Date', 'To Date', 'Participant Name', 'Class', 'Department'],
      ...filteredEvents.flatMap(event => 
        event.participants.map(participant => [
          event.id,
          event.eventType,
          event.fromDate,
          event.toDate,
          participant.name,
          participant.className,
          participant.department
        ])
      )
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'events_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Events exported to CSV');
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Event Management</h1>
        <p className="text-gray-600">View and manage all student events and participants</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-600" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Event Type</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Department</label>
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end gap-2">
              <Button onClick={fetchEvents} variant="outline" className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={exportToCSV} className="bg-green-600 hover:bg-green-700">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Events Found</h3>
            <p className="text-gray-600">
              {events.length === 0 
                ? 'No events have been created yet.' 
                : 'No events match your current filters.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{getEventTypeIcon(event.eventType)}</div>
                    <div>
                      <CardTitle className="text-xl">
                        Event #{event.id}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(event.fromDate)} - {formatDate(event.toDate)}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getEventTypeColor(event.eventType)}>
                      {event.eventType}
                    </Badge>
                    <Button
                      onClick={() => deleteEvent(event.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Participants ({event.participants.length})
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {event.participants.map((participant) => (
                      <div
                        key={participant.id}
                        className="bg-gray-50 rounded-lg p-3 border"
                      >
                        <div className="font-medium text-gray-900">{participant.name}</div>
                        <div className="text-sm text-gray-600">{participant.className}</div>
                        <div className="text-sm text-gray-500">{participant.department}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Summary Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{filteredEvents.length}</div>
              <div className="text-sm text-gray-600">Total Events</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {filteredEvents.reduce((sum, event) => sum + event.participants.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Participants</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {filteredEvents.filter(e => e.eventType === 'ACADEMIC').length}
              </div>
              <div className="text-sm text-gray-600">Academic Events</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {filteredEvents.filter(e => e.eventType === 'CULTURAL').length}
              </div>
              <div className="text-sm text-gray-600">Cultural Events</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventList;
