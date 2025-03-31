import { Component } from 'solid-js';
import { Calculator } from './Calculator';

export const App: Component = () => {
  return (
    <div class="container">
      <h1>lib-template SolidJS Example</h1>
      <p>This is a demo of using the lib-template library in a SolidJS application.</p>
      <Calculator />
    </div>
  );
};
