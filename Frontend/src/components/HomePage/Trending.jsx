import "./Trending.css";

function Trending() {
  return (
    <section className="trending">

      <h2>Trending</h2>

      <div className="trending-grid">

        {/* Card 1 */}
        <div className="trending-card">
          <img
            src="./media/images/afterdark.jpg"
            alt="After Dark Tour"
          />

        </div>


        {/* Card 2 */}
        <div className="trending-card">
          <img
            src="./media/images/fastfun.jpg"
            alt="Kids Running"
          />

        </div>


        {/* Card 3 */}
        <div className="trending-card">
          <img
             src="./media/images/powerup.jpg"
            alt="Nike Training"
          />

         
        </div>

      </div>

    </section>
  );
}

export default Trending;