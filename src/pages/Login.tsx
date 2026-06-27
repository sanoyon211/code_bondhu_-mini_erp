import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Logged in successfully');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-4 relative overflow-hidden">
      {/* Ambient background shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full bg-violet-300/30 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-fuchsia-300/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-[40%] left-[60%] w-72 h-72 rounded-full bg-blue-300/20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      <Card className="w-full max-w-md relative z-10 bg-white/70 backdrop-blur-xl border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500"></div>
        <CardHeader className="space-y-2 pb-6 pt-8 text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-violet-100">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-violet-600">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight text-slate-900">Welcome Back</CardTitle>
          <CardDescription className="text-slate-500 font-medium">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-5">
            <div className="space-y-2.5">
              <Label htmlFor="email" className="text-slate-700 font-semibold">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="h-11 bg-white/50 border-slate-200 focus:bg-white focus:ring-violet-500 focus:border-violet-500 transition-all"
              />
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-700 font-semibold">Password</Label>
                <Link to="#" className="text-xs font-medium text-violet-600 hover:text-violet-500 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="h-11 bg-white/50 border-slate-200 focus:bg-white focus:ring-violet-500 focus:border-violet-500 transition-all"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-5 pb-8 pt-4">
            <Button 
              type="submit" 
              className="w-full h-11 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-semibold text-md shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5" 
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            <div className="text-center text-sm text-slate-500 font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-violet-600 hover:text-violet-700 hover:underline transition-colors">
                Create an account
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
