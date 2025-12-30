import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://nk3-backend.onrender.com';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const publicationId = resolvedParams?.id;
    
    if (!publicationId) {
      return NextResponse.json({ error: 'Publication ID is required' }, { status: 400 });
    }

    const searchParams = request.nextUrl.searchParams;
    const download = searchParams.get('download') === 'true';
    const downloadParam = download ? '?download=true' : '';
    const backendUrl = `${API_URL}/api/academic/${publicationId}/pdf${downloadParam}`;
    
    console.log('Proxying PDF request to backend:', backendUrl);

    try {
      const pdfResponse = await fetch(backendUrl);

      if (!pdfResponse.ok) {
        const errorData = await pdfResponse.json().catch(() => ({ error: `HTTP ${pdfResponse.status}` }));
        console.error('Backend PDF fetch failed:', errorData);
        return NextResponse.json({ 
          error: errorData.error || 'Failed to fetch PDF from backend',
          details: errorData
        }, { status: pdfResponse.status });
      }

      const pdfBuffer = await pdfResponse.arrayBuffer();
      console.log('PDF fetched successfully from backend, size:', pdfBuffer.byteLength, 'bytes');

      if (!pdfBuffer || pdfBuffer.byteLength === 0) {
        return NextResponse.json({ error: 'PDF file is empty' }, { status: 500 });
      }

      const contentType = pdfResponse.headers.get('content-type') || 'application/pdf';
      const contentDisposition = pdfResponse.headers.get('content-disposition') || (download ? 'attachment' : 'inline');

      const headers = new Headers();
      headers.set('Content-Type', contentType);
      headers.set('Content-Length', pdfBuffer.byteLength.toString());
      headers.set('Content-Disposition', contentDisposition);
      
      if (!download) {
        headers.set('Cache-Control', 'public, max-age=3600');
      }

      return new NextResponse(pdfBuffer, {
        status: 200,
        headers,
      });
    } catch (fetchError: any) {
      console.error('Error fetching PDF from backend:', fetchError);
      return NextResponse.json({ 
        error: `Failed to fetch PDF from backend: ${fetchError.message}`,
        details: { url: backendUrl }
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error serving PDF:', error);
    return NextResponse.json({ error: error.message || 'Failed to serve PDF' }, { status: 500 });
  }
}

