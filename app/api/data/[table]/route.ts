import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/azure/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { table: string } }
) {
  try {
    const { table } = params
    const { searchParams } = new URL(request.url)
    
    const client = await createClient()
    const supabase = client.from(table)

    // Get query parameters
    const columns = searchParams.get('columns') || '*'
    const orderBy = searchParams.get('order')
    const direction = searchParams.get('direction') || 'DESC'
    const limit = searchParams.get('limit')
    
    // Find equality conditions
    const conditions: { column: string; value: string }[] = []
    for (const [key, value] of searchParams.entries()) {
      if (!['columns', 'order', 'direction', 'limit'].includes(key)) {
        conditions.push({ column: key, value })
      }
    }

    let query = supabase.select(columns)

    // Apply conditions
    if (conditions.length > 0) {
      // For simplicity, apply the first condition
      // In a real implementation, you'd handle multiple conditions
      const condition = conditions[0]
      query = query.eq(condition.column, condition.value)
    }

    // Apply ordering and limit
    if (orderBy) {
      query = query.order(orderBy, { ascending: direction === 'ASC' })
    }

    if (limit) {
      query = query.limit(parseInt(limit))
    }

    const result = await query

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }

    return NextResponse.json({ results: result.data })
  } catch (error) {
    console.error('Data fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { table: string } }
) {
  try {
    const { table } = params
    const data = await request.json()
    
    const client = await createClient()
    const supabase = client.from(table)

    const result = await supabase.insert(data)

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }

    return NextResponse.json({ data: result.data })
  } catch (error) {
    console.error('Data insert error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { table: string } }
) {
  try {
    const { table } = params
    const { searchParams } = new URL(request.url)
    const data = await request.json()
    
    const client = await createClient()
    const supabase = client.from(table)

    // Find equality condition for update
    const conditions: { column: string; value: string }[] = []
    for (const [key, value] of searchParams.entries()) {
      conditions.push({ column: key, value })
    }

    if (conditions.length === 0) {
      return NextResponse.json({ error: 'No condition provided for update' }, { status: 400 })
    }

    // Apply the first condition
    const condition = conditions[0]
    const result = await supabase.update(data).eq(condition.column, condition.value)

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }

    return NextResponse.json({ data: result.data })
  } catch (error) {
    console.error('Data update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { table: string } }
) {
  try {
    const { table } = params
    const { searchParams } = new URL(request.url)
    
    const client = await createClient()
    const supabase = client.from(table)

    // Find equality condition for delete
    const conditions: { column: string; value: string }[] = []
    for (const [key, value] of searchParams.entries()) {
      conditions.push({ column: key, value })
    }

    if (conditions.length === 0) {
      return NextResponse.json({ error: 'No condition provided for delete' }, { status: 400 })
    }

    // Apply the first condition
    const condition = conditions[0]
    const result = await supabase.delete().eq(condition.column, condition.value)

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }

    return NextResponse.json({ data: result.data })
  } catch (error) {
    console.error('Data delete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
