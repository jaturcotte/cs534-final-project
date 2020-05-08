import { FileManager } from "../src/FileManager";
import { Jotto } from "../src/Jotto";
import { GreedyAgent } from "../src/GreedyAgent";
import { WebAgent } from "./WebAgent";
import { DictionaryManager } from "../src/DictionaryManager";

// Don't use HumanAgent here!

(async (): Promise<void> => {
  // get word list from server instead of filesystem
  FileManager.getWordsAsArray = (): Promise<string[]> => {
    return new Promise((resolve) => {
      fetch("wordbank.txt")
        .then((response) => response.text())
        .then((text) => {
          resolve(text.split(/\s+/g).filter((x) => x.length !== 0));
        });
    });
  };

  const dm = new DictionaryManager();
  await dm.addWordsFromFile();
  const p1 = new WebAgent(dm);
  const p2 = new GreedyAgent();
  const j = new Jotto(p1, p2, dm);
  await j.setUp();
  const val = await j.startGame();
  if (val.winner === null) {
    console.log("Game ended without a winner after 1000 turns");
  } else if (val.winner === p1) {
    console.log("P1 wins after " + val.turns + " turns");
  } else {
    console.log("P2 wins after " + val.turns + " turns");
  }
  return;
})();
