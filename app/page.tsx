'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function Home() {
  const [coupleForm, setCoupleForm] = useState({
    eventCode: '',
    password: '',
    loading: false,
  });
  
  const [adminForm, setAdminForm] = useState({
    email: '',
    password: '',
    loading: false,
  });

  const router = useRouter();

  const handleCoupleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCoupleForm(prev => ({ ...prev, loading: true }));

    try {
      const response = await fetch('/api/auth/couple-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          eventCode: coupleForm.eventCode, 
          password: coupleForm.password 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('auth-token', data.token);
        toast.success('Login successful!');
        router.push('/couple/dashboard');
      } else {
        toast.error(data.message || 'Invalid credentials');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setCoupleForm(prev => ({ ...prev, loading: false }));
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminForm(prev => ({ ...prev, loading: true }));

    try {
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: adminForm.email, 
          password: adminForm.password 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('auth-token', data.token);
        toast.success('Admin access granted');
        router.push('/admin/dashboard');
      } else {
        toast.error(data.message || 'Invalid credentials');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setAdminForm(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="min-h-screen wedding-gradient">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16 pt-16">
          <div className="flex items-center justify-center mb-6">
            <Heart className="h-12 w-12 text-white mr-4" />
            <h1 className="font-playfair text-6xl font-bold text-white">
              Wedding Events
            </h1>
          </div>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Manage your wedding events and create beautiful memories together.
          </p>
        </div>

        {/* Login Forms */}
        <div className="max-w-md mx-auto">
          <Card className="wedding-card">
            <CardHeader className="text-center">
              <CardTitle className="font-playfair text-2xl">Access Platform</CardTitle>
              <CardDescription>
                Choose your access level and sign in
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="couple" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="couple">Wedding</TabsTrigger>
                  <TabsTrigger value="admin">Admin</TabsTrigger>
                </TabsList>
                
                <TabsContent value="couple" className="space-y-4">
                  <div className="text-center py-2">
                    <Heart className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-lg mb-1">Couple Access</h3>
                    <p className="text-gray-600 text-sm mb-4">Access your wedding dashboard</p>
                  </div>
                  
                  <form onSubmit={handleCoupleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="eventCode">Event Code</Label>
                      <Input
                        id="eventCode"
                        type="text"
                        placeholder="Enter your event code"
                        value={coupleForm.eventCode}
                        onChange={(e) => setCoupleForm(prev => ({ 
                          ...prev, 
                          eventCode: e.target.value.toUpperCase() 
                        }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="couplePassword">Password</Label>
                      <Input
                        id="couplePassword"
                        type="password"
                        placeholder="Enter your password"
                        value={coupleForm.password}
                        onChange={(e) => setCoupleForm(prev => ({ 
                          ...prev, 
                          password: e.target.value 
                        }))}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={coupleForm.loading}>
                      {coupleForm.loading ? 'Signing in...' : 'Sign In to Wedding Dashboard'}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="admin" className="space-y-4">
                  <div className="text-center py-2">
                    <Shield className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-lg mb-1">Admin Access</h3>
                    <p className="text-gray-600 text-sm mb-4">Platform administration</p>
                  </div>
                  
                  <form onSubmit={handleAdminLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="adminEmail">Email</Label>
                      <Input
                        id="adminEmail"
                        type="email"
                        placeholder="admin@example.com"
                        value={adminForm.email}
                        onChange={(e) => setAdminForm(prev => ({ 
                          ...prev, 
                          email: e.target.value 
                        }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adminPassword">Password</Label>
                      <Input
                        id="adminPassword"
                        type="password"
                        placeholder="Enter admin password"
                        value={adminForm.password}
                        onChange={(e) => setAdminForm(prev => ({ 
                          ...prev, 
                          password: e.target.value 
                        }))}
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      variant="outline" 
                      className="w-full" 
                      disabled={adminForm.loading}
                    >
                      {adminForm.loading ? 'Signing in...' : 'Sign In to Admin Panel'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}