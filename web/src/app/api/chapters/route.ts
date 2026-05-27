import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/server';
import { FieldValue } from 'firebase-admin/firestore';

export async function GET() {
  try {
    const snap = await adminDb.collection('chapters').orderBy('createdAt', 'desc').get();
    const chapters = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ chapters });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, city, state, adminName } = body;

    if (!name?.trim() || !city?.trim() || !state?.trim()) {
      return NextResponse.json({ error: 'name, city, and state are required' }, { status: 400 });
    }

    const id = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const docRef = adminDb.collection('chapters').doc(id);
    const existing = await docRef.get();
    if (existing.exists) {
      return NextResponse.json({ error: 'A chapter with this name already exists' }, { status: 409 });
    }

    const chapter = {
      name: name.trim(),
      city: city.trim(),
      state: state.trim(),
      adminName: adminName?.trim() || null,
      creatorsCount: 0,
      status: 'active',
      createdAt: FieldValue.serverTimestamp(),
    };

    await docRef.set(chapter);
    return NextResponse.json({ id, ...chapter }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    const allowed: Record<string, unknown> = {};
    if ('status' in updates) allowed.status = updates.status;
    if ('adminName' in updates) allowed.adminName = updates.adminName;

    await adminDb.collection('chapters').doc(id).update(allowed);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
