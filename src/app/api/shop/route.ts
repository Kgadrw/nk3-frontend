import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://nk3-backend.onrender.com';

export async function GET() {
  try {
    const res = await fetch(`${API_URL}/api/shop`);
    
    if (!res.ok) {
      return NextResponse.json([]);
    }
    
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json([]);
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Shop POST - Received data:', body);
    console.log('Shop POST - Sending to backend:', `${API_URL}/api/shop`);
    
    const res = await fetch(`${API_URL}/api/shop`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    console.log('Shop POST - Backend response status:', res.status, res.statusText);
    
    if (!res.ok) {
      const contentType = res.headers.get('content-type');
      let errorMessage = `Backend error: ${res.status}`;
      
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = await res.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
          // If JSON parsing fails, use default message
        }
      } else {
        try {
          const errorText = await res.text();
          if (errorText) errorMessage = errorText;
        } catch (e) {
          // If text parsing fails, use default message
        }
      }
      
      console.error('Shop POST error:', errorMessage);
      return NextResponse.json({ error: errorMessage }, { status: res.status });
    }
    
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json({ error: 'Invalid response from backend' }, { status: 500 });
    }
    
    const data = await res.json();
    console.log('Shop POST - Success response:', data);
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('Shop POST - Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}

