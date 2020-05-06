import { HumanAgent } from "./HumanAgent";
import { Jotto } from "./Jotto";
import { GreedyAgent } from "./GreedyAgent";

(function main(): void {
  console.log("main");
  const p1 = new HumanAgent();
  const p2 = new GreedyAgent();
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
