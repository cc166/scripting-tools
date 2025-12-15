// index.tsx (原 main.tsx)
import { WidgetView } from "./widget";
import { fetchNews, formatTime } from "./api";
import { CLSNewsItem } from "./types";

// App 内预览视图
const AppView = () => {
  const [list, setList] = useState<CLSNewsItem[]>([]);
  useEffect(() => {
    fetchNews(20).then(setList);
  }, []);

  return (
    <NavigationView>
      <List>
        {list.map(item => (
          <Section key={item.id}>
            <VStack spacing={4}>
              <Text font={{ weight: "bold", size: 12 }} color="red">{formatTime(item.ctime)}</Text>
              <Text font={{ size: 15 }}>{item.content}</Text>
            </VStack>
          </Section>
        ))}
      </List>
      <NavigationTitle>财联社电报</NavigationTitle>
    </NavigationView>
  );
};

// 路由入口
if (Script.widgetFamily) {
  Script.setWidget(<WidgetView />);
} else {
  Navigation.present({
    view: <AppView />,
    style: "sheet",
    onDismiss: () => Script.exit()
  });
}
