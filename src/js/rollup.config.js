import nodeResolve from "@rollup/plugin-node-resolve";
import { sentryRollupPlugin } from "@sentry/rollup-plugin";
import typescript from "@rollup/plugin-typescript";

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
      typescript({
        tsconfig: false,
        // compilerOptions: { allowJs: true, outDir: "out", target: "es6" },
        compilerOptions: { target: "es6" },
      }),
      sentryRollupPlugin({
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: "b263",
        project: "stream-deck-time-tracker",
        telemetry: false,
        disable: true,
      }),
    ],
  };
}

export default [
  ["./src/app.ts", "../dev.b263.time-tracker.sdPlugin/app.bundle.js"],
  ["./src/external.ts", "../dev.b263.time-tracker.sdPlugin/external.bundle.js"],
  [
    "./src/action-track-pi.ts",
    "../dev.b263.time-tracker.sdPlugin/actions/track/property-inspector/inspector.bundle.js",
  ],
  [
    "./src/action-report-pi.ts",
    "../dev.b263.time-tracker.sdPlugin/actions/report/property-inspector/inspector.bundle.js",
  ],
].map(config);
