import { readFile } from "fs";
import { GuessResult } from "./GuessResult";
import { JottoAgent } from "./JottoAgent";
import { WORD_BANK_PATH } from "./main";

/** a Jotto agent that makes random guesses, as a baseline */
export class RandomAgent implements JottoAgent {
  private secretWord: string;
  private words: string[];

  public constructor() {
    this.secretWord = "";
    this.words = [];
  }

  public setUp(): Promise<string> {
    return new Promise((resolve) => {
      readFile(WORD_BANK_PATH, (err, data) => {
        if (err) throw err;
        this.words = data
          .toString()
          .split("\n")
          .filter((x) => x.length === 5);
        this.secretWord = this.pickRandomWord();
        resolve(this.secretWord);
      });
    });
  }

  public processResults(gr: GuessResult): void {
    if (!gr.won()) {
      // we only care about the results if we won
      return;
    }
  }

  private pickRandomWord(): string {
    return this.words[Math.floor(Math.random() * this.words.length)];
  }

  public getGuess(): Promise<string> {
    return new Promise((resolve) => resolve(this.pickRandomWord()));
  }
}
