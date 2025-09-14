import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Plus,
  Trash2,
  Users,
  Calendar as EventIcon,
  Save,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

interface Participant {
  id: string;
  name: string;
  className: string;
  department: string;
}

interface EventFormData {
  eventType: string;
  fromDate: string;
  toDate: string;
  participants: Participant[];
}

const EventForm: React.FC = () => {
  const [formData, setFormData] = useState<EventFormData>({
    eventType: '',
    fromDate: '',
    toDate: '',
    participants: [
      { id: '1', name: '', className: '', department: '' }
    ]
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const eventTypes = [
    { value: 'ACADEMIC', label: 'Academic Event' },
    { value: 'CULTURAL', label: 'Cultural Event' },
    { value: 'SPORTS', label: 'Sports Event' }
  ];

  const departments = [
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

  const classes = [
    'X', 'XI', 'XII',
    'I Year', 'II Year', 'III Year', 'IV Year',
    'Masters I', 'Masters II',
    'PhD'
  ];

  const addParticipant = () => {
    const newParticipant: Participant = {
      id: Date.now().toString(),
      name: '',
      className: '',
      department: ''
    };
    setFormData(prev => ({
      ...prev,
      participants: [...prev.participants, newParticipant]
    }));
  };

  const removeParticipant = (id: string) => {
    if (formData.participants.length > 1) {
      setFormData(prev => ({
        ...prev,
        participants: prev.participants.filter(p => p.id !== id)
      }));
    }
  };

  const updateParticipant = (id: string, field: keyof Participant, value: string) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.map(p =>
        p.id === id ? { ...p, [field]: value } : p
      )
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.eventType) {
      newErrors.eventType = 'Event type is required';
    }

    if (!formData.fromDate) {
      newErrors.fromDate = 'From date is required';
    }

    if (!formData.toDate) {
      newErrors.toDate = 'To date is required';
    }

    if (formData.fromDate && formData.toDate && formData.fromDate > formData.toDate) {
      newErrors.toDate = 'To date must be after from date';
    }

    // Validate participants
    formData.participants.forEach((participant, index) => {
      if (!participant.name.trim()) {
        newErrors[`participant_${index}_name`] = 'Student name is required';
      }
      if (!participant.className) {
        newErrors[`participant_${index}_className`] = 'Class is required';
      }
      if (!participant.department) {
        newErrors[`participant_${index}_department`] = 'Department is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        eventType: formData.eventType,
        fromDate: formData.fromDate,
        toDate: formData.toDate,
        participants: formData.participants.map(p => ({
          name: p.name,
          className: p.className,
          department: p.department
        }))
      };

      const response = await fetch('http://localhost:8081/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success('Event created successfully!');
        // Reset form
        setFormData({
          eventType: '',
          fromDate: '',
          toDate: '',
          participants: [{ id: '1', name: '', className: '', department: '' }]
        });
        setErrors({});
      } else {
        toast.error('Failed to create event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('An error occurred while creating the event');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <EventIcon className="h-6 w-6 text-blue-600" />
            Create New Event
          </CardTitle>
          <CardDescription className="text-base">
            Add event details and participant information
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eventType" className="text-sm font-medium">
                  Event Type *
                </Label>
                <Select
                  value={formData.eventType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, eventType: value }))}
                >
                  <SelectTrigger className={errors.eventType ? 'border-red-500' : ''}>
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
                {errors.eventType && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.eventType}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fromDate" className="text-sm font-medium">
                  From Date *
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="fromDate"
                    type="date"
                    value={formData.fromDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, fromDate: e.target.value }))}
                    className={`pl-10 ${errors.fromDate ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.fromDate && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.fromDate}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="toDate" className="text-sm font-medium">
                  To Date *
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="toDate"
                    type="date"
                    value={formData.toDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, toDate: e.target.value }))}
                    className={`pl-10 ${errors.toDate ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.toDate && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.toDate}
                  </p>
                )}
              </div>
            </div>

            {/* Participants Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  Participants ({formData.participants.length})
                </h3>
                <Button
                  type="button"
                  onClick={addParticipant}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Participant
                </Button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {formData.participants.map((participant, index) => (
                  <Card key={participant.id} className="bg-gray-50/50 border-gray-200">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                        <div className="md:col-span-2">
                          <Label htmlFor={`participant-${participant.id}-name`}>
                            Student Name *
                          </Label>
                          <Input
                            id={`participant-${participant.id}-name`}
                            placeholder="e.g., John Doe"
                            value={participant.name}
                            onChange={(e) => updateParticipant(participant.id, 'name', e.target.value)}
                            className={errors[`participant_${index}_name`] ? 'border-red-500' : ''}
                          />
                          {errors[`participant_${index}_name`] && (
                            <p className="text-xs text-red-500 mt-1">
                              {errors[`participant_${index}_name`]}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor={`participant-${participant.id}-className`}>
                            Class *
                          </Label>
                          <Select
                            value={participant.className}
                            onValueChange={(value) => updateParticipant(participant.id, 'className', value)}
                          >
                            <SelectTrigger className={errors[`participant_${index}_className`] ? 'border-red-500' : ''}>
                              <SelectValue placeholder="Select class" />
                            </SelectTrigger>
                            <SelectContent>
                              {classes.map((cls) => (
                                <SelectItem key={cls} value={cls}>
                                  {cls}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors[`participant_${index}_className`] && (
                            <p className="text-xs text-red-500 mt-1">
                              {errors[`participant_${index}_className`]}
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <div className="flex-1">
                            <Label htmlFor={`participant-${participant.id}-department`}>
                              Department *
                            </Label>
                            <Select
                              value={participant.department}
                              onValueChange={(value) => updateParticipant(participant.id, 'department', value)}
                            >
                              <SelectTrigger className={errors[`participant_${index}_department`] ? 'border-red-500' : ''}>
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
                            {errors[`participant_${index}_department`] && (
                              <p className="text-xs text-red-500 mt-1">
                                {errors[`participant_${index}_department`]}
                              </p>
                            )}
                          </div>
                          
                          {formData.participants.length > 1 && (
                            <Button
                              type="button"
                              onClick={() => removeParticipant(participant.id)}
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Event...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Create Event
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventForm;
