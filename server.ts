import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Standard English base words for fallback offline validation and computer moves
const OFFLINE_WORDS = new Set([
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
  "gap", "gaps", "gapy", "pageant", "pageants", "pave", "paved", "paves", "paving", "cave", "caves", "gave", "gene", "gent", "germ", "gets", "gift", "gigs", "gild", "gill", "gilt", "gimp", "gins", "gips", "gird", "girl", "girt", "gist", "give", "glad", "glee", "glen", "glib", "glim", "glob", "glow", "glue", "glug", "gnat", "gnaw", "goad", "goal", "goat", "gobs", "goby", "gods", "goer", "goes", "gogo", "gold", "golf", "gone", "gong", "good", "goof", "goon", "gore", "gory", "gosh", "gout", "gown", "grab", "grad", "gram", "gran", "gray", "grew", "grey", "grid", "grim", "grin", "grip", "grit", "grog", "grom", "grow", "grub", "grum", "gulf", "gull", "gulp", "gums", "gunk", "guns", "gush", "gust", "guts",
  "eta", "ate", "tea", "eat", "pea", "ape", "pet", "get", "got", "set", "let", "met", "net", "wet", "yet", "tap", "pat", "apt", "cap", "pac", "cat", "act", "rat", "art", "tar", "sat", "tas", "hat", "fat", "mat", "vat", "map", "pam", "amp", "sap", "pas", "asp", "rap", "par", "arp", "nap", "pan", "tan", "ant", "nat", "gap", "pag", "bag", "gab", "tab", "bat", "lab", "bal", "cab", "bac", "pad", "dad", "sad", "mad", "lad", "bad", "cad", "fad", "had", "rad", "tad", "wad", "yak", "elk", "yelk", "eye", "dye", "bye", "rye", "lye", "tie", "pie", "lie", "die", "fie", "vie", "how", "who", "why", "way", "day", "pay", "may", "say", "lay", "ray", "bay", "hay", "gay", "jay", "kay", "nay", "fay", "yaw", "jaw", "law", "raw", "saw", "paw", "cow", "bow", "sow", "row", "mow", "tow", "vow", "low", "now", "own", "won", "one", "two", "ten", "pen", "hen", "men", "den", "ken", "fen", "zen", "pin", "bin", "tin", "fin", "win", "sin", "din", "gin", "kin", "lin", "nib", "rib", "fib", "bib", "bob", "cob", "fob", "gob", "hob", "job", "lob", "mob", "rob", "sob", "tub", "rub", "sub", "pub", "hub", "cub", "dub", "bud", "mud", "cud", "dud", "rud", "sud", "hug", "mug", "dug", "bug", "tug", "rug", "jug", "pug", "gum", "hum", "sum", "rum", "bum", "mum", "dum", "sun", "run", "fun", "bun", "pun", "nun", "gun", "cup", "pup", "sup", "cut", "but", "out", "nut", "gut", "hut", "rut", "jut", "put", "dry", "cry", "try", "fry", "pry", "sly", "spy", "shy", "fly", "sky", "ski", "sea", "see", "fee", "bee", "toy", "coy", "joy", "soy", "key", "hey", "ley", "dey", "not", "hot", "lot", "pot", "rot", "dot", "cot", "jot", "tot", "bot", "sot", "wot", "god", "cod", "nod", "rod", "pod", "sod", "mod", "toe", "foe", "hoe", "roe", "woe", "oat", "era", "ear", "are", "our", "use", "sue", "due", "rue", "cue", "emu", "gnu", "owl", "awl", "eel", "oil", "ill", "all", "ell", "air", "fir", "sir", "fur", "oar", "car", "bar", "far", "jar", "war", "par", "mar", "her", "his", "him", "the", "and", "for", "nor", "yes", "too", "new", "old", "age", "ago", "fit", "bit", "hit", "sit", "lit", "kit", "pit", "wit", "tit", "zip", "rip", "tip", "lip", "sip", "dip", "hip", "pip", "nip", "gip", "lid", "kid", "rid", "did", "bid", "mid", "sid", "hid", "aid", "add", "odd", "end", "any", "its", "six", "son", "ton", "few", "ski", "van", "can", "fan", "ran", "ban", "rag", "tag", "wag", "sag", "sunny", "rainy", "cloudy", "windy", "snowy", "foggy", "muddy", "funny", "stormy", "misty", "breezy", "chilly", "icy", "warmth", "heats", "cools", "freezes", "frozen", "gales", "mild", "flames", "smokes", "woods", "stones", "clays", "muds", "sands", "dusts", "dirts", "earths", "forests", "valleys", "cliffs", "caves", "rivers", "streams", "brooks", "creeks", "lakes", "ponds", "pools", "waves", "tides", "coasts", "shores", "beaches", "islands", "worlds", "planets", "spaces", "stars", "clouds", "rains", "snows", "winds", "storms", "fogs", "mists", "hazes", "breezes", "weathers", "climates", "temps", "fires", "ashes", "coals", "grounds", "lands", "fields", "meadows", "deserts", "mounts", "hills", "canyons", "bends", "turns", "loops", "moves", "plays", "games", "words", "rules", "levels", "scores", "points", "clocks", "timers", "speeds", "tests", "tries", "helps", "saves", "backs", "nexts", "lasts", "firsts", "bests", "ideas", "plans", "goals", "hopes", "wishes", "dreams", "fears", "cares", "loves", "hates", "minds", "selves", "lives", "zones", "lines", "spots", "marks", "signs", "pages", "notes", "letters", "names", "lists", "texts", "mails", "posts", "views", "heros", "kings", "queens", "princes", "lords", "ladies", "chiefs", "leaders", "bosses", "staffs", "crews", "teams", "clubs", "users", "admins", "guests", "clients", "agents", "bots", "codes", "files", "disks", "links", "webs", "sites", "blogs", "apps", "pants", "paints", "papers", "parts", "pasts", "paths", "peaks", "pears", "peels", "peers", "gaps", "paves", "germs", "gifts", "girls", "golds", "golfs", "gongs", "goods", "goofs", "goons", "gores", "gowns", "grabs", "grads", "grams", "grans", "grays", "grids", "grins", "grips", "grits", "grows", "grubs", "gulfs", "gulls", "gulps", "gunks", "gushs", "gusts",
  "fox", "cow", "pig", "hen", "owl", "bee", "fly", "ant", "ape", "bat", "rat", "yak", "elk", "lion", "bear", "wolf", "deer", "lamb", "goat", "duck", "frog", "toad", "fish", "crab", "seal", "whale", "shark", "tiger", "horse", "sheep", "mouse", "snake", "snail", "spider", "worm"
]);

