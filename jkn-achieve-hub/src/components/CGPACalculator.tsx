import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Calculator, 
  Plus, 
  Trash2, 
  TrendingUp,
  Award,
  BookOpen,
  X
} from "lucide-react";

interface Subject {
  id: string;
  name: string;
  credits: number;
  gradePoint: number;
}

const CGPACalculator = () => {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: '1', name: '', credits: 0, gradePoint: 0 }
  ]);
  const [cgpa, setCgpa] = useState<number>(0);
  const [percentage, setPercentage] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);

  const gradePointScale = [
    { grade: 'O', points: 10, description: 'Outstanding' },
    { grade: 'A+', points: 9, description: 'Excellent' },
    { grade: 'A', points: 8, description: 'Very Good' },
    { grade: 'B+', points: 7, description: 'Good' },
    { grade: 'B', points: 6, description: 'Above Average' },
    { grade: 'C', points: 5, description: 'Average' },
    { grade: 'D', points: 4, description: 'Below Average' },
    { grade: 'F', points: 0, description: 'Fail' }
  ];

  const addSubject = () => {
    const newSubject: Subject = {
      id: Date.now().toString(),
      name: '',
      credits: 0,
      gradePoint: 0
    };
    setSubjects([...subjects, newSubject]);
  };

  const removeSubject = (id: string) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter(subject => subject.id !== id));
    }
  };

  const updateSubject = (id: string, field: keyof Subject, value: string | number) => {
    setSubjects(subjects.map(subject => 
      subject.id === id ? { ...subject, [field]: value } : subject
    ));
  };

  const calculateCGPA = () => {
    const validSubjects = subjects.filter(subject => 
      subject.name.trim() !== '' && subject.credits > 0 && subject.gradePoint >= 0
    );

    if (validSubjects.length === 0) {
      setCgpa(0);
      setPercentage(0);
      return;
    }

    const totalWeightedPoints = validSubjects.reduce((sum, subject) => 
      sum + (subject.gradePoint * subject.credits), 0
    );
    
    const totalCredits = validSubjects.reduce((sum, subject) => 
      sum + subject.credits, 0
    );

    if (totalCredits === 0) {
      setCgpa(0);
      setPercentage(0);
      return;
    }

    const calculatedCGPA = totalWeightedPoints / totalCredits;
    const calculatedPercentage = calculatedCGPA * 10;

    setCgpa(calculatedCGPA);
    setPercentage(calculatedPercentage);
  };

  const resetCalculator = () => {
    setSubjects([{ id: '1', name: '', credits: 0, gradePoint: 0 }]);
    setCgpa(0);
    setPercentage(0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card className="shadow-card hover:shadow-soft transition-smooth border-0 bg-card/50 hover:bg-card cursor-pointer group">
          <CardHeader className="pb-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
              <Calculator className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle className="text-lg font-heading">CGPA Calculator</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="leading-relaxed">
              Calculate your CGPA and percentage using Anna University's 10-point grading system
            </CardDescription>
          </CardContent>
        </Card>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-heading">
            <Calculator className="h-6 w-6 text-purple-600" />
            CGPA Calculator
          </DialogTitle>
          <DialogDescription className="text-base">
            Calculate your CGPA. Add your subjects, credits, and grade points.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Grade Point Scale Reference */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-600" />
                Grade Point Scale
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {gradePointScale.map((grade) => (
                  <Badge 
                    key={grade.grade} 
                    variant="outline" 
                    className="text-xs justify-center py-2 bg-white/70"
                  >
                    {grade.grade} = {grade.points}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Subjects Input */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-green-600" />
                Subjects & Grades
              </h3>
              <div className="flex gap-2">
                <Button onClick={addSubject} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Subject
                </Button>
                <Button onClick={resetCalculator} variant="outline" size="sm">
                  Reset
                </Button>
              </div>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {subjects.map((subject, index) => (
                <Card key={subject.id} className="bg-gray-50/50">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                      <div className="md:col-span-2">
                        <Label htmlFor={`subject-${subject.id}`}>Subject Name</Label>
                        <Input
                          id={`subject-${subject.id}`}
                          placeholder="e.g., Mathematics"
                          value={subject.name}
                          onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`credits-${subject.id}`}>Credits</Label>
                        <Input
                          id={`credits-${subject.id}`}
                          type="number"
                          min="0"
                          max="10"
                          placeholder="4"
                          value={subject.credits || ''}
                          onChange={(e) => updateSubject(subject.id, 'credits', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Label htmlFor={`grade-${subject.id}`}>Grade Point</Label>
                          <Input
                            id={`grade-${subject.id}`}
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            placeholder="8.5"
                            value={subject.gradePoint || ''}
                            onChange={(e) => updateSubject(subject.id, 'gradePoint', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        {subjects.length > 1 && (
                          <Button
                            onClick={() => removeSubject(subject.id)}
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

          {/* Calculate Button */}
          <div className="flex justify-center">
            <Button 
              onClick={calculateCGPA} 
              className="bg-purple-600 hover:bg-purple-700 px-8 py-3 text-lg"
              size="lg"
            >
              <Calculator className="h-5 w-5 mr-2" />
              Calculate CGPA
            </Button>
          </div>

          {/* Results */}
          {(cgpa > 0 || percentage > 0) && (
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2 text-green-700">
                  <TrendingUp className="h-6 w-6" />
                  Your Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-white/70 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-600 mb-2">CGPA</h4>
                    <div className="text-3xl font-bold text-green-600">{cgpa.toFixed(2)}</div>
                    <p className="text-xs text-gray-500 mt-1">Out of 10.0</p>
                  </div>
                  <div className="text-center p-4 bg-white/70 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-600 mb-2">Percentage</h4>
                    <div className="text-3xl font-bold text-blue-600">{percentage.toFixed(1)}%</div>
                    <p className="text-xs text-gray-500 mt-1">CGPA × 10</p>
                  </div>
                </div>
                
                {/* Performance Indicator */}
                <div className="mt-4 p-3 bg-white/70 rounded-lg">
                  <h5 className="font-medium text-gray-700 mb-2">Performance Level:</h5>
                  <div className="flex items-center gap-2">
                    {cgpa >= 9 ? (
                      <Badge className="bg-yellow-100 text-yellow-800">Outstanding (O)</Badge>
                    ) : cgpa >= 8 ? (
                      <Badge className="bg-green-100 text-green-800">Excellent (A+)</Badge>
                    ) : cgpa >= 7 ? (
                      <Badge className="bg-blue-100 text-blue-800">Very Good (A)</Badge>
                    ) : cgpa >= 6 ? (
                      <Badge className="bg-purple-100 text-purple-800">Good (B+)</Badge>
                    ) : cgpa >= 5 ? (
                      <Badge className="bg-orange-100 text-orange-800">Average (B)</Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Formula Reference */}
          <Card className="bg-gray-50/50">
            <CardHeader>
              <CardTitle className="text-lg">Calculation Formula</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-gray-700">
                <p className="font-medium mb-2">CGPA = (Sum of Grade Points × Credits) / Total Credits</p>
                <p className="font-medium mb-2">Percentage = CGPA × 10</p>
                <p className="text-xs text-gray-500">
                  Example: If you have 32 weighted points from 4 credits, your CGPA is 32÷4 = 8.0, 
                  which equals 80% (8.0 × 10).
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CGPACalculator;
