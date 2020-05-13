import { JottoAgent } from "./JottoAgent";
import { DictionaryManager } from "./DictionaryManager";
import { GuessResult } from "./GuessResult";

export const GLOBALS = {
  out: "",
};

/** This class manages the rules for a game of Jotto */
export class Jotto {
  private p1: JottoAgent;
  private p2: JottoAgent;
  private p1Secret: string;
  private p2Secret: string;
  private dictionaryManager: DictionaryManager;

  public constructor(p1: JottoAgent, p2: JottoAgent, dm: DictionaryManager) {
    this.p1 = p1;
    this.p2 = p2;
    this.p1Secret = "";
    this.p2Secret = "";
    this.dictionaryManager = dm;
  }

  public async setUp(): Promise<void> {
    if (this.dictionaryManager.numWords() === 0)
      await this.dictionaryManager.addWordsFromFile();
    this.p1Secret = await this.p1.setUp();
    this.p2Secret = await this.p2.setUp();
    GLOBALS.out += this.p2Secret + ", ";
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
    winnersWord: string | null;
  }> {
    if (!this.dictionaryManager.validate(this.p1Secret))
      throw new Error("p1 has illegal secret word: '" + this.p1Secret + "'");
    if (!this.dictionaryManager.validate(this.p2Secret))
      throw new Error("p2 has illegal secret word: '" + this.p2Secret + "'");

    let turnCounter = 0;
    while (turnCounter < 1000) {
      turnCounter++;
      let result = await this.oneTurn(this.p1, this.p2Secret);
      this.p1.processResults(result);
      if (result.won())
        return {
          winner: this.p1,
          turns: turnCounter,
          winnersWord: this.p1Secret,
        };
      result = await this.oneTurn(this.p2, this.p1Secret);
      this.p2.processResults(result);
      if (result.won())
        return {
          winner: this.p2,
          turns: turnCounter,
          winnersWord: this.p2Secret,
        };
    }
    return { winner: null, turns: turnCounter, winnersWord: null };
  }

  private oneTurn(
    activePlayer: JottoAgent,
    secret: string
  ): Promise<GuessResult> {
    return new Promise((resolve) => {
      activePlayer.getGuess().then((guess) => {
        const opponent = activePlayer === this.p1 ? this.p2 : this.p1;
        if (!this.dictionaryManager.validate(guess)) {
          throw new Error("Illegal word '" + guess + "'");
        }
        if (guess === secret) {
          resolve(new GuessResult(guess, true, 5));
        }

        const sl = DictionaryManager.sharedLetters(secret, guess);
        opponent.output(
          `I guess <b>${guess}</b>, which shares <b>${sl}</b> letter${
            sl !== 1 ? "s" : ""
          } with your secret word`
        );
        resolve(new GuessResult(guess, false, sl));
      });
    });
  }
}
