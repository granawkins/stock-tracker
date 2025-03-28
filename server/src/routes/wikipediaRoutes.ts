import express from 'express';
import {
  getRandomArticles,
  getArticleBatch,
  likeArticle,
  getArticleLikes,
  getMostLikedArticles,
} from '../services/wikipediaService';

const router = express.Router();

/**
 * GET /api/wikipedia/random
 * Returns a single random Wikipedia article
 */
const getRandomArticleHandler = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const response = await getRandomArticles(1);

    if (response.error) {
      res.status(500).json({ error: response.error });
      return;
    }

    res.json(response);
  } catch (error) {
    console.error('Error in random article route:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * GET /api/wikipedia/batch
 * Returns a batch of random Wikipedia articles for the feed
 * Query param: size (default: 5)
 */
const getArticleBatchHandler = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const batchSize = req.query.size ? parseInt(req.query.size as string) : 5;

    // Limit batch size to reasonable values
    const size = Math.min(Math.max(1, batchSize), 10);

    const response = await getArticleBatch(size);

    if (response.error) {
      res.status(500).json({ error: response.error });
      return;
    }

    res.json(response);
  } catch (error) {
    console.error('Error in batch articles route:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * POST /api/wikipedia/like/:pageId
 * Like an article
 */
const likeArticleHandler = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const pageId = parseInt(req.params.pageId);

    if (isNaN(pageId)) {
      res.status(400).json({ error: 'Invalid page ID' });
      return;
    }

    const result = await likeArticle(pageId);

    if (!result) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }

    res.json(result);
  } catch (error) {
    console.error('Error liking article:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * GET /api/wikipedia/like/:pageId
 * Gets likes for an article
 */
const getArticleLikesHandler = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const pageId = parseInt(req.params.pageId);

    if (isNaN(pageId)) {
      res.status(400).json({ error: 'Invalid page ID' });
      return;
    }

    const result = await getArticleLikes(pageId);

    if (!result) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }

    res.json(result);
  } catch (error) {
    console.error('Error getting article likes:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * GET /api/wikipedia/popular
 * Gets most liked articles
 * Query param: limit (default: 10)
 */
const getPopularArticlesHandler = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    // Limit to reasonable values
    const size = Math.min(Math.max(1, limit), 20);

    const response = await getMostLikedArticles(size);
    res.json(response);
  } catch (error) {
    console.error('Error getting popular articles:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Register routes
router.get('/random', getRandomArticleHandler);
router.get('/batch', getArticleBatchHandler);
router.post('/like/:pageId', likeArticleHandler);
router.get('/like/:pageId', getArticleLikesHandler);
router.get('/popular', getPopularArticlesHandler);

export default router;
