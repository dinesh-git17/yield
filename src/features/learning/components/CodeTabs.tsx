"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Copy } from "lucide-react";
import { memo, useCallback, useState } from "react";
import { FaGolang, FaJava, FaPython, FaRust } from "react-icons/fa6";
import { SiCplusplus, SiJavascript } from "react-icons/si";
import { getGraphImplementation } from "@/features/learning/code/graphs";
import { getInterviewImplementation } from "@/features/learning/code/interview";
import { getPathfindingImplementation } from "@/features/learning/code/pathfinding";
import {
  getSortingImplementation,
  LANGUAGE_INFO,
  LANGUAGE_ORDER,
  type Language,
} from "@/features/learning/code/sorting";
import { getTreeImplementation } from "@/features/learning/code/trees";
import { buttonInteraction, SPRING_PRESETS } from "@/lib/motion";
import type {
  GraphAlgorithmType,
  InterviewProblemType,
  PathfindingAlgorithmType,
  SortingAlgorithmType,
  TreeDataStructureType,
} from "@/lib/store";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Language Icons (Font Awesome / Simple Icons)
// ─────────────────────────────────────────────────────────────────────────────

interface LanguageIconProps {
  language: Language;
  className?: string;
}

/**
 * Renders the appropriate brand icon for each programming language.
 */
const LanguageIcon = memo(function LanguageIcon({ language, className }: LanguageIconProps) {
  const iconClass = cn("h-4 w-4", className);

  switch (language) {
    case "python":
      return <FaPython className={cn(iconClass, "text-[#3776AB]")} />;
    case "javascript":
      return <SiJavascript className={cn(iconClass, "text-[#F7DF1E]")} />;
    case "java":
      return <FaJava className={cn(iconClass, "text-[#ED8B00]")} />;
    case "cpp":
      return <SiCplusplus className={cn(iconClass, "text-[#00599C]")} />;
    case "go":
      return <FaGolang className={cn(iconClass, "text-[#00ADD8]")} />;
    case "rust":
      return <FaRust className={cn(iconClass, "text-[#DEA584]")} />;
  }
});

export interface CodeTabsProps {
  /** The visualization mode */
  mode: "sorting" | "pathfinding" | "tree" | "graph" | "interview";
  /** The algorithm or data structure to display code for */
  algorithm: string;
  /** Optional additional class names */
  className?: string;
}

/**
 * Get code implementation based on mode and algorithm/structure.
 */
function getImplementation(
  mode: "sorting" | "pathfinding" | "tree" | "graph" | "interview",
  algorithm: string,
  language: Language
): string {
  if (mode === "sorting") {
    return getSortingImplementation(algorithm as SortingAlgorithmType, language);
  }
  if (mode === "tree") {
    return getTreeImplementation(algorithm as TreeDataStructureType, language);
  }
  if (mode === "graph") {
    return getGraphImplementation(algorithm as GraphAlgorithmType, language);
  }
  if (mode === "interview") {
    return getInterviewImplementation(algorithm as InterviewProblemType, language);
  }
  return getPathfindingImplementation(algorithm as PathfindingAlgorithmType, language);
}

/**
 * Tabbed code viewer component with language switching and copy functionality.
 * Displays algorithm implementations in multiple programming languages.
 */
export const CodeTabs = memo(function CodeTabs({ mode, algorithm, className }: CodeTabsProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("python");
  const [copied, setCopied] = useState(false);

  const code = getImplementation(mode, algorithm, selectedLanguage);
  const languageInfo = LANGUAGE_INFO[selectedLanguage];

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available - fallback silently
    }
  }, [code]);

  const handleLanguageChange = useCallback((language: Language) => {
    setSelectedLanguage(language);
  }, []);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border",
        "bg-surface font-mono text-sm",
        className
      )}
    >
      {/* Header with language selector and copy button */}
      <div className="flex items-center justify-between border-b border-border bg-surface-elevated px-4 py-2">
        <LanguageSelector
          selectedLanguage={selectedLanguage}
          onLanguageChange={handleLanguageChange}
        />

        <motion.button
          type="button"
          onClick={handleCopy}
          whileHover={buttonInteraction.hover}
          whileTap={buttonInteraction.tap}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium",
            "text-muted hover:text-primary transition-colors",
            "hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          )}
          aria-label={copied ? "Copied!" : "Copy code"}
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="check"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={SPRING_PRESETS.snappy}
                className="flex items-center gap-1.5 text-emerald-500"
              >
                <Check className="h-3.5 w-3.5" />
                Copied!
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={SPRING_PRESETS.snappy}
                className="flex items-center gap-1.5"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Code display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedLanguage}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
        >
          <pre className="overflow-x-auto p-4">
            <code className="text-primary">
              {code.split("\n").map((line, index) => (
                <CodeLine
                  // biome-ignore lint/suspicious/noArrayIndexKey: Static code lines, index is stable
                  key={index}
                  lineNumber={index + 1}
                  content={line}
                  language={selectedLanguage}
                />
              ))}
            </code>
          </pre>
        </motion.div>
      </AnimatePresence>

      {/* Footer with file extension hint */}
      <div className="border-t border-border bg-surface-elevated px-4 py-2">
        <span className="text-muted flex items-center gap-1.5 text-xs">
          <LanguageIcon language={selectedLanguage} className="h-3.5 w-3.5" />
          {languageInfo.label} • {languageInfo.extension}
        </span>
      </div>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Language Selector Dropdown
