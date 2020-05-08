import { FileManager } from "./FileManager";

export class DictionaryManager {
  private dict: { [key: string]: boolean };

  public constructor() {
    this.dict = {};
  }

  /** each line of the file should be a separate word */
  public async addWordsFromFile(): Promise<void> {
    const words = await FileManager.getWordsAsArray();
    for (const w of words) {
      this.dict[w] = true;
    }
  }

  public numWords(): number {
    return Object.keys(this.dict).length;
  }

  public clear(): void {
    this.dict = {};
  }

  /** checks whether a word is in the dictionary */
  public validate(word: string): boolean {
    return this.dict[word] !== undefined;
  }

  /**
   * returns the number of letters in gword that match a unique letter in sword
   * @param sword the secret word we're trying to guess
   * @param gword the guess word
   */
  public static sharedLetters(sword: string, gword: string): number {
    let counter = 0;
    for (const letter of sword) {
      if (gword.includes(letter)) {
        counter++;
        gword = gword.replace(letter, "");
      }
    }
    return counter;
  }
}