// Large Offline Dictionary Definitions to bypass Gemini 429 quota exhaustion completely for typical games
const OFFLINE_DEFINITIONS: Record<string, { definition: string; partOfSpeech: string; funFact?: string }> = {
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

const FORBIDDEN_SHORT_FORMS = new Set(["tia", "tiap", "lop", "onl", "nonl", "nonlp", "enonlp", "ing", "tking"]);

// Suffix rules analyzer to generate intelligent offline dictionary results
function getOfflineWord(word: string) {
  const clean = word.trim().toLowerCase();
  
  if (FORBIDDEN_SHORT_FORMS.has(clean)) {
    return null;
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
    // e.g. smaller -> small, worker -> work
    if (OFFLINE_DEFINITIONS[withoutER] || OFFLINE_WORDS.has(withoutER)) {
      return {
        isValid: true,
        word: clean,
        partOfSpeech: "noun / adjective",
        definition: `One who performs, or comparative degree of ${withoutER}: ${OFFLINE_DEFINITIONS[withoutER]?.definition || 'derived from ' + withoutER}`,
        funFact: "A suffix-extended word in the local archive dictionary."
      };
    }
    // e.g. happier -> happy (replace 'i' with 'y')
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
    // e.g. bigger -> big (double consonant)
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
    // e.g. maker -> make (drop 'e' then add 'er' -> base is withoutER + 'e')
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

  // 7. Superlative adjective with "est" (e.g., biggest, tallest, shortest, happiest, nicest)
  if (clean.endsWith("est") && clean.length > 4) {
    const withoutEST = clean.slice(0, -3);
    // e.g. tallest -> tall, shortest -> short
    if (OFFLINE_DEFINITIONS[withoutEST] || OFFLINE_WORDS.has(withoutEST)) {
      return {
        isValid: true,
        word: clean,
        partOfSpeech: "adjective (superlative)",
        definition: `Most ${withoutEST}.`,
        funFact: `The superlative form of '${withoutEST}'.`
      };
    }
    // e.g. happiest -> happy (replace 'i' with 'y')
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
    // e.g. biggest -> big (double consonant)
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
    // e.g. nicest -> nice
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

  // 8. Adjective form ending with "y" (e.g. sunny, cloudy, rainy, windy, snowy, muddy, funny, foggy, etc.)
  if (clean.endsWith("y") && clean.length > 3) {
    const withoutY = clean.slice(0, -1);
    // double consonant, e.g. sunny -> sun, foggy -> fog, muddy -> mud, funny -> fun
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
    // simple "y" addition, e.g. cloudy -> cloud, rainy -> rain, snowy -> snow, windy -> wind
    if (OFFLINE_DEFINITIONS[withoutY] || OFFLINE_WORDS.has(withoutY)) {
      return {
        isValid: true,
        word: clean,
        partOfSpeech: "adjective",
        definition: `Characterized by, filled with, or resembling ${withoutY}.`,
        funFact: `Derived adjective form of '${withoutY}'.`
      };
    }
    // drop "e" and add "y", e.g. stony -> stone, smoky -> smoke, icy -> ice
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

  // 9. Adverb form ending with "ly" (e.g. slowly, sadly, bravely, happily, easily)
  if (clean.endsWith("ly") && clean.length > 4) {
    const withoutLY = clean.slice(0, -2);
    // e.g. slowly -> slow, sadly -> sad
    if (OFFLINE_DEFINITIONS[withoutLY] || OFFLINE_WORDS.has(withoutLY)) {
      return {
        isValid: true,
        word: clean,
        partOfSpeech: "adverb",
        definition: `In a ${withoutLY} manner.`,
        funFact: `An adverb derived from '${withoutLY}'.`
      };
    }
    // e.g. happily -> happy (replace 'i' with 'y')
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

// In-Memory Caches to completely solve quota limits across game sessions
const lookupCache = new Map<string, any>();
const hintCache = new Map<string, any>();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
let ai: GoogleGenAI | null = null;
let isGeminiQuotaExceeded = false;

if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini API initialized successfully in full-stack server.");
  } catch (error) {
    console.warn("Failed to initialize Gemini Client, falling back to local database:", error);
  }
} else {
  console.log("Gemini API key not found in environment. Using rich local dictionaries as fallback.");
}

// Resilient API wrapper with automatic exponential backoff retry for transient errors (like 503 UNAVAILABLE or demand spikes)
async function generateContentWithRetry(params: any, retries = 3, delayMs = 1000): Promise<any> {
  if (!ai) {
    throw new Error("Gemini AI Client is not initialized.");
  }
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await ai.models.generateContent(params);
      return response;
    } catch (error: any) {
      const errStr = String(error?.message || error).toLowerCase();
      
      // Determine if it is a hard quota/limit error (do not retry, fail fast)
      const isQuota = errStr.includes("429") || errStr.includes("quota") || errStr.includes("resource_exhausted") || errStr.includes("limit: 20") || errStr.includes("exhausted");
      if (isQuota) {
        isGeminiQuotaExceeded = true;
        throw error; // Fail-fast so local fallbacks trigger instantly
      }

      const isTransient = errStr.includes("503") || errStr.includes("unavailable") || errStr.includes("service unavailable") || errStr.includes("demand") || errStr.includes("rate limit");
      if (isTransient && attempt < retries) {
        const nextDelay = delayMs * Math.pow(2, attempt - 1);
        console.warn(`[Gemini Retry] Attempt ${attempt} failed with transient error: ${error?.message || error}. Retrying in ${nextDelay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, nextDelay));
      } else {
        throw error;
      }
    }
  }
}

// 1. Dictionary Lookup Endpoint (Uses Gemini or standard offline lookup)
app.post("/api/dictionary/lookup", async (req, res) => {
  const { word } = req.body;
  if (!word || typeof word !== "string") {
    return res.status(400).json({ error: "Word is required and must be a string." });
  }

  const cleanedWord = word.trim().toLowerCase();

  // 0. Check forbidden short forms first
  if (FORBIDDEN_SHORT_FORMS.has(cleanedWord)) {
    const result = {
      isValid: false,
      word: cleanedWord,
      partOfSpeech: "",
      definition: "This is a forbidden short-form abbreviation.",
      reason: "Short-forms/abbreviations (like TIA, TIAP, LOP, ONL, NONL, NONLP, ENONLP) are strictly disallowed and will trigger a point penalty!"
    };
    return res.json(result);
  }

  // 1. Check in-memory Cache first to prevent redundant Gemini hits
  if (lookupCache.has(cleanedWord)) {
    return res.json(lookupCache.get(cleanedWord));
  }

  // 2. Check offline comprehensive dictionary matching first
  const offlineMatch = getOfflineWord(cleanedWord);
  if (offlineMatch) {
    lookupCache.set(cleanedWord, offlineMatch);
    return res.json(offlineMatch);
  }

  // 3. Fall back to Gemini only if not cached and not in our rich offline list
  if (ai) {
    try {
      const response = await generateContentWithRetry({
        model: "gemini-3.5-flash",
        contents: `Check if "${cleanedWord}" is a valid, standard English word. Produce a JSON response according to the requested schema. Proper nouns, acronyms, and slang that are not in standard dictionaries should be marked as invalid.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isValid: {
                type: Type.BOOLEAN,
                description: "True if this is a standard English word suitable for a spelling game.",
              },
              word: {
                type: Type.STRING,
                description: "The checked word in its clean form.",
              },
              partOfSpeech: {
                type: Type.STRING,
                description: "E.g., noun, verb, adjective, adverb, or empty if invalid.",
              },
              definition: {
                type: Type.STRING,
                description: "A clear, concise dictionary definition of the word.",
              },
              funFact: {
                type: Type.STRING,
                description: "An interesting fact, etymology, or spelling trick for the word.",
              },
              reason: {
                type: Type.STRING,
                description: "If invalid, why is it invalid? (e.g., 'not a real word', 'abbreviation'). If valid, can be left empty.",
              },
            },
            required: ["isValid", "word", "definition"],
          },
        },
      });

      const responseText = response.text;
      if (responseText) {
        const parsed = JSON.parse(responseText.trim());
        lookupCache.set(cleanedWord, parsed);
        return res.json(parsed);
      }
    } catch (error: any) {
      const isQuota = error?.message?.includes("429") || error?.message?.includes("quota") || error?.status === "RESOURCE_EXHAUSTED";
      if (isQuota) {
        console.warn(`[Gemini Quota Exceeded] Word lookup for "${cleanedWord}" fell back gracefully to resilient local dictionary.`);
      } else {
        console.warn(`[Gemini Lookup Fallback] Word lookup for "${cleanedWord}" fell back to local dictionary. Error: ${error?.message || error}`);
      }
    }
  }

  // 4. Strict offline fallback check when Gemini is exhausted/rate-limited or offline.
  // Instead of accepting any gibberish, we only accept words verified in our rich offline list.
  const result = {
    isValid: false,
    word: cleanedWord,
    partOfSpeech: "",
    definition: "Word unrecognized in offline dictionary mode.",
    funFact: "",
    reason: `In offline mode (due to Gemini quota limits), only standard dictionary words present in our verified list are recognized. Unofficial words like "${cleanedWord}" are not permitted.`
  };

  lookupCache.set(cleanedWord, result);
  return res.json(result);
});

