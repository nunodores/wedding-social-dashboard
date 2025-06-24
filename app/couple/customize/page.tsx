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
  Image as ImageIcon,
  Bell,
  Home,
  Search,
  PlusSquare,
  User,
  MoreHorizontal,
  MessageCircle,
  Share,
  Bookmark,
  Type
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface EventCustomization {
  id: number;
  name: string;
  primary_color: string;
  logo_url?: string;
  logo_text?: string;
  font_name?: string;
}

const FONT_OPTIONS = [
  { name: 'Playfair Display', value: 'font-playfair', class: 'font-playfair', description: 'Elegant serif' },
  { name: 'Dancing Script', value: 'font-dancing', class: 'font-dancing', description: 'Romantic script' },
  { name: 'Great Vibes', value: 'font-vibes', class: 'font-vibes', description: 'Flowing script' },
  { name: 'Cinzel', value: 'font-cinzel', class: 'font-cinzel', description: 'Classic roman' },
  { name: 'Cormorant Garamond', value: 'font-cormorant', class: 'font-cormorant', description: 'Refined serif' },
  { name: 'Montserrat', value: 'font-montserrat', class: 'font-montserrat', description: 'Modern sans-serif' },
  { name: 'Lora', value: 'font-lora', class: 'font-lora', description: 'Contemporary serif' },
  { name: 'Poppins', value: 'font-poppins', class: 'font-poppins', description: 'Clean geometric' },
];

