import { Component, createSignal, Show } from 'solid-js';
import { sum, multiply } from '@wcw2025/lib-template';

export const Calculator: Component = () => {
  const [firstNumber, setFirstNumber] = createSignal<number | null>(null);
  const [secondNumber, setSecondNumber] = createSignal<number | null>(null);
  const [result, setResult] = createSignal<number | null>(null);
  const [operation, setOperation] = createSignal<string | null>(null);

  const calculateSum = () => {
    if (firstNumber() !== null && secondNumber() !== null) {
      const calculatedResult = sum(firstNumber()!, secondNumber()!);
      setResult(calculatedResult);
      setOperation(
        `${firstNumber()} + ${secondNumber()} = ${calculatedResult}`
      );
    }
  };

  const calculateProduct = () => {
    if (firstNumber() !== null && secondNumber() !== null) {
      const calculatedResult = multiply(firstNumber()!, secondNumber()!);
      setResult(calculatedResult);
      setOperation(
        `${firstNumber()} × ${secondNumber()} = ${calculatedResult}`
      );
    }
  };

  const handleFirstNumberChange = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    setFirstNumber(value === '' ? null : Number(value));
  };

  const handleSecondNumberChange = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    setSecondNumber(value === '' ? null : Number(value));
  };

  return (
    <div class="card">
      <h2>Calculator</h2>
      <div class="inputs">
        <input
          type="number"
          placeholder="First number"
          onInput={handleFirstNumberChange}
        />
        <input
          type="number"
          placeholder="Second number"
          onInput={handleSecondNumberChange}
        />
      </div>
      <div>
        <button onClick={calculateSum}>Add Numbers</button>
        <button onClick={calculateProduct}>Multiply Numbers</button>
      </div>
      <Show when={result() !== null}>
        <div class="result">Result: {result()}</div>
      </Show>
      <Show when={operation()}>
        <div class="result">Operation: {operation()}</div>
      </Show>
    </div>
  );
};