// 2. AI Opponent Turn Generator Endpoint
app.post("/api/game/ai-move", async (req, res) => {
  const { board, difficulty, alreadyPlayedWords, currentSequence } = req.body;
  // board: (string | null)[] (Length 1000 representing a 40x25 grid)
  // difficulty: "easy" | "medium" | "hard"
  // alreadyPlayedWords: array of strings e.g. ["BUS"]

  const playedWordsSet = new Set((alreadyPlayedWords || []).map((w: string) => w.toLowerCase()));

  // Fallback to reconstruct board from currentSequence if board is missing
  let activeBoard: (string | null)[] = board;
  if (!activeBoard) {
    if (currentSequence && currentSequence.length > 0) {
      activeBoard = [...currentSequence];
    } else {
      activeBoard = Array(1000).fill(null);
    }
  }

  // Find non-empty characters and their contiguous chunks
  const isBoardEmpty = activeBoard.every(cell => cell === null);

  const getColLabel = (c: number) => {
    if (c < 26) return String.fromCharCode(65 + c);
    return "A" + String.fromCharCode(65 + (c - 26));
  };

  const activeCells: { index: number; coordinate: string; letter: string }[] = [];
  for (let i = 0; i < activeBoard.length; i++) {
    if (activeBoard[i] !== null) {
      const r = Math.floor(i / 40);
      const c = i % 40;
      activeCells.push({
        index: i,
        coordinate: `${getColLabel(c)}${25 - r}`,
        letter: activeBoard[i]!
      });
    }
  }

  if (ai) {
    try {
      const prompt = `
        You are playing LetterForge on a massive 40 columns x 25 rows grid (1000 squares in total, indexed 0 to 999).
        Row index r goes 0 to 24, Column index c goes 0 to 39. Flat index = r * 40 + c.
        Columns A-Z correspond to 0-25, and AA-AN correspond to 26-39. Ranks are numbered 1 to 25 (where Rank 25 is Row 0, Rank 1 is Row 24).
        
        Currently filled squares: ${JSON.stringify(activeCells)} (all other indices are empty).
        Rules:
        - A player can place exactly ONE uppercase letter (A-Z) at ANY empty cell index (0 to 999).
        - Placing a letter should form or extend a contiguous block of letters HORIZONTALLY or VERTICALLY that creates a valid standard English word (preferably 3 or more letters). Words can be spelled forwards or backwards (for example, "TAE" on the board forms "EAT" when read backwards, which is valid and scores points based on the length of "EAT").
        - Already played words in this session: [${Array.from(playedWordsSet).join(", ")}]. Avoid repeating these if possible.
        - Difficulty: ${difficulty || "medium"}.
          - Easy: Plays letters somewhat randomly, forms short 3-letter words.
          - Medium: Makes smart moves, forms words of 3-5 letters.
          - Hard: Extremely tactical. Forms long words, blocks the player, or leaves difficult letters.

        Choose exactly ONE empty cell index (0 to 999) to place exactly ONE uppercase letter (A-Z).
        Format your response as a JSON object with:
        "boxIdx" (integer representing the 0-indexed cell position from 0 to 999, MUST be an empty cell currently),
        "letter" (a single uppercase character A-Z),
        "targetWord" (the contiguous horizontal or vertical word that is formed or built towards),
        "explanation" (brief, playful description of the move).
      `;

      const response = await generateContentWithRetry({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              boxIdx: {
                type: Type.INTEGER,
                description: "The 0-based index of the empty cell (0-999) to place the letter in.",
              },
              letter: {
                type: Type.STRING,
                description: "Exactly one uppercase letter (A-Z).",
              },
              targetWord: {
                type: Type.STRING,
                description: "The word formed or completed by this placement.",
              },
              explanation: {
                type: Type.STRING,
                description: "A short explanation of why the computer chose this move.",
              },
            },
            required: ["boxIdx", "letter", "targetWord", "explanation"],
          },
        },
      });

      const responseText = response.text;
      if (responseText) {
        const parsed = JSON.parse(responseText.trim());
        const selectedIdx = Number(parsed.boxIdx);
        // Ensure index is valid and empty
        if (selectedIdx >= 0 && selectedIdx < activeBoard.length && activeBoard[selectedIdx] === null) {
          parsed.boxIdx = selectedIdx;
          parsed.letter = parsed.letter.toUpperCase().substring(0, 1);
          return res.json(parsed);
        }
      }
    } catch (error: any) {
      const isQuota = error?.message?.includes("429") || error?.message?.includes("quota") || error?.status === "RESOURCE_EXHAUSTED";
      if (isQuota) {
        console.warn("[Gemini Quota Exceeded] AI move fell back gracefully to resilient local strategy.");
      } else {
        console.warn(`[Gemini AI Move Fallback] fell back to local strategy. Error: ${error?.message || error}`);
      }
    }
  }

  // Fallback offline AI move generator for 40x25 grid
  const alphabet = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split("");
  let bestBoxIdx = 500; // Center-ish of 1000 grid (Row 12, Col 20)
  let bestLetter = "E";
  let targetWord = "E";
  let found = false;

  if (isBoardEmpty) {
    const starters = ["B", "C", "M", "S", "T", "P"];
    bestLetter = starters[Math.floor(Math.random() * starters.length)];
    bestBoxIdx = 500;
    targetWord = bestLetter;
  } else {
    // Try to find an empty box adjacent (Up, Down, Left, Right) to an existing letter to form a valid offline word
    for (let i = 0; i < activeBoard.length; i++) {
      if (activeBoard[i] !== null) continue; // must be empty

      const r = Math.floor(i / 40);
      const c = i % 40;

      const hasUp = r > 0 && activeBoard[(r - 1) * 40 + c] !== null;
      const hasDown = r < 24 && activeBoard[(r + 1) * 40 + c] !== null;
      const hasLeft = c > 0 && activeBoard[r * 40 + (c - 1)] !== null;
      const hasRight = c < 39 && activeBoard[r * 40 + (c + 1)] !== null;
      
      const isAdjacent = hasUp || hasDown || hasLeft || hasRight;
      if (!isAdjacent) continue;

      for (const char of alphabet) {
        const tempBoard = [...activeBoard];
        tempBoard[i] = char;

        // Check horizontal word formed around cell
        let left = c;
        while (left > 0 && tempBoard[r * 40 + (left - 1)] !== null) left--;
        let right = c;
        while (right < 39 && tempBoard[r * 40 + (right + 1)] !== null) right++;

        const hWordList = [];
        for (let colIdx = left; colIdx <= right; colIdx++) hWordList.push(tempBoard[r * 40 + colIdx]);
        const hWord = hWordList.join("").toLowerCase();

        // Check vertical word formed around cell
        let up = r;
        while (up > 0 && tempBoard[(up - 1) * 40 + c] !== null) up--;
        let down = r;
        while (down < 24 && tempBoard[(down + 1) * 40 + c] !== null) down++;

        const vWordList = [];
        for (let rowIdx = up; rowIdx <= down; rowIdx++) vWordList.push(tempBoard[rowIdx * 40 + c]);
        const vWord = vWordList.join("").toLowerCase();

        if (hWord.length >= 3 && OFFLINE_WORDS.has(hWord) && !playedWordsSet.has(hWord)) {
          bestBoxIdx = i;
          bestLetter = char;
          targetWord = hWord;
          found = true;
          break;
        }

        if (vWord.length >= 3 && OFFLINE_WORDS.has(vWord) && !playedWordsSet.has(vWord)) {
          bestBoxIdx = i;
          bestLetter = char;
          targetWord = vWord;
          found = true;
          break;
        }
      }
      if (found) break;
    }

    if (!found) {
      for (let i = 0; i < activeBoard.length; i++) {
        if (activeBoard[i] !== null) continue;
        const r = Math.floor(i / 40);
        const c = i % 40;
        const isAdjacent = (r > 0 && activeBoard[(r - 1) * 40 + c] !== null) ||
                           (r < 24 && activeBoard[(r + 1) * 40 + c] !== null) ||
                           (c > 0 && activeBoard[r * 40 + (c - 1)] !== null) ||
                           (c < 39 && activeBoard[r * 40 + (c + 1)] !== null);
        if (isAdjacent) {
          bestBoxIdx = i;
          bestLetter = ["E", "A", "O", "T", "I", "S", "R", "N"][Math.floor(Math.random() * 8)];
          targetWord = bestLetter;
          found = true;
          break;
        }
      }
    }

    if (!found) {
      const emptyIdx = activeBoard.indexOf(null);
      if (emptyIdx !== -1) {
        bestBoxIdx = emptyIdx;
        bestLetter = "A";
        targetWord = "A";
      }
    }
  }

  const rFinal = Math.floor(bestBoxIdx / 40);
  const cFinal = bestBoxIdx % 40;
  const squareCoordinate = `${getColLabel(cFinal)}${25 - rFinal}`;

  return res.json({
    boxIdx: bestBoxIdx,
    letter: bestLetter.toUpperCase(),
    targetWord: targetWord.toUpperCase(),
    explanation: `I placed '${bestLetter.toUpperCase()}' in Square ${squareCoordinate} (index ${bestBoxIdx}) to form or work towards "${targetWord.toUpperCase()}"!`
  });
});

