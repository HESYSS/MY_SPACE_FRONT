import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RealEstateCategories from "./RealEstateCategories";
import OurValues from "@/components/Principles";

export default function HomePage() {
  return (
    <div>
      <main>
        <h1>Головна сторінка</h1>
        <p>
          Відео, слайдер районів, категорії нерухомості, про нас, форми
          зворотнього звʼязку
        </p>
        <RealEstateCategories/>
        <OurValues/>
      </main>
    </div>
  );
}
