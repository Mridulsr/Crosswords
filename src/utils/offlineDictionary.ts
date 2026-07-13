// Shared Offline Dictionary Data for LetterForge
// Full-details (definitions, parts of speech, fun facts) for offline gameplay

export const OFFLINE_WORDS = new Set([
  "bus", "bust", "busy", "make", "makes", "maker", "cat", "cats", "dog", "dogs", "play", "player", "plays", "game", "games",
  "word", "words", "star", "stars", "start", "starts", "state", "states", "stop", "stops", "step", "steps", "stone", "stones",
  "book", "books", "box", "boxes", "boy", "boys", "girl", "girls", "man", "men", "woman", "women", "child", "children",
  "car", "cars", "train", "trains", "plane", "planes", "ship", "ships", "boat", "boats", "bike", "bikes", "road", "roads",
  "street", "streets", "city", "cities", "town", "towns", "house", "houses", "home", "homes", "room", "rooms", "door", "doors",
  "window", "windows", "wall", "walls", "floor", "floors", "roof", "roofs", "garden", "gardens", "park", "parks", "tree", "trees",
  "flower", "flowers", "grass", "sun", "moon", "star", "sky", "cloud", "clouds", "rain", "snow", "wind", "fire", "water", "earth",
  "land", "sea", "river", "lake", "ocean", "fish", "bird", "birds", "animal", "animals", "apple", "banana", "orange", "grape",
  "bread", "butter", "cheese", "milk", "water", "juice", "tea", "coffee", "sugar", "salt", "pepper", "meat", "food", "eat", "drink",
  "run", "walk", "jump", "fly", "swim", "sing", "dance", "read", "write", "speak", "listen", "learn", "teach", "think", "know",
  "want", "need", "love", "like", "hate", "happy", "sad", "angry", "scared", "tired", "brave", "strong", "weak", "fast", "slow",
  "good", "bad", "hot", "cold", "warm", "cool", "new", "old", "young", "big", "small", "tall", "short", "long", "wide", "thin",
  "red", "blue", "green", "yellow", "black", "white", "gray", "brown", "pink", "purple", "orange", "gold", "silver", "one", "two",
  "three", "four", "five", "six", "seven", "eight", "nine", "ten", "time", "day", "night", "week", "month", "year", "hour", "minute",
  "friend", "family", "school", "class", "teacher", "student", "paper", "pen", "pencil", "desk", "chair", "table", "bed", "sleep",
  "wake", "work", "job", "money", "shop", "buy", "sell", "pay", "cost", "price", "free", "cheap", "rich", "poor", "hard", "easy",
  "safe", "hurt", "sick", "well", "life", "death", "love", "peace", "war", "hope", "fear", "mind", "soul", "body", "face", "eye",
  "eyes", "ear", "ears", "nose", "mouth", "hair", "head", "neck", "arm", "hand", "hands", "finger", "fingers", "leg", "foot", "feet",
  "heart", "blood", "brain", "tooth", "teeth", "voice", "song", "music", "art", "paint", "draw", "color", "photo", "film", "show",
  "line", "point", "space", "form", "shape", "size", "weight", "force", "power", "light", "dark", "sound", "voice", "word", "talk",
  "tell", "say", "ask", "hear", "see", "look", "feel", "smell", "taste", "touch", "hold", "take", "give", "keep", "find", "lose",
  "win", "lose", "play", "turn", "score", "points", "rules", "level", "mode", "time", "clock", "timer", "speed", "fast", "slow",
  "test", "try", "done", "help", "save", "back", "next", "last", "first", "best", "worst", "great", "fine", "nice", "kind", "mean",
  "true", "false", "fact", "idea", "plan", "goal", "hope", "wish", "dream", "fear", "care", "love", "hate", "mind", "self", "life",
  "zone", "line", "spot", "mark", "sign", "word", "page", "note", "letter", "name", "list", "text", "mail", "post", "news", "view",
  "hero", "villain", "king", "queen", "prince", "lord", "lady", "sir", "chief", "leader", "boss", "staff", "crew", "team", "club",
  "user", "admin", "guest", "client", "agent", "bot", "code", "data", "file", "disk", "link", "web", "site", "page", "blog", "app",
  "pant", "panto", "pants", "pantomime", "paint", "paper", "part", "past", "path", "peak", "pear", "peel", "peer",
  "gap", "gaps", "gapy", "pageant", "pageants", "pave", "paved", "paves", "paving", "cave", "caves", "gave", "gene", "gent", "germ", "gets", "gift", "gigs", "gild", "gill", "gilt", "gimp", "gins", "gird", "girl", "girt", "gist", "give", "glad", "glee", "glen", "glib", "glim", "glob", "glow", "glue", "glug", "gnat", "gnaw", "goad", "goal", "goat", "gobs", "goby", "gods", "goer", "goes", "gogo", "gold", "golf", "gone", "gong", "good", "goof", "goon", "gore", "gory", "gosh", "gout", "gown", "grab", "grad", "gram", "gran", "gray", "grew", "grey", "grid", "grim", "grin", "grip", "grit", "grog", "grom", "grow", "grub", "grum", "gulf", "gull", "gulp", "gums", "gunk", "guns", "gush", "gust", "guts",
  "eta", "ate", "tea", "eat", "pea", "ape", "pet", "get", "got", "set", "let", "met", "net", "wet", "yet", "tap", "pat", "apt", "cap", "pac", "cat", "act", "rat", "art", "tar", "sat", "tas", "hat", "fat", "mat", "vat", "map", "pam", "amp", "sap", "pas", "asp", "rap", "par", "arp", "nap", "pan", "tan", "ant", "nat", "gap", "pag", "bag", "gab", "tab", "bat", "lab", "bal", "cab", "bac", "pad", "dad", "sad", "mad", "lad", "bad", "cad", "fad", "had", "rad", "tad", "wad", "yak", "elk", "yelk", "eye", "dye", "bye", "rye", "lye", "tie", "pie", "lie", "die", "fie", "vie", "how", "who", "why", "way", "day", "pay", "may", "say", "lay", "ray", "bay", "hay", "gay", "jay", "kay", "nay", "fay", "yaw", "jaw", "law", "raw", "saw", "paw", "cow", "bow", "sow", "row", "mow", "tow", "vow", "low", "now", "own", "won", "one", "two", "ten", "pen", "hen", "men", "den", "ken", "fen", "zen", "pin", "bin", "tin", "fin", "win", "sin", "din", "gin", "kin", "lin", "nib", "rib", "fib", "bib", "bob", "cob", "fob", "gob", "hob", "job", "lob", "mob", "rob", "sob", "tub", "rub", "sub", "pub", "hub", "cub", "dub", "bud", "mud", "cud", "dud", "rud", "sud", "hug", "mug", "dug", "bug", "tug", "rug", "jug", "pug", "gum", "hum", "sum", "rum", "bum", "mum", "dum", "sun", "run", "fun", "bun", "pun", "nun", "gun", "cup", "pup", "sup", "cut", "but", "out", "nut", "gut", "hut", "rut", "jut", "put", "dry", "cry", "try", "fry", "pry", "sly", "spy", "shy", "fly", "sky", "ski", "sea", "see", "fee", "bee", "toy", "coy", "joy", "soy", "key", "hey", "ley", "dey", "not", "hot", "lot", "pot", "rot", "dot", "cot", "jot", "tot", "bot", "sot", "wot", "god", "cod", "nod", "rod", "pod", "sod", "mod", "toe", "foe", "hoe", "roe", "woe", "oat", "era", "ear", "are", "our", "use", "sue", "due", "rue", "cue", "emu", "gnu", "owl", "awl", "eel", "oil", "ill", "all", "ell", "air", "fir", "sir", "fur", "oar", "car", "bar", "far", "jar", "war", "par", "mar", "her", "his", "him", "the", "and", "for", "nor", "yes", "too", "new", "old", "age", "ago", "fit", "bit", "hit", "sit", "lit", "kit", "pit", "wit", "tit", "zip", "rip", "tip", "lip", "sip", "dip", "hip", "pip", "nip", "lid", "kid", "rid", "did", "bid", "mid", "sid", "hid", "aid", "add", "odd", "end", "any", "its", "six", "son", "ton", "few", "ski", "van", "can", "fan", "ran", "ban", "rag", "tag", "wag", "sag", "sunny", "rainy", "cloudy", "windy", "snowy", "foggy", "muddy", "funny", "stormy", "misty", "breezy", "chilly", "icy", "warmth", "heats", "cools", "freezes", "frozen", "gales", "mild", "flames", "smokes", "woods", "stones", "clays", "muds", "sands", "dusts", "dirts", "earths", "forests", "valleys", "cliffs", "caves", "rivers", "streams", "brooks", "creeks", "lakes", "ponds", "pools", "waves", "tides", "coasts", "shores", "beaches", "islands", "worlds", "planets", "spaces", "stars", "clouds", "rains", "snows", "winds", "storms", "fogs", "mists", "hazes", "breezes", "weathers", "climates", "temps", "fires", "ashes", "coals", "grounds", "lands", "fields", "meadows", "deserts", "mounts", "hills", "canyons", "bends", "turns", "loops", "moves", "plays", "games", "words", "rules", "levels", "scores", "points", "clocks", "timers", "speeds", "tests", "tries", "helps", "saves", "backs", "nexts", "lasts", "firsts", "bests", "ideas", "plans", "goals", "hopes", "wishes", "dreams", "fears", "cares", "loves", "hates", "minds", "selves", "lives", "zones", "lines", "spots", "marks", "signs", "pages", "notes", "letters", "names", "lists", "texts", "mails", "posts", "views", "heros", "kings", "queens", "princes", "lords", "ladies", "chiefs", "leaders", "bosses", "staffs", "crews", "teams", "clubs", "users", "admins", "guests", "clients", "agents", "bots", "codes", "files", "disks", "links", "webs", "sites", "blogs", "apps", "pants", "paints", "papers", "parts", "pasts", "paths", "peaks", "pears", "peels", "peers", "gaps", "paves", "germs", "gifts", "girls", "golds", "golfs", "gongs", "goods", "goofs", "goons", "gores", "gowns", "grabs", "grads", "grams", "grans", "grays", "grids", "grins", "grips", "grits", "grows", "grubs", "gulfs", "gulls", "gulps", "gunks", "gushs", "gusts",
  "fox", "cow", "pig", "hen", "owl", "bee", "fly", "ant", "ape", "bat", "rat", "yak", "elk", "lion", "bear", "wolf", "deer", "lamb", "goat", "duck", "frog", "toad", "fish", "crab", "seal", "whale", "shark", "tiger", "horse", "sheep", "mouse", "snake", "snail", "spider", "worm"
]);

