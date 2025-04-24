export class Word {

    

    // chooseWords(wordsList:string): string[] {
    //     return shuffleWords([]);
    // }

    
    shuffleWords(array: {wordCivil: string, wordUndercover: string}[]): {wordCivil: string, wordUndercover: string}[] {
    
        const random = Math.floor(Math.random() * 2);
        if (random) {
            return [{wordCivil: array[0].wordCivil, wordUndercover: array[0].wordUndercover}];
        }
        else {
            return [{wordCivil: array[0].wordUndercover, wordUndercover: array[0].wordCivil}];
        }
      }
}
