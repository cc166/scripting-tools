// Source/types.ts

export interface CLSNewsItem {
  id: number;
  title: string;     // 标题
  content: string;   // 详细内容
  ctime: number;     // 时间戳 (秒)
  brief: string;     // 简介
}

export interface CLSResponse {
  errno: number;
  data: {
    roll_data: CLSNewsItem[];
  };
}
