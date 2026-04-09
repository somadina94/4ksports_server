type ProviderPage<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

const BASE_EVENTS_URL = "https://sports.bzzoiro.com/api/events/";

const formatYmd = (date: Date): string => date.toISOString().slice(0, 10);

export const buildProviderEventsUrl = (
  fromDate = new Date(Date.now() - 24 * 60 * 60 * 1000),
  toDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
): string => {
  const url = new URL(BASE_EVENTS_URL);
  url.searchParams.set("date_from", formatYmd(fromDate));
  url.searchParams.set("date_to", formatYmd(toDate));
  return url.toString();
};

export const fetchPaginatedProviderResults = async <T>(
  initialUrl: string,
): Promise<T[]> => {
  const apiToken = process.env.SPORTS_API_TOKEN;
  if (!apiToken) {
    throw new Error("Missing SPORTS_API_TOKEN in environment");
  }

  const initial = new URL(initialUrl);
  const requiredDateFrom = initial.searchParams.get("date_from");
  const requiredDateTo = initial.searchParams.get("date_to");

  const enforceUpcomingQuery = (urlString: string): string => {
    const url = new URL(urlString);
    if (requiredDateFrom) url.searchParams.set("date_from", requiredDateFrom);
    if (requiredDateTo) url.searchParams.set("date_to", requiredDateTo);
    return url.toString();
  };

  let nextUrl: string | null = enforceUpcomingQuery(initialUrl);
  const allResults: T[] = [];

  while (nextUrl) {
    const response = await fetch(nextUrl, {
      headers: {
        Authorization: `Token ${apiToken}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Provider API failed: ${response.status}`);
    }

    const page = (await response.json()) as ProviderPage<T>;
    allResults.push(...page.results);
    nextUrl = page.next ? enforceUpcomingQuery(page.next) : null;
  }

  return allResults;
};
