import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://nk3-backend.onrender.com';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const publicationId = resolvedParams?.id;

    if (!publicationId) {
      return NextResponse.json({ error: 'Publication ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const res = await fetch(`${API_URL}/api/academic/${publicationId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
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
      
      return NextResponse.json({ error: errorMessage }, { status: res.status });
    }
    
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json({ error: 'Invalid response from backend' }, { status: 500 });
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in PUT /api/academic/[id]:', error);
    return NextResponse.json({ error: error.message || 'Failed to update publication' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const publicationId = resolvedParams?.id;

    if (!publicationId) {
      return NextResponse.json({ error: 'Publication ID is required' }, { status: 400 });
    }

    const res = await fetch(`${API_URL}/api/academic/${publicationId}`, {
      method: 'DELETE',
    });
    
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
      
      return NextResponse.json({ error: errorMessage }, { status: res.status });
    }
    
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json({ success: true });
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in DELETE /api/academic/[id]:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete publication' }, { status: 500 });
  }
}

