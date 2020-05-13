import { DictionaryManager } from "./DictionaryManager";
import { FileManager } from "./FileManager";
import { GuessResult } from "./GuessResult";
import { JottoAgent } from "./JottoAgent";
import { GLOBALS } from "./Jotto";

/** a Jotto agent that implements a greedy algorithm */
export class GreedyAgent implements JottoAgent {
  private secretWord: string;
  private words: string[];
  private h: Record<string, number> = {}; // frequency table
  private epsilon: number;
  private L: number;

  public constructor(h = {}) {
    this.secretWord = "";
    this.words = [];
    this.h = h;
    this.L = 5;
    this.epsilon = 1;
  }

  public setUp(): Promise<string> {
    return new Promise((resolve) => {
      FileManager.getWordsAsArray(FileManager.WORD_BANK_PATH).then((words) => {
        this.words = words;
        this.secretWord = this.pickRandomWord();
        if (Object.keys(this.h).length !== this.words.length) {
          for (const w of this.words) {
            this.h[w] = 1 / this.words.length;
          }
        }
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
            DictionaryManager.sharedLetters(gr.getWord(), w) === 0 &&
            !gr.isAnagram(w, gr.getWord())
          );
        });
      } else if (gr.correctLetters() < 5) {
        this.words = this.words.filter(function (w: string) {
          return (
            w !== gr.getWord() &&
            DictionaryManager.sharedLetters(gr.getWord(), w) >=
              gr.correctLetters() &&
            !gr.isAnagram(w, gr.getWord())
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
      this.epsilon = 0;
      GLOBALS.out += this.words.length + ", ";
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
    for (const w of this.words) {
      const k = DictionaryManager.sharedLetters(word, w);
      A[k] += this.h[w];
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

  public output: (message: string) => void = console.log;
}
