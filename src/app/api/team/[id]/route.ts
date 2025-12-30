import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://nk3-backend.onrender.com';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    // Handle params as either a Promise or direct object (Next.js 13+ vs 15+)
    const resolvedParams = params instanceof Promise ? await params : params;
    const rawId = resolvedParams?.id;
    
    // Validate ID - ensure it's a valid MongoDB ObjectId format
    const teamId = String(rawId || '').trim();
    console.log('PUT request received - Raw params:', resolvedParams, 'Raw ID:', rawId, 'Stringified:', teamId);
    
    if (!teamId || teamId === 'undefined' || teamId === 'null' || teamId === '') {
      console.error('Invalid team ID in PUT request:', rawId);
      return NextResponse.json({ error: `Invalid team member ID: ID is empty or undefined. Received: "${rawId}"` }, { status: 400 });
    }
    // MongoDB ObjectId should be 24 hex characters
    if (!/^[0-9a-fA-F]{24}$/.test(teamId)) {
      console.error('Invalid ObjectId format in PUT request:', teamId);
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
          console.error('Backend error response:', errorData);
          // Try different possible error message fields
          errorMessage = errorData.error || errorData.message || errorData.msg || JSON.stringify(errorData);
          // If errorMessage is still empty or just "{}", use a default message
          if (!errorMessage || errorMessage === '{}' || errorMessage.trim() === '') {
            errorMessage = `Backend returned error status ${res.status}: ${res.statusText}`;
          }
        } else {
          const errorText = await res.text();
          console.error('Backend error text:', errorText);
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
        console.error('Error parsing backend error response:', parseError);
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
    console.log('DELETE request received - Raw params:', resolvedParams, 'Raw ID:', rawId, 'Type:', typeof rawId, 'Stringified:', teamId, 'Length:', teamId.length);
    
    // Only check for truly invalid cases - empty, undefined, null
    if (!teamId || teamId === 'undefined' || teamId === 'null' || teamId === '') {
      console.error('Invalid team ID in DELETE request - empty. Raw params:', resolvedParams, 'Raw ID:', rawId);
      return NextResponse.json({ error: `Invalid team member ID: ID is empty or undefined. Received: "${rawId}"` }, { status: 400 });
    }
    
    // Very minimal validation - just ensure it's not obviously wrong
    // MongoDB will validate the ObjectId format, so we don't need to be strict here
    if (teamId.length < 1) {
      console.error('Invalid ID format in DELETE request - too short:', teamId);
      return NextResponse.json({ error: 'Invalid team member ID format: ID is too short' }, { status: 400 });
    }
    
    console.log('Proceeding with DELETE request for ID:', teamId, 'Length:', teamId.length);
    
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
          console.error('Backend delete error text:', errorText);
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
        console.error('Error parsing backend delete error response:', parseError);
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

