import AnnouncementBar from "../../AnnouncementBar";
import Featured from "./Featured";
import Footer from "../../Footer";
import FreshDrops from "./FreshDrops";
import Hero from "./Hero";
import Middle from "./MiddleImage";
import Navbar from "../../Navbar";
import ShopBySport from "./ShopBySport";
import Spotlight from "./Spotlight";
import Trending from "./Trending";

function Home() {
  return (
    <>
      <Navbar />
      <AnnouncementBar/>
      <Hero />
      <Featured />
      <Trending />
      <FreshDrops />
      <ShopBySport />
      <Middle />
      <Spotlight />
      <Footer />
    </>
  );
}

export default Home;