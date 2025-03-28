import './styles.css';

const TopBar: React.FC = () => {
  return (
    <div className="topbar">
      <div className="topbar-content">
        <div className="logo-container">
          <h1 className="logo-text">WikTok</h1>
          <span className="logo-icon">📚</span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
