'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft,
  Heart,
  Palette,
  Upload,
  Save,
  Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface EventCustomization {
  id: number;
  name: string;
  primary_color: string;
  logo_url?: string;
  logo_text?: string;
}

export default function CoupleCustomize() {
  const [eventData, setEventData] = useState<EventCustomization | null>(null);
  const [formData, setFormData] = useState({
    primary_color: '#d946ef',
    logo_text: '',
    use_text_logo: true,
    logo_url:null
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

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
        console.log(formData.logo_url)
        setFormData({
          primary_color: data.event.primary_color || '#d946ef',
          logo_text: data.event.logo_text || data.event.name,
          use_text_logo: formData.logo_url ? false : true,
          logo_url: formData.logo_url || data.event.logo_url
        });
        console.log('====================================');
        console.log(formData);
        console.log('====================================');
      }
    } catch (error) {
      console.error('Failed to fetch event data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch('/api/couple/customize', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Event customization saved successfully');
        fetchEventData(); // Refresh data
      } else {
        toast.error('Failed to save customization');
      }
    } catch (error) {
      toast.error('Failed to save customization');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formDataFile = new FormData();
    formDataFile.append('file', file);
    formDataFile.append('type', 'image');

    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch('/api/couple/upload-logo', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formDataFile,
      });

      if (response.ok) {
        const data = await response.json();
        formData.logo_url = data.url;
        setFormData(prev => ({ ...prev, use_text_logo: false}));
        toast.success('Logo uploaded successfully');
        fetchEventData(); // Refresh to get new logo URL
      } else {
        toast.error('Failed to upload logo');
      }
    } catch (error) {
      toast.error('Failed to upload logo');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Palette className="h-8 w-8 animate-pulse mx-auto mb-4 text-purple-600" />
          <p>Loading customization...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div 
        className="text-white"
        style={{ background: `linear-gradient(135deg, ${formData.primary_color}, ${formData.primary_color}dd)` }}
      >
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
                <h1 className="text-2xl font-bold font-playfair">Customize Event</h1>
                <p className="text-white/80">Personalize your wedding's appearance</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customization Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="h-5 w-5 mr-2" />
                  Color Theme
                </CardTitle>
                <CardDescription>
                  Choose your event's primary color
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="primary_color">Primary Color</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="primary_color"
                      name="primary_color"
                      type="color"
                      value={formData.primary_color}
                      onChange={handleChange}
                      className="w-16 h-12"
                    />
                    <Input
                      value={formData.primary_color}
                      onChange={handleChange}
                      name="primary_color"
                      className="font-mono flex-1"
                      placeholder="#d946ef"
                    />
                  </div>
                </div>

                {/* Color Presets */}
                <div className="space-y-2">
                  <Label>Popular Wedding Colors</Label>
                  <div className="grid grid-cols-6 gap-2">
                    {[
                      '#d946ef', // Purple
                      '#ec4899', // Pink
                      '#10b981', // Emerald
                      '#f59e0b', // Amber
                      '#3b82f6', // Blue
                      '#ef4444', // Red
                    ].map((color) => (
                      <button
                        key={color}
                        className="w-10 h-10 rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-colors"
                        style={{ backgroundColor: color }}
                        onClick={() => setFormData(prev => ({ ...prev, primary_color: color }))}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ImageIcon className="h-5 w-5 mr-2" />
                  Logo & Branding
                </CardTitle>
                <CardDescription>
                  Choose between a text logo or upload an image
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="text_logo"
                      name="logo_type"
                      checked={formData.use_text_logo}
                      onChange={() => setFormData(prev => ({ ...prev, use_text_logo: true }))}
                    />
                    <Label htmlFor="text_logo">Use Text Logo</Label>
                  </div>
                  
                  {formData.use_text_logo && (
                    <div className="space-y-2">
                      <Label htmlFor="logo_text">Logo Text</Label>
                      <Input
                        id="logo_text"
                        name="logo_text"
                        value={formData.logo_text}
                        onChange={handleChange}
                        placeholder="Enter your event name"
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="image_logo"
                      name="logo_type"
                      checked={!formData.use_text_logo}
                      onChange={() => setFormData(prev => ({ ...prev, use_text_logo: false }))}
                    />
                    <Label htmlFor="image_logo">Upload Image Logo</Label>
                  </div>

                  {!formData.use_text_logo && (
                    <div className="space-y-4">
                      {eventData?.logo_url && (
                        <div>
                          <Label>Current Logo</Label>
                          <img 
                            src={eventData.logo_url} 
                            alt="Current logo" 
                            className="w-24 h-24 object-contain border rounded-lg mt-2"
                          />
                        </div>
                      )}
                      
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">
                          Upload a new logo (PNG, JPG, SVG)
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                          id="logo-upload"
                          disabled={uploading}
                        />
                        <label htmlFor="logo-upload">
                          <Button asChild size="sm" disabled={uploading}>
                            <span>
                              {uploading ? 'Uploading...' : 'Choose File'}
                            </span>
                          </Button>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleSave} disabled={saving} className="w-full">
              {saving ? (
                'Saving...'
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Customization
                </>
              )}
            </Button>
          </div>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                See how your event will look
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Header Preview */}
                <div 
                  className="p-6 rounded-lg text-white"
                  style={{ background: `linear-gradient(135deg, ${formData.primary_color}, ${formData.primary_color}dd)` }}
                >
                  <div className="flex items-center">
                    <Heart className="h-8 w-8 mr-3" />
                    <div>
                      <h2 className="text-xl font-bold font-playfair">
                        {formData.use_text_logo ? formData.logo_text : eventData?.name}
                      </h2>
                      <p className="text-white/80">Wedding Celebration</p>
                    </div>
                  </div>
                </div>

                {/* Button Preview */}
                <div className="space-y-3">
                  <Button 
                    className="w-full"
                    style={{ backgroundColor: formData.primary_color }}
                  >
                    Primary Button
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    style={{ borderColor: formData.primary_color, color: formData.primary_color }}
                  >
                    Secondary Button
                  </Button>
                </div>

                {/* Logo Preview */}
                {!formData.use_text_logo && eventData?.logo_url && (
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Logo Preview</p>
                    <img 
                      src={eventData.logo_url} 
                      alt="Logo preview" 
                      className="w-16 h-16 object-contain mx-auto"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}