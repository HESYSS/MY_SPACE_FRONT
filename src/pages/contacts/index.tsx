import React, { memo } from "react";
import Image from "next/image";
import styles from "./contacts.module.css";
import { useTranslation } from "react-i18next";
import { useModal } from '../../hooks/useModal'; 
import Link from "next/link";

import youtubeIcon from "../../../public/icons/youtube.svg";
import instagramIcon from "../../../public/icons/instagram.svg";
import arrowRight from "../../../public/icons/line.svg";
import star from "../../../public/icons/star.svg";

const ContactsPage: React.FC = () => {
  const { t } = useTranslation("common");
  const { openModal } = useModal();

  return (
    <div className={styles.containerWithOval}>
      <div className={styles.glowingOval}></div>

      <div className={styles.titleArea}>
        <div className={styles.titleLine}></div>
        <h2 className={styles.readMoreTitle}>{t('contactsTitle')}</h2>
      </div>

      <div className={styles.contactsBlockWrapper}>
        <div className={styles.contactsBlock}>
          <div className={styles.info}>
            <div className={styles.contactsText}>
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
                    <a
                      href="https://www.youtube.com/@MySpace-kyiv"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                    >
                      <Image
                        src={youtubeIcon}
                        alt="YouTube"
                        width={22}
                        height={16}
                      />
                      <p className={styles.socialText}>YouTube</p>
                    </a>
                    <a
                      href="https://www.instagram.com/myspace.kyiv"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                    >
                      <Image
                        src={instagramIcon}
                        alt="Instagram"
                        width={22}
                        height={22}
                      />
                      <p className={styles.socialText}>Instagram</p>
                    </a>
                  </div>
                </div>
              </div>

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
                  <a href="tel:+380687777337" className={styles.contactInfo}>+38 068 777 73 37</a>
                </div>
              </div>

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

            <div className={styles.bottomRow}>
              <div className={styles.contactTextSection}>
                <h4 className={styles.contactTitle}>{t('connectionTitle')}</h4>
                <p className={styles.contactInfoSmall}>
                 {/* {t('connectionText')}*/}
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

      <div className={styles.coworking}>
        <h3 className={styles.callToAction}>{t('consultationCallToAction')}</h3>
        <div className={styles.frame89}>
          <div className={styles.frame88}>
            <div
              className={styles.optionRow}
              onClick={() => openModal('forSellers')}
            >
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
            <div
              className={styles.optionRow}
              onClick={() => openModal('forBuyers')}
            >
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

export default memo(ContactsPage);
