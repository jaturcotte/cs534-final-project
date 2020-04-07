# Source for word bank: http://www.blimix.com/jotto/wordlist.txt

from player import *


# reads words from a file into a list
def readWordsFromFile(filename):
    f = open(filename, 'r')
    word_bank = []
    for word in f:
        word_bank.append(word.strip('\n'))
    return word_bank


# returns an integer indicating how many characters two strings have in common
# Source: https://www.geeksforgeeks.org/python-count-the-number-of-matching-characters-in-a-pair-of-string/
def matchingLetters(s1, s2):
    return len(set(s1) & set(s2))


# returns True if the string contains all unique characters (False otherwise)
# Source: https://www.geeksforgeeks.org/python-program-to-check-if-a-string-contains-all-unique-characters/
def isUniqueChars(st):
    # String length cannot be more than 256.
    if len(st) > 256:
        return False

    # Initialize occurrences of all characters
    char_set = [False] * 128

    # For every character, check if it exists in char_set
    for i in range(0, len(st)):

        # Find ASCII value and check if it exists in set.
        val = ord(st[i])
        if char_set[val]:
            return False

        char_set[val] = True

    return True


# returns True if the word satisfies the conditions of Jotto (False otherwise)
def isValid(word, word_bank):
    return word.isalpha() and len(word) == 5 and isUniqueChars(word) and word in word_bank


def main():

    # read possible list of words from word bank file
    word_bank = readWordsFromFile('wordbank.txt')

    # create a word for the opponent to guess
    while True:
        secret_word = input("Choose a 5-letter word (all unique characters): ")
        if isValid(secret_word, word_bank):
            break
        else:
            print("Invalid word selection. Try again.")

    # create an opponent who guesses until they get the correct word
    opponent = Player(word_bank)
    num_guesses = 0
    while True:
        guess = opponent.guess()
        num_guesses += 1
        print(guess + ": " + str(matchingLetters(guess, secret_word)))

        if guess == secret_word:
            print("The opponent won after", num_guesses, "guesses.")
            break


if __name__ == '__main__':
    main()
