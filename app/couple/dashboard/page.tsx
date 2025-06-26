'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  Camera, 
  Settings, 
  LogOut, 
  Heart,
  Upload,
  Mail,
  Palette,
  FileText,
  Lock,
  Eye,
  EyeOff,
  Send,
  Calendar,
  Edit,
  Save,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';

interface EventData {
  id: number;
  name: string;
  event_code: string;
  primary_color: string;
  logo_url: string;
  event_date?: string;
  description?: string;
  guest_count: number;
  photos_count: number;
  posts_count: number;
}

export default function CoupleDashboard() {
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [weddingPassword, setWeddingPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [sendingInvites, setSendingInvites] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    event_date: '',
    description: '',
  });
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchEventData();
  }, []);

  const fetchEventData = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch('/api/couple/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setEventData(data.event);
        setEditForm({
          name: data.event.name || '',
          event_date: data.event.event_date || '',
          description: data.event.description || '',
        });
      }
    } catch (error) {
      console.error('Failed to fetch event data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    router.push('/');
  };

  const openPasswordModal = () => {
    setWeddingPassword('');
    setShowPasswordModal(true);
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setWeddingPassword('');
    setShowPassword(false);
  };

  const openEditModal = () => {
    setEditForm({
      name: eventData?.name || '',
      event_date: eventData?.event_date || '',
      description: eventData?.description || '',
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSaving(false);
  };

  const handleSaveEventDetails = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch('/api/couple/event-details', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        toast.success('Event details updated successfully');
        closeEditModal();
        fetchEventData(); // Refresh data
      } else {
        toast.error('Failed to update event details');
      }
    } catch (error) {
      toast.error('Failed to update event details');
    } finally {
      setSaving(false);
    }
  };

  const sendAllInvitations = async () => {
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
          password: weddingPassword
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Invitations sent to ${data.sent} guests`);
        closePasswordModal();
        fetchEventData(); // Refresh data
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

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen wedding-gradient flex items-center justify-center p-4">
        <div className="text-center text-white">
          <Heart className="h-8 w-8 animate-pulse mx-auto mb-4" />
          <p>Loading your wedding dashboard...</p>
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
            <div className="flex items-start sm:items-center gap-3 w-full sm:w-auto">
              <Heart className="h-6 w-6 sm:h-8 sm:w-8 mt-1 sm:mt-0 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <h1 className="text-xl sm:text-2xl font-bold font-playfair truncate">
                    {eventData?.name || 'Your Wedding'}
                  </h1>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/30 text-white bg-white/10 hover:bg-white/20 hover:text-white hover:border-white/50 w-fit"
                    onClick={openEditModal}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-white/80 text-sm mt-1">
                  <span className="truncate">Event Code: {eventData?.event_code}</span>
                  {eventData?.event_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 flex-shrink-0" />
                      <span>{new Date(eventData.event_date).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="border-white/30 text-white bg-white/10 hover:bg-white/20 hover:text-white hover:border-white/50 w-full sm:w-auto text-sm" 
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Guests</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{eventData?.guest_count || 0}</div>
              <p className="text-xs text-muted-foreground">Invited guests</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Photos</CardTitle>
              <Camera className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{eventData?.photos_count || 0}</div>
              <p className="text-xs text-muted-foreground">Shared photos</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{eventData?.posts_count || 0}</div>
              <p className="text-xs text-muted-foreground">Guest posts</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
            <TabsTrigger value="guests" className="text-sm">Guests</TabsTrigger>
            <TabsTrigger value="customize" className="text-sm">Customize</TabsTrigger>
            <TabsTrigger value="content" className="text-sm">Content</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base sm:text-lg">
                    <Users className="h-5 w-5 mr-2" />
                    Manage Guests
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Import guests and send access credentials
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full text-sm bg-purple-600 hover:bg-purple-700 text-white" asChild>
                    <Link href="/couple/guests">
                      <Upload className="h-4 w-4 mr-2" />
                      Import Guest List
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full text-sm border-gray-300 text-gray-700 hover:bg-gray-50"
                    onClick={openPasswordModal}
                    disabled={!eventData?.guest_count}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send All Invitations
                  </Button>
                  {!eventData?.guest_count && (
                    <p className="text-xs text-gray-500 text-center">
                      Import guests first to send invitations
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base sm:text-lg">
                    <Palette className="h-5 w-5 mr-2" />
                    Event Customization
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Customize colors, logo, and branding
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full text-sm bg-purple-600 hover:bg-purple-700 text-white" asChild>
                    <Link href="/couple/customize">
                      <Settings className="h-4 w-4 mr-2" />
                      Customize Event
                    </Link>
                  </Button>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Theme Color:</span>
                    <div 
                      className="w-6 h-6 rounded-full border"
                      style={{ backgroundColor: eventData?.primary_color || '#d946ef' }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Event Details Card */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <CardTitle className="flex items-center text-base sm:text-lg">
                    <Calendar className="h-5 w-5 mr-2" />
                    Event Details
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={openEditModal} 
                    className="w-full sm:w-auto text-sm border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Details
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Event Name</Label>
                    <p className="font-semibold text-sm sm:text-base">{eventData?.name || 'Not set'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Event Date</Label>
                    <p className="font-semibold text-sm sm:text-base">
                      {eventData?.event_date 
                        ? new Date(eventData.event_date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'Not set'
                      }
                    </p>
                  </div>
                </div>
                {eventData?.description && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Description</Label>
                    <p className="mt-1 text-sm sm:text-base">{eventData.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guests">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Guest Management</CardTitle>
                <CardDescription className="text-sm">Import and manage your wedding guests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6 sm:py-8">
                  <Users className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm sm:text-base text-gray-600 mb-4">
                    {eventData?.guest_count ? 
                      `You have ${eventData.guest_count} guests imported` : 
                      'No guests imported yet'
                    }
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild className="text-sm bg-purple-600 hover:bg-purple-700 text-white">
                      <Link href="/couple/guests">
                        <Upload className="h-4 w-4 mr-2" />
                        Manage Guests
                      </Link>
                    </Button>
                    {eventData?.guest_count && (
                      <Button 
                        variant="outline"
                        onClick={openPasswordModal}
                        className="text-sm border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Send Invitations
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customize">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Event Customization</CardTitle>
                <CardDescription className="text-sm">Personalize your wedding event appearance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6 sm:py-8">
                  <Palette className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm sm:text-base text-gray-600 mb-4">Customize your event's look and feel</p>
                  <Button asChild className="text-sm bg-purple-600 hover:bg-purple-700 text-white">
                    <Link href="/couple/customize">
                      <Settings className="h-4 w-4 mr-2" />
                      Start Customizing
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Guest Content</CardTitle>
                <CardDescription className="text-sm">View photos and posts shared by your guests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6 sm:py-8">
                  <Camera className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm sm:text-base text-gray-600 mb-4">No content shared yet</p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Once your guests start sharing photos and posts, they'll appear here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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
            <p>Sending invitations to all {eventData?.guest_count || 0} guests</p>
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
              onClick={sendAllInvitations}
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

      {/* Edit Event Details Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={closeEditModal}
        title="Edit Event Details"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name" className="text-sm">Event Name</Label>
            <Input
              id="edit-name"
              name="name"
              value={editForm.name}
              onChange={handleEditFormChange}
              placeholder="Enter event name"
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-date" className="text-sm">Event Date</Label>
            <Input
              id="edit-date"
              name="event_date"
              type="date"
              value={editForm.event_date}
              onChange={handleEditFormChange}
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description" className="text-sm">Description (Optional)</Label>
            <Textarea
              id="edit-description"
              name="description"
              value={editForm.description}
              onChange={handleEditFormChange}
              placeholder="Add a description for your event..."
              rows={3}
              className="text-sm"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              variant="outline"
              onClick={closeEditModal}
              className="flex-1 text-sm border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSaveEventDetails}
              disabled={saving}
              className="flex-1 text-sm bg-purple-600 hover:bg-purple-700 text-white"
            >
              {saving ? (
                'Saving...'
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}