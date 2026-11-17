# Japanese study

Open `../japanese.html` directly, or serve the repository with a static server. No build step is required for guest study. The original tracker scripts are unchanged; an additional navigation script shares the language preference. Personal accounts require Supabase configuration; see [ACCOUNT_SETUP.md](ACCOUNT_SETUP.md).

- 442 lesson-specific vocabulary entries from GENKI I third edition lessons 1–8. Includes lesson 1 Additional Vocabulary; excludes later lessons, reading-section vocabulary and separate Useful Expressions pages.
- Lesson folders, cross-lesson part-of-speech filters, and finer verb/adjective categories.
- Reversible English/Japanese flashcards; unknown cards repeat until mastered.
- Randomized spelling sessions with Japanese copy/recall prompts or English meaning prompts; incorrect answers repeat. Japanese hints can be hidden before typing.
- Text entry supports the device's Japanese keyboard/handwriting IME. There is no built-in ink recognition engine. Width/whitespace differences are normalized; only explicit kana, written-form and listed variants are accepted. Lesson 1–2 entries generally retain the kana shown in the textbook.
- Chinese/English one-click switching preserves the active exercise and remembers the choice. Star words on a card or in the list, then choose Favorites only for cards or spelling. Guest favorites stay in this browser; configured signed-in accounts store favorites in Supabase under row-level security.
- Progress is per session and resets on settings changes, account changes, navigation or reload. Language switching does not reset it. Account passwords are handled by Supabase Auth, never stored by the application.

Data source printed pages: 38–40, 58–59, 84–85, 104–105, 130–131, 148–149, 168–169, 188–189. English meanings are condensed. Grammar usage hints in parentheses are not part of spelling answers; suffix entries retain `〜`. A repeated word in different lessons remains a separate entry.

Verification: `node --test tests/*.test.cjs`. Tests include translation coverage, guest persistence, account isolation with mock remote storage, stale response handling and storage failures, in addition to the original study tests. Live Supabase registration, email delivery, password recovery and RLS require the configured project and the acceptance checks in ACCOUNT_SETUP.md. Full video analysis was not repeated with an experimental recording.
