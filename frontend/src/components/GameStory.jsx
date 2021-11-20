import React, { useState } from 'react';
import styles from './GameStory.module.css';

export function GameStory({ story, sendStoryUpdate }) {
  const [storyEditBuffer, setStoryEditBuffer] = useState('');
  const [isUpdatingStory, setUpdatingStory] = useState(false);

  async function updateStoryBuffer(event) {
    const newStory = event.target.value;
    setStoryEditBuffer(newStory);
  }

  function sendUpdate() {
    setUpdatingStory(true);
    sendStoryUpdate(storyEditBuffer);
    setStoryEditBuffer('');
    setUpdatingStory(false);
  }

  return (
    <div>
      <div className={styles.story}>
        <p>What story are you estimating?</p>

        {story ? (
          <div>
            Story description: <strong>{story}</strong>
          </div>
        ) : (
          <strong>Please add a story.</strong>
        )}
      </div>
      <div>
        Update story description:{' '}
        <input
          disabled={isUpdatingStory}
          value={storyEditBuffer}
          onChange={updateStoryBuffer}
        />{' '}
        <button disabled={isUpdatingStory} onClick={sendUpdate}>
          Update
        </button>
      </div>
    </div>
  );
}
