import {afterEach, describe, it, expect, vi } from "vitest";
import { alias } from ".";

describe("alias", () => {
  const resolve = vi.fn(() => Promise.resolve());


  
  describe("entries is object", () => {
    it("should replace alias value when match", () => {
      const aliasObj: any = alias({
        entries: {
          "@": "./src/utils",
          utils: "./src/utils",
        },
      });

      aliasObj.resolveId.call({ resolve }, "@/add", undefined);
      expect(resolve).toBeCalledWith("./src/utils/add", undefined);

      aliasObj.resolveId.call({ resolve }, "utils/add");
      expect(resolve).toBeCalledWith("./src/utils/add", undefined);
    });

    it("should does not replace alias value when does not match", () => {
      const aliasObj: any = alias({
        entries: {
          "@": "./src/utils",
        },
      });

      expect(aliasObj.resolveId("./src/utils/add.js")).toBe(
        "./src/utils/add.js"
      );
    });
  });

  describe("entries is array", () => {
    it("should replace alias value when match", () => {
      const aliasObj: any = alias({
        entries: [
          {
            find: "@",
            replacement: "./src/utils",
          },
          {
            find: "utils",
            replacement: "./src/utils",
          },
        ],
      });

      aliasObj.resolveId.call({ resolve }, "@/add");
      expect(resolve).toBeCalledWith("./src/utils/add",undefined)

      aliasObj.resolveId.call({ resolve }, "utils/add");
      expect(resolve).toBeCalledWith("./src/utils/add",undefined)
    });
    it("should replace alias value when find is RegExp", () => {
      const aliasObj: any = alias({
        entries: [{ find: /^(.*)\.js$/, replacement: "$1.alias" }],
      });

      aliasObj.resolveId.call({ resolve }, "add.js");
      expect(resolve).toBeCalledWith("add.alias",undefined)
    });

    it("should does not replace alias value when does not match", () => {
      const aliasObj: any = alias({
        entries: {
          "@": "./src/utils",
        },
      });

      expect(aliasObj.resolveId("./src/utils/add.js")).toBe(
        "./src/utils/add.js"
      );
    });
  });
});
