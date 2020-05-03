import * as assert from "assert";
import { describe, it } from "mocha";
import { Jotto, NOT_READY_MESSAGE } from "../src/Jotto";
import { RandomAgent } from "../src/RandomAgent";

let jotto: Jotto;


describe("Jotto", function () {
  beforeEach(async function () {
    jotto = new Jotto(new RandomAgent(), new RandomAgent());
    await jotto.startUp();
  });

  describe("startUp()", function () {
    it("should build the dictionary without error", function (done) {
      const j = new Jotto(new RandomAgent(), new RandomAgent());
      j.startUp().then(done);
    });
  });

  describe("buildDict()", function () {
    it("should read in the correct number of words", function () {
      assert.strictEqual(jotto.numValidWords(), 5683);
    });
  });

  describe("validate()", function () {
    it("should throw an error if the game isn't ready yet", function () {
      const j = new Jotto(new RandomAgent(), new RandomAgent());
      assert.throws(() => j.validate("tests"), Error, NOT_READY_MESSAGE);
    });

    it("should return false for words that are too short", function () {
      assert.strictEqual(jotto.validate(""), false);
      assert.strictEqual(jotto.validate("a"), false);
      assert.strictEqual(jotto.validate("bbbb"), false);
    });

    it("should return false for words that are too long", function () {
      assert.strictEqual(jotto.validate("asdkjb"), false);
      assert.strictEqual(
        jotto.validate(
          "dlskfjalskdjflaksdjflaskd fjlaksd jfalksd jflask djlak sdjjk"
        ),
        false
      );
    });

    it("should return false for words not in the dictionary", function () {
      assert.strictEqual(jotto.validate("hgibh"), false);
      assert.strictEqual(jotto.validate("a bje"), false);
      assert.strictEqual(jotto.validate("//b93"), false);
      assert.strictEqual(jotto.validate("coach"), false);
    });

    it("should return true for valid words", function () {
      assert.strictEqual(jotto.validate("quick"), true);
      assert.strictEqual(jotto.validate("conga"), true);
      assert.strictEqual(jotto.validate("laden"), true);
    });
  });
});
