// src/components/layout/AppLogo/AppLogo.tsx

import Image from "next/image";
import Link from "next/link";
import styles from "./styles.module.scss";

type AppLogoProps = {
  compact?: boolean;
};

export default function AppLogo({ compact = false }: AppLogoProps) {
  return (
    <Link href="#inicio" className={styles.logo} aria-label="Ir para o início">
      <span className={styles.mark}>
        <Image src="/images/brand/rick-pereira.png" alt="Símbolo RP" width={52} height={52} priority />
      </span>
      {!compact && (
        <span className={styles.text}>
          <strong>Rick Pereira</strong>
          <small>Sistemas &amp; Aplicativos</small>
        </span>
      )}
    </Link>
  );
}
