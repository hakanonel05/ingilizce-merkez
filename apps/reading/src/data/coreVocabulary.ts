export interface CoreWord {
  term: string;
  meaning: string;
  partOfSpeech: string; // 'v' | 'adj' | 'n' | 'adv' | 'conj' | 'prep'
  definition: string;
  exampleSentence: string;
  category: 'basic-verbs' | 'basic-adjectives' | 'basic-nouns' | 'basic-adverbs' | 'conjunctions' | 'prepositions';
}

export const CORE_VOCABULARY_CATEGORIES = {
  'basic-verbs': {
    title: 'Basic Verbs (Temel Fiiller)',
    description: 'İngilizce okuma parçalarında en sık karşılaşılan ve akademik dilde temel oluşturan fiiller.'
  },
  'basic-adjectives': {
    title: 'Basic Adjectives (Temel Sıfatlar)',
    description: 'Metinlerin niteliğini, miktarını ve durumunu belirten en temel akademik sıfatlar.'
  },
  'basic-nouns': {
    title: 'Basic Nouns (Temel İsimler)',
    description: 'Farklı konularda okuma yaparken karşınıza çıkacak en yaygın isimler.'
  },
  'basic-adverbs': {
    title: 'Basic Adverbs (Temel Zarflar)',
    description: 'Fiilleri, sıfatları ve cümleleri niteleyen en sık kullanılan zarflar.'
  },
  'conjunctions': {
    title: 'Conjunctions & Transitions (Bağlaçlar & Geçişler)',
    description: 'YDS, YÖKDİL ve YKS-DİL sınavlarında cümleleri bağlamada kritik öneme sahip yapılar.'
  },
  'prepositions': {
    title: 'Prepositional Phrases (Edat Öbekleri)',
    description: 'Cümle kurarken ve okurken kelimeleri birbirine bağlayan edat grupları.'
  }
};

