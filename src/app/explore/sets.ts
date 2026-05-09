export type SetId = 1 | 2 | 3;
export const SET_IDS: SetId[] = [1, 2, 3];

export const PAGE_SETS: Record<SetId, string[]> = {
  1: [
    "https://100r.co/site/weathering_software_winter.html",
    "https://inkdroid.org/2026/03/16/seeing-the-web/",
    "https://monkemanx.github.io/paper-summary/design_philosophy_of_darpa_internet/",
  ],
  2: [
    "https://www.pewresearch.org/data-labs/2024/05/17/when-online-content-disappears/",
    "https://alexwlchan.net/2025/social-media-scrapbook/",
    "https://jeffhuang.com/designed_to_last/",
  ],
  3: [
    "https://designjustice.mitpress.mit.edu/pub/ap8rgw5e/release/1",
    "https://www.eff.org/deeplinks/2026/03/rep-finke-was-right-age-gating-isnt-about-kids-its-about-control",
    "https://blog.giovanh.com/blog/2022/07/28/the-genocidaires-people/?campaign=sb_re",
  ],
};

export function getSetForUrl(url: string): SetId {
  for (const setId of SET_IDS) {
    const sets = PAGE_SETS[setId];
    if (sets.some((set) => url.startsWith(set))) {
      return setId;
    }
  }
  return 1;
}

export const ALL_PAGES = [
  {
    setId: 1 as SetId,
    fileUrl: "/pages/set1-page1.html",
    displayUrl: "https://100r.co/site/weathering_software_winter.html",
  },
  {
    setId: 1 as SetId,
    fileUrl: "/pages/set1-page2.html",
    displayUrl: "https://inkdroid.org/2026/03/16/seeing-the-web/",
  },
  {
    setId: 1 as SetId,
    fileUrl: "/pages/set1-page3.html",
    displayUrl: "https://monkemanx.github.io/paper-summary/design_philosophy_of_darpa_internet/",
  },
  {
    setId: 2 as SetId,
    fileUrl: "/pages/set2-page1.html",
    displayUrl: "https://www.pewresearch.org/data-labs/2024/05/17/when-online-content-disappears/",
  },
  {
    setId: 2 as SetId,
    fileUrl: "/pages/set2-page2.html",
    displayUrl: "https://alexwlchan.net/2025/social-media-scrapbook/",
  },
  {
    setId: 2 as SetId,
    fileUrl: "/pages/set2-page3.html",
    displayUrl: "https://jeffhuang.com/designed_to_last/",
  },
  {
    setId: 3 as SetId,
    fileUrl: "/pages/set3-page1.html",
    displayUrl: "https://designjustice.mitpress.mit.edu/pub/ap8rgw5e/release/1",
  },
  {
    setId: 3 as SetId,
    fileUrl: "/pages/set3-page2.html",
    displayUrl: "https://www.eff.org/deeplinks/2026/03/rep-finke-was-right-age-gating-isnt-about-kids-its-about-control",
  },
  {
    setId: 3 as SetId,
    fileUrl: "/pages/set3-page3.html",
    displayUrl: "https://blog.giovanh.com/blog/2022/07/28/the-genocidaires-people/?campaign=sb_re",
  },
];

export const DEFAULT_URLS: Record<
  number,
  { fileUrl: string; displayUrl: string }
> = {
  1: {
    fileUrl: "/pages/set1-page1.html",
    displayUrl: "https://100r.co/site/weathering_software_winter.html",
  },
  2: {
    fileUrl: "/pages/set2-page1.html",
    displayUrl: "https://www.pewresearch.org/data-labs/2024/05/17/when-online-content-disappears/",
  },
  3: {
    fileUrl: "/pages/set3-page1.html",
    displayUrl: "https://designjustice.mitpress.mit.edu/pub/ap8rgw5e/release/1",
  },
};
