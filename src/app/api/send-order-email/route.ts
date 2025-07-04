import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { name, phone, address, payment, items, total } = data;

  // Log incoming data
 console.log('Order API called with:', data);

 const ELASTIC_EMAIL_API_KEY = process.env.ELASTIC_EMAIL_API_KEY;
 const ELASTIC_EMAIL_FROM = process.env.ELASTIC_EMAIL_FROM;
 const TO_EMAIL = 'ebikeinfo786@gmail.com';

 // Log env vars (mask key for safety)
 console.log('Elastic Email From:', ELASTIC_EMAIL_FROM);
 console.log('Elastic Email API Key starts with:', ELASTIC_EMAIL_API_KEY?.slice(0, 8));

  if (!ELASTIC_EMAIL_API_KEY || !ELASTIC_EMAIL_FROM) {
    return NextResponse.json({ ok: false, error: 'Elastic Email API key or from email not set in env.' }, { status: 500 });
  }

  const emailBody = `New Order!\n\nName: ${name}\nPhone: ${phone}\nAddress: ${address}\nPayment: ${payment}\nItems:\n${items.map((item: any, i: number) => `${i+1}. ${item.title} - ${item.price}`).join('\n')}\nTotal: ${total} PKR`;

  const params = new URLSearchParams({
    apikey: ELASTIC_EMAIL_API_KEY,
    from: ELASTIC_EMAIL_FROM,
    to: TO_EMAIL,
    subject: `New Order from ${name}`,
    bodyText: emailBody,
  });

  const res = await fetch('https://api.elasticemail.com/v2/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  const result = await res.json();
  if (result.success) {
    return NextResponse.json({ ok: true });
  } else {
    return NextResponse.json({ ok: false, error: result.error || 'Elastic Email send failed.' }, { status: 500 });
  }
}
