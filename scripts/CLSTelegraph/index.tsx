// @file: index.tsx

type NewsItem = {
  id: number;
  title: string;
  content: string;
  ctime: number;
  subjects: { subject_name: string }[];
};

type Resp = { data: { roll_data: NewsItem[] } };

const fmtTime = (ts: number) => {
  const d = new Date(ts * 1000);
  return `${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}`;
};

const clean = (t: string) => t.replace(/<[^>]+>/g, "").trim();

const fetchNews = async (): Promise<NewsItem[]> => {
  try {
    const res = await fetch("https://www.cls.cn/nodeapi/telegraphList?rn=30");
    const json = (await res.json()) as Resp;
    return json.data.roll_data || [];
  } catch (e) {
    return [];
  }
};

const Row = ({ item }: { item: NewsItem }) => (
  <Link url={`https://www.cls.cn/detail/${item.id}`}>
    <HStack alignment="top" spacing={10}>
      <VStack alignment="trailing" spacing={0} width={40}>
        <Text font="caption2" color={Color.gray} weight="bold">{fmtTime(item.ctime)}</Text>
        <Circle width={6} height={6} color={Color.red} padding={{ top: 4 }} />
      </VStack>
      <VStack alignment="leading" spacing={4}>
        {item.title.length > 0 && (
          <Text font="subheadline" weight="bold" lineLimit={2}>{item.title}</Text>
        )}
        <Text font="footnote" color={item.title ? Color.gray : Color.primary} lineLimit={4}>
          {clean(item.content)}
        </Text>
        {item.subjects?.length > 0 && (
          <HStack spacing={4}>
            {item.subjects.map((s, i) => (
              <Text key={i.toString()} font="caption2" color={Color.blue} background={Color.blue.opacity(0.1)} cornerRadius={2} padding={2}>
                {s.subject_name}
              </Text>
            ))}
          </HStack>
        )}
      </VStack>
    </HStack>
  </Link>
);

const App = () => {
  const [list, setList] = useState<NewsItem[]>([]);
  const [load, setLoad] = useState(true);

  const refresh = async () => {
    setLoad(true);
    setList(await fetchNews());
    setLoad(false);
  };

  useEffect(() => { refresh(); }, []);

  return (
    <List isLoading={load}>
      <HStack padding={10}>
        <Image systemName="newspaper.fill" color={Color.red} />
        <Text weight="bold">财联社电报</Text>
        <Spacer />
        <Button action={refresh}>
          <Image systemName="arrow.clockwise" color={Color.blue} />
        </Button>
      </HStack>
      {list.map(i => <Row key={i.id.toString()} item={i} />)}
    </List>
  );
};

Navigation.present(<App />);
