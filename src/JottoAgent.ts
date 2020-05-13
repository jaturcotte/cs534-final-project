import { GuessResult } from "./GuessResult";

export interface JottoAgent {
  /**
   * returns a promise that resolves with the agent's secret word when
   * it's ready to start
   */
  setUp(): Promise<string>;

  /** get the next word being guessed */
  getGuess(): Promise<string>;

  /** process the results of a guess */
  processResults(gr: GuessResult): void;

  /** outputs information for a user to see */
  output(message: string): void;
}
