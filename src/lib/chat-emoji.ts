/** Emoji cepat untuk composer chat. */
export const CHAT_EMOJI_GROUPS: { label: string; emojis: string[] }[] = [
  {
    label: "Sering",
    emojis: ["🙏", "✝️", "❤️", "😊", "🙌", "💪", "✨", "🔥", "👍", "🥰", "😭", "😂"],
  },
  {
    label: "Reaksi",
    emojis: ["😮", "🤔", "😅", "😎", "🤗", "😇", "🤩", "😌", "🫡", "💯", "👏", "🫶"],
  },
  {
    label: "Iman",
    emojis: ["🕊️", "📖", "⛪", "🌟", "💡", "🌱", "☀️", "🌙", "🤝", "💌", "🎉", "🌈"],
  },
];

export const CHAT_EMOJI_FLAT = CHAT_EMOJI_GROUPS.flatMap((group) => group.emojis);
