import { FileManager } from "../src/FileManager";
import { Jotto, GLOBALS } from "../src/Jotto";
import { GreedyAgent } from "../src/GreedyAgent";
import { WebAgent } from "./WebAgent";
import { DictionaryManager } from "../src/DictionaryManager";

// Don't use HumanAgent here!

(async (): Promise<void> => {
  FileManager.WORD_BANK_PATH = "wordbank.txt";
  FileManager.H_PATH = "imdb-frequencies.txt";

  // get string from server instead of filesystem
  FileManager.getText = (path: string): Promise<string> => {
    return new Promise((resolve) => {
      fetch(path)
        .then((response) => response.text())
        .then(resolve);
    });
  };

  const dm = new DictionaryManager();
  await dm.addWordsFromFile();
  const dice = Math.random();
  let h = {};
  if (dice < 0.5) h = await FileManager.generateH(FileManager.H_PATH);
  const p1 = new WebAgent(dm);
  const p2 = new GreedyAgent(h);
  const j = new Jotto(p1, p2, dm);
  await j.setUp();
  const val = await j.startGame();
  if (val.winner === null) {
    p1.output("The game ended without a winner after 1000 turns");
  } else if (val.winner === p1) {
    p1.output(`Congratulations! It took ${val.turns} turns for you to win`);
    GLOBALS.out = -1 * val.turns + ", " + GLOBALS.out;
  } else {
    p1.output(`I win! And it only took me ${val.turns} turns`);
    p1.output(`My secret word was <b>${val.winnersWord}</b>`);
    GLOBALS.out = val.turns + ", " + GLOBALS.out;
  }
  fetch("/jotto", {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      agent: dice < 0.5 ? "HGreedy" : "UniformGreedy",
      results: GLOBALS.out + "\n",
    }),
  }).then((response) => {
    console.log(response);
    document.getElementById("input")?.remove();
    const b = document.getElementById("submit-button") as HTMLButtonElement;
    if (b) b.innerText = "Play again?";
    b.disabled = false;
    return;
  });
})();