// 3. AI Hint Endpoint
app.post("/api/game/ai-hint", async (req, res) => {
  const { board, alreadyPlayedWords, currentSequence } = req.body;

  let activeBoard: (string | null)[] = board;
  if (!activeBoard) {
    if (currentSequence && currentSequence.length > 0) {
      activeBoard = [...currentSequence];
    } else {
      activeBoard = Array(1000).fill(null);
    }
  }

  // Check hintCache using board layout hash
  const boardHash = activeBoard.map(cell => cell || "-").join("");
  if (hintCache.has(boardHash)) {
    return res.json(hintCache.get(boardHash));
  }

  const isBoardEmpty = activeBoard.every(cell => cell === null);

  const getColLabel = (c: number) => {
    if (c < 26) return String.fromCharCode(65 + c);
    return "A" + String.fromCharCode(65 + (c - 26));
  };

  const activeCells: { index: number; coordinate: string; letter: string }[] = [];
  for (let i = 0; i < activeBoard.length; i++) {
    if (activeBoard[i] !== null) {
      const r = Math.floor(i / 40);
      const c = i % 40;
      activeCells.push({
        index: i,
        coordinate: `${getColLabel(c)}${25 - r}`,
        letter: activeBoard[i]!
      });
    }
  }

  if (ai) {
    try {
      const prompt = `
        We are playing LetterForge on a 40 columns x 25 rows grid (1000 squares).
        Current filled squares: ${JSON.stringify(activeCells)} (all other slots are empty).
        Suggest 3 valid standard English words that can be created or extended by placing letters in the empty cells horizontally or vertically.
        Format your response as a JSON array of suggestions, each with:
        "suggestedWord" (uppercase string),
        "howToBuild" (string explaining which coordinate to target and what letter to write, e.g. 'Place T at Square E12 to make CAT'),
        "points" (integer, length of the word).
      `;

      const response = await generateContentWithRetry({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                suggestedWord: { type: Type.STRING },
                howToBuild: { type: Type.STRING },
                points: { type: Type.INTEGER }
              },
              required: ["suggestedWord", "howToBuild", "points"]
            }
          }
        }
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text.trim());
        hintCache.set(boardHash, parsed);
        return res.json(parsed);
      }
    } catch (error: any) {
      const isQuota = error?.message?.includes("429") || error?.message?.includes("quota") || error?.status === "RESOURCE_EXHAUSTED";
      if (isQuota) {
        console.warn("[Gemini Quota Exceeded] Hint generation fell back gracefully to offline local hints.");
      } else {
        console.warn(`[Gemini Hint Fallback] Hint generation fell back to offline local hints. Error: ${error?.message || error}`);
      }
    }
  }

  // Fallback offline hints
  const suggestions = [];
  if (!isBoardEmpty && activeCells.length > 0) {
    const firstCell = activeCells[0];
    const letter = firstCell.letter.toLowerCase();
    for (const w of OFFLINE_WORDS) {
      if (w.includes(letter) && w !== letter) {
        suggestions.push({
          suggestedWord: w.toUpperCase(),
          howToBuild: `Extend existing '${letter.toUpperCase()}' at ${firstCell.coordinate} to form "${w.toUpperCase()}"`,
          points: w.length
        });
        if (suggestions.length >= 3) break;
      }
    }
  }

  if (suggestions.length === 0) {
    suggestions.push({
      suggestedWord: "START NEW WORD",
      howToBuild: "Click any square on the chessboard. E.g. start with 'B' on E12, then 'U' on E11, then 'S' on E10 to make BUS!",
      points: 3
    });
    suggestions.push({
      suggestedWord: "BUS",
      howToBuild: "Form the horizontal word 'BUS' starting from any square!",
      points: 3
    });
    suggestions.push({
      suggestedWord: "GAME",
      howToBuild: "Spell 'G-A-M-E' horizontally or vertically on the empty grid!",
      points: 4
    });
  }

  return res.json(suggestions);
});

// 4. Gemini Status Endpoint to allow the frontend to gracefully display Offline Fallback Banner
app.get("/api/game/gemini-status", (req, res) => {
  res.json({
    isQuotaExceeded: isGeminiQuotaExceeded,
    hasApiKey: !!ai,
  });
});


// Serve static files in production, integrate Vite in development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware mounted.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Static files served from dist/ folder.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LetterForge Full-Stack Server listening on http://localhost:${PORT}`);
  });
}

startServer();
