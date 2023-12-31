export default {
  transform: { "^.+\\.ts?$": "ts-jest" },
  testEnvironment: "jsdom",
  testRegex: "\\.test\\.ts$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
