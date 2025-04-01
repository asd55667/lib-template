<template>
  <div class="app">
    <h1>Lib Template Demo</h1>
    <div class="calculator">
      <h2>Calculator</h2>
      <div class="inputs">
        <input
          type="number"
          v-model="num1"
          placeholder="First number"
        />
        <input
          type="number"
          v-model="num2"
          placeholder="Second number"
        />
      </div>
      <div class="buttons">
        <button
          @click="handleCalculate('sum')"
          :class="{ active: operation === 'sum' }"
        >
          Sum
        </button>
        <button
          @click="handleCalculate('multiply')"
          :class="{ active: operation === 'multiply' }"
        >
          Multiply
        </button>
      </div>
      <div v-if="result" class="result">{{ result }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
// In a real app, you would import from the npm package
// import { sum, multiply } from '@wcw2025/lib-template';
// For this demo, we assume the library is built and linked locally
import { sum, multiply } from '@wcw2025/lib-template';

export default defineComponent({
  name: 'App',
  setup() {
    const num1 = ref('');
    const num2 = ref('');
    const result = ref<string | null>(null);
    const operation = ref<'sum' | 'multiply' | null>(null);

    const handleCalculate = (op: 'sum' | 'multiply') => {
      const a = parseFloat(num1.value);
      const b = parseFloat(num2.value);

      if (isNaN(a) || isNaN(b)) {
        result.value = 'Please enter valid numbers';
        return;
      }

      let calculatedResult;
      if (op === 'sum') {
        calculatedResult = sum(a, b);
        result.value = `Sum: ${calculatedResult}`;
      } else {
        calculatedResult = multiply(a, b);
        result.value = `Product: ${calculatedResult}`;
      }

      operation.value = op;
    };

    return {
      num1,
      num2,
      result,
      operation,
      handleCalculate
    };
  }
});
</script>
