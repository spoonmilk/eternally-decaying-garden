export interface Site {
  name: string;
  dir: string; // must end with /
  entryPage: string; // relative to dir
  allPages: string[];
}

export const SITES = {
  "csci-1377": {
    name: "CSCI 1377",
    dir: "/sites/csci-1377/",
    entryPage: "index.html",
    allPages: [
      "index.html",
      // TODO: add the other pages here
    ],
  },
} satisfies Record<string, Site>;

export type SiteKey = keyof typeof SITES;
