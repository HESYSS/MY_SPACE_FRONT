import styles from './principles.module.css';
import starIcon from '../../../public/icons/star.svg';

export default function OurValues() {
  return (
    <section className={styles.advantages}>
      <div className={styles.frame142}>
        <div className={styles.info}>
          <div className={styles.frame63}>
            <span className={styles.pretitle}>ДОСЛІДІТЬ ПЕРЕВАГИ</span>
            <h2 className={styles.title}>НАШІ ЦІННОСТІ</h2>
          </div>
          <div className={styles.aboutUsExamples}>
            <div className={styles.frame394}>
              <div className={styles.frame60}>
                <img src={starIcon.src} alt="Зірочка" className={styles.starIcon}/>
                <h3 className={styles.benefitTitle}>Широкий вибір</h3>
                <p className={styles.benefitText}>
                  Ми надаємо доступ до найширшого асортименту нерухомості — від квартир до комерційних приміщень для будь-якої потреби.
                </p>
              </div>
              <div className={styles.frame59}>
                <img src={starIcon.src} alt="Зірочка" className={styles.starIcon}/>
                <h3 className={styles.benefitTitle}>Довіра клієнтів</h3>
                <p className={styles.benefitText}>
                  Наші клієнти обирають нас знову і знову — ми створюємо довірчі відносини, на яких базується успіх.
                </p>
              </div>
              <div className={styles.frame62}>
                <img src={starIcon.src} alt="Зірочка" className={styles.starIcon}/>                
                <h3 className={styles.benefitTitle}>Надійність</h3>
                <p className={styles.benefitText}>
                  Ми працюємо тільки з перевіреними об'єктами та партнерами. З нами ви можете бути впевненими у своєму виборі.
                </p>
              </div>
            </div>
            <div className={styles.frame395}>
              <div className={styles.frame61}>
                <img src={starIcon.src} alt="Зірочка" className={styles.starIcon}/>
                <h3 className={styles.benefitTitle}>Простота користування</h3>
                <p className={styles.benefitText}>
                  Ми зробили пошук нерухомості простим і швидким — знайдіть найкращі варіанти в кілька кліків.
                </p>
              </div>
              <div className={styles.frame55}>
                <img src={starIcon.src} alt="Зірочка" className={styles.starIcon}/>                
                <h3 className={styles.benefitTitle}>Індивідуальний підхід</h3>
                <p className={styles.benefitText}>
                  Наша команда завжди готова дати консультацію та допомогти на кожному етапі.
                </p>
              </div>
              <div className={styles.frame57}>
                <img src={starIcon.src} alt="Зірочка" className={styles.starIcon}/>
                <h3 className={styles.benefitTitle}>Безпечні угоди</h3>
                <p className={styles.benefitText}>
                  Ми гарантуємо, що кожна угода буде на 100% безпечною та прозорою.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.photo}>
          {/* Изображение будет фоном, как указано в стилях */}
        </div>
      </div>
    </section>
  );
}