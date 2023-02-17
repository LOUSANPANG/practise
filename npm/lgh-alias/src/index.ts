import { Plugin } from "rollup";
// import nodeResolvePlugin from '@rollup/plugin-node-resolve';

interface Entries {
  [key: string]: string;
}

interface AliasOption {
  entries: Entries | { find: string | RegExp; replacement: string }[];
}

export function alias(option: AliasOption): Plugin {
  const entries = normalizeEntries(option.entries);
  return {
    name: "alias",
    resolveId(source: string, importer) {
      // 查找一下 看看有没有 对应的 entry
      const entry = entries.find((e) => {
        return e.match(source);
      });

      if (!entry) {
        return source;
      }

      const updatedId = entry.replace(source);

      return this.resolve(updatedId, importer).then((resolved) => {
        return resolved || { id: updatedId };
      });
    },
  };
}

function normalizeEntries(entries: AliasOption["entries"]) {
  if (Array.isArray(entries)) {
    return entries.map((e) => {
      return new Entry(e.find, e.replacement);
    });
  } else {
    return Object.keys(entries).map((key) => {
      return new Entry(key, entries[key]);
    });
  }
}

class Entry {
  constructor(private find: string | RegExp, private replacement: string) {
    this.find = find;
    this.replacement = replacement;
  }

  match(filePath: string) {
    if (typeof this.find === "string") {
      return filePath.startsWith(this.find);
    } else {
      return this.find.test(filePath);
    }
  }

  replace(filePath: string) {
    return filePath.replace(this.find, this.replacement);
  }
}
