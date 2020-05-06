import { createReadStream } from "fs";
import { createInterface } from "readline";

export class DictionaryManager {
  private dict: { [key: string]: boolean };

  public constructor() {
    this.dict = {};
  }

  /** each line of the file should be a separate word */
  public async addWordsFromFile(wordBankPath: string): Promise<void> {
    const rl = createInterface({
      input: createReadStream(wordBankPath),
      crlfDelay: Infinity,
    });
    for await (const line of rl) {
      this.dict[line] = true;
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

  public static NumCommLetts(word1: string, word2: string): number {
    let counter = 0;
    for (let m = 0; m < word1.length; m++) {
      let c1 = word1.charAt(m);
      for (let n = 0; n < word2.length; n++) {
        let c2 = word2.charAt(n);
        if (c1 == c2) {
          counter++;
        }
      }
    }
    return counter;
  }
}
