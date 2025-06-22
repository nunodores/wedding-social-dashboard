'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Heart, Send } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function CreateEvent() {
  const [formData, setFormData] = useState({
    eventName: '',
    coupleEmail: '',
    groomName: '',
    brideName: '',
    eventDate: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch('/api/admin/create-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Event created successfully!');
        toast.success('Credentials sent to couple via email');
        router.push('/admin/dashboard');
      } else {
        toast.error(data.message || 'Failed to create event');
      }
    } catch (error) {
      toast.error('Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Link href="/admin/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-700 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold">Create New Event</h1>
                <p className="text-gray-600">Set up a new wedding celebration</p>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
              <CardDescription>
                Enter the wedding details. Credentials will be automatically generated and sent to the couple.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="groomName">Groom's Name</Label>
                    <Input
                      id="groomName"
                      name="groomName"
                      type="text"
                      placeholder="Enter groom's name"
                      value={formData.groomName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brideName">Bride's Name</Label>
                    <Input
                      id="brideName"
                      name="brideName"
                      type="text"
                      placeholder="Enter bride's name"
                      value={formData.brideName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventName">Event Name</Label>
                  <Input
                    id="eventName"
                    name="eventName"
                    type="text"
                    placeholder="e.g., John & Jane's Wedding"
                    value={formData.eventName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coupleEmail">Couple's Email</Label>
                  <Input
                    id="coupleEmail"
                    name="coupleEmail"
                    type="email"
                    placeholder="couple@example.com"
                    value={formData.coupleEmail}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventDate">Event Date</Label>
                  <Input
                    id="eventDate"
                    name="eventDate"
                    type="date"
                    value={formData.eventDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Add any special notes about the event..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    'Creating Event...'
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Create Event & Send Credentials
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}