import { JottoAgent } from "../src/JottoAgent";
import { DictionaryManager } from "../src/DictionaryManager";
import { GuessResult } from "../src/GuessResult";

export class WebAgent implements JottoAgent {
  private dictionaryManager: DictionaryManager;
  private secretWord: string;
  private form: HTMLFormElement;
  private inputBox: HTMLInputElement;
  private log: HTMLDivElement;
  private submitButton: HTMLButtonElement;
  private knownScores: { [key: string]: number } = {};

  public constructor(dm: DictionaryManager) {
    this.dictionaryManager = dm;
    this.secretWord = "";
    // set up HTML
    this.form = document.createElement("form");
    this.form.id = "input-form";
    this.inputBox = document.createElement("input");
    this.inputBox.type = "text";
    this.inputBox.id = "input";
    this.inputBox.placeholder = "Type here";
    this.inputBox.maxLength = 5;
    this.submitButton = document.createElement("button");
    this.submitButton.innerText = "Submit";
    this.submitButton.type = "submit";
    this.submitButton.id = "submit-button";
    this.submitButton.disabled = true;
    this.inputBox.addEventListener("input", () => {
      this.submitButton.disabled = this.inputBox.value.length !== 5;
    });
    this.form.appendChild(this.inputBox);
    this.form.appendChild(this.submitButton);
    document.body.appendChild(this.form);
    this.log = document.createElement("div");
    document.body.appendChild(this.log);
  }

  public setUp(): Promise<string> {
    return new Promise((resolve) => {
      this.output("Enter a secret 5-letter word, and I'll try to guess it");
      this.getNextWord().then((word) => {
        this.secretWord = word;
        resolve(word);
      });
    });
  }

  public getGuess(): Promise<string> {
    this.output("Try to guess my word");
    return this.getNextWord();
  }

  public processResults(gr: GuessResult): void {
    if (gr.won()) {
      this.output(`You're right, <b>${gr.getWord()}</b> was my word!`);
    } else {
      this.knownScores[gr.getWord()] = gr.correctLetters();
      this.output(
        `<b>${gr.getWord()}</b> has ` +
          `<b>${gr.correctLetters()}</b> letter` +
          (gr.correctLetters() !== 1 ? `s` : ``) +
          ` in common with my word`
      );
    }
  }

  public output(sentence: string): void {
    const p = document.createElement("p");
    p.innerHTML = sentence;
    this.log.appendChild(p);
  }

  private getNextWord(): Promise<string> {
    return new Promise((resolve) => {
      const listener = (ev: Event): void => {
        ev.preventDefault();
        if (this.inputBox === null) throw new Error("No input box");
        if (this.inputBox.value.length !== 5) return;
        if (!this.dictionaryManager.validate(this.inputBox.value)) {
          this.output(`<b>${this.inputBox.value}</b> isn't a real word!`);
          return;
        }
        this.form.removeEventListener("submit", listener);
        const w = this.inputBox.value;
        this.inputBox.value = "";
        this.submitButton.disabled = true;
        resolve(w);
      };
      this.form.addEventListener("submit", listener);
    });
  }
}
