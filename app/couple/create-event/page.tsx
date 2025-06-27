'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Heart, ArrowLeft, Send, Sparkles, Calendar, Users } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function CoupleCreateEvent() {
  const [formData, setFormData] = useState({
    eventName: '',
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
      const response = await fetch('/api/couple/create-event', {
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
        toast.success(`Your event code is: ${data.event.event_code}`);
        router.push('/couple/dashboard');
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

  const generateEventName = () => {
    if (formData.groomName && formData.brideName) {
      setFormData(prev => ({
        ...prev,
        eventName: `${formData.groomName} & ${formData.brideName}'s Wedding`
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="wedding-gradient text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Heart className="h-8 w-8 mr-3" />
                <div>
                  <h1 className="text-3xl font-bold font-playfair">Create Your Wedding Event</h1>
                  <p className="text-white/80">Start your beautiful journey with us</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-purple-600 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-900">Welcome to Your Wedding Platform</h2>
              <Sparkles className="h-6 w-6 text-purple-600 ml-2" />
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Let's create your personalized wedding event where you can manage guests, 
              customize the experience, and collect beautiful memories from your special day.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Event Details
                </CardTitle>
                <CardDescription>
                  Tell us about your special day
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
                        onBlur={generateEventName}
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
                        onBlur={generateEventName}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="eventName">Event Name</Label>
                    <div className="flex gap-2">
                      <Input
                        id="eventName"
                        name="eventName"
                        type="text"
                        placeholder="e.g., John & Jane's Wedding"
                        value={formData.eventName}
                        onChange={handleChange}
                        required
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={generateEventName}
                        disabled={!formData.groomName || !formData.brideName}
                        className="px-3"
                      >
                        <Sparkles className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      This will be the name displayed throughout your wedding platform
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="eventDate">Wedding Date</Label>
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
                      placeholder="Share something special about your wedding day..."
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      'Creating Your Event...'
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Create Wedding Event
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Features Preview */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-purple-600" />
                    What You'll Get
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Users className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Guest Management</h4>
                      <p className="text-sm text-gray-600">
                        Import guest lists, send invitations, and manage RSVPs effortlessly
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Custom Branding</h4>
                      <p className="text-sm text-gray-600">
                        Personalize colors, fonts, and logos to match your wedding theme
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Photo Sharing</h4>
                      <p className="text-sm text-gray-600">
                        Guests can share photos and memories in real-time during your event
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                      <Heart className="h-4 w-4 text-pink-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Memory Collection</h4>
                      <p className="text-sm text-gray-600">
                        Automatically collect all photos and messages in one beautiful place
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                <CardContent className="p-6">
                  <div className="text-center">
                    <Heart className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Ready to Begin?</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Once you create your event, you'll receive a unique event code that your guests can use to join and share in your celebration.
                    </p>
                    <div className="bg-white/50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Your event code will look like:</p>
                      <p className="font-mono font-bold text-purple-600">WEDDING2024</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}