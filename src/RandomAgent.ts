import { JottoAgent } from "./JottoAgent";

/** a Jotto agent that makes random guesses, as a baseline */
export class RandomAgent implements JottoAgent {
  /** results of past guesses as <word, lettersCorrect> */
  private knownResults: Map<string, number>;

  public constructor() {
    this.knownResults = new Map<string, number>();
    // TODO implement
  }
  public guess(word: string): import("./GuessResult").GuessResult {
    // TODO implement
    throw new Error("Method not implemented.");
  }
  public setSecretWord(word: string): void {
    // TODO implement
    throw new Error("Method not implemented.");
  }
}
