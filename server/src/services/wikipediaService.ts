import axios from 'axios';
import { WikipediaArticle, WikipediaResponse } from '../types';

const WIKIPEDIA_ACTION_API = 'https://en.wikipedia.org/w/api.php';

// Configuration constants for interesting articles
const MIN_EXTRACT_LENGTH = 200; // Minimum character length for article extract
const MAX_FETCH_ATTEMPTS = 10; // Maximum number of batches to fetch to prevent infinite loops
const BATCH_MULTIPLIER = 3; // How many more articles to fetch than needed

// TypeScript interfaces for Wikipedia API responses
interface WikipediaRandomArticle {
  id: number;
  title: string;
}

interface WikipediaThumbnail {
  source: string;
  width: number;
  height: number;
}

interface WikipediaPageDetails {
  pageid: number;
  title: string;
  extract?: string;
  thumbnail?: WikipediaThumbnail;
  fullurl: string;
}

interface WikipediaRandomResponse {
  query: {
    random: WikipediaRandomArticle[];
  };
}

interface WikipediaDetailsResponse {
  query: {
    pages: Record<string, WikipediaPageDetails>;
  };
}

/**
 * Fetches random articles from Wikipedia
 * @param count Number of random articles to fetch
 * @returns Promise with Wikipedia articles
 */
export async function getRandomArticles(
  count: number = 1
): Promise<WikipediaResponse> {
  try {
    // Get random article titles
    const randomResponse = await axios.get<WikipediaRandomResponse>(
      `${WIKIPEDIA_ACTION_API}?action=query&list=random&rnnamespace=0&rnlimit=${count}&format=json&origin=*`
    );

    const randomArticles = randomResponse.data.query.random;
    const pageIds = randomArticles.map((article) => article.id).join('|');

    // Get details for those articles
    const detailsResponse = await axios.get<WikipediaDetailsResponse>(
      `${WIKIPEDIA_ACTION_API}?action=query&prop=extracts|pageimages|info&exintro=1&explaintext=1&inprop=url&pithumbsize=800&pageids=${pageIds}&format=json&origin=*`
    );

    const pages = detailsResponse.data.query.pages;

    // Transform the response into our expected format
    const articles: WikipediaArticle[] = Object.values(pages).map((page) => ({
      title: page.title,
      extract: page.extract || 'No extract available',
      thumbnail: page.thumbnail
        ? {
            source: page.thumbnail.source,
            width: page.thumbnail.width,
            height: page.thumbnail.height,
          }
        : undefined,
      pageId: page.pageid,
      url: page.fullurl,
    }));

    return { articles };
  } catch (error) {
    console.error('Error fetching Wikipedia articles:', error);
    if (axios.isAxiosError(error)) {
      return {
        articles: [],
        error: error.message || 'Error fetching articles from Wikipedia',
      };
    }
    return {
      articles: [],
      error: 'Unknown error occurred while fetching articles',
    };
  }
}

/**
 * Fetches interesting Wikipedia articles - those with images and substantial content
 * @param count Number of interesting articles to fetch
 * @returns Promise with filtered interesting Wikipedia articles
 */
export async function getInterestingArticles(
  count: number = 1
): Promise<WikipediaResponse> {
  try {
    const interestingArticles: WikipediaArticle[] = [];
    let attempts = 0;

    // Continue fetching until we have enough interesting articles or reach maximum attempts
    while (
      interestingArticles.length < count &&
      attempts < MAX_FETCH_ATTEMPTS
    ) {
      // Fetch more articles than needed to increase chances of finding interesting ones
      const batchSize =
        Math.max(count - interestingArticles.length, 1) * BATCH_MULTIPLIER;

      const response = await getRandomArticles(batchSize);

      if (response.error) {
        return response;
      }

      // Filter for articles with thumbnails and substantial content
      const newInterestingArticles = response.articles.filter(
        (article) =>
          // Must have a thumbnail
          article.thumbnail &&
          // Must have substantial content (not too short)
          article.extract.length > MIN_EXTRACT_LENGTH &&
          // Extract must not be the default "No extract available" text
          article.extract !== 'No extract available'
      );

      // Add new interesting articles to our collection
      interestingArticles.push(...newInterestingArticles);
      attempts++;
    }

    // Return only the requested number of articles
    return {
      articles: interestingArticles.slice(0, count),
      // Add a warning if we couldn't find enough interesting articles
      ...(interestingArticles.length < count && {
        error: `Could only find ${interestingArticles.length} interesting articles instead of ${count} requested`,
      }),
    };
  } catch (error) {
    console.error('Error fetching interesting articles:', error);
    if (axios.isAxiosError(error)) {
      return {
        articles: [],
        error:
          error.message || 'Error fetching interesting articles from Wikipedia',
      };
    }
    return {
      articles: [],
      error: 'Unknown error occurred while fetching interesting articles',
    };
  }
}

/**
 * Gets a batch of interesting articles for the TikTok-style feed
 * @param batchSize Number of articles to fetch at once
 * @returns Promise with interesting Wikipedia articles
 */
export async function getArticleBatch(
  batchSize: number = 5
): Promise<WikipediaResponse> {
  return getInterestingArticles(batchSize);
}
