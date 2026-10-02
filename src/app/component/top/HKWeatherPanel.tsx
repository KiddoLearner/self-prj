"use client";
import { useEffect, useMemo, useState } from "react";

export interface PlaceDataItem {
  place: string;
  value: number;
  unit?: string;
}

export interface PlaceDataGroup {
  data: PlaceDataItem[];
}

// rhrread（現時天氣資料）
export interface CurrentWeatherResponse {
  updateTime: string;
  temperature?: PlaceDataGroup;
  humidity?: PlaceDataGroup;
  rh?: PlaceDataGroup;        // 有時用 rh 代表濕度
  icon?: string[];            // 天氣圖示代號
  warningMessage?: string[];  // 天氣警告訊息
}

// warnsum（天氣警告摘要）
// 實際結構係一個 object，每個 key 係一種警告，例如:
// { "W": { "name": "暴雨警告", "startTime": "..." }, ... }
export interface WarningItem {
  name?: string;
  startTime?: string;
  endTime?: string;
}

export type WarningsResponse = Record<string, WarningItem>;

// swt（特別天氣提示）
// 有陣時係 array，有陣時係 { swt: [...] } 或 { details: [...] }
export interface TipItem {
  name?: string;
  content?: string;
  startTime?: string;
  endTime?: string;
}

export type SpecialTipsResponse = TipItem[] | { swt?: TipItem[]; details?: TipItem[] };



//天文台既API
const API_BASE = "https://data.weather.gov.hk/weatherAPI/opendata/weather.php";

function HKWeatherPanel() {
  const [weather, setWeather] = useState<CurrentWeatherResponse | null>(null); //目前天氣資料
  const [warnings, setWarnings] = useState<WarningsResponse | null>(null); //現正生效天氣警告
  const [tips, setTips] = useState<SpecialTipsResponse | null>(null); //特別天氣提示
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //Interfaces for API responses
  

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [weatherRes, warningsRes, tipsRes] = await Promise.all([ //同一時間call 3 apis
          fetch(`${API_BASE}?dataType=rhrread&lang=tc`),
          fetch(`${API_BASE}?dataType=warnsum&lang=tc`),
          fetch(`${API_BASE}?dataType=swt&lang=tc`),
        ]);

        if (!weatherRes.ok || !warningsRes.ok || !tipsRes.ok) {
          throw new Error("API request failed");
        }

        const [weatherData, warningsData, tipsData] = await Promise.all([ //將response轉成json
          weatherRes.json(),
          warningsRes.json(),
          tipsRes.json(),
        ]);

        setWeather(weatherData);
        setWarnings(warningsData);
        setTips(tipsData);
      } catch (err) {
        setError("讀取香港天文台資料失敗");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const currentTemp = useMemo(() => {
    return weather?.temperature?.data?.find(
      (item) => item.place === "香港天文台"
    );
  }, [weather]);

  const currentHumidity = weather?.humidity?.data?.[0];
  const updateTime = weather?.updateTime;
  //const iconCode = weather?.icon?.[0];
  const iconCodes = weather?.icon || [];
  const weatherMessages = weather?.warningMessage || [];

  const warningList = useMemo(() => {
    if (!warnings || typeof warnings !== "object") return [];
    return Object.values(warnings);
  }, [warnings]);

  const tipList = useMemo(() => {
    if (!tips) return [];
    if (Array.isArray(tips)) return tips;
    if (Array.isArray(tips.swt)) return tips.swt;
    if (Array.isArray(tips.details)) return tips.details;
    return [];
  }, [tips]);

 /* const iconUrl = iconCode
    ? `https://www.hko.gov.hk/images/HKOWxIconOutline/pic${iconCode}.png`
    : "";*/

    const iconUrls = iconCodes.map(
        (code) => `https://www.hko.gov.hk/images/HKOWxIconOutline/pic${code}.png`
    );

  if (loading) {
    return <div className="hk-weather-card">載入中...</div>;
  }

  if (error) {
    return <div className="hk-weather-card error">{error}</div>;
  }

  return (
    <div className="hk-weather-card">
        <div className="hk-weather-header">
            <div className="weather-icons">
                {iconUrls.map((url, index) => (
                    <img
                    key={index}
                    src={url}
                    alt={`香港天氣圖示 ${iconCodes[index]}`}
                    className="weather-icon"
                    />
                ))}
            </div>
          <div>
            <div className="hk-weather-main">
            <p>氣溫:{currentTemp ? `${currentTemp.value}°${currentTemp.unit}` : "—"}</p>
            <p>濕度:{currentHumidity ? `${currentHumidity.value}%` : "—"}</p>
            </div>
            <p className="updated-time">更新時間：{updateTime ? new Date(updateTime).toLocaleTimeString("zh-HK") : "—"}</p>
          </div>
        </div>
        
    </div>
  );
}

export default HKWeatherPanel;