export const OFFLINE_DEFINITIONS: Record<string, { definition: string; partOfSpeech: string; funFact?: string }> = {
  bus: { definition: "A large motor vehicle carrying passengers by road, especially one serving the public on a fixed route.", partOfSpeech: "noun", funFact: "The word 'bus' is a clipping of 'omnibus', meaning 'for all' in Latin!" },
  bust: { definition: "A sculpture of a person's head, shoulders, and chest; or, to break, crack, or burst.", partOfSpeech: "noun / verb", funFact: "In slang, 'bust' has been used to mean 'arrest' or 'fail' since the 19th century." },
  busy: { definition: "Actively or fully engaged or occupied in work or some other activity.", partOfSpeech: "adjective", funFact: "The Old English spelling was 'bisig', meaning diligent and anxious." },
  make: { definition: "Create, construct, or produce something; cause something to exist or happen.", partOfSpeech: "verb", funFact: "One of the most versatile verbs in the English language, with dozens of meanings!" },
  maker: { definition: "A person or thing that makes or produces something.", partOfSpeech: "noun" },
  cat: { definition: "A small domesticated carnivorous mammal with soft fur, a short snout, and retractable claws.", partOfSpeech: "noun", funFact: "Cats have been domesticated for over 4,000 years, starting in ancient Egypt!" },
  dog: { definition: "A domesticated carnivorous mammal that typically has a long snout, an acute sense of smell, and a barking voice.", partOfSpeech: "noun", funFact: "Dogs are known as 'man's best friend' and were the first animals to be domesticated." },
  play: { definition: "Engage in activity for enjoyment and recreation rather than a serious or practical purpose.", partOfSpeech: "verb / noun", funFact: "The noun 'play' also refers to a theatrical performance written for actors." },
  player: { definition: "A person who takes part in a game, sport, or theatrical performance.", partOfSpeech: "noun" },
  game: { definition: "An activity or sport played according to rules, or a competitive match.", partOfSpeech: "noun", funFact: "The Proto-Germanic root of game is 'gaman', meaning 'amusement' or 'participation'!" },
  word: { definition: "A single distinct meaningful element of speech or writing, used with others to form a sentence.", partOfSpeech: "noun", funFact: "The longest word in any major English dictionary is 45 letters long!" },
  star: { definition: "A fixed luminous point in the night sky which is a large, remote incandescent body like the sun.", partOfSpeech: "noun", funFact: "There are estimated to be over 100 billion stars in our Milky Way galaxy alone!" },
  start: { definition: "Begin or cause to begin; set in motion or establish.", partOfSpeech: "verb / noun" },
  state: { definition: "The particular condition that someone or something is in; or a nation/territory.", partOfSpeech: "noun / verb" },
  stop: { definition: "Come to an end; cease from action, movement, or progress.", partOfSpeech: "verb / noun" },
  step: { definition: "An act or movement of putting one leg in front of the other in walking or running.", partOfSpeech: "noun / verb" },
  stone: { definition: "Hard solid nonmetallic mineral matter of which rock is made.", partOfSpeech: "noun" },
  book: { definition: "A written or printed work consisting of pages glued or sewn together along one side and bound in covers.", partOfSpeech: "noun", funFact: "The word 'book' comes from Old English 'bōc', which is related to the word 'beech' tree!" },
  box: { definition: "A container with a flat base and sides, typically square or rectangular and having a lid.", partOfSpeech: "noun / verb" },
  boy: { definition: "A male child or young man.", partOfSpeech: "noun" },
  girl: { definition: "A female child or young woman.", partOfSpeech: "noun", funFact: "In Middle English, 'girl' actually referred to a young person of either gender!" },
  man: { definition: "An adult human male.", partOfSpeech: "noun" },
  woman: { definition: "An adult human female.", partOfSpeech: "noun" },
  child: { definition: "A young human being below the age of puberty or full legal age.", partOfSpeech: "noun" },
  car: { definition: "A road vehicle, typically with four wheels, powered by an internal combustion engine or electric motor.", partOfSpeech: "noun" },
  train: { definition: "A series of connected railway carriages or wagons moved by a locomotive.", partOfSpeech: "noun / verb" },
  plane: { definition: "A flat surface; or, an airplane (a powered flying vehicle with fixed wings).", partOfSpeech: "noun" },
  ship: { definition: "A large boat for transporting people or goods by sea.", partOfSpeech: "noun" },
  boat: { definition: "A small vessel for travelling on water.", partOfSpeech: "noun" },
  bike: { definition: "A bicycle or motorcycle.", partOfSpeech: "noun" },
  road: { definition: "A wide way, especially one with a prepared surface, for use by vehicles.", partOfSpeech: "noun" },
  street: { definition: "A public road in a city, town, or village, typically with houses and buildings on one or both sides.", partOfSpeech: "noun" },
  city: { definition: "A large town; in the US, an incorporated municipality, or in the UK, a town created by royal charter.", partOfSpeech: "noun" },
  town: { definition: "An urban area that has a name, defined boundaries, and local government, larger than a village but smaller than a city.", partOfSpeech: "noun" },
  house: { definition: "A building for human habitation, especially one that is lived in by a family.", partOfSpeech: "noun / verb" },
  home: { definition: "The place where one lives permanently, especially as a member of a family or household.", partOfSpeech: "noun" },
  room: { definition: "A part or division of a building enclosed by walls, floor, and ceiling.", partOfSpeech: "noun" },
  door: { definition: "A hinged, sliding, or revolving barrier that opens and closes the entrance to a room or building.", partOfSpeech: "noun" },
  window: { definition: "An opening in the wall or roof of a building or vehicle, fitted with glass in a frame.", partOfSpeech: "noun", funFact: "The word literally comes from Old Norse 'vindauga', meaning 'wind-eye'!" },
  wall: { definition: "A continuous vertical brick or stone structure that encloses or divides an area of land.", partOfSpeech: "noun" },
  floor: { definition: "The lower surface of a room, on which one may stand.", partOfSpeech: "noun" },
  roof: { definition: "The structure forming the upper covering of a building or vehicle.", partOfSpeech: "noun" },
  garden: { definition: "A piece of ground adjoining a house, used for growing flowers, fruit, or vegetables.", partOfSpeech: "noun" },
  park: { definition: "A large public green area in a town, used for recreation.", partOfSpeech: "noun / verb" },
  tree: { definition: "A woody perennial plant, typically having a single stem or trunk growing to a considerable height.", partOfSpeech: "noun", funFact: "The oldest known tree in the world is a bristlecone pine estimated to be over 4,800 years old!" },
  flower: { definition: "The seed-bearing part of a plant, consisting of reproductive organs that are typically surrounded by brightly colored petals.", partOfSpeech: "noun", funFact: "Sunflowers can be used to extract toxic metals and radiation from soil!" },
  grass: { definition: "Vegetation consisting of typically short plants with long, narrow leaves, growing wild or cultivated on lawns.", partOfSpeech: "noun" },
  sun: { definition: "The star around which the earth orbits, providing light, heat, and energy.", partOfSpeech: "noun", funFact: "The sun is about 4.6 billion years old and accounts for 99.8% of the mass of the solar system!" },
  moon: { definition: "The natural satellite of the earth, visible by reflected light from the sun.", partOfSpeech: "noun", funFact: "The moon has no atmosphere, meaning footprints left by astronauts will last for millions of years!" },
  sky: { definition: "The region of the atmosphere and outer space seen from the earth.", partOfSpeech: "noun" },
  cloud: { definition: "A visible mass of condensed water vapor floating in the atmosphere, typically high above the ground.", partOfSpeech: "noun" },
  rain: { definition: "Moisture condensed from the atmosphere that falls visibly in separate drops.", partOfSpeech: "noun / verb" },
  snow: { definition: "Atmospheric water vapor frozen into ice crystals and falling in light white flakes.", partOfSpeech: "noun / verb" },
  wind: { definition: "The perceptible natural movement of the air, especially in the form of a current of air blowing from a particular direction.", partOfSpeech: "noun / verb" },
  fire: { definition: "Combustion or burning, in which substances combine chemically with oxygen from the air and typically give out bright light and heat.", partOfSpeech: "noun / verb" },
  water: { definition: "A colorless, transparent, odorless liquid that forms the seas, lakes, rivers, and rain and is the basis of the fluids of living organisms.", partOfSpeech: "noun / verb", funFact: "Water is the only natural substance on Earth that exists in three physical states: solid, liquid, and gas!" },
  earth: { definition: "The planet on which we live; the world; or the substance of the land surface.", partOfSpeech: "noun" },
  land: { definition: "The part of the earth's surface that is not covered by water.", partOfSpeech: "noun / verb" },
  sea: { definition: "The expanse of salt water that covers most of the earth's surface.", partOfSpeech: "noun" },
  river: { definition: "A large natural stream of water flowing in a channel to the sea, a lake, or another such stream.", partOfSpeech: "noun" },
  lake: { definition: "A large body of water surrounded by land.", partOfSpeech: "noun" },
  ocean: { definition: "A very large expanse of sea, in particular, each of the main areas of saline water.", partOfSpeech: "noun" },
  fish: { definition: "A limbless cold-blooded vertebrate animal with gills and fins living wholly in water.", partOfSpeech: "noun / verb" },
  bird: { definition: "A warm-blooded egg-laying vertebrate distinguished by the possession of feathers, wings, and a beak, and typically by being able to fly.", partOfSpeech: "noun" },
  animal: { definition: "A living organism that feeds on organic matter, typically having specialized sense organs and nervous system and able to respond rapidly to stimuli.", partOfSpeech: "noun" },
  apple: { definition: "The round fruit of a tree of the rose family, which typically has thin red or green skin and crisp white flesh.", partOfSpeech: "noun" },
  banana: { definition: "A long curved fruit which grows in clusters and has soft pulpy flesh and yellow skin when ripe.", partOfSpeech: "noun" },
  orange: { definition: "A round juicy citrus fruit with a tough bright reddish-yellow rind; or the color of this fruit.", partOfSpeech: "noun / adjective" },
  bread: { definition: "Food made of flour, water, and yeast mixed together and baked.", partOfSpeech: "noun" },
  butter: { definition: "A pale yellow edible fatty substance made by churning cream and used as a spread or in cooking.", partOfSpeech: "noun" },
  cheese: { definition: "A food made from the pressed curds of milk, firm or soft, and yellow or white.", partOfSpeech: "noun" },
  milk: { definition: "An opaque white fluid rich in fat and protein, secreted by female mammals for the nourishment of their young.", partOfSpeech: "noun / verb" },
  juice: { definition: "The liquid parts of vegetables or fruits, or a drink made from these.", partOfSpeech: "noun" },
  tea: { definition: "A hot drink made by infusing dried crushed leaves of the tea plant in boiling water.", partOfSpeech: "noun" },
  coffee: { definition: "A hot drink made from the roasted and ground seeds (coffee beans) of a tropical shrub.", partOfSpeech: "noun" },
  sugar: { definition: "A sweet crystalline substance obtained from various plants, especially sugar cane and sugar beet.", partOfSpeech: "noun" },
  salt: { definition: "A white crystalline substance which gives seawater its characteristic taste and is used for seasoning or preserving food.", partOfSpeech: "noun / verb" },
  pepper: { definition: "A pungent, hot-tasting powder prepared from dried and ground peppercorns.", partOfSpeech: "noun / verb" },
  food: { definition: "Any nutritious substance that people or animals eat or drink or that plants absorb in order to maintain life and growth.", partOfSpeech: "noun" },
  eat: { definition: "Put food into the mouth and chew and swallow it.", partOfSpeech: "verb" },
  drink: { definition: "Take a liquid into the mouth and swallow it.", partOfSpeech: "verb / noun" },
  run: { definition: "Move at a speed faster than a walk, never having both feet on the ground at the same time.", partOfSpeech: "verb / noun" },
  walk: { definition: "Move at a regular pace by lifting and setting down each foot in turn, never having both feet off the ground at once.", partOfSpeech: "verb / noun" },
  jump: { definition: "Push oneself off a surface and into the air by using the muscles in one's legs and feet.", partOfSpeech: "verb / noun" },
  fly: { definition: "Move through the air under control, using wings or a machine; or a small insect with two wings.", partOfSpeech: "verb / noun" },
  swim: { definition: "Propel oneself through water using limbs or fins.", partOfSpeech: "verb / noun" },
  sing: { definition: "Make musical sounds with the voice, especially a set tune with words.", partOfSpeech: "verb" },
  dance: { definition: "Move rhythmically to music, typically following a set sequence of steps.", partOfSpeech: "verb / noun" },
  read: { definition: "Look at and comprehend the meaning of written or printed matter.", partOfSpeech: "verb" },
  write: { definition: "Mark letters, words, or other symbols on a surface, typically paper, with a pen, pencil, or keyboard.", partOfSpeech: "verb" },
  speak: { definition: "Say something in order to convey information, an opinion, or a feeling.", partOfSpeech: "verb" },
  listen: { definition: "Give one's attention to a sound; take notice of and act on what someone says.", partOfSpeech: "verb" },
  learn: { definition: "Acquire knowledge of or skill in something through study, experience, or being taught.", partOfSpeech: "verb" },
  teach: { definition: "Impart knowledge to or instruct someone as to how to do something.", partOfSpeech: "verb" },
  think: { definition: "Have a particular opinion, belief, or idea; direct one's mind toward someone or something.", partOfSpeech: "verb" },
  know: { definition: "Be aware of through observation, inquiry, or information; have developed a relationship with.", partOfSpeech: "verb" },
  want: { definition: "Have a desire to possess or do something; wish for.", partOfSpeech: "verb / noun" },
  need: { definition: "Require something because it is essential or very important rather than just desirable.", partOfSpeech: "verb / noun" },
  love: { definition: "An intense feeling of deep affection; or to feel deep affection for someone or something.", partOfSpeech: "noun / verb" },
  like: { definition: "Find agreeable, enjoyable, or satisfactory; or similar to.", partOfSpeech: "verb / preposition" },
  hate: { definition: "Feel intense dislike for; or an intense feeling of dislike.", partOfSpeech: "verb / noun" },
  happy: { definition: "Feeling or showing pleasure or contentment.", partOfSpeech: "adjective" },
  sad: { definition: "Feeling or showing sorrow; unhappy.", partOfSpeech: "adjective" },
  angry: { definition: "Feeling or showing strong annoyance, displeasure, or hostility.", partOfSpeech: "adjective" },
  scared: { definition: "Fearful; frightened.", partOfSpeech: "adjective" },
  tired: { definition: "In need of sleep or rest; weary.", partOfSpeech: "adjective" },
  brave: { definition: "Ready to face and endure danger or pain; showing courage.", partOfSpeech: "adjective" },
  strong: { definition: "Having the power to move heavy weights or perform other physically demanding tasks.", partOfSpeech: "adjective" },
  weak: { definition: "Lacking the power to perform physically demanding tasks; lacking strength.", partOfSpeech: "adjective" },
  fast: { definition: "Moving or capable of moving at high speed; or firmly fixed.", partOfSpeech: "adjective / adverb / verb" },
  slow: { definition: "Moving or operating, or causing to move or operate, at a low speed.", partOfSpeech: "adjective" },
  good: { definition: "To be desired or approved of; of a high standard.", partOfSpeech: "adjective" },
  bad: { definition: "Of poor quality or a low standard; unpleasant; unwelcome.", partOfSpeech: "adjective" },
  hot: { definition: "Having a high temperature; experiencing an uncomfortable degree of heat.", partOfSpeech: "adjective" },
  cold: { definition: "Of or at a low temperature, especially when compared with the human body.", partOfSpeech: "adjective / noun" },
  warm: { definition: "Of or at a comfortable or moderately high temperature.", partOfSpeech: "adjective / verb" },
  cool: { definition: "Of or at a fairly low temperature, typically in a pleasant way; or fashionably attractive.", partOfSpeech: "adjective / verb" },
  new: { definition: "Produced, introduced, or discovered recently or now for the first time.", partOfSpeech: "adjective" },
  old: { definition: "Having lived for a long time; no longer young; or belonging to the past.", partOfSpeech: "adjective" },
  young: { definition: "Having lived or existed for only a short time; not old.", partOfSpeech: "adjective / noun" },
  big: { definition: "Of considerable size, power, or importance.", partOfSpeech: "adjective" },
  small: { definition: "Of a size that is less than normal or usual.", partOfSpeech: "adjective" },
  tall: { definition: "Of great or more than average height.", partOfSpeech: "adjective" },
  short: { definition: "Measuring a small distance from end to end; or small in height.", partOfSpeech: "adjective" },
  long: { definition: "Measuring a great distance from end to end; of great duration.", partOfSpeech: "adjective / verb" },
  wide: { definition: "Measuring or extending a great distance from side to side; broad.", partOfSpeech: "adjective" },
  thin: { definition: "Having opposite surfaces close together; of little thickness.", partOfSpeech: "adjective / verb" },
  code: { definition: "A system of words, letters, figures, or symbols used to represent others; or program instructions.", partOfSpeech: "noun / verb", funFact: "The first computer code was written by Ada Lovelace in 1843 for the Analytical Engine!" },
  data: { definition: "Facts and statistics collected together for reference or analysis.", partOfSpeech: "noun", funFact: "The word 'data' is the plural of 'datum' in Latin, although it is often used as a singular mass noun today!" },
  file: { definition: "A folder or box for holding loose papers; or a resource for storing information in a computer.", partOfSpeech: "noun / verb" },
  app: { definition: "An application, especially as downloaded by a user to a mobile device or desktop.", partOfSpeech: "noun" },
  bot: { definition: "An autonomous program on the internet or a computer that can interact with systems or users.", partOfSpeech: "noun" },
  web: { definition: "A network of fine threads constructed by a spider; or the World Wide Web.", partOfSpeech: "noun" },
  site: { definition: "An area of ground on which a town, building, or monument is constructed; or a website.", partOfSpeech: "noun" },
  link: { definition: "A relationship or connection between two things; or an HTML hyperlink.", partOfSpeech: "noun / verb" },
  pant: { definition: "Breathe with short, quick breaths, typically from exertion or excitement; or a single puff of breath.", partOfSpeech: "verb / noun", funFact: "Panting helps dogs cool down because they don't have sweat glands like humans!" },
  panto: { definition: "A theatrical entertainment, mainly for children, involving music, topical jokes, and slapstick comedy.", partOfSpeech: "noun", funFact: "Short for 'pantomime', a beloved holiday tradition in the United Kingdom!" },
  pants: { definition: "An outer garment covering each leg separately, usually from the waist to the ankles; trousers.", partOfSpeech: "noun", funFact: "The word comes from 'Pantalone', a funny character in Italian Commedia dell'Arte who wore long trousers!" },
  pantomime: { definition: "A dramatic entertainment in which performers express meaning through gestures accompanied by music.", partOfSpeech: "noun / verb" },
  fox: { definition: "A carnivorous mammal of the dog family, with a pointed muzzle, prominent ears, and a bushy tail.", partOfSpeech: "noun", funFact: "Foxes are very intelligent and adaptable, finding homes in both rural and urban areas!" },
  cow: { definition: "A fully grown female animal of a domesticated breed of ox, kept to produce milk or beef.", partOfSpeech: "noun", funFact: "Cows have an excellent sense of smell and can hear high and low frequency sounds better than humans!" },
  pig: { definition: "An omnivorous hoofed domesticated mammal with a sparse bristly coat and a flat snout.", partOfSpeech: "noun", funFact: "Pigs are highly intelligent, social animals, and are actually very clean!" },
  hen: { definition: "A female bird, especially of a domestic fowl.", partOfSpeech: "noun", funFact: "Hens can remember and distinguish between over 100 different faces of their species!" },
  owl: { definition: "A nocturnal bird of prey with large forward-facing eyes, a facial disc, and a hooked beak.", partOfSpeech: "noun", funFact: "Owls can rotate their heads up to 270 degrees without breaking blood vessels!" },
  bee: { definition: "A winged, hairy-bodied insect known for its role in pollination and producing honey.", partOfSpeech: "noun", funFact: "Bees communicate the location of food sources to other bees using a special dance!" },
  ant: { definition: "A small social insect working in well-organized colonies.", partOfSpeech: "noun", funFact: "Ants can lift up to 50 times their own body weight!" },
  ape: { definition: "A large primate that lacks a tail, including the chimpanzee, gorilla, and orangutan.", partOfSpeech: "noun" },
  bat: { definition: "A nocturnal flying mammal, or a wooden stick used for hitting a ball in sports.", partOfSpeech: "noun", funFact: "Bats are the only mammals capable of true, sustained flight!" },
  rat: { definition: "A rodent that resembles a large mouse, typically having a pointed snout and a long tail.", partOfSpeech: "noun" },
  yak: { definition: "A large domesticated wild ox with shaggy hair, native to Tibet.", partOfSpeech: "noun" },
  elk: { definition: "A large red deer native to North America and eastern Asia.", partOfSpeech: "noun" },
  lion: { definition: "A large tawny-coloured cat that lives in prides, native to Africa and northwestern India.", partOfSpeech: "noun", funFact: "A lion's roar can be heard from up to 5 miles (8 kilometers) away!" },
  bear: { definition: "A large, heavy mammal with thick fur and a very short tail, or to support a weight.", partOfSpeech: "noun / verb" },
  wolf: { definition: "A wild carnivorous mammal of the dog family, living and hunting in packs.", partOfSpeech: "noun" },
  deer: { definition: "A hoofed grazing mammal, the male of which typically has antlers.", partOfSpeech: "noun" },
  lamb: { definition: "A young sheep.", partOfSpeech: "noun" },
  goat: { definition: "A hardy domesticated ruminant animal with backward-curving horns.", partOfSpeech: "noun", funFact: "Goats were one of the first animals to be domesticated by humans, over 10,000 years ago!" },
  duck: { definition: "A waterbird with a broad blunt bill, short legs, and webbed feet.", partOfSpeech: "noun" },
  frog: { definition: "A tailless amphibian with a short stout body and long hind legs for jumping.", partOfSpeech: "noun", funFact: "Frogs absorb water and oxygen directly through their highly permeable skin!" },
  toad: { definition: "A tailless amphibian with a dry warty skin and short legs.", partOfSpeech: "noun" },
  crab: { definition: "A marine crustacean with a broad carapace and five pairs of legs, the first pair being claws.", partOfSpeech: "noun" },
  seal: { definition: "A fish-eating marine mammal with flippers and a streamlined body, or to close securely.", partOfSpeech: "noun / verb" },
  whale: { definition: "A very large marine mammal with a blowhole on top of the head for breathing.", partOfSpeech: "noun", funFact: "The blue whale is the largest known animal to have ever lived on Earth!" },
  shark: { definition: "A large voracious marine fish with a cartilaginous skeleton and multiple rows of teeth.", partOfSpeech: "noun", funFact: "Sharks do not have any bones; their skeletons are made entirely of cartilage!" },
  tiger: { definition: "A very large solitary cat with a yellow-brown coat striped with black.", partOfSpeech: "noun", funFact: "No two tigers have the exact same stripe pattern; they are as unique as human fingerprints!" },
  horse: { definition: "A large domesticated hoofed mammal with a flowing mane and tail, used for riding and pulling carts.", partOfSpeech: "noun" },
  sheep: { definition: "A domesticated ruminant mammal with a thick woolly coat.", partOfSpeech: "noun" },
  mouse: { definition: "A small rodent that typically has a pointed snout and a long hairless tail.", partOfSpeech: "noun" },
  snake: { definition: "A long limbless reptile which has no eyelids, a short tail, and jaws that are capable of considerable extension.", partOfSpeech: "noun" },
  snail: { definition: "A mollusc with a single spiral shell into which it can withdraw its body.", partOfSpeech: "noun" },
  spider: { definition: "An eight-legged arachnid that spins webs to catch prey.", partOfSpeech: "noun" },
  worm: { definition: "A long, thin, soft-bodied creeping animal.", partOfSpeech: "noun" },
  eed: { definition: "An abbreviation for Extended Essay Draft, Employee Evaluation Database, or Energy Efficient Design; also a common suffix sound in English.", partOfSpeech: "noun / abbreviation", funFact: "Also widely recognized as the common suffix sound behind 'seed', 'need', and 'feed'!" },
  king: { definition: "A male sovereign, ruler, or monarch who rules over a kingdom or territory.", partOfSpeech: "noun", funFact: "The word comes from Old English 'cyning', meaning 'of noble birth'!" }
};

