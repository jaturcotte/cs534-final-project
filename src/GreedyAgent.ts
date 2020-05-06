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
  private epsilon: number;
  private L: number;

  public constructor() {
    this.secretWord = "";
    this.words = [];
    this.h = [];
    this.L = 5;
    this.epsilon = 1;
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
      this.epsilon *= 0.7;
      console.log(this.words.length);
      return;
    }
  }

  private pickRandomWord(): string {
    return this.words[Math.floor(Math.random() * this.words.length)];
  }

  public getGuess(): Promise<string> {
    if (Math.random() < this.epsilon) {
      return new Promise((resolve) => resolve(this.pickRandomWord()));
    } else {
      return new Promise((resolve) => resolve(this.guesserGBR()));
    }
  }

  private guesserGBR(): string {
    let maxN = 0;
    let bestWords: string[] = [];
    const startTime = new Date().valueOf();
    for (const w of this.words) {
      if (new Date().valueOf() - startTime >= 2000) break;
      const n = this.ExpNumElims(w);
      if (n > maxN) {
        bestWords = [w];
        maxN = n;
      } else if (n === maxN) {
        bestWords.push(w);
      }
    }
    return bestWords[Math.floor(Math.random() * bestWords.length)];
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
    const A: number[] = new Array(this.L + 1).fill(0);
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
