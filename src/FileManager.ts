import { readFile } from "fs";
import { join } from "path";

const WORD_BANK_PATH = join(__dirname, "..", "manywords.txt");

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
};
