import { JottoAgent } from "./JottoAgent";
import { DictionaryManager } from "./DictionaryManager";
import { WORD_BANK_PATH } from "./main";
import { GuessResult } from "./GuessResult";

/** This class manages the rules for a game of Jotto */
export class Jotto {
  private p1: JottoAgent;
  private p2: JottoAgent;
  private p1Secret: string;
  private p2Secret: string;
  private dictionaryManager: DictionaryManager;

  public constructor(p1: JottoAgent, p2: JottoAgent) {
    this.p1 = p1;
    this.p2 = p2;
    this.p1Secret = "";
    this.p2Secret = "";
    this.dictionaryManager = new DictionaryManager();
  }

  public async setUp(): Promise<void> {
    await this.dictionaryManager.addWordsFromFile(WORD_BANK_PATH);
    this.p1Secret = await this.p1.setUp();
    this.p2Secret = await this.p2.setUp();
    return;
  }

  /** checks whether a word is legal */
  public validate(word: string): boolean {
    return this.dictionaryManager.validate(word);
  }

  /**
   * Runs the game until someone wins or 1000 turns have passed, then returns
   * the winner (or null if time ran out) and the number of turns it took
   */
  public async startGame(): Promise<{
    winner: JottoAgent | null;
    turns: number;
  }> {
    if (!this.dictionaryManager.validate(this.p1Secret))
      throw new Error("p1 has illegal secret word: '" + this.p1Secret + "'");
    if (!this.dictionaryManager.validate(this.p2Secret))
      throw new Error("p2 has illegal secret word: '" + this.p2Secret + "'");

    let turnCounter = 0;
    while (turnCounter < 1000) {
      turnCounter++;
      console.log("Start p1's turn");
      let result = await this.oneTurn(this.p1, this.p2Secret);
      this.p1.processResults(result);
      if (result.won()) return { winner: this.p1, turns: turnCounter };
      console.log("Start p2's turn");
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
    const playerName = activePlayer === this.p1 ? "p1" : "p2";
    console.log(playerName + " guesses '" + guess + "'");
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
