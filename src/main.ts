import { DictionaryManager } from "./DictionaryManager";
import { FileManager } from "./FileManager";
import { GreedyAgent } from "./GreedyAgent";
import { Jotto } from "./Jotto";
import { RandomAgent } from "./RandomAgent";

export const GLOBALS = {
  out: "",
};

(async function main(): Promise<void> {
  GLOBALS.out = "";
  const dm = new DictionaryManager();
  await dm.addWordsFromFile();
  const h = await FileManager.generateH(FileManager.H_PATH);
  const p1 = new GreedyAgent();
  const p2 = new RandomAgent(h);
  const j = new Jotto(p1, p2, dm);
  await j.setUp();
  const val = await j.startGame();
  if (val.winner === null) {
    GLOBALS.out = -1 + ", " + GLOBALS.out;
    console.log("Game ended without a winner after 1000 turns");
  } else if (val.winner === p1) {
    GLOBALS.out = val.turns + ", " + GLOBALS.out;
    console.log("P1 wins after " + val.turns + " turns");
  } else {
    GLOBALS.out = -1 + ", " + GLOBALS.out;
    console.log("P2 wins after " + val.turns + " turns");
  }
  console.log(GLOBALS.out);
  process.exit(0);
})();
