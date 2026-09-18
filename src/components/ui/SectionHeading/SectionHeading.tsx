// src/components/ui/SectionHeading/SectionHeading.tsx

import styles from "./styles.module.scss";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  light?: boolean;
};

export default function SectionHeading({ eyebrow, title, description, light = false }: SectionHeadingProps) {
  return (
    <div className={`${styles.heading} ${light ? styles.light : ""}`}>
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}
