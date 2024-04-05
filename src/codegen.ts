import type {
  CodegenPrepareHookArgs,
  MaybeAsyncReturn,
  Artifact,
} from "@pandacss/types";
import { makePaths } from "./utils";
import { ComponentTokens } from "./types";

export const codegen = (
  args: CodegenPrepareHookArgs,
  tokens: ComponentTokens
): MaybeAsyncReturn<void | Artifact[]> => {
  const paths = makePaths(tokens)
    .map((key) => `"${key}"`)
    .join(" | ");

  const cssFn = args.artifacts.find((a) => a.id === "css-fn");

  if (!cssFn) return;

  const cssFile = cssFn.files.find((f) => f.file.includes("css.mjs"));
  if (!cssFile) return;

  cssFile.code += `\n
  const ctTokens = ${JSON.stringify(tokens, null, 2)};

  export const ct = (path) => {
    const parts = path.split(".");
    let current = ctTokens;
  
    for (const part of parts) {
      if (!current[part]) {
        break;
      }
      current = current[part];
    }
  
    if (typeof current !== "string") {
      return "alias-not-found";
    }
  
    return current;
  }`;

  const cssDtsFile = cssFn.files.find((f) => f.file.includes("css.d."));
  if (!cssDtsFile) return;

  cssDtsFile.code += `\nexport const ct: (alias: ${paths}) => string;`;
};
