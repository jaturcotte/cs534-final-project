import * as assert from "assert";
import { describe, it } from "mocha";
import { WORD_BANK_PATH } from '../src/main';
import { DictionaryManager } from "../src/DictionaryManager";

let dm: DictionaryManager;

describe("DictionaryManager", function () {
  before(async function () {
    dm = new DictionaryManager();
    await dm.addWordsFromFile(WORD_BANK_PATH)
  });

  describe("addWordsFromFile()", function () {
    it("should build the dictionary without error", function(done) {
      const dictMan = new DictionaryManager();
      dictMan.addWordsFromFile(WORD_BANK_PATH).then(done);
    });
  });

  describe("numWords()", function () {
    it("should return in the correct number of words", function () {
      assert.strictEqual(dm.numWords(), 5683);
    });
  });

  describe("validate()", function () {
    it("should return false if it hasn't read any words yet", function () {
      const dictMan = new DictionaryManager();
      assert.strictEqual(dictMan.validate("korun"), false);
      assert.strictEqual(dictMan.validate("lamer"), false);
      assert.strictEqual(dictMan.validate(""), false);
    });

    it("should return false for words that are too short", function () {
      assert.strictEqual(dm.validate(""), false);
      assert.strictEqual(dm.validate("a"), false);
      assert.strictEqual(dm.validate("bbbb"), false);
    });

    it("should return false for words that are too long", function () {
      assert.strictEqual(dm.validate("asdkjb"), false);
      assert.strictEqual(
        dm.validate(
          "dlskfjalskdjflaksdjflaskd fjlaksd jfalksd jflask djlak sdjjk"
        ),
        false
      );
    });

    it("should return false for words not in the dictionary", function () {
      assert.strictEqual(dm.validate("hgibh"), false);
      assert.strictEqual(dm.validate("a bje"), false);
      assert.strictEqual(dm.validate("//b93"), false);
      assert.strictEqual(dm.validate("coach"), false);
    });

    it("should return true for valid words", function () {
      assert.strictEqual(dm.validate("quick"), true);
      assert.strictEqual(dm.validate("conga"), true);
      assert.strictEqual(dm.validate("laden"), true);
    });
  });
});
