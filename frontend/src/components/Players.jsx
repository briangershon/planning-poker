import React from 'react';
import styles from './Players.module.css';
import { TShirt } from './TShirt';

function Players({ you, players, playersPresent, showCards }) {
  return (
    <>
      <div>
        <ul className={styles.ul}>
          <li key={you.name} className={styles.li}>
            {you.vote ? (
              <TShirt
                name={you.name}
                vote={you.vote}
                avatarUrl={you.avatarUrl}
              />
            ) : (
              <TShirt
                name={you.name}
                vote={you.vote}
                avatarUrl={you.avatarUrl}
                hidden={true}
              />
            )}
          </li>
          {players.map((p) => {
            return (
              <li key={p.name} className={styles.li}>
                {showCards ? (
                  <TShirt name={p.name} vote={p.vote} avatarUrl={p.avatarUrl} />
                ) : (
                  <TShirt
                    name={p.name}
                    vote={p.vote}
                    avatarUrl={p.avatarUrl}
                    hidden={true}
                  />
                )}
              </li>
            );
          })}
          {playersPresent.map((p) => {
            return (
              <li key={p.name} className={styles.li}>
                <TShirt
                  name={p.name}
                  vote={p.vote}
                  avatarUrl={p.avatarUrl}
                  hidden={true}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export default Players;
