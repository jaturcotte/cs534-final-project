export class GuessResult {
  private isWinningGuess: boolean;
  private numCorrect: number;
  private word: string;

  public constructor(
    word: string,
    isWinningGuess: boolean,
    numCorrect: number
  ) {
    this.word = word;
    this.isWinningGuess = isWinningGuess;
    this.numCorrect = numCorrect;
  }

  /** whether the guess is the winning word */
  public won(): boolean {
    return this.isWinningGuess;
  }

  /** returns the word that was guessed */
  public getWord(): string {
    return this.word;
  }

  /** the number of letters the guess shares with the correct word */
  public correctLetters(): number {
    return this.numCorrect;
  }

  public isAnagram(word1: string, word2: string): boolean {
    const word1Array = word1.split("").sort().join(""),
      word2Array = word2.split("").sort().join("");
    return word1Array === word2Array;
  }
}
