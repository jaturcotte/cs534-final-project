import { JottoAgent } from "./JottoAgent";
import { DictionaryManager } from "./DictionaryManager";
import { WORD_BANK_PATH } from "./main";

export const NOT_READY_MESSAGE =
  "Jotto game not ready yet!" +
  " Make sure to call startUp() and wait for it to resolve.";

/** This class manages the rules for a game of Jotto */
export class Jotto {
  private p1: JottoAgent;
  private p2: JottoAgent;
  private dictionaryManager: DictionaryManager;
  private ready = false;

  public constructor(p1: JottoAgent, p2: JottoAgent) {
    this.p1 = p1;
    this.p2 = p2;
    this.dictionaryManager = new DictionaryManager;
    this.dictionaryManager.addWordsFromFile(WORD_BANK_PATH).then(() => {
      this.ready = true;
    });
  }

  public startGame(): void {
    if (!this.ready) throw new Error(NOT_READY_MESSAGE);
  }
}
