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
}

export interface WikipediaResponse {
  articles: WikipediaArticle[];
  error?: string;
}
