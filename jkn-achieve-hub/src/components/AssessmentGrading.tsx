import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Loader2, 
  AlertCircle, 
  User, 
  Calendar, 
  Award,
  MessageSquare,
  Save
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/hooks/useRole';
import { assessmentService } from '@/services/assessmentService';
import { StudentAnswerResponse, AnswerStatus, GradeAnswerRequest } from '@/types/assessment';
import { useToast } from '@/hooks/use-toast';

const AssessmentGrading = () => {
  const [answers, setAnswers] = useState<StudentAnswerResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<StudentAnswerResponse | null>(null);
  const [gradingData, setGradingData] = useState({
    isCorrect: false,
    marksObtained: 0,
    feedback: ''
  });
  const [isGrading, setIsGrading] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [stats, setStats] = useState({
    pending: 0,
    graded: 0,
    total: 0
  });
  
  const { user } = useAuth();
  const { isFaculty, isAdmin, hasPermission, profileInfo } = useRole();
  const { toast } = useToast();

  useEffect(() => {
    const loadAnswers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!isFaculty && !isAdmin) {
          setError('You do not have permission to grade assessments');
          return;
        }
        
        if (!user?.profile?.id) {
          setError('User profile not found');
          return;
        }
        
        const data = await assessmentService.getAnswersNeedingGrading(user.profile.id);
        setAnswers(data);
        
        // Calculate stats
        const pending = data.filter(answer => answer.answerStatus === AnswerStatus.SUBMITTED).length;
        const graded = data.filter(answer => answer.answerStatus === AnswerStatus.GRADED).length;
        
        setStats({
          pending,
          graded,
          total: data.length
        });
        
      } catch (err) {
        console.error('Failed to load answers for grading:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load answers for grading';
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
    loadAnswers();
  }, [isFaculty, isAdmin, user, toast]);

  const handleGradeAnswer = async () => {
    if (!selectedAnswer) return;

    if (!hasPermission('canGradeAssessments')) {
      toast({
        title: "Permission Denied",
        description: "You do not have permission to grade assessments",
        variant: "destructive"
      });
      return;
    }

    setIsGrading(true);
    try {
      const gradeRequest: GradeAnswerRequest = {
        studentAnswerId: selectedAnswer.id,
        isCorrect: gradingData.isCorrect,
        marksObtained: gradingData.marksObtained,
        feedback: gradingData.feedback || undefined,
        gradedBy: profileInfo.name || 'Faculty Member'
      };

      await assessmentService.gradeAnswer(gradeRequest);
      
      // Update the answer in the local state
      setAnswers(prev => 
        prev.map(answer => 
          answer.id === selectedAnswer.id 
            ? { 
                ...answer, 
                isCorrect: gradingData.isCorrect,
                marksObtained: gradingData.marksObtained,
                feedback: gradingData.feedback,
                answerStatus: AnswerStatus.GRADED,
                gradedAt: new Date().toISOString(),
                gradedBy: profileInfo.name || 'Faculty Member'
              }
            : answer
        )
      );

      // Update stats
      setStats(prev => ({
        ...prev,
        pending: prev.pending - 1,
        graded: prev.graded + 1
      }));

      const successMessage = `Answer graded successfully with ${gradingData.marksObtained} marks`;
      
      toast({
        title: "Grading Complete",
        description: successMessage,
        variant: "default"
      });

      setSelectedAnswer(null);
      setGradingData({
        isCorrect: false,
        marksObtained: 0,
        feedback: ''
      });
    } catch (err) {
      console.error('Failed to grade answer:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to grade answer';
      setError(errorMessage);
      toast({
        title: "Grading Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsGrading(false);
    }
  };

  const getStatusBadge = (status: AnswerStatus) => {
    const statusConfig = {
      [AnswerStatus.SUBMITTED]: { variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-800' },
      [AnswerStatus.GRADED]: { variant: 'default' as const, color: 'bg-green-100 text-green-800' },
      [AnswerStatus.REVIEWED]: { variant: 'outline' as const, color: 'bg-blue-100 text-blue-800' },
    };

    const config = statusConfig[status] || statusConfig[AnswerStatus.SUBMITTED];
    
    return (
      <Badge variant={config.variant} className={config.color}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredAnswers = answers.filter(answer => {
    if (activeTab === 'pending') return answer.answerStatus === AnswerStatus.SUBMITTED;
    if (activeTab === 'graded') return answer.answerStatus === AnswerStatus.GRADED;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
          Assessment Grading
        </h1>
        <p className="text-muted-foreground">
          Review and grade student submissions
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Graded</p>
                <p className="text-2xl font-bold">{stats.graded}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Pending Review</TabsTrigger>
          <TabsTrigger value="graded">Graded</TabsTrigger>
          <TabsTrigger value="all">All Answers</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="flex items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Loading answers...</span>
              </div>
            </div>
          ) : filteredAnswers.length === 0 ? (
            <Card className="shadow-card">
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No answers found</h3>
                  <p className="text-muted-foreground">
                    {activeTab === 'pending' 
                      ? 'No answers are pending review'
                      : `No ${activeTab} answers found`
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredAnswers.map((answer) => (
                <Card key={answer.id} className="shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{answer.assessmentTitle}</h3>
                          {getStatusBadge(answer.answerStatus)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span><strong>Student:</strong> {answer.studentName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Award className="h-4 w-4" />
                              <span><strong>Roll Number:</strong> {answer.studentRollNumber}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              <span><strong>Question:</strong> {answer.questionText?.substring(0, 100)}...</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span><strong>Submitted:</strong> {formatDate(answer.submittedAt)}</span>
                            </div>
                            {answer.timeTakenSeconds && (
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span><strong>Time Taken:</strong> {Math.floor(answer.timeTakenSeconds / 60)}m {answer.timeTakenSeconds % 60}s</span>
                              </div>
                            )}
                            {answer.marksObtained !== undefined && (
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4" />
                                <span><strong>Marks:</strong> {answer.marksObtained}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm">
                            <strong>Answer:</strong> {answer.answerText || 'No text answer provided'}
                          </p>
                        </div>

                        {answer.feedback && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm">
                              <strong>Feedback:</strong> {answer.feedback}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              {answer.answerStatus === AnswerStatus.SUBMITTED ? 'Grade' : 'View'}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Grade Student Answer</DialogTitle>
                              <DialogDescription>
                                Review the student's answer and provide grading
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium">Student</Label>
                                  <p className="text-sm text-muted-foreground">{answer.studentName} ({answer.studentRollNumber})</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Assessment</Label>
                                  <p className="text-sm text-muted-foreground">{answer.assessmentTitle}</p>
                                </div>
                              </div>

                              <div>
                                <Label className="text-sm font-medium">Question</Label>
                                <p className="text-sm text-muted-foreground mt-1">{answer.questionText}</p>
                              </div>

                              <div>
                                <Label className="text-sm font-medium">Student Answer</Label>
                                <div className="mt-1 p-3 bg-muted/50 rounded-lg">
                                  <p className="text-sm">{answer.answerText || 'No text answer provided'}</p>
                                </div>
                              </div>

                              {answer.answerStatus === AnswerStatus.SUBMITTED && (
                                <>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-sm font-medium">Is Correct</Label>
                                      <div className="flex items-center space-x-2 mt-1">
                                        <input
                                          type="radio"
                                          id="correct"
                                          name="isCorrect"
                                          checked={gradingData.isCorrect === true}
                                          onChange={() => setGradingData(prev => ({ ...prev, isCorrect: true }))}
                                        />
                                        <Label htmlFor="correct" className="text-sm">Correct</Label>
                                        <input
                                          type="radio"
                                          id="incorrect"
                                          name="isCorrect"
                                          checked={gradingData.isCorrect === false}
                                          onChange={() => setGradingData(prev => ({ ...prev, isCorrect: false }))}
                                        />
                                        <Label htmlFor="incorrect" className="text-sm">Incorrect</Label>
                                      </div>
                                    </div>
                                    <div>
                                      <Label htmlFor="marksObtained" className="text-sm font-medium">Marks Obtained</Label>
                                      <Input
                                        id="marksObtained"
                                        type="number"
                                        value={gradingData.marksObtained}
                                        onChange={(e) => setGradingData(prev => ({ ...prev, marksObtained: parseInt(e.target.value) || 0 }))}
                                        placeholder="0"
                                        className="mt-1"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <Label htmlFor="feedback" className="text-sm font-medium">Feedback (Optional)</Label>
                                    <Textarea
                                      id="feedback"
                                      placeholder="Provide feedback to the student..."
                                      value={gradingData.feedback}
                                      onChange={(e) => setGradingData(prev => ({ ...prev, feedback: e.target.value }))}
                                      rows={3}
                                      className="mt-1"
                                    />
                                  </div>
                                </>
                              )}

                              {answer.answerStatus === AnswerStatus.GRADED && (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">Grade:</span>
                                    <Badge variant={answer.isCorrect ? 'default' : 'destructive'}>
                                      {answer.isCorrect ? 'Correct' : 'Incorrect'}
                                    </Badge>
                                    <span className="text-sm">{answer.marksObtained} marks</span>
                                  </div>
                                  {answer.feedback && (
                                    <div>
                                      <span className="text-sm font-medium">Feedback:</span>
                                      <p className="text-sm text-muted-foreground mt-1">{answer.feedback}</p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            <DialogFooter>
                              {answer.answerStatus === AnswerStatus.SUBMITTED && (
                                <Button
                                  onClick={() => {
                                    setSelectedAnswer(answer);
                                    handleGradeAnswer();
                                  }}
                                  disabled={isGrading}
                                >
                                  {isGrading ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Grading...
                                    </>
                                  ) : (
                                    <>
                                      <Save className="mr-2 h-4 w-4" />
                                      Submit Grade
                                    </>
                                  )}
                                </Button>
                              )}
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AssessmentGrading;
