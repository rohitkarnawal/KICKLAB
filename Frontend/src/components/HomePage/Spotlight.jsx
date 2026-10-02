import "./Spotlight.css";

const spotlightItems = [
  { image: "/media/images/air-jordan-1.png"},
  { image: "/media/images/air-force-1.png" },
  { image: "/media/images/graphic-tees.png" },
  { image: "/media/images/pegasus.png" },
  { image: "/media/images/vomero-18.png" },
  { image: "/media/images/pegasus-42.png"},
  { image: "/media/images/slides.png"},
  { image: "/media/images/tiempo-elite.png" },

  { image: "/media/images/dunk.png" },
  { image: "/media/images/bottoms.png" },
  { image: "/media/images/p6000.png" },
  { image: "/media/images/caps.png"},
  { image: "/media/images/air-max.png" },
  { image: "/media/images/sports-bras.png"},
  { image: "/media/images/metcon-7.png" },
  { image: "/media/images/shorts.png"},
];

function Spotlight() {
  return (
    <section className="spotlight mb-5">
      <h2>SPOTLIGHT</h2>

      <p>
        Classic silhouettes and cutting-edge innovation to build your game
        from the ground up.
      </p>

      <div className="spotlight-grid">
        {spotlightItems.map((item) => (
          <div className="spotlight-item" key={item.name}>
            <img src={item.image} alt={item.name} />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Spotlight;