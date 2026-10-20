import React, { useMemo } from "react";
import { Linking } from "react-native";
import { Box } from "./Box";
import { Text } from "./Text";

type Block =
  | { type: "heading"; level: 1 | 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "divider" };

interface MarkdownProps {
  content: string;
}

const HEADING = /^(#{1,3})\s+(.*)$/;
const BULLET = /^[-*]\s+(.*)$/;
const NUMBERED = /^\d+\.\s+(.*)$/;
const DIVIDER = /^-{3,}$/;
const INLINE = /(\*\*[^*]+\*\*|[\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g;
const EMAIL = /^[\w.+-]+@[\w-]+(?:\.[\w-]+)+$/;

/**
 * Minimal markdown parser covering the subset used by the legal documents:
 * headings (#, ##, ###), paragraphs, bullet/numbered lists, `---` dividers,
 * **bold** text and trailing-backslash line breaks.
 */
const parseMarkdown = (content: string): Block[] => {
  const blocks: Block[] = [];
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    const text = paragraph.reduce((acc, line, index) => {
      if (index === 0) return line;
      const previous = paragraph[index - 1];
      return acc + (previous.endsWith("\\") ? "\n" : " ") + line;
    }, "");
    blocks.push({ type: "paragraph", text: text.replace(/\\(\n|$)/g, "$1") });
    paragraph = [];
  };

  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      continue;
    }

    if (DIVIDER.test(line)) {
      flushParagraph();
      blocks.push({ type: "divider" });
      continue;
    }

    const heading = line.match(HEADING);
    if (heading) {
      flushParagraph();
      blocks.push({
        type: "heading",
        level: heading[1].length as 1 | 2 | 3,
        text: heading[2],
      });
      continue;
    }

    const bullet = line.match(BULLET);
    const numbered = line.match(NUMBERED);
    if (bullet || numbered) {
      flushParagraph();
      const ordered = Boolean(numbered);
      const item = (bullet ?? numbered)![1];
      const last = blocks[blocks.length - 1];
      if (last?.type === "list" && last.ordered === ordered) {
        last.items.push(item);
      } else {
        blocks.push({ type: "list", ordered, items: [item] });
      }
      continue;
    }

    paragraph.push(line);
  }

  flushParagraph();
  return blocks;
};

const InlineText = ({ text }: { text: string }) => (
  <>
    {text.split(INLINE).map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <Text key={index} variant="bodyBold" color="text">
            {part.slice(2, -2)}
          </Text>
        );
      }
      if (EMAIL.test(part)) {
        return (
          <Text
            key={index}
            color="primary"
            style={{ fontWeight: "700" }}
            onPress={() => Linking.openURL(`mailto:${part}`)}
          >
            {part}
          </Text>
        );
      }
      return part;
    })}
  </>
);

export const Markdown: React.FC<MarkdownProps> = ({ content }) => {
  const blocks = useMemo(() => parseMarkdown(content), [content]);

  return (
    <Box>
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading":
            return (
              <Text
                key={index}
                variant={
                  block.level === 1
                    ? "titleBold"
                    : block.level === 2
                      ? "subtitleBold"
                      : "bodyBold"
                }
                color="text"
                marginTop={index === 0 ? undefined : block.level === 3 ? "m" : "l"}
                marginBottom="s"
              >
                {block.text}
              </Text>
            );
          case "paragraph":
            return (
              <Text
                key={index}
                variant="body"
                color="textSecondary"
                lineHeight={24}
                marginBottom="m"
              >
                <InlineText text={block.text} />
              </Text>
            );
          case "list":
            return (
              <Box key={index} marginBottom="m" gap="xs">
                {block.items.map((item, itemIndex) => (
                  <Box key={itemIndex} flexDirection="row" paddingLeft="s">
                    <Text
                      variant="body"
                      color="textSecondary"
                      lineHeight={24}
                      style={{ minWidth: block.ordered ? 24 : 16 }}
                    >
                      {block.ordered ? `${itemIndex + 1}.` : "•"}
                    </Text>
                    <Text
                      variant="body"
                      color="textSecondary"
                      lineHeight={24}
                      flex={1}
                    >
                      <InlineText text={item} />
                    </Text>
                  </Box>
                ))}
              </Box>
            );
          case "divider":
            return (
              <Box
                key={index}
                height={1}
                backgroundColor="border"
                marginVertical="l"
              />
            );
        }
      })}
    </Box>
  );
};

export default Markdown;
