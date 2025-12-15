// Source/main.tsx
import { WidgetView } from "./widget";
import { fetchNews, formatTime } from "./api";
import { CLSNewsItem } from "./types";

// 定义一个简单的 App 内预览页面
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
            <VStack spacing={4} alignment="leading">
              <HStack>
                <Text font={{ weight: "bold", size: 14 }} color="red">
                  {formatTime(item.ctime)}
                </Text>
                <Spacer />
              </HStack>
              <Text font={{ size: 16 }}>{item.title}</Text>
              <Text font={{ size: 14 }} color="secondary" lineLimit={3}>
                {item.content}
              </Text>
            </VStack>
          </Section>
        ))}
      </List>
      <NavigationTitle>财联社电报</NavigationTitle>
      <Toolbar>
        <ToolbarItem placement="cancellationAction">
          <Button action={() => Script.exit()}>Close</Button>
        </ToolbarItem>
      </Toolbar>
    </NavigationView>
  );
};

// 路由分发
if (Script.widgetFamily) {
  Script.setWidget(<WidgetView />);
} else {
  Navigation.present({
    view: <AppView />,
    style: "sheet",
    onDismiss: () => Script.exit()
  });
}