export const DISALLOWED_WORDS_DETAILS: Record<string, { definition: string; reason: string; partOfSpeech?: string }> = {
  alu: {
    definition: "A Hinglish word meaning 'potato', or a technical abbreviation for Arithmetic Logic Unit.",
    reason: "Hinglish words and acronyms/abbreviations are strictly prohibited. Only standard English dictionary words are allowed.",
    partOfSpeech: "Hinglish / Abbreviation"
  },
  aloo: {
    definition: "A Hinglish word meaning 'potato'.",
    reason: "Hinglish words are strictly prohibited. Only standard English dictionary words are allowed.",
    partOfSpeech: "Hinglish"
  },
  gip: {
    definition: "Non-standard slang, dialect variation, or abbreviation.",
    reason: "Non-standard, slang, and dialect words are disallowed. Only standard, verified English words are permitted.",
    partOfSpeech: "Slang / Abbreviation"
  },
  gips: {
    definition: "Non-standard slang or plural dialect variation.",
    reason: "Non-standard, slang, and dialect words are disallowed.",
    partOfSpeech: "Slang"
  },
  gipy: {
    definition: "Non-standard adjective or typing glitch.",
    reason: "Non-standard, slang, and dialect words are disallowed.",
    partOfSpeech: "Slang"
  }
};

