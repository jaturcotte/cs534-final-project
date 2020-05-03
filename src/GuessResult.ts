export class GuessResult {
  private isWinningGuess: boolean;
  private numCorrect: number;

  public constructor(isWinningGuess: boolean, numCorrect: number) {
    this.isWinningGuess = isWinningGuess;
    this.numCorrect = numCorrect;
  }

  /** whether the guess is the winning word */
  public won(): boolean {
    return this.isWinningGuess;
  }

  /** the number of letters the guess shares with the correct word */
  public correctLetters(): number {
    return this.numCorrect;
  }
}
