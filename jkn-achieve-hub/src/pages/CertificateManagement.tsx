import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, Upload, CheckCircle, Clock, XCircle, Loader2, AlertCircle } from 'lucide-react';
import Layout from '@/components/Layout';
import CertificateUpload from '@/components/CertificateUpload';
import CertificateApproval from '@/components/CertificateApproval';
import { useAuth } from '@/contexts/AuthContext';
import { certificateService } from '@/services/certificateService';
import { CertificateResponse, CertificateSummaryResponse } from '@/types/certificate';

const CertificateManagement = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [summary, setSummary] = useState<CertificateSummaryResponse | null>(null);
  const [recentCertificates, setRecentCertificates] = useState<CertificateResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Load certificate summary for students
  useEffect(() => {
    const loadSummary = async () => {
      if (!user?.profile?.id || user.role !== 'STUDENT') {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const summaryData = await certificateService.getCertificateSummary(user.profile.id);
        setSummary(summaryData);
        setRecentCertificates(summaryData.recentCertificates);
      } catch (err) {
        console.error('Failed to load certificate summary:', err);
        setError(err instanceof Error ? err.message : 'Failed to load certificate summary');
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, [user]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'PENDING': { variant: 'secondary' as const, icon: Clock, color: 'text-yellow-600' },
      'APPROVED': { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      'REJECTED': { variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' },
      'UNDER_REVIEW': { variant: 'outline' as const, icon: Clock, color: 'text-blue-600' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['PENDING'];
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
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading certificate data...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
            Certificate Management
          </h1>
          <p className="text-muted-foreground">
            {user?.role === 'STUDENT' 
              ? 'Upload and track your certificate submissions'
              : 'Review and approve student certificate submissions'
            }
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Certificate Summary for Students */}
        {user?.role === 'STUDENT' && summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Total Certificates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{summary.totalCertificates}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Approved
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{summary.approvedCount}</div>
                <p className="text-xs text-muted-foreground">
                  {summary.totalCertificates > 0 ? 
                    `${((summary.approvedCount / summary.totalCertificates) * 100).toFixed(1)}% approval rate` : 
                    'No certificates'
                  }
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Pending Review
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{summary.pendingCount}</div>
                <p className="text-xs text-muted-foreground">Awaiting faculty review</p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  Rejected
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{summary.rejectedCount}</div>
                <p className="text-xs text-muted-foreground">Need resubmission</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recent Certificates for Students */}
        {user?.role === 'STUDENT' && recentCertificates.length > 0 && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-heading">Recent Certificates</CardTitle>
              <CardDescription>
                Your latest certificate submissions and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCertificates.slice(0, 5).map((certificate) => (
                  <div key={certificate.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{certificate.certificateName}</span>
                        {getStatusBadge(certificate.status)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {certificate.certificateType} • Submitted {formatDate(certificate.submittedAt)}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {certificate.fileName}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            {user?.role === 'STUDENT' ? (
              <>
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Certificate
                </TabsTrigger>
                <TabsTrigger value="my-certificates" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  My Certificates
                </TabsTrigger>
              </>
            ) : (
              <>
                <TabsTrigger value="approval" className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Certificate Approval
                </TabsTrigger>
                <TabsTrigger value="all-certificates" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  All Certificates
                </TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="upload">
            <CertificateUpload />
          </TabsContent>

          <TabsContent value="my-certificates">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-heading">My Certificates</CardTitle>
                <CardDescription>
                  View all your certificate submissions and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentCertificates.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No certificates uploaded</h3>
                    <p className="text-muted-foreground mb-4">
                      You haven't uploaded any certificates yet.
                    </p>
                    <Button onClick={() => setActiveTab('upload')}>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Your First Certificate
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentCertificates.map((certificate) => (
                      <div key={certificate.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{certificate.certificateName}</h3>
                            {getStatusBadge(certificate.status)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <p>{certificate.certificateType} • {certificate.fileName}</p>
                            <p>Submitted {formatDate(certificate.submittedAt)}</p>
                            {certificate.reviewNotes && (
                              <p className="mt-1 italic">"{certificate.reviewNotes}"</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approval">
            <CertificateApproval />
          </TabsContent>

          <TabsContent value="all-certificates">
            <CertificateApproval />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CertificateManagement;
