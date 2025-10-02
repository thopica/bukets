// All quiz data with answers (server-side only)
export const quizzes = [
  {
    "title": "All-Time Scoring Leaders",
    "description": "Name the top 6 scorers in NBA history (regular season)",
    "answers": [
      { "rank": 1, "name": "LeBron James", "stat": "42,184 points", "aliases": ["lebron", "lbj", "king james"] },
      { "rank": 2, "name": "Kareem Abdul-Jabbar", "stat": "38,387 points", "aliases": ["kareem", "abdul jabbar", "abdul-jabbar"] },
      { "rank": 3, "name": "Karl Malone", "stat": "36,928 points", "aliases": ["malone", "mailman"] },
      { "rank": 4, "name": "Kobe Bryant", "stat": "33,643 points", "aliases": ["kobe", "black mamba"] },
      { "rank": 5, "name": "Michael Jordan", "stat": "32,292 points", "aliases": ["mj", "jordan", "goat"] },
      { "rank": 6, "name": "Dirk Nowitzki", "stat": "31,560 points", "aliases": ["dirk", "nowitzki"] }
    ],
    "hints": [
      { "rank": 1, "text": "Active player at age 40, all-time leading scorer" },
      { "rank": 2, "text": "Legendary Lakers center, famous for skyhook" },
      { "rank": 3, "text": "Power forward nicknamed 'The Mailman'" },
      { "rank": 4, "text": "Lakers icon, wore #24 and #8" },
      { "rank": 5, "text": "6× Finals MVP with Chicago Bulls" },
      { "rank": 6, "text": "German forward, Dallas Mavericks legend" }
    ]
  },
  {
    "title": "Most Career Assists",
    "description": "Name the top 6 assist leaders in NBA history",
    "answers": [
      { "rank": 1, "name": "John Stockton", "stat": "15,806 assists", "aliases": ["stockton", "john"] },
      { "rank": 2, "name": "Chris Paul", "stat": "12,499 assists", "aliases": ["cp3", "paul", "chris"] },
      { "rank": 3, "name": "Jason Kidd", "stat": "12,091 assists", "aliases": ["kidd", "jason"] },
      { "rank": 4, "name": "LeBron James", "stat": "11,584 assists", "aliases": ["lebron", "lbj", "king james"] },
      { "rank": 5, "name": "Steve Nash", "stat": "10,335 assists", "aliases": ["nash", "steve"] },
      { "rank": 6, "name": "Mark Jackson", "stat": "10,334 assists", "aliases": ["jackson", "mark"] }
    ],
    "hints": [
      { "rank": 1, "text": "Jazz legend with huge lead over second place" },
      { "rank": 2, "text": "Active point guard, passed Kidd in 2024-25" },
      { "rank": 3, "text": "Triple-double machine, coached multiple teams" },
      { "rank": 4, "text": "Active player, all-around great passer" },
      { "rank": 5, "text": "Two-time MVP, Canadian point guard" },
      { "rank": 6, "text": "Former Knicks guard, now commentator" }
    ]
  },
  {
    "title": "Most Career Rebounds",
    "description": "Name the top 6 rebounders in NBA history",
    "answers": [
      { "rank": 1, "name": "Wilt Chamberlain", "stat": "23,924 rebounds", "aliases": ["wilt", "chamberlain", "stilt"] },
      { "rank": 2, "name": "Bill Russell", "stat": "21,620 rebounds", "aliases": ["russell", "bill"] },
      { "rank": 3, "name": "Kareem Abdul-Jabbar", "stat": "17,440 rebounds", "aliases": ["kareem", "abdul jabbar"] },
      { "rank": 4, "name": "Elvin Hayes", "stat": "16,279 rebounds", "aliases": ["hayes", "elvin", "big e"] },
      { "rank": 5, "name": "Moses Malone", "stat": "16,212 rebounds", "aliases": ["moses", "malone"] },
      { "rank": 6, "name": "Tim Duncan", "stat": "15,091 rebounds", "aliases": ["duncan", "tim", "big fundamental"] }
    ],
    "hints": [
      { "rank": 1, "text": "Scored 100 points in a game, dominant rebounder" },
      { "rank": 2, "text": "11-time champion, defensive master" },
      { "rank": 3, "text": "All-time scoring leader with skyhook" },
      { "rank": 4, "text": "Bullets/Rockets star, over 27,000 points" },
      { "rank": 5, "text": "3× MVP, fierce offensive rebounder" },
      { "rank": 6, "text": "5 championships with Spurs, Mr. Fundamental" }
    ]
  }
  // Note: Add remaining 27 quizzes here for production
];
