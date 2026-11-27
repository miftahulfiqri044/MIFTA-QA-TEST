export default {
  import: ['support/**/*.ts', 'step-definitions/**/*.ts'],
  paths: ['features/**/*.feature'],
  format: [
    'progress-bar',
    'allure-cucumberjs/reporter',
  ],
  formatOptions: { resultsDir: 'allure-results' },
};
