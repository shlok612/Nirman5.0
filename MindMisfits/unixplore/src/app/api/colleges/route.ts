import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const id = searchParams.get('id');
    const city = searchParams.get('city');
    const state = searchParams.get('state');

    let sql = `
      SELECT 
        c.id,
        c.college_id,
        c.name,
        c.location,
        c.city,
        c.state,
        c.official_website,
        COUNT(cl.id) as club_count,
        COALESCE(
          json_agg(
            json_build_object(
              'id', cl.id,
              'name', cl.name,
              'category', cat.name
            )
          ) FILTER (WHERE cl.id IS NOT NULL),
          '[]'
        ) as clubs
      FROM colleges c
      LEFT JOIN clubs cl ON c.id = cl.college_id AND cl.status = 'approved'
      LEFT JOIN categories cat ON cl.category_id = cat.id
      WHERE c.status = 'active'
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (id) {
      sql += ` AND c.college_id = $${paramIndex}`;
      params.push(id.toUpperCase());
      paramIndex++;
    } else if (search) {
      sql += ` AND (c.name ILIKE $${paramIndex} OR c.college_id ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (city) {
      sql += ` AND c.city ILIKE $${paramIndex}`;
      params.push(`%${city}%`);
      paramIndex++;
    }

    if (state) {
      sql += ` AND c.state ILIKE $${paramIndex}`;
      params.push(`%${state}%`);
      paramIndex++;
    }

    sql += ` GROUP BY c.id ORDER BY c.name ASC`;

    console.log('Executing SQL:', sql);
    console.log('Params:', params);

    const result = await query(sql, params);

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching colleges:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch colleges' },
      { status: 500 }
    );
  }
}
