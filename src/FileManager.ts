import { readFile, promises as fspromises, createReadStream } from "fs";
import { join } from "path";
import { DictionaryManager } from "./DictionaryManager";
import { createInterface } from "readline";

export const FileManager = {
  WORD_BANK_PATH: join(__dirname, "..", "manywords.txt"),
  H_PATH: join(__dirname, "..", "imdb-frequencies.txt"),

  // get string from filesystem
  getText: (path: string): Promise<string> => {
    return new Promise((resolve) => {
      readFile(path, (err, data) => {
        if (err) throw err;
        resolve(data.toString());
      });
    });
  },

  getWordsAsArray: (path: string): Promise<string[]> => {
    return new Promise((resolve) => {
      FileManager.getText(path).then((text) => {
        resolve(text.split(/\s+/g).filter((x) => x.length !== 0));
      });
    });
  },

  /**
   * @param path the path to a file containing a stringified JSON of word
   * frequencies
   */
  generateH: (path: string): Promise<{[key: string]: number}> => {
    return new Promise((resolve) => {
      FileManager.getText(path).then((text) => {
        const h: {[key: string]: number} = JSON.parse(text);
        for (const key in h) {
          h[key]++;
        }
        const sum = Object.values(h).reduce((a, b) => a + b);
        for (const key in h) {
          h[key] /= sum;
        }
        resolve(h);
      });
    });
  },

  frequenciesFromFolder: async (path: string): Promise<Object> => {
    const words: { [key: string]: number } = {};
    let arr = await FileManager.getWordsAsArray(FileManager.WORD_BANK_PATH);
    for (const w of arr) {
      words[w] = 0;
    }
    const filenames = await fspromises.readdir(path);
    for (const file of filenames) {
      const rl = createInterface({
        input: createReadStream(join(path, file)),
        crlfDelay: Infinity,
      });
      for await (const line of rl) {
        for (const word of line.split(/[^a-zA-Z]/)) {
          if (words[word] !== undefined) words[word]++;
        }
      }
    }
    return words;
  },
};
