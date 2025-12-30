import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://nk3-backend.onrender.com';

export async function GET() {
  try {
    const res = await fetch(`${API_URL}/api/academic`);
    
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
    console.log('Academic POST request - Data:', body);
    
    const res = await fetch(`${API_URL}/api/academic`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    console.log('Backend response status:', res.status, res.statusText);
    
    if (!res.ok) {
      // Try to get the error message from the backend
      let errorMessage = `Backend error: ${res.status} ${res.statusText}`;
      try {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await res.json();
          console.error('Backend academic error response:', errorData);
          errorMessage = errorData.error || errorData.message || errorData.msg || JSON.stringify(errorData);
          if (!errorMessage || errorMessage === '{}' || errorMessage.trim() === '') {
            errorMessage = `Backend returned error status ${res.status}: ${res.statusText}`;
          }
        } else {
          const errorText = await res.text();
          console.error('Backend academic error text:', errorText);
          if (errorText.trim().startsWith('{')) {
            try {
              const errorData = JSON.parse(errorText);
              errorMessage = errorData.error || errorData.message || errorData.msg || errorText;
            } catch {
              errorMessage = errorText || errorMessage;
            }
          } else {
            errorMessage = errorText || errorMessage;
          }
        }
      } catch (parseError) {
        console.error('Error parsing backend academic error response:', parseError);
        errorMessage = `Failed to parse backend error: ${res.status} ${res.statusText}`;
      }
      return NextResponse.json({ error: errorMessage }, { status: res.status });
    }
    
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json({ error: 'Invalid response from backend' }, { status: 500 });
    }
    
    const data = await res.json();
    console.log('Academic created successfully:', data);
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('Error in academic POST route:', error);
    return NextResponse.json({ error: error.message || 'Failed to create academic publication' }, { status: 500 });
  }
}

