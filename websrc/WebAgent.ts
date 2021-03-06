import { JottoAgent } from "../src/JottoAgent";
import { DictionaryManager } from "../src/DictionaryManager";
import { GuessResult } from "../src/GuessResult";

export class WebAgent implements JottoAgent {
  private dictionaryManager: DictionaryManager;
  private secretWord: string;
  private form: HTMLFormElement;
  private inputBox: HTMLInputElement;
  private log: HTMLDivElement;
  private previous: HTMLDivElement;
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
    this.log = document.createElement("div");
    this.log.id = "log";
    this.previous = document.createElement("div");
    this.previous.id = "previous";
    const main = document.getElementById("main-container");
    if (main === null) throw new Error("Main not found");
    const sideBar = document.createElement("div");
    sideBar.id = "side-bar";
    main.appendChild(this.log);
    this.form.appendChild(this.inputBox);
    this.form.appendChild(this.submitButton);
    main.appendChild(this.form);
    main.appendChild(sideBar);
  }

  public setUp(): Promise<string> {
    return new Promise((resolve) => {
      this.output("Enter a secret 5-letter word, and I'll try to guess it");
      this.getNextWord().then((word) => {
        this.secretWord = word;
        const sideBar = document.getElementById("side-bar");
        if (!sideBar) throw new Error("No side bar");
        const letterGrid = document.createElement("div");
        letterGrid.id = "letter-grid";
        sideBar.appendChild(letterGrid);
        for (const l of "abcdefghijklmnopqrstuvwxyz") {
          const d = document.createElement("div");
          d.classList.add("letter");
          d.innerText = l;
          d.addEventListener("click", () => {
            if (d.style.backgroundColor === "") {
              d.style.backgroundColor = "rgba(48, 102, 190, 1)";
              d.style.color = "white";
            } else if (d.style.backgroundColor === "rgb(48, 102, 190)") {
              d.style.backgroundColor = "gray";
              d.style.color = "black";
            } else {
              d.style.backgroundColor = "";
              d.style.color = "black";
            }
          });
          letterGrid.appendChild(d);
        }
        sideBar.insertAdjacentHTML(
          "beforeend",
          `<h3>Your Word:</h3> ` + `<span>${this.secretWord}</span>`
        );
        sideBar.appendChild(this.previous);
        this.updatePrevious();
        resolve(word);
      });
    });
  }

  public getGuess(): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.output("Try to guess my word");
        this.getNextWord().then(resolve);
      }, 300);
    });
  }

  public processResults(gr: GuessResult): void {
    if (gr.won()) {
      this.output(`You're right, <b>${gr.getWord()}</b> was my word!`);
    } else {
      this.knownScores[gr.getWord()] = gr.correctLetters();
      this.updatePrevious();
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
    p.style.opacity = "0";
    setTimeout(() => (p.style.opacity = "1"), 300);
    p.innerHTML = sentence;
    this.log.appendChild(p);
    this.log.scrollTo(0, this.log.scrollHeight);
  }

  private getNextWord(): Promise<string> {
    return new Promise((resolve) => {
      const listener = (ev: Event): void => {
        ev.preventDefault();
        if (this.inputBox === null) throw new Error("No input box");
        if (this.inputBox.value.length !== 5) return;
        const w = this.inputBox.value.toLowerCase();
        if (!this.dictionaryManager.validate(w)) {
          this.output(`<b>${this.inputBox.value}</b> isn't a real word!`);
          return;
        }
        this.form.removeEventListener("submit", listener);
        this.inputBox.value = "";
        this.submitButton.disabled = true;
        setTimeout(() => {
          resolve(w);
        }, 100);
      };
      this.form.addEventListener("submit", listener);
    });
  }

  private updatePrevious(): void {
    if (Object.keys(this.knownScores).length < 1) return;
    this.previous.innerHTML = `<h3>Known Scores:</h3>`;
    for (const k in this.knownScores) {
      const s = document.createElement("span");
      s.classList.add("known-score-row");
      const w = document.createElement("span");
      w.innerText = k;
      const l = document.createElement("span");
      l.innerText = "" + this.knownScores[k];
      s.appendChild(w);
      s.appendChild(l);
      this.previous.appendChild(s);
    }
    this.previous.scrollTo(0, this.previous.scrollHeight);
  }
}
