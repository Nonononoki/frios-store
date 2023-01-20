export enum AppSourceE {
  GITHUB = "github",
  RETROARCH = "retroarch",
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
  author: string;
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
}

export type AppInfoDto = {
  url: string;
  name: string;
  website: string;
  source: AppSourceE;
  author: string;
  file: AppFileE;
  category: AppCategoryE;
  icon: string;
  screenshots: Array<Object>;
  description: string;
  opensource: boolean;
  ads: boolean;
  mtx: boolean;
  official: boolean;
  nsfw: boolean;
  
  bundleId: string;
  installed: boolean;
  hasUpdate: boolean;
  visible: boolean;
}

export type GithubReleasesT = {
  assets_url: string;
  name: string;
  assets: Array<GithubReleasesAssetT>;
  created_at: string;
}

export type GithubReleasesAssetT = {
  name: string;
  browser_download_url: string;
}

