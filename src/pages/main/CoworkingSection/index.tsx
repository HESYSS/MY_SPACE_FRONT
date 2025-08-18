import styles from './CoworkingSection.module.css';
import arrowRight from '../../../../public/icons/line.svg'

export default function CoworkingSection() {
  return (
    <div className={styles.coworkingP}>
      <div className={styles.coworkingTitle}>
        <div className={styles.line8}></div>
        <h2 className={styles.mainTitle}>Співпраця</h2>
      </div>
      <div className={styles.coworking}>
        <h3 className={styles.callToAction}>Бажаєте отримати консультацію?</h3>
        <div className={styles.frame89}>
          <div className={styles.frame88}>
            <div className={styles.optionRow}> {/* Новый контейнер для первой строки */}
              <div className={styles.frame87}>
                <div className={styles.line16}></div>
                <div className={styles.frame86}>
                  <p className={styles.optionText}>Продавцям/Орендодавцям</p>
                  <img src={arrowRight.src} alt="Стрілка вправо" className={styles.arrowIcon} />
                </div>
              </div>
            </div>
            <div className={styles.optionRow}> {/* Новый контейнер для второй строки */}
              <div className={styles.frame85}>
                <div className={styles.line17}></div>
                <div className={styles.frame84}>
                  <p className={styles.optionText}>Покупцям/Орендарям</p>
                  <img src={arrowRight.src} alt="Стрілка вправо" className={styles.arrowIcon} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}