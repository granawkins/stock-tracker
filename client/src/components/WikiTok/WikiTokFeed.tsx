import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import WikiTokCard from './WikiTokCard';
import { fetchArticleBatch } from '../../services/wikipediaService';
import { WikipediaArticle } from '../../types';
import './styles.css';

const WikiTokFeed: React.FC = () => {
  const [articles, setArticles] = useState<WikipediaArticle[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);

  // Animation duration in milliseconds
  const scrollAnimationDuration = 300;

  // Fetch initial batch of articles
  const { data, isError, error } = useQuery({
    queryKey: ['wikipediaArticles'],
    queryFn: () => fetchArticleBatch(5),
    refetchOnWindowFocus: false,
    retry: 2,
  });

  // Update articles state when data is fetched
  useEffect(() => {
    if (data) {
      setArticles(data);
      setIsLoading(false);
    }
  }, [data]);

  // Load more articles when reaching near the end
  const loadMoreArticles = async () => {
    if (currentIndex >= articles.length - 2) {
      try {
        const newArticles = await fetchArticleBatch(3);
        setArticles((prevArticles) => [...prevArticles, ...newArticles]);
      } catch (err) {
        console.error('Failed to load more articles', err);
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling) return;

      if (e.key === 'ArrowDown' && currentIndex < articles.length - 1) {
        e.preventDefault();
        navigateToNext();
      } else if (e.key === 'ArrowUp' && currentIndex > 0) {
        e.preventDefault();
        navigateToPrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, articles.length, isScrolling]);

  // Navigation functions
  const navigateToNext = () => {
    if (isScrolling || currentIndex >= articles.length - 1) return;

    setIsScrolling(true);
    setCurrentIndex(currentIndex + 1);
    loadMoreArticles();

    setTimeout(() => {
      setIsScrolling(false);
    }, scrollAnimationDuration);
  };

  const navigateToPrevious = () => {
    if (isScrolling || currentIndex <= 0) return;

    setIsScrolling(true);
    setCurrentIndex(currentIndex - 1);

    setTimeout(() => {
      setIsScrolling(false);
    }, scrollAnimationDuration);
  };

  // Handle scroll/swipe to navigate between articles
  const handleWheel = (e: React.WheelEvent) => {
    // Prevent default to avoid page scroll
    e.preventDefault();

    if (isScrolling) return;

    if (e.deltaY > 0 && currentIndex < articles.length - 1) {
      // Scrolling down - next article
      navigateToNext();
    } else if (e.deltaY < 0 && currentIndex > 0) {
      // Scrolling up - previous article
      navigateToPrevious();
    }
  };

  // Touch controls for mobile
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null || isScrolling) return;

    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;

    // Detect swipe direction and minimum distance
    if (diff > 50 && currentIndex < articles.length - 1) {
      // Swipe up - next article
      navigateToNext();
    } else if (diff < -50 && currentIndex > 0) {
      // Swipe down - previous article
      navigateToPrevious();
    }

    touchStartY.current = null;
  };

  if (isError) {
    return (
      <div className="wiktok-error">
        <h2>Failed to load articles</h2>
        <p>{error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }

  return (
    <div
      className="wiktok-feed"
      ref={feedRef}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      tabIndex={0} // Make the container focusable for keyboard events
    >
      {isLoading ? (
        <div className="wiktok-loading">
          <h2>Loading Wikipedia articles...</h2>
        </div>
      ) : (
        <motion.div
          className="wiktok-container"
          initial={false}
          animate={{ y: `-${currentIndex * 100}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {articles.map((article, index) => (
            <WikiTokCard
              key={`${article.pageId}-${index}`}
              article={article}
              isActive={index === currentIndex}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default WikiTokFeed;
