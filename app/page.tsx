'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Heart, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function Home() {
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    loading: false,
    showPassword: false,
  });
  
  const [adminForm, setAdminForm] = useState({
    email: '',
    password: '',
    loading: false,
  });

  const router = useRouter();

  // const handleCoupleLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setCoupleForm(prev => ({ ...prev, loading: true }));

  //   try {
  //     const response = await fetch('/api/auth/couple-login', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ 
  //         eventCode: coupleForm.eventCode, 
  //         password: coupleForm.password 
  //       }),
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       localStorage.setItem('auth-token', data.token);
  //       toast.success('Login successful!');
  //       router.push('/couple/dashboard');
  //     } else {
  //       toast.error(data.message || 'Invalid credentials');
  //     }
  //   } catch (error) {
  //     toast.error('Login failed. Please try again.');
  //   } finally {
  //     setCoupleForm(prev => ({ ...prev, loading: false }));
  //   }
  // };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginForm(prev => ({ ...prev, loading: true }));

    try {
      const response = await fetch('/api/auth/couple-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: loginForm.email, 
          password: loginForm.password 
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
      setLoginForm(prev => ({ ...prev, loading: false }));
    }
  };
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16 pt-8 sm:pt-16">
          <div className="flex flex-col sm:flex-row items-center justify-center mb-4 sm:mb-6">
            <Heart className="h-8 w-8 sm:h-12 sm:w-12 text-white mb-2 sm:mb-0 sm:mr-4" />
            <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-white text-center sm:text-left">
              Wedding Events
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Manage your wedding events and create beautiful memories together.
          </p>
        </div>

        {/* Login Forms */}
        <div className="max-w-md mx-auto">
          <Card className="wedding-card">
            <CardHeader className="text-center px-4 sm:px-6">
              <CardTitle className="font-playfair text-xl sm:text-2xl">Access Platform</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Choose your access level and sign in
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <Tabs defaultValue="couple" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="couple" className="text-sm">Wedding</TabsTrigger>
                  <TabsTrigger value="admin" className="text-sm">Admin</TabsTrigger>
                </TabsList>
                
                <TabsContent value="couple" className="space-y-4">
                  <div className="text-center py-2">
                    <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-base sm:text-lg mb-1">Couple Access</h3>
                    <p className="text-gray-600 text-xs sm:text-sm mb-4">Access your wedding dashboard</p>
                  </div>
                  
                  <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginForm.email}
                    onChange={handleLoginChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      name="password"
                      type={loginForm.showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={loginForm.password}
                      onChange={handleLoginChange}
                      className="pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setLoginForm(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                    >
                      {loginForm.showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loginForm.loading}>
                  {loginForm.loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
                </TabsContent>
                
                <TabsContent value="admin" className="space-y-4">
                  <div className="text-center py-2">
                    <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-base sm:text-lg mb-1">Admin Access</h3>
                    <p className="text-gray-600 text-xs sm:text-sm mb-4">Platform administration</p>
                  </div>
                  
                  <form onSubmit={handleAdminLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="adminEmail" className="text-sm">Email</Label>
                      <Input
                        id="adminEmail"
                        type="email"
                        placeholder="admin@example.com"
                        value={adminForm.email}
                        onChange={(e) => setAdminForm(prev => ({ 
                          ...prev, 
                          email: e.target.value 
                        }))}
                        className="text-sm sm:text-base"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adminPassword" className="text-sm">Password</Label>
                      <Input
                        id="adminPassword"
                        type="password"
                        placeholder="Enter admin password"
                        value={adminForm.password}
                        onChange={(e) => setAdminForm(prev => ({ 
                          ...prev, 
                          password: e.target.value 
                        }))}
                        className="text-sm sm:text-base"
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      variant="outline" 
                      className="w-full text-sm sm:text-base py-2 sm:py-3" 
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