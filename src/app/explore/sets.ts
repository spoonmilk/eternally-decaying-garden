export type SetId = 1 | 2 | 3;
export const SET_IDS: SetId[] = [1, 2, 3];

export const PAGE_SETS: Record<SetId, string[]> = {
  1: ["https://cel.cs.brown.edu/csci-1377-s26/"],
  // 1: [
  //   "https://medium.com/@108/just-like-hamburger-exactly-like-hamburger-5ba6f95c2b32",
  //   "https://alexwlchan.net/2025/social-media-scrapbook/",
  //   "https://plorg.neocities.org/",
  // ],
  2: [
    "https://theforest.link/",
    "https://itch.io/jam/death-of-an-mmo-game-jam",
    "https://video.rhizome.org/w/qTLXF3qeiwWeUMLUhNH5Fy",
  ],
  3: [
    "https://news.dyne.org/the-future-was-federated/",
    "https://alexwlchan.net/2025/meeting-my-younger-self/",
    "https://www.pewresearch.org/wp-content/uploads/sites/20/2024/05/pl_2024.05.17_link-rot_report.pdf",
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
    fileUrl: "/pages/tft.html",
    displayUrl: "https://cel.cs.brown.edu/csci-1377-s26/",
  },
  // {
  //   setId: 1 as SetId,
  //   fileUrl: "/pages/set1-page1.html",
  //   displayUrl:
  //     "https://medium.com/@108/just-like-hamburger-exactly-like-hamburger-5ba6f95c2b32",
  // },
  // {
  //   setId: 1 as SetId,
  //   fileUrl: "/pages/set1-page2.html",
  //   displayUrl: "https://alexwlchan.net/2025/social-media-scrapbook/",
  // },
  // {
  //   setId: 1 as SetId,
  //   fileUrl: "/pages/set1-page3.html",
  //   displayUrl: "https://plorg.neocities.org/",
  // },
  {
    setId: 2 as SetId,
    fileUrl: "/pages/set2-page1.html",
    displayUrl: "https://theforest.link/",
  },
  {
    setId: 2 as SetId,
    fileUrl: "/pages/set2-page2.html",
    displayUrl: "https://itch.io/jam/death-of-an-mmo-game-jam",
  },
  {
    setId: 3 as SetId,
    fileUrl: "/pages/set2-page3.html",
    displayUrl: "https://video.rhizome.org/w/qTLXF3qeiwWeUMLUhNH5Fy",
  },
  {
    setId: 3 as SetId,
    fileUrl: "/pages/set3-page1.html",
    displayUrl: "https://news.dyne.org/the-future-was-federated/",
  },
  {
    setId: 3 as SetId,
    fileUrl: "/pages/set3-page2.html",
    displayUrl: "https://alexwlchan.net/2025/meeting-my-younger-self/",
  },
  {
    setId: 3 as SetId,
    fileUrl: "/pages/set3-page3.html",
    displayUrl:
      "https://www.pewresearch.org/wp-content/uploads/sites/20/2024/05/pl_2024.05.17_link-rot_report.pdf",
  },
];

export const DEFAULT_URLS: Record<
  number,
  { fileUrl: string; displayUrl: string }
> = {
  1: {
    fileUrl: "/pages/tft.html",
    displayUrl: "https://cel.cs.brown.edu/csci-1377-s26/",
  },
  // 1: {
  //   fileUrl: "/pages/set1-page1.html",
  //   displayUrl:
  //     "https://medium.com/@108/just-like-hamburger-exactly-like-hamburger-5ba6f95c2b32",
  // },
  2: {
    fileUrl: "/pages/set2-page1.html",
    displayUrl: "https://theforest.link/",
  },
  3: {
    fileUrl: "/pages/set3-page1.html",
    displayUrl: "https://news.dyne.org/the-future-was-federated/",
  },
};
