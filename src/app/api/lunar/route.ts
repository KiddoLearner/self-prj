import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const queryDate = request.nextUrl.searchParams.get('todayStr');
    const todayStr = queryDate!;
  try {
    const res = await fetch(
          `https://data.weather.gov.hk/weatherAPI/opendata/lunardate.php?date=${todayStr}`
          );
          const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    console.error("農曆資料讀取失敗", e);
  }
}