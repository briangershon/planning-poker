import React, { useState } from 'react';
import styles from './GameStory.module.css';
import sanitizeHtml from 'sanitize-html';
import { StoryEditable } from './StoryEditable';

export function GameStory({ story, sendStoryUpdate }) {
  const [isUpdatingStory, setUpdatingStory] = useState(false);
  const [isDirty, setDirty] = useState(false);

  function onBlur(evt) {
    const text = sanitizeHtml(evt.target.innerHTML, {
      allowedTags: [],
      allowedAttributes: {},
    });
    setUpdatingStory(true);
    sendStoryUpdate(text);
    setDirty(false);
    setUpdatingStory(false);
  }

  function onInput() {
    setDirty(true);
  }

  function sanitizedStory() {
    return sanitizeHtml(story, {
      allowedTags: [],
      allowedAttributes: {},
    });
  }

  return (
    <div>
      <div className={styles.story}>
        <p>What story are you estimating?</p>
        {!story && (
          <div className={styles.instructions}>
            <strong>Please add a story.</strong>
          </div>
        )}

        <StoryEditable
          onBlur={onBlur}
          onInput={onInput}
          disabled={isUpdatingStory}
        >
          {sanitizedStory()}
        </StoryEditable>

        <div className={styles.instructions}>
          {isDirty ? (
            <span className={styles.dirty}>
              <strong>Unsaved changes!</strong> Click outside of content area to
              save.
            </span>
          ) : (
            <span>Click to edit.</span>
          )}
        </div>
      </div>
    </div>
  );
}
