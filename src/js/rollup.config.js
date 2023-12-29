import nodeResolve from "@rollup/plugin-node-resolve";

function config([input, file]) {
  return {
    input,
    output: {
      file,
      format: "cjs",
    },
    plugins: [nodeResolve()],
  };
}

export default [
  ["./src/app.js", "../dev.b263.time-tracker.sdPlugin/app.bundle.js"],
  [
    "./src/action-track-external.js",
    "../dev.b263.time-tracker.sdPlugin/actions/track/property-inspector/external.bundle.js",
  ],
  [
    "./src/action-track-pi.js",
    "../dev.b263.time-tracker.sdPlugin/actions/track/property-inspector/inspector.bundle.js",
  ],
  [
    "./src/action-report-pi.js",
    "../dev.b263.time-tracker.sdPlugin/actions/report/property-inspector/inspector.bundle.js",
  ],
].map((_) => config(_));
