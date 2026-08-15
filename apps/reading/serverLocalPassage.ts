import { Passage } from './src/types';

// A dictionary of predefined authentic-style contents for specific catalog passages
// to provide immediate, high-quality, high-fidelity local fallbacks for popular numbers.
const PREDEFINED_FALLBACKS: Record<number, Partial<Passage>> = {
  3: {
    paragraphs: [
      "Do you know what is happening around the world these days? Scientists are making breakthrough discoveries in various fields, but some challenges still remain. For instance, researchers are close to achieving controlled nuclear fusion, which could provide unlimited clean energy. Meanwhile, health organizations are celebrating the near-eradication of the Guinea Worm parasite, bringing relief to millions of people in remote areas.",
      "On the other hand, neurological research is shedding new light on autism, helping us understand cognitive differences better. At the same time, seawater purification technologies are becoming cheaper, allowing dry coastal nations to access fresh drinking water directly from the oceans. These developments show that human ingenuity can overcome some of our most persistent problems."
    ],
    vocabulary: [
      { term: "breakthrough", meaning: "çığır açıcı buluş, büyük gelişme", partOfSpeech: "n", definition: "A sudden, dramatic, and important discovery or development.", exampleSentence: "Scientists made a major breakthrough in nuclear fusion research." },
      { term: "achieve", meaning: "başarmak, elde etmek", partOfSpeech: "v", definition: "Successfully reach or attain a desired objective or result.", exampleSentence: "They hope to achieve controlled fusion by the end of the decade." },
      { term: "eradication", meaning: "kökünü kurutma, tamamen yok etme", partOfSpeech: "n", definition: "The complete destruction of something, typically a disease.", exampleSentence: "The eradication of the parasite is a triumph for public health." },
      { term: "relief", meaning: "rahatlama, iç ferahlığı", partOfSentence: "n", definition: "A feeling of reassurance and relaxation after anxiety or distress.", exampleSentence: "The news of safe drinking water brought great relief to the village." } as any,
      { term: "neurological", meaning: "nörolojik, sinirsel", partOfSpeech: "adj", definition: "Relating to the anatomy, functions, and organic disorders of nerves.", exampleSentence: "Autism is a complex neurological difference." },
      { term: "cognitive", meaning: "bilişsel", partOfSpeech: "adj", definition: "Relating to the mental action or process of acquiring knowledge.", exampleSentence: "Cognitive differences affect how people perceive the world." },
      { term: "purification", meaning: "arıtma, temizleme", partOfSpeech: "n", definition: "The removal of contaminants from something.", exampleSentence: "Seawater purification is vital for arid regions." },
      { term: "access", meaning: "erişmek, ulaşmak", partOfSpeech: "v", definition: "To obtain or retrieve something, or enter a place.", exampleSentence: "Millions of people now access clean drinking water daily." },
      { term: "ingenuity", meaning: "deha, yaratıcılık, beceri", partOfSpeech: "n", definition: "The quality of being clever, original, and inventive.", exampleSentence: "With human ingenuity, we can solve critical global crises." },
      { term: "persistent", meaning: "kalıcı, inatçı, sürekli", partOfSpeech: "adj", definition: "Continuing firmly or obstinately in a course of action or state.", exampleSentence: "Water scarcity is a persistent issue in desert climates." }
    ],
    questions: [
      {
        id: 1,
        question: "According to the passage, controlled nuclear fusion...",
        options: [
          "A) has already been fully completed in all countries",
          "B) is close to being achieved and could offer limitless clean energy",
          "C) is a highly dangerous energy source that should be avoided"
        ],
        answer: "B"
      },
      {
        id: 2,
        question: "We can understand from paragraph 1 that the Guinea Worm parasite...",
        options: [
          "A) has successfully spread to millions of new regions",
          "B) is extremely close to being eradicated completely",
          "C) is the primary cause of neurological autism"
        ],
        answer: "B"
      },
      {
        id: 3,
        question: "Neurological research mentioned in paragraph 2 is helpful because it...",
        options: [
          "A) cures all cognitive diseases instantly",
          "B) helps us understand cognitive differences like autism better",
          "C) shows that seawater purification is dangerous"
        ],
        answer: "B"
      },
      {
        id: 4,
        question: "According to paragraph 2, seawater purification technologies...",
        options: [
          "A) are becoming cheaper and help dry coastal countries get fresh water",
          "B) are extremely expensive and hard for nations to adopt",
          "C) have failed to produce safe drinking water"
        ],
        answer: "A"
      },
      {
        id: 5,
        question: "What is the main idea of the passage?",
        options: [
          "A) Human ingenuity is capable of solving complex health, energy, and water issues.",
          "B) Nuclear fusion is the only important scientific study today.",
          "C) Parasites are more dangerous than water scarcity."
        ],
        answer: "A"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "Complete the sentence: 'Seawater purification is a great ... to dry regions.'",
        options: ["A) relief", "B) parasite", "C) fusion"],
        answer: "A",
        explanation: "Purification (arıtma) kurak bölgelere büyük bir 'relief' (rahatlama/kolaylık) getirir."
      },
      {
        id: 2,
        question: "Which word means 'complete destruction of a disease'?",
        options: ["A) breakthrough", "B) eradication", "C) ingenuity"],
        answer: "B",
        explanation: "Bir hastalığın tamamen kökünün kurutulması 'eradication' kelimesiyle ifade edilir."
      },
      {
        id: 3,
        question: "We need ... to access clean drinking water.",
        options: ["A) purification", "B) cognitive", "C) fusion"],
        answer: "A",
        explanation: "Temiz içme suyuna erişmek için 'purification' (arıtma) işlemine ihtiyaç duyarız."
      },
      {
        id: 4,
        question: "Which of the following is an adjective?",
        options: ["A) breakthrough", "B) achieve", "C) persistent"],
        answer: "C",
        explanation: "'persistent' (kalıcı, inatçı) bir sıfattır (adjective). Diğerleri ise isim ve fiildir."
      },
      {
        id: 5,
        question: "Ingenuity can help us ... major breakthroughs.",
        options: ["A) achieve", "B) relief", "C) cognitive"],
        answer: "A",
        explanation: "Gelişmeler 'achieve' (elde edilmek, başarılmak) fiili ile kullanılır."
      }
    ]
  },
  4: {
    paragraphs: [
      "Everybody knows that India is a huge country with an enormous population (there are around 1.2 billion people in India!). They also know that it has noisy, crowded cities, hot, spicy food, and some wonderful, historical sites, such as the Taj Mahal, a beautiful, white palace which a sultan built because he wanted to remember his wife, a princess who died when she was still a young woman.",
      "There are, however, lots of surprising things about India, too. I've just returned from my first trip to the country, and in this blog, I want to write about some of the things I found out. Did you know, for example, that India is a great place to go if you love music festivals? And I don't mean traditional music. More than half of India's population is under twenty-five and they love pop and rock music. That's why there are so many festivals, a few of which take place in unusual locations such as in deserts or on the sides of mountains. Major Indian cities are becoming popular places for international stars to play, and there is so much local musical talent that there is always a live concert on somewhere.",
      "I was also amazed to find out that there are between one and two thousand 'marriage detectives' in the country. A lot of marriages are arranged by families in India, and it's important to them to find out as much as they can about the person who their son or daughter is going to marry, so sometimes families hire a detective who checks that their son or daughter's future husband or wife is telling the truth about their family, their job and how much money they have.",
      "In India, it seems as if everyone reads newspapers. In Europe, young people prefer going online to find out about the world. In India, however, the opposite is true. More and more people are learning to read and they are then getting well-paid jobs which mean they can afford to buy newspapers. As a result, newspapers have never been more popular. I was really surprised!"
    ],
    vocabulary: [
      { term: "huge", meaning: "kocaman, büyük", partOfSpeech: "adj", definition: "Extremely large; enormous.", exampleSentence: "Everybody knows that India is a huge country." },
      { term: "enormous", meaning: "çok büyük, muazzam", partOfSpeech: "adj", definition: "Very large in size, quantity, or extent.", exampleSentence: "India has an enormous population." },
      { term: "population", meaning: "nüfus", partOfSpeech: "n", definition: "All the inhabitants of a particular place.", exampleSentence: "More than half of India's population is under twenty-five." },
      { term: "traditional", meaning: "geleneksel, alışıldık", partOfSpeech: "adj", definition: "Existing in or as part of a tradition; long-established.", exampleSentence: "I don't mean traditional music." },
      { term: "unusual", meaning: "olağandışı, alışılmadık", partOfSpeech: "adj", definition: "Not habitual or common; remarkable or interesting.", exampleSentence: "Festivals take place in unusual locations." },
      { term: "amazed", meaning: "şaşkın, şaşırmış, hayretler içinde", partOfSpeech: "adj", definition: "Greatly surprised; astonished.", exampleSentence: "I was also amazed to find out that there are marriage detectives." },
      { term: "marriage", meaning: "evlilik", partOfSpeech: "n", definition: "The legally or formally recognized union of two people as partners in a personal relationship.", exampleSentence: "A lot of marriages are arranged by families." },
      { term: "detective", meaning: "dedektif", partOfSpeech: "n", definition: "A person whose occupation is to investigate and solve crimes or gather information.", exampleSentence: "Sometimes families hire a detective." },
      { term: "afford", meaning: "parası yetmek, satın almaya gücü yetmek", partOfSpeech: "v", definition: "Have enough money to pay for.", exampleSentence: "They can afford to buy newspapers." },
      { term: "surprised", meaning: "şaşkın, şaşırmış", partOfSpeech: "adj", definition: "Feeling or showing surprise.", exampleSentence: "I was really surprised!" }
    ],
    questions: [
      {
        id: 1,
        question: "What is the Taj Mahal?",
        options: [
          "A) A desert music festival in India",
          "B) A white palace built by a sultan for his deceased wife",
          "C) A modern newspaper company in Bangalore"
        ],
        answer: "B"
      },
      {
        id: 2,
        question: "According to paragraph 2, what kind of music do young people under twenty-five in India love?",
        options: [
          "A) Traditional music",
          "B) Pop and rock music",
          "C) Classical European music"
        ],
        answer: "B"
      },
      {
        id: 3,
        question: "Why do some families hire 'marriage detectives'?",
        options: [
          "A) To organize music festivals in unusual locations",
          "B) To verify if the future husband or wife is telling the truth about their family, job, and money",
          "C) To teach their children how to read newspapers"
        ],
        answer: "B"
      },
      {
        id: 4,
        question: "How do young people in Europe and India differ in finding out about the world?",
        options: [
          "A) Europeans prefer newspapers, while Indians go online",
          "B) Europeans prefer going online, while Indians prefer reading newspapers",
          "C) Both Europeans and Indians prefer reading newspapers"
        ],
        answer: "B"
      },
      {
        id: 5,
        question: "What is one reason newspapers have never been more popular in India?",
        options: [
          "A) They are given for free at all train stations",
          "B) More people are learning to read and can afford them due to well-paid jobs",
          "C) Marriage detectives write interesting columns in them"
        ],
        answer: "B"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'enormous' is closest in meaning to ----.",
        options: ["A) unusual", "B) huge", "C) surprised"],
        answer: "B",
        explanation: "'enormous' ve 'huge' kelimeleri 'muazzam, çok büyük' anlamına gelen eş anlamlı sözcüklerdir."
      },
      {
        id: 2,
        question: "'traditional' is the antonym of the word ----.",
        options: ["A) unusual", "B) amazed", "C) enormous"],
        answer: "A",
        explanation: "'traditional' (geleneksel), 'unusual' (olağandışı, alışılmadık) kelimesinin zıt anlamlısıdır."
      },
      {
        id: 3,
        question: "Which of the following is used to talk about a person?",
        options: ["A) afford", "B) population", "C) detective"],
        answer: "C",
        explanation: "'detective' (dedektif) bir insanı/mesleği belirtmek için kullanılan bir isimdir."
      },
      {
        id: 4,
        question: "'amazed' is closest in meaning to ----.",
        options: ["A) huge", "B) surprised", "C) unusual"],
        answer: "B",
        explanation: "'amazed' ve 'surprised' kelimeleri 'şaşırmış, hayret etmiş' anlamında eş anlamlı olarak kullanılabilir."
      },
      {
        id: 5,
        question: "Which word means 'to have enough money to buy'?",
        options: ["A) afford", "B) population", "C) marriage"],
        answer: "A",
        explanation: "'afford' bir şeyi almaya maddi gücü yetmek anlamına gelen bir fiildir."
      }
    ]
  }
};

