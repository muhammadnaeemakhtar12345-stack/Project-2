import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "public/**",
    "node_modules/**",
  ]),
  {
    rules: {
      // We sync browser-only state (localStorage, mounted, props) into
      // component state via useEffect. This is the documented pattern for
      // bridging external systems to React state.
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
