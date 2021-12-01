import React from 'react';
import styles from './StoryEditable.module.css';

export function StoryEditable({ children, onBlur, disabled, onInput }) {
  const disabledClass = disabled ? styles.disabled : '';
  return (
    <div
      className={`${styles.editable} ${disabledClass}`}
      contentEditable={!disabled}
      suppressContentEditableWarning={true}
      onBlur={onBlur}
      onInput={onInput}
      dangerouslySetInnerHTML={{ __html: children }}
    ></div>
  );
}
