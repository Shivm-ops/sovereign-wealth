import { describe, it, expect } from "vitest";
import { cn } from "../../lib/utils";

describe("cn utility function tests", () => {
    it("merges multiple single classes correctly", () => {
        expect(cn("class-a", "class-b")).toBe("class-a class-b");
    });

    it("handles empty strings", () => {
        expect(cn("class-a", "", "class-b")).toBe("class-a class-b");
    });

    it("handles null and undefined", () => {
        expect(cn("class-a", null, "class-b", undefined, "class-c")).toBe("class-a class-b class-c");
    });

    it("handles truthy/falsy conditional objects", () => {
        expect(cn({ "class-a": true, "class-b": false, "class-c": 1 })).toBe("class-a class-c");
    });

    it("handles boolean short chaining", () => {
        expect(cn(true && "class-a", false && "class-b", "class-c")).toBe("class-a class-c");
    });

    it("merges arrays of classes", () => {
        expect(cn(["class-a", "class-b"], ["class-c"])).toBe("class-a class-b class-c");
    });

    it("merges nested arrays of classes", () => {
        expect(cn(["class-a", ["class-b", ["class-c"]]])).toBe("class-a class-b class-c");
    });

    it("handles complex mixed arguments (arrays, objects, booleans)", () => {
        expect(cn(
            "class-a",
            ["class-b", "class-c"],
            { "class-d": true, "class-e": false },
            null,
            undefined,
            "class-f"
        )).toBe("class-a class-b class-c class-d class-f");
    });

    // Tailwind specific merges (twMerge)
    it("removes tailwind color conflicts (bg)", () => {
        expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
    });

    it("removes tailwind conflicts (paddings)", () => {
        expect(cn("p-2", "p-4")).toBe("p-4");
        expect(cn("px-2", "px-4")).toBe("px-4");
    });

    it("respects padding axes correctly over all sides", () => {
        // p-4 overrides px-2 and py-2
        expect(cn("px-2 py-2", "p-4")).toBe("p-4");
        // px-4 overrides only the x axis of p-2
        expect(cn("p-2", "px-4")).toBe("p-2 px-4");
    });

    it("merges tailwind margin typography conflicts", () => {
        expect(cn("m-4", "mb-2")).toBe("m-4 mb-2");
        expect(cn("mb-2", "m-4")).toBe("m-4");
    });

    it("merges typography sizing correctly", () => {
        expect(cn("text-sm", "text-lg")).toBe("text-lg");
    });

    it("resolves layout block property conflicts", () => {
        expect(cn("flex", "grid")).toBe("grid");
        expect(cn("block", "inline-block")).toBe("inline-block");
    });

    it("does not deduplicate generic string classes not in tailwind", () => {
        expect(cn("btn", "btn")).toBe("btn btn");
    });

    it("handles arbitrary values in tailwind merge", () => {
        expect(cn("w-[10px]", "w-[20px]")).toBe("w-[20px]");
    });

    it("handles zero as a legitimate value", () => {
        expect(cn("w-full", "w-0")).toBe("w-0");
    });

    it("merges tailwind pseudo classes correctly (hover)", () => {
        expect(cn("hover:bg-red-500", "hover:bg-blue-500")).toBe("hover:bg-blue-500");
    });
});
