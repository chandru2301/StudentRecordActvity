import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  CheckCircle, 
  XCircle, 
  FileText, 
  ExternalLink,
  Filter,
  Calendar
} from 'lucide-react';

interface FeedbackEntry {
  id: string;
  teacherName: string;
  teacherImage: string;
  subject: string;
  date: string;
  lesson: string;
  comment: string;
  grade: number;
  status: 'completed' | 'pending' | 'overdue';
  homework?: string;
}

interface FeedbackCardProps {
  feedback: FeedbackEntry;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <XCircle className="w-4 h-4 text-yellow-500" />;
      case 'overdue':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 9) return 'bg-green-100 text-green-700 border-green-200';
    if (grade >= 7) return 'bg-purple-100 text-purple-700 border-purple-200';
    if (grade >= 5) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Teacher Avatar */}
          <Avatar className="w-10 h-10 ring-2 ring-purple-100">
            <AvatarImage src={feedback.teacherImage} alt={feedback.teacherName} />
            <AvatarFallback className="bg-gradient-to-br from-purple-400 to-purple-600 text-white text-sm">
              {feedback.teacherName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>

          {/* Feedback Content */}
          <div className="flex-1 space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-800">{feedback.teacherName}</span>
                <span className="text-sm text-gray-500">({feedback.subject})</span>
                <span className="text-sm text-gray-400">{feedback.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={`text-xs ${getGradeColor(feedback.grade)}`}>
                  {feedback.grade}
                </Badge>
                <Button size="sm" variant="ghost" className="p-1 h-6 w-6">
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Comment */}
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-700 mb-2">{feedback.comment}</p>
              <p className="text-xs text-gray-500">{feedback.lesson}</p>
              {feedback.homework && (
                <p className="text-xs text-gray-600 mt-1 italic">{feedback.homework}</p>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{feedback.date}</span>
                <div className="flex items-center gap-1">
                  {getStatusIcon(feedback.status)}
                  <span className="text-xs font-medium capitalize">{feedback.status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface FeedbackSectionProps {
  title: string;
  feedbacks: FeedbackEntry[];
  filters?: {
    subjects: string[];
    timePeriods: string[];
  };
  onFilterChange?: (filterType: string, value: string) => void;
}

const FeedbackSection: React.FC<FeedbackSectionProps> = ({
  title,
  feedbacks,
  filters,
  onFilterChange
}) => {
  const [selectedSubject, setSelectedSubject] = React.useState('All');
  const [selectedPeriod, setSelectedPeriod] = React.useState('All');

  const handleSubjectChange = (subject: string) => {
    setSelectedSubject(subject);
    onFilterChange?.('subject', subject);
  };

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    onFilterChange?.('period', period);
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        </div>

        {/* Filters */}
        {filters && (
          <div className="flex flex-wrap gap-4 mb-6">
            {/* Subject Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={selectedSubject}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="All">All Subjects</option>
                {filters.subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            {/* Time Period Filter */}
            <div className="flex gap-2">
              {filters.timePeriods.map(period => (
                <Button
                  key={period}
                  size="sm"
                  variant={selectedPeriod === period ? "default" : "outline"}
                  className={`text-xs px-3 py-1 h-7 ${
                    selectedPeriod === period
                      ? 'bg-purple-500 hover:bg-purple-600 text-white'
                      : 'bg-white hover:bg-purple-50 text-gray-600 border-gray-200'
                  }`}
                  onClick={() => handlePeriodChange(period)}
                >
                  {period}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Feedback List */}
        <div className="space-y-4">
          {feedbacks.map(feedback => (
            <FeedbackCard key={feedback.id} feedback={feedback} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export { FeedbackCard, FeedbackSection };
export type { FeedbackEntry };
