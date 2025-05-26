
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User } from '@/types/calendar';

interface AuthModalProps {
  onAuth: (user: User) => void;
  onClose: () => void;
}

/**
 * Authentication modal component
 * Provides login, registration, and anonymous access options
 */
export const AuthModal: React.FC<AuthModalProps> = ({ onAuth, onClose }) => {
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register form state
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  
  // Anonymous form state
  const [anonymousUsername, setAnonymousUsername] = useState('');

  /**
   * Handle user login (mock implementation)
   */
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail || !loginPassword) return;

    // Mock login - in a real app, this would validate against a backend
    const user: User = {
      id: Date.now().toString(),
      username: loginEmail.split('@')[0],
      email: loginEmail,
      isAnonymous: false,
      createdAt: new Date().toISOString()
    };

    onAuth(user);
  };

  /**
   * Handle user registration (mock implementation)
   */
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerUsername || !registerEmail || !registerPassword) return;

    // Mock registration - in a real app, this would create a new account
    const user: User = {
      id: Date.now().toString(),
      username: registerUsername,
      email: registerEmail,
      isAnonymous: false,
      createdAt: new Date().toISOString()
    };

    onAuth(user);
  };

  /**
   * Handle anonymous access
   */
  const handleAnonymous = (e: React.FormEvent) => {
    e.preventDefault();
    
    const username = anonymousUsername.trim() || `Anonymous_${Date.now()}`;
    
    const user: User = {
      id: `anon_${Date.now()}`,
      username,
      isAnonymous: true,
      createdAt: new Date().toISOString()
    };

    onAuth(user);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-cyan-400/30 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-cyan-300 text-center">
            Welcome to ChronoGrid Nexus
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-700/50">
            <TabsTrigger value="login" className="text-cyan-300">Login</TabsTrigger>
            <TabsTrigger value="register" className="text-cyan-300">Register</TabsTrigger>
            <TabsTrigger value="anonymous" className="text-cyan-300">Anonymous</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="login-email" className="text-cyan-300">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="bg-slate-700/50 border-cyan-400/30 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="login-password" className="text-cyan-300">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Your password"
                  className="bg-slate-700/50 border-cyan-400/30 text-white"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
              >
                Login
              </Button>
            </form>
          </TabsContent>

          {/* Register Tab */}
          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <Label htmlFor="register-username" className="text-cyan-300">Username</Label>
                <Input
                  id="register-username"
                  value={registerUsername}
                  onChange={(e) => setRegisterUsername(e.target.value)}
                  placeholder="Choose a username"
                  className="bg-slate-700/50 border-cyan-400/30 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="register-email" className="text-cyan-300">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="bg-slate-700/50 border-cyan-400/30 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="register-password" className="text-cyan-300">Password</Label>
                <Input
                  id="register-password"
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="Create a password"
                  className="bg-slate-700/50 border-cyan-400/30 text-white"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
              >
                Register
              </Button>
            </form>
          </TabsContent>

          {/* Anonymous Tab */}
          <TabsContent value="anonymous">
            <form onSubmit={handleAnonymous} className="space-y-4">
              <div>
                <Label htmlFor="anonymous-username" className="text-cyan-300">
                  Display Name (Optional)
                </Label>
                <Input
                  id="anonymous-username"
                  value={anonymousUsername}
                  onChange={(e) => setAnonymousUsername(e.target.value)}
                  placeholder="Anonymous User"
                  className="bg-slate-700/50 border-cyan-400/30 text-white"
                />
              </div>
              <p className="text-sm text-cyan-400">
                Continue without an account. Your data will be stored locally on this device.
              </p>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
              >
                Continue as Guest
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {/* Close button */}
        <div className="text-center pt-4">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-cyan-400 hover:text-cyan-300"
          >
            Maybe later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
