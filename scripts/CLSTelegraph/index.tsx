// @file: index.tsx
/**
 * @name 财联社电报 (CLS Telegraph)
 * @description 实时获取财联社金融快讯
 * @author AI Assistant
 */

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type TelegraphItem = {
  id: number;
  title: string;
  content: string;
  ctime: number; 
  subjects: Array<{ subject_name: string }>;
};

type APIResponse = {
  data: {
    roll_data: TelegraphItem[];
  };
};

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

const cleanText = (text: string): string => {
  return text.replace(/<[^>]+>/g, "").trim();
};

const fetchTelegraphData = async (): Promise<TelegraphItem[]> => {
  const url = "https://www.cls.cn/nodeapi/telegraphList?rn=30";
  try {
    const response = await fetch(url);
    const json = (await response.json()) as APIResponse;
    return json.data.roll_data || [];
  } catch (error) {
    console.error(`Fetch error: ${error}`);
    return [];
  }
};

// -----------------------------------------------------------------------------
// Components
// -----------------------------------------------------------------------------

const NewsRow = ({ item }: { item: TelegraphItem }) => {
  const detailUrl = `https://www.cls.cn/detail/${item.id}`;
  const hasTitle = item.title && item.title.length > 0;

  return (
    <Link url={detailUrl}>
      <HStack alignment="top" spacing={12}>
        <VStack alignment="trailing" spacing={0}>
          <Text font="footnote" color={Color.gray} weight="medium">
            {formatTime(item.ctime)}
          </Text>
          <Circle width={6} height={6} color={Color.red} padding={{ top: 4 }} />
        </VStack>

        <VStack alignment="leading" spacing={4}>
          {hasTitle && (
            <Text font="subheadline" weight="bold" lineLimit={2}>
              {item.title}
            </Text>
          )}
          <Text 
            font="subheadline" 
            color={hasTitle ? Color.gray : Color.primary} 
            lineLimit={4}
          >
            {cleanText(item.content)}
          </Text>
          
          {item.subjects && item.subjects.length > 0 && (
            <HStack spacing={4}>
              {item.subjects.map((sub, index) => (
                <Text 
                  key={index.toString()} 
                  font="caption2" 
                  color={Color.blue}
                  padding={2}
                  background={Color.blue.opacity(0.1)}
                  cornerRadius={4}
                >
                  {sub.subject_name}
                </Text>
              ))}
            </HStack>
          )}
        </VStack>
      </HStack>
    </Link>
  );
};

const TelegraphApp = () => {
  const [items, setItems] = useState<TelegraphItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchTelegraphData();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <List isLoading={loading}>
      <HStack padding={12}>
        <Image systemName="newspaper.fill" color={Color.red} font="title2" />
        <Text font="title2" weight="bold">财联社电报</Text>
        <Spacer />
        <Button action={loadData}>
          <Image systemName="arrow.clockwise" color={Color.blue} />
        </Button>
      </HStack>

      {items.map((item) => (
        <NewsRow key={item.id.toString()} item={item} />
      ))}
      
      <HStack alignment="center">
        <Spacer />
        <Text font="caption" color={Color.gray}>Data source: CLS.cn</Text>
        <Spacer />
      </HStack>
    </List>
  );
};

// -----------------------------------------------------------------------------
// Entry
// -----------------------------------------------------------------------------

Navigation.present(<TelegraphApp />);
