import type { ParserResultBeforeHookArgs } from "@pandacss/types";
import { Project, ts } from "ts-morph";
import { ComponentTokens } from "./types";

export const parser = (
  args: ParserResultBeforeHookArgs,
  tokens: ComponentTokens
): string | void => {
  const { content } = args;

  const get = (path: string): string => {
    const parts = path.split(".");
    let current = tokens;

    for (const part of parts) {
      if (!current[part]) {
        break;
      }
      current = current[part] as ComponentTokens;
    }

    if (typeof current !== "string") {
      return "alias-not-found";
    }

    return current as unknown as string;
  };

  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: {
      target: ts.ScriptTarget.ESNext,
    },
  });

  const source = project.createSourceFile("__temp-ct-parser.ts", content, {
    overwrite: true,
  });

  let hasCt = false;

  source.getImportDeclarations().forEach((node) => {
    node.getNamedImports().forEach((named) => {
      if (named.getName() === "ct") {
        hasCt = true;
      }
    });
  });

  if (!hasCt) {
    return;
  }

  const text = source.getText();
  let newText = text;

  const calls = text.match(/ct\(['"][\w.]+['"]\)/g) ?? [];

  for (const call of calls) {
    const path = call
      .match(/['"][\w.]+['"]/)
      ?.toString()
      .replace(/['"]/g, "");

    if (!path) {
      continue;
    }

    newText = newText.replace(call, `"${get(path)}"`);
  }

  return newText;
};
