import express, { Request, Response } from 'express';
import { getRandomArticles, getArticleBatch } from '../services/wikipediaService';

const router = express.Router();

/**
 * GET /api/wikipedia/random
 * Returns a single random Wikipedia article
 */
router.get('/random', async (req: Request, res: Response) => {
  try {
    const response = await getRandomArticles(1);
    
    if (response.error) {
      return res.status(500).json({ error: response.error });
    }
    
    return res.json(response);
  } catch (error) {
    console.error('Error in random article route:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

/**
 * GET /api/wikipedia/batch
 * Returns a batch of random Wikipedia articles for the feed
 * Query param: size (default: 5)
 */
router.get('/batch', async (req: Request, res: Response) => {
  try {
    const batchSize = req.query.size ? parseInt(req.query.size as string) : 5;
    
    // Limit batch size to reasonable values
    const size = Math.min(Math.max(1, batchSize), 10);
    
    const response = await getArticleBatch(size);
    
    if (response.error) {
      return res.status(500).json({ error: response.error });
    }
    
    return res.json(response);
  } catch (error) {
    console.error('Error in batch articles route:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;