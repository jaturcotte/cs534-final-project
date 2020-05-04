import { JottoAgent } from "./JottoAgent";
import { GuessResult } from "./GuessResult";
import { DictionaryManager } from "./DictionaryManager";
import { WORD_BANK_PATH } from "./main";

export class HumanAgent implements JottoAgent {
  private stdin: NodeJS.ReadStream;
  private secretWord: string;
  private dm: DictionaryManager;

  public constructor() {
    this.stdin = process.stdin;
    this.stdin.setEncoding("utf-8");
    this.secretWord = "";
    this.dm = new DictionaryManager();
  }

  public setUp(): Promise<string> {
    return new Promise((resolve) => {
      this.dm.addWordsFromFile(WORD_BANK_PATH).then(() => {
        console.log("Enter a 5 letter isogram as your secret word: ");
        const getInput = (data: Buffer): void => {
          const w = data.toString().replace(/\n/, "");
          if (this.dm.validate(w)) {
            this.secretWord = w;
            resolve(w);
          } else {
            console.log(`Invalid word: ${w}`);
            console.log("Enter a 5 letter isogram as your secret word: ");
            this.stdin.once("data", getInput);
          }
          return;
        };
        this.stdin.once("data", getInput);
      });
    });
  }

  public getGuess(): Promise<string> {
    return new Promise((resolve) => {
      console.log("\nEnter your guess of the opponent's word: ");
      const getInput = (data: Buffer): void => {
        const w = data.toString().replace(/\n/, "");
        if (this.dm.validate(w)) {
          resolve(w);
        } else {
          console.log(`Invalid word: ${w}`);
          console.log("Enter your guess of the opponent's word: ");
          this.stdin.once("data", getInput);
        }
        return;
      };
      this.stdin.once("data", getInput);
    });
  }

  public processResults(gr: GuessResult): void {
    if (gr.won()) {
      console.log("That's right, you win!");
    } else {
      console.log(
        `The word "${gr.getWord()}" shares ${gr.correctLetters()} letter` +
          (gr.correctLetters() !== 1 ? "s" : "") +
          ` with your opponent's secret word`
      );
    }
  }
}
