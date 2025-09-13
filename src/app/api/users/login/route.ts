
import { NextResponse } from 'next/server';
import { loginUser } from '@/services/user-service';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const user = await loginUser(email, password);
    // Note: In a real app, you'd generate a JWT here and return it
    return NextResponse.json({ success: true, user });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
