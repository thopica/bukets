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
  },
  {
    "title": "Most Career Steals",
    "description": "Name the top 6 steal leaders in NBA history",
    "answers": [
      { "rank": 1, "name": "John Stockton", "stat": "3,265 steals", "aliases": ["stockton", "john"] },
      { "rank": 2, "name": "Chris Paul", "stat": "2,755 steals", "aliases": ["cp3", "paul", "chris"] },
      { "rank": 3, "name": "Jason Kidd", "stat": "2,684 steals", "aliases": ["kidd", "jason"] },
      { "rank": 4, "name": "Michael Jordan", "stat": "2,514 steals", "aliases": ["mj", "jordan", "goat"] },
      { "rank": 5, "name": "Gary Payton", "stat": "2,445 steals", "aliases": ["payton", "gary", "glove"] },
      { "rank": 6, "name": "Maurice Cheeks", "stat": "2,310 steals", "aliases": ["cheeks", "maurice", "mo"] }
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
  {
    "title": "Most Career Blocks",
    "description": "Name the top 6 shot blockers in NBA history",
    "answers": [
      { "rank": 1, "name": "Hakeem Olajuwon", "stat": "3,830 blocks", "aliases": ["hakeem", "olajuwon", "dream"] },
      { "rank": 2, "name": "Dikembe Mutombo", "stat": "3,289 blocks", "aliases": ["mutombo", "dikembe", "deke"] },
      { "rank": 3, "name": "Kareem Abdul-Jabbar", "stat": "3,189 blocks", "aliases": ["kareem", "abdul jabbar"] },
      { "rank": 4, "name": "Mark Eaton", "stat": "3,064 blocks", "aliases": ["eaton", "mark"] },
      { "rank": 5, "name": "Tim Duncan", "stat": "3,020 blocks", "aliases": ["duncan", "tim", "big fundamental"] },
      { "rank": 6, "name": "David Robinson", "stat": "2,954 blocks", "aliases": ["robinson", "david", "admiral"] }
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
  {
    "title": "Most 3-Pointers Made",
    "description": "Name the top 6 three-point shooters in NBA history",
    "answers": [
      { "rank": 1, "name": "Stephen Curry", "stat": "3,867 threes", "aliases": ["curry", "steph", "stephen"] },
      { "rank": 2, "name": "Ray Allen", "stat": "2,973 threes", "aliases": ["allen", "ray", "jesus shuttlesworth"] },
      { "rank": 3, "name": "James Harden", "stat": "2,986 threes", "aliases": ["harden", "james", "beard"] },
      { "rank": 4, "name": "Damian Lillard", "stat": "2,673 threes", "aliases": ["lillard", "dame", "damian"] },
      { "rank": 5, "name": "Reggie Miller", "stat": "2,560 threes", "aliases": ["miller", "reggie"] },
      { "rank": 6, "name": "Kyle Korver", "stat": "2,450 threes", "aliases": ["korver", "kyle"] }
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
  {
    "title": "Most NBA Championships (Players)",
    "description": "Name the top 6 players with most championship rings",
    "answers": [
      { "rank": 1, "name": "Bill Russell", "stat": "11 championships", "aliases": ["russell", "bill"] },
      { "rank": 2, "name": "Sam Jones", "stat": "10 championships", "aliases": ["jones", "sam", "samuel"] },
      { "rank": 3, "name": "John Havlicek", "stat": "8 championships", "aliases": ["havlicek", "john", "hondo"] },
      { "rank": 4, "name": "Tom Heinsohn", "stat": "8 championships", "aliases": ["heinsohn", "tom", "tommy"] },
      { "rank": 5, "name": "K.C. Jones", "stat": "8 championships", "aliases": ["jones", "kc", "k.c."] },
      { "rank": 6, "name": "Satch Sanders", "stat": "8 championships", "aliases": ["sanders", "satch", "tom sanders"] }
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
  {
    "title": "Most MVP Awards",
    "description": "Name the top 6 players with most regular season MVP awards",
    "answers": [
      { "rank": 1, "name": "Kareem Abdul-Jabbar", "stat": "6 MVPs", "aliases": ["kareem", "abdul jabbar"] },
      { "rank": 2, "name": "Michael Jordan", "stat": "5 MVPs", "aliases": ["mj", "jordan", "goat"] },
      { "rank": 3, "name": "Bill Russell", "stat": "5 MVPs", "aliases": ["russell", "bill"] },
      { "rank": 4, "name": "Wilt Chamberlain", "stat": "4 MVPs", "aliases": ["wilt", "chamberlain"] },
      { "rank": 5, "name": "LeBron James", "stat": "4 MVPs", "aliases": ["lebron", "lbj", "king james"] },
      { "rank": 6, "name": "Magic Johnson", "stat": "3 MVPs", "aliases": ["magic", "johnson", "earvin"] }
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
  {
    "title": "Most Finals MVP Awards",
    "description": "Name the top 6 players with most Finals MVP awards",
    "answers": [
      { "rank": 1, "name": "Michael Jordan", "stat": "6 Finals MVPs", "aliases": ["mj", "jordan", "goat"] },
      { "rank": 2, "name": "LeBron James", "stat": "4 Finals MVPs", "aliases": ["lebron", "lbj", "king james"] },
      { "rank": 3, "name": "Magic Johnson", "stat": "3 Finals MVPs", "aliases": ["magic", "johnson", "earvin"] },
      { "rank": 4, "name": "Shaquille O'Neal", "stat": "3 Finals MVPs", "aliases": ["shaq", "shaquille", "oneal"] },
      { "rank": 5, "name": "Tim Duncan", "stat": "3 Finals MVPs", "aliases": ["duncan", "tim", "big fundamental"] },
      { "rank": 6, "name": "Kobe Bryant", "stat": "2 Finals MVPs", "aliases": ["kobe", "black mamba"] }
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
  {
    "title": "Most All-Star Appearances",
    "description": "Name the top 6 players with most All-Star selections",
    "answers": [
      { "rank": 1, "name": "LeBron James", "stat": "20 All-Stars", "aliases": ["lebron", "lbj", "king james"] },
      { "rank": 2, "name": "Kareem Abdul-Jabbar", "stat": "19 All-Stars", "aliases": ["kareem", "abdul jabbar"] },
      { "rank": 3, "name": "Kobe Bryant", "stat": "18 All-Stars", "aliases": ["kobe", "black mamba"] },
      { "rank": 4, "name": "Tim Duncan", "stat": "15 All-Stars", "aliases": ["duncan", "tim"] },
      { "rank": 5, "name": "Kevin Garnett", "stat": "15 All-Stars", "aliases": ["garnett", "kg", "kevin"] },
      { "rank": 6, "name": "Shaquille O'Neal", "stat": "15 All-Stars", "aliases": ["shaq", "shaquille", "oneal"] }
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
  {
    "title": "Highest Career PPG",
    "description": "Name the top 6 players with highest career points per game",
    "answers": [
      { "rank": 1, "name": "Michael Jordan", "stat": "30.1 PPG", "aliases": ["mj", "jordan", "goat"] },
      { "rank": 2, "name": "Wilt Chamberlain", "stat": "30.1 PPG", "aliases": ["wilt", "chamberlain"] },
      { "rank": 3, "name": "Elgin Baylor", "stat": "27.4 PPG", "aliases": ["baylor", "elgin"] },
      { "rank": 4, "name": "Kevin Durant", "stat": "27.3 PPG", "aliases": ["durant", "kd", "kevin"] },
      { "rank": 5, "name": "LeBron James", "stat": "27.2 PPG", "aliases": ["lebron", "lbj", "king james"] },
      { "rank": 6, "name": "Jerry West", "stat": "27.0 PPG", "aliases": ["west", "jerry", "logo"] }
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
  {
    "title": "Most Triple-Doubles",
    "description": "Name the top 6 players with most career triple-doubles",
    "answers": [
      { "rank": 1, "name": "Russell Westbrook", "stat": "200 triple-doubles", "aliases": ["westbrook", "russ", "russell"] },
      { "rank": 2, "name": "Oscar Robertson", "stat": "181 triple-doubles", "aliases": ["robertson", "oscar", "big o"] },
      { "rank": 3, "name": "Magic Johnson", "stat": "138 triple-doubles", "aliases": ["magic", "johnson", "earvin"] },
      { "rank": 4, "name": "LeBron James", "stat": "117 triple-doubles", "aliases": ["lebron", "lbj", "king james"] },
      { "rank": 5, "name": "Nikola Jokic", "stat": "145 triple-doubles", "aliases": ["jokic", "nikola", "joker"] },
      { "rank": 6, "name": "Jason Kidd", "stat": "107 triple-doubles", "aliases": ["kidd", "jason"] }
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
  {
    "title": "Most Career Games Played",
    "description": "Name the top 6 players with most games played",
    "answers": [
      { "rank": 1, "name": "Robert Parish", "stat": "1,611 games", "aliases": ["parish", "robert", "chief"] },
      { "rank": 2, "name": "Kareem Abdul-Jabbar", "stat": "1,560 games", "aliases": ["kareem", "abdul jabbar"] },
      { "rank": 3, "name": "Vince Carter", "stat": "1,541 games", "aliases": ["carter", "vince", "vinsanity"] },
      { "rank": 4, "name": "Dirk Nowitzki", "stat": "1,522 games", "aliases": ["dirk", "nowitzki"] },
      { "rank": 5, "name": "John Stockton", "stat": "1,504 games", "aliases": ["stockton", "john"] },
      { "rank": 6, "name": "LeBron James", "stat": "1,492 games", "aliases": ["lebron", "lbj", "king james"] }
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
  {
    "title": "Most Career Minutes Played",
    "description": "Name the top 6 players with most career minutes",
    "answers": [
      { "rank": 1, "name": "Kareem Abdul-Jabbar", "stat": "57,446 minutes", "aliases": ["kareem", "abdul jabbar"] },
      { "rank": 2, "name": "LeBron James", "stat": "57,979 minutes", "aliases": ["lebron", "lbj", "king james"] },
      { "rank": 3, "name": "Karl Malone", "stat": "54,852 minutes", "aliases": ["malone", "mailman"] },
      { "rank": 4, "name": "Dirk Nowitzki", "stat": "51,368 minutes", "aliases": ["dirk", "nowitzki"] },
      { "rank": 5, "name": "Kobe Bryant", "stat": "48,637 minutes", "aliases": ["kobe", "black mamba"] },
      { "rank": 6, "name": "Tim Duncan", "stat": "47,368 minutes", "aliases": ["duncan", "tim"] }
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
  {
    "title": "Most Career Free Throws Made",
    "description": "Name the top 6 free throw leaders in NBA history",
    "answers": [
      { "rank": 1, "name": "Karl Malone", "stat": "9,787 FT", "aliases": ["malone", "mailman"] },
      { "rank": 2, "name": "Moses Malone", "stat": "8,531 FT", "aliases": ["moses", "malone"] },
      { "rank": 3, "name": "LeBron James", "stat": "8,471 FT", "aliases": ["lebron", "lbj", "king james"] },
      { "rank": 4, "name": "Kobe Bryant", "stat": "8,378 FT", "aliases": ["kobe", "black mamba"] },
      { "rank": 5, "name": "Oscar Robertson", "stat": "7,694 FT", "aliases": ["robertson", "oscar", "big o"] },
      { "rank": 6, "name": "Michael Jordan", "stat": "7,327 FT", "aliases": ["mj", "jordan", "goat"] }
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
  {
    "title": "Highest Career FG%",
    "description": "Name the top 6 players with highest career field goal percentage (min 2,000 FGM)",
    "answers": [
      { "rank": 1, "name": "DeAndre Jordan", "stat": "67.4%", "aliases": ["jordan", "deandre"] },
      { "rank": 2, "name": "Rudy Gobert", "stat": "65.9%", "aliases": ["gobert", "rudy"] },
      { "rank": 3, "name": "Clint Capela", "stat": "64.8%", "aliases": ["capela", "clint"] },
      { "rank": 4, "name": "Montrezl Harrell", "stat": "62.1%", "aliases": ["harrell", "montrezl", "trez"] },
      { "rank": 5, "name": "Artis Gilmore", "stat": "59.9%", "aliases": ["gilmore", "artis", "a-train"] },
      { "rank": 6, "name": "Tyson Chandler", "stat": "59.8%", "aliases": ["chandler", "tyson"] }
    ],
    "hints": [
      { "rank": 1, "text": "Rim-running center, mostly with Clippers" },
      { "rank": 2, "text": "French center, 4× Defensive POY" },
      { "rank": 3, "text": "Swiss center, mostly with Rockets/Hawks" },
      { "rank": 4, "text": "Energy big, Sixth Man Award winner 2020" },
      { "rank": 5, "text": "ABA and NBA star from 1970s-80s" },
      { "rank": 6, "text": "Defensive center, won with Mavs in 2011" }
    ]
  },
  {
    "title": "Highest Career 3P%",
    "description": "Name the top 6 players with highest career three-point percentage (min 250 3PM)",
    "answers": [
      { "rank": 1, "name": "Steve Kerr", "stat": "45.4%", "aliases": ["kerr", "steve", "steven"] },
      { "rank": 2, "name": "Hubert Davis", "stat": "44.1%", "aliases": ["davis", "hubert"] },
      { "rank": 3, "name": "Drazen Petrovic", "stat": "43.7%", "aliases": ["petrovic", "drazen"] },
      { "rank": 4, "name": "Seth Curry", "stat": "43.5%", "aliases": ["curry", "seth"] },
      { "rank": 5, "name": "Jason Kapono", "stat": "43.4%", "aliases": ["kapono", "jason"] },
      { "rank": 6, "name": "Stephen Curry", "stat": "42.6%", "aliases": ["curry", "steph", "stephen"] }
    ],
    "hints": [
      { "rank": 1, "text": "Jordan's teammate, now Warriors coach" },
      { "rank": 2, "text": "Played in 1990s, now UNC coach" },
      { "rank": 3, "text": "Croatian legend, tragically passed 1993" },
      { "rank": 4, "text": "Sharpshooter, Steph's younger brother" },
      { "rank": 5, "text": "Won 3-point contest twice (2007, 2008)" },
      { "rank": 6, "text": "Most 3-pointers made all-time, Warriors" }
    ]
  },
  {
    "title": "Highest Career FT%",
    "description": "Name the top 6 free throw shooters in NBA history (min 1,200 FTM)",
    "answers": [
      { "rank": 1, "name": "Stephen Curry", "stat": "90.8%", "aliases": ["curry", "steph", "stephen"] },
      { "rank": 2, "name": "Steve Nash", "stat": "90.4%", "aliases": ["nash", "steve"] },
      { "rank": 3, "name": "Mark Price", "stat": "90.4%", "aliases": ["price", "mark"] },
      { "rank": 4, "name": "Peja Stojakovic", "stat": "89.5%", "aliases": ["peja", "stojakovic"] },
      { "rank": 5, "name": "Chauncey Billups", "stat": "89.4%", "aliases": ["billups", "chauncey"] },
      { "rank": 6, "name": "Ray Allen", "stat": "89.4%", "aliases": ["allen", "ray"] }
    ],
    "hints": [
      { "rank": 1, "text": "Warriors guard, best shooter ever" },
      { "rank": 2, "text": "Two-time MVP, Suns legend" },
      { "rank": 3, "text": "Cavaliers guard from late 1980s-90s" },
      { "rank": 4, "text": "Serbian forward, Kings sharpshooter" },
      { "rank": 5, "text": "Pistons champion 2004, 'Mr. Big Shot'" },
      { "rank": 6, "text": "All-time 3-point record before Curry" }
    ]
  },
  {
    "title": "Most Defensive Player of the Year Awards",
    "description": "Name the players with most Defensive Player of the Year awards",
    "answers": [
      { "rank": 1, "name": "Dikembe Mutombo", "stat": "4 DPOYs", "aliases": ["mutombo", "dikembe", "deke"] },
      { "rank": 2, "name": "Ben Wallace", "stat": "4 DPOYs", "aliases": ["wallace", "ben"] },
      { "rank": 3, "name": "Rudy Gobert", "stat": "4 DPOYs", "aliases": ["gobert", "rudy"] },
      { "rank": 4, "name": "Dwight Howard", "stat": "3 DPOYs", "aliases": ["howard", "dwight", "superman"] },
      { "rank": 5, "name": "Kawhi Leonard", "stat": "2 DPOYs", "aliases": ["kawhi", "leonard", "claw"] },
      { "rank": 6, "name": "Giannis Antetokounmpo", "stat": "1 DPOY", "aliases": ["giannis", "greek freak"] }
    ],
    "hints": [
      { "rank": 1, "text": "Shot blocker with finger wag, 1995-2001" },
      { "rank": 2, "text": "Pistons center, 'Big Ben', 2002-2006" },
      { "rank": 3, "text": "French center, 2018, 2019, 2021, 2024" },
      { "rank": 4, "text": "Athletic center, 2009-2011" },
      { "rank": 5, "text": "Two-way wing, won 2015 and 2016" },
      { "rank": 6, "text": "Greek superstar, won 2020" }
    ]
  },
  {
    "title": "Most Sixth Man of the Year Awards",
    "description": "Name the players with most Sixth Man awards",
    "answers": [
      { "rank": 1, "name": "Lou Williams", "stat": "3 awards", "aliases": ["williams", "lou", "sweet lou"] },
      { "rank": 2, "name": "Jamal Crawford", "stat": "3 awards", "aliases": ["crawford", "jamal"] },
      { "rank": 3, "name": "Detlef Schrempf", "stat": "2 awards", "aliases": ["schrempf", "detlef"] },
      { "rank": 4, "name": "Kevin McHale", "stat": "2 awards", "aliases": ["mchale", "kevin"] },
      { "rank": 5, "name": "Ricky Pierce", "stat": "2 awards", "aliases": ["pierce", "ricky"] },
      { "rank": 6, "name": "J.R. Smith", "stat": "1 award", "aliases": ["smith", "jr", "j.r."] }
    ],
    "hints": [
      { "rank": 1, "text": "Scoring guard, won 2015, 2018, 2019" },
      { "rank": 2, "text": "Crossover master, won 2010, 2014, 2016" },
      { "rank": 3, "text": "German forward, won 1991, 1992" },
      { "rank": 4, "text": "Celtics legend, won 1984, 1985" },
      { "rank": 5, "text": "Bucks scorer, won 1987, 1990" },
      { "rank": 6, "text": "Cavaliers guard, won 2013" }
    ]
  },
  {
    "title": "Most 50-Point Games",
    "description": "Name the top 6 players with most 50-point games",
    "answers": [
      { "rank": 1, "name": "Wilt Chamberlain", "stat": "118 games", "aliases": ["wilt", "chamberlain"] },
      { "rank": 2, "name": "Michael Jordan", "stat": "31 games", "aliases": ["mj", "jordan", "goat"] },
      { "rank": 3, "name": "Kobe Bryant", "stat": "25 games", "aliases": ["kobe", "black mamba"] },
      { "rank": 4, "name": "James Harden", "stat": "23 games", "aliases": ["harden", "james", "beard"] },
      { "rank": 5, "name": "LeBron James", "stat": "14 games", "aliases": ["lebron", "lbj", "king james"] },
      { "rank": 6, "name": "Damian Lillard", "stat": "12 games", "aliases": ["lillard", "dame", "damian"] }
    ],
    "hints": [
      { "rank": 1, "text": "Averaged 50 PPG for a season" },
      { "rank": 2, "text": "Bulls legend, dominant scorer" },
      { "rank": 3, "text": "Lakers guard, 81-point game" },
      { "rank": 4, "text": "Former Rockets MVP, scoring machine" },
      { "rank": 5, "text": "All-time leading scorer, consistent" },
      { "rank": 6, "text": "Blazers guard, 'Dame Time'" }
    ]
  },
  {
    "title": "Most 60-Point Games",
    "description": "Name the top 6 players with most 60-point games",
    "answers": [
      { "rank": 1, "name": "Wilt Chamberlain", "stat": "32 games", "aliases": ["wilt", "chamberlain"] },
      { "rank": 2, "name": "Kobe Bryant", "stat": "6 games", "aliases": ["kobe", "black mamba"] },
      { "rank": 3, "name": "Michael Jordan", "stat": "5 games", "aliases": ["mj", "jordan", "goat"] },
      { "rank": 4, "name": "James Harden", "stat": "4 games", "aliases": ["harden", "james", "beard"] },
      { "rank": 5, "name": "Elgin Baylor", "stat": "3 games", "aliases": ["baylor", "elgin"] },
      { "rank": 6, "name": "Damian Lillard", "stat": "3 games", "aliases": ["lillard", "dame", "damian"] }
    ],
    "hints": [
      { "rank": 1, "text": "Scored 100 points in a game" },
      { "rank": 2, "text": "Lakers legend, including 81-point game" },
      { "rank": 3, "text": "Bulls GOAT, including 69 in playoffs" },
      { "rank": 4, "text": "Rockets scorer, multiple 60+ games" },
      { "rank": 5, "text": "Lakers forward from 1960s" },
      { "rank": 6, "text": "Blazers guard with deep range" }
    ]
  },
  {
    "title": "Most Seasons Played",
    "description": "Name the top 6 players with most NBA seasons",
    "answers": [
      { "rank": 1, "name": "Vince Carter", "stat": "22 seasons", "aliases": ["carter", "vince", "vinsanity"] },
      { "rank": 2, "name": "Robert Parish", "stat": "21 seasons", "aliases": ["parish", "robert", "chief"] },
      { "rank": 3, "name": "Kevin Garnett", "stat": "21 seasons", "aliases": ["garnett", "kg", "kevin"] },
      { "rank": 4, "name": "Dirk Nowitzki", "stat": "21 seasons", "aliases": ["dirk", "nowitzki"] },
      { "rank": 5, "name": "LeBron James", "stat": "22 seasons", "aliases": ["lebron", "lbj", "king james"] },
      { "rank": 6, "name": "Kareem Abdul-Jabbar", "stat": "20 seasons", "aliases": ["kareem", "abdul jabbar"] }
    ],
    "hints": [
      { "rank": 1, "text": "Record 22 seasons, dunking legend" },
      { "rank": 2, "text": "Celtics center, 'The Chief'" },
      { "rank": 3, "text": "MVP and champion, intense competitor" },
      { "rank": 4, "text": "One-franchise player with Dallas" },
      { "rank": 5, "text": "Active at 40, still playing" },
      { "rank": 6, "text": "Skyhook legend, all-time great" }
    ]
  },
  {
    "title": "Most All-NBA First Team Selections",
    "description": "Name the top 6 players with most All-NBA First Team honors",
    "answers": [
      { "rank": 1, "name": "LeBron James", "stat": "13 selections", "aliases": ["lebron", "lbj", "king james"] },
      { "rank": 2, "name": "Kobe Bryant", "stat": "11 selections", "aliases": ["kobe", "black mamba"] },
      { "rank": 3, "name": "Karl Malone", "stat": "11 selections", "aliases": ["malone", "mailman"] },
      { "rank": 4, "name": "Michael Jordan", "stat": "10 selections", "aliases": ["mj", "jordan", "goat"] },
      { "rank": 5, "name": "Tim Duncan", "stat": "10 selections", "aliases": ["duncan", "tim"] },
      { "rank": 6, "name": "Bob Pettit", "stat": "10 selections", "aliases": ["pettit", "bob", "robert"] }
    ],
    "hints": [
      { "rank": 1, "text": "Active player, most in history" },
      { "rank": 2, "text": "Lakers legend, consistent excellence" },
      { "rank": 3, "text": "Jazz power forward, iron man" },
      { "rank": 4, "text": "Bulls legend, dominant in 1990s" },
      { "rank": 5, "text": "Spurs legend, fundamental excellence" },
      { "rank": 6, "text": "Hawks legend from 1950s-60s" }
    ]
  },
  {
    "title": "Highest Single Season PPG",
    "description": "Name the top 6 single-season scoring averages in NBA history",
    "answers": [
      { "rank": 1, "name": "Wilt Chamberlain", "stat": "50.4 PPG (1961-62)", "aliases": ["wilt", "chamberlain"] },
      { "rank": 2, "name": "Wilt Chamberlain", "stat": "44.8 PPG (1962-63)", "aliases": ["wilt", "chamberlain"] },
      { "rank": 3, "name": "Wilt Chamberlain", "stat": "38.4 PPG (1960-61)", "aliases": ["wilt", "chamberlain"] },
      { "rank": 4, "name": "Elgin Baylor", "stat": "38.3 PPG (1961-62)", "aliases": ["baylor", "elgin"] },
      { "rank": 5, "name": "Wilt Chamberlain", "stat": "37.6 PPG (1959-60)", "aliases": ["wilt", "chamberlain"] },
      { "rank": 6, "name": "Michael Jordan", "stat": "37.1 PPG (1986-87)", "aliases": ["mj", "jordan", "goat"] }
    ],
    "hints": [
      { "rank": 1, "text": "Legendary 50 PPG season, unbreakable" },
      { "rank": 2, "text": "Same player, next season" },
      { "rank": 3, "text": "Same player, previous season" },
      { "rank": 4, "text": "Lakers forward, matched Wilt's era" },
      { "rank": 5, "text": "Same player, rookie year" },
      { "rank": 6, "text": "Bulls guard, highest since 1960s" }
    ]
  },
  {
    "title": "Most Points in a Game",
    "description": "Name the top 6 single-game scoring performances",
    "answers": [
      { "rank": 1, "name": "Wilt Chamberlain", "stat": "100 points", "aliases": ["wilt", "chamberlain"] },
      { "rank": 2, "name": "Kobe Bryant", "stat": "81 points", "aliases": ["kobe", "black mamba"] },
      { "rank": 3, "name": "Wilt Chamberlain", "stat": "78 points", "aliases": ["wilt", "chamberlain"] },
      { "rank": 4, "name": "Wilt Chamberlain", "stat": "73 points", "aliases": ["wilt", "chamberlain"] },
      { "rank": 5, "name": "David Thompson", "stat": "73 points", "aliases": ["thompson", "david", "skywalker"] },
      { "rank": 6, "name": "Devin Booker", "stat": "70 points", "aliases": ["booker", "devin", "book"] }
    ],
    "hints": [
      { "rank": 1, "text": "Legendary 100-point game in 1962" },
      { "rank": 2, "text": "Lakers vs Raptors, 2006" },
      { "rank": 3, "text": "Same player as #1, 1961" },
      { "rank": 4, "text": "Same player, multiple times" },
      { "rank": 5, "text": "Nuggets guard, last game 1977-78" },
      { "rank": 6, "text": "Suns guard, 2017 vs Celtics" }
    ]
  },
  {
    "title": "Most Assists in a Game",
    "description": "Name the top 6 single-game assist performances",
    "answers": [
      { "rank": 1, "name": "Scott Skiles", "stat": "30 assists", "aliases": ["skiles", "scott"] },
      { "rank": 2, "name": "John Stockton", "stat": "28 assists", "aliases": ["stockton", "john"] },
      { "rank": 3, "name": "John Stockton", "stat": "27 assists", "aliases": ["stockton", "john"] },
      { "rank": 4, "name": "Kevin Porter", "stat": "29 assists", "aliases": ["porter", "kevin"] },
      { "rank": 5, "name": "Bob Cousy", "stat": "28 assists", "aliases": ["cousy", "bob", "houdini"] },
      { "rank": 6, "name": "Guy Rodgers", "stat": "28 assists", "aliases": ["rodgers", "guy"] }
    ],
    "hints": [
      { "rank": 1, "text": "Magic guard, record 30 assists in 1990" },
      { "rank": 2, "text": "Jazz legend, second-most in a game" },
      { "rank": 3, "text": "Same player, did it multiple times" },
      { "rank": 4, "text": "Pistons/Nets guard from 1970s-80s" },
      { "rank": 5, "text": "Celtics point guard from 1950s-60s" },
      { "rank": 6, "text": "Warriors guard from 1960s" }
    ]
  },
  {
    "title": "Most Rebounds in a Game",
    "description": "Name the top 6 single-game rebounding performances",
    "answers": [
      { "rank": 1, "name": "Wilt Chamberlain", "stat": "55 rebounds", "aliases": ["wilt", "chamberlain"] },
      { "rank": 2, "name": "Bill Russell", "stat": "51 rebounds", "aliases": ["russell", "bill"] },
      { "rank": 3, "name": "Bill Russell", "stat": "49 rebounds", "aliases": ["russell", "bill"] },
      { "rank": 4, "name": "Wilt Chamberlain", "stat": "45 rebounds", "aliases": ["wilt", "chamberlain"] },
      { "rank": 5, "name": "Wilt Chamberlain", "stat": "43 rebounds", "aliases": ["wilt", "chamberlain"] },
      { "rank": 6, "name": "Bill Russell", "stat": "43 rebounds", "aliases": ["russell", "bill"] }
    ],
    "hints": [
      { "rank": 1, "text": "Record 55 rebounds in 1960" },
      { "rank": 2, "text": "Celtics legend, 51 rebounds" },
      { "rank": 3, "text": "Same player, multiple times" },
      { "rank": 4, "text": "Wilt's 45-rebound games" },
      { "rank": 5, "text": "Same player, consistent dominance" },
      { "rank": 6, "text": "Russell again, rebounding machine" }
    ]
  },
  {
    "title": "Most All-Defensive First Team Selections",
    "description": "Name the top 6 players with most All-Defensive First Team honors",
    "answers": [
      { "rank": 1, "name": "Kobe Bryant", "stat": "9 selections", "aliases": ["kobe", "black mamba"] },
      { "rank": 2, "name": "Michael Jordan", "stat": "9 selections", "aliases": ["mj", "jordan", "goat"] },
      { "rank": 3, "name": "Gary Payton", "stat": "9 selections", "aliases": ["payton", "gary", "glove"] },
      { "rank": 4, "name": "Kevin Garnett", "stat": "9 selections", "aliases": ["garnett", "kg", "kevin"] },
      { "rank": 5, "name": "Tim Duncan", "stat": "8 selections", "aliases": ["duncan", "tim"] },
      { "rank": 6, "name": "Scottie Pippen", "stat": "8 selections", "aliases": ["pippen", "scottie"] }
    ],
    "hints": [
      { "rank": 1, "text": "Lakers guard, elite two-way player" },
      { "rank": 2, "text": "Bulls legend, defensive excellence" },
      { "rank": 3, "text": "'The Glove', shutdown defender" },
      { "rank": 4, "text": "Intense defender, 'Big Ticket'" },
      { "rank": 5, "text": "Spurs legend, anchor of defense" },
      { "rank": 6, "text": "Bulls forward, Jordan's sidekick" }
    ]
  },
  {
    "title": "Tallest Players in NBA History",
    "description": "Name the top 6 tallest players in NBA history",
    "answers": [
      { "rank": 1, "name": "Gheorghe Muresan", "stat": "7'7\"", "aliases": ["muresan", "gheorghe"] },
      { "rank": 2, "name": "Manute Bol", "stat": "7'7\"", "aliases": ["bol", "manute"] },
      { "rank": 3, "name": "Yao Ming", "stat": "7'6\"", "aliases": ["yao", "ming", "yao ming"] },
      { "rank": 4, "name": "Shawn Bradley", "stat": "7'6\"", "aliases": ["bradley", "shawn"] },
      { "rank": 5, "name": "Tacko Fall", "stat": "7'5\"", "aliases": ["fall", "tacko"] },
      { "rank": 6, "name": "Slavko Vranes", "stat": "7'5\"", "aliases": ["vranes", "slavko"] }
    ],
    "hints": [
      { "rank": 1, "text": "Romanian center, also an actor" },
      { "rank": 2, "text": "Sudanese shot blocker from 1980s-90s" },
      { "rank": 3, "text": "Chinese superstar, Rockets legend" },
      { "rank": 4, "text": "Played for Mavs and Nets" },
      { "rank": 5, "text": "Recent player, briefly with Celtics" },
      { "rank": 6, "text": "Serbian player, limited NBA time" }
    ]
  },
  {
    "title": "Shortest Players in NBA History",
    "description": "Name the top 6 shortest players in NBA history",
    "answers": [
      { "rank": 1, "name": "Muggsy Bogues", "stat": "5'3\"", "aliases": ["bogues", "muggsy", "tyrone"] },
      { "rank": 2, "name": "Earl Boykins", "stat": "5'5\"", "aliases": ["boykins", "earl"] },
      { "rank": 3, "name": "Mel Hirsch", "stat": "5'6\"", "aliases": ["hirsch", "mel"] },
      { "rank": 4, "name": "Spud Webb", "stat": "5'6\"", "aliases": ["webb", "spud", "anthony"] },
      { "rank": 5, "name": "Greg Grant", "stat": "5'7\"", "aliases": ["grant", "greg"] },
      { "rank": 6, "name": "Keith Jennings", "stat": "5'7\"", "aliases": ["jennings", "keith"] }
    ],
    "hints": [
      { "rank": 1, "text": "Shortest ever, played 14 seasons" },
      { "rank": 2, "text": "Tough scorer despite size" },
      { "rank": 3, "text": "Played in 1940s briefly" },
      { "rank": 4, "text": "Won 1986 Dunk Contest" },
      { "rank": 5, "text": "76ers guard from early 1990s" },
      { "rank": 6, "text": "Warriors guard from early 1990s" }
    ]
  }
];
