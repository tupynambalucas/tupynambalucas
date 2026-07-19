import React, { type ReactNode } from 'react';
import Layout from '@theme/Layout';
import styles from './home/styles.module.css';
import LandingSection from './home/HeroSection';
import MonorepoSection from './home/MonorepoMap';
import FromSoilSection from './home/TechnicalFoundation';
import TupynambaSection from './home/ArchitectProfile';

export default function HomePage(): ReactNode {
  return (
    <Layout
      title="TupyDocs Documentation"
      description="Technical documentation for the high-performance, strictly-typed tupynambalucas.dev monorepo."
    >
      <main className={styles.homeMain}>
        <LandingSection />
        <MonorepoSection />
        <FromSoilSection />
        <TupynambaSection />
      </main>
    </Layout>
  );
}
