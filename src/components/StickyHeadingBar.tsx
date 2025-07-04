import React from 'react';
import styles from './StickyHeadingBar.module.css';

interface StickyHeadingBarProps {
  title: string;
}

const StickyHeadingBar: React.FC<StickyHeadingBarProps> = ({ title }) => {
  return (
    <div className={styles.stickyHeadingBar}>
      <span className={styles.stickyHeadingText}>{title}</span>
    </div>
  );
};

export default StickyHeadingBar;
