import axios from 'axios';
import { WikipediaArticle, WikipediaResponse } from '../types';

const WIKIPEDIA_API_URL = 'https://en.wikipedia.org/api/rest_v1';
const WIKIPEDIA_ACTION_API = 'https://en.wikipedia.org/w/api.php';

/**
 * Fetches random articles from Wikipedia
 * @param count Number of random articles to fetch
 * @returns Promise with Wikipedia articles
 */
export async function getRandomArticles(count: number = 1): Promise<WikipediaResponse> {
  try {
    // Get random article titles
    const randomResponse = await axios.get(
      `${WIKIPEDIA_ACTION_API}?action=query&list=random&rnnamespace=0&rnlimit=${count}&format=json&origin=*`
    );
    
    const randomArticles = randomResponse.data.query.random;
    const pageIds = randomArticles.map((article: any) => article.id).join('|');
    
    // Get details for those articles
    const detailsResponse = await axios.get(
      `${WIKIPEDIA_ACTION_API}?action=query&prop=extracts|pageimages|info&exintro=1&explaintext=1&inprop=url&pithumbsize=800&pageids=${pageIds}&format=json&origin=*`
    );
    
    const pages = detailsResponse.data.query.pages;
    
    // Transform the response into our expected format
    const articles: WikipediaArticle[] = Object.values(pages).map((page: any) => ({
      title: page.title,
      extract: page.extract || 'No extract available',
      thumbnail: page.thumbnail ? {
        source: page.thumbnail.source,
        width: page.thumbnail.width,
        height: page.thumbnail.height
      } : undefined,
      pageId: page.pageid,
      url: page.fullurl
    }));
    
    return { articles };
    
  } catch (error) {
    console.error('Error fetching Wikipedia articles:', error);
    if (axios.isAxiosError(error)) {
      return { 
        articles: [],
        error: error.message || 'Error fetching articles from Wikipedia'
      };
    }
    return { 
      articles: [],
      error: 'Unknown error occurred while fetching articles'
    };
  }
}

/**
 * Gets a batch of articles for the TikTok-style feed
 * @param batchSize Number of articles to fetch at once
 * @returns Promise with Wikipedia articles
 */
export async function getArticleBatch(batchSize: number = 5): Promise<WikipediaResponse> {
  return getRandomArticles(batchSize);
}