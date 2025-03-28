import { motion } from 'framer-motion';
import './styles.css';

const TopBar: React.FC = () => {
  return (
    <motion.div
      className="topbar"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="topbar-content">
        <div className="logo-container">
          <h1 className="logo-text">WikTok</h1>
          <span className="logo-icon">📚</span>
        </div>
      </div>
    </motion.div>
  );
};

export default TopBar;
