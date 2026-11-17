# Japanese study

Open `../japanese.html` directly, or serve the repository with a static server. No build step, account, API key or paid service is required. The existing tracker only receives a navigation link; its scripts are unchanged.

- 442 lesson-specific vocabulary entries from GENKI I third edition lessons 1–8. Includes lesson 1 Additional Vocabulary; excludes later lessons, reading-section vocabulary and separate Useful Expressions pages.
- Lesson folders, cross-lesson part-of-speech filters, and finer verb/adjective categories.
- Reversible English/Japanese flashcards; unknown cards repeat until mastered.
- Randomized spelling sessions with Japanese copy/recall prompts or English meaning prompts; incorrect answers repeat. Japanese hints can be hidden before typing.
- Text entry supports the device's Japanese keyboard/handwriting IME. There is no built-in ink recognition engine. Width/whitespace differences are normalized; only explicit kana, written-form and listed variants are accepted. Lesson 1–2 entries generally retain the kana shown in the textbook.
- Progress is per session and resets on settings changes, navigation or reload. No personal study data is sent to a server.

Data source printed pages: 38–40, 58–59, 84–85, 104–105, 130–131, 148–149, 168–169, 188–189. English meanings are condensed. Grammar usage hints in parentheses are not part of spelling answers; suffix entries retain `〜`. A repeated word in different lessons remains a separate entry.

Verification: `node --test tests/japanese.test.cjs`. Browser QA covers flashcard flip, unknown-only rounds and completion, incorrect/correct spelling and repeat rounds, narrow layout, and navigation to/from the initialized tracker. Full video analysis was not repeated with an experimental recording.
