'use client'

import { useEffect, useState,useMemo } from "react";

interface HolidayData {
  isHoliday: boolean;
  holidayName: string | null;
  today: string;
}

function formatDate(date : Date) {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
}

function formatHongKongDate(date: Date) {
  return date.toLocaleDateString('zh-HK', {
    timeZone: 'Asia/Hong_Kong',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
}

function formatHongKongTime(date: Date) {
  return date.toLocaleTimeString('zh-HK', {
    timeZone: 'Asia/Hong_Kong',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

export default function DateTimeYear(){
  const [holidayData, setHolidayData] = useState<HolidayData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lunar, setLunar] = useState({ lunarYear: "", lunarDate: "" });
  // const [now, setNow] = useState(new Date());
   const [now, setNow] = useState<Date | null>(null);
  // const todayKey = useMemo(() => formatDate(now), [now]);
  const todayKey = useMemo(() => {return now ? formatDate(now) : '';}, [now]);

  useEffect(() => {
    const updateTime = () => {
      setNow(new Date());
    };
    updateTime();
    const interval = window.setInterval(updateTime, 1000);
    return () => {
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!todayKey) {
      return;
    }

    let cancelled = false;

    async function fetchLunar() {
      try {
        const response = await fetch(
          `/api/lunar?todayStr=${todayKey}`,
        );

        if (!response.ok) {
          throw new Error('Failed to fetch lunar data');
        }

        const data = await response.json();

        if (!cancelled) {
          setLunar({
            lunarYear: data.LunarYear ?? '',
            lunarDate: data.LunarDate ?? '',
          });
        }
      } catch (error) {
        console.error('獲取農曆數據失敗:', error);
      }
    }

    fetchLunar();

    return () => {
      cancelled = true;
    };
  }, [todayKey]);

  useEffect(() => {
    if (!todayKey) {
      return;
    }

    let cancelled = false;

    async function fetchHoliday() {
      setLoading(true);

      try {
        const response = await fetch(
          `/api/holiday?todayStr=${todayKey}`,
        );

        if (!response.ok) {
          throw new Error('Failed to fetch holiday data');
        }

        const data = await response.json();

        if (!cancelled && data.success) {
          setHolidayData(data.data);
        }
      } catch (error) {
        console.error('獲取假期數據失敗:', error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchHoliday();

    return () => {
      cancelled = true;
    };
  }, [todayKey]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setNow(new Date());
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);

  //   useEffect(() => {
  //     const fetchLunar = async () => {
  //     try {
  //       fetch(
  //         `/api/lunar?todayStr=${todayKey}`
  //         ).then((res) => res.json().then((data) => {
  //           setLunar({
  //           lunarYear: data.LunarYear || "",
  //           lunarDate: data.LunarDate || "",
  //           });
  //         }));
  //     } catch (e) {
          
  //     }
  //     };

  //     fetchLunar();
  // }, [todayKey]);

  // useEffect(() => {
  //   fetch(`/api/holiday?todayStr=${todayKey}`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (data.success) {
  //         setHolidayData(data.data);
  //       }
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.error('獲取假期數據失敗:', err);
  //       setLoading(false);
  //     });
  // }, [todayKey]);

  // if (loading || !holidayData) {
  //   return null;
  // }

  // const { isHoliday, holidayName, today } = holidayData;
  
  return(
    <>
      <div className="hk-weather-card">
         <div className="hk-weather-header">
           <div>
             <div className="hk-time-main">
              <p>日期: {now ? formatHongKongDate(now) : 'Loading...'}</p>
              <p>時間: {now ? formatHongKongTime(now) : 'Loading...'}</p>
            </div>
            <div className="hk-time-bottom">
              {

                
                (loading || !holidayData) ? (
                  <div className="text-gray-500 text-lg max-h-px">載入中...</div>
                ) :(
                  <>
                    <p className="updated-time">農曆：{lunar.lunarYear}年{lunar.lunarDate}</p>
                    <p className="updated-time">節日：{holidayData?.holidayName ?? '社畜日'}</p>
                  </>
                  
                )
              }
            </div>
          </div>
        </div>
        
    </div>
    </>
  );
}
// function DateTimeYear(){
//     const [now, setNow] = useState(new Date());
//     const [lunar, setLunar] = useState({ lunarYear: "", lunarDate: "" });
//     const [holidays, setHolidays] = useState<Holiday[]>([]);

//     type Holiday = {
//         date: string;
//         name_tc: string;
//     };

//     const todayKey = useMemo(() => formatDate(now), [now]);

//     useEffect(() => {
//         const interval = setInterval(() => {
//           setNow(new Date());
//         }, 1000);
//         return () => clearInterval(interval);
//       }, []);

//     useEffect(() => {
//         const fetchLunar = async () => {
//         try {
//             const res = await fetch(
//             `https://data.weather.gov.hk/weatherAPI/opendata/lunardate.php?date=${todayKey}`
//             );
//             const data = await res.json();
//             setLunar({
//             lunarYear: data.LunarYear || "",
//             lunarDate: data.LunarDate || "",
//             });
//         } catch (e) {
//             console.error("農曆資料讀取失敗", e);
//         }
//         };

//         fetchLunar();
//     }, [todayKey]);

//   useEffect(() => {
//     const fetchHolidays = async () => {
//       try {
//         const year = now.getFullYear();
//         const res = await fetch(`
//         https://www.1823.gov.hk/common/ical/tc.json`);
//         const data = await res.json();
//         setHolidays(data);
//       } catch (e) {
//         console.error("節日資料讀取失敗", e);
//       }
//     };

//     fetchHolidays();
//   }, [now]);

//   const todayHoliday =
//     holidays.find((item) => item.date === todayKey)?.name_tc || "社畜日";


//     return (
//         <div className="hk-weather-card">
//         <div className="hk-weather-header">
//           <div>
//             <div className="hk-time-main">
//             <p>日期: {now.toLocaleDateString("zh-HK", {
//                 year: "numeric",
//                 month: "long",
//                 day: "numeric",
//                 weekday: "long",
//                 })}</p>
//             <p>時間: {now.toLocaleTimeString("zh-hk",{hour: "2-digit", minute: "2-digit",second: "2-digit",hour12: false})}</p>
//             </div>
//             <div className="hk-time-bottom">
//             <p className="updated-time">農曆：{lunar.lunarYear}年{lunar.lunarDate}</p>
//             <p className="updated-time">節日：{todayHoliday}</p>
//             </div>
//           </div>
//         </div>
        
//     </div>
//     );
// }

// export default DateTimeYear