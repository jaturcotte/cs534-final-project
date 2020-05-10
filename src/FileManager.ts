import { readFile } from "fs";
import { join } from "path";
import { DictionaryManager } from "./DictionaryManager";

export const FileManager = {
  WORD_BANK_PATH: join(__dirname, "..", "manywords.txt"),
  H_PATH: join(__dirname, "..", "words.txt"),

  // get string from filesystem
  getText: (path: string): Promise<string> => {
    return new Promise((resolve) => {
      readFile(path, (err, data) => {
        if (err) throw err;
        resolve(data.toString());
      });
    });
  },

  getWordsAsArray: (): Promise<string[]> => {
    return new Promise((resolve) => {
      FileManager.getText(FileManager.WORD_BANK_PATH).then((text) => {
        resolve(text.split(/\s+/g).filter((x) => x.length !== 0));
      });
    });
  },

  generateH: (dm: DictionaryManager): Promise<Object> => {
    return new Promise((resolve) => {
      FileManager.getText(FileManager.H_PATH).then((text) => {
        const h: any = {};
        let sum = 0;
        text
          .split(/[^a-zA-Z]/)
          .map((s) => s.toLowerCase())
          .filter((s) => dm.validate(s))
          .concat(dm.getAllWords())
          .map((s) => {
            sum++;
            if (h[s] === undefined) {
              h[s] = 1;
            } else {
              h[s]++;
            }
          });
        for (const key in h) {
          h[key] /= sum;
        }
        resolve(h);
      });
    });
  },
};
