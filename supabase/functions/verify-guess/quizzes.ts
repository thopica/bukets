// All quiz data with answers (server-side only)
// START_DATE: October 2, 2025 - Quizzes cycle every 30 days
export const quizzes = [
  // Quiz #0 - Presented on: October 2, 2025 (and every 30 days after)
  {
    "title": "All-Time Scoring Leaders",
    "description": "Name the top 6 scorers in NBA history (regular season)",
    "answers": [
      { "rank": 1, "name": "LeBron James", "stat": "42,184 points", "aliases": ["lebron", "lbj", "king james", "bron", "the king", "lebron james", "le bron", "lebronjames"] },
      { "rank": 2, "name": "Kareem Abdul-Jabbar", "stat": "38,387 points", "aliases": ["kareem", "abdul jabbar", "abdul-jabbar", "kareem abdul jabbar", "jabbar", "cap", "the captain", "kareem abduljabbar"] },
      { "rank": 3, "name": "Karl Malone", "stat": "36,928 points", "aliases": ["malone", "mailman", "karl", "the mailman", "karl malone"] },
      { "rank": 4, "name": "Kobe Bryant", "stat": "33,643 points", "aliases": ["kobe", "black mamba", "mamba", "kb24", "bean", "kobe bryant"] },
      { "rank": 5, "name": "Michael Jordan", "stat": "32,292 points", "aliases": ["mj", "jordan", "goat", "mike", "air jordan", "his airness", "michael", "michael jordan"] },
      { "rank": 6, "name": "Dirk Nowitzki", "stat": "31,560 points", "aliases": ["dirk", "nowitzki", "dirk nowitzki", "nowitski", "dirk nowitski", "german jesus"] }
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
  // Quiz #1 - Presented on: October 3, 2025 (and every 30 days after)
  {
    "title": "Most Career Assists",
    "description": "Name the top 6 assist leaders in NBA history",
    "answers": [
      { "rank": 1, "name": "John Stockton", "stat": "15,806 assists", "aliases": ["stockton", "john", "john stockton"] },
      { "rank": 2, "name": "Chris Paul", "stat": "12,499 assists", "aliases": ["cp3", "paul", "chris", "chris paul", "point god", "cp 3"] },
      { "rank": 3, "name": "Jason Kidd", "stat": "12,091 assists", "aliases": ["kidd", "jason", "jason kidd", "j kidd"] },
      { "rank": 4, "name": "LeBron James", "stat": "11,584 assists", "aliases": ["lebron", "lbj", "king james", "bron", "the king", "lebron james"] },
      { "rank": 5, "name": "Steve Nash", "stat": "10,335 assists", "aliases": ["nash", "steve", "steve nash"] },
      { "rank": 6, "name": "Mark Jackson", "stat": "10,334 assists", "aliases": ["jackson", "mark", "mark jackson"] }
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
  // Quiz #2 - Presented on: October 4, 2025 (and every 30 days after)
  {
    "title": "Most Career Rebounds",
    "description": "Name the top 6 rebounders in NBA history",
    "answers": [
      { "rank": 1, "name": "Wilt Chamberlain", "stat": "23,924 rebounds", "aliases": ["wilt", "chamberlain", "stilt", "the stilt", "wilt the stilt", "wilt chamberlain"] },
      { "rank": 2, "name": "Bill Russell", "stat": "21,620 rebounds", "aliases": ["russell", "bill", "bill russell"] },
      { "rank": 3, "name": "Kareem Abdul-Jabbar", "stat": "17,440 rebounds", "aliases": ["kareem", "abdul jabbar", "abdul-jabbar", "kareem abdul jabbar", "jabbar"] },
      { "rank": 4, "name": "Elvin Hayes", "stat": "16,279 rebounds", "aliases": ["hayes", "elvin", "big e", "elvin hayes", "the big e"] },
      { "rank": 5, "name": "Moses Malone", "stat": "16,212 rebounds", "aliases": ["moses", "malone", "moses malone"] },
      { "rank": 6, "name": "Tim Duncan", "stat": "15,091 rebounds", "aliases": ["duncan", "tim", "big fundamental", "tim duncan", "the big fundamental", "timmy"] }
    ],
    "hints": [
      { "rank": 1, "text": "Scored 100 points in a game, dominant rebounder" },
      { "rank": 2, "text": "11-time champion, defensive master" },
      { "rank": 3, "text": "All-time scoring leader with skyhook" },
      { "rank": 4, "text": "Bullets/Rockets star, over 27,000 points" },
      { "rank": 5, "text": "3× MVP, fierce offensive rebounder" },
      { "rank": 6, "text": "5 championships with Spurs, Mr. Fundamental" }
    ]
  },
  // Quiz #3 - Presented on: October 5, 2025 (and every 30 days after)
  {
    "title": "Most Career Steals",
    "description": "Name the top 6 steal leaders in NBA history",
    "answers": [
      { "rank": 1, "name": "John Stockton", "stat": "3,265 steals", "aliases": ["stockton", "john", "john stockton"] },
      { "rank": 2, "name": "Chris Paul", "stat": "2,755 steals", "aliases": ["cp3", "paul", "chris", "chris paul", "point god"] },
      { "rank": 3, "name": "Jason Kidd", "stat": "2,684 steals", "aliases": ["kidd", "jason", "jason kidd"] },
      { "rank": 4, "name": "Michael Jordan", "stat": "2,514 steals", "aliases": ["mj", "jordan", "goat", "mike", "michael", "michael jordan", "air jordan"] },
      { "rank": 5, "name": "Gary Payton", "stat": "2,445 steals", "aliases": ["payton", "gary", "glove", "the glove", "gary payton", "gp"] },
      { "rank": 6, "name": "Maurice Cheeks", "stat": "2,310 steals", "aliases": ["cheeks", "maurice", "mo", "maurice cheeks", "mo cheeks"] }
    ],
    "hints": [
      { "rank": 1, "text": "Jazz point guard, also assist leader" },
      { "rank": 2, "text": "Active defensive maestro, 'Point God'" },
      { "rank": 3, "text": "Nets and Mavericks legend, great defender" },
      { "rank": 4, "text": "Bulls legend, 3× Steals champion" },
      { "rank": 5, "text": "Defensive specialist nicknamed 'The Glove'" },
      { "rank": 6, "text": "76ers guard, 4× All-Defensive Team" }
    ]
  },
  // Quiz #4 - Presented on: October 6, 2025 (and every 30 days after)
  {
    "title": "Most Career Blocks",
    "description": "Name the top 6 shot blockers in NBA history",
    "answers": [
      { "rank": 1, "name": "Hakeem Olajuwon", "stat": "3,830 blocks", "aliases": ["hakeem", "olajuwon", "dream", "the dream", "hakeem olajuwon", "akeem"] },
      { "rank": 2, "name": "Dikembe Mutombo", "stat": "3,289 blocks", "aliases": ["mutombo", "dikembe", "deke", "dikembe mutombo", "mutumbo"] },
      { "rank": 3, "name": "Kareem Abdul-Jabbar", "stat": "3,189 blocks", "aliases": ["kareem", "abdul jabbar", "abdul-jabbar", "kareem abdul jabbar", "jabbar"] },
      { "rank": 4, "name": "Mark Eaton", "stat": "3,064 blocks", "aliases": ["eaton", "mark", "mark eaton"] },
      { "rank": 5, "name": "Tim Duncan", "stat": "3,020 blocks", "aliases": ["duncan", "tim", "big fundamental", "tim duncan", "the big fundamental", "timmy"] },
      { "rank": 6, "name": "David Robinson", "stat": "2,954 blocks", "aliases": ["robinson", "david", "admiral", "the admiral", "david robinson"] }
    ],
    "hints": [
      { "rank": 1, "text": "Rockets center, 'The Dream', 2× champion" },
      { "rank": 2, "text": "Finger wag celebration, 4× DPOY" },
      { "rank": 3, "text": "Lakers legend with the skyhook" },
      { "rank": 4, "text": "7'4\" Jazz center, 4× Blocks champion" },
      { "rank": 5, "text": "Spurs power forward, 5× champion" },
      { "rank": 6, "text": "Spurs center, 'The Admiral', MVP 1995" }
    ]
  },
  // Quiz #5 - Presented on: October 7, 2025 (and every 30 days after)
  {
    "title": "Most 3-Pointers Made",
    "description": "Name the top 6 three-point shooters in NBA history",
    "answers": [
      { "rank": 1, "name": "Stephen Curry", "stat": "3,867 threes", "aliases": ["curry", "steph", "stephen", "stephen curry", "chef curry", "wardell"] },
      { "rank": 2, "name": "Ray Allen", "stat": "2,973 threes", "aliases": ["allen", "ray", "jesus shuttlesworth", "ray allen", "shuttlesworth"] },
      { "rank": 3, "name": "James Harden", "stat": "2,986 threes", "aliases": ["harden", "james", "beard", "the beard", "james harden"] },
      { "rank": 4, "name": "Damian Lillard", "stat": "2,673 threes", "aliases": ["lillard", "dame", "damian", "dame time", "damian lillard", "dame dolla"] },
      { "rank": 5, "name": "Reggie Miller", "stat": "2,560 threes", "aliases": ["miller", "reggie", "reggie miller"] },
      { "rank": 6, "name": "Kyle Korver", "stat": "2,450 threes", "aliases": ["korver", "kyle", "kyle korver"] }
    ],
    "hints": [
      { "rank": 1, "text": "Warriors legend, changed the game forever" },
      { "rank": 2, "text": "Clutch shooter, made famous Finals shot 2013" },
      { "rank": 3, "text": "Step-back master, former Rockets MVP" },
      { "rank": 4, "text": "Blazers and Bucks guard, 'Dame Time'" },
      { "rank": 5, "text": "Pacers sharpshooter, rivalry with Knicks" },
      { "rank": 6, "text": "47% career 3P%, elite spot-up shooter" }
    ]
  },
  // Quiz #6 - Presented on: October 8, 2025 (and every 30 days after)
  {
    "title": "Most NBA Championships (Players)",
    "description": "Name the top 6 players with most championship rings",
    "answers": [
      { "rank": 1, "name": "Bill Russell", "stat": "11 championships", "aliases": ["russell", "bill", "bill russell"] },
      { "rank": 2, "name": "Sam Jones", "stat": "10 championships", "aliases": ["jones", "sam", "samuel", "sam jones", "samuel jones"] },
      { "rank": 3, "name": "John Havlicek", "stat": "8 championships", "aliases": ["havlicek", "john", "hondo", "john havlicek"] },
      { "rank": 4, "name": "Tom Heinsohn", "stat": "8 championships", "aliases": ["heinsohn", "tom", "tommy", "tom heinsohn", "tommy heinsohn"] },
      { "rank": 5, "name": "K.C. Jones", "stat": "8 championships", "aliases": ["jones", "kc", "k.c.", "kc jones", "k.c. jones"] },
      { "rank": 6, "name": "Satch Sanders", "stat": "8 championships", "aliases": ["sanders", "satch", "tom sanders", "satch sanders"] }
    ],
    "hints": [
      { "rank": 1, "text": "Celtics legend, unprecedented 11 rings" },
      { "rank": 2, "text": "Celtics guard, clutch shooter in 1960s" },
      { "rank": 3, "text": "Celtics legend, 'Hondo', 8 championships" },
      { "rank": 4, "text": "Player and coach for Celtics dynasty" },
      { "rank": 5, "text": "Point guard for Celtics, also a coach" },
      { "rank": 6, "text": "Defensive specialist for Celtics dynasty" }
    ]
  },
  // Quiz #7 - Presented on: October 9, 2025 (and every 30 days after)
  {
    "title": "Most MVP Awards",
    "description": "Name the top 6 players with most regular season MVP awards",
    "answers": [
      { "rank": 1, "name": "Kareem Abdul-Jabbar", "stat": "6 MVPs", "aliases": ["kareem", "abdul jabbar", "abdul-jabbar", "kareem abdul jabbar", "jabbar"] },
      { "rank": 2, "name": "Michael Jordan", "stat": "5 MVPs", "aliases": ["mj", "jordan", "goat", "mike", "michael", "michael jordan"] },
      { "rank": 3, "name": "Bill Russell", "stat": "5 MVPs", "aliases": ["russell", "bill", "bill russell"] },
      { "rank": 4, "name": "Wilt Chamberlain", "stat": "4 MVPs", "aliases": ["wilt", "chamberlain", "wilt chamberlain", "the stilt"] },
      { "rank": 5, "name": "LeBron James", "stat": "4 MVPs", "aliases": ["lebron", "lbj", "king james", "bron", "the king", "lebron james"] },
      { "rank": 6, "name": "Magic Johnson", "stat": "3 MVPs", "aliases": ["magic", "johnson", "earvin", "magic johnson", "earvin johnson"] }
    ],
    "hints": [
      { "rank": 1, "text": "Record 6 MVPs, Lakers and Bucks legend" },
      { "rank": 2, "text": "5 MVPs with the Bulls, 1988-1998" },
      { "rank": 3, "text": "Celtics center, 5 MVPs in the 1960s" },
      { "rank": 4, "text": "Dominant center, 4 MVPs including 3 straight" },
      { "rank": 5, "text": "4 MVPs (2 with Heat, 2 with Cavs)" },
      { "rank": 6, "text": "Showtime Lakers, 3 MVPs in 1980s" }
    ]
  },
  // Quiz #8 - Presented on: October 10, 2025 (and every 30 days after)
  {
    "title": "Most Finals MVP Awards",
    "description": "Name the top 6 players with most Finals MVP awards",
    "answers": [
      { "rank": 1, "name": "Michael Jordan", "stat": "6 Finals MVPs", "aliases": ["mj", "jordan", "goat", "mike", "michael", "michael jordan"] },
      { "rank": 2, "name": "LeBron James", "stat": "4 Finals MVPs", "aliases": ["lebron", "lbj", "king james", "bron", "the king", "lebron james"] },
      { "rank": 3, "name": "Magic Johnson", "stat": "3 Finals MVPs", "aliases": ["magic", "johnson", "earvin", "magic johnson"] },
      { "rank": 4, "name": "Shaquille O'Neal", "stat": "3 Finals MVPs", "aliases": ["shaq", "shaquille", "oneal", "o'neal", "shaquille oneal", "shaquille o'neal", "shaq oneal"] },
      { "rank": 5, "name": "Tim Duncan", "stat": "3 Finals MVPs", "aliases": ["duncan", "tim", "big fundamental", "tim duncan", "the big fundamental"] },
      { "rank": 6, "name": "Kobe Bryant", "stat": "2 Finals MVPs", "aliases": ["kobe", "black mamba", "kobe bryant", "mamba"] }
    ],
    "hints": [
      { "rank": 1, "text": "Perfect 6-0 in Finals, 6× Finals MVP" },
      { "rank": 2, "text": "4× Finals MVP with 3 different teams" },
      { "rank": 3, "text": "Showtime Lakers, won as rookie in 1980" },
      { "rank": 4, "text": "Dominant center, 3-peat with Lakers" },
      { "rank": 5, "text": "Spurs legend, steady excellence" },
      { "rank": 6, "text": "Back-to-back Finals MVP 2009-2010" }
    ]
  },
  // Quiz #9 - Presented on: October 11, 2025 (and every 30 days after)
  {
    "title": "Most All-Star Appearances",
    "description": "Name the top 6 players with most All-Star selections",
    "answers": [
      { "rank": 1, "name": "LeBron James", "stat": "20 All-Stars", "aliases": ["lebron", "lbj", "king james", "bron", "the king", "lebron james"] },
      { "rank": 2, "name": "Kareem Abdul-Jabbar", "stat": "19 All-Stars", "aliases": ["kareem", "abdul jabbar", "abdul-jabbar", "kareem abdul jabbar", "jabbar"] },
      { "rank": 3, "name": "Kobe Bryant", "stat": "18 All-Stars", "aliases": ["kobe", "black mamba", "kobe bryant", "mamba"] },
      { "rank": 4, "name": "Tim Duncan", "stat": "15 All-Stars", "aliases": ["duncan", "tim", "tim duncan", "big fundamental"] },
      { "rank": 5, "name": "Kevin Garnett", "stat": "15 All-Stars", "aliases": ["garnett", "kg", "kevin", "kevin garnett", "the big ticket", "big ticket"] },
      { "rank": 6, "name": "Shaquille O'Neal", "stat": "15 All-Stars", "aliases": ["shaq", "shaquille", "oneal", "o'neal", "shaquille oneal", "shaquille o'neal"] }
    ],
    "hints": [
      { "rank": 1, "text": "Active player, 20 All-Star selections" },
      { "rank": 2, "text": "19 selections from 1970-1989" },
      { "rank": 3, "text": "18 All-Star games as a Laker" },
      { "rank": 4, "text": "Spurs legend, 15 selections" },
      { "rank": 5, "text": "Intense power forward, 'The Big Ticket'" },
      { "rank": 6, "text": "Dominant center, 15 selections" }
    ]
  },
  // Quiz #10 - Presented on: October 12, 2025 (and every 30 days after)
  {
    "title": "Highest Career PPG",
    "description": "Name the top 6 players with highest career points per game",
    "answers": [
      { "rank": 1, "name": "Michael Jordan", "stat": "30.1 PPG", "aliases": ["mj", "jordan", "goat", "mike", "michael", "michael jordan"] },
      { "rank": 2, "name": "Wilt Chamberlain", "stat": "30.1 PPG", "aliases": ["wilt", "chamberlain", "wilt chamberlain", "the stilt"] },
      { "rank": 3, "name": "Elgin Baylor", "stat": "27.4 PPG", "aliases": ["baylor", "elgin", "elgin baylor"] },
      { "rank": 4, "name": "Kevin Durant", "stat": "27.3 PPG", "aliases": ["durant", "kd", "kevin", "kevin durant", "slim reaper", "the servant"] },
      { "rank": 5, "name": "LeBron James", "stat": "27.2 PPG", "aliases": ["lebron", "lbj", "king james", "bron", "the king", "lebron james"] },
      { "rank": 6, "name": "Jerry West", "stat": "27.0 PPG", "aliases": ["west", "jerry", "logo", "the logo", "jerry west", "mr clutch"] }
    ],
    "hints": [
      { "rank": 1, "text": "Bulls legend, 10× scoring champion" },
      { "rank": 2, "text": "Averaged 50 PPG in a season" },
      { "rank": 3, "text": "Lakers forward from 1958-1971" },
      { "rank": 4, "text": "Active scorer, 4× scoring champion" },
      { "rank": 5, "text": "All-time leading scorer, still active" },
      { "rank": 6, "text": "Lakers guard, 'The Logo', clutch scorer" }
    ]
  },
  // Quiz #11 - Presented on: October 13, 2025 (and every 30 days after)
  {
    "title": "Most Triple-Doubles",
    "description": "Name the top 6 players with most career triple-doubles",
    "answers": [
      { "rank": 1, "name": "Russell Westbrook", "stat": "200 triple-doubles", "aliases": ["westbrook", "russ", "russell", "russell westbrook", "brodie"] },
      { "rank": 2, "name": "Oscar Robertson", "stat": "181 triple-doubles", "aliases": ["robertson", "oscar", "big o", "the big o", "oscar robertson"] },
      { "rank": 3, "name": "Magic Johnson", "stat": "138 triple-doubles", "aliases": ["magic", "johnson", "earvin", "magic johnson"] },
      { "rank": 4, "name": "LeBron James", "stat": "117 triple-doubles", "aliases": ["lebron", "lbj", "king james", "bron", "the king", "lebron james"] },
      { "rank": 5, "name": "Nikola Jokic", "stat": "145 triple-doubles", "aliases": ["jokic", "nikola", "joker", "the joker", "nikola jokic", "jokić"] },
      { "rank": 6, "name": "Jason Kidd", "stat": "107 triple-doubles", "aliases": ["kidd", "jason", "jason kidd", "j kidd"] }
    ],
    "hints": [
      { "rank": 1, "text": "Former MVP, broke Oscar's record in 2021" },
      { "rank": 2, "text": "Averaged triple-double in 1961-62 season" },
      { "rank": 3, "text": "Showtime Lakers point guard" },
      { "rank": 4, "text": "All-around superstar, active player" },
      { "rank": 5, "text": "Active center, 3× MVP, elite passer" },
      { "rank": 6, "text": "Point guard, great all-around player" }
    ]
  },
  // Quiz #12 - Presented on: October 14, 2025 (and every 30 days after)
  {
    "title": "Most Career Games Played",
    "description": "Name the top 6 players with most games played",
    "answers": [
      { "rank": 1, "name": "Robert Parish", "stat": "1,611 games", "aliases": ["parish", "robert", "chief", "the chief", "robert parish"] },
      { "rank": 2, "name": "Kareem Abdul-Jabbar", "stat": "1,560 games", "aliases": ["kareem", "abdul jabbar", "abdul-jabbar", "kareem abdul jabbar", "jabbar"] },
      { "rank": 3, "name": "Vince Carter", "stat": "1,541 games", "aliases": ["carter", "vince", "vinsanity", "vince carter", "half man half amazing"] },
      { "rank": 4, "name": "Dirk Nowitzki", "stat": "1,522 games", "aliases": ["dirk", "nowitzki", "dirk nowitzki", "nowitski"] },
      { "rank": 5, "name": "John Stockton", "stat": "1,504 games", "aliases": ["stockton", "john", "john stockton"] },
      { "rank": 6, "name": "LeBron James", "stat": "1,492 games", "aliases": ["lebron", "lbj", "king james", "bron", "the king", "lebron james"] }
    ],
    "hints": [
      { "rank": 1, "text": "Celtics center, 'The Chief', 21 seasons" },
      { "rank": 2, "text": "Played 20 seasons, mostly with Lakers" },
      { "rank": 3, "text": "Played record 22 seasons, dunking legend" },
      { "rank": 4, "text": "One-team player, 21 seasons with Mavs" },
      { "rank": 5, "text": "Jazz legend, never missed playoffs" },
      { "rank": 6, "text": "Active at 40, still adding to total" }
    ]
  },
  // Quiz #13 - Presented on: October 15, 2025 (and every 30 days after)
  {
    "title": "Most Career Minutes Played",
    "description": "Name the top 6 players with most career minutes",
    "answers": [
      { "rank": 1, "name": "Kareem Abdul-Jabbar", "stat": "57,446 minutes", "aliases": ["kareem", "abdul jabbar", "abdul-jabbar", "kareem abdul jabbar", "jabbar"] },
      { "rank": 2, "name": "LeBron James", "stat": "57,979 minutes", "aliases": ["lebron", "lbj", "king james", "bron", "the king", "lebron james"] },
      { "rank": 3, "name": "Karl Malone", "stat": "54,852 minutes", "aliases": ["malone", "mailman", "karl", "the mailman", "karl malone"] },
      { "rank": 4, "name": "Dirk Nowitzki", "stat": "51,368 minutes", "aliases": ["dirk", "nowitzki", "dirk nowitzki", "nowitski"] },
      { "rank": 5, "name": "Kobe Bryant", "stat": "48,637 minutes", "aliases": ["kobe", "black mamba", "kobe bryant", "mamba"] },
      { "rank": 6, "name": "Tim Duncan", "stat": "47,368 minutes", "aliases": ["duncan", "tim", "tim duncan", "big fundamental"] }
    ],
    "hints": [
      { "rank": 1, "text": "20 seasons, mostly with Lakers" },
      { "rank": 2, "text": "Active player, passed Kareem in 2024" },
      { "rank": 3, "text": "Iron man, rarely missed games" },
      { "rank": 4, "text": "21 seasons all with Dallas" },
      { "rank": 5, "text": "20 seasons, all with Lakers" },
      { "rank": 6, "text": "19 seasons, all with Spurs" }
    ]
  },
  // Quiz #14 - Presented on: October 16, 2025 (and every 30 days after)
  {
    "title": "Most Career Free Throws Made",
    "description": "Name the top 6 free throw leaders in NBA history",
    "answers": [
      { "rank": 1, "name": "Karl Malone", "stat": "9,787 FT", "aliases": ["malone", "mailman", "karl", "the mailman", "karl malone"] },
      { "rank": 2, "name": "Moses Malone", "stat": "8,531 FT", "aliases": ["moses", "malone", "moses malone"] },
      { "rank": 3, "name": "LeBron James", "stat": "8,471 FT", "aliases": ["lebron", "lbj", "king james", "bron", "the king", "lebron james"] },
      { "rank": 4, "name": "Kobe Bryant", "stat": "8,378 FT", "aliases": ["kobe", "black mamba", "kobe bryant", "mamba"] },
      { "rank": 5, "name": "Oscar Robertson", "stat": "7,694 FT", "aliases": ["robertson", "oscar", "big o", "the big o", "oscar robertson"] },
      { "rank": 6, "name": "Michael Jordan", "stat": "7,327 FT", "aliases": ["mj", "jordan", "goat", "mike", "michael", "michael jordan"] }
    ],
    "hints": [
      { "rank": 1, "text": "Power forward, drew tons of fouls" },
      { "rank": 2, "text": "Aggressive offensive rebounder, 3× MVP" },
      { "rank": 3, "text": "Active player, attacks the basket" },
      { "rank": 4, "text": "Lakers guard, clutch free throw shooter" },
      { "rank": 5, "text": "Royals/Bucks legend, all-around great" },
      { "rank": 6, "text": "Bulls legend, clutch at the line" }
    ]
  },
  // Quiz #15 - Presented on: October 17, 2025 (and every 30 days after)
  {
    "title": "Most Career Field Goals Made",
    "description": "Name the top 6 players with most field goals made",
    "answers": [
      { "rank": 1, "name": "LeBron James", "stat": "15,726 FG", "aliases": ["lebron", "lbj", "king james", "bron", "the king", "lebron james"] },
      { "rank": 2, "name": "Kareem Abdul-Jabbar", "stat": "15,837 FG", "aliases": ["kareem", "abdul jabbar", "abdul-jabbar", "kareem abdul jabbar", "jabbar"] },
      { "rank": 3, "name": "Karl Malone", "stat": "13,528 FG", "aliases": ["malone", "mailman", "karl", "the mailman", "karl malone"] },
      { "rank": 4, "name": "Wilt Chamberlain", "stat": "12,681 FG", "aliases": ["wilt", "chamberlain", "wilt chamberlain", "the stilt"] },
      { "rank": 5, "name": "Michael Jordan", "stat": "12,192 FG", "aliases": ["mj", "jordan", "goat", "mike", "michael", "michael jordan"] },
      { "rank": 6, "name": "Kobe Bryant", "stat": "11,719 FG", "aliases": ["kobe", "black mamba", "kobe bryant", "mamba"] }
    ],
    "hints": [
      { "rank": 1, "text": "Active player, all-time scoring leader" },
      { "rank": 2, "text": "Skyhook was unstoppable" },
      { "rank": 3, "text": "The Mailman always delivered" },
      { "rank": 4, "text": "Dominant scorer, 100-point game" },
      { "rank": 5, "text": "Bulls legend, efficient scorer" },
      { "rank": 6, "text": "Lakers icon, tough shot-maker" }
    ]
  },
  // Quiz #16 - Presented on: October 18, 2025 (and every 30 days after)
  {
    "title": "Most Career Turnovers",
    "description": "Name the top 6 players with most career turnovers",
    "answers": [
      { "rank": 1, "name": "LeBron James", "stat": "5,366 TO", "aliases": ["lebron", "lbj", "king james", "bron", "the king", "lebron james"] },
      { "rank": 2, "name": "Russell Westbrook", "stat": "4,650 TO", "aliases": ["westbrook", "russ", "russell", "russell westbrook", "brodie"] },
      { "rank": 3, "name": "Karl Malone", "stat": "4,524 TO", "aliases": ["malone", "mailman", "karl", "the mailman", "karl malone"] },
      { "rank": 4, "name": "Moses Malone", "stat": "4,264 TO", "aliases": ["moses", "malone", "moses malone"] },
      { "rank": 5, "name": "John Stockton", "stat": "4,244 TO", "aliases": ["stockton", "john", "john stockton"] },
      { "rank": 6, "name": "Kobe Bryant", "stat": "4,010 TO", "aliases": ["kobe", "black mamba", "kobe bryant", "mamba"] }
    ],
    "hints": [
      { "rank": 1, "text": "Active player, high usage rate" },
      { "rank": 2, "text": "Aggressive point guard, high pace" },
      { "rank": 3, "text": "18-year career, touched ball often" },
      { "rank": 4, "text": "Offensive rebounder, tough style" },
      { "rank": 5, "text": "Jazz legend, high assist rate" },
      { "rank": 6, "text": "High volume scorer, tough shots" }
    ]
  },
  // Quiz #17 - Presented on: October 19, 2025 (and every 30 days after)
  {
    "title": "Most Career Personal Fouls",
    "description": "Name the top 6 players with most career personal fouls",
    "answers": [
      { "rank": 1, "name": "Kareem Abdul-Jabbar", "stat": "4,657 PF", "aliases": ["kareem", "abdul jabbar", "abdul-jabbar", "kareem abdul jabbar", "jabbar"] },
      { "rank": 2, "name": "Karl Malone", "stat": "4,578 PF", "aliases": ["malone", "mailman", "karl", "the mailman", "karl malone"] },
      { "rank": 3, "name": "Robert Parish", "stat": "4,443 PF", "aliases": ["parish", "robert", "chief", "the chief", "robert parish"] },
      { "rank": 4, "name": "Charles Oakley", "stat": "4,421 PF", "aliases": ["oakley", "charles", "charles oakley", "oak"] },
      { "rank": 5, "name": "Hakeem Olajuwon", "stat": "4,383 PF", "aliases": ["hakeem", "olajuwon", "dream", "the dream", "hakeem olajuwon"] },
      { "rank": 6, "name": "Buck Williams", "stat": "4,267 PF", "aliases": ["williams", "buck", "buck williams"] }
    ],
    "hints": [
      { "rank": 1, "text": "20-year career, lots of games played" },
      { "rank": 2, "text": "Physical power forward, 19 seasons" },
      { "rank": 3, "text": "Enforcer center, 21 seasons" },
      { "rank": 4, "text": "Tough defender, Knicks enforcer" },
      { "rank": 5, "text": "Defensive anchor, shot blocker" },
      { "rank": 6, "text": "Physical rebounder, Nets/Blazers" }
    ]
  },
  // Quiz #18 - Presented on: October 20, 2025 (and every 30 days after)
  {
    "title": "Tallest NBA Players Ever",
    "description": "Name the 6 tallest players in NBA history",
    "answers": [
      { "rank": 1, "name": "Gheorghe Muresan", "stat": "7'7\"", "aliases": ["muresan", "gheorghe", "gheorghe muresan", "murishan"] },
      { "rank": 2, "name": "Manute Bol", "stat": "7'7\"", "aliases": ["bol", "manute", "manute bol"] },
      { "rank": 3, "name": "Yao Ming", "stat": "7'6\"", "aliases": ["yao", "ming", "yao ming"] },
      { "rank": 4, "name": "Shawn Bradley", "stat": "7'6\"", "aliases": ["bradley", "shawn", "shawn bradley"] },
      { "rank": 5, "name": "Pavel Podkolzin", "stat": "7'5\"", "aliases": ["podkolzin", "pavel", "pavel podkolzin"] },
      { "rank": 6, "name": "Chuck Nevitt", "stat": "7'5\"", "aliases": ["nevitt", "chuck", "charles", "chuck nevitt", "charles nevitt"] }
    ],
    "hints": [
      { "rank": 1, "text": "Romanian center, won MIP 1996" },
      { "rank": 2, "text": "Sudanese shot blocker, very thin" },
      { "rank": 3, "text": "Chinese legend, Hall of Famer" },
      { "rank": 4, "text": "Mavericks center, blocked many shots" },
      { "rank": 5, "text": "Russian center, played for Mavericks" },
      { "rank": 6, "text": "Journeyman center, 1980s" }
    ]
  },
  // Quiz #19 - Presented on: October 21, 2025 (and every 30 days after)
  {
    "title": "Shortest NBA Players Ever",
    "description": "Name the 6 shortest players in NBA history",
    "answers": [
      { "rank": 1, "name": "Muggsy Bogues", "stat": "5'3\"", "aliases": ["bogues", "muggsy", "muggsy bogues", "tyrone bogues"] },
      { "rank": 2, "name": "Earl Boykins", "stat": "5'5\"", "aliases": ["boykins", "earl", "earl boykins"] },
      { "rank": 3, "name": "Mel Hirsch", "stat": "5'6\"", "aliases": ["hirsch", "mel", "mel hirsch"] },
      { "rank": 4, "name": "Spud Webb", "stat": "5'6\"", "aliases": ["webb", "spud", "spud webb", "anthony webb"] },
      { "rank": 5, "name": "Greg Grant", "stat": "5'7\"", "aliases": ["grant", "greg", "greg grant"] },
      { "rank": 6, "name": "Keith Jennings", "stat": "5'7\"", "aliases": ["jennings", "keith", "keith jennings"] }
    ],
    "hints": [
      { "rank": 1, "text": "Hornets guard, 14-year career" },
      { "rank": 2, "text": "Journeyman guard, 10 teams" },
      { "rank": 3, "text": "Played in 1940s for Boston" },
      { "rank": 4, "text": "Won 1986 Slam Dunk Contest" },
      { "rank": 5, "text": "Played for 76ers in early 90s" },
      { "rank": 6, "text": "Warriors guard in early 90s" }
    ]
  },
  // Quiz #20 - Presented on: October 22, 2025 (and every 30 days after)
  {
    "title": "Most Career Double-Doubles",
    "description": "Name the top 6 players with most career double-doubles",
    "answers": [
      { "rank": 1, "name": "Tim Duncan", "stat": "841 double-doubles", "aliases": ["duncan", "tim", "tim duncan", "big fundamental", "the big fundamental"] },
      { "rank": 2, "name": "Karl Malone", "stat": "814 double-doubles", "aliases": ["malone", "mailman", "karl", "the mailman", "karl malone"] },
      { "rank": 3, "name": "Kevin Garnett", "stat": "742 double-doubles", "aliases": ["garnett", "kg", "kevin", "kevin garnett", "the big ticket"] },
      { "rank": 4, "name": "Dwight Howard", "stat": "703 double-doubles", "aliases": ["howard", "dwight", "dwight howard", "superman"] },
      { "rank": 5, "name": "Shaquille O'Neal", "stat": "727 double-doubles", "aliases": ["shaq", "shaquille", "oneal", "o'neal", "shaquille oneal", "shaquille o'neal"] },
      { "rank": 6, "name": "Wilt Chamberlain", "stat": "860 double-doubles", "aliases": ["wilt", "chamberlain", "wilt chamberlain", "the stilt"] }
    ],
    "hints": [
      { "rank": 1, "text": "Spurs legend, consistent excellence" },
      { "rank": 2, "text": "The Mailman, rarely had off nights" },
      { "rank": 3, "text": "Intense competitor, all-around great" },
      { "rank": 4, "text": "Dominant center in 2000s-2010s" },
      { "rank": 5, "text": "Lakers/Heat center, unstoppable" },
      { "rank": 6, "text": "Statistical monster from 1960s" }
    ]
  },
  // Quiz #21 - Presented on: October 23, 2025 (and every 30 days after)
  {
    "title": "Most Career Playoff Points",
    "description": "Name the top 6 playoff scoring leaders",
    "answers": [
      { "rank": 1, "name": "LeBron James", "stat": "8,162 points", "aliases": ["lebron", "lbj", "king james", "bron", "the king", "lebron james"] },
      { "rank": 2, "name": "Michael Jordan", "stat": "5,987 points", "aliases": ["mj", "jordan", "goat", "mike", "michael", "michael jordan"] },
      { "rank": 3, "name": "Kareem Abdul-Jabbar", "stat": "5,762 points", "aliases": ["kareem", "abdul jabbar", "abdul-jabbar", "kareem abdul jabbar", "jabbar"] },
      { "rank": 4, "name": "Kobe Bryant", "stat": "5,640 points", "aliases": ["kobe", "black mamba", "kobe bryant", "mamba"] },
      { "rank": 5, "name": "Shaquille O'Neal", "stat": "5,250 points", "aliases": ["shaq", "shaquille", "oneal", "o'neal", "shaquille oneal", "shaquille o'neal"] },
      { "rank": 6, "name": "Tim Duncan", "stat": "5,172 points", "aliases": ["duncan", "tim", "tim duncan", "big fundamental"] }
    ],
    "hints": [
      { "rank": 1, "text": "Active player, deep playoff runs" },
      { "rank": 2, "text": "6 championships, playoff legend" },
      { "rank": 3, "text": "18 playoff appearances" },
      { "rank": 4, "text": "5 championships with Lakers" },
      { "rank": 5, "text": "Dominant in 3-peat years" },
      { "rank": 6, "text": "5 championships, Mr. Consistent" }
    ]
  },
  // Quiz #22 - Presented on: October 24, 2025 (and every 30 days after)
  {
    "title": "Most Career Playoff Assists",
    "description": "Name the top 6 playoff assist leaders",
    "answers": [
      { "rank": 1, "name": "LeBron James", "stat": "2,253 assists", "aliases": ["lebron", "lbj", "king james", "bron", "the king", "lebron james"] },
      { "rank": 2, "name": "Magic Johnson", "stat": "2,346 assists", "aliases": ["magic", "johnson", "earvin", "magic johnson"] },
      { "rank": 3, "name": "John Stockton", "stat": "1,839 assists", "aliases": ["stockton", "john", "john stockton"] },
      { "rank": 4, "name": "Jason Kidd", "stat": "1,263 assists", "aliases": ["kidd", "jason", "jason kidd"] },
      { "rank": 5, "name": "Chris Paul", "stat": "1,207 assists", "aliases": ["cp3", "paul", "chris", "chris paul", "point god"] },
      { "rank": 6, "name": "Tony Parker", "stat": "1,143 assists", "aliases": ["parker", "tony", "tony parker"] }
    ],
    "hints": [
      { "rank": 1, "text": "Active player, elite playoff passer" },
      { "rank": 2, "text": "Showtime Lakers, 5 championships" },
      { "rank": 3, "text": "Jazz legend, great playoff runs" },
      { "rank": 4, "text": "Nets/Mavericks, NBA champion 2011" },
      { "rank": 5, "text": "Active player, elite floor general" },
      { "rank": 6, "text": "Spurs point guard, 4 championships" }
    ]
  },
  // Quiz #23 - Presented on: October 25, 2025 (and every 30 days after)
  {
    "title": "Most Career Playoff Rebounds",
    "description": "Name the top 6 playoff rebounding leaders",
    "answers": [
      { "rank": 1, "name": "Bill Russell", "stat": "4,104 rebounds", "aliases": ["russell", "bill", "bill russell"] },
      { "rank": 2, "name": "Wilt Chamberlain", "stat": "3,913 rebounds", "aliases": ["wilt", "chamberlain", "wilt chamberlain", "the stilt"] },
      { "rank": 3, "name": "Tim Duncan", "stat": "2,859 rebounds", "aliases": ["duncan", "tim", "tim duncan", "big fundamental"] },
      { "rank": 4, "name": "Kareem Abdul-Jabbar", "stat": "2,481 rebounds", "aliases": ["kareem", "abdul jabbar", "abdul-jabbar", "kareem abdul jabbar", "jabbar"] },
      { "rank": 5, "name": "Shaquille O'Neal", "stat": "2,508 rebounds", "aliases": ["shaq", "shaquille", "oneal", "o'neal", "shaquille oneal", "shaquille o'neal"] },
      { "rank": 6, "name": "LeBron James", "stat": "2,542 rebounds", "aliases": ["lebron", "lbj", "king james", "bron", "the king", "lebron james"] }
    ],
    "hints": [
      { "rank": 1, "text": "11 championships, defensive master" },
      { "rank": 2, "text": "Dominant rebounder in playoffs" },
      { "rank": 3, "text": "Spurs legend, consistent glass work" },
      { "rank": 4, "text": "18 playoff appearances" },
      { "rank": 5, "text": "Dominant center, 4 championships" },
      { "rank": 6, "text": "Active player, all-around great" }
    ]
  },
  // Quiz #24 - Presented on: October 26, 2025 (and every 30 days after)
  {
    "title": "Youngest NBA MVPs",
    "description": "Name the 6 youngest players to win MVP",
    "answers": [
      { "rank": 1, "name": "Derrick Rose", "stat": "22 years old", "aliases": ["rose", "derrick", "derrick rose", "d rose", "drose"] },
      { "rank": 2, "name": "Wes Unseld", "stat": "23 years old", "aliases": ["unseld", "wes", "westley", "wes unseld"] },
      { "rank": 3, "name": "Wilt Chamberlain", "stat": "23 years old", "aliases": ["wilt", "chamberlain", "wilt chamberlain", "the stilt"] },
      { "rank": 4, "name": "LeBron James", "stat": "24 years old", "aliases": ["lebron", "lbj", "king james", "bron", "the king", "lebron james"] },
      { "rank": 5, "name": "Kevin Durant", "stat": "25 years old", "aliases": ["durant", "kd", "kevin", "kevin durant", "slim reaper"] },
      { "rank": 6, "name": "Magic Johnson", "stat": "25 years old", "aliases": ["magic", "johnson", "earvin", "magic johnson"] }
    ],
    "hints": [
      { "rank": 1, "text": "Bulls guard, 2011 MVP" },
      { "rank": 2, "text": "Bullets center, 1969 MVP as rookie" },
      { "rank": 3, "text": "Dominant center, 1960 MVP" },
      { "rank": 4, "text": "Cavs forward, 2009 MVP" },
      { "rank": 5, "text": "Thunder forward, 2014 MVP" },
      { "rank": 6, "text": "Lakers guard, 1987 MVP" }
    ]
  },
  // Quiz #25 - Presented on: October 27, 2025 (and every 30 days after)
  {
    "title": "Oldest NBA Champions",
    "description": "Name the 6 oldest players to win a championship",
    "answers": [
      { "rank": 1, "name": "Nat Hickey", "stat": "45 years old", "aliases": ["hickey", "nat", "nat hickey", "nathaniel"] },
      { "rank": 2, "name": "Robert Parish", "stat": "43 years old", "aliases": ["parish", "robert", "chief", "the chief", "robert parish"] },
      { "rank": 3, "name": "Kareem Abdul-Jabbar", "stat": "42 years old", "aliases": ["kareem", "abdul jabbar", "abdul-jabbar", "kareem abdul jabbar", "jabbar"] },
      { "rank": 4, "name": "Manu Ginobili", "stat": "40 years old", "aliases": ["ginobili", "manu", "manu ginobili", "ginobilli"] },
      { "rank": 5, "name": "Tim Duncan", "stat": "40 years old", "aliases": ["duncan", "tim", "tim duncan", "big fundamental"] },
      { "rank": 6, "name": "Karl Malone", "stat": "40 years old", "aliases": ["malone", "mailman", "karl", "the mailman", "karl malone"] }
    ],
    "hints": [
      { "rank": 1, "text": "Player-coach in 1940s" },
      { "rank": 2, "text": "Won with Bulls in 1997" },
      { "rank": 3, "text": "Won with Lakers in 1988" },
      { "rank": 4, "text": "Won with Spurs in 2014" },
      { "rank": 5, "text": "Won with Spurs in 2014" },
      { "rank": 6, "text": "Never won but played until 40" }
    ]
  },
  // Quiz #26 - Presented on: October 28, 2025 (and every 30 days after)
  {
    "title": "Most 50-Point Games",
    "description": "Name the top 6 players with most 50-point games",
    "answers": [
      { "rank": 1, "name": "Wilt Chamberlain", "stat": "118 games", "aliases": ["wilt", "chamberlain", "wilt chamberlain", "the stilt"] },
      { "rank": 2, "name": "Michael Jordan", "stat": "31 games", "aliases": ["mj", "jordan", "goat", "mike", "michael", "michael jordan"] },
      { "rank": 3, "name": "Kobe Bryant", "stat": "25 games", "aliases": ["kobe", "black mamba", "kobe bryant", "mamba"] },
      { "rank": 4, "name": "James Harden", "stat": "23 games", "aliases": ["harden", "james", "beard", "the beard", "james harden"] },
      { "rank": 5, "name": "Elgin Baylor", "stat": "17 games", "aliases": ["baylor", "elgin", "elgin baylor"] },
      { "rank": 6, "name": "LeBron James", "stat": "14 games", "aliases": ["lebron", "lbj", "king james", "bron", "the king", "lebron james"] }
    ],
    "hints": [
      { "rank": 1, "text": "Once scored 100 in a game" },
      { "rank": 2, "text": "Bulls legend, many scoring titles" },
      { "rank": 3, "text": "Had 81-point game in 2006" },
      { "rank": 4, "text": "Rockets/76ers scorer, step-back master" },
      { "rank": 5, "text": "Lakers forward, prolific scorer" },
      { "rank": 6, "text": "Active player, all-time leading scorer" }
    ]
  },
  // Quiz #27 - Presented on: October 29, 2025 (and every 30 days after)
  {
    "title": "Most Consecutive Games Played",
    "description": "Name the top 6 players with longest consecutive games streaks",
    "answers": [
      { "rank": 1, "name": "A.C. Green", "stat": "1,192 games", "aliases": ["green", "ac", "a.c.", "ac green", "a.c. green"] },
      { "rank": 2, "name": "Randy Smith", "stat": "906 games", "aliases": ["smith", "randy", "randy smith"] },
      { "rank": 3, "name": "Johnny Kerr", "stat": "844 games", "aliases": ["kerr", "johnny", "johnny kerr", "red kerr"] },
      { "rank": 4, "name": "Buck Williams", "stat": "842 games", "aliases": ["williams", "buck", "buck williams"] },
      { "rank": 5, "name": "Dolph Schayes", "stat": "706 games", "aliases": ["schayes", "dolph", "dolph schayes"] },
      { "rank": 6, "name": "John Kerr", "stat": "844 games", "aliases": ["kerr", "john", "john kerr"] }
    ],
    "hints": [
      { "rank": 1, "text": "Lakers/Suns forward, ironman" },
      { "rank": 2, "text": "Braves/Clippers guard, 1970s-80s" },
      { "rank": 3, "text": "Syracuse center, 1950s-60s" },
      { "rank": 4, "text": "Nets/Blazers forward, tough" },
      { "rank": 5, "text": "Nationals forward, Hall of Famer" },
      { "rank": 6, "text": "Syracuse forward, 1950s-60s" }
    ]
  },
  // Quiz #28 - Presented on: October 30, 2025 (and every 30 days after)
  {
    "title": "Highest Single Season PPG",
    "description": "Name the top 6 single-season scoring averages",
    "answers": [
      { "rank": 1, "name": "Wilt Chamberlain", "stat": "50.4 PPG", "aliases": ["wilt", "chamberlain", "wilt chamberlain", "the stilt"] },
      { "rank": 2, "name": "Wilt Chamberlain", "stat": "44.8 PPG", "aliases": ["wilt", "chamberlain", "wilt chamberlain", "the stilt"] },
      { "rank": 3, "name": "Wilt Chamberlain", "stat": "38.4 PPG", "aliases": ["wilt", "chamberlain", "wilt chamberlain", "the stilt"] },
      { "rank": 4, "name": "Elgin Baylor", "stat": "38.3 PPG", "aliases": ["baylor", "elgin", "elgin baylor"] },
      { "rank": 5, "name": "Wilt Chamberlain", "stat": "37.6 PPG", "aliases": ["wilt", "chamberlain", "wilt chamberlain", "the stilt"] },
      { "rank": 6, "name": "Michael Jordan", "stat": "37.1 PPG", "aliases": ["mj", "jordan", "goat", "mike", "michael", "michael jordan"] }
    ],
    "hints": [
      { "rank": 1, "text": "1961-62 season, legendary" },
      { "rank": 2, "text": "1962-63 season, still dominant" },
      { "rank": 3, "text": "1960-61 season, rookie year" },
      { "rank": 4, "text": "1961-62 season, Lakers forward" },
      { "rank": 5, "text": "1959-60 season, first year" },
      { "rank": 6, "text": "1986-87 season, Bulls legend" }
    ]
  },
  // Quiz #29 - Presented on: October 31, 2025 (and every 30 days after)
  {
    "title": "Most Career 30-Point Games",
    "description": "Name the top 6 players with most 30-point games",
    "answers": [
      { "rank": 1, "name": "Wilt Chamberlain", "stat": "562 games", "aliases": ["wilt", "chamberlain", "wilt chamberlain", "the stilt"] },
      { "rank": 2, "name": "Michael Jordan", "stat": "562 games", "aliases": ["mj", "jordan", "goat", "mike", "michael", "michael jordan"] },
      { "rank": 3, "name": "LeBron James", "stat": "578 games", "aliases": ["lebron", "lbj", "king james", "bron", "the king", "lebron james"] },
      { "rank": 4, "name": "Kobe Bryant", "stat": "431 games", "aliases": ["kobe", "black mamba", "kobe bryant", "mamba"] },
      { "rank": 5, "name": "Karl Malone", "stat": "395 games", "aliases": ["malone", "mailman", "karl", "the mailman", "karl malone"] },
      { "rank": 6, "name": "Elgin Baylor", "stat": "378 games", "aliases": ["baylor", "elgin", "elgin baylor"] }
    ],
    "hints": [
      { "rank": 1, "text": "Dominant scorer from 1960s" },
      { "rank": 2, "text": "Bulls legend, 10 scoring titles" },
      { "rank": 3, "text": "Active player, consistent scorer" },
      { "rank": 4, "text": "Lakers icon, volume scorer" },
      { "rank": 5, "text": "The Mailman delivered nightly" },
      { "rank": 6, "text": "Lakers forward, prolific scorer" }
    ]
  }
];
