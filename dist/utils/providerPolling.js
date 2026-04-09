const BASE_EVENTS_URL = "https://sports.bzzoiro.com/api/events/";
const formatYmd = (date) => date.toISOString().slice(0, 10);
export const buildProviderEventsUrl = (fromDate = new Date(), toDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)) => {
    const url = new URL(BASE_EVENTS_URL);
    url.searchParams.set("date_from", formatYmd(fromDate));
    url.searchParams.set("date_to", formatYmd(toDate));
    url.searchParams.set("status", "notstarted");
    return url.toString();
};
export const fetchPaginatedProviderResults = async (initialUrl) => {
    const apiToken = process.env.SPORTS_API_TOKEN;
    if (!apiToken) {
        throw new Error("Missing SPORTS_API_TOKEN in environment");
    }
    let nextUrl = initialUrl;
    const allResults = [];
    while (nextUrl) {
        const response = await fetch(nextUrl, {
            headers: {
                Authorization: `Token ${apiToken}`,
            },
        });
        if (!response.ok) {
            throw new Error(`Provider API failed: ${response.status}`);
        }
        const page = (await response.json());
        allResults.push(...page.results);
        nextUrl = page.next;
    }
    return allResults;
};
//# sourceMappingURL=providerPolling.js.map