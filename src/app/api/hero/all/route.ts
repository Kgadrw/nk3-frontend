import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://nk3-backend.onrender.com';

export async function GET() {
  try {
    const res = await fetch(`${API_URL}/api/hero/all`);
    
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

