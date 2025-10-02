-- Create players_glossary table with comprehensive player name variations
CREATE TABLE IF NOT EXISTS public.players_glossary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name TEXT NOT NULL UNIQUE,
  variations TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.players_glossary ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can read players_glossary"
  ON public.players_glossary
  FOR SELECT
  USING (true);

-- Authenticated users can manage (admin)
CREATE POLICY "Authenticated users can insert players_glossary"
  ON public.players_glossary
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update players_glossary"
  ON public.players_glossary
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete players_glossary"
  ON public.players_glossary
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert comprehensive player data with nicknames and misspellings
INSERT INTO public.players_glossary (player_name, variations) VALUES
-- All-Time Scoring Leaders Quiz
('LeBron James', ARRAY['lebron', 'lbj', 'king james', 'the king', 'bron', 'the chosen one', 'akron hammer', 'captain lemerica', 'le bron', 'lebron jaimes', 'le bron james']),
('Kareem Abdul-Jabbar', ARRAY['kareem', 'abdul jabbar', 'abdul-jabbar', 'lew alcindor', 'karim', 'kareem jabbar', 'abdul jabar', 'karim abdul jabbar']),
('Karl Malone', ARRAY['malone', 'mailman', 'the mailman', 'karl', 'carl malone', 'karl malon']),
('Kobe Bryant', ARRAY['kobe', 'black mamba', 'mamba', 'bean', 'kb24', 'vino', 'showboat', 'koby', 'kobe briant', 'kobe bryan', 'koby bryant']),
('Michael Jordan', ARRAY['mj', 'jordan', 'goat', 'air jordan', 'his airness', 'black cat', 'black jesus', 'money', 'magic man', 'superman', 'micheal jordan', 'michael jordon', 'mike jordan', 'micheal jordon']),
('Dirk Nowitzki', ARRAY['dirk', 'nowitzki', 'german wunderkind', 'dirkules', 'dirk diggler', 'nowitski', 'nowitzky', 'dirk nowitski']),
('John Stockton', ARRAY['stockton', 'john', 'stock', 'john stockton', 'jon stockton', 'stockten']),
('Chris Paul', ARRAY['cp3', 'paul', 'chris', 'the point god', 'point god', 'chrispaul', 'cris paul']),
('Jason Kidd', ARRAY['kidd', 'jason', 'j-kidd', 'jason kid', 'jayson kidd']),
('Steve Nash', ARRAY['nash', 'steve', 'nashty', 'steven nash', 'steve nash']),
('Mark Jackson', ARRAY['jackson', 'mark', 'marc jackson', 'mark jakson']),
('Wilt Chamberlain', ARRAY['wilt', 'chamberlain', 'stilt', 'the stilt', 'the big dipper', 'wilt the stilt', 'chamberlin', 'wilt chamberlin']),
('Bill Russell', ARRAY['russell', 'bill', 'russ', 'william russell', 'bil russell']),
('Elvin Hayes', ARRAY['hayes', 'elvin', 'big e', 'the big e', 'elvin hays']),
('Moses Malone', ARRAY['moses', 'malone', 'chairman of the boards', 'moses malon']),
('Tim Duncan', ARRAY['duncan', 'tim', 'big fundamental', 'the big fundamental', 'timmy', 'timmy duncan', 'tim dunkin']),
('Gary Payton', ARRAY['payton', 'gary', 'glove', 'the glove', 'gp', 'gary payton', 'gary peyton']),
('Hakeem Olajuwon', ARRAY['hakeem', 'olajuwon', 'dream', 'the dream', 'akeem', 'hakeem olajuwon', 'olajuwan', 'hakeem olajuwan']),
('Dikembe Mutombo', ARRAY['mutombo', 'dikembe', 'mount mutombo', 'deke', 'mutumbo', 'dikembe mutumbo']),
('Mark Eaton', ARRAY['eaton', 'mark', 'marc eaton']),
('David Robinson', ARRAY['robinson', 'david', 'admiral', 'the admiral', 'dave robinson']),
('Robert Horry', ARRAY['horry', 'robert', 'big shot rob', 'big shot robert', 'bob horry']),
('John Havlicek', ARRAY['havlicek', 'john', 'hondo', 'havlicek', 'john havlicek']),
('Tom Heinsohn', ARRAY['heinsohn', 'tom', 'tommy', 'tommy heinsohn']),
('K.C. Jones', ARRAY['kc jones', 'jones', 'kc', 'k.c.', 'jones kc']),
('Magic Johnson', ARRAY['magic', 'johnson', 'earvin johnson', 'magic johnson', 'majic johnson']),
('Larry Bird', ARRAY['bird', 'larry', 'larry legend', 'the hick from french lick', 'larry byrd']),
('Stephen Curry', ARRAY['curry', 'stephen', 'steph', 'chef curry', 'wardell curry', 'steven curry', 'steph curry', 'stephan curry']),
('Ray Allen', ARRAY['ray', 'allen', 'jesus shuttlesworth', 'ray allen']),
('James Harden', ARRAY['harden', 'james', 'the beard', 'beard', 'james harden']),
('Reggie Miller', ARRAY['reggie', 'miller', 'reggie miller']),
('Kyle Korver', ARRAY['korver', 'kyle', 'ashton kutcher', 'kyle korver']),
('Damian Lillard', ARRAY['lillard', 'damian', 'dame', 'dame time', 'dame dolla', 'damien lillard']),
('Russell Westbrook', ARRAY['westbrook', 'russell', 'russ', 'westbrick', 'brodie', 'russel westbrook']),
('Elgin Baylor', ARRAY['baylor', 'elgin', 'elgin baylor']),
('Rick Barry', ARRAY['barry', 'rick', 'richard barry', 'rick barry']),
('Mark Price', ARRAY['price', 'mark', 'marc price']),
('Peja Stojakovic', ARRAY['peja', 'stojakovic', 'stojakovic', 'peja stojakovic']),
('Chauncey Billups', ARRAY['billups', 'chauncey', 'mr big shot', 'chauncey billups']),
('Carmelo Anthony', ARRAY['carmelo', 'anthony', 'melo', 'carmello', 'carmelo anthony']),
('Kevin Durant', ARRAY['durant', 'kevin', 'kd', 'slim reaper', 'the servant', 'durantula', 'kevin durant']),
('Gheorghe Muresan', ARRAY['muresan', 'gheorghe', 'ghita', 'muresan', 'gheorghe muresan']),
('Manute Bol', ARRAY['bol', 'manute', 'manute bol']),
('Shawn Bradley', ARRAY['bradley', 'shawn', 'the stormin mormon', 'shaun bradley']),
('Yao Ming', ARRAY['yao', 'ming', 'yao ming']),
('Slavko Vranes', ARRAY['vranes', 'slavko', 'slavko vranes']),
('Pavel Podkolzin', ARRAY['podkolzin', 'pavel', 'pavel podkolzin']),
('Muggsy Bogues', ARRAY['bogues', 'muggsy', 'tyrone bogues', 'mugsy bogues']),
('Earl Boykins', ARRAY['boykins', 'earl', 'earl boykins']),
('Mel Hirsch', ARRAY['hirsch', 'mel', 'mel hirsch']),
('Spud Webb', ARRAY['webb', 'spud', 'anthony webb', 'spud webb']),
('Greg Grant', ARRAY['grant', 'greg', 'greg grant']),
('Keith Jennings', ARRAY['jennings', 'keith', 'mister', 'keith jennings']),
('Luka Doncic', ARRAY['luka', 'doncic', 'luka magic', 'luka doncic', 'doncic']),
('Joel Embiid', ARRAY['embiid', 'joel', 'the process', 'jojo', 'joel embid', 'embiid']),
('Allen Iverson', ARRAY['iverson', 'allen', 'ai', 'the answer', 'bubba chuck', 'allan iverson']),
('Jerry West', ARRAY['west', 'jerry', 'the logo', 'mr clutch', 'jerry west']),
('Shaquille O''Neal', ARRAY['shaq', 'oneal', 'o''neal', 'shaquille', 'diesel', 'big aristotle', 'superman', 'shaquille oneal', 'shaq oneal']),
('Tony Parker', ARRAY['parker', 'tony', 'tony parker']),
('Devin Booker', ARRAY['booker', 'devin', 'book', 'devin booker']),
('David Thompson', ARRAY['thompson', 'david', 'skywalker', 'david thompson']),
('Dwyane Wade', ARRAY['wade', 'dwyane', 'flash', 'dwade', 'd wade', 'dwayne wade', 'duane wade']),
('Scottie Pippen', ARRAY['pippen', 'scottie', 'pip', 'scotty pippen', 'scottie pippin']),
('Ja Morant', ARRAY['ja', 'morant', 'ja morant', 'morant']),
('Ben Simmons', ARRAY['simmons', 'ben', 'benjamin simmons', 'ben simmons']),
('Malcolm Brogdon', ARRAY['brogdon', 'malcolm', 'malcolm brogdon']),
('Karl-Anthony Towns', ARRAY['towns', 'karl', 'kat', 'karl anthony towns', 'towns']),
('Andrew Wiggins', ARRAY['wiggins', 'andrew', 'wiggins']),
('Kyrie Irving', ARRAY['irving', 'kyrie', 'uncle drew', 'kyrie irving', 'kyrie erving']),
('Rudy Gobert', ARRAY['gobert', 'rudy', 'the stifle tower', 'gobert', 'rudy gobert']),
('Marcus Smart', ARRAY['smart', 'marcus', 'marcus smart']),
('Giannis Antetokounmpo', ARRAY['giannis', 'antetokounmpo', 'greek freak', 'the greek freak', 'gianni', 'giannis antetokounmpo']),
('Kawhi Leonard', ARRAY['kawhi', 'leonard', 'the claw', 'klaw', 'kawhi leonard', 'kawaii leonard']),
('Draymond Green', ARRAY['green', 'draymond', 'dray', 'draymond green']),
('Mike Budenholzer', ARRAY['budenholzer', 'mike', 'bud', 'mike budenholzer']),
('Nick Nurse', ARRAY['nurse', 'nick', 'nick nurse']),
('Dwane Casey', ARRAY['casey', 'dwane', 'dwayne casey', 'dwane casey']),
('Mike D''Antoni', ARRAY['dantoni', 'd''antoni', 'mike', 'mike dantoni', 'mike d''antoni']),
('Gregg Popovich', ARRAY['popovich', 'gregg', 'pop', 'greg popovich', 'gregg popovich']),
('Mac McClung', ARRAY['mcclung', 'mac', 'mac mcclung']),
('Obi Toppin', ARRAY['toppin', 'obi', 'obi toppin']),
('Anfernee Simons', ARRAY['simons', 'anfernee', 'anfernee simons']),
('Hamidou Diallo', ARRAY['diallo', 'hamidou', 'hamidou diallo']),
('Donovan Mitchell', ARRAY['mitchell', 'donovan', 'spida', 'donovan mitchell']),
('Derrick Jones Jr.', ARRAY['jones', 'derrick', 'airplane mode', 'derrick jones jr', 'derrick jones']);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_players_glossary_name ON public.players_glossary(player_name);
