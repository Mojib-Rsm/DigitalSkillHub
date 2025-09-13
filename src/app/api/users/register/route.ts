
import { NextResponse } from 'next/server';
import { registerUser } from '@/services/user-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = await registerUser(body);
    return NextResponse.json({ success: true, id });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
