import * as assert from "assert";
import { describe, it } from "mocha";
import { DictionaryManager } from "../src/DictionaryManager";

let dm: DictionaryManager;

describe("DictionaryManager", function () {
  before(async function () {
    dm = new DictionaryManager();
    await dm.addWordsFromFile();
  });

  describe("addWordsFromFile()", function () {
    it("should build the dictionary without error", function (done) {
      const dictMan = new DictionaryManager();
      dictMan.addWordsFromFile().then(done);
    });
  });

  describe("numWords()", function () {
    it("should return in the correct number of words", function () {
      assert.strictEqual(dm.numWords(), 8661);
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
      assert.strictEqual(dm.validate("aoben"), false);
    });

    it("should return true for valid words", function () {
      assert.strictEqual(dm.validate("quick"), true);
      assert.strictEqual(dm.validate("conga"), true);
      assert.strictEqual(dm.validate("laden"), true);
    });
  });

  describe("sharedLetters()", function () {
    it("should return 0 for an empty string in either position", function () {
      assert.strictEqual(DictionaryManager.sharedLetters("", "asdf"), 0);
      assert.strictEqual(DictionaryManager.sharedLetters("asdf", ""), 0);
    });

    it("should return 5 for identical isograms", function () {
      assert.strictEqual(DictionaryManager.sharedLetters("acorn", "acorn"), 5);
      assert.strictEqual(DictionaryManager.sharedLetters("charm", "charm"), 5);
    });

    it("should correctly calculate shared letters for isograms", function () {
      assert.strictEqual(DictionaryManager.sharedLetters("acorn", "charm"), 3);
      assert.strictEqual(DictionaryManager.sharedLetters("loser", "sound"), 2);
      assert.strictEqual(DictionaryManager.sharedLetters("harms", "quick"), 0);
    });

    it("should get correct shared letters with repeats in guess", function () {
      assert.strictEqual(DictionaryManager.sharedLetters("halls", "loner"), 1);
      assert.strictEqual(DictionaryManager.sharedLetters("malls", "lames"), 4);
      assert.strictEqual(DictionaryManager.sharedLetters("goons", "moons"), 4);
    });

    it("should get correct shared letters with repeats in secret", function () {
      assert.strictEqual(DictionaryManager.sharedLetters("loner", "halls"), 1);
      assert.strictEqual(DictionaryManager.sharedLetters("lames", "malls"), 4);
      assert.strictEqual(DictionaryManager.sharedLetters("moons", "goons"), 4);
    });

    it("should get correct shared letters with triple repeats", function () {
      assert.strictEqual(DictionaryManager.sharedLetters("lllaa", "lames"), 2);
      assert.strictEqual(DictionaryManager.sharedLetters("lames", "lllaa"), 2);
    });
  });
});
