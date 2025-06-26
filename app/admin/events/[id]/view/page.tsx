'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Heart, Users, Camera, FileText, Calendar, Mail, Phone, Eye, MessageCircle, ThumbsUp } from 'lucide-react';
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

interface Guest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
}

interface Post {
  id: string;
  content?: string;
  image_url?: string;
  video_url?: string;
  createdAt: string;
  guest: {
    name: string;
    email: string;
  };
  likes_count: number;
  comments_count: number;
}

export default function AdminEventView() {
  const params = useParams();
  const router = useRouter();
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [guestsLoading, setGuestsLoading] = useState(false);
  const [postsLoading, setPostsLoading] = useState(false);

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

  const fetchGuests = async () => {
    setGuestsLoading(true);
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`/api/admin/events/${params.id}/guests`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setGuests(data.guests);
      }
    } catch (error) {
      console.error('Failed to fetch guests:', error);
    } finally {
      setGuestsLoading(false);
    }
  };

  const fetchPosts = async () => {
    setPostsLoading(true);
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`/api/admin/events/${params.id}/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setPostsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Heart className="h-8 w-8 animate-pulse mx-auto mb-4 text-purple-600" />
          <p>Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center w-full sm:w-auto">
              <Link href="/admin/dashboard" className="mr-4">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 mr-3 flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold">Event Dashboard</h1>
                <p className="text-sm sm:text-base text-gray-600 truncate">{eventData.name}</p>
              </div>
            </div>
            <Badge className={getStatusColor(eventData.status)}>
              {eventData.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Event Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 sm:mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Event Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Event Name</label>
                  <p className="font-semibold text-sm sm:text-base">{eventData.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Event Code</label>
                  <p className="font-mono font-semibold text-sm sm:text-base">{eventData.event_code}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Couple Email</label>
                  <p className="text-sm sm:text-base truncate">{eventData.couple_email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Event Date</label>
                  <p className="text-sm sm:text-base">{eventData.event_date ? new Date(eventData.event_date).toLocaleDateString() : 'Not set'}</p>
                </div>
              </div>
              {eventData.description && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="mt-1 text-sm sm:text-base">{eventData.description}</p>
                </div>
              )}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
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
              <CardTitle className="text-base sm:text-lg">Quick Stats</CardTitle>
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

        {/* Tabs for Guest List and Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
            <TabsTrigger value="guests" onClick={() => !guests.length && fetchGuests()} className="text-sm">
              Guest List ({eventData.guest_count})
            </TabsTrigger>
            <TabsTrigger value="content" onClick={() => !posts.length && fetchPosts()} className="text-sm">
              Content ({eventData.posts_count})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base sm:text-lg">
                    <Users className="h-5 w-5 mr-2" />
                    Guest Management
                  </CardTitle>
                  <CardDescription className="text-sm">
                    View and manage event guests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <p className="text-2xl font-bold text-purple-600 mb-2">{eventData.guest_count}</p>
                    <p className="text-gray-600 mb-4 text-sm sm:text-base">Total Guests</p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        if (!guests.length) fetchGuests();
                        // Switch to guests tab
                        const guestsTab = document.querySelector('[value="guests"]') as HTMLElement;
                        guestsTab?.click();
                      }}
                      className="text-sm"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Guest List
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base sm:text-lg">
                    <Camera className="h-5 w-5 mr-2" />
                    Shared Content
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Photos and posts from guests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <div className="flex justify-center gap-4 mb-4">
                      <div>
                        <p className="text-xl font-bold text-blue-600">{eventData.posts_count}</p>
                        <p className="text-xs text-gray-600">Posts</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-green-600">{eventData.photos_count}</p>
                        <p className="text-xs text-gray-600">Photos</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        if (!posts.length) fetchPosts();
                        // Switch to content tab
                        const contentTab = document.querySelector('[value="content"]') as HTMLElement;
                        contentTab?.click();
                      }}
                      className="text-sm"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Content
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="guests">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Guest List</CardTitle>
                <CardDescription className="text-sm">
                  All guests invited to this event
                </CardDescription>
              </CardHeader>
              <CardContent>
                {guestsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600 text-sm">Loading guests...</p>
                  </div>
                ) : guests.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 text-sm sm:text-base">No guests found for this event</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {guests.map((guest) => (
                      <div key={guest.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm sm:text-base">{guest.name}</h4>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-600 mt-1">
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-1 flex-shrink-0" />
                              <span className="truncate">{guest.email}</span>
                            </div>
                            {guest.phone && (
                              <div className="flex items-center">
                                <Phone className="h-4 w-4 mr-1 flex-shrink-0" />
                                <span>{guest.phone}</span>
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Joined: {formatDate(guest.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Shared Content</CardTitle>
                <CardDescription className="text-sm">
                  Photos and posts shared by guests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {postsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600 text-sm">Loading content...</p>
                  </div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-8">
                    <Camera className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 text-sm sm:text-base">No content shared yet</p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-2">
                      Content will appear here when guests start sharing photos and posts
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {posts.map((post) => (
                      <div key={post.id} className="border rounded-lg overflow-hidden">
                        {/* Post Header */}
                        <div className="p-4 border-b">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="min-w-0">
                              <h4 className="font-semibold text-sm sm:text-base">{post.guest.name}</h4>
                              <p className="text-xs sm:text-sm text-gray-600 truncate">{post.guest.email}</p>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-500">
                              {formatDate(post.createdAt)}
                            </p>
                          </div>
                        </div>

                        {/* Post Content */}
                        <div className="p-4">
                          {post.content && (
                            <p className="text-gray-900 mb-3 text-sm sm:text-base">{post.content}</p>
                          )}
                          
                          {post.image_url && (
                            <div className="mb-3">
                              <img 
                                src={post.image_url} 
                                alt="Post content" 
                                className="w-full max-w-md rounded-lg"
                              />
                            </div>
                          )}

                          {post.video_url && (
                            <div className="mb-3">
                              <video 
                                src={post.video_url} 
                                controls 
                                className="w-full max-w-md rounded-lg"
                              />
                            </div>
                          )}

                          {/* Post Stats */}
                          <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-600">
                            <div className="flex items-center">
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              {post.likes_count} likes
                            </div>
                            <div className="flex items-center">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              {post.comments_count} comments
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link href={`/admin/events/${eventData.id}/manage`} className="w-full sm:w-auto">
            <Button className="w-full text-sm">
              Manage Event
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}