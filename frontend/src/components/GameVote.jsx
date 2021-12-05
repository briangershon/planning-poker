import React from 'react';
import styles from './GameVote.module.css';

export function GameVote({ sendVote, currentVote }) {
  return (
    <div>
      <ul className={styles.vote}>
        <li>
          <button
            onClick={() => sendVote('XS')}
            disabled={currentVote === 'XS'}
          >
            XS
          </button>
        </li>
        <li>
          <button onClick={() => sendVote('S')} disabled={currentVote === 'S'}>
            S
          </button>
        </li>
        <li>
          <button onClick={() => sendVote('M')} disabled={currentVote === 'M'}>
            M
          </button>
        </li>
        <li>
          <button onClick={() => sendVote('L')} disabled={currentVote === 'L'}>
            L
          </button>
        </li>
        <li>
          <button
            onClick={() => sendVote('XL')}
            disabled={currentVote === 'XL'}
          >
            XL
          </button>
        </li>
        <li>
          <button
            onClick={() => sendVote('XXL')}
            disabled={currentVote === 'XXL'}
          >
            XXL
          </button>
        </li>
        <li>
          <button onClick={() => sendVote('?')} disabled={currentVote === '?'}>
            ?
          </button>
        </li>
        <li>
          <button
            className={styles.removeButton}
            onClick={() => sendVote(null)}
            disabled={currentVote === null}
          >
            Remove
          </button>
        </li>
      </ul>
    </div>
  );
}
