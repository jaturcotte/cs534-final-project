import { readFile } from "fs";
import { join } from "path";
import { DictionaryManager } from "./DictionaryManager";

const WORD_BANK_PATH = join(__dirname, "..", "manywords.txt");
const H_PATH = join(__dirname, "..", "words.txt");

export const FileManager = {
  getWordsAsArray: (): Promise<string[]> => {
    return new Promise((resolve) => {
      readFile(WORD_BANK_PATH, (err, data) => {
        if (err) throw err;
        const words = data
          .toString()
          .split(/\s+/g)
          .filter((x) => x.length !== 0);
        resolve(words);
      });
    });
  },
  generateH: (dm: DictionaryManager): Promise<Object> => {
    return new Promise((resolve) => {
      readFile(H_PATH, (err, data) => {
        if (err) throw err;
        const h: any = {};
        let sum = 0;
        data.toString()
          .split(/[^a-zA-Z]/)
          .map(s => s.toLowerCase())
          .filter((s) => dm.validate(s))
          .concat(dm.getAllWords())
          .map(s => {
            sum++;
            if(h[s] === undefined) {
              h[s] = 1;
            }
            else {
              h[s]++;
            }
          });
        for(const key in h) {
          h[key] /= sum;
        }
        resolve(h);
      });
    });
  },
};
