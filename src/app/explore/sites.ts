export interface Site {
  name: string;
  dir: string; // must end with /
  entryPage: string; // relative to dir
}

export const SITES = {
  "csci-1377": {
    name: "CSCI 1377",
    dir: "/sites/csci-1377/",
    entryPage: "index.html",
  },
} satisfies Record<string, Site>;

export type SiteKey = keyof typeof SITES;
