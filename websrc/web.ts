import { FileManager } from "../src/FileManager";
import { Jotto } from "../src/Jotto";
import { GreedyAgent } from "../src/GreedyAgent";
import { WebAgent } from "./WebAgent";
import { DictionaryManager } from "../src/DictionaryManager";

// Don't use HumanAgent here!

(async (): Promise<void> => {
  // get string from server instead of filesystem
  FileManager.getText = (path: string): Promise<string> => {
    return new Promise((resolve) => {
      fetch(path)
        .then((response) => response.text())
        .then(resolve);
    });
  };

  FileManager.WORD_BANK_PATH = "wordbank.txt";
  FileManager.H_PATH = "imdb-frequencies.txt";

  const dm = new DictionaryManager();
  await dm.addWordsFromFile();
  const h = await FileManager.generateH(FileManager.H_PATH);
  const p1 = new WebAgent(dm);
  const p2 = new GreedyAgent(h);
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
