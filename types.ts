export enum AppSourceE {
  GITHUB = "github",
  LIBRETRO = "libretro",
  KODI = "kodi"
}

export enum AppFileE {
  IPA = "ipa",
  DEB = "deb"
}

export enum AppCategoryE {
  BEAUTY = "beauty",
  BOOKS = "books",
  BUSINESS = "business",
  COMMUNICATION = "communication",
  DATING = "dating",
  EDUCATION = "education",
  ENTERTAINMENT = "entertainment",
  GAME = "game",
  HEALTH = "health",
  INTERNET = "internet",
  NAVIGATION = "navigation",
  NEWS = "news",
  PRODUCTIVITY = "productivity",
  SHOPPING = "shopping",
  SOCIAL = "social",
  SPORTS = "sports",
  TOOLS = "tools",
  WEATHER = "weather",
  OTHER = "other"
}

export type AppInfoT = {
  url: string;
  name: string;
  website: string;
  source: AppSourceE;
  file: AppFileE;
  category: AppCategoryE;
  icon: string;
  screenshots: Array<string>;
  description: Map<string, string>;
  opensource: boolean;
  ads: boolean;
  mtx: boolean;
  official: boolean;
  nsfw: boolean;

  bundleId: string;
  version: string;
  installed: boolean;
  hasUpdate: boolean;
}

export type GithubReleasesT = {
  assets_url: string;
  name: string;
  assets: Array<GithubReleasesAssetT>;
}

export type GithubReleasesAssetT = {
  name: string;
  browser_download_url: string;
}

