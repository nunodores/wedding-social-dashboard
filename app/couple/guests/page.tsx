'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Modal } from '@/components/ui/modal';
import { 
  Upload, 
  Download, 
  Mail, 
  Users, 
  ArrowLeft,
  Heart,
  FileSpreadsheet,
  Send,
  UserPlus,
  Lock,
  Eye,
  EyeOff
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
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedGuestIds, setSelectedGuestIds] = useState<number[]>([]);
  const [weddingPassword, setWeddingPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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

  const openPasswordModal = (guestIds?: number[]) => {
    setSelectedGuestIds(guestIds || []);
    setWeddingPassword('');
    setShowPasswordModal(true);
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setSelectedGuestIds([]);
    setWeddingPassword('');
    setShowPassword(false);
  };

  const sendInvitations = async () => {
    if (!weddingPassword.trim()) {
      toast.error('Please enter the wedding password');
      return;
    }

    setSendingInvites(true);
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch('/api/couple/guests/send-invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          guestIds: selectedGuestIds.length > 0 ? selectedGuestIds : undefined,
          password: weddingPassword
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Invitations sent to ${data.sent} guests`);
        closePasswordModal();
        fetchGuests(); // Refresh to update status
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to send invitations');
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
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
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center w-full sm:w-auto">
              <Link href="/couple/dashboard" className="mr-4">
                <Button 
                  variant="outline" 
                  className="border-white/30 text-white bg-white/10 hover:bg-white/20 hover:text-white hover:border-white/50" 
                  size="sm"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <Heart className="h-6 w-6 sm:h-8 sm:w-8 mr-3 flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold font-playfair">Guest Management</h1>
                <p className="text-white/80 text-sm sm:text-base">Import and manage your wedding guests</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Import Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base sm:text-lg">
                <Upload className="h-5 w-5 mr-2" />
                Import Guest List
              </CardTitle>
              <CardDescription className="text-sm">
                Upload an Excel or CSV file with your guest information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center">
                <FileSpreadsheet className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm sm:text-base text-gray-600 mb-4">
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
                  <Button asChild disabled={uploading} className="text-sm bg-purple-600 hover:bg-purple-700 text-white">
                    <span>
                      {uploading ? 'Uploading...' : 'Choose File'}
                    </span>
                  </Button>
                </label>
              </div>
              <Button 
                variant="outline" 
                onClick={downloadTemplate}
                className="w-full text-sm border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Template Format</CardTitle>
              <CardDescription className="text-sm">
                Your Excel/CSV file should include these columns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded text-sm">
                  <span className="font-medium">Name</span>
                  <span className="text-gray-600">Required</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded text-sm">
                  <span className="font-medium">Email</span>
                  <span className="text-gray-600">Required</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded text-sm">
                  <span className="font-medium">Phone</span>
                  <span className="text-gray-600">Optional</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mt-4">
                Each guest will receive unique login credentials via email with the wedding password you provide.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Guest List */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <Users className="h-5 w-5 mr-2" />
                  Guest List ({guests.length})
                </CardTitle>
                <CardDescription className="text-sm">
                  Manage your imported guests and send invitations
                </CardDescription>
              </div>
              {guests.length > 0 && (
                <Button 
                  onClick={() => openPasswordModal()}
                  disabled={sendingInvites}
                  className="w-full sm:w-auto text-sm bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send All Invitations
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {guests.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <Users className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-base sm:text-lg font-semibold mb-2">No guests imported yet</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                  Upload your guest list to get started
                </p>
                <Button 
                  onClick={downloadTemplate} 
                  variant="outline" 
                  className="text-sm border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {guests.map((guest) => (
                  <div key={guest.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1">
                        <h4 className="font-semibold text-sm sm:text-base truncate">{guest.name}</h4>
                        <Badge className={getStatusColor(guest.status)}>
                          {guest.status}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">{guest.email}</p>
                      {guest.phone && (
                        <p className="text-xs sm:text-sm text-gray-500">{guest.phone}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        Username: {guest.username}
                      </p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => openPasswordModal([guest.id])}
                        disabled={sendingInvites}
                        className="flex-1 sm:flex-none text-xs sm:text-sm border-gray-300 text-gray-700 hover:bg-gray-50"
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

      {/* Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={closePasswordModal}
        title="Enter Wedding Password"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <Lock className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <p className="text-sm text-blue-800">
              This password will be included in the invitation emails for guests to access your wedding platform.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="wedding-password" className="text-sm">Wedding Password</Label>
            <div className="relative">
              <Input
                id="wedding-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter the password for your wedding"
                value={weddingPassword}
                onChange={(e) => setWeddingPassword(e.target.value)}
                className="pr-10 text-sm"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            {selectedGuestIds.length > 0 ? (
              <p>Sending invitation to {selectedGuestIds.length} selected guest{selectedGuestIds.length > 1 ? 's' : ''}</p>
            ) : (
              <p>Sending invitations to all {guests.length} guests</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              variant="outline"
              onClick={closePasswordModal}
              className="flex-1 text-sm border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={sendInvitations}
              disabled={sendingInvites || !weddingPassword.trim()}
              className="flex-1 text-sm bg-purple-600 hover:bg-purple-700 text-white"
            >
              {sendingInvites ? (
                'Sending...'
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Invitations
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}