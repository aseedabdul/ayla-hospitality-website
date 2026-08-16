import Hero from "../components/home/Hero";
import Categories from "../components/home/Categories";
import FeaturedProducts from "../components/home/FeaturedProducts";
import Offers from "../components/home/Offers";
import HowItWorks from "../components/home/HowItWorks";
import Reviews from "../components/home/Reviews";
import SupportCTA from "../components/home/SupportCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts />
      <Offers />
      <HowItWorks />
      <Reviews />
      <SupportCTA />
    </>
  );
}
