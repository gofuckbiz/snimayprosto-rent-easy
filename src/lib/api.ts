import { authService } from './auth-service';

const API_URL = (import.meta as any)?.env?.VITE_API_URL || "https://localhost:8080";
export const BACKEND_URL = API_URL;

type Json = Record<string, unknown>;

export interface Property {
  id: number;
  ownerId: number;
  title: string;
  description: string;
  price: number;
  priceType: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  rooms: number;
  area: number;
  amenities: string;
  propertyType: string;
  phone: string;
  email: string;
  isUrgent: boolean;
  visibility: string;
  createdAt: string;
  images: Array<{
    id: number;
    propertyId: number;
    url: string;
    order: number;
  }>;
}

export interface Conversation {
  id: number;
  propertyId: number;
  propertyTitle: string;
  propertyPrice: number;
  initiatorId: number;
  ownerId: number;
  initiatorName: string;
  lastMessage?: {
    content: string;
    createdAt: string;
    senderId: number;
  };
  unreadCount: number;
}

async function request(path: string, options: RequestInit = {}) {
  // Add authorization header if we have a token
  const token = authService.getAccessToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_URL}${path}`, {
    credentials: 'include', // Always include cookies
    headers,
    ...options,
  });
  
  // Always attempt to parse JSON for successful responses
  let data;
  if (res.ok) {
    try {
      data = await res.json();
    } catch (e) {
      // If JSON parsing fails, set data to empty object
      data = {};
    }
  } else {
    // For error responses, try to parse JSON but fallback to undefined
    const isJson = res.headers.get('content-type')?.includes('application/json');
    data = isJson ? await res.json() : undefined;
  }
  
  if (!res.ok) {
    // Handle 401 errors with automatic token refresh
    if (res.status === 401 && path !== '/auth/refresh' && path !== '/auth/login' && path !== '/auth/register') {
      try {
        console.log('Token expired, attempting refresh...');
        // Try to refresh the token
        await authService.refreshAccessToken();
        
        // Retry the original request with new token
        const newToken = authService.getAccessToken();
        const retryHeaders = {
          'Content-Type': 'application/json',
          ...(newToken ? { Authorization: `Bearer ${newToken}` } : {}),
          ...(options.headers || {}),
        };
        
        const retryRes = await fetch(`${API_URL}${path}`, {
          credentials: 'include',
          headers: retryHeaders,
          ...options,
        });
        
        const retryData = retryRes.headers.get('content-type')?.includes('application/json') 
          ? await retryRes.json() 
          : undefined;
        
        if (!retryRes.ok) {
          const message = (retryData as any)?.error || retryRes.statusText || 'Request failed';
          const err = new Error(typeof message === 'string' ? message : 'Request failed') as Error & { status?: number; data?: any };
          err.status = retryRes.status;
          err.data = retryData;
          throw err;
        }
        
        console.log('Request retried successfully after token refresh');
        return retryData;
      } catch (refreshError) {
        // If refresh fails, redirect to login
        console.error('Token refresh failed:', refreshError);
        authService.clearAccessToken();
        window.location.href = '/';
        throw refreshError;
      }
    }
    
    const message = (data as any)?.error || res.statusText || 'Request failed';
    const err = new Error(typeof message === 'string' ? message : 'Request failed') as Error & { status?: number; data?: any };
    err.status = res.status;
    err.data = data;
    throw err;
  }
  
  return data;
}

export async function register(payload: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}): Promise<{ user: Json; accessToken: string }>
{
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
    credentials: 'include', // Include cookies
  });
}

export async function login(payload: {
  email: string;
  password: string;
}): Promise<{ user: Json; accessToken: string }>
{
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
    credentials: 'include', // Include cookies
  });
}

export async function refreshToken(): Promise<{ accessToken: string }> {
  return request('/auth/refresh', {
    method: 'POST',
    credentials: 'include', // Include cookies
  });
}

export async function logout(): Promise<{ message: string }> {
  return request('/auth/logout', {
    method: 'POST',
    credentials: 'include', // Include cookies
  });
}

export function getAccessToken(): string | null {
  return authService.getAccessToken();
}

export function authHeaders() {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function me(): Promise<Json> {
  return request('/auth/me', {
    headers: { ...authHeaders() },
  });
}

export async function createProperty(payload: {
  title: string;
  description?: string;
  address: string;
  propertyType: string;
  rooms: string;
  price: string;
  priceType: string;
  phone: string;
  email?: string;
  amenities: string[];
  isUrgent: boolean;
  visibility: string;
  latitude: number;
  longitude: number;
}) {
  return request('/properties', {
    method: 'POST',
    headers: { ...authHeaders() },
    body: JSON.stringify(payload),
  });
}

export async function listProperties(params?: { city?: string }) {
  const qs = params?.city ? `?city=${encodeURIComponent(params.city)}` : '';
  return request(`/properties${qs}`);
}

export async function uploadPropertyImages(propertyId: number, files: File[]) {
  const formData = new FormData();
  files.forEach((file, index) => {
    formData.append('images', file);
  });

  const res = await fetch(`${API_URL}/properties/${propertyId}/images`, {
    method: 'POST',
    headers: { ...authHeaders() },
    body: formData,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || 'Failed to upload images');
  }

  return res.json();
}

export async function getProperty(id: string): Promise<Property> {
  const res = await fetch(`${API_URL}/properties/${id}`);
  
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || `Failed to fetch property: ${res.status}`);
  }
  
  return res.json();
}

export async function startConversation(propertyId: number) {
  return request(`/chat/start/${propertyId}`, {
    method: 'POST',
    headers: { ...authHeaders() },
  });
}

export async function listMessages(conversationId: number) {
  return request(`/chat/${conversationId}/messages`, {
    headers: { ...authHeaders() },
  });
}

export async function updateUserRole(role: 'landlord' | 'tenant') {
  return request('/auth/role', {
    method: 'PUT',
    headers: { ...authHeaders() },
    body: JSON.stringify({ role }),
  });
}

export interface Stats {
  properties: number;
  users: number;
  satisfaction: number;
  support: string;
}

export async function getStats(): Promise<Stats> {
  return request('/stats');
}

export async function listConversations(): Promise<{ conversations: Conversation[] }> {
  return request('/chat/conversations', {
    headers: { ...authHeaders() },
  });
}


