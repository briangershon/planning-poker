import React from 'react';
import styles from './GameVote.module.css';

export function GameVote({ sendVote }) {
  return (
    <div>
      <ul className={styles.vote}>
        <li>
          <button onClick={() => sendVote('XS')}>XS</button>
        </li>
        <li>
          <button onClick={() => sendVote('S')}>S</button>
        </li>
        <li>
          <button onClick={() => sendVote('M')}>M</button>
        </li>
        <li>
          <button onClick={() => sendVote('L')}>L</button>
        </li>
        <li>
          <button onClick={() => sendVote('XL')}>XL</button>
        </li>
        <li>
          <button onClick={() => sendVote('XXL')}>XXL</button>
        </li>
        <li>
          <button onClick={() => sendVote('?')}>?</button>
        </li>
        <li>
          <button onClick={() => sendVote(null)}>Clear</button>
        </li>
      </ul>
    </div>
  );
}
