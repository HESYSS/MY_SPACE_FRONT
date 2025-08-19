import styles from './AboutUsSection.module.css';
import teamAbout from '../../../../public/icons/teamAbout.png';

export default function AboutUsSection() {
  return (
    <div className={styles.aboutUs}>
      <div className={styles.titleSection}>
        <h2 className={styles.mainTitle}>ПРО НАС</h2>
        <div className={styles.line8}></div>
      </div>
      <div className={styles.contentSection}>
        <div className={styles.imageContainer}>
          <img
            src={teamAbout.src} // Используйте teamAbout.src для получения пути к изображению
            alt="Команда MySpace"
            className={styles.mainImage}
          />
        </div>
        <div className={styles.textContainer}>
          <div className={styles.frame272}>
            <p className={styles.textHeading}>
              Місія My Space - це задоволення запиту кожного клієнта, його безпека, спокій та комфорт.
            </p>
            <p className={styles.textBody}>
Неважливо, чи це житлова нерухомість, чи комерційна - ми допомагаємо нашим клієнтам, зробити найкращий вибір, який точно відповідатиме вашим потребам та примноженню капіталу. Наші експерти з нерухомості гарантують якість і професіоналізм на кожному етапі - від першої консультації до останнього підпису при оформленні документів. Персональний підхід наших фахівців дозволяє врахувати всі Ваші задуми та знайти рішення, що перетворюють бажання на адреси. Саме тому Ви з упевненістю порекомендуєте нас своїм знайомим - бо знаєте, що з нами легко, надійно і по-людськи. Нам щиро приємно бути частиною ваших важливих змін і нових початків!            </p>
          </div>
        </div>
      </div>
    </div>
  );
}