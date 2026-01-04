I have analyzed the high "Rows Read" issue and identified the cause as an inefficient index usage due to SQLite's `LIKE` operator behavior.

### Analysis
1.  **The Query**: The problematic query is:
    ```sql
    select distinct "baseCode" from "emojiKeywords" 
    where "language" = ? and "contentLower" like ?
    ```
    It performs a prefix search (e.g., `like 'abc%'`).

2.  **The Index**: The table has a composite index `emojiKeywords_language_contentLower` on `(language, contentLower, baseCode)`. This index is designed to support this query.

3.  **The Problem**: 
    - In SQLite, the `LIKE` operator is **case-insensitive** by default for ASCII characters.
    - The index on `contentLower` uses the default **BINARY collation** (case-sensitive).
    - Because of this mismatch (case-insensitive operator vs. case-sensitive index), SQLite **cannot use the index** for the prefix match part (`contentLower like ...`).
    - Instead, it uses the index only for `language = ?`, and then performs a **scan** of all rows for that language (likely ~25k rows) to check the `LIKE` condition. This explains the high "Rows Read" count.

### Solution Implemented
I have modified `src/app/[lang]/api/search/route.ts` to replace `LIKE` with `GLOB`.

-   **`GLOB` operator**: In SQLite, `GLOB` is **case-sensitive** and supports wildcards (`*` instead of `%`).
-   **Why it works**: Since `contentLower` is already lower-cased and the search term is also lower-cased (`lowerQ`), a case-sensitive search is correct. Because `GLOB` is case-sensitive, it matches the index's binary collation, allowing SQLite to perform a highly efficient **Index Range Scan**.
-   **Expected Result**: The database will now jump directly to the first matching record in the index and stop after finding the matches, reducing "Rows Read" from ~25,000 to approximately the number of matching results (e.g., < 100).

### Code Changes
-   **File**: `src/app/[lang]/api/search/route.ts`
-   **Change**: Replaced `like(column, '${lowerQ}%')` with `sql\`${column} GLOB ${lowerQ + '*'}\``.
-   **Applied to**: Both `emojiKeywords` and `emojiLanguage` queries.

This optimization leverages the existing indexes correctly without requiring any schema changes.