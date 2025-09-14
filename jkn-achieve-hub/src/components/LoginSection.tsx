import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, GraduationCap, Shield } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const LoginSection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [studentData, setStudentData] = useState({
    id: "",
    password: "",
    captcha: ""
  });
  
  const [facultyData, setFacultyData] = useState({
    id: "",
    password: "",
    captcha: ""
  });

  const handleStudentLogin = () => {
    // Simple validation - in real app, this would be API call
    if (studentData.id && studentData.password && studentData.captcha) {
      toast({
        title: "Login Successful",
        description: "Welcome to Student Portal"
      });
      navigate("/student");
    } else {
      toast({
        title: "Login Failed",
        description: "Please fill all fields",
        variant: "destructive"
      });
    }
  };

  const handleFacultyLogin = () => {
    // Simple validation - in real app, this would be API call  
    if (facultyData.id && facultyData.password && facultyData.captcha) {
      toast({
        title: "Login Successful", 
        description: "Welcome to Faculty Portal"
      });
      navigate("/faculty");
    } else {
      toast({
        title: "Login Failed",
        description: "Please fill all fields",
        variant: "destructive"
      });
    }
  };

  return (
    <section id="login" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Access Your Portal
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Secure login for students and faculty to access the achievement tracking platform
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="student" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Student Login
              </TabsTrigger>
              <TabsTrigger value="faculty" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Faculty Login
              </TabsTrigger>
            </TabsList>

            <TabsContent value="student">
              <Card className="shadow-card">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-heading">Student Portal</CardTitle>
                  <CardDescription>
                    Access your achievement tracker and academic records
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="student-id">Student ID</Label>
                    <Input
                      id="student-id"
                      type="text"
                      placeholder="Enter your student ID"
                      value={studentData.id}
                      onChange={(e) => setStudentData(prev => ({ ...prev, id: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="student-password">Password</Label>
                    <Input
                      id="student-password"
                      type="password"
                      placeholder="Enter your password"
                      value={studentData.password}
                      onChange={(e) => setStudentData(prev => ({ ...prev, password: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="student-captcha">Captcha</Label>
                    <div className="flex gap-3 items-center">
                      <Input
                        id="student-captcha"
                        type="text"
                        placeholder="Enter captcha"
                        value={studentData.captcha}
                        onChange={(e) => setStudentData(prev => ({ ...prev, captcha: e.target.value }))}
                        className="flex-1"
                      />
                      <div className="bg-muted px-4 py-2 rounded text-sm font-mono">ABC123</div>
                    </div>
                  </div>
                  <Button className="w-full" variant="primary" size="lg" onClick={handleStudentLogin}>
                    Login to Student Portal
                  </Button>
                  <div className="text-center text-sm text-muted-foreground">
                    <a href="#" className="text-primary hover:underline">Forgot Password?</a>
                    {" | "}
                    <a href="#register" className="text-primary hover:underline">New Registration</a>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="faculty">
              <Card className="shadow-card">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="h-8 w-8 text-secondary" />
                  </div>
                  <CardTitle className="text-2xl font-heading">Faculty Portal</CardTitle>
                  <CardDescription>
                    Access validation tools and institutional analytics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="faculty-id">Faculty ID</Label>
                    <Input
                      id="faculty-id"
                      type="text"
                      placeholder="Enter your faculty ID"
                      value={facultyData.id}
                      onChange={(e) => setFacultyData(prev => ({ ...prev, id: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="faculty-password">Password</Label>
                    <Input
                      id="faculty-password"
                      type="password"
                      placeholder="Enter your password"
                      value={facultyData.password}
                      onChange={(e) => setFacultyData(prev => ({ ...prev, password: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="faculty-captcha">Captcha</Label>
                    <div className="flex gap-3 items-center">
                      <Input
                        id="faculty-captcha"
                        type="text"
                        placeholder="Enter captcha"
                        value={facultyData.captcha}
                        onChange={(e) => setFacultyData(prev => ({ ...prev, captcha: e.target.value }))}
                        className="flex-1"
                      />
                      <div className="bg-muted px-4 py-2 rounded text-sm font-mono">XYZ789</div>
                    </div>
                  </div>
                  <Button className="w-full" variant="secondary" size="lg" onClick={handleFacultyLogin}>
                    Login to Faculty Portal
                  </Button>
                  <div className="text-center text-sm text-muted-foreground">
                    <a href="#" className="text-primary hover:underline">Forgot Password?</a>
                    {" | "}
                    <a href="#admin" className="text-primary hover:underline">Admin Access</a>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default LoginSection;