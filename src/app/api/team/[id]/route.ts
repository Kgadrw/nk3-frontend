import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://nk3-backend.onrender.com';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const teamId = resolvedParams?.id;
    
    if (!teamId) {
      return NextResponse.json({ error: 'Team member ID is required' }, { status: 400 });
    }
    
    const res = await fetch(`${API_URL}/api/team/${teamId}`);
    
    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
      }
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

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    // Handle params as either a Promise or direct object (Next.js 13+ vs 15+)
    const resolvedParams = params instanceof Promise ? await params : params;
    const rawId = resolvedParams?.id;
    
    // Validate ID - ensure it's a valid MongoDB ObjectId format
    const teamId = String(rawId || '').trim();
    if (!teamId || teamId === 'undefined' || teamId === 'null' || teamId === '') {
      return NextResponse.json({ error: `Invalid team member ID: ID is empty or undefined. Received: "${rawId}"` }, { status: 400 });
    }
    // MongoDB ObjectId should be 24 hex characters
    if (!/^[0-9a-fA-F]{24}$/.test(teamId)) {
      // Invalid ObjectId format
      return NextResponse.json({ error: 'Invalid team member ID format' }, { status: 400 });
    }
    
    const body = await request.json();
    const res = await fetch(`${API_URL}/api/team/${teamId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    if (!res.ok) {
      // Try to get the error message from the backend
      let errorMessage = `Backend error: ${res.status} ${res.statusText}`;
      try {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await res.json();
          // Backend error response
          // Try different possible error message fields
          errorMessage = errorData.error || errorData.message || errorData.msg || JSON.stringify(errorData);
          // If errorMessage is still empty or just "{}", use a default message
          if (!errorMessage || errorMessage === '{}' || errorMessage.trim() === '') {
            errorMessage = `Backend returned error status ${res.status}: ${res.statusText}`;
          }
        } else {
          const errorText = await res.text();
          // Backend error text
          // Try to parse as JSON if it looks like JSON
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
        // Error parsing backend error response
        errorMessage = `Failed to parse backend error: ${res.status} ${res.statusText}`;
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    // Handle params as either a Promise or direct object (Next.js 13+ vs 15+)
    const resolvedParams = params instanceof Promise ? await params : params;
    const rawId = resolvedParams?.id;
    
    // Validate ID - be very lenient, let MongoDB handle validation
    const teamId = String(rawId || '').trim();
    
    // Only check for truly invalid cases - empty, undefined, null
    if (!teamId || teamId === 'undefined' || teamId === 'null' || teamId === '') {
      return NextResponse.json({ error: `Invalid team member ID: ID is empty or undefined. Received: "${rawId}"` }, { status: 400 });
    }
    
    // Very minimal validation - just ensure it's not obviously wrong
    // MongoDB will validate the ObjectId format, so we don't need to be strict here
    if (teamId.length < 1) {
      // Invalid ID format
      return NextResponse.json({ error: 'Invalid team member ID format: ID is too short' }, { status: 400 });
    }
    
    
    const res = await fetch(`${API_URL}/api/team/${teamId}`, {
      method: 'DELETE',
    });
    
    if (!res.ok) {
      // Try to get the error message from the backend
      let errorMessage = `Backend error: ${res.status} ${res.statusText}`;
      try {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await res.json();
          console.error('Backend delete error response:', errorData);
          // Try different possible error message fields
          errorMessage = errorData.error || errorData.message || errorData.msg || JSON.stringify(errorData);
          // If errorMessage is still empty or just "{}", use a default message
          if (!errorMessage || errorMessage === '{}' || errorMessage.trim() === '') {
            errorMessage = `Backend returned error status ${res.status}: ${res.statusText}`;
          }
        } else {
          const errorText = await res.text();
          // Backend delete error text
          // Try to parse as JSON if it looks like JSON
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
        // Error parsing backend delete error response
        errorMessage = `Failed to parse backend error: ${res.status} ${res.statusText}`;
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

