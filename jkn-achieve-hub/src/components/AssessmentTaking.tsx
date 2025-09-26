import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft, 
  ArrowRight,
  Save,
  Send,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/hooks/useRole';
import { assessmentService } from '@/services/assessmentService';
import { AssessmentResponse, QuestionResponse, StudentAnswerRequest } from '@/types/assessment';
import { useToast } from '@/hooks/use-toast';

interface QuestionAnswer {
  questionId: number;
  answerText?: string;
  selectedOptions?: number[];
  isCorrect?: boolean;
}

const AssessmentTaking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isStudent, hasPermission } = useRole();
  const { toast } = useToast();

  const [assessment, setAssessment] = useState<AssessmentResponse | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  useEffect(() => {
    const loadAssessment = async () => {
      if (!id) {
        setError('Assessment ID not provided');
        setLoading(false);
        return;
      }

      if (!isStudent || !hasPermission('canTakeAssessments')) {
        setError('You do not have permission to take assessments');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const data = await assessmentService.getAssessmentWithQuestions(parseInt(id));
        setAssessment(data);
        
        // Initialize answers array
        const initialAnswers: QuestionAnswer[] = data.questions.map(q => ({
          questionId: q.id,
          answerText: '',
          selectedOptions: []
        }));
        setAnswers(initialAnswers);
        
        // Calculate time remaining if time limit is set
        if (data.timeLimitMinutes) {
          setTimeRemaining(data.timeLimitMinutes * 60); // Convert to seconds
        }
        
      } catch (err) {
        console.error('Failed to load assessment:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load assessment';
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadAssessment();
  }, [id, isStudent, hasPermission, toast]);

  // Timer effect
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 1) {
          // Time's up - auto submit
          handleSubmitAssessment(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: number, value: string | number[], type: 'text' | 'options') => {
    setAnswers(prev => prev.map(answer => {
      if (answer.questionId === questionId) {
        if (type === 'text') {
          return { ...answer, answerText: value as string };
        } else {
          return { ...answer, selectedOptions: value as number[] };
        }
      }
      return answer;
    }));
  };

  const handleSingleChoiceChange = (questionId: number, optionId: number) => {
    setAnswers(prev => prev.map(answer => {
      if (answer.questionId === questionId) {
        return { ...answer, selectedOptions: [optionId] };
      }
      return answer;
    }));
  };

  const handleMultipleChoiceChange = (questionId: number, optionId: number, checked: boolean) => {
    setAnswers(prev => prev.map(answer => {
      if (answer.questionId === questionId) {
        const currentOptions = answer.selectedOptions || [];
        if (checked) {
          return { ...answer, selectedOptions: [...currentOptions, optionId] };
        } else {
          return { ...answer, selectedOptions: currentOptions.filter(id => id !== optionId) };
        }
      }
      return answer;
    }));
  };

  const handleSubmitAssessment = async (autoSubmit = false) => {
    if (!assessment || !user?.profile?.id) return;

    if (!autoSubmit) {
      const unansweredQuestions = answers.filter(answer => {
        const question = assessment.questions.find(q => q.id === answer.questionId);
        if (!question) return false;
        
        if (question.type === 'ESSAY' || question.type === 'SHORT_ANSWER') {
          return !answer.answerText || answer.answerText.trim() === '';
        } else {
          return !answer.selectedOptions || answer.selectedOptions.length === 0;
        }
      });

      if (unansweredQuestions.length > 0) {
        const confirmSubmit = window.confirm(
          `You have ${unansweredQuestions.length} unanswered questions. Are you sure you want to submit?`
        );
        if (!confirmSubmit) return;
      }
    }

    setSubmitting(true);
    try {
      // Submit each answer
      for (const answer of answers) {
        if (answer.answerText || (answer.selectedOptions && answer.selectedOptions.length > 0)) {
          const submitData: StudentAnswerRequest = {
            studentId: user.profile.id,
            assessmentId: assessment.id,
            questionId: answer.questionId,
            answerText: answer.answerText || '',
            selectedOptionIds: answer.selectedOptions || []
          };

          await assessmentService.submitAnswer(submitData);
        }
      }

      toast({
        title: "Assessment Submitted",
        description: autoSubmit 
          ? "Your assessment has been automatically submitted due to time limit."
          : "Your assessment has been submitted successfully!",
        variant: "default"
      });

      navigate('/assessments');
    } catch (err) {
      console.error('Failed to submit assessment:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit assessment';
      setError(errorMessage);
      toast({
        title: "Submission Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const goToNextQuestion = () => {
    if (assessment && currentQuestionIndex < assessment.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || 'Assessment not found'}</AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/assessments')} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Assessments
        </Button>
      </div>
    );
  }

  const currentQuestion = assessment.questions[currentQuestionIndex];
  const currentAnswer = answers.find(a => a.questionId === currentQuestion.id);
  const progress = ((currentQuestionIndex + 1) / assessment.questions.length) * 100;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/assessments')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Assessments
          </Button>
          
          {timeRemaining !== null && (
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Clock className="h-5 w-5" />
              <span className={timeRemaining < 300 ? 'text-red-600' : ''}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          )}
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{assessment.title}</CardTitle>
                <CardDescription className="mt-2">
                  {assessment.description}
                </CardDescription>
              </div>
              <Badge variant="outline" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                {assessment.type}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total Questions:</span>
                <p className="font-semibold">{assessment.questions.length}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Total Marks:</span>
                <p className="font-semibold">{assessment.totalMarks}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Passing Marks:</span>
                <p className="font-semibold">{assessment.passingMarks}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Max Attempts:</span>
                <p className="font-semibold">{assessment.maxAttempts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            Question {currentQuestionIndex + 1} of {assessment.questions.length}
          </span>
          <span className="text-sm text-muted-foreground">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Navigation */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {assessment.questions.map((_, index) => {
            const answer = answers.find(a => a.questionId === assessment.questions[index].id);
            const isAnswered = answer && (
              answer.answerText?.trim() || 
              (answer.selectedOptions && answer.selectedOptions.length > 0)
            );
            
            return (
              <Button
                key={index}
                variant={index === currentQuestionIndex ? "default" : "outline"}
                size="sm"
                onClick={() => goToQuestion(index)}
                className={`w-10 h-10 p-0 ${
                  isAnswered ? 'bg-green-100 text-green-800 border-green-300' : ''
                }`}
              >
                {index + 1}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Current Question */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">
                Question {currentQuestionIndex + 1}
              </CardTitle>
              <CardDescription className="mt-2">
                {currentQuestion.questionText}
              </CardDescription>
            </div>
            <Badge variant="outline">
              {currentQuestion.marks} marks
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {currentQuestion.type === 'SINGLE_CHOICE' && (
            <RadioGroup
              value={currentAnswer?.selectedOptions?.[0]?.toString() || ''}
              onValueChange={(value) => handleSingleChoiceChange(currentQuestion.id, parseInt(value))}
            >
              {currentQuestion.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.id.toString()} id={option.id.toString()} />
                  <Label htmlFor={option.id.toString()} className="flex-1 cursor-pointer">
                    {option.optionText}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {currentQuestion.type === 'MULTIPLE_CHOICE' && (
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id.toString()}
                    checked={currentAnswer?.selectedOptions?.includes(option.id) || false}
                    onCheckedChange={(checked) => 
                      handleMultipleChoiceChange(currentQuestion.id, option.id, checked as boolean)
                    }
                  />
                  <Label htmlFor={option.id.toString()} className="flex-1 cursor-pointer">
                    {option.optionText}
                  </Label>
                </div>
              ))}
            </div>
          )}

          {(currentQuestion.type === 'ESSAY' || currentQuestion.type === 'SHORT_ANSWER') && (
            <Textarea
              placeholder={
                currentQuestion.type === 'ESSAY' 
                  ? "Write your detailed answer here..." 
                  : "Write your answer here..."
              }
              value={currentAnswer?.answerText || ''}
              onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value, 'text')}
              rows={currentQuestion.type === 'ESSAY' ? 8 : 3}
              className="mt-4"
            />
          )}

          {currentQuestion.type === 'TRUE_FALSE' && (
            <RadioGroup
              value={currentAnswer?.selectedOptions?.[0]?.toString() || ''}
              onValueChange={(value) => handleSingleChoiceChange(currentQuestion.id, parseInt(value))}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="true" />
                <Label htmlFor="true">True</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0" id="false" />
                <Label htmlFor="false">False</Label>
              </div>
            </RadioGroup>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => handleSubmitAssessment(false)}
            disabled={submitting}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Progress
          </Button>
          
          {currentQuestionIndex === assessment.questions.length - 1 ? (
            <Button
              onClick={() => handleSubmitAssessment(false)}
              disabled={submitting}
              className="flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit Assessment
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={goToNextQuestion}
              className="flex items-center gap-2"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentTaking;
