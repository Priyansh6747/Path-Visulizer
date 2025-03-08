export function getTwoUniqueRandomNumbers(max) {
    const num1 = Math.floor(Math.random() * max);
    let num2;

    do {
        num2 = Math.floor(Math.random() * max);
    } while (num2 === num1);

    return [num1, num2];
}

