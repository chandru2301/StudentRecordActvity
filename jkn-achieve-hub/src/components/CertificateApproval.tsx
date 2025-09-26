import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, CheckCircle, XCircle, Clock, Eye, Loader2, AlertCircle, Download, User, Calendar, Award } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/hooks/useRole';
import { certificateService } from '@/services/certificateService';
import { CertificateResponse, CertificateStatus, CertificateReviewRequest } from '@/types/certificate';
import { useToast } from '@/hooks/use-toast';

const CertificateApproval = () => {
  const [certificates, setCertificates] = useState<CertificateResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateResponse | null>(null);
  const [reviewStatus, setReviewStatus] = useState<CertificateStatus>(CertificateStatus.PENDING);
  const [reviewNotes, setReviewNotes] = useState('');
  const [isReviewing, setIsReviewing] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0
  });
  
  const { user } = useAuth();
  const { isFaculty, isAdmin, hasPermission, profileInfo } = useRole();
  const { toast } = useToast();

  // Load certificates based on active tab
  useEffect(() => {
    const loadCertificates = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!isFaculty && !isAdmin) {
          setError('You do not have permission to view certificates');
          return;
        }
        
        const status = activeTab === 'all' ? 'PENDING' : activeTab.toUpperCase();
        const data = await certificateService.getCertificatesByStatus(status);
        setCertificates(data);
        
        // Calculate statistics
        const pendingData = await certificateService.getCertificatesByStatus('PENDING');
        const approvedData = await certificateService.getCertificatesByStatus('APPROVED');
        const rejectedData = await certificateService.getCertificatesByStatus('REJECTED');
        
        setStats({
          pending: pendingData.length,
          approved: approvedData.length,
          rejected: rejectedData.length,
          total: pendingData.length + approvedData.length + rejectedData.length
        });
        
      } catch (err) {
        console.error('Failed to load certificates:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load certificates';
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

    loadCertificates();
  }, [activeTab, isFaculty, isAdmin, toast]);

  const handleReview = async () => {
    if (!selectedCertificate) return;

    if (!hasPermission('canApproveCertificates')) {
      toast({
        title: "Permission Denied",
        description: "You do not have permission to review certificates",
        variant: "destructive"
      });
      return;
    }

    setIsReviewing(true);
    try {
      const reviewRequest: CertificateReviewRequest = {
        certificateId: selectedCertificate.id,
        status: reviewStatus,
        reviewedBy: profileInfo.name || 'Faculty Member',
        reviewNotes: reviewNotes || undefined
      };

      await certificateService.reviewCertificate(reviewRequest);
      
      // Update the certificate in the list
      setCertificates(prev => 
        prev.map(cert => 
          cert.id === selectedCertificate.id 
            ? { 
                ...cert, 
                status: reviewStatus, 
                reviewedAt: new Date().toISOString(), 
                reviewedBy: profileInfo.name || 'Faculty Member', 
                reviewNotes 
              }
            : cert
        )
      );

      // Update statistics
      setStats(prev => ({
        ...prev,
        pending: reviewStatus === CertificateStatus.PENDING ? prev.pending : prev.pending - 1,
        approved: reviewStatus === CertificateStatus.APPROVED ? prev.approved + 1 : prev.approved,
        rejected: reviewStatus === CertificateStatus.REJECTED ? prev.rejected + 1 : prev.rejected
      }));

      const successMessage = `Certificate ${reviewStatus === CertificateStatus.APPROVED ? 'approved' : reviewStatus === CertificateStatus.REJECTED ? 'rejected' : 'marked for review'} successfully`;
      
      toast({
        title: "Review Submitted",
        description: successMessage,
        variant: "default"
      });

      setSelectedCertificate(null);
      setReviewNotes('');
      setReviewStatus(CertificateStatus.PENDING);
    } catch (err) {
      console.error('Failed to review certificate:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to review certificate';
      setError(errorMessage);
      toast({
        title: "Review Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsReviewing(false);
    }
  };

  const getStatusBadge = (status: CertificateStatus) => {
    const statusConfig = {
      [CertificateStatus.PENDING]: { variant: 'secondary' as const, icon: Clock, color: 'text-yellow-600' },
      [CertificateStatus.APPROVED]: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      [CertificateStatus.REJECTED]: { variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' },
      [CertificateStatus.UNDER_REVIEW]: { variant: 'outline' as const, icon: Clock, color: 'text-blue-600' },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className={`h-3 w-3 ${config.color}`} />
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading certificates...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
          Certificate Approval
        </h1>
        <p className="text-muted-foreground">
          Review and approve student certificate submissions
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">{stats.approved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold">{stats.rejected}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Award className="h-5 w-5 text-blue-600" />
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">Pending Review</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="all">All Certificates</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {certificates.length === 0 ? (
            <Card className="shadow-card">
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No certificates found</h3>
                  <p className="text-muted-foreground">
                    {activeTab === 'pending' 
                      ? 'No certificates are pending review'
                      : `No ${activeTab} certificates found`
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {certificates.map((certificate) => (
                <Card key={certificate.id} className="shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{certificate.certificateName}</h3>
                          {getStatusBadge(certificate.status)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span><strong>Student:</strong> {certificate.studentName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Award className="h-4 w-4" />
                              <span><strong>Roll Number:</strong> {certificate.studentRollNumber}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              <span><strong>Type:</strong> {certificate.certificateType}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Download className="h-4 w-4" />
                              <span><strong>File:</strong> {certificate.fileName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span><strong>Size:</strong> {certificate.fileSize ? `${(certificate.fileSize / 1024 / 1024).toFixed(2)} MB` : 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span><strong>Submitted:</strong> {formatDate(certificate.submittedAt)}</span>
                            </div>
                          </div>
                        </div>

                        {certificate.reviewNotes && (
                          <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm">
                              <strong>Review Notes:</strong> {certificate.reviewNotes}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Certificate Review</DialogTitle>
                              <DialogDescription>
                                Review the certificate details and make a decision
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium">Certificate Name</Label>
                                  <p className="text-sm text-muted-foreground">{certificate.certificateName}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Student</Label>
                                  <p className="text-sm text-muted-foreground">{certificate.studentName} ({certificate.studentRollNumber})</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium">Certificate Type</Label>
                                  <p className="text-sm text-muted-foreground">{certificate.certificateType}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">File</Label>
                                  <p className="text-sm text-muted-foreground">{certificate.fileName}</p>
                                </div>
                              </div>

                              <div>
                                <Label className="text-sm font-medium">Review Decision</Label>
                                <Select value={reviewStatus} onValueChange={(value) => setReviewStatus(value as CertificateStatus)}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select decision" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value={CertificateStatus.APPROVED}>Approve</SelectItem>
                                    <SelectItem value={CertificateStatus.REJECTED}>Reject</SelectItem>
                                    <SelectItem value={CertificateStatus.UNDER_REVIEW}>Under Review</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Label htmlFor="reviewNotes">Review Notes (Optional)</Label>
                                <Textarea
                                  id="reviewNotes"
                                  placeholder="Add any comments or feedback..."
                                  value={reviewNotes}
                                  onChange={(e) => setReviewNotes(e.target.value)}
                                  rows={3}
                                />
                              </div>
                            </div>

                            <DialogFooter>
                              <Button
                                onClick={() => {
                                  setSelectedCertificate(certificate);
                                  handleReview();
                                }}
                                disabled={isReviewing}
                              >
                                {isReviewing ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                  </>
                                ) : (
                                  'Submit Review'
                                )}
                              </Button>
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

export default CertificateApproval;
