import { FileManager } from "./FileManager";
import { GuessResult } from "./GuessResult";
import { JottoAgent } from "./JottoAgent";

/** a Jotto agent that makes random guesses, as a baseline */
export class RandomAgent implements JottoAgent {
  private secretWord: string;
  private words: string[];
  private h: { [key: string]: number };

  public constructor(h: { [key: string]: number } = {}) {
    this.secretWord = "";
    this.words = [];
    this.h = h;
  }

  public setUp(): Promise<string> {
    return new Promise((resolve) => {
      FileManager.getWordsAsArray(FileManager.WORD_BANK_PATH).then((words) => {
        this.words = words;
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
    if (this.h == {}) {
      return this.words[Math.floor(Math.random() * this.words.length)];
    } else {
      const r = Math.random();
      let total = 0;
      for (const w in this.h) {
        total += this.h[w];
        if (r < total) return w;
      }
      throw new Error("Didn't pick a word");
    }
  }

  public getGuess(): Promise<string> {
    return new Promise((resolve) => resolve(this.pickRandomWord()));
  }

  public output: (message: string) => void = console.log;
}
