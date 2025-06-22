'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Heart, Save, UserX } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface EventData {
  id: number;
  name: string;
  event_code: string;
  primary_color: string;
  logo_url?: string;
  couple_email: string;
  event_date?: string;
  description?: string;
  status: string;
}

export default function AdminEventManage() {
  const params = useParams();
  const router = useRouter();
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    event_date: '',
    description: '',
    primary_color: '#d946ef',
    status: 'active',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchEventData();
  }, []);

  const fetchEventData = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`/api/admin/events/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setEventData(data.event);
        setFormData({
          name: data.event.name,
          event_date: data.event.event_date || '',
          description: data.event.description || '',
          primary_color: data.event.primary_color,
          status: data.event.status,
        });
      } else {
        router.push('/admin/dashboard');
      }
    } catch (error) {
      console.error('Failed to fetch event data:', error);
      router.push('/admin/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`/api/admin/events/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Event updated successfully');
        fetchEventData(); // Refresh data
      } else {
        toast.error('Failed to update event');
      }
    } catch (error) {
      toast.error('Failed to update event');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveAccess = async () => {
    if (!confirm(`Are you sure you want to remove access for "${eventData?.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`/api/admin/events/${params.id}/remove-access`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success('Access removed successfully');
        router.push('/admin/dashboard');
      } else {
        toast.error('Failed to remove access');
      }
    } catch (error) {
      toast.error('Failed to remove access');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-8 w-8 animate-pulse mx-auto mb-4 text-purple-600" />
          <p>Loading event management...</p>
        </div>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p>Event not found</p>
          <Link href="/admin/dashboard">
            <Button className="mt-4">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/admin/dashboard" className="mr-4">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <Heart className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold">Manage Event</h1>
                <p className="text-gray-600">{eventData.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className={getStatusColor(eventData.status)}>
                {eventData.status}
              </Badge>
              <Button 
                variant="destructive"
                onClick={handleRemoveAccess}
              >
                <UserX className="h-4 w-4 mr-2" />
                Remove Access
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Event Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Event Configuration</CardTitle>
              <CardDescription>
                Manage event details and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Event Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="event_date">Event Date</Label>
                <Input
                  id="event_date"
                  name="event_date"
                  type="date"
                  value={formData.event_date}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="primary_color">Primary Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="primary_color"
                    name="primary_color"
                    type="color"
                    value={formData.primary_color}
                    onChange={handleChange}
                    className="w-16 h-10"
                  />
                  <Input
                    value={formData.primary_color}
                    onChange={handleChange}
                    name="primary_color"
                    className="font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <Button onClick={handleSave} disabled={saving} className="w-full">
                {saving ? (
                  'Saving...'
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Event Info */}
          <Card>
            <CardHeader>
              <CardTitle>Event Information</CardTitle>
              <CardDescription>
                Read-only event details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Event Code</Label>
                <p className="font-mono font-semibold text-lg">{eventData.event_code}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500">Couple Email</Label>
                <p className="font-semibold">{eventData.couple_email}</p>
              </div>

              {eventData.logo_url && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">Current Logo</Label>
                  <img 
                    src={eventData.logo_url} 
                    alt="Event logo" 
                    className="w-24 h-24 object-contain border rounded-lg mt-2"
                  />
                </div>
              )}

              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-2">Danger Zone</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Removing access will disable the couple's ability to login and manage their event.
                </p>
                <Button 
                  variant="destructive" 
                  onClick={handleRemoveAccess}
                  className="w-full"
                >
                  <UserX className="h-4 w-4 mr-2" />
                  Remove Couple Access
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}