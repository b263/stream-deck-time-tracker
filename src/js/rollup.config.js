import nodeResolve from "@rollup/plugin-node-resolve";
import { sentryRollupPlugin } from "@sentry/rollup-plugin";

function config([input, file]) {
  return {
    input,
    output: {
      file,
      format: "cjs",
      sourcemap: true,
    },
    plugins: [
      nodeResolve(),
      sentryRollupPlugin({
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: "b263",
        project: "stream-deck-time-tracker",
        telemetry: false,
      }),
    ],
  };
}

export default [
  ["./src/app.js", "../dev.b263.time-tracker.sdPlugin/app.bundle.js"],
  ["./src/external.js", "../dev.b263.time-tracker.sdPlugin/external.bundle.js"],
  [
    "./src/action-track-pi.js",
    "../dev.b263.time-tracker.sdPlugin/actions/track/property-inspector/inspector.bundle.js",
  ],
  [
    "./src/action-report-pi.js",
    "../dev.b263.time-tracker.sdPlugin/actions/report/property-inspector/inspector.bundle.js",
  ],
].map((_) => config(_));
