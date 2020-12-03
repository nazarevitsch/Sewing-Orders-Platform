/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
module.exports = {
  packageManager: "npm",
  reporters: ["html", "clear-text", "progress"],
  mutator: "javascript",
  testRunner: "jest",
  coverageAnalysis: "off",
  mutate: ["src/service/UserService.js", "src/service/ProducerService.js","src/service/OrderService.js"]
};
// module.exports = function(config) {
//   config.set({
//     files: [{
//       pattern: 'app.js',
//       mutated: true
//     },
//       'test/**/*.js'
//     ],
//     testRunner: 'mocha',
//     reporter: ['html', 'clear-text', 'progress'],
//     testFramework: 'mocha'
//   });
// };
