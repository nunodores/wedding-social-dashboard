'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Heart, Users, Camera, FileText, Calendar } from 'lucide-react';
import Link from 'next/link';

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
  guest_count: number;
  photos_count: number;
  posts_count: number;
  created_at: string;
}

export default function AdminEventView() {
  const params = useParams();
  const router = useRouter();
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-8 w-8 animate-pulse mx-auto mb-4 text-purple-600" />
          <p>Loading event details...</p>
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
                <h1 className="text-2xl font-bold">Event Dashboard</h1>
                <p className="text-gray-600">{eventData.name}</p>
              </div>
            </div>
            <Badge className={getStatusColor(eventData.status)}>
              {eventData.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Event Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Event Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Event Name</label>
                  <p className="font-semibold">{eventData.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Event Code</label>
                  <p className="font-mono font-semibold">{eventData.event_code}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Couple Email</label>
                  <p>{eventData.couple_email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Event Date</label>
                  <p>{eventData.event_date ? new Date(eventData.event_date).toLocaleDateString() : 'Not set'}</p>
                </div>
              </div>
              {eventData.description && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="mt-1">{eventData.description}</p>
                </div>
              )}
              <div className="flex items-center gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Theme Color</label>
                  <div className="flex items-center gap-2 mt-1">
                    <div 
                      className="w-6 h-6 rounded-full border"
                      style={{ backgroundColor: eventData.primary_color }}
                    />
                    <span className="font-mono text-sm">{eventData.primary_color}</span>
                  </div>
                </div>
                {eventData.logo_url && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Logo</label>
                    <img 
                      src={eventData.logo_url} 
                      alt="Event logo" 
                      className="w-12 h-12 object-contain mt-1"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm">Guests</span>
                </div>
                <span className="font-semibold">{eventData.guest_count}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Camera className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm">Photos</span>
                </div>
                <span className="font-semibold">{eventData.photos_count}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm">Posts</span>
                </div>
                <span className="font-semibold">{eventData.posts_count}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm">Created</span>
                </div>
                <span className="text-sm">{new Date(eventData.created_at).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Link href={`/admin/events/${eventData.id}/manage`}>
            <Button>
              Manage Event
            </Button>
          </Link>
          <Button variant="outline">
            View Guest List
          </Button>
          <Button variant="outline">
            View Content
          </Button>
        </div>
      </div>
    </div>
  );
}