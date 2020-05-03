import { GuessResult } from "./GuessResult";

export type JottoAgent = {
  /** try to guess the opponent's word */
  guess(word: string): GuessResult;

  /** set your own secret word */
  setSecretWord(word: string): void;
};
