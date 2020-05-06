import { JottoAgent } from "./JottoAgent";

/** agent that always picks the same secret word and guess, for testing */
export class TestAgent implements JottoAgent {
  private secretWord: string;
  private guessWord: string;

  public constructor(secretWord = "abets", guessWord = "abhor") {
    this.secretWord = secretWord;
    this.guessWord = guessWord;
  }

  public setUp(): Promise<string> {
    return Promise.resolve(this.secretWord);
  }

  public processResults(): void {
    // we don't care about results
  }

  public getGuess(): Promise<string> {
    return new Promise((resolve) => resolve(this.guessWord));
  }

  public getSecretWord(): string {
    return this.secretWord;
  }
}
