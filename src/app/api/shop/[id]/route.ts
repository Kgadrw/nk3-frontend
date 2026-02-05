import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://nk3-backend.onrender.com';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const productId = resolvedParams?.id;
    
    console.log('Shop GET - Fetching product ID:', productId);
    console.log('Shop GET - Backend URL:', `${API_URL}/api/shop/${productId}`);
    
    if (!productId) {
      console.error('Shop GET - Product ID is missing');
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }
    
    const res = await fetch(`${API_URL}/api/shop/${productId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Shop GET - Response status:', res.status, res.statusText);
    console.log('Shop GET - Response URL:', res.url);
    
    if (!res.ok) {
      const contentType = res.headers.get('content-type');
      let errorMessage = `Product not found (${res.status})`;
      
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = await res.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
          console.error('Shop GET error (JSON):', errorData);
        } catch (e) {
          console.error('Error parsing JSON error response:', e);
        }
      } else {
        try {
          const errorText = await res.text();
          console.error('Shop GET error (text):', errorText);
          if (errorText) errorMessage = errorText;
        } catch (e) {
          console.error('Error parsing text error response:', e);
        }
      }
      
      return NextResponse.json({ error: errorMessage }, { status: res.status >= 400 && res.status < 500 ? res.status : 404 });
    }
    
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Shop GET - Invalid content type:', contentType);
      return NextResponse.json({ error: 'Invalid response from backend' }, { status: 500 });
    }
    
    const data = await res.json();
    console.log('Shop GET - Success, product data received');
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Shop GET - Error:', error);
    console.error('Shop GET - Error stack:', error.stack);
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch product',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const productId = resolvedParams?.id;
    
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }
    
    const body = await request.json();
    const res = await fetch(`${API_URL}/api/shop/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json({ error: `Backend error: ${res.status}` }, { status: res.status });
    }
    
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json({ error: 'Invalid response from backend' }, { status: 500 });
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const productId = resolvedParams?.id;
    
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }
    
    console.log('Shop DELETE - Deleting product ID:', productId);
    console.log('Shop DELETE - Sending to backend:', `${API_URL}/api/shop/${productId}`);
    
    const res = await fetch(`${API_URL}/api/shop/${productId}`, {
      method: 'DELETE',
    });
    
    console.log('Shop DELETE - Backend response status:', res.status, res.statusText);
    
    if (!res.ok) {
      const contentType = res.headers.get('content-type');
      let errorMessage = `Backend error: ${res.status}`;
      
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = await res.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
          console.error('Shop DELETE error (JSON):', errorData);
        } catch (e) {
          console.error('Error parsing JSON error response:', e);
        }
      } else {
        try {
          const errorText = await res.text();
          console.error('Shop DELETE error (text):', errorText);
          if (errorText) errorMessage = errorText;
        } catch (e) {
          console.error('Error parsing text error response:', e);
        }
      }
      
      return NextResponse.json({ error: errorMessage }, { status: res.status });
    }
    
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.log('Shop DELETE - Success (non-JSON response)');
      return NextResponse.json({ success: true });
    }
    
    const data = await res.json();
    console.log('Shop DELETE - Success response:', data);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Shop DELETE - Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete product' }, { status: 500 });
  }
}

