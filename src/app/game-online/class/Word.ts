import { WordPairs } from "../interface/wordList";

export class Word {

    
    chooseWords(availableWords: WordPairs[]): [{wordCivil: string, wordUndercover: string}, WordPairs[]] {

        //choisis une ligne aléatoire dans words
        const index = Math.floor(Math.random() * availableWords.length);
        const _wordsRound: WordPairs = availableWords[index];
        const wordsRound: {wordCivil: string, wordUndercover: string} = this.shuffleWords(_wordsRound);
        const newAvailableWords = availableWords;
        newAvailableWords.splice(index, 1);

        return [wordsRound, newAvailableWords];
    }

    
    shuffleWords(obj: WordPairs): {wordCivil: string, wordUndercover: string} {
    
        const random = Math.floor(Math.random() * 2);
        if (random) {
            return {wordCivil: obj.word1, wordUndercover: obj.word2};
        }
        else {
            return {wordCivil: obj.word2, wordUndercover: obj.word1};
        }
      }
}
