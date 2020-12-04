/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
module.exports = {
  packageManager: "npm",
  reporters: ["html", "clear-text", "progress"],
  mutator: "javascript",
  testRunner: "jest",
  coverageAnalysis: "off",
  mutate: ["src/service/UserService.js", "src/service/ProducerService.js","src/service/OrderService.js","/src/service/TypeService.js","index.js"]
};
