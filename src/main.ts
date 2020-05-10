import { DictionaryManager } from "./DictionaryManager";
import { FileManager } from "./FileManager";
import { GreedyAgent } from "./GreedyAgent";
import { Jotto } from "./Jotto";
import { HumanAgent } from "./HumanAgent";

(async function main(): Promise<void> {
  const dm = new DictionaryManager();
  await dm.addWordsFromFile();
  const h = await FileManager.generateH(FileManager.H_PATH);
  const p1 = new HumanAgent(dm);
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
  process.exit(0);
})();