export const FORBIDDEN_SHORT_FORMS = new Set([
  "tia", "tiap", "lop", "onl", "nonl", "nonlp", "enonlp", "ing", "tking",
  "alu", "aloo", "gip", "gips", "gipy"
]);

export function isCussWord(word: string): boolean {
  const w = word.trim().toLowerCase();
  const cussList = [
    "fuck", "fucking", "fucked", "fucekd", "fucks", "fucker", "fuckers", "fuckin",
    "cum", "cums", "cumming", "cummed",
    "sex", "sexy", "sexes", "sexiest", "sexing",
    "bitch", "bitches", "bitching", "bastard", "bastards",
    "ass", "asshole", "assholes", "asses",
    "cunt", "cunts", "dick", "dicks", "pussy", "pussies",
    "vagina", "vaginas", "penis", "penises", "horny", "hornier", "horniest"
  ];
  return cussList.some(cuss => w === cuss || w.includes(cuss));
}

// Suffix rules analyzer to generate intelligent offline dictionary results
export function getOfflineWord(word: string) {
  const clean = word.trim().toLowerCase();
  
  if (isCussWord(clean)) {
    return {
      isValid: false,
      word: clean,
      partOfSpeech: "prohibited",
      definition: "This word contains prohibited or inappropriate language.",
      reason: "Profanity/inappropriate language is strictly prohibited."
    };
  }

  if (DISALLOWED_WORDS_DETAILS[clean]) {
    return {
      isValid: false,
      word: clean,
      partOfSpeech: DISALLOWED_WORDS_DETAILS[clean].partOfSpeech || "Disallowed",
      definition: DISALLOWED_WORDS_DETAILS[clean].definition,
      reason: DISALLOWED_WORDS_DETAILS[clean].reason
    };
  }

  if (FORBIDDEN_SHORT_FORMS.has(clean)) {
    return {
      isValid: false,
      word: clean,
      partOfSpeech: "",
      definition: "This is a forbidden short-form abbreviation.",
      reason: "Short-forms/abbreviations are disallowed."
    };
  }
  
  // 1. Direct match
  if (OFFLINE_DEFINITIONS[clean]) {
    return { isValid: true, ...OFFLINE_DEFINITIONS[clean], word: clean };
  }

  // 2. Plurals with "s"
  if (clean.endsWith("s") && clean.length > 2) {
    const base = clean.slice(0, -1);
    if (OFFLINE_DEFINITIONS[base]) {
      return {
        isValid: true,
        word: clean,
        partOfSpeech: OFFLINE_DEFINITIONS[base].partOfSpeech,
        definition: `Plural form of ${base}: ${OFFLINE_DEFINITIONS[base].definition}`,
        funFact: OFFLINE_DEFINITIONS[base].funFact || "A suffix-extended word in the local archive dictionary."
      };
    }
  }

  // 3. Plurals with "es"
  if (clean.endsWith("es") && clean.length > 3) {
    const base = clean.slice(0, -2);
    if (OFFLINE_DEFINITIONS[base]) {
      return {
        isValid: true,
        word: clean,
        partOfSpeech: OFFLINE_DEFINITIONS[base].partOfSpeech,
        definition: `Plural form of ${base}: ${OFFLINE_DEFINITIONS[base].definition}`,
        funFact: OFFLINE_DEFINITIONS[base].funFact || "A suffix-extended word in the local archive dictionary."
      };
    }
  }

  // 4. Past tense with "ed"
  if (clean.endsWith("ed") && clean.length > 3) {
    let base = clean.slice(0, -2);
    if (OFFLINE_DEFINITIONS[base]) {
      return {
        isValid: true,
        word: clean,
        partOfSpeech: "verb (past tense)",
        definition: `Past tense of ${base}: ${OFFLINE_DEFINITIONS[base].definition}`,
        funFact: OFFLINE_DEFINITIONS[base].funFact || "A suffix-extended word in the local archive dictionary."
      };
    }
    base = base + "e"; // e.g. bak + ed -> bake
    if (OFFLINE_DEFINITIONS[base]) {
      return {
        isValid: true,
        word: clean,
        partOfSpeech: "verb (past tense)",
        definition: `Past tense of ${base}: ${OFFLINE_DEFINITIONS[base].definition}`,
        funFact: OFFLINE_DEFINITIONS[base].funFact || "A suffix-extended word in the local archive dictionary."
      };
    }
  }

  // 5. Participle with "ing"
  if (clean.endsWith("ing") && clean.length > 4) {
    let base = clean.slice(0, -3);
    if (OFFLINE_DEFINITIONS[base]) {
      return {
        isValid: true,
        word: clean,
        partOfSpeech: "verb (participle)",
        definition: `Present participle of ${base}: ${OFFLINE_DEFINITIONS[base].definition}`,
        funFact: OFFLINE_DEFINITIONS[base].funFact || "A suffix-extended word in the local archive dictionary."
      };
    }
    base = base + "e"; // e.g. mak + ing -> make
    if (OFFLINE_DEFINITIONS[base]) {
      return {
        isValid: true,
        word: clean,
        partOfSpeech: "verb (participle)",
        definition: `Present participle of ${base}: ${OFFLINE_DEFINITIONS[base].definition}`,
        funFact: OFFLINE_DEFINITIONS[base].funFact || "A suffix-extended word in the local archive dictionary."
      };
    }
  }

  // 6. Comparative/agent suffix with "er"
  if (clean.endsWith("er") && clean.length > 3) {
    const withoutER = clean.slice(0, -2);
    if (OFFLINE_DEFINITIONS[withoutER] || OFFLINE_WORDS.has(withoutER)) {
      return {
        isValid: true,
        word: clean,
        partOfSpeech: "noun / adjective",
        definition: `One who performs, or comparative degree of ${withoutER}: ${OFFLINE_DEFINITIONS[withoutER]?.definition || 'derived from ' + withoutER}`,
        funFact: "A suffix-extended word in the local archive dictionary."
      };
    }
    if (withoutER.endsWith("i")) {
      const baseWithY = withoutER.slice(0, -1) + "y";
      if (OFFLINE_DEFINITIONS[baseWithY] || OFFLINE_WORDS.has(baseWithY)) {
        return {
          isValid: true,
          word: clean,
          partOfSpeech: "adjective (comparative)",
          definition: `More ${baseWithY}.`,
          funFact: `The comparative form of '${baseWithY}'.`
        };
      }
    }
    if (withoutER.length > 2 && withoutER[withoutER.length - 1] === withoutER[withoutER.length - 2]) {
      const base = withoutER.slice(0, -1);
      if (OFFLINE_DEFINITIONS[base] || OFFLINE_WORDS.has(base)) {
        return {
          isValid: true,
          word: clean,
          partOfSpeech: "adjective (comparative)",
          definition: `More ${base}.`,
          funFact: `The comparative form of '${base}'.`
        };
      }
    }
    const withE = withoutER + "e";
    if (OFFLINE_DEFINITIONS[withE] || OFFLINE_WORDS.has(withE)) {
      return {
        isValid: true,
        word: clean,
        partOfSpeech: "noun / adjective / verb",
        definition: `Comparative form or agent of ${withE}.`,
        funFact: `Derived from '${withE}'.`
      };
    }
  }

  // 7. Superlative adjective with "est"
  if (clean.endsWith("est") && clean.length > 4) {
    const withoutEST = clean.slice(0, -3);
    if (OFFLINE_DEFINITIONS[withoutEST] || OFFLINE_WORDS.has(withoutEST)) {
      return {
        isValid: true,
        word: clean,
        partOfSpeech: "adjective (superlative)",
        definition: `Most ${withoutEST}.`,
        funFact: `The superlative form of '${withoutEST}'.`
      };
    }
    if (withoutEST.endsWith("i")) {
      const baseWithY = withoutEST.slice(0, -1) + "y";
      if (OFFLINE_DEFINITIONS[baseWithY] || OFFLINE_WORDS.has(baseWithY)) {
        return {
          isValid: true,
          word: clean,
          partOfSpeech: "adjective (superlative)",
          definition: `Most ${baseWithY}.`,
          funFact: `The superlative form of '${baseWithY}'.`
        };
      }
    }
    if (withoutEST.length > 2 && withoutEST[withoutEST.length - 1] === withoutEST[withoutEST.length - 2]) {
      const base = withoutEST.slice(0, -1);
      if (OFFLINE_DEFINITIONS[base] || OFFLINE_WORDS.has(base)) {
        return {
          isValid: true,
          word: clean,
          partOfSpeech: "adjective (superlative)",
          definition: `Most ${base}.`,
          funFact: `The superlative form of '${base}'.`
        };
      }
    }
    const withE = withoutEST + "e";
    if (OFFLINE_DEFINITIONS[withE] || OFFLINE_WORDS.has(withE)) {
      return {
        isValid: true,
        word: clean,
        partOfSpeech: "adjective (superlative)",
        definition: `Most ${withE}.`,
        funFact: `The superlative form of '${withE}'.`
      };
    }
  }

  // 8. Adjective form ending with "y"
  if (clean.endsWith("y") && clean.length > 3) {
    const withoutY = clean.slice(0, -1);
    if (withoutY.length > 2 && withoutY[withoutY.length - 1] === withoutY[withoutY.length - 2]) {
      const base = withoutY.slice(0, -1);
      if (OFFLINE_DEFINITIONS[base] || OFFLINE_WORDS.has(base)) {
        return {
          isValid: true,
          word: clean,
          partOfSpeech: "adjective",
          definition: `Resembling, characterized by, or filled with ${base}.`,
          funFact: `Derived adjective form of '${base}'.`
        };
      }
    }
    if (OFFLINE_DEFINITIONS[withoutY] || OFFLINE_WORDS.has(withoutY)) {
      return {
        isValid: true,
        word: clean,
        partOfSpeech: "adjective",
        definition: `Characterized by, filled with, or resembling ${withoutY}.`,
        funFact: `Derived adjective form of '${withoutY}'.`
      };
    }
    const withE = withoutY + "e";
    if (OFFLINE_DEFINITIONS[withE] || OFFLINE_WORDS.has(withE)) {
      return {
        isValid: true,
        word: clean,
        partOfSpeech: "adjective",
        definition: `Like or suggesting ${withE}.`,
        funFact: `Derived adjective form of '${withE}'.`
      };
    }
  }

  // 9. Adverb form ending with "ly"
  if (clean.endsWith("ly") && clean.length > 4) {
    const withoutLY = clean.slice(0, -2);
    if (OFFLINE_DEFINITIONS[withoutLY] || OFFLINE_WORDS.has(withoutLY)) {
      return {
        isValid: true,
        word: clean,
        partOfSpeech: "adverb",
        definition: `In a ${withoutLY} manner.`,
        funFact: `An adverb derived from '${withoutLY}'.`
      };
    }
    if (withoutLY.endsWith("i")) {
      const baseWithY = withoutLY.slice(0, -1) + "y";
      if (OFFLINE_DEFINITIONS[baseWithY] || OFFLINE_WORDS.has(baseWithY)) {
        return {
          isValid: true,
          word: clean,
          partOfSpeech: "adverb",
          definition: `In a ${baseWithY} manner.`,
          funFact: `An adverb derived from '${baseWithY}'.`
        };
      }
    }
  }

  // 10. Broad vocabulary set fallback
  if (OFFLINE_WORDS.has(clean)) {
    return {
      isValid: true,
      word: clean,
      partOfSpeech: "noun / verb / adjective",
      definition: "A standard English word (validated offline). It is ready for play!",
      funFact: "A popular word in the LetterForge offline dictionary archive!"
    };
  }

  return null;
}