export const CORE_VOCABULARY_DATA: CoreWord[] = [
  {
    term: "live",
    meaning: "yaşamak, hayatta kalmak",
    partOfSpeech: "v",
    definition: "To be alive; to have your home somewhere.",
    exampleSentence: "They live in London.",
    category: "basic-verbs"
  },
  {
    term: "reside",
    meaning: "yaşamak, hayatta kalmak",
    partOfSpeech: "v",
    definition: "To live in a particular place (formal).",
    exampleSentence: "She resides in the countryside.",
    category: "basic-verbs"
  },
  {
    term: "endure",
    meaning: "yaşamak, hayatta kalmak",
    partOfSpeech: "v",
    definition: "To suffer something difficult patiently.",
    exampleSentence: "They endured great hardship.",
    category: "basic-verbs"
  },
  {
    term: "survive",
    meaning: "yaşamak, hayatta kalmak",
    partOfSpeech: "v",
    definition: "To continue to live or exist.",
    exampleSentence: "Few plants survive in the desert.",
    category: "basic-verbs"
  },
  {
    term: "be exposed to",
    meaning: "maruz kalmak, katlanmak",
    partOfSpeech: "v",
    definition: "To be left without protection from something.",
    exampleSentence: "Workers were exposed to harmful chemicals.",
    category: "basic-verbs"
  },
  {
    term: "undergo",
    meaning: "maruz kalmak, katlanmak",
    partOfSpeech: "v",
    definition: "To experience something difficult.",
    exampleSentence: "She underwent major surgery.",
    category: "basic-verbs"
  },
  {
    term: "suffer",
    meaning: "maruz kalmak, katlanmak",
    partOfSpeech: "v",
    definition: "To experience pain or difficulty.",
    exampleSentence: "He suffers from headaches.",
    category: "basic-verbs"
  },
  {
    term: "confront",
    meaning: "maruz kalmak, katlanmak",
    partOfSpeech: "v",
    definition: "To face a difficult situation directly.",
    exampleSentence: "She confronted her fears.",
    category: "basic-verbs"
  },
  {
    term: "tolerate",
    meaning: "maruz kalmak, katlanmak",
    partOfSpeech: "v",
    definition: "To accept something unpleasant without protest.",
    exampleSentence: "I can't tolerate rude behaviour.",
    category: "basic-verbs"
  },
  {
    term: "stop",
    meaning: "durdurmak, terk etmek",
    partOfSpeech: "v",
    definition: "To end movement or an activity.",
    exampleSentence: "Please stop shouting.",
    category: "basic-verbs"
  },
  {
    term: "cease",
    meaning: "durdurmak, terk etmek",
    partOfSpeech: "v",
    definition: "To stop happening (formal).",
    exampleSentence: "The rain finally ceased.",
    category: "basic-verbs"
  },
  {
    term: "quit",
    meaning: "durdurmak, terk etmek",
    partOfSpeech: "v",
    definition: "To stop doing something.",
    exampleSentence: "He quit his job.",
    category: "basic-verbs"
  },
  {
    term: "halt",
    meaning: "durdurmak, terk etmek",
    partOfSpeech: "v",
    definition: "To stop or make something stop.",
    exampleSentence: "The strike halted production.",
    category: "basic-verbs"
  },
  {
    term: "abandon",
    meaning: "durdurmak, terk etmek",
    partOfSpeech: "v",
    definition: "To leave someone or something completely.",
    exampleSentence: "They abandoned the plan.",
    category: "basic-verbs"
  },
  {
    term: "start",
    meaning: "başlamak",
    partOfSpeech: "v",
    definition: "To begin doing something.",
    exampleSentence: "The film starts at eight.",
    category: "basic-verbs"
  },
  {
    term: "begin",
    meaning: "başlamak",
    partOfSpeech: "v",
    definition: "To start.",
    exampleSentence: "She began to cry.",
    category: "basic-verbs"
  },
  {
    term: "initiate",
    meaning: "başlamak",
    partOfSpeech: "v",
    definition: "To cause something to start.",
    exampleSentence: "They initiated a new project.",
    category: "basic-verbs"
  },
  {
    term: "commence",
    meaning: "başlamak",
    partOfSpeech: "v",
    definition: "To begin (formal).",
    exampleSentence: "The ceremony will commence at noon.",
    category: "basic-verbs"
  },
  {
    term: "originate",
    meaning: "başlamak",
    partOfSpeech: "v",
    definition: "To begin or come from a place.",
    exampleSentence: "The custom originated in China.",
    category: "basic-verbs"
  },
  {
    term: "argue",
    meaning: "tartışmak, müzakere etmek",
    partOfSpeech: "v",
    definition: "To give reasons for or against something.",
    exampleSentence: "They argued about money.",
    category: "basic-verbs"
  },
  {
    term: "debate",
    meaning: "tartışmak, müzakere etmek",
    partOfSpeech: "v",
    definition: "To discuss something formally.",
    exampleSentence: "The council debated the plan.",
    category: "basic-verbs"
  },
  {
    term: "discuss",
    meaning: "tartışmak, müzakere etmek",
    partOfSpeech: "v",
    definition: "To talk about something in detail.",
    exampleSentence: "We discussed the problem.",
    category: "basic-verbs"
  },
  {
    term: "negotiate",
    meaning: "tartışmak, müzakere etmek",
    partOfSpeech: "v",
    definition: "To try to reach an agreement by talking.",
    exampleSentence: "They negotiated a new contract.",
    category: "basic-verbs"
  },
  {
    term: "agree",
    meaning: "anlaşmak, uzlaşmak",
    partOfSpeech: "v",
    definition: "To have the same opinion.",
    exampleSentence: "We agree on most things.",
    category: "basic-verbs"
  },
  {
    term: "consent",
    meaning: "anlaşmak, uzlaşmak",
    partOfSpeech: "v",
    definition: "To give permission or agree.",
    exampleSentence: "She consented to the plan.",
    category: "basic-verbs"
  },
  {
    term: "concur",
    meaning: "anlaşmak, uzlaşmak",
    partOfSpeech: "v",
    definition: "To agree with someone (formal).",
    exampleSentence: "I concur with your decision.",
    category: "basic-verbs"
  },
  {
    term: "understand",
    meaning: "anlamak, fark etmek",
    partOfSpeech: "v",
    definition: "To know the meaning of something.",
    exampleSentence: "I understand the problem.",
    category: "basic-verbs"
  },
  {
    term: "comprehend",
    meaning: "anlamak, fark etmek",
    partOfSpeech: "v",
    definition: "To understand fully.",
    exampleSentence: "He could not comprehend the news.",
    category: "basic-verbs"
  },
  {
    term: "realize",
    meaning: "anlamak, fark etmek",
    partOfSpeech: "v",
    definition: "To become aware of something.",
    exampleSentence: "She realized her mistake.",
    category: "basic-verbs"
  },
  {
    term: "recognize",
    meaning: "anlamak, fark etmek",
    partOfSpeech: "v",
    definition: "To know someone or something from before.",
    exampleSentence: "I recognized her at once.",
    category: "basic-verbs"
  },
  {
    term: "conclude",
    meaning: "bulmak, sonuca varmak",
    partOfSpeech: "v",
    definition: "To decide something after thinking.",
    exampleSentence: "We concluded that he was right.",
    category: "basic-verbs"
  },
  {
    term: "discover",
    meaning: "bulmak, sonuca varmak",
    partOfSpeech: "v",
    definition: "To find something for the first time.",
    exampleSentence: "Scientists discovered a new planet.",
    category: "basic-verbs"
  },
  {
    term: "find out",
    meaning: "bulmak, sonuca varmak",
    partOfSpeech: "v",
    definition: "To learn a fact or piece of information.",
    exampleSentence: "I found out the truth.",
    category: "basic-verbs"
  },
  {
    term: "suggest",
    meaning: "önermek, tavsiye etmek",
    partOfSpeech: "v",
    definition: "To put forward an idea for consideration.",
    exampleSentence: "I suggest we leave early.",
    category: "basic-verbs"
  },
  {
    term: "offer",
    meaning: "önermek, tavsiye etmek",
    partOfSpeech: "v",
    definition: "To present something for acceptance.",
    exampleSentence: "She offered to help.",
    category: "basic-verbs"
  },
  {
    term: "propose",
    meaning: "önermek, tavsiye etmek",
    partOfSpeech: "v",
    definition: "To formally suggest a plan.",
    exampleSentence: "They proposed a new law.",
    category: "basic-verbs"
  },
  {
    term: "recommend",
    meaning: "önermek, tavsiye etmek",
    partOfSpeech: "v",
    definition: "To advise something as good.",
    exampleSentence: "I recommend this book.",
    category: "basic-verbs"
  },
  {
    term: "advise",
    meaning: "önermek, tavsiye etmek",
    partOfSpeech: "v",
    definition: "To tell someone what you think they should do.",
    exampleSentence: "The doctor advised rest.",
    category: "basic-verbs"
  },
  {
    term: "oppose",
    meaning: "karşı çıkmak, reddetmek",
    partOfSpeech: "v",
    definition: "To disagree with and try to prevent.",
    exampleSentence: "Many people oppose the plan.",
    category: "basic-verbs"
  },
  {
    term: "reject",
    meaning: "karşı çıkmak, reddetmek",
    partOfSpeech: "v",
    definition: "To refuse to accept.",
    exampleSentence: "The committee rejected the proposal.",
    category: "basic-verbs"
  },
  {
    term: "refuse",
    meaning: "karşı çıkmak, reddetmek",
    partOfSpeech: "v",
    definition: "To say you will not do something.",
    exampleSentence: "He refused to answer.",
    category: "basic-verbs"
  },
  {
    term: "resist",
    meaning: "karşı çıkmak, reddetmek",
    partOfSpeech: "v",
    definition: "To try to stop or fight against something.",
    exampleSentence: "They resisted the change.",
    category: "basic-verbs"
  },
  {
    term: "deny",
    meaning: "karşı çıkmak, reddetmek",
    partOfSpeech: "v",
    definition: "To say that something is not true.",
    exampleSentence: "She denied the accusation.",
    category: "basic-verbs"
  },
  {
    term: "think",
    meaning: "düşünmek, varsaymak",
    partOfSpeech: "v",
    definition: "To use your mind to consider something.",
    exampleSentence: "I think it will rain.",
    category: "basic-verbs"
  },
  {
    term: "consider",
    meaning: "düşünmek, varsaymak",
    partOfSpeech: "v",
    definition: "To think about something carefully.",
    exampleSentence: "We are considering the offer.",
    category: "basic-verbs"
  },
  {
    term: "regard",
    meaning: "düşünmek, varsaymak",
    partOfSpeech: "v",
    definition: "To think of in a particular way.",
    exampleSentence: "He is regarded as an expert.",
    category: "basic-verbs"
  },
  {
    term: "suppose",
    meaning: "düşünmek, varsaymak",
    partOfSpeech: "v",
    definition: "To think that something is probably true.",
    exampleSentence: "I suppose you are right.",
    category: "basic-verbs"
  },
  {
    term: "assume",
    meaning: "düşünmek, varsaymak",
    partOfSpeech: "v",
    definition: "To accept that something is true without proof.",
    exampleSentence: "I assumed you knew.",
    category: "basic-verbs"
  },
  {
    term: "explain",
    meaning: "açıklamak, ışık tutmak",
    partOfSpeech: "v",
    definition: "To make something clear or easy to understand.",
    exampleSentence: "She explained the rules.",
    category: "basic-verbs"
  },
  {
    term: "identify",
    meaning: "açıklamak, ışık tutmak",
    partOfSpeech: "v",
    definition: "To recognize and name something.",
    exampleSentence: "Can you identify the problem?",
    category: "basic-verbs"
  },
  {
    term: "depict",
    meaning: "açıklamak, ışık tutmak",
    partOfSpeech: "v",
    definition: "To show or describe something.",
    exampleSentence: "The painting depicts a battle.",
    category: "basic-verbs"
  },
  {
    term: "illustrate",
    meaning: "açıklamak, ışık tutmak",
    partOfSpeech: "v",
    definition: "To show the meaning with examples.",
    exampleSentence: "The example illustrates the point.",
    category: "basic-verbs"
  },
  {
    term: "enlighten",
    meaning: "açıklamak, ışık tutmak",
    partOfSpeech: "v",
    definition: "To give someone more knowledge.",
    exampleSentence: "The lecture enlightened us.",
    category: "basic-verbs"
  },
  {
    term: "permit",
    meaning: "izin vermek, olanak sağlamak",
    partOfSpeech: "v",
    definition: "To allow something (formal).",
    exampleSentence: "Smoking is not permitted here.",
    category: "basic-verbs"
  },
  {
    term: "allow",
    meaning: "izin vermek, olanak sağlamak",
    partOfSpeech: "v",
    definition: "To let someone do something.",
    exampleSentence: "They allowed us to enter.",
    category: "basic-verbs"
  },
  {
    term: "authorize",
    meaning: "izin vermek, olanak sağlamak",
    partOfSpeech: "v",
    definition: "To give official permission.",
    exampleSentence: "She authorized the payment.",
    category: "basic-verbs"
  },
  {
    term: "enable",
    meaning: "izin vermek, olanak sağlamak",
    partOfSpeech: "v",
    definition: "To make something possible.",
    exampleSentence: "The grant enabled us to travel.",
    category: "basic-verbs"
  },
  {
    term: "facilitate",
    meaning: "izin vermek, olanak sağlamak",
    partOfSpeech: "v",
    definition: "To make something easier.",
    exampleSentence: "The tool facilitates the process.",
    category: "basic-verbs"
  },
  {
    term: "succeed",
    meaning: "başarmak, tamamlamak",
    partOfSpeech: "v",
    definition: "To achieve what you wanted.",
    exampleSentence: "She succeeded in her aim.",
    category: "basic-verbs"
  },
  {
    term: "accomplish",
    meaning: "başarmak, tamamlamak",
    partOfSpeech: "v",
    definition: "To finish something successfully.",
    exampleSentence: "He accomplished the task.",
    category: "basic-verbs"
  },
  {
    term: "achieve",
    meaning: "başarmak, tamamlamak",
    partOfSpeech: "v",
    definition: "To reach a goal by effort.",
    exampleSentence: "She achieved her dream.",
    category: "basic-verbs"
  },
  {
    term: "fulfil",
    meaning: "başarmak, tamamlamak",
    partOfSpeech: "v",
    definition: "To do or complete something required.",
    exampleSentence: "He fulfilled his duties.",
    category: "basic-verbs"
  },
  {
    term: "complete",
    meaning: "başarmak, tamamlamak",
    partOfSpeech: "v",
    definition: "To finish something.",
    exampleSentence: "They completed the project.",
    category: "basic-verbs"
  },
  {
    term: "affect",
    meaning: "etkilemek, ilham vermek",
    partOfSpeech: "v",
    definition: "To have an effect on something.",
    exampleSentence: "The weather affects the crops.",
    category: "basic-verbs"
  },
  {
    term: "impress",
    meaning: "etkilemek, ilham vermek",
    partOfSpeech: "v",
    definition: "To make someone admire you.",
    exampleSentence: "She impressed the judges.",
    category: "basic-verbs"
  },
  {
    term: "inspire",
    meaning: "etkilemek, ilham vermek",
    partOfSpeech: "v",
    definition: "To fill someone with the urge to do something.",
    exampleSentence: "The teacher inspired her students.",
    category: "basic-verbs"
  },
  {
    term: "motivate",
    meaning: "etkilemek, ilham vermek",
    partOfSpeech: "v",
    definition: "To make someone want to do something.",
    exampleSentence: "Praise motivates people.",
    category: "basic-verbs"
  },
  {
    term: "ignore",
    meaning: "ihmal etmek, göz ardı etmek",
    partOfSpeech: "v",
    definition: "To pay no attention to something.",
    exampleSentence: "He ignored the warning.",
    category: "basic-verbs"
  },
  {
    term: "overlook",
    meaning: "ihmal etmek, göz ardı etmek",
    partOfSpeech: "v",
    definition: "To fail to notice something.",
    exampleSentence: "She overlooked a small error.",
    category: "basic-verbs"
  },
  {
    term: "neglect",
    meaning: "ihmal etmek, göz ardı etmek",
    partOfSpeech: "v",
    definition: "To fail to care for properly.",
    exampleSentence: "He neglected his health.",
    category: "basic-verbs"
  },
  {
    term: "disregard",
    meaning: "ihmal etmek, göz ardı etmek",
    partOfSpeech: "v",
    definition: "To ignore something deliberately.",
    exampleSentence: "They disregarded the rules.",
    category: "basic-verbs"
  },
  {
    term: "judge",
    meaning: "dikkate almak, değerlendirmek",
    partOfSpeech: "v",
    definition: "To form an opinion after thinking.",
    exampleSentence: "Don't judge people by their looks.",
    category: "basic-verbs"
  },
  {
    term: "appreciate",
    meaning: "dikkate almak, değerlendirmek",
    partOfSpeech: "v",
    definition: "To recognize the value of something.",
    exampleSentence: "I appreciate your help.",
    category: "basic-verbs"
  },
  {
    term: "assess",
    meaning: "dikkate almak, değerlendirmek",
    partOfSpeech: "v",
    definition: "To judge the amount or quality of something.",
    exampleSentence: "We must assess the risk.",
    category: "basic-verbs"
  },
  {
    term: "trust",
    meaning: "güvenmek, dayanmak",
    partOfSpeech: "v",
    definition: "To believe someone is honest or reliable.",
    exampleSentence: "I trust her completely.",
    category: "basic-verbs"
  },
  {
    term: "count on",
    meaning: "güvenmek, dayanmak",
    partOfSpeech: "v",
    definition: "To rely on someone.",
    exampleSentence: "You can count on me.",
    category: "basic-verbs"
  },
  {
    term: "rely on",
    meaning: "güvenmek, dayanmak",
    partOfSpeech: "v",
    definition: "To depend on someone or something.",
    exampleSentence: "We rely on solar power.",
    category: "basic-verbs"
  },
  {
    term: "depend on",
    meaning: "güvenmek, dayanmak",
    partOfSpeech: "v",
    definition: "To need someone or something for support.",
    exampleSentence: "Plants depend on sunlight.",
    category: "basic-verbs"
  },
  {
    term: "ruin",
    meaning: "bozmak, zarar vermek",
    partOfSpeech: "v",
    definition: "To spoil or destroy something.",
    exampleSentence: "The rain ruined our picnic.",
    category: "basic-verbs"
  },
  {
    term: "harm",
    meaning: "bozmak, zarar vermek",
    partOfSpeech: "v",
    definition: "To cause damage or injury.",
    exampleSentence: "Too much sun can harm your skin.",
    category: "basic-verbs"
  },
  {
    term: "damage",
    meaning: "bozmak, zarar vermek",
    partOfSpeech: "v",
    definition: "To cause physical harm to something.",
    exampleSentence: "The storm damaged the roof.",
    category: "basic-verbs"
  },
  {
    term: "injure",
    meaning: "bozmak, zarar vermek",
    partOfSpeech: "v",
    definition: "To hurt someone physically.",
    exampleSentence: "He injured his leg.",
    category: "basic-verbs"
  },
  {
    term: "impair",
    meaning: "bozmak, zarar vermek",
    partOfSpeech: "v",
    definition: "To weaken or damage something.",
    exampleSentence: "Loud noise can impair hearing.",
    category: "basic-verbs"
  },
  {
    term: "destroy",
    meaning: "bozmak, zarar vermek",
    partOfSpeech: "v",
    definition: "To damage something so it no longer exists.",
    exampleSentence: "Fire destroyed the building.",
    category: "basic-verbs"
  },
  {
    term: "direct",
    meaning: "yönetmek",
    partOfSpeech: "v",
    definition: "To control or manage something.",
    exampleSentence: "She directs a large company.",
    category: "basic-verbs"
  },
  {
    term: "supervise",
    meaning: "yönetmek",
    partOfSpeech: "v",
    definition: "To watch and manage work or people.",
    exampleSentence: "He supervises the team.",
    category: "basic-verbs"
  },
  {
    term: "administer",
    meaning: "yönetmek",
    partOfSpeech: "v",
    definition: "To manage the running of something.",
    exampleSentence: "They administer the fund.",
    category: "basic-verbs"
  },
  {
    term: "govern",
    meaning: "yönetmek",
    partOfSpeech: "v",
    definition: "To officially control a country.",
    exampleSentence: "The party governed for ten years.",
    category: "basic-verbs"
  },
  {
    term: "rule",
    meaning: "yönetmek",
    partOfSpeech: "v",
    definition: "To have official power over a place.",
    exampleSentence: "The king ruled wisely.",
    category: "basic-verbs"
  },
  {
    term: "arise",
    meaning: "ortaya çıkmak, yok olmak",
    partOfSpeech: "v",
    definition: "To happen or begin to exist.",
    exampleSentence: "A problem has arisen.",
    category: "basic-verbs"
  },
  {
    term: "appear",
    meaning: "ortaya çıkmak, yok olmak",
    partOfSpeech: "v",
    definition: "To begin to be seen or exist.",
    exampleSentence: "New evidence has appeared.",
    category: "basic-verbs"
  },
  {
    term: "break out",
    meaning: "ortaya çıkmak, yok olmak",
    partOfSpeech: "v",
    definition: "To start suddenly (of war, fire).",
    exampleSentence: "War broke out in 1939.",
    category: "basic-verbs"
  },
  {
    term: "vanish",
    meaning: "ortaya çıkmak, yok olmak",
    partOfSpeech: "v",
    definition: "To disappear suddenly.",
    exampleSentence: "The ship vanished in the fog.",
    category: "basic-verbs"
  },
  {
    term: "disappear",
    meaning: "ortaya çıkmak, yok olmak",
    partOfSpeech: "v",
    definition: "To stop being visible or existing.",
    exampleSentence: "The pain disappeared.",
    category: "basic-verbs"
  },
  {
    term: "become extinct",
    meaning: "ortaya çıkmak, yok olmak",
    partOfSpeech: "v",
    definition: "To stop existing as a species.",
    exampleSentence: "Many animals have become extinct.",
    category: "basic-verbs"
  },
  {
    term: "cause",
    meaning: "sebep olmak",
    partOfSpeech: "v",
    definition: "To make something happen.",
    exampleSentence: "Smoking causes disease.",
    category: "basic-verbs"
  },
  {
    term: "bring about",
    meaning: "sebep olmak",
    partOfSpeech: "v",
    definition: "To make something happen.",
    exampleSentence: "The reform brought about change.",
    category: "basic-verbs"
  },
  {
    term: "lead to",
    meaning: "sebep olmak",
    partOfSpeech: "v",
    definition: "To result in something.",
    exampleSentence: "Poor diet can lead to illness.",
    category: "basic-verbs"
  },
  {
    term: "result in",
    meaning: "sebep olmak",
    partOfSpeech: "v",
    definition: "To cause a particular result.",
    exampleSentence: "The crash resulted in delays.",
    category: "basic-verbs"
  },
  {
    term: "stimulate",
    meaning: "sebep olmak",
    partOfSpeech: "v",
    definition: "To encourage something to develop.",
    exampleSentence: "Tax cuts stimulate the economy.",
    category: "basic-verbs"
  },
  {
    term: "trigger",
    meaning: "sebep olmak",
    partOfSpeech: "v",
    definition: "To cause something to start suddenly.",
    exampleSentence: "The news triggered panic.",
    category: "basic-verbs"
  },
  {
    term: "alter",
    meaning: "değiş(tir)mek, kaynaklanmak",
    partOfSpeech: "v",
    definition: "To change something.",
    exampleSentence: "She altered her plans.",
    category: "basic-verbs"
  },
  {
    term: "shift",
    meaning: "değiş(tir)mek, kaynaklanmak",
    partOfSpeech: "v",
    definition: "To move or change position.",
    exampleSentence: "Public opinion has shifted.",
    category: "basic-verbs"
  },
  {
    term: "transform",
    meaning: "değiş(tir)mek, kaynaklanmak",
    partOfSpeech: "v",
    definition: "To change completely.",
    exampleSentence: "The city was transformed.",
    category: "basic-verbs"
  },
  {
    term: "revolutionize",
    meaning: "değiş(tir)mek, kaynaklanmak",
    partOfSpeech: "v",
    definition: "To change something completely and for the better.",
    exampleSentence: "Computers revolutionized work.",
    category: "basic-verbs"
  },
  {
    term: "modify",
    meaning: "değiş(tir)mek, kaynaklanmak",
    partOfSpeech: "v",
    definition: "To change something slightly.",
    exampleSentence: "We modified the design.",
    category: "basic-verbs"
  },
  {
    term: "stem from",
    meaning: "değiş(tir)mek, kaynaklanmak",
    partOfSpeech: "v",
    definition: "To be caused by something.",
    exampleSentence: "The problem stems from poverty.",
    category: "basic-verbs"
  },
  {
    term: "spend",
    meaning: "kullanmak, harcamak, israf etmek",
    partOfSpeech: "v",
    definition: "To use time or money.",
    exampleSentence: "She spent an hour on it.",
    category: "basic-verbs"
  },
  {
    term: "consume",
    meaning: "kullanmak, harcamak, israf etmek",
    partOfSpeech: "v",
    definition: "To use up or eat/drink something.",
    exampleSentence: "The car consumes little fuel.",
    category: "basic-verbs"
  },
  {
    term: "exploit",
    meaning: "kullanmak, harcamak, israf etmek",
    partOfSpeech: "v",
    definition: "To use something for advantage.",
    exampleSentence: "They exploited the resources.",
    category: "basic-verbs"
  },
  {
    term: "deplete",
    meaning: "kullanmak, harcamak, israf etmek",
    partOfSpeech: "v",
    definition: "To reduce something greatly.",
    exampleSentence: "Overfishing depletes fish stocks.",
    category: "basic-verbs"
  },
  {
    term: "waste",
    meaning: "kullanmak, harcamak, israf etmek",
    partOfSpeech: "v",
    definition: "To use something carelessly.",
    exampleSentence: "Don't waste water.",
    category: "basic-verbs"
  },
  {
    term: "deal with",
    meaning: "ilgilenmek, ele almak",
    partOfSpeech: "v",
    definition: "To take action about something.",
    exampleSentence: "We must deal with the problem.",
    category: "basic-verbs"
  },
  {
    term: "cope with",
    meaning: "ilgilenmek, ele almak",
    partOfSpeech: "v",
    definition: "To manage a difficult situation.",
    exampleSentence: "She copes with stress well.",
    category: "basic-verbs"
  },
  {
    term: "handle",
    meaning: "ilgilenmek, ele almak",
    partOfSpeech: "v",
    definition: "To manage or control something.",
    exampleSentence: "He handled the crisis calmly.",
    category: "basic-verbs"
  },
  {
    term: "tackle",
    meaning: "ilgilenmek, ele almak",
    partOfSpeech: "v",
    definition: "To make an effort to deal with something.",
    exampleSentence: "They tackled the issue directly.",
    category: "basic-verbs"
  },
  {
    term: "address",
    meaning: "ilgilenmek, ele almak",
    partOfSpeech: "v",
    definition: "To think about and start to deal with.",
    exampleSentence: "The report addresses the problem.",
    category: "basic-verbs"
  },
  {
    term: "separate",
    meaning: "ayrılmak, farklı olmak",
    partOfSpeech: "v",
    definition: "To move or keep apart.",
    exampleSentence: "We separated the good from the bad.",
    category: "basic-verbs"
  },
  {
    term: "diverge",
    meaning: "ayrılmak, farklı olmak",
    partOfSpeech: "v",
    definition: "To go in different directions.",
    exampleSentence: "The two paths diverge here.",
    category: "basic-verbs"
  },
  {
    term: "differ",
    meaning: "ayrılmak, farklı olmak",
    partOfSpeech: "v",
    definition: "To be unlike something else.",
    exampleSentence: "Opinions differ on this.",
    category: "basic-verbs"
  },
  {
    term: "vary",
    meaning: "ayrılmak, farklı olmak",
    partOfSpeech: "v",
    definition: "To be different or change.",
    exampleSentence: "Prices vary from shop to shop.",
    category: "basic-verbs"
  },
  {
    term: "set up",
    meaning: "kurmak, inşa etmek",
    partOfSpeech: "v",
    definition: "To start or establish something.",
    exampleSentence: "They set up a new company.",
    category: "basic-verbs"
  },
  {
    term: "build",
    meaning: "kurmak, inşa etmek",
    partOfSpeech: "v",
    definition: "To make something by putting parts together.",
    exampleSentence: "They built a bridge.",
    category: "basic-verbs"
  },
  {
    term: "construct",
    meaning: "kurmak, inşa etmek",
    partOfSpeech: "v",
    definition: "To build something (formal).",
    exampleSentence: "They constructed a dam.",
    category: "basic-verbs"
  },
  {
    term: "establish",
    meaning: "kurmak, inşa etmek",
    partOfSpeech: "v",
    definition: "To start an organisation or system.",
    exampleSentence: "The school was established in 1900.",
    category: "basic-verbs"
  },
  {
    term: "exceed",
    meaning: "aşmak, geçmek",
    partOfSpeech: "v",
    definition: "To be greater than a limit.",
    exampleSentence: "The cost exceeded the budget.",
    category: "basic-verbs"
  },
  {
    term: "surpass",
    meaning: "aşmak, geçmek",
    partOfSpeech: "v",
    definition: "To be better or greater than.",
    exampleSentence: "She surpassed all expectations.",
    category: "basic-verbs"
  },
  {
    term: "overtake",
    meaning: "aşmak, geçmek",
    partOfSpeech: "v",
    definition: "To become greater or more successful than.",
    exampleSentence: "Sales overtook those of rivals.",
    category: "basic-verbs"
  },
  {
    term: "overwhelm",
    meaning: "aşmak, geçmek",
    partOfSpeech: "v",
    definition: "To be too much to deal with.",
    exampleSentence: "The city was overwhelmed by tourists.",
    category: "basic-verbs"
  },
  {
    term: "lessen",
    meaning: "azal(t)mak",
    partOfSpeech: "v",
    definition: "To become or make less.",
    exampleSentence: "This will lessen the pain.",
    category: "basic-verbs"
  },
  {
    term: "diminish",
    meaning: "azal(t)mak",
    partOfSpeech: "v",
    definition: "To become or make smaller.",
    exampleSentence: "His influence diminished.",
    category: "basic-verbs"
  },
  {
    term: "reduce",
    meaning: "azal(t)mak",
    partOfSpeech: "v",
    definition: "To make smaller in amount.",
    exampleSentence: "We must reduce costs.",
    category: "basic-verbs"
  },
  {
    term: "mitigate",
    meaning: "azal(t)mak",
    partOfSpeech: "v",
    definition: "To make something less severe.",
    exampleSentence: "Trees can mitigate flooding.",
    category: "basic-verbs"
  },
  {
    term: "shrink",
    meaning: "azal(t)mak",
    partOfSpeech: "v",
    definition: "To become smaller in size.",
    exampleSentence: "The market has shrunk.",
    category: "basic-verbs"
  },
  {
    term: "remain",
    meaning: "durumunu korumak",
    partOfSpeech: "v",
    definition: "To continue to be in a state.",
    exampleSentence: "The situation remains unclear.",
    category: "basic-verbs"
  },
  {
    term: "maintain",
    meaning: "durumunu korumak",
    partOfSpeech: "v",
    definition: "To keep something in a state.",
    exampleSentence: "They maintain high standards.",
    category: "basic-verbs"
  },
  {
    term: "stay",
    meaning: "durumunu korumak",
    partOfSpeech: "v",
    definition: "To continue to be in a place or state.",
    exampleSentence: "Please stay calm.",
    category: "basic-verbs"
  },
  {
    term: "increase",
    meaning: "art(ır)mak",
    partOfSpeech: "v",
    definition: "To become or make greater.",
    exampleSentence: "Prices increased sharply.",
    category: "basic-verbs"
  },
  {
    term: "rise",
    meaning: "art(ır)mak",
    partOfSpeech: "v",
    definition: "To go up in level or amount.",
    exampleSentence: "Temperatures rose quickly.",
    category: "basic-verbs"
  },
  {
    term: "boost",
    meaning: "art(ır)mak",
    partOfSpeech: "v",
    definition: "To increase or improve something.",
    exampleSentence: "Ads boost sales.",
    category: "basic-verbs"
  },
  {
    term: "go up",
    meaning: "art(ır)mak",
    partOfSpeech: "v",
    definition: "To rise or increase.",
    exampleSentence: "Fuel prices went up again.",
    category: "basic-verbs"
  },
  {
    term: "search",
    meaning: "aramak, araştırmak",
    partOfSpeech: "v",
    definition: "To look carefully for something.",
    exampleSentence: "They searched for the missing child.",
    category: "basic-verbs"
  },
  {
    term: "investigate",
    meaning: "aramak, araştırmak",
    partOfSpeech: "v",
    definition: "To examine something carefully.",
    exampleSentence: "Police are investigating the crime.",
    category: "basic-verbs"
  },
  {
    term: "explore",
    meaning: "aramak, araştırmak",
    partOfSpeech: "v",
    definition: "To examine or travel through a place.",
    exampleSentence: "They explored the cave.",
    category: "basic-verbs"
  },
  {
    term: "seek",
    meaning: "aramak, araştırmak",
    partOfSpeech: "v",
    definition: "To try to find or obtain something.",
    exampleSentence: "She is seeking a new job.",
    category: "basic-verbs"
  },
  {
    term: "recall",
    meaning: "hatırlamak, hatırlatmak",
    partOfSpeech: "v",
    definition: "To remember something.",
    exampleSentence: "I can't recall his name.",
    category: "basic-verbs"
  },
  {
    term: "remember",
    meaning: "hatırlamak, hatırlatmak",
    partOfSpeech: "v",
    definition: "To keep something in your mind.",
    exampleSentence: "Remember to lock the door.",
    category: "basic-verbs"
  },
  {
    term: "remind",
    meaning: "hatırlamak, hatırlatmak",
    partOfSpeech: "v",
    definition: "To make someone remember something.",
    exampleSentence: "Remind me to call her.",
    category: "basic-verbs"
  },
  {
    term: "stare at",
    meaning: "bakmak",
    partOfSpeech: "v",
    definition: "To look for a long time with wide eyes.",
    exampleSentence: "He stared at the screen.",
    category: "basic-verbs"
  },
  {
    term: "gaze at",
    meaning: "bakmak",
    partOfSpeech: "v",
    definition: "To look steadily and with wonder.",
    exampleSentence: "She gazed at the stars.",
    category: "basic-verbs"
  },
  {
    term: "glance at",
    meaning: "bakmak",
    partOfSpeech: "v",
    definition: "To look quickly at something.",
    exampleSentence: "He glanced at his watch.",
    category: "basic-verbs"
  },
  {
    term: "cancel",
    meaning: "iptal etmek, ertelemek",
    partOfSpeech: "v",
    definition: "To decide something will not happen.",
    exampleSentence: "They cancelled the meeting.",
    category: "basic-verbs"
  },
  {
    term: "call off",
    meaning: "iptal etmek, ertelemek",
    partOfSpeech: "v",
    definition: "To cancel something.",
    exampleSentence: "The match was called off.",
    category: "basic-verbs"
  },
  {
    term: "postpone",
    meaning: "iptal etmek, ertelemek",
    partOfSpeech: "v",
    definition: "To arrange for a later time.",
    exampleSentence: "We postponed the trip.",
    category: "basic-verbs"
  },
  {
    term: "put off",
    meaning: "iptal etmek, ertelemek",
    partOfSpeech: "v",
    definition: "To delay to a later time.",
    exampleSentence: "Don't put off your work.",
    category: "basic-verbs"
  },
  {
    term: "provide",
    meaning: "sağlamak, kaynak sağlamak",
    partOfSpeech: "v",
    definition: "To give something needed.",
    exampleSentence: "The hotel provides towels.",
    category: "basic-verbs"
  },
  {
    term: "supply",
    meaning: "sağlamak, kaynak sağlamak",
    partOfSpeech: "v",
    definition: "To provide something needed.",
    exampleSentence: "They supply water to the village.",
    category: "basic-verbs"
  },
  {
    term: "grant",
    meaning: "sağlamak, kaynak sağlamak",
    partOfSpeech: "v",
    definition: "To give or allow something formally.",
    exampleSentence: "They granted him a visa.",
    category: "basic-verbs"
  },
  {
    term: "fund",
    meaning: "sağlamak, kaynak sağlamak",
    partOfSpeech: "v",
    definition: "To provide money for something.",
    exampleSentence: "The government funds the project.",
    category: "basic-verbs"
  },
  {
    term: "finance",
    meaning: "sağlamak, kaynak sağlamak",
    partOfSpeech: "v",
    definition: "To provide money for something.",
    exampleSentence: "A bank financed the deal.",
    category: "basic-verbs"
  },
  {
    term: "abolish",
    meaning: "yürürlükten kaldırmak, kökünü kazımak",
    partOfSpeech: "v",
    definition: "To officially end a law or system.",
    exampleSentence: "They abolished the tax.",
    category: "basic-verbs"
  },
  {
    term: "eradicate",
    meaning: "yürürlükten kaldırmak, kökünü kazımak",
    partOfSpeech: "v",
    definition: "To destroy something completely.",
    exampleSentence: "We must eradicate the disease.",
    category: "basic-verbs"
  },
  {
    term: "put an end to",
    meaning: "yürürlükten kaldırmak, kökünü kazımak",
    partOfSpeech: "v",
    definition: "To stop something completely.",
    exampleSentence: "They put an end to the abuse.",
    category: "basic-verbs"
  },
  {
    term: "improve",
    meaning: "geliş(tir)mek",
    partOfSpeech: "v",
    definition: "To make or become better.",
    exampleSentence: "She improved her English.",
    category: "basic-verbs"
  },
  {
    term: "develop",
    meaning: "geliş(tir)mek",
    partOfSpeech: "v",
    definition: "To grow or make something grow.",
    exampleSentence: "They developed a new drug.",
    category: "basic-verbs"
  },
  {
    term: "enhance",
    meaning: "geliş(tir)mek",
    partOfSpeech: "v",
    definition: "To improve the quality of something.",
    exampleSentence: "The photo enhances the room.",
    category: "basic-verbs"
  },
  {
    term: "withdraw",
    meaning: "geri çek(il)mek",
    partOfSpeech: "v",
    definition: "To take back or move back.",
    exampleSentence: "The troops withdrew.",
    category: "basic-verbs"
  },
  {
    term: "retreat",
    meaning: "geri çek(il)mek",
    partOfSpeech: "v",
    definition: "To move back from a difficult situation.",
    exampleSentence: "The army retreated.",
    category: "basic-verbs"
  },
  {
    term: "important",
    meaning: "önemli, öncelikli",
    partOfSpeech: "adj",
    definition: "Of great significance or value.",
    exampleSentence: "It is important to read the instructions.",
    category: "basic-adjectives"
  },
  {
    term: "crucial",
    meaning: "önemli, öncelikli",
    partOfSpeech: "adj",
    definition: "Extremely important or necessary.",
    exampleSentence: "Water is crucial for all living things.",
    category: "basic-adjectives"
  },
  {
    term: "critical",
    meaning: "önemli, öncelikli",
    partOfSpeech: "adj",
    definition: "Very important at a decisive stage.",
    exampleSentence: "The next few days are critical for the patient.",
    category: "basic-adjectives"
  },
  {
    term: "vital",
    meaning: "önemli, öncelikli",
    partOfSpeech: "adj",
    definition: "Absolutely necessary; essential for life.",
    exampleSentence: "A good diet is vital for health.",
    category: "basic-adjectives"
  },
  {
    term: "significant",
    meaning: "önemli, öncelikli",
    partOfSpeech: "adj",
    definition: "Large or important enough to matter.",
    exampleSentence: "There was a significant rise in prices.",
    category: "basic-adjectives"
  },
  {
    term: "necessary",
    meaning: "temel, gerekli",
    partOfSpeech: "adj",
    definition: "Needed to achieve something.",
    exampleSentence: "Sleep is necessary for good health.",
    category: "basic-adjectives"
  },
  {
    term: "essential",
    meaning: "temel, gerekli",
    partOfSpeech: "adj",
    definition: "Absolutely necessary.",
    exampleSentence: "Water is essential for survival.",
    category: "basic-adjectives"
  },
  {
    term: "fundamental",
    meaning: "temel, gerekli",
    partOfSpeech: "adj",
    definition: "Forming a necessary base or core.",
    exampleSentence: "Freedom is a fundamental human right.",
    category: "basic-adjectives"
  },
  {
    term: "required",
    meaning: "temel, gerekli",
    partOfSpeech: "adj",
    definition: "Officially needed or demanded.",
    exampleSentence: "A passport is required to travel abroad.",
    category: "basic-adjectives"
  },
  {
    term: "basic",
    meaning: "temel, gerekli",
    partOfSpeech: "adj",
    definition: "Forming an essential foundation.",
    exampleSentence: "We learned the basic rules of grammar.",
    category: "basic-adjectives"
  },
  {
    term: "needed",
    meaning: "temel, gerekli",
    partOfSpeech: "adj",
    definition: "That is required in a situation.",
    exampleSentence: "More doctors are needed in rural areas.",
    category: "basic-adjectives"
  },
  {
    term: "mandatory",
    meaning: "zorunlu, şart",
    partOfSpeech: "adj",
    definition: "Required by law or rules.",
    exampleSentence: "Wearing a seatbelt is mandatory.",
    category: "basic-adjectives"
  },
  {
    term: "obligatory",
    meaning: "zorunlu, şart",
    partOfSpeech: "adj",
    definition: "Required as a duty or obligation.",
    exampleSentence: "Attendance at the meeting is obligatory.",
    category: "basic-adjectives"
  },
  {
    term: "compulsory",
    meaning: "zorunlu, şart",
    partOfSpeech: "adj",
    definition: "That must be done; required.",
    exampleSentence: "Education is compulsory for children.",
    category: "basic-adjectives"
  },
  {
    term: "enforced",
    meaning: "zorunlu, şart",
    partOfSpeech: "adj",
    definition: "Made to happen by authority.",
    exampleSentence: "The new rule is strictly enforced.",
    category: "basic-adjectives"
  },
  {
    term: "strange",
    meaning: "tuhaf, garip",
    partOfSpeech: "adj",
    definition: "Unusual or difficult to explain.",
    exampleSentence: "I heard a strange noise at night.",
    category: "basic-adjectives"
  },
  {
    term: "weird",
    meaning: "tuhaf, garip",
    partOfSpeech: "adj",
    definition: "Very strange or unusual.",
    exampleSentence: "He has a weird sense of humour.",
    category: "basic-adjectives"
  },
  {
    term: "odd",
    meaning: "tuhaf, garip",
    partOfSpeech: "adj",
    definition: "Different from what is normal.",
    exampleSentence: "It's odd that she didn't call.",
    category: "basic-adjectives"
  },
  {
    term: "bizarre",
    meaning: "tuhaf, garip",
    partOfSpeech: "adj",
    definition: "Very strange and surprising.",
    exampleSentence: "The film has a bizarre ending.",
    category: "basic-adjectives"
  },
  {
    term: "peculiar",
    meaning: "tuhaf, garip",
    partOfSpeech: "adj",
    definition: "Strange or unusual in an odd way.",
    exampleSentence: "The soup had a peculiar taste.",
    category: "basic-adjectives"
  },
  {
    term: "ridiculous",
    meaning: "saçma, absürt",
    partOfSpeech: "adj",
    definition: "Deserving to be laughed at; absurd.",
    exampleSentence: "That is a ridiculous idea.",
    category: "basic-adjectives"
  },
  {
    term: "absurd",
    meaning: "saçma, absürt",
    partOfSpeech: "adj",
    definition: "Completely unreasonable or silly.",
    exampleSentence: "It's absurd to expect perfection.",
    category: "basic-adjectives"
  },
  {
    term: "irrational",
    meaning: "saçma, absürt",
    partOfSpeech: "adj",
    definition: "Not based on clear thought or reason.",
    exampleSentence: "He has an irrational fear of spiders.",
    category: "basic-adjectives"
  },
  {
    term: "silly",
    meaning: "saçma, absürt",
    partOfSpeech: "adj",
    definition: "Foolish or lacking good sense.",
    exampleSentence: "Don't ask silly questions.",
    category: "basic-adjectives"
  },
  {
    term: "fantastic",
    meaning: "şahane, sıradışı",
    partOfSpeech: "adj",
    definition: "Extremely good; wonderful.",
    exampleSentence: "We had a fantastic holiday.",
    category: "basic-adjectives"
  },
  {
    term: "wonderful",
    meaning: "şahane, sıradışı",
    partOfSpeech: "adj",
    definition: "Extremely good or pleasant.",
    exampleSentence: "What a wonderful surprise!",
    category: "basic-adjectives"
  },
  {
    term: "excellent",
    meaning: "şahane, sıradışı",
    partOfSpeech: "adj",
    definition: "Extremely good; of high quality.",
    exampleSentence: "She did an excellent job.",
    category: "basic-adjectives"
  },
  {
    term: "outstanding",
    meaning: "şahane, sıradışı",
    partOfSpeech: "adj",
    definition: "Exceptionally good.",
    exampleSentence: "He gave an outstanding performance.",
    category: "basic-adjectives"
  },
  {
    term: "extraordinary",
    meaning: "şahane, sıradışı",
    partOfSpeech: "adj",
    definition: "Very unusual or remarkable.",
    exampleSentence: "She has an extraordinary talent.",
    category: "basic-adjectives"
  },
  {
    term: "abundant",
    meaning: "çok miktarda, bol",
    partOfSpeech: "adj",
    definition: "Existing in large quantities.",
    exampleSentence: "The region has abundant rainfall.",
    category: "basic-adjectives"
  },
  {
    term: "numerous",
    meaning: "çok miktarda, bol",
    partOfSpeech: "adj",
    definition: "Very many.",
    exampleSentence: "There are numerous reasons for this.",
    category: "basic-adjectives"
  },
  {
    term: "ample",
    meaning: "çok miktarda, bol",
    partOfSpeech: "adj",
    definition: "More than enough.",
    exampleSentence: "There is ample space for everyone.",
    category: "basic-adjectives"
  },
  {
    term: "considerable",
    meaning: "çok miktarda, bol",
    partOfSpeech: "adj",
    definition: "Large in amount or degree.",
    exampleSentence: "It took a considerable amount of time.",
    category: "basic-adjectives"
  },
  {
    term: "substantial",
    meaning: "çok miktarda, bol",
    partOfSpeech: "adj",
    definition: "Large in size, value or importance.",
    exampleSentence: "They made a substantial profit.",
    category: "basic-adjectives"
  },
  {
    term: "few",
    meaning: "az sayıda, az",
    partOfSpeech: "adj",
    definition: "A small number of.",
    exampleSentence: "Few people attended the meeting.",
    category: "basic-adjectives"
  },
  {
    term: "little",
    meaning: "az sayıda, az",
    partOfSpeech: "adj",
    definition: "A small amount of.",
    exampleSentence: "There is little hope left.",
    category: "basic-adjectives"
  },
  {
    term: "meagre",
    meaning: "az sayıda, az",
    partOfSpeech: "adj",
    definition: "Small and inadequate in amount.",
    exampleSentence: "He earns a meagre salary.",
    category: "basic-adjectives"
  },
  {
    term: "scarce",
    meaning: "az sayıda, az",
    partOfSpeech: "adj",
    definition: "Not enough; hard to find.",
    exampleSentence: "Water is scarce in the desert.",
    category: "basic-adjectives"
  },
  {
    term: "rare",
    meaning: "az sayıda, az",
    partOfSpeech: "adj",
    definition: "Not happening or found very often.",
    exampleSentence: "This is a rare bird.",
    category: "basic-adjectives"
  },
  {
    term: "inadequate",
    meaning: "yetersiz, sınırlı",
    partOfSpeech: "adj",
    definition: "Not enough or not good enough.",
    exampleSentence: "The lighting was inadequate.",
    category: "basic-adjectives"
  },
  {
    term: "insufficient",
    meaning: "yetersiz, sınırlı",
    partOfSpeech: "adj",
    definition: "Not enough for a purpose.",
    exampleSentence: "We had insufficient time to finish.",
    category: "basic-adjectives"
  },
  {
    term: "insignificant",
    meaning: "yetersiz, sınırlı",
    partOfSpeech: "adj",
    definition: "Too small to be important.",
    exampleSentence: "The difference is insignificant.",
    category: "basic-adjectives"
  },
  {
    term: "restricted",
    meaning: "yetersiz, sınırlı",
    partOfSpeech: "adj",
    definition: "Limited or controlled.",
    exampleSentence: "Access to the area is restricted.",
    category: "basic-adjectives"
  },
  {
    term: "limited",
    meaning: "yetersiz, sınırlı",
    partOfSpeech: "adj",
    definition: "Small in amount or extent.",
    exampleSentence: "We have limited resources.",
    category: "basic-adjectives"
  },
  {
    term: "tiny",
    meaning: "ufak, önemsiz, kısa",
    partOfSpeech: "adj",
    definition: "Extremely small.",
    exampleSentence: "A tiny insect landed on my hand.",
    category: "basic-adjectives"
  },
  {
    term: "paltry",
    meaning: "ufak, önemsiz, kısa",
    partOfSpeech: "adj",
    definition: "Too small to be worth considering.",
    exampleSentence: "They offered a paltry sum of money.",
    category: "basic-adjectives"
  },
  {
    term: "brief",
    meaning: "ufak, önemsiz, kısa",
    partOfSpeech: "adj",
    definition: "Lasting only a short time.",
    exampleSentence: "She made a brief speech.",
    category: "basic-adjectives"
  },
  {
    term: "concise",
    meaning: "ufak, önemsiz, kısa",
    partOfSpeech: "adj",
    definition: "Giving much information in few words.",
    exampleSentence: "Please write a concise summary.",
    category: "basic-adjectives"
  },
  {
    term: "huge",
    meaning: "büyük, devasa",
    partOfSpeech: "adj",
    definition: "Extremely large.",
    exampleSentence: "They live in a huge house.",
    category: "basic-adjectives"
  },
  {
    term: "immense",
    meaning: "büyük, devasa",
    partOfSpeech: "adj",
    definition: "Extremely large in size or degree.",
    exampleSentence: "The project required immense effort.",
    category: "basic-adjectives"
  },
  {
    term: "gigantic",
    meaning: "büyük, devasa",
    partOfSpeech: "adj",
    definition: "Extremely large; enormous.",
    exampleSentence: "A gigantic wave hit the shore.",
    category: "basic-adjectives"
  },
  {
    term: "vast",
    meaning: "büyük, devasa",
    partOfSpeech: "adj",
    definition: "Very great in size or amount.",
    exampleSentence: "The desert covers a vast area.",
    category: "basic-adjectives"
  },
  {
    term: "enormous",
    meaning: "büyük, devasa",
    partOfSpeech: "adj",
    definition: "Extremely large.",
    exampleSentence: "An enormous crowd gathered.",
    category: "basic-adjectives"
  },
  {
    term: "separate",
    meaning: "ayrı, farklı",
    partOfSpeech: "adj",
    definition: "Not joined or connected.",
    exampleSentence: "They sleep in separate rooms.",
    category: "basic-adjectives"
  },
  {
    term: "distinct",
    meaning: "ayrı, farklı",
    partOfSpeech: "adj",
    definition: "Clearly different or noticeable.",
    exampleSentence: "The two species are quite distinct.",
    category: "basic-adjectives"
  },
  {
    term: "different",
    meaning: "ayrı, farklı",
    partOfSpeech: "adj",
    definition: "Not the same as another.",
    exampleSentence: "We have very different opinions.",
    category: "basic-adjectives"
  },
  {
    term: "diverse",
    meaning: "ayrı, farklı",
    partOfSpeech: "adj",
    definition: "Very different from each other.",
    exampleSentence: "The city has a diverse population.",
    category: "basic-adjectives"
  },
  {
    term: "evident",
    meaning: "açık, net",
    partOfSpeech: "adj",
    definition: "Clearly seen or understood.",
    exampleSentence: "Her joy was evident to everyone.",
    category: "basic-adjectives"
  },
  {
    term: "clear",
    meaning: "açık, net",
    partOfSpeech: "adj",
    definition: "Easy to see, hear or understand.",
    exampleSentence: "The instructions are very clear.",
    category: "basic-adjectives"
  },
  {
    term: "apparent",
    meaning: "açık, net",
    partOfSpeech: "adj",
    definition: "Clearly visible or understood.",
    exampleSentence: "It soon became apparent that he was lying.",
    category: "basic-adjectives"
  },
  {
    term: "obvious",
    meaning: "açık, net",
    partOfSpeech: "adj",
    definition: "Easy to see or understand.",
    exampleSentence: "The answer is obvious.",
    category: "basic-adjectives"
  },
  {
    term: "visible",
    meaning: "açık, net",
    partOfSpeech: "adj",
    definition: "Able to be seen.",
    exampleSentence: "The stars were clearly visible.",
    category: "basic-adjectives"
  },
  {
    term: "shining",
    meaning: "canlı, ışıltılı",
    partOfSpeech: "adj",
    definition: "Producing or reflecting light.",
    exampleSentence: "The shining sun warmed the field.",
    category: "basic-adjectives"
  },
  {
    term: "gleaming",
    meaning: "canlı, ışıltılı",
    partOfSpeech: "adj",
    definition: "Shining brightly; polished.",
    exampleSentence: "The kitchen was spotless and gleaming.",
    category: "basic-adjectives"
  },
  {
    term: "lively",
    meaning: "canlı, ışıltılı",
    partOfSpeech: "adj",
    definition: "Full of life and energy.",
    exampleSentence: "She has a lively personality.",
    category: "basic-adjectives"
  },
  {
    term: "vibrant",
    meaning: "canlı, ışıltılı",
    partOfSpeech: "adj",
    definition: "Full of energy and bright colour.",
    exampleSentence: "The market was vibrant and colourful.",
    category: "basic-adjectives"
  },
  {
    term: "invaluable",
    meaning: "değerli, kıymetli",
    partOfSpeech: "adj",
    definition: "Extremely useful; priceless.",
    exampleSentence: "Her advice was invaluable.",
    category: "basic-adjectives"
  },
  {
    term: "valuable",
    meaning: "değerli, kıymetli",
    partOfSpeech: "adj",
    definition: "Worth a lot of money or very useful.",
    exampleSentence: "This is a valuable painting.",
    category: "basic-adjectives"
  },
  {
    term: "priceless",
    meaning: "değerli, kıymetli",
    partOfSpeech: "adj",
    definition: "So valuable it cannot be priced.",
    exampleSentence: "The museum holds priceless treasures.",
    category: "basic-adjectives"
  },
  {
    term: "precious",
    meaning: "değerli, kıymetli",
    partOfSpeech: "adj",
    definition: "Of great value; loved.",
    exampleSentence: "Clean water is a precious resource.",
    category: "basic-adjectives"
  },
  {
    term: "bankrupt",
    meaning: "iflas etmiş, parasız",
    partOfSpeech: "adj",
    definition: "Unable to pay one's debts.",
    exampleSentence: "The company went bankrupt last year.",
    category: "basic-adjectives"
  },
  {
    term: "broke",
    meaning: "iflas etmiş, parasız",
    partOfSpeech: "adj",
    definition: "Having no money at all.",
    exampleSentence: "I'm completely broke this month.",
    category: "basic-adjectives"
  },
  {
    term: "feasible",
    meaning: "uygulanabilir, karlı",
    partOfSpeech: "adj",
    definition: "Possible to do easily or conveniently.",
    exampleSentence: "Is the plan feasible?",
    category: "basic-adjectives"
  },
  {
    term: "viable",
    meaning: "uygulanabilir, karlı",
    partOfSpeech: "adj",
    definition: "Capable of working successfully.",
    exampleSentence: "We need a viable solution.",
    category: "basic-adjectives"
  },
  {
    term: "practical",
    meaning: "uygulanabilir, karlı",
    partOfSpeech: "adj",
    definition: "Likely to work or be useful.",
    exampleSentence: "She gave me some practical advice.",
    category: "basic-adjectives"
  },
  {
    term: "applicable",
    meaning: "uygulanabilir, karlı",
    partOfSpeech: "adj",
    definition: "Relevant or appropriate.",
    exampleSentence: "The rule is applicable to everyone.",
    category: "basic-adjectives"
  },
  {
    term: "lucrative",
    meaning: "uygulanabilir, karlı",
    partOfSpeech: "adj",
    definition: "Producing a lot of money.",
    exampleSentence: "It is a lucrative business.",
    category: "basic-adjectives"
  },
  {
    term: "appropriate",
    meaning: "düzgün, uygun, yetkin",
    partOfSpeech: "adj",
    definition: "Suitable for a situation.",
    exampleSentence: "Wear appropriate clothes for the interview.",
    category: "basic-adjectives"
  },
  {
    term: "proper",
    meaning: "düzgün, uygun, yetkin",
    partOfSpeech: "adj",
    definition: "Correct or suitable.",
    exampleSentence: "Use the proper tools for the job.",
    category: "basic-adjectives"
  },
  {
    term: "competent",
    meaning: "düzgün, uygun, yetkin",
    partOfSpeech: "adj",
    definition: "Having enough skill to do something well.",
    exampleSentence: "She is a competent manager.",
    category: "basic-adjectives"
  },
  {
    term: "qualified",
    meaning: "düzgün, uygun, yetkin",
    partOfSpeech: "adj",
    definition: "Having the training or ability needed.",
    exampleSentence: "He is qualified to teach English.",
    category: "basic-adjectives"
  },
  {
    term: "innovative",
    meaning: "düzgün, uygun, yetkin",
    partOfSpeech: "adj",
    definition: "Introducing new ideas or methods.",
    exampleSentence: "They developed an innovative product.",
    category: "basic-adjectives"
  },
  {
    term: "possible",
    meaning: "olası, muhtemel",
    partOfSpeech: "adj",
    definition: "Able to happen or be done.",
    exampleSentence: "It is possible to finish today.",
    category: "basic-adjectives"
  },
  {
    term: "probable",
    meaning: "olası, muhtemel",
    partOfSpeech: "adj",
    definition: "Likely to happen or be true.",
    exampleSentence: "Rain is probable this afternoon.",
    category: "basic-adjectives"
  },
  {
    term: "likely",
    meaning: "olası, muhtemel",
    partOfSpeech: "adj",
    definition: "Expected to happen; probable.",
    exampleSentence: "He is likely to win the race.",
    category: "basic-adjectives"
  },
  {
    term: "improbable",
    meaning: "imkansız, olası değil",
    partOfSpeech: "adj",
    definition: "Not likely to be true or happen.",
    exampleSentence: "Such an event is highly improbable.",
    category: "basic-adjectives"
  },
  {
    term: "impossible",
    meaning: "imkansız, olası değil",
    partOfSpeech: "adj",
    definition: "Not able to happen or be done.",
    exampleSentence: "It is impossible to be everywhere at once.",
    category: "basic-adjectives"
  },
  {
    term: "unlikely",
    meaning: "imkansız, olası değil",
    partOfSpeech: "adj",
    definition: "Not likely to happen.",
    exampleSentence: "It is unlikely that he will come.",
    category: "basic-adjectives"
  },
  {
    term: "objective",
    meaning: "tarafsız, nesnel",
    partOfSpeech: "adj",
    definition: "Not influenced by personal feelings.",
    exampleSentence: "A judge must remain objective.",
    category: "basic-adjectives"
  },
  {
    term: "neutral",
    meaning: "tarafsız, nesnel",
    partOfSpeech: "adj",
    definition: "Not supporting either side.",
    exampleSentence: "The country stayed neutral in the war.",
    category: "basic-adjectives"
  },
  {
    term: "impartial",
    meaning: "tarafsız, nesnel",
    partOfSpeech: "adj",
    definition: "Treating all sides fairly.",
    exampleSentence: "We need an impartial referee.",
    category: "basic-adjectives"
  },
  {
    term: "fair",
    meaning: "tarafsız, nesnel",
    partOfSpeech: "adj",
    definition: "Treating people equally and justly.",
    exampleSentence: "The decision was fair to everyone.",
    category: "basic-adjectives"
  },
  {
    term: "angry",
    meaning: "kızgın, hayal kırıklığına uğramış",
    partOfSpeech: "adj",
    definition: "Feeling strong displeasure.",
    exampleSentence: "She was angry about the delay.",
    category: "basic-adjectives"
  },
  {
    term: "annoyed",
    meaning: "kızgın, hayal kırıklığına uğramış",
    partOfSpeech: "adj",
    definition: "Slightly angry or irritated.",
    exampleSentence: "He was annoyed by the noise.",
    category: "basic-adjectives"
  },
  {
    term: "disappointed",
    meaning: "kızgın, hayal kırıklığına uğramış",
    partOfSpeech: "adj",
    definition: "Sad because hopes were not met.",
    exampleSentence: "I was disappointed with the result.",
    category: "basic-adjectives"
  },
  {
    term: "frustrated",
    meaning: "kızgın, hayal kırıklığına uğramış",
    partOfSpeech: "adj",
    definition: "Upset at being unable to do something.",
    exampleSentence: "She felt frustrated by the slow progress.",
    category: "basic-adjectives"
  },
  {
    term: "invincible",
    meaning: "yenilmez, güçlü",
    partOfSpeech: "adj",
    definition: "Too strong to be defeated.",
    exampleSentence: "The team seemed invincible.",
    category: "basic-adjectives"
  },
  {
    term: "unbeatable",
    meaning: "yenilmez, güçlü",
    partOfSpeech: "adj",
    definition: "Impossible to defeat or beat.",
    exampleSentence: "Their prices are unbeatable.",
    category: "basic-adjectives"
  },
  {
    term: "powerful",
    meaning: "yenilmez, güçlü",
    partOfSpeech: "adj",
    definition: "Having great power or strength.",
    exampleSentence: "It is a powerful engine.",
    category: "basic-adjectives"
  },
  {
    term: "mighty",
    meaning: "yenilmez, güçlü",
    partOfSpeech: "adj",
    definition: "Very strong or powerful.",
    exampleSentence: "A mighty river flowed through the valley.",
    category: "basic-adjectives"
  },
  {
    term: "careful",
    meaning: "dikkatli, titiz",
    partOfSpeech: "adj",
    definition: "Giving attention to avoid harm or error.",
    exampleSentence: "Be careful with the hot pan.",
    category: "basic-adjectives"
  },
  {
    term: "cautious",
    meaning: "dikkatli, titiz",
    partOfSpeech: "adj",
    definition: "Careful to avoid risks.",
    exampleSentence: "She is cautious about spending money.",
    category: "basic-adjectives"
  },
  {
    term: "meticulous",
    meaning: "dikkatli, titiz",
    partOfSpeech: "adj",
    definition: "Very careful about small details.",
    exampleSentence: "He is meticulous in his work.",
    category: "basic-adjectives"
  },
  {
    term: "eminent",
    meaning: "ünlü, iyi bilinen",
    partOfSpeech: "adj",
    definition: "Famous and respected in a field.",
    exampleSentence: "She is an eminent scientist.",
    category: "basic-adjectives"
  },
  {
    term: "famous",
    meaning: "ünlü, iyi bilinen",
    partOfSpeech: "adj",
    definition: "Known by many people.",
    exampleSentence: "He is a famous actor.",
    category: "basic-adjectives"
  },
  {
    term: "celebrated",
    meaning: "ünlü, iyi bilinen",
    partOfSpeech: "adj",
    definition: "Greatly admired and well known.",
    exampleSentence: "It is a celebrated work of art.",
    category: "basic-adjectives"
  },
  {
    term: "doubtful",
    meaning: "şüpheci, kuşkucu",
    partOfSpeech: "adj",
    definition: "Feeling or causing doubt.",
    exampleSentence: "I'm doubtful about the plan.",
    category: "basic-adjectives"
  },
  {
    term: "sceptical",
    meaning: "şüpheci, kuşkucu",
    partOfSpeech: "adj",
    definition: "Not easily convinced; having doubts.",
    exampleSentence: "She was sceptical of his claims.",
    category: "basic-adjectives"
  },
  {
    term: "dubious",
    meaning: "şüpheci, kuşkucu",
    partOfSpeech: "adj",
    definition: "Not certain or reliable.",
    exampleSentence: "The evidence is rather dubious.",
    category: "basic-adjectives"
  },
  {
    term: "determined",
    meaning: "kararlı",
    partOfSpeech: "adj",
    definition: "Having firm intention to do something.",
    exampleSentence: "She is determined to succeed.",
    category: "basic-adjectives"
  },
  {
    term: "decisive",
    meaning: "kararlı",
    partOfSpeech: "adj",
    definition: "Able to make decisions quickly.",
    exampleSentence: "We need a decisive leader.",
    category: "basic-adjectives"
  },
  {
    term: "willing",
    meaning: "istekli, hevesli",
    partOfSpeech: "adj",
    definition: "Ready and happy to do something.",
    exampleSentence: "She is willing to help.",
    category: "basic-adjectives"
  },
  {
    term: "eager",
    meaning: "istekli, hevesli",
    partOfSpeech: "adj",
    definition: "Very keen and enthusiastic.",
    exampleSentence: "The children were eager to learn.",
    category: "basic-adjectives"
  },
  {
    term: "keen",
    meaning: "istekli, hevesli",
    partOfSpeech: "adj",
    definition: "Very interested and enthusiastic.",
    exampleSentence: "He is keen on football.",
    category: "basic-adjectives"
  },
  {
    term: "insane",
    meaning: "çılgın, deli",
    partOfSpeech: "adj",
    definition: "Extremely foolish or mad.",
    exampleSentence: "It would be insane to drive in this storm.",
    category: "basic-adjectives"
  },
  {
    term: "crazy",
    meaning: "çılgın, deli",
    partOfSpeech: "adj",
    definition: "Very foolish or wild.",
    exampleSentence: "That's a crazy idea.",
    category: "basic-adjectives"
  },
  {
    term: "mad",
    meaning: "çılgın, deli",
    partOfSpeech: "adj",
    definition: "Very foolish or angry.",
    exampleSentence: "She was mad about the mess.",
    category: "basic-adjectives"
  },
  {
    term: "moderate",
    meaning: "ılımlı, dengeli",
    partOfSpeech: "adj",
    definition: "Not extreme; reasonable.",
    exampleSentence: "He has moderate political views.",
    category: "basic-adjectives"
  },
  {
    term: "temperate",
    meaning: "ılımlı, dengeli",
    partOfSpeech: "adj",
    definition: "Showing self-control; mild.",
    exampleSentence: "They live in a temperate climate.",
    category: "basic-adjectives"
  },
  {
    term: "optimistic",
    meaning: "iyimser, kötümser",
    partOfSpeech: "adj",
    definition: "Hopeful about the future.",
    exampleSentence: "She is optimistic about her chances.",
    category: "basic-adjectives"
  },
  {
    term: "hopeful",
    meaning: "iyimser, kötümser",
    partOfSpeech: "adj",
    definition: "Feeling or showing hope.",
    exampleSentence: "We are hopeful of good news.",
    category: "basic-adjectives"
  },
  {
    term: "pessimistic",
    meaning: "iyimser, kötümser",
    partOfSpeech: "adj",
    definition: "Expecting the worst to happen.",
    exampleSentence: "He is pessimistic about the economy.",
    category: "basic-adjectives"
  },
  {
    term: "rebellious",
    meaning: "isyankar, savurgan",
    partOfSpeech: "adj",
    definition: "Refusing to obey rules or authority.",
    exampleSentence: "He was a rebellious teenager.",
    category: "basic-adjectives"
  },
  {
    term: "disobedient",
    meaning: "isyankar, savurgan",
    partOfSpeech: "adj",
    definition: "Failing to obey.",
    exampleSentence: "The dog was disobedient.",
    category: "basic-adjectives"
  },
  {
    term: "extravagant",
    meaning: "isyankar, savurgan",
    partOfSpeech: "adj",
    definition: "Spending much more than is needed.",
    exampleSentence: "They led an extravagant lifestyle.",
    category: "basic-adjectives"
  },
  {
    term: "thoughtless",
    meaning: "düşüncesiz, umursamaz",
    partOfSpeech: "adj",
    definition: "Not thinking about others' feelings.",
    exampleSentence: "It was a thoughtless remark.",
    category: "basic-adjectives"
  },
  {
    term: "reckless",
    meaning: "düşüncesiz, umursamaz",
    partOfSpeech: "adj",
    definition: "Careless about danger or consequences.",
    exampleSentence: "He is a reckless driver.",
    category: "basic-adjectives"
  },
  {
    term: "careless",
    meaning: "düşüncesiz, umursamaz",
    partOfSpeech: "adj",
    definition: "Not giving enough attention.",
    exampleSentence: "A careless mistake cost him the game.",
    category: "basic-adjectives"
  },
  {
    term: "irresponsible",
    meaning: "düşüncesiz, umursamaz",
    partOfSpeech: "adj",
    definition: "Not showing a proper sense of duty.",
    exampleSentence: "It was irresponsible to leave the child alone.",
    category: "basic-adjectives"
  },
  {
    term: "confident",
    meaning: "emin, kendine güvenen, kesin",
    partOfSpeech: "adj",
    definition: "Feeling sure of oneself.",
    exampleSentence: "She is confident about the exam.",
    category: "basic-adjectives"
  },
  {
    term: "sure",
    meaning: "emin, kendine güvenen, kesin",
    partOfSpeech: "adj",
    definition: "Having no doubt.",
    exampleSentence: "I'm sure he will come.",
    category: "basic-adjectives"
  },
  {
    term: "certain",
    meaning: "emin, kendine güvenen, kesin",
    partOfSpeech: "adj",
    definition: "Completely sure; definite.",
    exampleSentence: "It is certain that prices will rise.",
    category: "basic-adjectives"
  },
  {
    term: "assured",
    meaning: "emin, kendine güvenen, kesin",
    partOfSpeech: "adj",
    definition: "Confident and self-certain.",
    exampleSentence: "He spoke in an assured voice.",
    category: "basic-adjectives"
  },
  {
    term: "rich",
    meaning: "zengin, varlıklı",
    partOfSpeech: "adj",
    definition: "Having a lot of money.",
    exampleSentence: "They are a rich family.",
    category: "basic-adjectives"
  },
  {
    term: "wealthy",
    meaning: "zengin, varlıklı",
    partOfSpeech: "adj",
    definition: "Having a great deal of money.",
    exampleSentence: "He is a wealthy businessman.",
    category: "basic-adjectives"
  },
  {
    term: "prosperous",
    meaning: "zengin, varlıklı",
    partOfSpeech: "adj",
    definition: "Successful and wealthy.",
    exampleSentence: "It is a prosperous city.",
    category: "basic-adjectives"
  },
  {
    term: "affluent",
    meaning: "zengin, varlıklı",
    partOfSpeech: "adj",
    definition: "Having plenty of money.",
    exampleSentence: "They live in an affluent neighbourhood.",
    category: "basic-adjectives"
  },
  {
    term: "thriving",
    meaning: "zengin, varlıklı",
    partOfSpeech: "adj",
    definition: "Growing and successful.",
    exampleSentence: "She runs a thriving business.",
    category: "basic-adjectives"
  },
  {
    term: "consistent",
    meaning: "tutarlı, kalıcı",
    partOfSpeech: "adj",
    definition: "Always behaving in the same way.",
    exampleSentence: "His work is of consistent quality.",
    category: "basic-adjectives"
  },
  {
    term: "stable",
    meaning: "tutarlı, kalıcı",
    partOfSpeech: "adj",
    definition: "Firmly fixed; not likely to change.",
    exampleSentence: "The patient is in a stable condition.",
    category: "basic-adjectives"
  },
  {
    term: "steady",
    meaning: "tutarlı, kalıcı",
    partOfSpeech: "adj",
    definition: "Regular and continuous.",
    exampleSentence: "He made steady progress.",
    category: "basic-adjectives"
  },
  {
    term: "persistent",
    meaning: "tutarlı, kalıcı",
    partOfSpeech: "adj",
    definition: "Continuing firmly despite difficulty.",
    exampleSentence: "She was persistent in her efforts.",
    category: "basic-adjectives"
  },
  {
    term: "changing",
    meaning: "değişen, dalgalanan, geçici",
    partOfSpeech: "adj",
    definition: "Becoming different over time.",
    exampleSentence: "We live in a fast-changing world.",
    category: "basic-adjectives"
  },
  {
    term: "fluctuating",
    meaning: "değişen, dalgalanan, geçici",
    partOfSpeech: "adj",
    definition: "Rising and falling irregularly.",
    exampleSentence: "Prices have been fluctuating.",
    category: "basic-adjectives"
  },
  {
    term: "temporary",
    meaning: "değişen, dalgalanan, geçici",
    partOfSpeech: "adj",
    definition: "Lasting for only a limited time.",
    exampleSentence: "This is a temporary solution.",
    category: "basic-adjectives"
  },
  {
    term: "momentary",
    meaning: "değişen, dalgalanan, geçici",
    partOfSpeech: "adj",
    definition: "Lasting for a very short time.",
    exampleSentence: "There was a momentary pause.",
    category: "basic-adjectives"
  },
  {
    term: "permanent",
    meaning: "kalıcı, uzun süreli",
    partOfSpeech: "adj",
    definition: "Lasting for a very long time.",
    exampleSentence: "She found a permanent job.",
    category: "basic-adjectives"
  },
  {
    term: "lasting",
    meaning: "kalıcı, uzun süreli",
    partOfSpeech: "adj",
    definition: "Continuing for a long time.",
    exampleSentence: "They made a lasting impression.",
    category: "basic-adjectives"
  },
  {
    term: "eternal",
    meaning: "kalıcı, uzun süreli",
    partOfSpeech: "adj",
    definition: "Lasting forever.",
    exampleSentence: "They spoke of eternal love.",
    category: "basic-adjectives"
  },
  {
    term: "constant",
    meaning: "kalıcı, uzun süreli",
    partOfSpeech: "adj",
    definition: "Happening all the time.",
    exampleSentence: "There was a constant noise.",
    category: "basic-adjectives"
  },
  {
    term: "gradual",
    meaning: "yavaş, kademeli",
    partOfSpeech: "adj",
    definition: "Happening slowly over time.",
    exampleSentence: "There was a gradual improvement.",
    category: "basic-adjectives"
  },
  {
    term: "slow",
    meaning: "yavaş, kademeli",
    partOfSpeech: "adj",
    definition: "Not moving or happening quickly.",
    exampleSentence: "Progress has been slow.",
    category: "basic-adjectives"
  },
  {
    term: "increasing",
    meaning: "artan, yükselen",
    partOfSpeech: "adj",
    definition: "Becoming greater in amount.",
    exampleSentence: "There is increasing demand for the product.",
    category: "basic-adjectives"
  },
  {
    term: "growing",
    meaning: "artan, yükselen",
    partOfSpeech: "adj",
    definition: "Getting bigger over time.",
    exampleSentence: "There is a growing interest in the topic.",
    category: "basic-adjectives"
  },
  {
    term: "soaring",
    meaning: "artan, yükselen",
    partOfSpeech: "adj",
    definition: "Rising very quickly.",
    exampleSentence: "Soaring prices worried the public.",
    category: "basic-adjectives"
  },
  {
    term: "mounting",
    meaning: "artan, yükselen",
    partOfSpeech: "adj",
    definition: "Gradually increasing.",
    exampleSentence: "There is mounting pressure on the government.",
    category: "basic-adjectives"
  },
  {
    term: "decreasing",
    meaning: "azalan, düşen",
    partOfSpeech: "adj",
    definition: "Becoming smaller in amount.",
    exampleSentence: "There is decreasing interest in the sport.",
    category: "basic-adjectives"
  },
  {
    term: "declining",
    meaning: "azalan, düşen",
    partOfSpeech: "adj",
    definition: "Becoming smaller or weaker.",
    exampleSentence: "Sales have been declining.",
    category: "basic-adjectives"
  },
  {
    term: "lessening",
    meaning: "azalan, düşen",
    partOfSpeech: "adj",
    definition: "Becoming less in amount.",
    exampleSentence: "The pain was lessening.",
    category: "basic-adjectives"
  },
  {
    term: "instant",
    meaning: "ani, beklenmedik",
    partOfSpeech: "adj",
    definition: "Happening immediately.",
    exampleSentence: "The drug gave instant relief.",
    category: "basic-adjectives"
  },
  {
    term: "sudden",
    meaning: "ani, beklenmedik",
    partOfSpeech: "adj",
    definition: "Happening quickly and unexpectedly.",
    exampleSentence: "There was a sudden change in the weather.",
    category: "basic-adjectives"
  },
  {
    term: "immediate",
    meaning: "ani, beklenmedik",
    partOfSpeech: "adj",
    definition: "Happening at once.",
    exampleSentence: "We need an immediate response.",
    category: "basic-adjectives"
  },
  {
    term: "abrupt",
    meaning: "ani, beklenmedik",
    partOfSpeech: "adj",
    definition: "Sudden and unexpected.",
    exampleSentence: "The car came to an abrupt stop.",
    category: "basic-adjectives"
  },
  {
    term: "swift",
    meaning: "dakik, hızlı, tez",
    partOfSpeech: "adj",
    definition: "Happening or moving quickly.",
    exampleSentence: "She gave a swift reply.",
    category: "basic-adjectives"
  },
  {
    term: "prompt",
    meaning: "dakik, hızlı, tez",
    partOfSpeech: "adj",
    definition: "Done without delay.",
    exampleSentence: "Thank you for your prompt response.",
    category: "basic-adjectives"
  },
  {
    term: "quick",
    meaning: "dakik, hızlı, tez",
    partOfSpeech: "adj",
    definition: "Moving or happening fast.",
    exampleSentence: "He gave a quick answer.",
    category: "basic-adjectives"
  },
  {
    term: "rapid",
    meaning: "dakik, hızlı, tez",
    partOfSpeech: "adj",
    definition: "Very fast.",
    exampleSentence: "There has been rapid growth in the industry.",
    category: "basic-adjectives"
  },
  {
    term: "similar",
    meaning: "benzer, alakalı",
    partOfSpeech: "adj",
    definition: "Almost the same but not identical.",
    exampleSentence: "The two cars are similar in design.",
    category: "basic-adjectives"
  },
  {
    term: "resembling",
    meaning: "benzer, alakalı",
    partOfSpeech: "adj",
    definition: "Looking like something else.",
    exampleSentence: "A fruit resembling an apple.",
    category: "basic-adjectives"
  },
  {
    term: "relevant",
    meaning: "benzer, alakalı",
    partOfSpeech: "adj",
    definition: "Connected with the matter at hand.",
    exampleSentence: "Please give relevant examples.",
    category: "basic-adjectives"
  },
  {
    term: "identical",
    meaning: "aynı",
    partOfSpeech: "adj",
    definition: "Exactly the same.",
    exampleSentence: "The twins are identical.",
    category: "basic-adjectives"
  },
  {
    term: "uniform",
    meaning: "aynı",
    partOfSpeech: "adj",
    definition: "The same in all cases and times.",
    exampleSentence: "The rooms are of uniform size.",
    category: "basic-adjectives"
  },
  {
    term: "equal",
    meaning: "eşit, denk",
    partOfSpeech: "adj",
    definition: "The same in amount or value.",
    exampleSentence: "Both sides received an equal share.",
    category: "basic-adjectives"
  },
  {
    term: "even",
    meaning: "eşit, denk",
    partOfSpeech: "adj",
    definition: "Level, equal or balanced.",
    exampleSentence: "The scores are now even.",
    category: "basic-adjectives"
  },
  {
    term: "varied",
    meaning: "çeşitli",
    partOfSpeech: "adj",
    definition: "Consisting of different types.",
    exampleSentence: "She has a varied diet.",
    category: "basic-adjectives"
  },
  {
    term: "various",
    meaning: "çeşitli",
    partOfSpeech: "adj",
    definition: "Several different.",
    exampleSentence: "We discussed various options.",
    category: "basic-adjectives"
  },
  {
    term: "opposing",
    meaning: "zıt, karşıt, muhalif",
    partOfSpeech: "adj",
    definition: "On the other side; conflicting.",
    exampleSentence: "The two teams have opposing styles.",
    category: "basic-adjectives"
  },
  {
    term: "contrary",
    meaning: "zıt, karşıt, muhalif",
    partOfSpeech: "adj",
    definition: "Opposite in nature or direction.",
    exampleSentence: "His view is contrary to mine.",
    category: "basic-adjectives"
  },
  {
    term: "incompatible",
    meaning: "uyumsuz, uyuşmaz",
    partOfSpeech: "adj",
    definition: "Unable to exist together.",
    exampleSentence: "The two systems are incompatible.",
    category: "basic-adjectives"
  },
  {
    term: "alien",
    meaning: "uyumsuz, uyuşmaz",
    partOfSpeech: "adj",
    definition: "Foreign; unfamiliar and strange.",
    exampleSentence: "The custom was alien to her.",
    category: "basic-adjectives"
  },
  {
    term: "foreign",
    meaning: "uyumsuz, uyuşmaz",
    partOfSpeech: "adj",
    definition: "Coming from another country.",
    exampleSentence: "He speaks several foreign languages.",
    category: "basic-adjectives"
  },
  {
    term: "adverse",
    meaning: "kötü, olumsuz",
    partOfSpeech: "adj",
    definition: "Harmful or unfavourable.",
    exampleSentence: "The drug has adverse effects.",
    category: "basic-adjectives"
  },
  {
    term: "unfavourable",
    meaning: "kötü, olumsuz",
    partOfSpeech: "adj",
    definition: "Not helpful; negative.",
    exampleSentence: "They received unfavourable reviews.",
    category: "basic-adjectives"
  },
  {
    term: "terrible",
    meaning: "kötü, olumsuz",
    partOfSpeech: "adj",
    definition: "Very bad or unpleasant.",
    exampleSentence: "We had a terrible experience.",
    category: "basic-adjectives"
  },
  {
    term: "awful",
    meaning: "kötü, olumsuz",
    partOfSpeech: "adj",
    definition: "Very bad or unpleasant.",
    exampleSentence: "The weather was awful.",
    category: "basic-adjectives"
  },
  {
    term: "barren",
    meaning: "verimsiz, kısır",
    partOfSpeech: "adj",
    definition: "Unable to produce plants or crops.",
    exampleSentence: "The land was dry and barren.",
    category: "basic-adjectives"
  },
  {
    term: "infertile",
    meaning: "verimsiz, kısır",
    partOfSpeech: "adj",
    definition: "Not able to produce offspring or crops.",
    exampleSentence: "The soil here is infertile.",
    category: "basic-adjectives"
  },
  {
    term: "arid",
    meaning: "verimsiz, kısır",
    partOfSpeech: "adj",
    definition: "Very dry with little rain.",
    exampleSentence: "They crossed the arid desert.",
    category: "basic-adjectives"
  },
  {
    term: "fruitless",
    meaning: "verimsiz, kısır",
    partOfSpeech: "adj",
    definition: "Producing no useful result.",
    exampleSentence: "The search was fruitless.",
    category: "basic-adjectives"
  },
  {
    term: "bitter",
    meaning: "acı, sert",
    partOfSpeech: "adj",
    definition: "Having a sharp, unpleasant taste.",
    exampleSentence: "The coffee tasted bitter.",
    category: "basic-adjectives"
  },
  {
    term: "harsh",
    meaning: "acı, sert",
    partOfSpeech: "adj",
    definition: "Unpleasantly rough or severe.",
    exampleSentence: "He faced harsh criticism.",
    category: "basic-adjectives"
  },
  {
    term: "severe",
    meaning: "acı, sert",
    partOfSpeech: "adj",
    definition: "Very great; intense or strict.",
    exampleSentence: "The region had severe weather.",
    category: "basic-adjectives"
  },
  {
    term: "confusing",
    meaning: "karmaşık, kafa karıştırıcı",
    partOfSpeech: "adj",
    definition: "Difficult to understand.",
    exampleSentence: "The instructions were confusing.",
    category: "basic-adjectives"
  },
  {
    term: "puzzling",
    meaning: "karmaşık, kafa karıştırıcı",
    partOfSpeech: "adj",
    definition: "Difficult to understand or explain.",
    exampleSentence: "It was a puzzling situation.",
    category: "basic-adjectives"
  },
  {
    term: "perplexing",
    meaning: "karmaşık, kafa karıştırıcı",
    partOfSpeech: "adj",
    definition: "Confusing and worrying.",
    exampleSentence: "The results were perplexing.",
    category: "basic-adjectives"
  },
  {
    term: "controversial",
    meaning: "tartışmalı",
    partOfSpeech: "adj",
    definition: "Causing much disagreement.",
    exampleSentence: "It is a controversial topic.",
    category: "basic-adjectives"
  },
  {
    term: "contradictory",
    meaning: "tartışmalı",
    partOfSpeech: "adj",
    definition: "Containing opposite statements.",
    exampleSentence: "The reports were contradictory.",
    category: "basic-adjectives"
  },
  {
    term: "cruel",
    meaning: "zalim, acımasız",
    partOfSpeech: "adj",
    definition: "Causing pain without pity.",
    exampleSentence: "It was a cruel joke.",
    category: "basic-adjectives"
  },
  {
    term: "brutal",
    meaning: "zalim, acımasız",
    partOfSpeech: "adj",
    definition: "Very violent and harsh.",
    exampleSentence: "The attack was brutal.",
    category: "basic-adjectives"
  },
  {
    term: "evil",
    meaning: "zalim, acımasız",
    partOfSpeech: "adj",
    definition: "Morally very bad; wicked.",
    exampleSentence: "He was an evil dictator.",
    category: "basic-adjectives"
  },
  {
    term: "corrupt",
    meaning: "yozlaşmış, ahlak dışı",
    partOfSpeech: "adj",
    definition: "Dishonest for personal gain.",
    exampleSentence: "The official was corrupt.",
    category: "basic-adjectives"
  },
  {
    term: "immoral",
    meaning: "yozlaşmış, ahlak dışı",
    partOfSpeech: "adj",
    definition: "Not following moral standards.",
    exampleSentence: "It was an immoral act.",
    category: "basic-adjectives"
  },
  {
    term: "dishonest",
    meaning: "yozlaşmış, ahlak dışı",
    partOfSpeech: "adj",
    definition: "Not honest; deceitful.",
    exampleSentence: "He was dishonest about the money.",
    category: "basic-adjectives"
  },
  {
    term: "misleading",
    meaning: "yozlaşmış, ahlak dışı",
    partOfSpeech: "adj",
    definition: "Giving the wrong idea or impression.",
    exampleSentence: "The advert was misleading.",
    category: "basic-adjectives"
  },
  {
    term: "counterfeit",
    meaning: "sahte, korsan",
    partOfSpeech: "adj",
    definition: "Made to look real in order to deceive.",
    exampleSentence: "They sold counterfeit watches.",
    category: "basic-adjectives"
  },
  {
    term: "forged",
    meaning: "sahte, korsan",
    partOfSpeech: "adj",
    definition: "Illegally copied to deceive.",
    exampleSentence: "He used a forged passport.",
    category: "basic-adjectives"
  },
  {
    term: "false",
    meaning: "sahte, korsan",
    partOfSpeech: "adj",
    definition: "Not true or genuine.",
    exampleSentence: "She gave a false name.",
    category: "basic-adjectives"
  },
  {
    term: "inhospitable",
    meaning: "yaşamaya elverişsiz",
    partOfSpeech: "adj",
    definition: "Not suitable for living in; unwelcoming.",
    exampleSentence: "The mountain was cold and inhospitable.",
    category: "basic-adjectives"
  },
  {
    term: "uninhabitable",
    meaning: "yaşamaya elverişsiz",
    partOfSpeech: "adj",
    definition: "Not fit to be lived in.",
    exampleSentence: "The house was uninhabitable after the flood.",
    category: "basic-adjectives"
  },
  {
    term: "disappointing",
    meaning: "kızdıran, üzen",
    partOfSpeech: "adj",
    definition: "Failing to meet hopes or expectations.",
    exampleSentence: "The film was disappointing.",
    category: "basic-adjectives"
  },
  {
    term: "frustrating",
    meaning: "kızdıran, üzen",
    partOfSpeech: "adj",
    definition: "Causing annoyance at being unable to act.",
    exampleSentence: "Traffic jams are frustrating.",
    category: "basic-adjectives"
  },
  {
    term: "annoying",
    meaning: "kızdıran, üzen",
    partOfSpeech: "adj",
    definition: "Causing slight anger or irritation.",
    exampleSentence: "The dripping tap was annoying.",
    category: "basic-adjectives"
  },
  {
    term: "upsetting",
    meaning: "kızdıran, üzen",
    partOfSpeech: "adj",
    definition: "Making someone feel unhappy or worried.",
    exampleSentence: "The news was very upsetting.",
    category: "basic-adjectives"
  },
  {
    term: "futile",
    meaning: "beyhude, faydasız, demode",
    partOfSpeech: "adj",
    definition: "Producing no useful result; pointless.",
    exampleSentence: "It was a futile attempt.",
    category: "basic-adjectives"
  },
  {
    term: "pointless",
    meaning: "beyhude, faydasız, demode",
    partOfSpeech: "adj",
    definition: "Having no purpose or use.",
    exampleSentence: "Arguing with him is pointless.",
    category: "basic-adjectives"
  },
  {
    term: "useless",
    meaning: "beyhude, faydasız, demode",
    partOfSpeech: "adj",
    definition: "Not useful; serving no purpose.",
    exampleSentence: "This old phone is now useless.",
    category: "basic-adjectives"
  },
  {
    term: "obsolete",
    meaning: "beyhude, faydasız, demode",
    partOfSpeech: "adj",
    definition: "No longer used; out of date.",
    exampleSentence: "The technology is now obsolete.",
    category: "basic-adjectives"
  },
  {
    term: "antagonistic",
    meaning: "düşmanca, saldırgan",
    partOfSpeech: "adj",
    definition: "Showing active opposition or hostility.",
    exampleSentence: "He was antagonistic towards his rivals.",
    category: "basic-adjectives"
  },
  {
    term: "hostile",
    meaning: "düşmanca, saldırgan",
    partOfSpeech: "adj",
    definition: "Unfriendly and aggressive.",
    exampleSentence: "The crowd was hostile.",
    category: "basic-adjectives"
  },
  {
    term: "disgusting",
    meaning: "iğrenç, ürkütücü",
    partOfSpeech: "adj",
    definition: "Extremely unpleasant; sickening.",
    exampleSentence: "The smell was disgusting.",
    category: "basic-adjectives"
  },
  {
    term: "nasty",
    meaning: "iğrenç, ürkütücü",
    partOfSpeech: "adj",
    definition: "Very unpleasant or unkind.",
    exampleSentence: "She made a nasty comment.",
    category: "basic-adjectives"
  },
  {
    term: "frightening",
    meaning: "iğrenç, ürkütücü",
    partOfSpeech: "adj",
    definition: "Making someone afraid.",
    exampleSentence: "It was a frightening experience.",
    category: "basic-adjectives"
  },
  {
    term: "horrifying",
    meaning: "iğrenç, ürkütücü",
    partOfSpeech: "adj",
    definition: "Causing horror; shocking.",
    exampleSentence: "The accident was horrifying.",
    category: "basic-adjectives"
  },
  {
    term: "malfunctioning",
    meaning: "bozuk, çalışmayan",
    partOfSpeech: "adj",
    definition: "Not working correctly.",
    exampleSentence: "The malfunctioning printer wasted paper.",
    category: "basic-adjectives"
  },
  {
    term: "broken",
    meaning: "bozuk, çalışmayan",
    partOfSpeech: "adj",
    definition: "Not working; damaged.",
    exampleSentence: "The clock is broken.",
    category: "basic-adjectives"
  },
  {
    term: "out of order",
    meaning: "bozuk, çalışmayan",
    partOfSpeech: "adj",
    definition: "Not working (of a machine).",
    exampleSentence: "The lift is out of order.",
    category: "basic-adjectives"
  },
  {
    term: "malignant",
    meaning: "kötü huylu, fena",
    partOfSpeech: "adj",
    definition: "Very harmful; (of disease) likely to spread.",
    exampleSentence: "The tumour was malignant.",
    category: "basic-adjectives"
  },
  {
    term: "wicked",
    meaning: "kötü huylu, fena",
    partOfSpeech: "adj",
    definition: "Morally very bad; evil.",
    exampleSentence: "It was a wicked plan.",
    category: "basic-adjectives"
  },
  {
    term: "bad",
    meaning: "kötü huylu, fena",
    partOfSpeech: "adj",
    definition: "Of poor quality or unpleasant.",
    exampleSentence: "He has a bad temper.",
    category: "basic-adjectives"
  },
  {
    term: "benign",
    meaning: "iyi, zararsız",
    partOfSpeech: "adj",
    definition: "Kind and gentle; not harmful.",
    exampleSentence: "The tumour was benign.",
    category: "basic-adjectives"
  },
  {
    term: "gentle",
    meaning: "iyi, zararsız",
    partOfSpeech: "adj",
    definition: "Kind, calm and mild.",
    exampleSentence: "She has a gentle nature.",
    category: "basic-adjectives"
  },
  {
    term: "harmless",
    meaning: "iyi, zararsız",
    partOfSpeech: "adj",
    definition: "Not able to cause harm.",
    exampleSentence: "The spider is harmless.",
    category: "basic-adjectives"
  },
  {
    term: "abusive",
    meaning: "kötüye kullanan, aşağılayan",
    partOfSpeech: "adj",
    definition: "Using cruel or insulting words or acts.",
    exampleSentence: "He used abusive language.",
    category: "basic-adjectives"
  },
  {
    term: "insulting",
    meaning: "kötüye kullanan, aşağılayan",
    partOfSpeech: "adj",
    definition: "Rude and offensive.",
    exampleSentence: "The remark was insulting.",
    category: "basic-adjectives"
  },
  {
    term: "humiliating",
    meaning: "kötüye kullanan, aşağılayan",
    partOfSpeech: "adj",
    definition: "Making someone feel ashamed.",
    exampleSentence: "It was a humiliating defeat.",
    category: "basic-adjectives"
  },
  {
    term: "embarrassing",
    meaning: "kötüye kullanan, aşağılayan",
    partOfSpeech: "adj",
    definition: "Causing shame or awkwardness.",
    exampleSentence: "It was an embarrassing mistake.",
    category: "basic-adjectives"
  },
  {
    term: "shameful",
    meaning: "kötüye kullanan, aşağılayan",
    partOfSpeech: "adj",
    definition: "Deserving shame or disgrace.",
    exampleSentence: "It was a shameful act.",
    category: "basic-adjectives"
  },
  {
    term: "unethical",
    meaning: "etik olmayan, ahlak dışı",
    partOfSpeech: "adj",
    definition: "Not morally correct.",
    exampleSentence: "It was unethical behaviour.",
    category: "basic-adjectives"
  },
  {
    term: "immoral",
    meaning: "etik olmayan, ahlak dışı",
    partOfSpeech: "adj",
    definition: "Not following moral standards.",
    exampleSentence: "Cheating is immoral.",
    category: "basic-adjectives"
  },
  {
    term: "detrimental",
    meaning: "zararlı, tehlikeli",
    partOfSpeech: "adj",
    definition: "Causing harm or damage.",
    exampleSentence: "Smoking is detrimental to health.",
    category: "basic-adjectives"
  },
  {
    term: "harmful",
    meaning: "zararlı, tehlikeli",
    partOfSpeech: "adj",
    definition: "Causing harm.",
    exampleSentence: "Too much sun is harmful.",
    category: "basic-adjectives"
  },
  {
    term: "hazardous",
    meaning: "zararlı, tehlikeli",
    partOfSpeech: "adj",
    definition: "Dangerous; risky.",
    exampleSentence: "It is a hazardous job.",
    category: "basic-adjectives"
  },
  {
    term: "dangerous",
    meaning: "zararlı, tehlikeli",
    partOfSpeech: "adj",
    definition: "Likely to cause harm.",
    exampleSentence: "It is a dangerous road.",
    category: "basic-adjectives"
  },
  {
    term: "lethal",
    meaning: "zararlı, tehlikeli",
    partOfSpeech: "adj",
    definition: "Able to cause death.",
    exampleSentence: "The snake's bite is lethal.",
    category: "basic-adjectives"
  },
  {
    term: "conscious",
    meaning: "bilinçli, farkında",
    partOfSpeech: "adj",
    definition: "Aware of and noticing things.",
    exampleSentence: "She was conscious of the risk.",
    category: "basic-adjectives"
  },
  {
    term: "aware",
    meaning: "bilinçli, farkında",
    partOfSpeech: "adj",
    definition: "Knowing that something exists.",
    exampleSentence: "He is aware of the problem.",
    category: "basic-adjectives"
  },
  {
    term: "beneficial",
    meaning: "faydalı, yararlı",
    partOfSpeech: "adj",
    definition: "Having a good or helpful effect.",
    exampleSentence: "Exercise is beneficial to health.",
    category: "basic-adjectives"
  },
  {
    term: "helpful",
    meaning: "faydalı, yararlı",
    partOfSpeech: "adj",
    definition: "Giving useful help.",
    exampleSentence: "The staff were very helpful.",
    category: "basic-adjectives"
  },
  {
    term: "useful",
    meaning: "faydalı, yararlı",
    partOfSpeech: "adj",
    definition: "Able to be used for a good purpose.",
    exampleSentence: "This is a useful tool.",
    category: "basic-adjectives"
  },
  {
    term: "fascinating",
    meaning: "muhteşem, görülmeye değer",
    partOfSpeech: "adj",
    definition: "Extremely interesting.",
    exampleSentence: "The museum was fascinating.",
    category: "basic-adjectives"
  },
  {
    term: "picturesque",
    meaning: "muhteşem, görülmeye değer",
    partOfSpeech: "adj",
    definition: "Very pretty or charming (of a place).",
    exampleSentence: "They visited a picturesque village.",
    category: "basic-adjectives"
  },
  {
    term: "magnificent",
    meaning: "muhteşem, görülmeye değer",
    partOfSpeech: "adj",
    definition: "Extremely beautiful or impressive.",
    exampleSentence: "The view was magnificent.",
    category: "basic-adjectives"
  },
  {
    term: "fertile",
    meaning: "verimli, doğurgan",
    partOfSpeech: "adj",
    definition: "Able to produce many plants or offspring.",
    exampleSentence: "The land is very fertile.",
    category: "basic-adjectives"
  },
  {
    term: "productive",
    meaning: "verimli, doğurgan",
    partOfSpeech: "adj",
    definition: "Producing a lot; efficient.",
    exampleSentence: "It was a productive meeting.",
    category: "basic-adjectives"
  },
  {
    term: "fruitful",
    meaning: "verimli, doğurgan",
    partOfSpeech: "adj",
    definition: "Producing good results.",
    exampleSentence: "We had a fruitful discussion.",
    category: "basic-adjectives"
  },
  {
    term: "prolific",
    meaning: "verimli, doğurgan",
    partOfSpeech: "adj",
    definition: "Producing much; highly productive.",
    exampleSentence: "She is a prolific writer.",
    category: "basic-adjectives"
  },
  {
    term: "graceful",
    meaning: "zarif, çekici",
    partOfSpeech: "adj",
    definition: "Moving in a smooth, attractive way.",
    exampleSentence: "She is a graceful dancer.",
    category: "basic-adjectives"
  },
  {
    term: "alluring",
    meaning: "zarif, çekici",
    partOfSpeech: "adj",
    definition: "Very attractive or tempting.",
    exampleSentence: "The offer was alluring.",
    category: "basic-adjectives"
  },
  {
    term: "appealing",
    meaning: "zarif, çekici",
    partOfSpeech: "adj",
    definition: "Attractive or interesting.",
    exampleSentence: "It is an appealing idea.",
    category: "basic-adjectives"
  },
  {
    term: "charming",
    meaning: "zarif, çekici",
    partOfSpeech: "adj",
    definition: "Very pleasant and attractive.",
    exampleSentence: "He has a charming smile.",
    category: "basic-adjectives"
  },
  {
    term: "impressive",
    meaning: "etkileyici, heyecan verici",
    partOfSpeech: "adj",
    definition: "Making a strong good impression.",
    exampleSentence: "It was an impressive performance.",
    category: "basic-adjectives"
  },
  {
    term: "striking",
    meaning: "etkileyici, heyecan verici",
    partOfSpeech: "adj",
    definition: "Very noticeable or attractive.",
    exampleSentence: "There is a striking difference between them.",
    category: "basic-adjectives"
  },
  {
    term: "thrilling",
    meaning: "etkileyici, heyecan verici",
    partOfSpeech: "adj",
    definition: "Causing great excitement.",
    exampleSentence: "It was a thrilling adventure.",
    category: "basic-adjectives"
  },
  {
    term: "exciting",
    meaning: "etkileyici, heyecan verici",
    partOfSpeech: "adj",
    definition: "Causing strong interest or excitement.",
    exampleSentence: "We saw an exciting match.",
    category: "basic-adjectives"
  },
  {
    term: "remarkable",
    meaning: "kayda değer",
    partOfSpeech: "adj",
    definition: "Worthy of attention; unusual.",
    exampleSentence: "She made a remarkable recovery.",
    category: "basic-adjectives"
  },
  {
    term: "noteworthy",
    meaning: "kayda değer",
    partOfSpeech: "adj",
    definition: "Deserving to be noticed.",
    exampleSentence: "The report contains noteworthy findings.",
    category: "basic-adjectives"
  },
  {
    term: "considerable",
    meaning: "kayda değer",
    partOfSpeech: "adj",
    definition: "Large in amount or degree.",
    exampleSentence: "He has considerable experience.",
    category: "basic-adjectives"
  },
  {
    term: "ingenious",
    meaning: "zeki, dahi, akıllıca",
    partOfSpeech: "adj",
    definition: "Clever and original.",
    exampleSentence: "It was an ingenious solution.",
    category: "basic-adjectives"
  },
  {
    term: "clever",
    meaning: "zeki, dahi, akıllıca",
    partOfSpeech: "adj",
    definition: "Quick to learn and understand.",
    exampleSentence: "She is a clever student.",
    category: "basic-adjectives"
  },
  {
    term: "brilliant",
    meaning: "zeki, dahi, akıllıca",
    partOfSpeech: "adj",
    definition: "Extremely clever or impressive.",
    exampleSentence: "He had a brilliant idea.",
    category: "basic-adjectives"
  },
  {
    term: "intelligent",
    meaning: "zeki, dahi, akıllıca",
    partOfSpeech: "adj",
    definition: "Having good understanding; smart.",
    exampleSentence: "Dolphins are intelligent animals.",
    category: "basic-adjectives"
  },
  {
    term: "innocent",
    meaning: "masum",
    partOfSpeech: "adj",
    definition: "Not guilty of a crime; harmless.",
    exampleSentence: "The court found him innocent.",
    category: "basic-adjectives"
  },
  {
    term: "blameless",
    meaning: "masum",
    partOfSpeech: "adj",
    definition: "Free from guilt; not to blame.",
    exampleSentence: "She led a blameless life.",
    category: "basic-adjectives"
  },
  {
    term: "promising",
    meaning: "umut vaat eden, yetenekli",
    partOfSpeech: "adj",
    definition: "Showing signs of future success.",
    exampleSentence: "He is a promising young player.",
    category: "basic-adjectives"
  },
  {
    term: "gifted",
    meaning: "umut vaat eden, yetenekli",
    partOfSpeech: "adj",
    definition: "Having great natural ability.",
    exampleSentence: "She is a gifted musician.",
    category: "basic-adjectives"
  },
  {
    term: "talented",
    meaning: "umut vaat eden, yetenekli",
    partOfSpeech: "adj",
    definition: "Having a natural skill or ability.",
    exampleSentence: "He is a talented artist.",
    category: "basic-adjectives"
  },
  {
    term: "acceptable",
    meaning: "kabul edilebilir, makul",
    partOfSpeech: "adj",
    definition: "Good enough to be accepted.",
    exampleSentence: "The quality was acceptable.",
    category: "basic-adjectives"
  },
  {
    term: "plausible",
    meaning: "kabul edilebilir, makul",
    partOfSpeech: "adj",
    definition: "Seeming reasonable or probable.",
    exampleSentence: "It is a plausible explanation.",
    category: "basic-adjectives"
  },
  {
    term: "reasonable",
    meaning: "kabul edilebilir, makul",
    partOfSpeech: "adj",
    definition: "Fair and sensible.",
    exampleSentence: "That's a reasonable request.",
    category: "basic-adjectives"
  },
  {
    term: "logical",
    meaning: "kabul edilebilir, makul",
    partOfSpeech: "adj",
    definition: "Based on clear reasoning.",
    exampleSentence: "It is a logical conclusion.",
    category: "basic-adjectives"
  },
  {
    term: "sound",
    meaning: "kabul edilebilir, makul",
    partOfSpeech: "adj",
    definition: "Based on good reasoning; reliable.",
    exampleSentence: "She gave sound advice.",
    category: "basic-adjectives"
  },
  {
    term: "pure",
    meaning: "saf, temiz",
    partOfSpeech: "adj",
    definition: "Not mixed with anything else.",
    exampleSentence: "This is pure gold.",
    category: "basic-adjectives"
  },
  {
    term: "clean",
    meaning: "saf, temiz",
    partOfSpeech: "adj",
    definition: "Free from dirt.",
    exampleSentence: "Keep the kitchen clean.",
    category: "basic-adjectives"
  },
  {
    term: "sanitary",
    meaning: "saf, temiz",
    partOfSpeech: "adj",
    definition: "Clean and free from danger to health.",
    exampleSentence: "The sanitary conditions were poor.",
    category: "basic-adjectives"
  },
  {
    term: "hygienic",
    meaning: "saf, temiz",
    partOfSpeech: "adj",
    definition: "Clean and helping to prevent disease.",
    exampleSentence: "Food must be prepared in hygienic conditions.",
    category: "basic-adjectives"
  },
  {
    term: "humble",
    meaning: "mütevazi, doğrudan",
    partOfSpeech: "adj",
    definition: "Modest; not proud.",
    exampleSentence: "He remained humble despite his success.",
    category: "basic-adjectives"
  },
  {
    term: "modest",
    meaning: "mütevazi, doğrudan",
    partOfSpeech: "adj",
    definition: "Not boastful; moderate.",
    exampleSentence: "She is modest about her talents.",
    category: "basic-adjectives"
  },
  {
    term: "straightforward",
    meaning: "mütevazi, doğrudan",
    partOfSpeech: "adj",
    definition: "Simple, honest and direct.",
    exampleSentence: "He gave a straightforward answer.",
    category: "basic-adjectives"
  },
  {
    term: "settled",
    meaning: "yerleşik, hareketsiz",
    partOfSpeech: "adj",
    definition: "Fixed and permanent.",
    exampleSentence: "They now lead a settled life.",
    category: "basic-adjectives"
  },
  {
    term: "sedentary",
    meaning: "yerleşik, hareketsiz",
    partOfSpeech: "adj",
    definition: "Involving much sitting; not active.",
    exampleSentence: "A sedentary lifestyle can be unhealthy.",
    category: "basic-adjectives"
  },
  {
    term: "inactive",
    meaning: "yerleşik, hareketsiz",
    partOfSpeech: "adj",
    definition: "Not doing anything; not active.",
    exampleSentence: "The volcano is now inactive.",
    category: "basic-adjectives"
  },
  {
    term: "linked",
    meaning: "bağlantılı",
    partOfSpeech: "adj",
    definition: "Connected to something else.",
    exampleSentence: "The two events are linked.",
    category: "basic-adjectives"
  },
  {
    term: "related",
    meaning: "bağlantılı",
    partOfSpeech: "adj",
    definition: "Connected in some way.",
    exampleSentence: "The two problems are related.",
    category: "basic-adjectives"
  },
  {
    term: "associated",
    meaning: "bağlantılı",
    partOfSpeech: "adj",
    definition: "Connected with something in the mind.",
    exampleSentence: "Stress is associated with heart disease.",
    category: "basic-adjectives"
  },
  {
    term: "existing",
    meaning: "mevcut, bulunan",
    partOfSpeech: "adj",
    definition: "That exists now.",
    exampleSentence: "We must improve the existing system.",
    category: "basic-adjectives"
  },
  {
    term: "vacant",
    meaning: "mevcut, bulunan",
    partOfSpeech: "adj",
    definition: "Empty; not occupied.",
    exampleSentence: "The seat next to me was vacant.",
    category: "basic-adjectives"
  },
  {
    term: "accessible",
    meaning: "mevcut, bulunan",
    partOfSpeech: "adj",
    definition: "Able to be reached or obtained.",
    exampleSentence: "The building is accessible to all.",
    category: "basic-adjectives"
  },
  {
    term: "lacking",
    meaning: "eksik, noksan",
    partOfSpeech: "adj",
    definition: "Not having enough of something.",
    exampleSentence: "The plan is lacking in detail.",
    category: "basic-adjectives"
  },
  {
    term: "missing",
    meaning: "eksik, noksan",
    partOfSpeech: "adj",
    definition: "Not present; absent.",
    exampleSentence: "A page is missing from the book.",
    category: "basic-adjectives"
  },
  {
    term: "absent",
    meaning: "eksik, noksan",
    partOfSpeech: "adj",
    definition: "Not present in a place.",
    exampleSentence: "Several students were absent.",
    category: "basic-adjectives"
  },
  {
    term: "ambiguous",
    meaning: "belirsiz, açık olmayan",
    partOfSpeech: "adj",
    definition: "Having more than one possible meaning.",
    exampleSentence: "The instructions were ambiguous.",
    category: "basic-adjectives"
  },
  {
    term: "vague",
    meaning: "belirsiz, açık olmayan",
    partOfSpeech: "adj",
    definition: "Not clear or exact.",
    exampleSentence: "He gave a vague answer.",
    category: "basic-adjectives"
  },
  {
    term: "unclear",
    meaning: "belirsiz, açık olmayan",
    partOfSpeech: "adj",
    definition: "Not easy to understand or see.",
    exampleSentence: "The rules are unclear.",
    category: "basic-adjectives"
  },
  {
    term: "obscure",
    meaning: "belirsiz, açık olmayan",
    partOfSpeech: "adj",
    definition: "Not well known or hard to understand.",
    exampleSentence: "The reference is rather obscure.",
    category: "basic-adjectives"
  },
  {
    term: "durable",
    meaning: "dirençli, dayanıklı",
    partOfSpeech: "adj",
    definition: "Able to last a long time.",
    exampleSentence: "These boots are durable.",
    category: "basic-adjectives"
  },
  {
    term: "enduring",
    meaning: "dirençli, dayanıklı",
    partOfSpeech: "adj",
    definition: "Lasting over a long period.",
    exampleSentence: "They formed an enduring friendship.",
    category: "basic-adjectives"
  },
  {
    term: "robust",
    meaning: "dirençli, dayanıklı",
    partOfSpeech: "adj",
    definition: "Strong and unlikely to break.",
    exampleSentence: "It is a robust design.",
    category: "basic-adjectives"
  },
  {
    term: "delicate",
    meaning: "hassas, zayıf",
    partOfSpeech: "adj",
    definition: "Easily damaged; needing care.",
    exampleSentence: "The vase is very delicate.",
    category: "basic-adjectives"
  },
  {
    term: "fragile",
    meaning: "hassas, zayıf",
    partOfSpeech: "adj",
    definition: "Easily broken or damaged.",
    exampleSentence: "Handle the fragile glass carefully.",
    category: "basic-adjectives"
  },
  {
    term: "weak",
    meaning: "hassas, zayıf",
    partOfSpeech: "adj",
    definition: "Not strong physically or in effect.",
    exampleSentence: "He felt weak after the illness.",
    category: "basic-adjectives"
  },
  {
    term: "solid",
    meaning: "katı, sıkı",
    partOfSpeech: "adj",
    definition: "Hard and firm; not liquid or gas.",
    exampleSentence: "The lake was frozen solid.",
    category: "basic-adjectives"
  },
  {
    term: "firm",
    meaning: "katı, sıkı",
    partOfSpeech: "adj",
    definition: "Solid and not easily moved.",
    exampleSentence: "Press the button with a firm touch.",
    category: "basic-adjectives"
  },
  {
    term: "rigid",
    meaning: "katı, sıkı",
    partOfSpeech: "adj",
    definition: "Stiff and not able to bend.",
    exampleSentence: "The frame is rigid.",
    category: "basic-adjectives"
  },
  {
    term: "genuine",
    meaning: "gerçek, orjinal",
    partOfSpeech: "adj",
    definition: "Real and exactly what it seems.",
    exampleSentence: "This is a genuine diamond.",
    category: "basic-adjectives"
  },
  {
    term: "authentic",
    meaning: "gerçek, orjinal",
    partOfSpeech: "adj",
    definition: "Real and not a copy.",
    exampleSentence: "They served authentic Italian food.",
    category: "basic-adjectives"
  },
  {
    term: "original",
    meaning: "gerçek, orjinal",
    partOfSpeech: "adj",
    definition: "Existing first; not a copy.",
    exampleSentence: "This is the original document.",
    category: "basic-adjectives"
  },
  {
    term: "incredible",
    meaning: "inanılmaz",
    partOfSpeech: "adj",
    definition: "Difficult to believe; amazing.",
    exampleSentence: "She has an incredible memory.",
    category: "basic-adjectives"
  },
  {
    term: "unbelievable",
    meaning: "inanılmaz",
    partOfSpeech: "adj",
    definition: "So surprising it is hard to believe.",
    exampleSentence: "The result was unbelievable.",
    category: "basic-adjectives"
  },
  {
    term: "susceptible",
    meaning: "savunmasız, yatkın",
    partOfSpeech: "adj",
    definition: "Easily affected or harmed by something.",
    exampleSentence: "He is susceptible to colds.",
    category: "basic-adjectives"
  },
  {
    term: "prone",
    meaning: "savunmasız, yatkın",
    partOfSpeech: "adj",
    definition: "Likely to suffer from something.",
    exampleSentence: "She is prone to headaches.",
    category: "basic-adjectives"
  },
  {
    term: "vulnerable",
    meaning: "savunmasız, yatkın",
    partOfSpeech: "adj",
    definition: "Weak and easily harmed.",
    exampleSentence: "Children are vulnerable to disease.",
    category: "basic-adjectives"
  },
  {
    term: "inclined",
    meaning: "savunmasız, yatkın",
    partOfSpeech: "adj",
    definition: "Likely to do something; tending.",
    exampleSentence: "He is inclined to be lazy.",
    category: "basic-adjectives"
  },
  {
    term: "legal",
    meaning: "yasal, yasadışı",
    partOfSpeech: "adj",
    definition: "Allowed by law.",
    exampleSentence: "It is a legal agreement.",
    category: "basic-adjectives"
  },
  {
    term: "legitimate",
    meaning: "yasal, yasadışı",
    partOfSpeech: "adj",
    definition: "Allowed by law or rules; reasonable.",
    exampleSentence: "She has a legitimate claim.",
    category: "basic-adjectives"
  },
  {
    term: "illegal",
    meaning: "yasal, yasadışı",
    partOfSpeech: "adj",
    definition: "Not allowed by law.",
    exampleSentence: "Parking here is illegal.",
    category: "basic-adjectives"
  },
  {
    term: "illicit",
    meaning: "yasal, yasadışı",
    partOfSpeech: "adj",
    definition: "Not allowed by law or rules.",
    exampleSentence: "They were involved in illicit trade.",
    category: "basic-adjectives"
  },
  {
    term: "mortal",
    meaning: "ölümlü, ölümsüz",
    partOfSpeech: "adj",
    definition: "Certain to die at some time.",
    exampleSentence: "All humans are mortal.",
    category: "basic-adjectives"
  },
  {
    term: "immortal",
    meaning: "ölümlü, ölümsüz",
    partOfSpeech: "adj",
    definition: "Living or lasting forever.",
    exampleSentence: "In myth, the gods were immortal.",
    category: "basic-adjectives"
  },
  {
    term: "invalid",
    meaning: "geçersiz, kabul edilemez",
    partOfSpeech: "adj",
    definition: "Not legally or officially acceptable.",
    exampleSentence: "Your ticket is invalid.",
    category: "basic-adjectives"
  },
  {
    term: "unacceptable",
    meaning: "geçersiz, kabul edilemez",
    partOfSpeech: "adj",
    definition: "Not able to be accepted.",
    exampleSentence: "This behaviour is unacceptable.",
    category: "basic-adjectives"
  },
  {
    term: "undesirable",
    meaning: "geçersiz, kabul edilemez",
    partOfSpeech: "adj",
    definition: "Not wanted; harmful.",
    exampleSentence: "The drug had undesirable side effects.",
    category: "basic-adjectives"
  },
  {
    term: "random",
    meaning: "gelişigüzel, rastgele",
    partOfSpeech: "adj",
    definition: "Done without a plan or pattern.",
    exampleSentence: "We took a random sample.",
    category: "basic-adjectives"
  },
  {
    term: "arbitrary",
    meaning: "gelişigüzel, rastgele",
    partOfSpeech: "adj",
    definition: "Based on chance rather than reason.",
    exampleSentence: "The choice seemed arbitrary.",
    category: "basic-adjectives"
  },
  {
    term: "accidental",
    meaning: "gelişigüzel, rastgele",
    partOfSpeech: "adj",
    definition: "Happening by chance; unintended.",
    exampleSentence: "It was an accidental discovery.",
    category: "basic-adjectives"
  },
  {
    term: "unstable",
    meaning: "istikrarsız, geçici",
    partOfSpeech: "adj",
    definition: "Likely to change; not steady.",
    exampleSentence: "The situation is unstable.",
    category: "basic-adjectives"
  },
  {
    term: "volatile",
    meaning: "istikrarsız, geçici",
    partOfSpeech: "adj",
    definition: "Likely to change suddenly.",
    exampleSentence: "The market is volatile.",
    category: "basic-adjectives"
  },
  {
    term: "convenient",
    meaning: "uygun, doğru",
    partOfSpeech: "adj",
    definition: "Useful and easy; suitable.",
    exampleSentence: "Is this a convenient time?",
    category: "basic-adjectives"
  },
  {
    term: "suitable",
    meaning: "uygun, doğru",
    partOfSpeech: "adj",
    definition: "Right for a particular purpose.",
    exampleSentence: "This film is not suitable for children.",
    category: "basic-adjectives"
  },
  {
    term: "correct",
    meaning: "uygun, doğru",
    partOfSpeech: "adj",
    definition: "Free from error; true.",
    exampleSentence: "That is the correct answer.",
    category: "basic-adjectives"
  },
  {
    term: "old",
    meaning: "eski, yaşlı",
    partOfSpeech: "adj",
    definition: "Having existed for a long time.",
    exampleSentence: "This is an old building.",
    category: "basic-adjectives"
  },
  {
    term: "elderly",
    meaning: "eski, yaşlı",
    partOfSpeech: "adj",
    definition: "(Of a person) old.",
    exampleSentence: "She cares for her elderly parents.",
    category: "basic-adjectives"
  },
  {
    term: "matching",
    meaning: "uyumlu",
    partOfSpeech: "adj",
    definition: "Corresponding in colour or design.",
    exampleSentence: "She wore a matching hat and scarf.",
    category: "basic-adjectives"
  },
  {
    term: "corresponding",
    meaning: "uyumlu",
    partOfSpeech: "adj",
    definition: "Matching or related.",
    exampleSentence: "Every action has a corresponding reaction.",
    category: "basic-adjectives"
  },
  {
    term: "compatible",
    meaning: "uyumlu",
    partOfSpeech: "adj",
    definition: "Able to exist or work together.",
    exampleSentence: "The software is compatible with my computer.",
    category: "basic-adjectives"
  },
  {
    term: "novel",
    meaning: "yeni, modern",
    partOfSpeech: "adj",
    definition: "New and original; not like before.",
    exampleSentence: "It was a novel approach.",
    category: "basic-adjectives"
  },
  {
    term: "fresh",
    meaning: "yeni, modern",
    partOfSpeech: "adj",
    definition: "New and recently made or arrived.",
    exampleSentence: "We need some fresh ideas.",
    category: "basic-adjectives"
  },
  {
    term: "new",
    meaning: "yeni, modern",
    partOfSpeech: "adj",
    definition: "Not existing before; recent.",
    exampleSentence: "They bought a new car.",
    category: "basic-adjectives"
  },
  {
    term: "latest",
    meaning: "en son çıkan, güncel",
    partOfSpeech: "adj",
    definition: "Most recent.",
    exampleSentence: "Have you seen the latest news?",
    category: "basic-adjectives"
  },
  {
    term: "recent",
    meaning: "en son çıkan, güncel",
    partOfSpeech: "adj",
    definition: "Happening a short time ago.",
    exampleSentence: "There have been recent changes.",
    category: "basic-adjectives"
  },
  {
    term: "current",
    meaning: "en son çıkan, güncel",
    partOfSpeech: "adj",
    definition: "Happening or existing now.",
    exampleSentence: "The current situation is difficult.",
    category: "basic-adjectives"
  },
  {
    term: "up to date",
    meaning: "en son çıkan, güncel",
    partOfSpeech: "adj",
    definition: "Modern; including the latest information.",
    exampleSentence: "The list is up to date.",
    category: "basic-adjectives"
  },
  {
    term: "overdue",
    meaning: "gecikmiş, modası geçmiş",
    partOfSpeech: "adj",
    definition: "Not done or paid by the expected time.",
    exampleSentence: "The library book is overdue.",
    category: "basic-adjectives"
  },
  {
    term: "outdated",
    meaning: "gecikmiş, modası geçmiş",
    partOfSpeech: "adj",
    definition: "No longer modern or useful.",
    exampleSentence: "The equipment is outdated.",
    category: "basic-adjectives"
  },
  {
    term: "delayed",
    meaning: "gecikmiş, modası geçmiş",
    partOfSpeech: "adj",
    definition: "Made late.",
    exampleSentence: "The flight was delayed by two hours.",
    category: "basic-adjectives"
  },
  {
    term: "ability",
    meaning: "yetenek, beceri",
    partOfSpeech: "n",
    definition: "Possession of the means or skill to do something.",
    exampleSentence: "He has a great ability to learn foreign languages quickly.",
    category: "basic-nouns"
  },
  {
    term: "consequence",
    meaning: "sonuç, akıbet",
    partOfSpeech: "n",
    definition: "A result or effect, typically one that is unwelcome or unpleasant.",
    exampleSentence: "Littering beaches has a negative consequence on marine life.",
    category: "basic-nouns"
  },
  {
    term: "decade",
    meaning: "on yıl",
    partOfSpeech: "n",
    definition: "A period of ten years.",
    exampleSentence: "The internet became highly popular in the last decade of the 20th century.",
    category: "basic-nouns"
  },
  {
    term: "disaster",
    meaning: "felaket, afet",
    partOfSpeech: "n",
    definition: "A sudden accident or a natural catastrophe that causes great damage.",
    exampleSentence: "The earthquake was a terrible natural disaster for the region.",
    category: "basic-nouns"
  },
  {
    term: "evidence",
    meaning: "kanıt, delil",
    partOfSpeech: "n",
    definition: "The available body of facts or information indicating whether a belief is true.",
    exampleSentence: "There is clear evidence that the climate is warming.",
    category: "basic-nouns"
  },
  {
    term: "impact",
    meaning: "etki, darbe",
    partOfSpeech: "n",
    definition: "The action of one object coming forcibly into contact with another; a strong effect.",
    exampleSentence: "The tax cuts will have a positive impact on small businesses.",
    category: "basic-nouns"
  },
  {
    term: "innovation",
    meaning: "yenilik, inovasyon",
    partOfSpeech: "n",
    definition: "The action or process of innovating; a new method, idea, or product.",
    exampleSentence: "Technological innovation has reshaped modern communications.",
    category: "basic-nouns"
  },
  {
    term: "pollution",
    meaning: "kirlilik",
    partOfSpeech: "n",
    definition: "The presence in or introduction into the environment of a substance which has harmful effects.",
    exampleSentence: "The factory has been accused of causing air and water pollution.",
    category: "basic-nouns"
  },
  {
    term: "prediction",
    meaning: "tahmin, öngörü",
    partOfSpeech: "n",
    definition: "A statement about what will happen in the future.",
    exampleSentence: "It is difficult to make an accurate prediction about the stock market.",
    category: "basic-nouns"
  },
  {
    term: "resource",
    meaning: "kaynak",
    partOfSpeech: "n",
    definition: "A stock or supply of money, materials, staff, and other assets that can be drawn on.",
    exampleSentence: "The earth has limited natural resources like coal and gas.",
    category: "basic-nouns"
  },
  {
    term: "constantly",
    meaning: "sürekli, durmaksızın",
    partOfSpeech: "adv",
    definition: "Continuously over a period of time; always.",
    exampleSentence: "Technology is constantly changing and evolving.",
    category: "basic-adverbs"
  },
  {
    term: "gradually",
    meaning: "kademeli olarak, yavaş yavaş",
    partOfSpeech: "adv",
    definition: "In a gradual way; slowly; by degrees.",
    exampleSentence: "The patient is gradually recovering from the surgery.",
    category: "basic-adverbs"
  },
  {
    term: "heavily",
    meaning: "yoğun bir şekilde, büyük oranda",
    partOfSpeech: "adv",
    definition: "To a great degree or in large amounts.",
    exampleSentence: "The local community relies heavily on tourism for income.",
    category: "basic-adverbs"
  },
  {
    term: "largely",
    meaning: "büyük ölçüde, çoğunlukla",
    partOfSpeech: "adv",
    definition: "To a great extent; on the whole; mostly.",
    exampleSentence: "The success of the project is largely due to your hard work.",
    category: "basic-adverbs"
  },
  {
    term: "nearly",
    meaning: "neredeyse, hemen hemen",
    partOfSpeech: "adv",
    definition: "Very close to; almost.",
    exampleSentence: "It took nearly four hours to complete the English exam.",
    category: "basic-adverbs"
  },
  {
    term: "roughly",
    meaning: "yaklaşık olarak, kabaca",
    partOfSpeech: "adv",
    definition: "Approximately; or in a rough manner.",
    exampleSentence: "There are roughly 100 reading passages in this prep workbook.",
    category: "basic-adverbs"
  },
  {
    term: "safely",
    meaning: "güvenli bir şekilde",
    partOfSpeech: "adv",
    definition: "In a way that is not likely to cause or lead to harm or injury.",
    exampleSentence: "We want to ensure that all children can play safely in the park.",
    category: "basic-adverbs"
  },
  {
    term: "successfully",
    meaning: "başarıyla",
    partOfSpeech: "adv",
    definition: "In a way that accomplishes a desired aim or result.",
    exampleSentence: "The team successfully completed the mission ahead of schedule.",
    category: "basic-adverbs"
  },
  {
    term: "although",
    meaning: "e rağmen, karşın",
    partOfSpeech: "conj",
    definition: "In spite of the fact that; even though.",
    exampleSentence: "Although it was raining heavily, they decided to go for a walk.",
    category: "conjunctions"
  },
  {
    term: "because",
    meaning: "çünkü, ...den dolayı",
    partOfSpeech: "conj",
    definition: "For the reason that; since.",
    exampleSentence: "They could not play the match because the pitch was frozen.",
    category: "conjunctions"
  },
  {
    term: "despite",
    meaning: "e rağmen",
    partOfSpeech: "prep/conj",
    definition: "Without being affected by; in spite of.",
    exampleSentence: "Despite her fear of flying, she travelled to Spain by plane.",
    category: "conjunctions"
  },
  {
    term: "furthermore",
    meaning: "dahası, ayrıca",
    partOfSpeech: "conj",
    definition: "In addition; besides (used to introduce a fresh consideration).",
    exampleSentence: "Computer games are expensive; furthermore, they can be addictive.",
    category: "conjunctions"
  },
  {
    term: "however",
    meaning: "ancak, oysa, ama",
    partOfSpeech: "conj",
    definition: "Used to introduce a statement that contrasts with or seems to contradict something.",
    exampleSentence: "She wanted to buy the car; however, she did not have enough money.",
    category: "conjunctions"
  },
  {
    term: "therefore",
    meaning: "bu yüzden, dolayısıyla",
    partOfSpeech: "conj",
    definition: "For that reason; consequently.",
    exampleSentence: "The research budget was cut; therefore, we had to cancel the tests.",
    category: "conjunctions"
  },
  {
    term: "unless",
    meaning: "madıkça, medikçe (eğer olmazsa)",
    partOfSpeech: "conj",
    definition: "Except if (used to introduce the only case in which a statement is not true).",
    exampleSentence: "You will fail the reading exam unless you practice vocabulary daily.",
    category: "conjunctions"
  },
  {
    term: "whereas",
    meaning: "oysa, halbuki, iken (zıtlık)",
    partOfSpeech: "conj",
    definition: "In contrast or comparison with the fact that.",
    exampleSentence: "Some people love urban life, whereas others prefer the quiet countryside.",
    category: "conjunctions"
  },
  {
    term: "according to",
    meaning: "e göre",
    partOfSpeech: "prep",
    definition: "As stated by or in.",
    exampleSentence: "According to the latest weather forecast, it will snow tomorrow.",
    category: "prepositions"
  },
  {
    term: "as a result of",
    meaning: "in sonucu olarak",
    partOfSpeech: "prep",
    definition: "Because of something that has happened.",
    exampleSentence: "The flights were delayed as a result of the dense fog.",
    category: "prepositions"
  },
  {
    term: "because of",
    meaning: "yüzünden, nedeniyle",
    partOfSpeech: "prep",
    definition: "By reason of; on account of.",
    exampleSentence: "They missed the beginning of the movie because of heavy traffic.",
    category: "prepositions"
  },
  {
    term: "in addition to",
    meaning: "e ek olarak, yanı sıra",
    partOfSpeech: "prep",
    definition: "As well as; besides.",
    exampleSentence: "In addition to his job as a doctor, he teaches at the university.",
    category: "prepositions"
  },
  {
    term: "in spite of",
    meaning: "e rağmen",
    partOfSpeech: "prep",
    definition: "Without being affected by the particular factor mentioned.",
    exampleSentence: "In spite of his injury, he ran the marathon and finished third.",
    category: "prepositions"
  },
  {
    term: "prior to",
    meaning: "den önce, -den mukaddem",
    partOfSpeech: "prep",
    definition: "Before a particular time or event.",
    exampleSentence: "Please read the instructions carefully prior to starting the test.",
    category: "prepositions"
  }
];
