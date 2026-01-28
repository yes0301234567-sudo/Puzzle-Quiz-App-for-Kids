import { Difficulty, Operator, Puzzle } from '../types';

const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const generatePuzzle = (difficulty: Difficulty): Puzzle => {
  let num1 = 0;
  let num2 = 0;
  let operator = Operator.Add;
  let correctAnswer = 0;

  // 1. Determine Operator and Numbers based on Difficulty
  switch (difficulty) {
    case Difficulty.Easy:
      // 1-10, Add/Sub only
      operator = Math.random() > 0.5 ? Operator.Add : Operator.Subtract;
      num1 = getRandomInt(1, 10);
      num2 = getRandomInt(1, 10);
      break;
    
    case Difficulty.Medium:
      // 1-50, Add/Sub/Mult
      const randMed = Math.random();
      if (randMed < 0.33) operator = Operator.Add;
      else if (randMed < 0.66) operator = Operator.Subtract;
      else operator = Operator.Multiply;

      if (operator === Operator.Multiply) {
        num1 = getRandomInt(2, 9); // Keep multiplication simpler for kids
        num2 = getRandomInt(2, 9);
      } else {
        num1 = getRandomInt(10, 50);
        num2 = getRandomInt(1, 50);
      }
      break;

    case Difficulty.Hard:
      // 1-100, All operations
      const randHard = Math.random();
      if (randHard < 0.25) operator = Operator.Add;
      else if (randHard < 0.5) operator = Operator.Subtract;
      else if (randHard < 0.75) operator = Operator.Multiply;
      else operator = Operator.Divide;

      if (operator === Operator.Multiply) {
        num1 = getRandomInt(3, 12);
        num2 = getRandomInt(3, 12);
      } else if (operator === Operator.Divide) {
        // Ensure clean division
        num2 = getRandomInt(2, 10);
        correctAnswer = getRandomInt(2, 12);
        num1 = num2 * correctAnswer; // Reverse engineer num1
      } else {
        num1 = getRandomInt(20, 100);
        num2 = getRandomInt(10, 100);
      }
      break;
  }

  // 2. Calculate Correct Answer (if not already set for division)
  if (operator !== Operator.Divide) {
    switch (operator) {
      case Operator.Add: correctAnswer = num1 + num2; break;
      case Operator.Subtract: 
        // Ensure positive results for kids usually, or handle negatives. 
        // Let's swap if num1 < num2 to avoid negative for Easy/Medium mostly
        if (num1 < num2) { [num1, num2] = [num2, num1]; }
        correctAnswer = num1 - num2; 
        break;
      case Operator.Multiply: correctAnswer = num1 * num2; break;
    }
  }

  // 3. Generate Distractors (Wrong Options)
  const options = new Set<number>();
  options.add(correctAnswer);

  while (options.size < 4) {
    let offset = getRandomInt(1, 10);
    if (Math.random() > 0.5) offset = -offset;
    
    const distractor = correctAnswer + offset;
    // Avoid negative distractors for very simple problems if possible, but allow them generally
    // Also ensure distractor is not same as answer
    if (distractor !== correctAnswer && distractor >= 0) {
      options.add(distractor);
    }
  }

  return {
    id: Date.now().toString(),
    question: `${num1} ${operator} ${num2} = ?`,
    correctAnswer,
    options: shuffleArray(Array.from(options)),
    operator
  };
};
