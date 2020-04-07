import random


class Player:
    def __init__(self, word_bank):
        self.word_bank = word_bank

    def guess(self):
        guess = random.choice(self.word_bank)
        self.word_bank.remove(guess)
        return guess
