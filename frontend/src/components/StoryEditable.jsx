import React, { useEffect, useState } from 'react';
import styles from './StoryEditable.module.css';

export function StoryEditable({ value, onBlur, disabled, onInput }) {
  const [textValue, setTextValue] = useState('');
  const disabledClass = disabled ? styles.disabled : '';

  useEffect(() => {
    setTextValue(value);
  }, [value]);

  function onChange(evt) {
    setTextValue(evt.target.value);
  }

  return (
    <textarea
      className={`${styles.editable} ${disabledClass}`}
      onBlur={onBlur}
      onInput={onInput}
      value={textValue}
      onChange={onChange}
      rows="2"
      disabled={disabled}
      placeholder="Please add a story"
    />
  );
}
