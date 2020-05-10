import { FileManager } from "./FileManager";
import { GuessResult } from "./GuessResult";
import { JottoAgent } from "./JottoAgent";

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
    return this.words[Math.floor(Math.random() * this.words.length)];
  }

  public getGuess(): Promise<string> {
    return new Promise((resolve) => resolve(this.pickRandomWord()));
  }
}
