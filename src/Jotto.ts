import { createReadStream } from "fs";
import { join } from "path";
import { createInterface } from "readline";
import { JottoAgent } from "./JottoAgent";

const WORD_BANK_PATH = join(__dirname, "../wordbank.txt");
export const NOT_READY_MESSAGE =
  "Jotto game not ready yet!" +
  " Make sure to call startUp() and wait for it to resolve.";

/** This class manages the rules for a game of Jotto */
export class Jotto {
  private p1: JottoAgent;
  private p2: JottoAgent;
  private dictionary: { [key: string]: boolean } = {};
  private ready = false;

  public constructor(p1: JottoAgent, p2: JottoAgent) {
    this.p1 = p1;
    this.p2 = p2;
  }

  /** set up the Jotto game, and resolve when ready to begin */
  public async startUp(): Promise<void> {
    await this.buildDict(WORD_BANK_PATH);
    this.ready = true;
  }

  /** reads the word bank into a JS object for efficient lookup */
  private async buildDict(src: string): Promise<void> {
    this.dictionary = {};
    const rl = createInterface({
      input: createReadStream(src),
      crlfDelay: Infinity,
    });
    for await (const line of rl) {
      this.dictionary[line] = true;
    }
    return;
  }

  /** get number of valid words in the dictionary */
  public numValidWords(): number {
    if (!this.ready) throw new Error(NOT_READY_MESSAGE);
    return Object.keys(this.dictionary).length;
  }

  /** checks whether a word is a valid five-letter isogram */
  public validate(word: string): boolean {
    if (!this.ready) throw new Error(NOT_READY_MESSAGE);
    if (word.length !== 5) return false;
    else return this.dictionary[word] !== undefined;
  }

  public startGame(): void {
    if (!this.ready) throw new Error(NOT_READY_MESSAGE);
  }
}
