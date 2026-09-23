import { redirect } from 'next/navigation';
import { getLinkByShortCode } from '@/app/backend/server';

export async function GET(request, { params }) {
  const shortCode = params?.shortCode;

  if (!shortCode) {
    redirect('/');
  }

  const targetUrl = await getLinkByShortCode(shortCode);

  if (targetUrl) {
    const formattedUrl = targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`;
    redirect(formattedUrl);
  } else {
    redirect('/');
  }
}
