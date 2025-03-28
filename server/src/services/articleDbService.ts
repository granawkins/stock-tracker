import { WikipediaArticle } from '../types';

// Interface for articles stored in our database with additional fields
interface StoredArticle extends WikipediaArticle {
  likes: number;
  timestamp: number;
}

/**
 * In-memory database for storing and tracking Wikipedia articles
 */
class ArticleDbService {
  private articles: Map<number, StoredArticle>;

  constructor() {
    this.articles = new Map();
  }

  /**
   * Adds or updates articles in the database
   * @param articles Articles to store
   * @returns The stored articles with likes count
   */
  public storeArticles(articles: WikipediaArticle[]): WikipediaArticle[] {
    const now = Date.now();

    // Process each article
    return articles.map((article) => {
      // If article already exists, return it with current likes count
      if (this.articles.has(article.pageId)) {
        const storedArticle = this.articles.get(article.pageId)!;
        return {
          ...article,
          likes: storedArticle.likes,
        };
      }

      // Otherwise, store as new article with 0 likes
      const newArticle: StoredArticle = {
        ...article,
        likes: 0,
        timestamp: now,
      };

      this.articles.set(article.pageId, newArticle);

      return {
        ...article,
        likes: 0,
      };
    });
  }

  /**
   * Increments the like count for an article
   * @param pageId The Wikipedia page ID
   * @returns The updated like count, or null if article not found
   */
  public likeArticle(pageId: number): number | null {
    const article = this.articles.get(pageId);

    if (!article) {
      return null;
    }

    article.likes += 1;
    this.articles.set(pageId, article);

    return article.likes;
  }

  /**
   * Gets the like count for an article
   * @param pageId The Wikipedia page ID
   * @returns The like count, or null if article not found
   */
  public getArticleLikes(pageId: number): number | null {
    return this.articles.get(pageId)?.likes ?? null;
  }

  /**
   * Gets all stored articles
   * @returns Array of all stored articles
   */
  public getAllArticles(): WikipediaArticle[] {
    return Array.from(this.articles.values());
  }

  /**
   * Gets most liked articles
   * @param limit Maximum number of articles to return
   * @returns Array of most liked articles
   */
  public getMostLikedArticles(limit: number = 10): WikipediaArticle[] {
    return Array.from(this.articles.values())
      .sort((a, b) => b.likes - a.likes)
      .slice(0, limit);
  }
}

// Create a singleton instance
const articleDb = new ArticleDbService();

export default articleDb;
