import { useState } from 'react';
// In a real app, you would import from the npm package
// import { sum, multiply } from '@wcw2025/lib-template';
// For this demo, we assume the library is built and linked locally
import { sum, multiply } from '@wcw2025/lib-template';
import './App.css';

function App() {
  const [num1, setNum1] = useState<string>('');
  const [num2, setNum2] = useState<string>('');
  const [result, setResult] = useState<string | null>(null);
  const [operation, setOperation] = useState<'sum' | 'multiply' | null>(null);

  const handleCalculate = (op: 'sum' | 'multiply') => {
    const a = parseFloat(num1);
    const b = parseFloat(num2);

    if (isNaN(a) || isNaN(b)) {
      setResult('Please enter valid numbers');
      return;
    }

    let calculatedResult;
    if (op === 'sum') {
      calculatedResult = sum(a, b);
      setResult(`Sum: ${calculatedResult}`);
    } else {
      calculatedResult = multiply(a, b);
      setResult(`Product: ${calculatedResult}`);
    }

    setOperation(op);
  };

  return (
    <div className="app">
      <h1>Lib Template Demo</h1>
      <div className="calculator">
        <h2>Calculator</h2>
        <div className="inputs">
          <input
            type="number"
            value={num1}
            onChange={(e) => setNum1(e.target.value)}
            placeholder="First number"
          />
          <input
            type="number"
            value={num2}
            onChange={(e) => setNum2(e.target.value)}
            placeholder="Second number"
          />
        </div>
        <div className="buttons">
          <button
            onClick={() => handleCalculate('sum')}
            className={operation === 'sum' ? 'active' : ''}
          >
            Sum
          </button>
          <button
            onClick={() => handleCalculate('multiply')}
            className={operation === 'multiply' ? 'active' : ''}
          >
            Multiply
          </button>
        </div>
        {result && <div className="result">{result}</div>}
      </div>
    </div>
  );
}

export default App;