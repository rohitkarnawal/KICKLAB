import "./Hero.css"

function Hero() {
  return (
    <section className="hero">

      <img
        src="./media/images/hero.jpg"
        alt="Featured shoe"
        className="hero-image"
      />

      <div className="hero-content">
        <h1>MOON SHOE</h1>

        <p>The origin of speed</p>

        <button>Shop</button>
      </div>

    </section>
  );
}

export default Hero;