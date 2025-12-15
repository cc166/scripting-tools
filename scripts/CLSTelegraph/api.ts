// Source/api.ts
import { CLSNewsItem, CLSResponse } from "./types";

const API_URL = "https://www.cls.cn/nodeapi/telegraphList?rn=20";

/**
 * 获取最新的电报列表
 * @param limit 限制返回条数，默认 6 条用于小组件展示
 */
export const fetchNews = async (limit: number = 6): Promise<CLSNewsItem[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Network response was not ok");
    
    const json: CLSResponse = await response.json();
    
    if (json.data && json.data.roll_data) {
      return json.data.roll_data.slice(0, limit);
    }
    return [];
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
};

/**
 * 格式化时间戳为 HH:mm
 */
export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
};
