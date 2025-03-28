import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { WikipediaArticle } from '../../types';

interface WikiTokCardProps {
  article: WikipediaArticle;
  isActive: boolean;
}

const WikiTokCard: React.FC<WikiTokCardProps> = ({ article, isActive }) => {
  const [expanded, setExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const extractRef = useRef<HTMLDivElement>(null);

  // Check if the content has overflow and needs a "Read more" button
  useEffect(() => {
    if (extractRef.current) {
      const el = extractRef.current;
      setHasOverflow(el.scrollHeight > el.clientHeight);
    }
  }, [article.extract, isActive]);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // Default background image if no thumbnail is available
  const backgroundImage = article.thumbnail
    ? `url(${article.thumbnail.source})`
    : 'linear-gradient(135deg, #667eea, #764ba2)';

  return (
    <motion.div
      className="wiktok-card"
      initial={{ opacity: 0 }}
      animate={{
        opacity: isActive ? 1 : 0.3,
        scale: isActive ? 1 : 0.95,
      }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="wiktok-card-content"
        style={{
          backgroundImage,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="wiktok-card-overlay">
          <motion.div
            className={`wiktok-card-text ${expanded ? 'expanded-container' : ''}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2>{article.title}</h2>
            <div
              ref={extractRef}
              className={`wiktok-extract ${expanded ? 'expanded' : ''}`}
            >
              <p>{article.extract}</p>
            </div>

            {hasOverflow && (
              <button className="wiktok-read-more" onClick={toggleExpanded}>
                {expanded ? 'Show less' : 'Read more'}
              </button>
            )}

            <div className="wiktok-actions">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="wiktok-button"
              >
                View on Wikipedia
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default WikiTokCard;
