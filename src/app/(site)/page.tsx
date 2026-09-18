// src/app/(site)/page.tsx

import ContactCTA from "@/components/home/ContactCTA/ContactCTA";
import FeaturedProjects from "@/components/home/FeaturedProjects/FeaturedProjects";
import Hero from "@/components/home/Hero/Hero";
import Technologies from "@/components/home/Technologies/Technologies";
import styles from "./styles.module.scss";

export default function HomePage() {
  return (
    <div className={styles.page}>
      <Hero />
      <FeaturedProjects />
      <Technologies />
      <ContactCTA />
    </div>
  );
}
