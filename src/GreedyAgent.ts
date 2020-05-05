import { readFile } from "fs";
import { GuessResult } from "./GuessResult";
import { JottoAgent } from "./JottoAgent";
import { WORD_BANK_PATH } from "./main";

/** a Jotto agent that makes random guesses, as a baseline */
export class GreedyAgent implements JottoAgent {
  private secretWord: string;
  private words: string[];
  private h: number[]; //probability word is selected from dictionary
  private S: number[]; //bit vector
  private D: number; //length of dictionary or word list
  private flag: boolean;

  public constructor() {
    this.secretWord = "";
    this.words = [];
    this.h = [];
    this.S = [];
    this.D = 0;
    this.flag = true;
  }

  public setUp(): Promise<string> {
    return new Promise((resolve) => {
      readFile(WORD_BANK_PATH, (err, data) => {
        if (err) throw err;
        this.words = data
          .toString()
          .split(/\s+/g)
          .filter((x) => x.length === 5);
        this.secretWord = this.pickRandomWord();
        this.D = this.words.length;
        this.h = new Array(this.D).fill(1 / this.D);
        this.S = new Array(this.D).fill(1);
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
    if (this.flag) {
      this.flag = false;
      return new Promise((resolve) => resolve(this.pickRandomWord()));
    }
    else {
      return new Promise((resolve) => resolve(this.guesserGBR()));
    }
  }

  private guesserGBR(): string {
    //console.log(this.S.reduce((a, b) => a + b, 0));
    let maxN = 0;
    let guessWord = "";
    for (let i = 0; i <= this.D; i++) {
      let n = this.ExpNumElims(this.words[i]);
      if (n > maxN) {
        guessWord = this.words[i];
        maxN = n;
      }
    }
    return guessWord;
  }

  private ExpNumElims(word: string): number {
    let A = this.AnswerProbs(word);
    let n = 0;
    for (let j = 0; j < 5; j++) {
      n += A[j] * this.NumElims(word, j);
    }
    return n;
  }

  private AnswerProbs(word: string): number[] {
    let A = new Array(5).fill(0);
    for (let i = 0; i < this.D; i++) {
      if (this.S[i] == 1) {
        let k = this.NumCommLetts(word, this.words[i]);
        A[k] += this.h[i];
      }
    }
    let sum = A.reduce((a, b) => a + b, 0);
    for (let j = 0; j < 5; j++) {
      A[j] /= sum;
    }
    return A; //needs to be 5 elements
  }

  private NumElims(word: string, j: number): number {
    let counter = 0;
    for(let k = 0; k < this.D; k++) {
      if (this.S[k] === 1 && this.NumCommLetts(word, this.words[k]) !== j) {
        counter++;
      }
    }
    return counter;
  }

  private NumCommLetts(word1: string, word2: string): number {
    let counter = 0;
    for (let m = 0; m < 5; m++) {
      let c1 = word1.charAt(m);
      for (let n = 0; n < 5; n++) {
        let c2 = word2.charAt(n);
        if (c1 == c2) {
          counter++;
        }
      }
    }
    return counter;
  }

}
