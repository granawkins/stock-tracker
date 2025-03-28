import { WikipediaArticle, WikipediaResponse } from '../types';

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
export async function fetchArticleBatch(batchSize: number = 5): Promise<WikipediaArticle[]> {
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