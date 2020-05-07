import { FileManager } from "../src/FileManager";
import { Jotto } from "../src/Jotto";
import { RandomAgent } from "../src/RandomAgent";

// Don't use HumanAgent here!

((): void => {
  FileManager.getWordsAsArray = (): Promise<string[]> => {
    return new Promise((resolve) => {
      fetch("wordbank.txt")
        .then((response) => response.text())
        .then((text) => {
          resolve(text.split(/\s+/g).filter((x) => x.length !== 0));
        });
    });
  };

  const p1 = new RandomAgent();
  const p2 = new RandomAgent();
  const j = new Jotto(p1, p2);
  j.setUp()
    .then(() => {
      return j.startGame();
    })
    .then((val) => {
      if (val.winner === null) {
        console.log("Game ended without a winner after 1000 turns");
      } else if (val.winner === p1) {
        console.log("P1 wins after " + val.turns + " turns");
      } else {
        console.log("P2 wins after " + val.turns + " turns");
      }
      return;
    })
    .catch((reason) => {
      console.error(reason);
    });
})();