export default function CoupleCustomize() {
  const [eventData, setEventData] = useState<EventCustomization | null>(null);
  const [formData, setFormData] = useState({
    primary_color: '#d946ef',
    logo_text: '',
    font_name: 'font-playfair',
    use_text_logo: true,
    logo_url: null
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
      
        setFormData({
          primary_color: data.event.primary_color || '#d946ef',
          logo_text: data.event.name,
          font_name: data.event.font_name || 'font-playfair',
          use_text_logo: data.event.use_logo_text,
          logo_url:  data.event.logo_url
        });

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
    formDataFile.append('folder', `wedding-app/${eventData?.id}/logos`);
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
        toast.success('Logo uploaded successfully');
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getSelectedFont = () => {
    return FONT_OPTIONS.find(font => font.value === formData.font_name) || FONT_OPTIONS[0];
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
    <>
      {/* Google Fonts Import */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=Great+Vibes&family=Cinzel:wght@400;500;600&family=Cormorant+Garamond:wght@300;400;500;600&family=Montserrat:wght@300;400;500;600;700&family=Lora:wght@400;500;600&family=Poppins:wght@300;400;500;600;700&display=swap');
        
        .font-dancing { font-family: 'Dancing Script', cursive; }
        .font-vibes { font-family: 'Great Vibes', cursive; }
        .font-cinzel { font-family: 'Cinzel', serif; }
        .font-cormorant { font-family: 'Cormorant Garamond', serif; }
        .font-montserrat { font-family: 'Montserrat', sans-serif; }
        .font-lora { font-family: 'Lora', serif; }
        .font-poppins { font-family: 'Poppins', sans-serif; }
      `}</style>

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

        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                      <div className="space-y-4">
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

                        <div className="space-y-2">
                          <Label htmlFor="font_name" className="flex items-center">
                            <Type className="h-4 w-4 mr-2" />
                            Font Style
                          </Label>
                          <select
                            id="font_name"
                            name="font_name"
                            value={formData.font_name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            {FONT_OPTIONS.map((font) => (
                              <option key={font.value} value={font.value}>
                                {font.name} - {font.description}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Font Preview */}
                        <div className="space-y-2">
                          <Label>Font Preview</Label>
                          <div className="p-4 border rounded-lg bg-gray-50">
                            <div className="grid grid-cols-1 gap-3">
                              {FONT_OPTIONS.map((font) => (
                                <button
                                  key={font.value}
                                  type="button"
                                  onClick={() => setFormData(prev => ({ ...prev, font_name: font.value }))}
                                  className={`p-3 text-left border rounded-lg transition-all hover:border-purple-300 ${
                                    formData.font_name === font.value 
                                      ? 'border-purple-500 bg-purple-50' 
                                      : 'border-gray-200 bg-white'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div 
                                        className={`text-lg ${font.class}`}
                                        style={{ color: formData.primary_color }}
                                      >
                                        {formData.logo_text || 'Your Wedding'}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {font.name} - {font.description}
                                      </div>
                                    </div>
                                    {formData.font_name === font.value && (
                                      <div 
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: formData.primary_color }}
                                      />
                                    )}
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
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
                        {(formData.logo_url || eventData?.logo_url) && (
                          <div>
                            <Label>Current Logo</Label>
                            <img 
                              src={formData.logo_url || eventData?.logo_url} 
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

            {/* Preview - Wedding App Interface */}
            <Card className="lg:sticky lg:top-8">
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>
                  See how your wedding app will look to guests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white border rounded-lg overflow-hidden shadow-lg max-w-sm mx-auto">
                  {/* App Header */}
                  <div className="flex items-center justify-between p-4 border-b bg-white">
                    <div className="flex items-center">
                      {formData.use_text_logo ? (
                        <h1 
                          className={`text-xl font-bold ${getSelectedFont().class}`}
                          style={{ color: formData.primary_color }}
                        >
                          {formData.logo_text || eventData?.name || 'WeddingPost'}
                        </h1>
                      ) : (
                        eventData?.logo_url ? (
                          <img 
                            src={eventData.logo_url} 
                            alt="Logo" 
                            className="h-8 w-auto"
                          />
                        ) : (
                          <h1 
                            className={`text-xl font-bold ${getSelectedFont().class}`}
                            style={{ color: formData.primary_color }}
                          >
                            WeddingPost
                          </h1>
                        )
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <Bell className="h-6 w-6 text-gray-700" />
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-600"></div>
                    </div>
                  </div>

                  {/* Stories Section */}
                  <div className="p-4 border-b bg-white">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="font-semibold text-gray-900">Stories</h2>
                      <div className="flex gap-1">
                        <button className="p-1 rounded-full hover:bg-gray-100">
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        </button>
                        <button className="p-1 rounded-full hover:bg-gray-100">
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full border-2 border-gray-300 flex items-center justify-center bg-gray-50">
                          <PlusSquare className="h-6 w-6 text-gray-400" />
                        </div>
                        <span className="text-xs text-gray-600 mt-1">Add Story</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div 
                          className="w-16 h-16 rounded-full border-2 flex items-center justify-center bg-gradient-to-br from-pink-400 to-purple-600"
                          style={{ borderColor: formData.primary_color }}
                        >
                          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-600"></div>
                          </div>
                        </div>
                        <span className="text-xs text-gray-600 mt-1">Your Story</span>
                      </div>
                    </div>
                  </div>

                  {/* Post Creation */}
                  <div className="p-4 border-b bg-white">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-600"></div>
                      <div className="flex-1 bg-gray-50 rounded-full px-4 py-2">
                        <span className="text-gray-500 text-sm">
                          Share a moment from {formData.logo_text || eventData?.name || 'the wedding'}...
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <button 
                        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50"
                        style={{ color: formData.primary_color }}
                      >
                        <ImageIcon className="h-5 w-5" />
                        <span className="text-sm font-medium">Photo</span>
                      </button>
                      <button 
                        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50"
                        style={{ color: formData.primary_color }}
                      >
                        <div className="h-5 w-5 border-2 border-current rounded"></div>
                        <span className="text-sm font-medium">Video</span>
                      </button>
                      <Button 
                        size="sm"
                        style={{ backgroundColor: formData.primary_color }}
                        className="text-white"
                      >
                        Post
                      </Button>
                    </div>
                  </div>

                  {/* Sample Post */}
                  <div className="bg-white">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-600"></div>
                          <div>
                            <h3 className="font-semibold text-sm">Guest Name</h3>
                            <p className="text-xs text-gray-500">about 2 hours ago</p>
                          </div>
                        </div>
                        <MoreHorizontal className="h-5 w-5 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-900 mb-3">
                        What a beautiful celebration! 💕
                      </p>
                      <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center mb-3">
                        <ImageIcon className="h-12 w-12 text-gray-400" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <button className="flex items-center gap-1">
                            <Heart 
                              className="h-6 w-6" 
                              style={{ color: formData.primary_color }}
                              fill={formData.primary_color}
                            />
                            <span className="text-sm text-gray-600">24</span>
                          </button>
                          <button className="flex items-center gap-1">
                            <MessageCircle className="h-6 w-6 text-gray-600" />
                            <span className="text-sm text-gray-600">8</span>
                          </button>
                          <Share className="h-6 w-6 text-gray-600" />
                        </div>
                        <Bookmark className="h-6 w-6 text-gray-600" />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Navigation */}
                  <div className="flex items-center justify-around p-3 border-t bg-white">
                    <Home 
                      className="h-6 w-6" 
                      style={{ color: formData.primary_color }}
                    />
                    <Search className="h-6 w-6 text-gray-400" />
                    <PlusSquare className="h-6 w-6 text-gray-400" />
                    <Heart className="h-6 w-6 text-gray-400" />
                    <User className="h-6 w-6 text-gray-400" />
                  </div>
                </div>

                {/* Customization Summary */}
                <div className="mt-4 space-y-2">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Primary Color:</span>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: formData.primary_color }}
                        />
                        <span className="font-mono text-xs">{formData.primary_color}</span>
                      </div>
                    </div>
                  </div>
                  
                  {formData.use_text_logo && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Font:</span>
                        <span className="text-xs">{getSelectedFont().name}</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}