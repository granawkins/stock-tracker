import axios from 'axios';
import { WikipediaArticle, WikipediaResponse, LikeResponse } from '../types';
import articleDb from './articleDbService';

const WIKIPEDIA_ACTION_API = 'https://en.wikipedia.org/w/api.php';

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

    // Store articles in our database and get them back with likes counts
    const articlesWithLikes = articleDb.storeArticles(articles);

    return { articles: articlesWithLikes };
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
 * Gets a batch of articles for the TikTok-style feed
 * @param batchSize Number of articles to fetch at once
 * @returns Promise with Wikipedia articles
 */
export async function getArticleBatch(
  batchSize: number = 5
): Promise<WikipediaResponse> {
  return getRandomArticles(batchSize);
}

/**
 * Like an article
 * @param pageId The Wikipedia page ID
 * @returns Promise with updated like count
 */
export async function likeArticle(
  pageId: number
): Promise<LikeResponse | null> {
  const likes = articleDb.likeArticle(pageId);

  if (likes === null) {
    return null;
  }

  return {
    pageId,
    likes,
  };
}

/**
 * Get article likes
 * @param pageId The Wikipedia page ID
 * @returns Promise with current like count
 */
export async function getArticleLikes(
  pageId: number
): Promise<LikeResponse | null> {
  const likes = articleDb.getArticleLikes(pageId);

  if (likes === null) {
    return null;
  }

  return {
    pageId,
    likes,
  };
}

/**
 * Get most liked articles
 * @param limit Maximum number of articles to return
 * @returns Promise with most liked articles
 */
export async function getMostLikedArticles(
  limit: number = 10
): Promise<WikipediaResponse> {
  const articles = articleDb.getMostLikedArticles(limit);

  return { articles };
}
