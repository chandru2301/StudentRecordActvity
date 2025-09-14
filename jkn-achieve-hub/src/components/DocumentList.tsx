import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  FileText, 
  Download, 
  Eye, 
  Edit, 
  MessageCircle, 
  Phone,
  CheckCircle,
  XCircle,
  Clock,
  User
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'certificate' | 'form' | 'report' | 'other';
  status: 'available' | 'pending' | 'approved' | 'rejected';
  uploadDate: string;
  downloadUrl?: string;
  previewUrl?: string;
}

interface DocumentListProps {
  title: string;
  documents: Document[];
  showActions?: boolean;
  onEdit?: () => void;
  onApprove?: (docId: string) => void;
  onReject?: (docId: string) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({
  title,
  documents,
  showActions = false,
  onEdit,
  onApprove,
  onReject
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <FileText className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-800">{title}</CardTitle>
          {onEdit && (
            <Button
              size="sm"
              variant="ghost"
              className="text-gray-500 hover:text-gray-700 p-1 h-8 w-8"
              onClick={onEdit}
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {documents.map(doc => (
          <div
            key={doc.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                {getStatusIcon(doc.status)}
              </div>
              <div>
                <p className="font-medium text-gray-800">{doc.name}</p>
                <p className="text-sm text-gray-500">{doc.uploadDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge className={`text-xs ${getStatusColor(doc.status)}`}>
                {doc.status}
              </Badge>
              
              {showActions && doc.status === 'pending' && (
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    className="h-7 px-2 bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => onApprove?.(doc.id)}
                  >
                    <CheckCircle className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    className="h-7 px-2 bg-red-500 hover:bg-red-600 text-white"
                    onClick={() => onReject?.(doc.id)}
                  >
                    <XCircle className="w-3 h-3" />
                  </Button>
                </div>
              )}

              {doc.previewUrl && (
                <Button size="sm" variant="outline" className="h-7 px-2">
                  <Eye className="w-3 h-3" />
                </Button>
              )}
              
              {doc.downloadUrl && (
                <Button size="sm" variant="outline" className="h-7 px-2">
                  <Download className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

interface Contact {
  id: string;
  name: string;
  relation: string;
  avatar: string;
  phone?: string;
  email?: string;
}

interface ContactCardProps {
  title: string;
  contacts: Contact[];
  onEdit?: () => void;
  onMessage?: (contactId: string) => void;
  onCall?: (contactId: string) => void;
}

const ContactCard: React.FC<ContactCardProps> = ({
  title,
  contacts,
  onEdit,
  onMessage,
  onCall
}) => {
  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-800">{title}</CardTitle>
          {onEdit && (
            <Button
              size="sm"
              variant="ghost"
              className="text-gray-500 hover:text-gray-700 p-1 h-8 w-8"
              onClick={onEdit}
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {contacts.map(contact => (
          <div
            key={contact.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 ring-2 ring-purple-100">
                <AvatarImage src={contact.avatar} alt={contact.name} />
                <AvatarFallback className="bg-gradient-to-br from-purple-400 to-purple-600 text-white text-sm">
                  {contact.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-gray-800">{contact.name}</p>
                <p className="text-sm text-gray-500">{contact.relation}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full p-2 h-8 w-8"
                onClick={() => onMessage?.(contact.id)}
              >
                <MessageCircle className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                className="bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full p-2 h-8 w-8"
                onClick={() => onCall?.(contact.id)}
              >
                <Phone className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export { DocumentList, ContactCard };
export type { Document, Contact };
