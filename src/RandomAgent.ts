import { JottoAgent } from "./JottoAgent";
import { DictionaryManager } from "./DictionaryManager";
import { readFileSync } from "fs";
import { WORD_BANK_PATH } from "./main";
import { GuessResult } from './GuessResult';

/** a Jotto agent that makes random guesses, as a baseline */
export class RandomAgent implements JottoAgent {
  private secretWord: string;
  private words: string[];

  public constructor() {
    this.words = readFileSync(WORD_BANK_PATH)
      .toString()
      .split("\n")
      .filter((x) => x.length == 5);
    this.secretWord = this.pickRandomWord();
  }

  processResults(gr: GuessResult): void {
    if (!gr.won()) {
      // we only care about the results if we won
      return;
    }
  }
  
  private pickRandomWord(): string {
    return this.words[Math.floor(Math.random() * this.words.length)];
  }

  public getGuess(): string {
    return this.pickRandomWord();
  }

  public getSecretWord(): string {
    return this.secretWord;
  }
}
