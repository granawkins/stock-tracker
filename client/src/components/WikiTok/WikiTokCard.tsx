import { useState } from 'react';
import { motion } from 'framer-motion';
import { WikipediaArticle } from '../../types';

interface WikiTokCardProps {
  article: WikipediaArticle;
  isActive: boolean;
}

const WikiTokCard: React.FC<WikiTokCardProps> = ({ article, isActive }) => {
  const [expanded, setExpanded] = useState(false);

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
        }}
      >
        <div className="wiktok-card-overlay">
          <motion.div
            className="wiktok-card-text"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2>{article.title}</h2>
            <div className={`wiktok-extract ${expanded ? 'expanded' : ''}`}>
              <p>{article.extract}</p>
            </div>

            {article.extract.length > 150 && (
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
