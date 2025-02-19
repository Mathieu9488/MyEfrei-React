// filepath: /c:/Users/mathi/OneDrive/Documents/Cours/MyEfrei-React/my-efrei/src/pages/home.js
import '../css/home.css';
import Navbar from '../components/Navbar';

function Home() {
  return (
    <div className="home-container">
      <Navbar />
      <header className="home-header">
        <h1>Bienvenue sur MyEfrei</h1>
        <p>Retrouvez toutes les informations de votre école en un seul endroit.</p>
      </header>
      <section className="home-section">
        <h2>Événements</h2>
        <div className="event-card">
          <p className="event-title">Repair Café - 20 Février</p>
          <p className="event-desc">Un objet à réparer ? Viens nous aider !</p>
        </div>
      </section>
      <section className="home-section">
        <h2>Actualités</h2>
        <div className="news-card">
          <p className="news-title">Tech Alert</p>
          <p className="news-desc">Talk sur le hacking planétaire...</p>
        </div>
      </section>
    </div>
  );
}

export default Home;