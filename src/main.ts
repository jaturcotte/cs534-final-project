import { Jotto } from "./Jotto";
import { GreedyAgent } from "./GreedyAgent";
import { HumanAgent } from "./HumanAgent";
import { DictionaryManager } from "./DictionaryManager";

(async function main(): Promise<void> {
  const dm = new DictionaryManager();
  await dm.addWordsFromFile();
  const p1 = new HumanAgent(dm);
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
  process.exit(0);
})();
