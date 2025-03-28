import express from 'express';
import { getRandomArticles, getArticleBatch } from '../services/wikipediaService';

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

router.get('/random', getRandomArticleHandler);
router.get('/batch', getArticleBatchHandler);

export default router;