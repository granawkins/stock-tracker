import { WikipediaArticle, WikipediaResponse, LikeResponse } from '../types';

/**
 * Fetches a single random Wikipedia article
 * @returns Promise with Wikipedia article data
 */
export async function fetchRandomArticle(): Promise<WikipediaArticle | null> {
  try {
    const response = await fetch('/api/wikipedia/random');

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data: WikipediaResponse = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data.articles[0] || null;
  } catch (error) {
    console.error('Error fetching random article:', error);
    throw error;
  }
}

/**
 * Fetches a batch of Wikipedia articles for the feed
 * @param batchSize Number of articles to fetch (default: 5)
 * @returns Promise with array of Wikipedia articles
 */
export async function fetchArticleBatch(
  batchSize: number = 5
): Promise<WikipediaArticle[]> {
  try {
    const response = await fetch(`/api/wikipedia/batch?size=${batchSize}`);

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data: WikipediaResponse = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data.articles || [];
  } catch (error) {
    console.error('Error fetching article batch:', error);
    throw error;
  }
}

/**
 * Like an article
 * @param pageId Wikipedia page ID to like
 * @returns Updated like count
 */
export async function likeArticle(pageId: number): Promise<number> {
  try {
    const response = await fetch(`/api/wikipedia/like/${pageId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data: LikeResponse = await response.json();
    return data.likes;
  } catch (error) {
    console.error('Error liking article:', error);
    throw error;
  }
}

/**
 * Fetches popular articles based on like count
 * @param limit Maximum number of articles to fetch
 * @returns Promise with array of Wikipedia articles
 */
export async function fetchPopularArticles(
  limit: number = 10
): Promise<WikipediaArticle[]> {
  try {
    const response = await fetch(`/api/wikipedia/popular?limit=${limit}`);

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data: WikipediaResponse = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data.articles || [];
  } catch (error) {
    console.error('Error fetching popular articles:', error);
    throw error;
  }
}
