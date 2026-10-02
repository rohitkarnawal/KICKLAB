import "./Featured.css";

function Featured() {
  return (
    <section className="featured mb-3">

      <h2>Featured</h2>

      <div className="featured-grid">

        {/* Running */}
        <div className="featured-card">
          <img
            src="./media/images/featured-running.jpg"
            alt="Running collection"
          />
        </div>


        {/* Golf */}
        <div className="featured-card">
          <img
            src="./media/images/featured-golf.jpg"
            alt="Golf collection"
          />
        </div>

      </div>

    </section>
  );
}

export default Featured;