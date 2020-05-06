import { readFile } from "fs";
import { GuessResult } from "./GuessResult";
import { JottoAgent } from "./JottoAgent";
import { WORD_BANK_PATH } from "./constants";
import { DictionaryManager } from "./DictionaryManager";

/** a Jotto agent that implements a greedy algorithm */
export class GreedyAgent implements JottoAgent {
  private secretWord: string;
  private words: string[];
  private h: number[]; // probability word is selected from dictionary
  private flag: boolean;
  private L: number;

  public constructor() {
    this.secretWord = "";
    this.words = [];
    this.h = [];
    this.flag = true;
    this.L = 5;
  }

  public setUp(): Promise<string> {
    return new Promise((resolve) => {
      readFile(WORD_BANK_PATH, (err, data) => {
        if (err) throw err;
        this.words = data
          .toString()
          .split(/\s+/g)
          .filter((x) => x.length !== 0);
        this.secretWord = this.pickRandomWord();
        this.h = new Array(this.words.length).fill(1 / this.words.length);
        resolve(this.secretWord);
      });
    });
  }

  public processResults(gr: GuessResult): void {
    if (!gr.won()) {
      if (gr.correctLetters() === 0) {
        this.words = this.words.filter(function (w: string) {
          return (
            w !== gr.getWord() &&
            DictionaryManager.sharedLetters(gr.getWord(), w) === 0
          );
        });
      } else {
        this.words = this.words.filter(function (w: string) {
          return (
            w !== gr.getWord() &&
            DictionaryManager.sharedLetters(gr.getWord(), w) >=
              gr.correctLetters()
          );
        });
      }
      console.log(this.words.length);
      return;
    }
  }

  private pickRandomWord(): string {
    return this.words[Math.floor(Math.random() * this.words.length)];
  }

  public getGuess(): Promise<string> {
    if (this.flag) {
      this.flag = false;
      return new Promise((resolve) => resolve(this.pickRandomWord()));
    } else {
      return new Promise((resolve) => resolve(this.guesserGBR()));
    }
  }

  private guesserGBR(): string {
    let maxN = 0;
    let guessWord = "";
    for (const w of this.words) {
      const n = this.ExpNumElims(w);
      if (n > maxN) {
        guessWord = w;
        maxN = n;
      }
    }
    return guessWord;
  }

  private ExpNumElims(word: string): number {
    const A = this.AnswerProbs(word);
    let n = 0;
    for (let j = 0; j <= this.L; j++) {
      n += A[j] * this.NumElims(word, j);
    }
    return n;
  }

  private AnswerProbs(word: string): number[] {
    const A = new Array(this.L + 1).fill(0);
    for (let i = 0; i < this.words.length; i++) {
      const k = DictionaryManager.sharedLetters(word, this.words[i]);
      A[k] += this.h[i];
    }
    const sum = A.reduce((a, b) => a + b, 0);
    for (let j = 0; j <= this.L; j++) {
      A[j] /= sum;
    }
    return A; // needs to be 5 elements
  }

  private NumElims(word: string, j: number): number {
    let counter = 0;
    for (const w of this.words) {
      if (DictionaryManager.sharedLetters(word, w) !== j) {
        counter++;
      }
    }
    return counter;
  }
}
