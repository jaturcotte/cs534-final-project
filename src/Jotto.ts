import { JottoAgent } from "./JottoAgent";
import { DictionaryManager } from "./DictionaryManager";
import { WORD_BANK_PATH } from "./main";
import { GuessResult } from "./GuessResult";

export const NOT_READY_MESSAGE =
  "Jotto game not ready yet!" +
  " Make sure to call startUp() and wait for it to resolve.";

/** This class manages the rules for a game of Jotto */
export class Jotto {
  private p1: JottoAgent;
  private p2: JottoAgent;
  private p1Secret: string;
  private p2Secret: string;
  private dictionaryManager: DictionaryManager;
  private ready = false;

  public constructor(p1: JottoAgent, p2: JottoAgent) {
    this.p1 = p1;
    this.p2 = p2;
    this.p1Secret = this.p1.getSecretWord();
    this.p2Secret = this.p2.getSecretWord();
    this.dictionaryManager = new DictionaryManager();
    this.dictionaryManager.addWordsFromFile(WORD_BANK_PATH).then(() => {
      this.ready = true;
    });
  }

  /**
   * Runs the game until someone wins or 1000 turns have passed, then returns
   * the winner (or null if time ran out) and the number of turns it took
   */
  public async startGame(): Promise<{
    winner: JottoAgent | null;
    turns: number;
  }> {
    if (!this.ready) throw new Error(NOT_READY_MESSAGE);
    let turnCounter = 0;
    while (turnCounter < 1000) {
      turnCounter++;
      let result = await this.oneTurn(this.p1, this.p2Secret);
      this.p1.processResults(result);
      if (result.won()) return { winner: this.p1, turns: turnCounter };
      result = await this.oneTurn(this.p2, this.p1Secret);
      this.p2.processResults(result);
      if (result.won()) return { winner: this.p2, turns: turnCounter };
    }
    return { winner: null, turns: turnCounter };
  }

  private async oneTurn(
    activePlayer: JottoAgent,
    secret: string
  ): Promise<GuessResult> {
    const guess = await activePlayer.getGuess();
    if (!this.dictionaryManager.validate(guess)) {
      throw new Error("Illegal word '" + guess + "'");
    }
    if (guess === secret) return new GuessResult(guess, true, 5);

    let numCorrect = 0;
    for (const s of guess) {
      if (s !== undefined && secret.includes(s)) numCorrect++;
    }
    return new GuessResult(guess, false, numCorrect);
  }
}
