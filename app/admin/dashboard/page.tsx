'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Eye,
  Settings,
  LogOut,
  Heart,
  Activity,
  UserX,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Event {
  id: number;
  name: string;
  event_code: string;
  status: 'active' | 'inactive' | 'completed';
  couple_email: string;
  created_at: string;
  event_date?: string;
  guest_count: number;
  photos_count: number;
  posts_count: number;
}

type EventFilter = 'all' | 'past' | 'active' | 'future';

export default function AdminDashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<EventFilter>('all');
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, activeFilter]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch('/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(data.events);
        setStats({
          totalEvents: data.stats.totalEvents,
          activeEvents: data.stats.activeEvents,
        });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let filtered = events;

    switch (activeFilter) {
      case 'past':
        filtered = events.filter(event => {
          if (!event.event_date) return false;
          const eventDate = new Date(event.event_date);
          return eventDate < today;
        });
        break;
      case 'active':
        filtered = events.filter(event => {
          if (!event.event_date) return event.status === 'active';
          const eventDate = new Date(event.event_date);
          return eventDate.getTime() === today.getTime() || event.status === 'active';
        });
        break;
      case 'future':
        filtered = events.filter(event => {
          if (!event.event_date) return false;
          const eventDate = new Date(event.event_date);
          return eventDate > today;
        });
        break;
      default:
        filtered = events;
    }

    setFilteredEvents(filtered);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    router.push('/');
  };

  const handleViewEvent = (eventId: number) => {
    router.push(`/admin/events/${eventId}/view`);
  };

  const handleManageEvent = (eventId: number) => {
    router.push(`/admin/events/${eventId}/manage`);
  };

  const handleRemoveAccess = async (eventId: number, eventName: string) => {
    if (!confirm(`Are you sure you want to remove access for "${eventName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`/api/admin/events/${eventId}/remove-access`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success('Access removed successfully');
        fetchDashboardData(); // Refresh data
      } else {
        toast.error('Failed to remove access');
      }
    } catch (error) {
      toast.error('Failed to remove access');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventTypeIcon = (event: Event) => {
    if (!event.event_date) return <Calendar className="h-4 w-4" />;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(event.event_date);
    
    if (eventDate < today) {
      return <CheckCircle className="h-4 w-4 text-blue-600" />;
    } else if (eventDate.getTime() === today.getTime()) {
      return <AlertCircle className="h-4 w-4 text-orange-600" />;
    } else {
      return <Clock className="h-4 w-4 text-green-600" />;
    }
  };

  const getEventTypeLabel = (event: Event) => {
    if (!event.event_date) return 'No date set';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(event.event_date);
    
    if (eventDate < today) {
      return 'Past Event';
    } else if (eventDate.getTime() === today.getTime()) {
      return 'Today';
    } else {
      return 'Upcoming';
    }
  };

  const getFilterCounts = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pastCount = events.filter(event => {
      if (!event.event_date) return false;
      const eventDate = new Date(event.event_date);
      return eventDate < today;
    }).length;

    const activeCount = events.filter(event => {
      if (!event.event_date) return event.status === 'active';
      const eventDate = new Date(event.event_date);
      return eventDate.getTime() === today.getTime() || event.status === 'active';
    }).length;

    const futureCount = events.filter(event => {
      if (!event.event_date) return false;
      const eventDate = new Date(event.event_date);
      return eventDate > today;
    }).length;

    return { pastCount, activeCount, futureCount };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const { pastCount, activeCount, futureCount } = getFilterCounts();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center">
              <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 mr-3" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-sm sm:text-base text-gray-600">Wedding Events Platform</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <Link href="/admin/create-event" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto text-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              </Link>
              <Button variant="outline" onClick={handleLogout} className="w-full sm:w-auto text-sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEvents}</div>
              <p className="text-xs text-muted-foreground">All wedding events</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Events</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeEvents}</div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="events" className="space-y-6">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="events" className="text-sm">Events</TabsTrigger>
            <TabsTrigger value="payments" className="text-sm">Payments</TabsTrigger>
            <TabsTrigger value="settings" className="text-sm">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <h2 className="text-lg sm:text-xl font-semibold">Wedding Events</h2>
              
              {/* Event Filters */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full lg:w-auto">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 hidden sm:inline">Filter:</span>
                </div>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  <Button
                    variant={activeFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveFilter('all')}
                    className="text-xs sm:text-sm"
                  >
                    All ({events.length})
                  </Button>
                  <Button
                    variant={activeFilter === 'past' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveFilter('past')}
                    className="text-xs sm:text-sm"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Past ({pastCount})
                  </Button>
                  <Button
                    variant={activeFilter === 'active' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveFilter('active')}
                    className="text-xs sm:text-sm"
                  >
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Active ({activeCount})
                  </Button>
                  <Button
                    variant={activeFilter === 'future' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveFilter('future')}
                    className="text-xs sm:text-sm"
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    Future ({futureCount})
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {filteredEvents.length === 0 ? (
                <Card>
                  <CardContent className="p-6 sm:p-8 text-center">
                    <Calendar className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-base sm:text-lg font-semibold mb-2">
                      No {activeFilter === 'all' ? '' : activeFilter} events found
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-4">
                      {activeFilter === 'all' 
                        ? 'No events have been created yet.' 
                        : `No ${activeFilter} events match your filter.`}
                    </p>
                    {activeFilter === 'all' && (
                      <Link href="/admin/create-event">
                        <Button className="text-sm">Create Your First Event</Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ) : (
                filteredEvents.map((event) => (
                  <Card key={event.id}>
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                            <h3 className="font-semibold text-sm sm:text-base">{event.name}</h3>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge className={getStatusColor(event.status)}>
                                {event.status}
                              </Badge>
                              <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
                                {getEventTypeIcon(event)}
                                <span>{getEventTypeLabel(event)}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600">
                            Code: {event.event_code} • Couple: {event.couple_email}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                            <span>{event.guest_count} guests</span>
                            <span>{event.photos_count} photos</span>
                            <span>{event.posts_count} posts</span>
                            {event.event_date && (
                              <span>Date: {new Date(event.event_date).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewEvent(event.id)}
                            className="text-xs sm:text-sm w-full sm:w-auto"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleManageEvent(event.id)}
                            className="text-xs sm:text-sm w-full sm:w-auto"
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Manage
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-600 hover:text-red-700 text-xs sm:text-sm w-full sm:w-auto"
                            onClick={() => handleRemoveAccess(event.id, event.name)}
                          >
                            <UserX className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Remove Access</span>
                            <span className="sm:hidden">Remove</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Payment Management</CardTitle>
                <CardDescription className="text-sm">Stripe integration and payment tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base text-gray-600">Payment features will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Platform Settings</CardTitle>
                <CardDescription className="text-sm">Configure platform-wide settings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base text-gray-600">Settings panel coming soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}