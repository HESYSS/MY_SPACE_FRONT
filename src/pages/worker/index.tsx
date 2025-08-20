import React from 'react';
import Image from 'next/image';
import styles from './worker.module.css';

// Импорт изображения
import vitaliyPenc from '../../../public/icons/vitaliyPenc.png'
import arrowRight from '../../../public/icons/line.svg'

const EmployeePage = () => {
  return (
    <div className={styles.containerWithOval}> {/* Новый контейнер, который будет держать овал */}
      {/* Овал со свечением, который теперь позиционируется относительно containerWithOval */}
      <div className={styles.glowingOval}></div>

      {/* Title block */}
      <div className={styles.titleArea}>
        <div className={styles.titleLine}></div>
        <h2 className={styles.readMoreTitle}>ЧИТАТИ БІЛЬШЕ</h2>
      </div>

      {/* Employee information block wrapped in a new container */}
      <div className={styles.contactsBlockWrapper}>
        <div className={styles.contactsBlock}>
          <div className={styles.frame301}>
            {/* Photo and name/role info on the left */}
            <div className={styles.photoContainer}>
              <Image
                src={vitaliyPenc}
                alt="Олена Ринка"
                className={styles.employeePhoto}
              />
            </div>

            {/* Details on the right */}
            <div className={styles.infoContainer}>
              <div className={styles.nameAndRole}>
                <h3 className={styles.employeeName}>Олена Ринка</h3>
                <p className={styles.employeeRole}>Експерт з нерухомості</p>
              </div>

              <div className={styles.line17}></div>

              {/* Additional info blocks */}
              <div className={styles.additionalInfo}>
                <div className={styles.infoSection}>
                  <h4 className={styles.infoTitle}>Досвід</h4>
                  <p className={styles.infoText}>10 років</p>
                </div>

                <div className={styles.infoSection}>
                  <h4 className={styles.infoTitle}>Профіль</h4>
                  <p className={styles.infoText}>Продаж</p>
                </div>

                <div className={styles.infoSection}>
                  <h4 className={styles.infoTitle}>Про себе</h4>
                  <p className={styles.infoText}>Це допомагає намітити візуальні елементи в документ або презентацію, наприклад, друкарня, шрифт, або макет.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.coworking}>
        <h3 className={styles.callToAction}>Бажаєте отримати консультацію?</h3>
        <div className={styles.frame89}>
          <div className={styles.frame88}>
            <div className={styles.optionRow}>
              <div className={styles.frame87}>
                <div className={styles.line16}></div>
                <div className={styles.frame86}>
                  <p className={styles.optionText}>Продавцям/Орендодавцям</p>
                  <img src={arrowRight.src} alt="Стрілка вправо" className={styles.arrowIcon} />
                </div>
              </div>
            </div>
            <div className={styles.optionRow}>
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
};

export default EmployeePage;