'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Send
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
  guest_count: number;
  photos_count: number;
  posts_count: number;
}

export default function CoupleDashboard() {
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [weddingPassword, setWeddingPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [sendingInvites, setSendingInvites] = useState(false);
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

  if (loading) {
    return (
      <div className="min-h-screen wedding-gradient flex items-center justify-center">
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
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Heart className="h-8 w-8 mr-3" />
              <div>
                <h1 className="text-2xl font-bold font-playfair">
                  {eventData?.name || 'Your Wedding'}
                </h1>
                <p className="text-white/80">Event Code: {eventData?.event_code}</p>
              </div>
            </div>
            <Button variant="outline" className="border-white text-white hover:bg-white/10" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="guests">Guests</TabsTrigger>
            <TabsTrigger value="customize">Customize</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Manage Guests
                  </CardTitle>
                  <CardDescription>
                    Import guests and send access credentials
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" asChild>
                    <Link href="/couple/guests">
                      <Upload className="h-4 w-4 mr-2" />
                      Import Guest List
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
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
                  <CardTitle className="flex items-center">
                    <Palette className="h-5 w-5 mr-2" />
                    Event Customization
                  </CardTitle>
                  <CardDescription>
                    Customize colors, logo, and branding
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" asChild>
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
          </TabsContent>

          <TabsContent value="guests">
            <Card>
              <CardHeader>
                <CardTitle>Guest Management</CardTitle>
                <CardDescription>Import and manage your wedding guests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    {eventData?.guest_count ? 
                      `You have ${eventData.guest_count} guests imported` : 
                      'No guests imported yet'
                    }
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button asChild>
                      <Link href="/couple/guests">
                        <Upload className="h-4 w-4 mr-2" />
                        Manage Guests
                      </Link>
                    </Button>
                    {eventData?.guest_count && (
                      <Button 
                        variant="outline"
                        onClick={openPasswordModal}
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
                <CardTitle>Event Customization</CardTitle>
                <CardDescription>Personalize your wedding event appearance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Palette className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Customize your event's look and feel</p>
                  <Button asChild>
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
                <CardTitle>Guest Content</CardTitle>
                <CardDescription>View photos and posts shared by your guests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No content shared yet</p>
                  <p className="text-sm text-gray-500">
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
            <Lock className="h-5 w-5 text-blue-600" />
            <p className="text-sm text-blue-800">
              This password will be included in the invitation emails for guests to access your wedding platform.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="wedding-password">Wedding Password</Label>
            <div className="relative">
              <Input
                id="wedding-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter the password for your wedding"
                value={weddingPassword}
                onChange={(e) => setWeddingPassword(e.target.value)}
                className="pr-10"
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

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={closePasswordModal}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={sendAllInvitations}
              disabled={sendingInvites || !weddingPassword.trim()}
              className="flex-1"
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