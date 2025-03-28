export interface WikipediaArticle {
  title: string;
  extract: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  pageId: number;
  url: string;
  likes?: number;
}

export interface WikipediaResponse {
  articles: WikipediaArticle[];
  error?: string;
}

export interface LikeResponse {
  pageId: number;
  likes: number;
}
