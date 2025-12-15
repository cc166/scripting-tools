// Source/widget.tsx
import { fetchNews, formatTime } from "./api";
import { CLSNewsItem } from "./types";

export const WidgetView = () => {
  // 状态管理
  const [news, setNews] = useState<CLSNewsItem[]>([]);
  
  // 组件加载时获取数据
  useEffect(() => {
    fetchNews(5).then(data => setNews(data));
  }, []);

  return (
    <VStack spacing={0} alignment="leading">
      {/* 标题栏 */}
      <HStack spacing={6}>
        <Image 
          systemName="newspaper.fill" 
          font={{ size: 14 }} 
          color="#FF3B30" 
        />
        <Text font={{ size: 14, weight: "bold" }} color="#FF3B30">
          财联社电报
        </Text>
        <Spacer />
        <Text font={{ size: 10 }} color="secondary" opacity={0.6}>
          {new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
        </Text>
      </HStack>

      <Spacer frame={{ height: 8 }} />

      {/* 列表内容 */}
      {news.length === 0 ? (
        <Text color="secondary">Loading...</Text>
      ) : (
        <VStack spacing={6} alignment="leading">
          {news.map((item) => (
            <HStack key={item.id} spacing={8} alignment="firstTextBaseline">
              {/* 时间列 */}
              <Text 
                font={{ size: 11, weight: "medium" }} 
                color="secondary"
                frame={{ width: 35, alignment: "leading" }}
              >
                {formatTime(item.ctime)}
              </Text>
              {/* 标题列 */}
              <Text 
                font={{ size: 12 }} 
                lineLimit={1}
              >
                {item.title || item.content}
              </Text>
            </HStack>
          ))}
        </VStack>
      )}
    </VStack>
  );
};
