import { join } from "path";
import { HumanAgent } from "./HumanAgent";
import { Jotto } from "./Jotto";
import { RandomAgent } from "./RandomAgent";

export const WORD_BANK_PATH = join(__dirname, "..", "wordbank.txt");

(function main(): void {
  const p1 = new HumanAgent();
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
      process.exit(0);
    })
    .catch((reason) => {
      console.error(reason);
    });
})();
