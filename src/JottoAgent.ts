import { GuessResult } from "./GuessResult";

export interface JottoAgent {
  /** get the next word being guessed */
  getGuess(): string;

  /** process the results of a guess */
  processResults(gr: GuessResult): void;

  /** returns the agent's secret word */
  getSecretWord(): string;
}