// ─────────────────────────────────────────────────────────────────────────────

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

const LanguageSelector = memo(function LanguageSelector({
  selectedLanguage,
  onLanguageChange,
}: LanguageSelectorProps) {
  const selectedInfo = LANGUAGE_INFO[selectedLanguage];

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <motion.button
          type="button"
          whileHover={buttonInteraction.hover}
          whileTap={buttonInteraction.tap}
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-1.5",
            "text-primary text-xs font-medium",
            "hover:bg-surface transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          )}
        >
          <LanguageIcon language={selectedLanguage} />
          <span>{selectedInfo.label}</span>
          <ChevronDown className="h-3 w-3 opacity-60" />
        </motion.button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={cn(
            "bg-surface-elevated border-border z-50 min-w-[160px] rounded-lg border p-1 shadow-xl",
            "animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2",
            "data-[side=top]:slide-in-from-bottom-2"
          )}
          sideOffset={5}
          align="start"
        >
          {LANGUAGE_ORDER.map((language) => {
            const info = LANGUAGE_INFO[language];
            const isSelected = language === selectedLanguage;

            return (
              <DropdownMenu.Item
                key={language}
                className={cn(
                  "flex cursor-pointer select-none items-center gap-2 rounded-md px-3 py-2 text-xs outline-none",
                  "transition-colors",
                  isSelected
                    ? "bg-accent/10 text-accent"
                    : "text-primary hover:bg-surface focus:bg-surface"
                )}
                onSelect={() => onLanguageChange(language)}
              >
                <span className="flex w-5 justify-center">
                  <LanguageIcon language={language} />
                </span>
                <span className="font-medium">{info.label}</span>
                {isSelected && <Check className="ml-auto h-3 w-3" />}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Code Line with Basic Syntax Highlighting
// ─────────────────────────────────────────────────────────────────────────────

interface CodeLineProps {
  lineNumber: number;
  content: string;
  language: Language;
}

/**
 * Renders a single line of code with line numbers and basic syntax highlighting.
 * Uses regex-based token matching for common patterns across languages.
 */
const CodeLine = memo(function CodeLine({ lineNumber, content, language }: CodeLineProps) {
  return (
    <div className="leading-relaxed">
      <span className="text-muted mr-4 inline-block w-8 select-none text-right tabular-nums">
        {lineNumber}
      </span>
      <span>
        <HighlightedCode content={content} language={language} />
      </span>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Syntax Highlighting (Lightweight regex-based approach)
// ─────────────────────────────────────────────────────────────────────────────

interface HighlightedCodeProps {
  content: string;
  language: Language;
}

// Language-specific keyword sets
const KEYWORDS: Record<Language, Set<string>> = {
  python: new Set([
    "def",
    "return",
    "if",
    "else",
    "elif",
    "for",
    "while",
    "in",
    "range",
    "len",
    "True",
    "False",
    "None",
    "not",
    "and",
    "or",
    "break",
    "continue",
    "pass",
    "import",
    "from",
    "as",
    "class",
    "self",
    "lambda",
    "yield",
    "with",
    "try",
    "except",
    "finally",
    "raise",
    "assert",
    "is",
    "global",
    "nonlocal",
  ]),
  cpp: new Set([
    "void",
    "int",
    "bool",
    "true",
    "false",
    "return",
    "if",
    "else",
    "for",
    "while",
    "break",
    "continue",
    "class",
    "struct",
    "public",
    "private",
    "protected",
    "const",
    "static",
    "virtual",
    "override",
    "nullptr",
    "new",
    "delete",
    "template",
    "typename",
    "namespace",
    "using",
    "include",
    "define",
  ]),
  java: new Set([
    "public",
    "private",
    "protected",
    "static",
    "void",
    "int",
    "boolean",
    "return",
    "if",
    "else",
    "for",
    "while",
    "break",
    "continue",
    "class",
    "new",
    "this",
    "true",
    "false",
    "null",
    "final",
    "abstract",
    "interface",
    "extends",
    "implements",
    "import",
    "package",
    "throw",
    "throws",
    "try",
    "catch",
    "finally",
  ]),
  javascript: new Set([
    "function",
    "const",
    "let",
    "var",
    "return",
    "if",
    "else",
    "for",
    "while",
    "break",
    "continue",
    "true",
    "false",
    "null",
    "undefined",
    "new",
    "this",
    "class",
    "extends",
    "import",
    "export",
    "from",
    "async",
    "await",
    "yield",
    "try",
    "catch",
    "finally",
    "throw",
    "typeof",
    "instanceof",
    "of",
    "in",
  ]),
  go: new Set([
    "func",
    "return",
    "if",
    "else",
    "for",
    "range",
    "break",
    "continue",
    "var",
    "const",
    "type",
    "struct",
    "interface",
    "package",
    "import",
    "defer",
    "go",
    "chan",
    "select",
    "case",
    "default",
    "switch",
    "true",
    "false",
    "nil",
    "make",
    "new",
    "append",
    "len",
    "cap",
    "map",
    "slice",
  ]),
  rust: new Set([
    "fn",
    "let",
    "mut",
    "return",
    "if",
    "else",
    "for",
    "while",
    "loop",
    "break",
    "continue",
    "true",
    "false",
    "struct",
    "impl",
    "trait",
    "pub",
    "use",
    "mod",
    "self",
    "Self",
    "match",
    "enum",
    "const",
    "static",
    "async",
    "await",
    "move",
    "ref",
    "where",
    "type",
    "as",
    "in",
    "unsafe",
    "extern",
    "crate",
  ]),
};

// Types per language (common type names)
const TYPES: Record<Language, Set<string>> = {
  python: new Set(["int", "str", "bool", "float", "list", "dict", "tuple", "set", "None"]),
  cpp: new Set(["vector", "string", "size_t", "auto", "std"]),
  java: new Set(["String", "int", "boolean", "void", "Integer", "Boolean", "List", "ArrayList"]),
  javascript: new Set(["Array", "Object", "String", "Number", "Boolean", "Promise", "Map", "Set"]),
  go: new Set(["int", "string", "bool", "byte", "rune", "float64", "error"]),
  rust: new Set(["i32", "i64", "u32", "u64", "usize", "bool", "String", "Vec", "Option", "Result"]),
};

/**
 * Simple syntax highlighter using regex patterns.
 * Handles keywords, strings, comments, numbers, and types.
 */
const HighlightedCode = memo(function HighlightedCode({ content, language }: HighlightedCodeProps) {
  if (!content.trim()) {
    return <span>{content}</span>;
  }

  // Tokenize and highlight using language-specific rules
  const tokens = tokenize(content, language);

  return (
    <>
      {tokens.map((token, index) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: Tokens are derived from content, stable order
          key={index}
          className={cn(
            token.type === "keyword" && "text-fuchsia-400 font-medium",
            token.type === "type" && "text-cyan-400",
            token.type === "string" && "text-emerald-400",
            token.type === "comment" && "text-muted italic",
            token.type === "number" && "text-amber-400",
            token.type === "function" && "text-sky-400",
            token.type === "operator" && "text-rose-400"
          )}
        >
          {token.value}
        </span>
      ))}
    </>
  );
});

interface Token {
  type: "keyword" | "type" | "string" | "comment" | "number" | "function" | "operator" | "plain";
  value: string;
}

/**
 * Tokenizes code content for syntax highlighting.
 */
function tokenize(content: string, language: Language): Token[] {
  const tokens: Token[] = [];
  const keywords = KEYWORDS[language];
  const types = TYPES[language];

  // Combined regex for all token types
  // Order matters: comments and strings first (to avoid partial matches)
  const patterns: Array<{ type: Token["type"]; regex: RegExp }> = [
    // Comments (line comments for all languages)
    { type: "comment", regex: /^(\/\/.*|#.*)/ },
    // Strings (double and single quoted)
    { type: "string", regex: /^("[^"]*"|'[^']*'|`[^`]*`)/ },
    // Numbers (integers and floats)
    { type: "number", regex: /^(\d+\.?\d*)/ },
    // Function calls (word followed by opening paren)
    { type: "function", regex: /^([a-zA-Z_]\w*)\s*(?=\()/ },
    // Words (for keyword/type matching)
    { type: "plain", regex: /^([a-zA-Z_]\w*)/ },
    // Operators
    { type: "operator", regex: /^([+\-*/%=<>!&|^~]+|::|->|=>)/ },
    // Any other character
    { type: "plain", regex: /^(.)/ },
  ];

  let remaining = content;

  while (remaining.length > 0) {
    // Handle leading whitespace
    const whitespaceMatch = remaining.match(/^(\s+)/);
    if (whitespaceMatch) {
      tokens.push({ type: "plain", value: whitespaceMatch[1] ?? "" });
      remaining = remaining.slice((whitespaceMatch[1] ?? "").length);
      continue;
    }

    let matched = false;

    for (const { type, regex } of patterns) {
      const match = remaining.match(regex);
      if (match?.[1]) {
        const value = match[1];
        let finalType: Token["type"] = type;

        // Check if the word is a keyword or type
        if (type === "plain") {
          if (keywords.has(value)) {
            finalType = "keyword";
          } else if (types.has(value)) {
            finalType = "type";
          }
        }

        tokens.push({ type: finalType, value });
        remaining = remaining.slice(value.length);
        matched = true;
        break;
      }
    }

    // Safety fallback: consume one character if nothing matched
    if (!matched) {
      tokens.push({ type: "plain", value: remaining[0] ?? "" });
      remaining = remaining.slice(1);
    }
  }

  return tokens;
}
