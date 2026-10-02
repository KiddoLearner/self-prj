import { NextRequest, NextResponse } from 'next/server';

// JSON 中的 dtstart 例子：
// ["20261001", { value: "DATE" }]
interface HolidayDateOption {
  value: string;
}

interface HolidayEvent {
  summary: string;
  dtstart: [string, HolidayDateOption];
  dtend: [string, HolidayDateOption];
}

interface HolidayCalendar {
  vevent: HolidayEvent[];
}

// JSON 中的 vcalendar 是 array：
// { vcalendar: [ { vevent: [...] } ] }
interface HolidayResponse {
  vcalendar: HolidayCalendar[];
}



// 檢查傳入日期是否為 YYYY-MM-DD，例如 2026-10-01
function isValidDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export async function GET(request: NextRequest) {
  try {
    // 例如：/api/holiday?todayStr=2026-10-01
    // 如果無傳 todayStr，就使用香港今日日期
    const queryDate = request.nextUrl.searchParams.get('todayStr');
    const todayStr = queryDate!;

    // 防止傳入 abc、2026/10/01 等不正確格式
    if (!isValidDate(todayStr)) {
      return NextResponse.json(
        {
          success: false,
          error: 'todayStr 必須是 YYYY-MM-DD 格式，例如 2026-10-01',
        },
        { status: 400 }
      );
    }

    // API 的日期格式是 YYYYMMDD，例如 20261001
    // 所以移除 todayStr 裏面的 -
    const targetDate = todayStr.replaceAll('-', '');

    const response = await fetch(
      'https://www.1823.gov.hk/common/ical/tc.json',
      {
        // Cache 的是「全部假期清單」，每 12 小時最多更新一次
        next: { revalidate: 43200 },
      }
    );

    if (!response.ok) {
      throw new Error(`1823 API 請求失敗：${response.status}`);
    }

    const data: HolidayResponse = await response.json();

    // data.vcalendar 是 array，取第一個 calendar。
    // ?. 和 ?? [] 可以防止 API 資料暫時不完整時程式 crash。
    const events = data.vcalendar[0]?.vevent ?? [];

    const todayHoliday = events.find((event) => {
      // event.dtstart 是 array：
      // ["20261001", { value: "DATE" }]
      // 第一項才是日期字串。
      const eventDate = event.dtstart[0];

      // 例如："20261001" === "20261001"
      return eventDate === targetDate;
    });

    return NextResponse.json({
      success: true,
      data: {
        isHoliday: Boolean(todayHoliday),
        holidayName: todayHoliday?.summary ?? null,
        today: todayStr,
      },
    });
  } catch (error) {
    console.error('獲取假期數據失敗:', error);

    return NextResponse.json(
      {
        success: false,
        error: '無法獲取假期數據',
      },
      { status: 500 }
    );
  }
}