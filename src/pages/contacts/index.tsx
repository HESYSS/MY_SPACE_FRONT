import React from "react";
import Image from "next/image";
import styles from "./contacts.module.css";
import { useTranslation } from "react-i18next";

// Импорт изображений, если они нужны для контактов
import youtubeIcon from "../../../public/icons/youtube.svg";
import instagramIcon from "../../../public/icons/instagram.svg";
import arrowRight from "../../../public/icons/line.svg";
import star from "../../../public/icons/star.svg";

const ContactsPage: React.FC = () => {
  const { t } = useTranslation("common");

  return (
    <div className={styles.containerWithOval}>
      {/* Овал со свечением, который теперь позиционируется относительно containerWithOval */}
      <div className={styles.glowingOval}></div>

      {/* Title block */}
      <div className={styles.titleArea}>
        <div className={styles.titleLine}></div>
        <h2 className={styles.readMoreTitle}>{t('contactsTitle')}</h2>
      </div>

      {/* Contacts block wrapper */}
      <div className={styles.contactsBlockWrapper}>
        <div className={styles.contactsBlock}>
          <div className={styles.info}>
            <div className={styles.contactsText}>
              {/* Соціальні мережі */}
              <div className={styles.contactItem}>
                <div className={styles.contactIconContainer}>
                  <Image
                    src={star}
                    alt={t('starAlt')}
                    className={styles.starIcon}
                  />
                </div>
                <div className={styles.contactDetails}>
                  <h4 className={styles.contactTitle}>{t('socialNetworksTitle')}</h4>
                  <div className={styles.socialLinks}>
                    <div className={styles.socialLink}>
                      <Image
                        src={youtubeIcon}
                        alt="YouTube"
                        width={22}
                        height={16}
                      />
                      <p className={styles.socialText}>YouTube</p>
                    </div>
                    <div className={styles.socialLink}>
                      <Image
                        src={instagramIcon}
                        alt="Instagram"
                        width={22}
                        height={22}
                      />
                      <p className={styles.socialText}>Instagram</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Електронна пошта */}
              <div className={styles.contactItem}>
                <div className={styles.contactIconContainer}>
                  <Image
                    src={star}
                    alt={t('starAlt')}
                    className={styles.starIcon}
                  />
                </div>
                <div className={styles.contactDetails}>
                  <h4 className={styles.contactTitle}>{t('emailTitle')}</h4>
                  <p className={styles.contactInfo}>office@myspace.in.ua</p>
                </div>
              </div>

              {/* Номер телефону */}
              <div className={styles.contactItem}>
                <div className={styles.contactIconContainer}>
                  <Image
                    src={star}
                    alt={t('starAlt')}
                    className={styles.starIcon}
                  />
                </div>
                <div className={styles.contactDetails}>
                  <h4 className={styles.contactTitle}>{t('phoneNumberTitle')}</h4>
                  <p className={styles.contactInfo}>+38 068 777 73 37</p>
                </div>
              </div>

              {/* Адреса */}
              <div className={styles.contactItem}>
                <div className={styles.contactIconContainer}>
                  <Image
                    src={star}
                    alt={t('starAlt')}
                    className={styles.starIcon}
                  />
                </div>
                <div className={styles.contactDetails}>
                  <h4 className={styles.contactTitle}>{t('addressTitle')}</h4>
                  <p className={styles.contactInfo}>
                    {t('addressText')}
                  </p>
                </div>
              </div>
            </div>

            {/* Зв’язок та Години роботи */}
            <div className={styles.bottomRow}>
              <div className={styles.contactTextSection}>
                <h4 className={styles.contactTitle}>{t('connectionTitle')}</h4>
                <p className={styles.contactInfoSmall}>
                  {t('connectionText')}
                </p>
              </div>
              <div className={styles.workHours}>
                <h4 className={styles.contactTitle}>{t('workHoursTitle')}</h4>
                <div className={styles.line}></div>
                <div className={styles.hoursDetails}>
                  <p className={styles.workDay}>{t('workDays')}</p>
                  <p className={styles.workDay}>{t('weekend')}</p>
                  <p className={styles.workTime}>09:00-19:00</p>
                  <p className={styles.workTime}>{t('byAppointment')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coworking block */}
      <div className={styles.coworking}>
        <h3 className={styles.callToAction}>{t('consultationCallToAction')}</h3>
        <div className={styles.frame89}>
          <div className={styles.frame88}>
            <div className={styles.optionRow}>
              <div className={styles.frame87}>
                <div className={styles.line16}></div>
                <div className={styles.frame86}>
                  <p className={styles.optionText}>{t('forSellersLandlords')}</p>
                  <Image
                    src={arrowRight}
                    alt={t('arrowRightAlt')}
                    className={styles.arrowIcon}
                  />
                </div>
              </div>
            </div>
            <div className={styles.optionRow}>
              <div className={styles.frame85}>
                <div className={styles.line17}></div>
                <div className={styles.frame84}>
                  <p className={styles.optionText}>{t('forBuyersTenants')}</p>
                  <Image
                    src={arrowRight}
                    alt={t('arrowRightAlt')}
                    className={styles.arrowIcon}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactsPage;