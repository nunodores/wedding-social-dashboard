'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Upload, 
  Download, 
  Mail, 
  Users, 
  ArrowLeft,
  Heart,
  FileSpreadsheet,
  Send,
  UserPlus
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface Guest {
  id: number;
  name: string;
  email: string;
  phone?: string;
  username: string;
  status: 'invited' | 'confirmed' | 'declined';
  created_at: string;
}

export default function CoupleGuests() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [sendingInvites, setSendingInvites] = useState(false);

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch('/api/couple/guests', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setGuests(data.guests);
      }
    } catch (error) {
      console.error('Failed to fetch guests:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    // Create CSV template
    const csvContent = "Name,Email,Phone\nJohn Doe,john@example.com,+1234567890\nJane Smith,jane@example.com,+0987654321";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'guest-list-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch('/api/couple/guests/import', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('====================================');
        console.log(data);
        console.log('====================================');
        toast.success(`${data.imported} guests imported successfully`);
        fetchGuests(); // Refresh guest list
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to import guests');
      }
    } catch (error) {
      toast.error('Failed to import guests');
    } finally {
      setUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const sendInvitations = async (guestIds?: number[]) => {
    setSendingInvites(true);
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch('/api/couple/guests/send-invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ guestIds }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Invitations sent to ${data.sent} guests`);
        fetchGuests(); // Refresh to update status
      } else {
        toast.error('Failed to send invitations');
      }
    } catch (error) {
      toast.error('Failed to send invitations');
    } finally {
      setSendingInvites(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      case 'invited': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Users className="h-8 w-8 animate-pulse mx-auto mb-4 text-purple-600" />
          <p>Loading guests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="wedding-gradient text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/couple/dashboard" className="mr-4">
                <Button variant="outline" className="border-white text-white hover:bg-white/10" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <Heart className="h-8 w-8 mr-3" />
              <div>
                <h1 className="text-2xl font-bold font-playfair">Guest Management</h1>
                <p className="text-white/80">Import and manage your wedding guests</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Import Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Import Guest List
              </CardTitle>
              <CardDescription>
                Upload an Excel or CSV file with your guest information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Upload your guest list file (Excel or CSV)
                </p>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  disabled={uploading}
                />
                <label htmlFor="file-upload">
                  <Button asChild disabled={uploading}>
                    <span>
                      {uploading ? 'Uploading...' : 'Choose File'}
                    </span>
                  </Button>
                </label>
              </div>
              <Button 
                variant="outline" 
                onClick={downloadTemplate}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Template Format</CardTitle>
              <CardDescription>
                Your Excel/CSV file should include these columns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="font-medium">Name</span>
                  <span className="text-sm text-gray-600">Required</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="font-medium">Email</span>
                  <span className="text-sm text-gray-600">Required</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="font-medium">Phone</span>
                  <span className="text-sm text-gray-600">Optional</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Each guest will automatically receive unique login credentials via email.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Guest List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Guest List ({guests.length})
                </CardTitle>
                <CardDescription>
                  Manage your imported guests and send invitations
                </CardDescription>
              </div>
              {guests.length > 0 && (
                <Button 
                  onClick={() => sendInvitations()}
                  disabled={sendingInvites}
                >
                  {sendingInvites ? (
                    'Sending...'
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Send All Invitations
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {guests.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No guests imported yet</h3>
                <p className="text-gray-600 mb-4">
                  Upload your guest list to get started
                </p>
                <Button onClick={downloadTemplate} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {guests.map((guest) => (
                  <div key={guest.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-semibold">{guest.name}</h4>
                        <Badge className={getStatusColor(guest.status)}>
                          {guest.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{guest.email}</p>
                      {guest.phone && (
                        <p className="text-sm text-gray-500">{guest.phone}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        Username: {guest.username}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => sendInvitations([guest.id])}
                        disabled={sendingInvites}
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Send Invite
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}