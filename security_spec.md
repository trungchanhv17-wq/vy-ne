# Security Specification: Deutsch Meister

## Data Invariants
1. A user can only read and write their own profile document.
2. A user can only read and write their own vocabulary list.
3. A user can only read and write their own chat messages.
4. User IDs in paths must match authenticated user UIDs.
5. Level field must be one of the defined CEFR levels.
6. Timestamps (lastActive, nextReview, timestamp) must be valid numbers (usually epoch or server-side).

## The Dirty Dozen Payloads
1. Create user profile with someone else's UID.
2. Update user profile level to 'SuperExpert' (invalid enum).
3. Read another user's profile.
4. Add a vocabulary word to another user's collection.
5. Delete another user's messages.
6. Create a message with a massive 1MB content string (denial of wallet).
7. Update `streak` to a negative value.
8. Update `mastered` status of someone else's word.
9. Inject extra fields into the `Message` object.
10. Spoof `lastActive` with a future date (though rules usually check for `request.time`).
11. Query ALL vocabulary words across all users (list without filter).
12. Modify `email` field after creation (if we decide it's immutable).

## Test Runner Logic (Draft)
The tests will verify that all unauthorized cross-user access is denied and that schema validation (types, enums, required fields) is enforced.
