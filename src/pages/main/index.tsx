import RealEstateCategories from "./RealEstateCategories";
import OurValues from "@/components/Principles";
import styles from './main.module.css';
import CoworkingSection from "./CoworkingSection";

export default function HomePage() {
  return (
    <div>
      <main>
        <h1>Головна сторінка</h1>
        <p>
          Відео, слайдер районів, категорії нерухомості, про нас, форми
          зворотнього звʼязку
        </p>
        <div className={styles.titleMain}>
        <h2 className={styles.mainTitle}>РАЙОНИ КИЄВА</h2>
        <div className={styles.line9}></div>
        </div>
        <RealEstateCategories/>
        <div className={styles.mainP}>
          <div className={styles.titleMain}>
            <h2 className={styles.mainTitle}>ПРО НАС</h2>
            <div className={styles.line8}></div>
          </div>

        <div className={styles.aboutUsContainer}> {/* Новый контейнер */}
          <div className={styles.lightEffect}></div> {/* Эффект свечения */}
          <OurValues/> {/* Блок "Про нас" */}
        </div>
        </div>
        <CoworkingSection/>
      </main>
    </div>
  );
}