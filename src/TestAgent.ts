import { JottoAgent } from "./JottoAgent";

/** agent that always picks the same secret word and guess, for testing */
export class TestAgent implements JottoAgent {
  private secretWord: string;

  public constructor() {
    this.secretWord = "abets";
  }

  public setUp(): Promise<string> {
    return Promise.resolve(this.secretWord);
  }

  public processResults(): void {
    // we don't care about results
  }

  public getGuess(): Promise<string> {
    return new Promise((resolve) => resolve("abhor"));
  }

  public getSecretWord(): string {
    return this.secretWord;
  }
}
