-- 填充本地数据库的种子数据

-- 1. emojiType (分类)
INSERT OR IGNORE INTO emojiType (id, type, language, name, icon, createdAt) VALUES 
(1, 1, 'en', 'Smileys & People', '😀', '2024-12-04 08:34:45'),
(2, 2, 'en', 'Animals & Nature', '🐶', '2024-12-04 08:43:09'),
(3, 3, 'en', 'Food & Drink', '🍎', '2024-12-04 08:43:12'),
(4, 4, 'en', 'Activity', '⚽', '2024-12-04 08:43:15'),
(5, 5, 'en', 'Travel & Places', '🚗', '2024-12-04 08:43:18'),
(6, 6, 'en', 'Objects', '⌚', '2024-12-04 08:43:20'),
(7, 7, 'en', 'Symbols', '✅', '2024-12-04 08:43:25'),
(8, 8, 'en', 'Flags', '🇭🇺', '2024-12-04 08:43:32');

-- 2. emoji (热门表情)
INSERT OR IGNORE INTO emoji (id, code, fullCode, baseCode, diversity, type, sort, related, hot, emotion, createdAt) VALUES 
(1, '⁉️', '2049', '2049', 0, 7, 3305, '❓,❗,❕', 1, 1, '2024-11-27 06:59:39'),
(64, '❤️', '2764', '2764', 0, 7, 3208, '💙,💚,💛', 1, 1, '2024-11-27 06:59:40'),
(74, '😃', '1f603', '1f603', 0, 1, 2, '😄,😊,😉', 1, 1, '2024-11-27 06:59:40'),
(76, '😁', '1f601', '1f601', 0, 1, 4, '😄,😉,😊', 1, 1, '2024-11-27 06:59:40'),
(80, '😂', '1f602', '1f602', 0, 1, 8, '😆,🤣,😉', 1, 1, '2024-11-27 06:59:40');

-- 3. emojiLanguage (表情详情 - 英文)
INSERT OR IGNORE INTO emojiLanguage (id, fullCode, language, name, meaning, usageExample, searchTips, crossCulturalUsage, easterCulturalUsage, westernCulturalUsage, socialSetting, workSetting, createdAt, nameLower) VALUES 
(18944, '2049', 'en', 'exclamation question mark', '⁉️This emoji represents the emotions of confusion, suspicion or having doubts about something.', 'Is this really the case⁉️\nWhy did he suddenly do that⁉️', 'Hypothetical, Curiosity', 'Note degree of confusion.', 'Implicit question.', 'Direct doubt.', 'Interesting puzzles.', 'Brainstorming.', '2024-12-27 07:42:21', 'exclamation question mark'),
(19005, '2764', 'en', 'red heart', '❤️ is a red heart - shaped emoji. It is a symbol of emotions such as love, fondness, passion and romance.', 'I love you ❤️\nI''m full of love for this world ❤️', 'Heartfelt vibes, Cherished bond', 'Use cautiously in business.', 'Love and affection.', 'Symbol of love.', 'Celebrations.', 'Friendly team interactions.', '2024-12-27 07:42:21', 'red heart'),
(19016, '1f601', 'en', 'beaming face with smiling eyes', '😁 is an emoji expressing positive emotions, usually indicating a happy, cheerful and excited mood.', 'It''s such a nice day today 😁\nI''m very happy to receive the gift 😁', 'Feels, Sunny disposition', 'Positive meaning recognized.', 'Optimistic mood.', 'Cheerful emotions.', 'Friends chatting.', 'Relaxed team comms.', '2024-12-27 07:42:21', 'beaming face with smiling eyes'),
(19021, '1f603', 'en', 'grinning face with big eyes', '😃 is a very common emoji with positive significance. It is mainly used to express positive emotions such as happiness, joy, and excitement.', 'It''s such a nice day today 😃\nI have received the long - awaited gift 😃', 'On fire, Inviting demeanor', 'Use appropriately.', 'Happy and optimistic.', 'Happiness and joy.', 'Social gatherings.', 'Relaxed workplace.', '2024-12-27 07:42:21', 'grinning face with big eyes'),
(19022, '1f602', 'en', 'face with tears of joy', '😂 is a very common emoji, which is mainly used to express a kind of happy, witty and hilarious emotion.', 'I saw an extremely hilarious puppy today 😂.\nMy friend told an extremely cold joke, and I replied with 😂.', 'Savage, Comic relief', 'Humor acceptance varies.', 'Relaxed laugh.', 'Laughing heartily.', 'Chatting with friends.', 'Relaxed atmosphere.', '2024-12-27 07:42:21', 'face with tears of joy');

-- 4. emojiSearchTips (搜索提示)
INSERT OR IGNORE INTO emojiSearchTips (id, language, content, createdAt) VALUES 
(181, 'en', 'Moonlight dances on silent waves', '2024-12-26 09:02:28'),
(182, 'en', 'Whispers of autumn in the breeze', '2024-12-26 09:02:28'),
(183, 'en', 'Shadows lurking in twilight corners', '2024-12-26 09:02:28'),
(184, 'en', 'Laughter echoing through ancient halls', '2024-12-26 09:02:28'),
(185, 'en', 'Tears mingling with summer rain', '2024-12-26 09:02:28'),
(186, 'en', 'Dreams woven into starry skies', '2024-12-26 09:02:28'),
(187, 'en', 'Secrets buried under fallen leaves', '2024-12-26 09:02:28'),
(188, 'en', 'Echoes of forgotten melodies', '2024-12-26 09:02:28'),
(189, 'en', 'Glimpses of dawn on peaks', '2024-12-26 09:02:28'),
(190, 'en', 'Sighs of the old forest', '2024-12-26 09:02:28');
