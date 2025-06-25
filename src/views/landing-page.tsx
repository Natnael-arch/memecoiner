import React from 'react'
import { Helmet } from 'react-helmet'
import { ConnectKitButton } from "connectkit"
import { useAccount } from 'wagmi'
import SolidButton from '../components/solid-button'
import { useMemeCoins } from '../hooks/useMemeCoins'
import './landing-page.css'

const LandingPage = () => {
  const { address } = useAccount();
  const { memeCoins, loading, error } = useMemeCoins({ minterAddress: address });
  
  return (
    <div className="landing-page-container1">
      <Helmet>
        <title>Memecoiner - Mint Your Memes</title>
        <meta property="og:title" content="Memecoiner - Mint Your Memes" />
        <meta property="og:description" content="Create, mint, and share your memes on the blockchain" />
      </Helmet>
      
      {/* Navigation */}
      <nav className="landing-page-navbar">
        <div className="nav-brand">
          <h1>🚀 Memecoiner</h1>
        </div>
        <div className="nav-links">
          <a href="/upload" className="upload-btn">
            <SolidButton button="🎨 Create Meme" />
          </a>
          <ConnectKitButton />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Turn Your <span className="gradient-text">Memes</span> Into <span className="gradient-text">Coins</span>
          </h1>
          <p className="hero-subtitle">
            Create, mint, and trade your memes on the blockchain. 
            Join the revolution of decentralized meme culture.
          </p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">{loading ? '...' : memeCoins.length}</span>
              <span className="stat-label">Meme Coins</span>
            </div>
            <div className="stat">
              <span className="stat-number">∞</span>
              <span className="stat-label">Possibilities</span>
          </div>
          </div>
          <a href="/upload" className="cta-button">
            <SolidButton button="🚀 Start Creating" />
          </a>
                </div>
        <div className="hero-visual">
          <div className="floating-memes">
            {memeCoins.slice(0, 3).map((coin, idx) => (
              <div key={coin.address} className={`floating-meme meme-${idx + 1}`}>
                {coin.image && <img src={coin.image} alt={coin.name} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Memes Gallery */}
      <section className="memes-section">
        <div className="section-header">
          <h2>🔥 Hot Meme Coins</h2>
          <p>Latest creations from the community</p>
        </div>
        
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading meme coins...</p>
          </div>
        )}
        
        {error && (
          <div className="error-container">
            <p>❌ Error: {error}</p>
          </div>
        )}
        
        {!loading && !error && memeCoins.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🎭</div>
            <h3>No meme coins yet!</h3>
            <p>Be the first to create a meme coin and start the revolution!</p>
            <a href="/upload" className="create-first-btn">
              <SolidButton button="Create First Coin" />
            </a>
          </div>
        )}
        
        {memeCoins.length > 0 && (
          <div className="memes-grid">
            {memeCoins.map((coin, idx) => (
              <div key={coin.address} className="meme-card">
                <div className="meme-image-container">
                  {coin.image && <img src={coin.image} alt={coin.name} className="meme-image" />}
                  <div className="meme-overlay">
                    <span className="meme-number">#{idx + 1}</span>
                  </div>
                </div>
                <div className="meme-info">
                  <h3 className="meme-title">{coin.name} ({coin.symbol})</h3>
                  <p className="meme-description">{coin.description}</p>
                  
                  <div className="meme-creator">
                    <span className="creator-label">Creator:</span>
                    <span className="creator-address">
                      {coin.payoutRecipient || 'Unknown'}
                    </span>
                  </div>
                  <div className="meme-actions">
                    <button className="action-btn buy-btn">⚡ Buy</button>
                    <button className="action-btn">❤️</button>
                    <button className="action-btn">📤</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>🚀 Memecoiner</h3>
            <p>Minting memes, one block at a time</p>
          </div>
          <div className="footer-links">
            <div className="footer-section">
              <h4>Platform</h4>
              <a href="/upload">Create Meme</a>
              <a href="#gallery">Gallery</a>
              <a href="#about">About</a>
            </div>
            <div className="footer-section">
              <h4>Community</h4>
              <a href="#discord">Discord</a>
              <a href="#twitter">Twitter</a>
              <a href="#telegram">Telegram</a>
            </div>
            <div className="footer-section">
              <h4>Resources</h4>
              <a href="#docs">Documentation</a>
              <a href="#faq">FAQ</a>
              <a href="#support">Support</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Memecoiner. All memes belong to their creators.</p>
      </div>
      </footer>
    </div>
  )
}

export default LandingPage;
