import React from "react";
import AboutUsSection from "./AboutUsSection/AboutUsSection";
import TeamSection from "./TeamSection/TeamSection";
import OurValues from "@/components/Principles";
import styles from "./team.module.css";
import OurTeamSection from "./OurTeamSection/OurTeamSection";
import AllTeamSection from "./AllTeamSection/AllTeamSection";

const TeamPage: React.FC = () => {
  return (
    <>
      <div className={styles.mainDiv}>
        <AboutUsSection />
        <TeamSection />
        <div className={styles.ovalContainer}>
          <div className={styles.ovalEffect}></div>
          <OurValues />
        </div>
        <OurTeamSection />
        <div className={styles.ovalContainer2}>
          <div className={styles.ovalEffect2}></div>
          <AllTeamSection />
        </div>
      </div>
    </>
  );
};

export default TeamPage;
