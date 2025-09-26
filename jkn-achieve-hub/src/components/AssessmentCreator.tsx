import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Trash2, 
  Save, 
  Eye, 
  Loader2, 
  AlertCircle, 
  FileText,
  Clock,
  Users,
  Award
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/hooks/useRole';
import { assessmentService } from '@/services/assessmentService';
import { 
  AssessmentRequest, 
  AssessmentResponse, 
  AssessmentType, 
  QuestionType,
  AssessmentFormData,
  QuestionFormData,
  QuestionOptionFormData
} from '@/types/assessment';
import { useToast } from '@/hooks/use-toast';

const AssessmentCreator = () => {
  const [formData, setFormData] = useState<AssessmentFormData>({
    title: '',
    description: '',
    type: AssessmentType.QUIZ,
    startDate: '',
    endDate: '',
    timeLimitMinutes: 60,
    maxAttempts: 1,
    totalMarks: 100,
    passingMarks: 60,
    isRandomized: false,
    showCorrectAnswers: false,
    allowReview: true,
    questions: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [assessmentTypes, setAssessmentTypes] = useState<string[]>([]);
  const [questionTypes, setQuestionTypes] = useState<string[]>([]);

  const { user } = useAuth();
  const { isFaculty, hasPermission } = useRole();
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [types, qTypes] = await Promise.all([
          assessmentService.getAvailableAssessmentTypes(),
          assessmentService.getAvailableQuestionTypes()
        ]);
        setAssessmentTypes(types);
        setQuestionTypes(qTypes);
      } catch (err) {
        console.error('Failed to load assessment data:', err);
      }
    };

    loadData();
  }, []);

  const addQuestion = () => {
    const newQuestion: QuestionFormData = {
      questionText: '',
      type: QuestionType.SINGLE_CHOICE,
      questionOrder: formData.questions.length + 1,
      marks: 1,
      negativeMarks: 0,
      explanation: '',
      isRequired: true,
      options: [
        { optionText: '', optionOrder: 1, isCorrect: false, optionLetter: 'A' },
        { optionText: '', optionOrder: 2, isCorrect: false, optionLetter: 'B' }
      ]
    };

    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const updateQuestion = (index: number, field: keyof QuestionFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }));
  };

  const removeQuestion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const addOption = (questionIndex: number) => {
    const question = formData.questions[questionIndex];
    const newOption: QuestionOptionFormData = {
      optionText: '',
      optionOrder: question.options.length + 1,
      isCorrect: false,
      optionLetter: String.fromCharCode(65 + question.options.length)
    };

    updateQuestion(questionIndex, 'options', [...question.options, newOption]);
  };

  const updateOption = (questionIndex: number, optionIndex: number, field: keyof QuestionOptionFormData, value: any) => {
    const question = formData.questions[questionIndex];
    const updatedOptions = question.options.map((opt, i) => 
      i === optionIndex ? { ...opt, [field]: value } : opt
    );

    updateQuestion(questionIndex, 'options', updatedOptions);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const question = formData.questions[questionIndex];
    if (question.options.length > 2) {
      const updatedOptions = question.options.filter((_, i) => i !== optionIndex);
      updateQuestion(questionIndex, 'options', updatedOptions);
    }
  };

  const handleSubmit = async (publish: boolean = false) => {
    if (!user?.profile?.id) {
      setError('User profile not found');
      return;
    }

    if (!isFaculty || !hasPermission('canCreateAssessments')) {
      setError('You do not have permission to create assessments');
      return;
    }

    if (formData.questions.length === 0) {
      setError('Please add at least one question');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const assessmentRequest: AssessmentRequest = {
        title: formData.title,
        description: formData.description,
        facultyId: user.profile.id,
        type: formData.type,
        startDate: formData.startDate,
        endDate: formData.endDate,
        timeLimitMinutes: formData.timeLimitMinutes,
        maxAttempts: formData.maxAttempts,
        totalMarks: formData.totalMarks,
        passingMarks: formData.passingMarks,
        isRandomized: formData.isRandomized,
        showCorrectAnswers: formData.showCorrectAnswers,
        allowReview: formData.allowReview,
        questions: formData.questions.map(q => ({
          questionText: q.questionText,
          type: q.type,
          questionOrder: q.questionOrder,
          marks: q.marks,
          negativeMarks: q.negativeMarks,
          explanation: q.explanation,
          isRequired: q.isRequired,
          options: q.options.map(opt => ({
            optionText: opt.optionText,
            optionOrder: opt.optionOrder,
            isCorrect: opt.isCorrect,
            optionLetter: opt.optionLetter
          }))
        }))
      };

      const response = await assessmentService.createAssessment(assessmentRequest);
      
      if (publish) {
        await assessmentService.publishAssessment(response.id);
        setSuccess('Assessment created and published successfully!');
        toast({
          title: "Success",
          description: "Assessment created and published successfully!",
          variant: "default"
        });
      } else {
        setSuccess('Assessment created successfully! You can publish it later.');
        toast({
          title: "Success",
          description: "Assessment created successfully! You can publish it later.",
          variant: "default"
        });
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        type: AssessmentType.QUIZ,
        startDate: '',
        endDate: '',
        timeLimitMinutes: 60,
        maxAttempts: 1,
        totalMarks: 100,
        passingMarks: 60,
        isRandomized: false,
        showCorrectAnswers: false,
        allowReview: true,
        questions: []
      });

    } catch (err) {
      console.error('Failed to create assessment:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create assessment';
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

  const getQuestionTypeIcon = (type: QuestionType) => {
    switch (type) {
      case QuestionType.SINGLE_CHOICE:
      case QuestionType.MULTIPLE_CHOICE:
        return <FileText className="h-4 w-4" />;
      case QuestionType.TRUE_FALSE:
        return <Checkbox className="h-4 w-4" />;
      case QuestionType.ESSAY:
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
          Create Assessment
        </h1>
        <p className="text-muted-foreground">
          Create quizzes, tests, and assignments for your students
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        {/* Assessment Basic Information */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Assessment Information
            </CardTitle>
            <CardDescription>
              Basic information about your assessment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Assessment Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter assessment title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Assessment Type *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as AssessmentType }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assessment type" />
                  </SelectTrigger>
                  <SelectContent>
                    {assessmentTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter assessment description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                <Input
                  id="timeLimit"
                  type="number"
                  value={formData.timeLimitMinutes}
                  onChange={(e) => setFormData(prev => ({ ...prev, timeLimitMinutes: parseInt(e.target.value) || 0 }))}
                  placeholder="60"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxAttempts">Max Attempts</Label>
                <Input
                  id="maxAttempts"
                  type="number"
                  value={formData.maxAttempts}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxAttempts: parseInt(e.target.value) || 1 }))}
                  placeholder="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalMarks">Total Marks</Label>
                <Input
                  id="totalMarks"
                  type="number"
                  value={formData.totalMarks}
                  onChange={(e) => setFormData(prev => ({ ...prev, totalMarks: parseInt(e.target.value) || 0 }))}
                  placeholder="100"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="passingMarks">Passing Marks</Label>
              <Input
                id="passingMarks"
                type="number"
                value={formData.passingMarks}
                onChange={(e) => setFormData(prev => ({ ...prev, passingMarks: parseInt(e.target.value) || 0 }))}
                placeholder="60"
              />
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isRandomized"
                  checked={formData.isRandomized}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isRandomized: !!checked }))}
                />
                <Label htmlFor="isRandomized">Randomize Questions</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="showCorrectAnswers"
                  checked={formData.showCorrectAnswers}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, showCorrectAnswers: !!checked }))}
                />
                <Label htmlFor="showCorrectAnswers">Show Correct Answers</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allowReview"
                  checked={formData.allowReview}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, allowReview: !!checked }))}
                />
                <Label htmlFor="allowReview">Allow Review</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions Section */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Questions ({formData.questions.length})
                </CardTitle>
                <CardDescription>
                  Add questions to your assessment
                </CardDescription>
              </div>
              <Button onClick={addQuestion} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Question
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {formData.questions.map((question, questionIndex) => (
              <div key={questionIndex} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Question {question.questionOrder}</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeQuestion(questionIndex)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Question Type</Label>
                    <Select 
                      value={question.type} 
                      onValueChange={(value) => updateQuestion(questionIndex, 'type', value as QuestionType)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {questionTypes.map(type => (
                          <SelectItem key={type} value={type}>{type.replace('_', ' ')}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Marks</Label>
                    <Input
                      type="number"
                      value={question.marks}
                      onChange={(e) => updateQuestion(questionIndex, 'marks', parseInt(e.target.value) || 0)}
                      placeholder="1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Question Text *</Label>
                  <Textarea
                    value={question.questionText}
                    onChange={(e) => updateQuestion(questionIndex, 'questionText', e.target.value)}
                    placeholder="Enter your question here..."
                    rows={3}
                  />
                </div>

                {/* Options for multiple choice questions */}
                {(question.type === QuestionType.SINGLE_CHOICE || question.type === QuestionType.MULTIPLE_CHOICE) && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Options</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addOption(questionIndex)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Option
                      </Button>
                    </div>
                    
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={option.isCorrect}
                            onCheckedChange={(checked) => updateOption(questionIndex, optionIndex, 'isCorrect', !!checked)}
                          />
                          <Label className="text-sm font-medium">
                            {option.optionLetter}
                          </Label>
                        </div>
                        <Input
                          value={option.optionText}
                          onChange={(e) => updateOption(questionIndex, optionIndex, 'optionText', e.target.value)}
                          placeholder="Enter option text"
                          className="flex-1"
                        />
                        {question.options.length > 2 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeOption(questionIndex, optionIndex)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Explanation (Optional)</Label>
                  <Textarea
                    value={question.explanation}
                    onChange={(e) => updateQuestion(questionIndex, 'explanation', e.target.value)}
                    placeholder="Explain the correct answer..."
                    rows={2}
                  />
                </div>
              </div>
            ))}

            {formData.questions.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No questions added</h3>
                <p className="text-muted-foreground mb-4">
                  Add questions to create your assessment
                </p>
                <Button onClick={addQuestion} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add First Question
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => handleSubmit(false)}
            disabled={loading || formData.questions.length === 0}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Draft
              </>
            )}
          </Button>
          <Button
            onClick={() => handleSubmit(true)}
            disabled={loading || formData.questions.length === 0}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Create & Publish
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentCreator;
