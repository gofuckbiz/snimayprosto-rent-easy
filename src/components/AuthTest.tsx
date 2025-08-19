import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { me } from '@/lib/api';
import { authService } from '@/lib/auth-service';

const AuthTest = () => {
  const { user, logout } = useAuth();
  const [testResult, setTestResult] = useState<string>('');

  const testAuth = async () => {
    try {
      const result = await me();
      setTestResult(`✅ Auth test successful: ${JSON.stringify(result)}`);
    } catch (error: any) {
      setTestResult(`❌ Auth test failed: ${error.message}`);
    }
  };

  const testRefresh = async () => {
    try {
      const token = await authService.refreshAccessToken();
      setTestResult(`✅ Token refresh successful: ${token.substring(0, 20)}...`);
    } catch (error: any) {
      setTestResult(`❌ Token refresh failed: ${error.message}`);
    }
  };

  const testLogout = async () => {
    try {
      await logout();
      setTestResult('✅ Logout successful');
    } catch (error: any) {
      setTestResult(`❌ Logout failed: ${error.message}`);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-background">
      <h3 className="text-lg font-semibold mb-4">Auth System Test</h3>
      
      <div className="space-y-2 mb-4">
        <div><strong>User:</strong> {user ? `${user.name} (${user.email})` : 'Not logged in'}</div>
        <div><strong>Access Token:</strong> {authService.getAccessToken() ? 'Present' : 'None'}</div>
      </div>

      <div className="space-x-2">
        <Button onClick={testAuth} variant="outline">Test Auth</Button>
        <Button onClick={testRefresh} variant="outline">Test Refresh</Button>
        <Button onClick={testLogout} variant="destructive">Test Logout</Button>
      </div>

      {testResult && (
        <div className="mt-4 p-2 bg-muted rounded text-sm">
          {testResult}
        </div>
      )}
    </div>
  );
};

export default AuthTest;
