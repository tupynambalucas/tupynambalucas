import type { ReactNode } from 'react';
import Translate from '@docusaurus/Translate';
import Link from '@docusaurus/Link';
import LogoSvg from '@tupynambalucas-studio/design/logos/logo-mark-positive.svg';
import styles from './styles.module.css';

export default function HeroSection(): ReactNode {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div>
            <div>
              <h1>
                <Translate id="homepage.hero.title" description="Main hero title on the homepage">
                  {'Technical Architecture\n'}
                </Translate>
                <br />
                <Translate id="homepage.hero.subtitle" description="Secondary hero title">
                  tupynambalucas.dev
                </Translate>
              </h1>
              <p>
                <Translate
                  id="homepage.hero.text.primary"
                  description="First line of the introductory paragraph"
                >
                  {
                    'High-performance, strictly-typed monorepo engineering for personal portfolio, stats, and automation.\n'
                  }
                </Translate>
                <br />
                <Translate
                  id="homepage.hero.text.secondary"
                  description="Second line of the introductory paragraph"
                >
                  Built with Fastify, React 19, and WebGPU for maximum efficiency and AI-native
                  development.
                </Translate>
              </p>
            </div>

            <Link to="/docs/intro">
              <Translate id="homepage.button.docs" description="Label for the documentation button">
                Explore Architecture
              </Translate>
            </Link>
          </div>
        </div>

        <div className={styles.logoContainer}>
          <LogoSvg className={styles.heroLogo} />
        </div>
      </div>
      <div className={styles.circleObject}></div>
    </section>
  );
}