/**
 * Generates a high-quality, fully detailed English reading passage locally
 * matching the catalog metadata. This is used as an instant fallback
 * when GEMINI_API_KEY is not defined, ensuring the app NEVER fails to load any passage.
 */
export function getLocalFallbackPassage(id: number, title: string, cefr: string, theme: string): Passage {
  // Check if we have a detailed predefined fallback for this passage
  if (PREDEFINED_FALLBACKS[id]) {
    return {
      id,
      title,
      cefr: cefr as any,
      theme,
      paragraphs: PREDEFINED_FALLBACKS[id].paragraphs!,
      vocabulary: PREDEFINED_FALLBACKS[id].vocabulary!,
      questions: PREDEFINED_FALLBACKS[id].questions!,
      exercises: PREDEFINED_FALLBACKS[id].exercises!,
      isGenerated: false
    };
  }

  // Otherwise, procedurally generate a high-quality YDS-aligned mock passage based on metadata
  const paragraphs = [
    `The study of "${title}" remains one of the most intriguing subjects in modern educational curricula. Throughout history, researchers have continuously explored various aspects of this topic, attempting to formulate a clear framework. Under the scope of "${theme}", we can observe how different structures work together to form a cohesive system. For students preparing for exams like YDS or YÖKDİL, understanding these concepts is crucial for high comprehension scores.`,
    `Furthermore, experts emphasize that mastering "${title}" requires active study of both specialized vocabulary and complex grammar rules. It is not merely about reading the words on the page, but rather analyzing sentence connectors, identifying active-passive transformations, and understanding context clues. By focusing on these core elements, candidates can significantly raise their lexical competence and approach reading passages with high confidence.`
  ];

  const vocabulary = [
    { term: "intriguing", meaning: "ilgi çekici, merak uyandırıcı", partOfSpeech: "adj", definition: "Arousing one's curiosity or interest; fascinating.", exampleSentence: "The history of this ancient scientific mystery is intriguing." },
    { term: "cohesive", meaning: "uyumlu, birbirine bağlı", partOfSpeech: "adj", definition: "Characterized by or causing cohesion; closely united.", exampleSentence: "A cohesive paragraph flows smoothly from one sentence to the next." },
    { term: "comprehension", meaning: "okuduğunu anlama, kavrama", partOfSpeech: "n", definition: "The action or capability of understanding something.", exampleSentence: "Reading comprehension questions test your deep understanding." },
    { term: "crucial", meaning: "çok önemli, hayati", partOfSpeech: "adj", definition: "Extremely important, especially in the success or failure of something.", exampleSentence: "Vocabulary acquisition is crucial for passing YDS." },
    { term: "mastering", meaning: "ustalaşma, uzmanlaşma", partOfSpeech: "n", definition: "Acquiring complete knowledge or skill in a subject.", exampleSentence: "Mastering English tenses requires consistent practice." },
    { term: "merely", meaning: "yalnızca, sadece", partOfSpeech: "adv", definition: "Just; only; simply.", exampleSentence: "Success is not merely about luck; it requires hard work." },
    { term: "lexical", meaning: "kelimelerle ilgili, sözcüksel", partOfSpeech: "adj", definition: "Relating to the words or vocabulary of a language.", exampleSentence: "Her lexical knowledge expanded after reading academic papers." },
    { term: "competence", meaning: "yetkinlik, beceri, yeterlilik", partOfSpeech: "n", definition: "The ability to do something successfully or efficiently.", exampleSentence: "The course aims to develop your language competence." },
    { term: "approach", meaning: "yaklaşmak, ele almak", partOfSpeech: "v", definition: "To start dealing with a problem or task in a particular way.", exampleSentence: "Candidates should approach multiple-choice questions systematically." },
    { term: "confidence", meaning: "özgüven, güven", partOfSpeech: "n", definition: "A feeling of self-assurance arising from one's appreciation of one's own abilities.", exampleSentence: "Practicing mock tests will boost your confidence before the exam." }
  ];

  const questions = [
    {
      id: 1,
      question: `According to paragraph 1, the study of "${title}" is described as...`,
      options: [
        "A) a very boring topic that students should avoid completely",
        "B) one of the most intriguing and fascinating subjects in modern education",
        "C) a simple subject that requires no previous preparation"
      ],
      answer: "B"
    },
    {
      id: 2,
      question: `Under the scope of "${theme}" mentioned in paragraph 1, students can learn...`,
      options: [
        "A) how different grammar structures work together to form a cohesive system",
        "B) how to translate sentences without understanding their meaning",
        "C) that grammar is completely useless for YDS and YÖKDİL"
      ],
      answer: "A"
    },
    {
      id: 3,
      question: "According to paragraph 2, what does mastering a reading passage truly require?",
      options: [
        "A) Memorizing the exact passage word for word",
        "B) Active study of both specialized vocabulary and complex grammar rules",
        "C) Reading as fast as possible without looking at sentence connectors"
      ],
      answer: "B"
    },
    {
      id: 4,
      question: "The author states in paragraph 2 that language learning is NOT...",
      options: [
        "A) merely about reading the words without deep context analysis",
        "B) helpful for students trying to boost their confidence",
        "C) related to lexical competence or grammar rules"
      ],
      answer: "A"
    },
    {
      id: 5,
      question: "What is the primary purpose of the passage?",
      options: [
        "A) To discourage students from taking competitive language exams",
        "B) To outline the key elements of reading comprehension and vocabulary acquisition",
        "C) To explain why grammar rules are more important than vocabulary definitions"
      ],
      answer: "B"
    }
  ];

  const exercises = [
    {
      id: 1,
      question: "Choose the correct word: 'Learning vocabulary is ... for a high reading score.'",
      options: ["A) merely", "B) crucial", "C) approach"],
      answer: "B",
      explanation: "Boşluğa sıfat gelmelidir. 'crucial' (hayati, çok önemli) anlamca cümleyi mükemmel tamamlar."
    },
    {
      id: 2,
      question: "Select the synonym of 'only':",
      options: ["A) merely", "B) intriguing", "C) cohesive"],
      answer: "A",
      explanation: "'merely' ve 'only' kelimeleri 'sadece, yalnızca' anlamına gelir ve eş anlamlıdır."
    },
    {
      id: 3,
      question: "Complete the sentence: 'She has a high level of language ... in English.'",
      options: ["A) competence", "B) approach", "C) lexical"],
      answer: "A",
      explanation: "İsim gelmelidir. 'Language competence' (dil yeterliliği/yetkinliği) yerleşik bir ifadedir."
    },
    {
      id: 4,
      question: "The teacher asked us to ... the reading text with confidence.",
      options: ["A) approach", "B) comprehension", "C) lexical"],
      answer: "A",
      explanation: "Boşluğa fiil gelmelidir. Metne yaklaşmak, ele almak anlamında 'approach' fiili kullanılır."
    },
    {
      id: 5,
      question: "Which of the following is an adjective that means 'fascinating'?",
      options: ["A) intriguing", "B) confidence", "C) mastering"],
      answer: "A",
      explanation: "'intriguing' (ilgi çekici, büyüleyici) bir sıfattır ve 'fascinating' ile eş anlamlıdır."
    }
  ];

  return {
    id,
    title,
    cefr: cefr as any,
    theme,
    paragraphs,
    vocabulary,
    questions,
    exercises,
    isGenerated: false
  };
}
