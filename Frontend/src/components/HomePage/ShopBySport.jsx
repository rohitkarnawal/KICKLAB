import { useState } from "react";
import "./ShopBySport.css";

const sports = [
  {
    image: "/media/images/running.jpg",
    title: "Running",
  },
  {
    image: "/media/images/training.jpg",
    title: "Training",
  },
  {
    image: "/media/images/sportswear.jpg",
    title: "Sportswear",
  },
  {
    image: "/media/images/basketball.jpg",
    title: "Basketball",
  },
  {
    image: "/media/images/football.jpg",
    title: "Football",
  },
];

function ShopBySport() {
  const [position, setPosition] = useState(0);

  const nextSlide = () => {
    if (position < sports.length - 3) {
      setPosition(position + 1);
    }
  };

  const prevSlide = () => {
    if (position > 0) {
      setPosition(position - 1);
    }
  };

  return (
    <section className="shop-sport">
      <h2>Shop By Sport</h2>

      <div className="sport-slider">
        <div
          className="sport-track"
          style={{
            transform: `translateX(-${position * 33.33}%)`,
          }}
        >
          {sports.map((sport) => (
            <div className="sport-card" key={sport.title}>
              <img src={sport.image} alt={sport.title} />
              <h3>{sport.title}</h3>
            </div>
          ))}
        </div>

        {position > 0 && (
          <button className="sport-btn left" onClick={prevSlide}>
            ‹
          </button>
        )}

        {position < sports.length - 3 && (
          <button className="sport-btn right" onClick={nextSlide}>
            ›
          </button>
        )}
      </div>
    </section>
  );
}

export default ShopBySport;