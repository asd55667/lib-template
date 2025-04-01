<script lang="ts">
  import { sum, multiply } from '@wcw2025/lib-template';

  let firstNumber: number | null = null;
  let secondNumber: number | null = null;
  let result: number | null = null;
  let operation: string | null = null;

  function calculateSum() {
    if (firstNumber !== null && secondNumber !== null) {
      const calculatedResult = sum(firstNumber, secondNumber);
      result = calculatedResult;
      operation = `${firstNumber} + ${secondNumber} = ${calculatedResult}`;
    }
  }

  function calculateProduct() {
    if (firstNumber !== null && secondNumber !== null) {
      const calculatedResult = multiply(firstNumber, secondNumber);
      result = calculatedResult;
      operation = `${firstNumber} × ${secondNumber} = ${calculatedResult}`;
    }
  }

  function handleFirstNumberChange(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    firstNumber = value === '' ? null : Number(value);
  }

  function handleSecondNumberChange(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    secondNumber = value === '' ? null : Number(value);
  }
</script>

<div class="card">
  <h2>Calculator</h2>
  <div class="inputs">
    <input
      type="number"
      placeholder="First number"
      on:input={handleFirstNumberChange}
    />
    <input
      type="number"
      placeholder="Second number"
      on:input={handleSecondNumberChange}
    />
  </div>
  <div>
    <button on:click={calculateSum}>Add Numbers</button>
    <button on:click={calculateProduct}>Multiply Numbers</button>
  </div>
  {#if result !== null}
    <div class="result">
      Result: {result}
    </div>
  {/if}
  {#if operation}
    <div class="result">
      Operation: {operation}
    </div>
  {/if}
</div>
