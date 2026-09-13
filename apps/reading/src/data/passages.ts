import { Passage } from '../types';

/**
 * 100 okuma parçası — kaynağı "100 Reading" kitabının kendisi.
 *
 * Bu dosya elle yazılmadı; kitabın PDF'inden üretildi. Öncesinde buradaki
 * metinler kitapla birebir değildi: parçalar kısaltılmış, bir kısmı yeniden
 * yazılmıştı ve sorular kitabın soruları değildi.
 *
 * Her parçada "sourceFidelity" alanı hangi yolla alındığını söylüyor:
 *   "goruntuden-birebir" — sayfa görüntüsü gözle okunup birebir yazıldı
 *   "ocr-uzlastirma"     — iki bağımsız OCR çıkarımı uzlaştırılarak üretildi,
 *                          gözle doğrulanmadı
 *
 * Sorular ve cevaplar kitabın kendi sorularıyla cevap anahtarından; üretilmedi.
 * "openEnded: true" olan sorular kitapta şıksız, yazarak cevaplanıyor.
 */
export const PASSAGES_DATA: Passage[] = [
  {
    id: 1,
    title: "The Fat Pigeons of Liverpool",
    cefr: "A1",
    theme: "Present Continuous & Simple",
    paragraphs: [
      "The Liverpool City Council wants to clear the city of fat pigeons – a kind of grey bird. They normally live in big cities. In the Liverpool city centre, there are a lot of fat pigeons. The council says that people are feeding the birds. This makes them fat. The pigeons are getting bigger because they need to eat seeds and insects, not the junk food they are eating in the city centre, but people always feed them with junk food so they are getting fatter and fatter.",
      "The council is telling people this: Because they are feeding the pigeons, a lot of pigeons are staying in the city centre. The council hopes to encourage the birds to move away from the city centre and into parks and open spaces. It means they want birds to go away from the city centre.",
      "The answer is simple but a little bit expensive because robots will do the job. There are ten robotic birds in the city centre. They are scaring the pigeons away. The council also tells visitors not to give the pigeons any food. The mechanical birds – known as 'robops' – will sit on the tops of buildings. They can move around to different places. They look like peregrine falcons. These are birds that kill pigeons. They are making noises and flapping their wings to scare the pigeons. They hope that the pigeons will go away soon because the city will be the European Capital of Culture in two years."
    ],
    vocabulary: [
      { term: "city", meaning: "şehir", partOfSpeech: "n" },
      { term: "council", meaning: "meclis, konsey", partOfSpeech: "n" },
      { term: "clear", meaning: "temizlemek", partOfSpeech: "v" },
      { term: "fat", meaning: "şişman", partOfSpeech: "adj" },
      { term: "pigeon", meaning: "güvercin", partOfSpeech: "n" },
      { term: "grey", meaning: "gri", partOfSpeech: "adj" },
      { term: "bird", meaning: "kuş", partOfSpeech: "n" },
      { term: "normally", meaning: "normalde, genellikle", partOfSpeech: "adv" },
      { term: "city centre", meaning: "şehir merkezi", partOfSpeech: "n" },
      { term: "two", meaning: "iki", partOfSpeech: "adj" },
      { term: "seed", meaning: "tohum", partOfSpeech: "n" },
      { term: "insect", meaning: "böcek", partOfSpeech: "n" },
      { term: "junk food", meaning: "abur cubur", partOfSpeech: "n" },
      { term: "hope", meaning: "ümit etmek, ummak", partOfSpeech: "v" },
      { term: "encourage", meaning: "cesaretlendirmek, teşvik etmek", partOfSpeech: "v" },
      { term: "move", meaning: "hareket etmek, taşımak", partOfSpeech: "v" },
      { term: "park", meaning: "park", partOfSpeech: "n" },
      { term: "open", meaning: "açık", partOfSpeech: "adj" },
      { term: "space", meaning: "yer, boşluk", partOfSpeech: "n" },
      { term: "mean", meaning: "anlamına gelmek", partOfSpeech: "v" },
      { term: "go away", meaning: "ayrılmak, uzaklaşmak", partOfSpeech: "phr. v" },
      { term: "answer", meaning: "cevap", partOfSpeech: "n" },
      { term: "expensive", meaning: "pahalı", partOfSpeech: "adj" },
      { term: "robot", meaning: "robot", partOfSpeech: "n" },
      { term: "scare", meaning: "korkutmak", partOfSpeech: "v" },
      { term: "visitor", meaning: "ziyaretçi", partOfSpeech: "n" },
      { term: "give", meaning: "vermek", partOfSpeech: "v" },
      { term: "top", meaning: "üst, tepe", partOfSpeech: "n" },
      { term: "around", meaning: "etrafında, çevrede", partOfSpeech: "adv" },
      { term: "different", meaning: "farklı", partOfSpeech: "adj" },
      { term: "place", meaning: "yer", partOfSpeech: "n" },
      { term: "look like", meaning: "benzemek, gibi gözükmek", partOfSpeech: "phr. v" },
      { term: "falcon", meaning: "doğan", partOfSpeech: "n" },
      { term: "kill", meaning: "öldürmek", partOfSpeech: "v" },
      { term: "noise", meaning: "gürültü, ses", partOfSpeech: "n" },
      { term: "flap", meaning: "(kanat) çırpmak", partOfSpeech: "v" },
      { term: "wing", meaning: "kanat", partOfSpeech: "n" },
      { term: "soon", meaning: "yakında, kısa süre içinde", partOfSpeech: "adv" },
      { term: "capital", meaning: "başkent", partOfSpeech: "n" },
      { term: "culture", meaning: "kültür", partOfSpeech: "n" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "Why do pigeons get bigger according to paragraph 1?",
        options: [
          "A) People feed them with seeds and insects.",
          "B) Pigeons steal people's junk food.",
          "C) People give them junk food."
        ],
        answer: "C"
      },
      {
        id: 2,
        question: "We can understand from paragraph 2 that the council ----.",
        options: [
          "A) gives people fines for feeding pigeons",
          "B) wants the birds to leave the city centre",
          "C) plans to destroy the pigeons in the city centre"
        ],
        answer: "B"
      },
      {
        id: 3,
        question: "Which of the following is FALSE according to paragraph 3?",
        options: [
          "A) Pigeons are afraid of mechanical birds.",
          "B) Robotic birds are very inexpensive to use.",
          "C) The council asks people not to feed the pigeons."
        ],
        answer: "B"
      },
      {
        id: 4,
        question: "It is stated in paragraph 3 that robotic birds ----.",
        options: [
          "A) may scare the visitors in the city centre",
          "B) give harm to the tops of the buildings",
          "C) are similar to an enemy of pigeons"
        ],
        answer: "C"
      },
      {
        id: 5,
        question: "According to paragraph 3, robotic birds scare the pigeons by ----.",
        options: [
          "A) producing loud sounds",
          "B) moving to different locations",
          "C) damaging the wings of pigeons"
        ],
        answer: "A"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "Which of the following has a NEGATIVE meaning?",
        options: ["A) kill", "B) visitor", "C) expensive"],
        answer: "A"
      },
      {
        id: 2,
        question: "Which of the following can be used to talk about people?",
        options: ["A) move", "B) visitor", "C) space"],
        answer: "B"
      },
      {
        id: 3,
        question: "Which of the following has a POSITIVE meaning?",
        options: ["A) noise", "B) hope", "C) encourage"],
        answer: "C"
      },
      {
        id: 4,
        question: "Complete the collocation: 'A ... expensive project.'",
        options: ["A) a little bit", "B) go away", "C) look like"],
        answer: "A"
      },
      {
        id: 5,
        question: "Complete the sentence: 'There are a lot of fat pigeons ... the city centre.'",
        options: ["A) in", "B) on", "C) through"],
        answer: "A"
      }
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 2,
    title: "Let's Save Nature",
    cefr: "A2",
    theme: "Present Simple & Continuous",
    paragraphs: [
      "This year our school is taking part in the programme called \"Let's Save Nature.\" This programme aims at helping both animals and plants in the countryside, beaches and mountains.",
      "Animals and plants are vanishing because humans are not taking care of them. We are throwing our rubbish in the sea, on the streets, and in the countryside. The animals are getting trapped in the plastic bags, or getting ill since they are eating plastic wrappers. Plants are dying as we are throwing chemicals and rubbish in the forests. Forest fires are also killing thousands of animals and plants.",
      "Our school is now trying to reverse the adverse effects of pollution on the environment. We are collecting rubbish from the beaches in our city and telling people not to throw rubbish on them. We are also collecting used batteries and other hazardous substances. And you? What are you doing to help animals and plants? Are you littering the beaches and the countryside or are you putting your rubbish in the correct places?"
    ],
    vocabulary: [
      { term: "take part in", meaning: "-e katılmak, dahil olmak", partOfSpeech: "v" },
      { term: "aim", meaning: "amaçlamak", partOfSpeech: "v" },
      { term: "both ... and", meaning: "hem ... hem de", partOfSpeech: "" },
      { term: "vanish", meaning: "yok olmak, ortadan kalkmak", partOfSpeech: "v" },
      { term: "take care of", meaning: "ilgilenmek, gözetmek, bakmak", partOfSpeech: "v" },
      { term: "get trapped", meaning: "kapana kısılmak, tuzağa düşmek", partOfSpeech: "v" },
      { term: "wrapper", meaning: "ambalaj", partOfSpeech: "n" },
      { term: "chemicals", meaning: "kimyasal maddeler", partOfSpeech: "n pl." },
      { term: "reverse", meaning: "tersine döndürmek", partOfSpeech: "v" },
      { term: "adverse", meaning: "olumsuz, istenmeyen, kötü", partOfSpeech: "adj" },
      { term: "effect", meaning: "etki", partOfSpeech: "n" },
      { term: "hazardous", meaning: "tehlikeli, zararlı", partOfSpeech: "adj" },
      { term: "substance", meaning: "madde", partOfSpeech: "n" },
      { term: "litter", meaning: "(yere) çöp atmak", partOfSpeech: "v" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "The underlined word 'take part in' in paragraph 1 is closest in meaning to ----.",
        options: [
          "A) cancel",
          "B) reverse",
          "C) join"
        ],
        answer: "C"
      },
      {
        id: 2,
        question: "According to paragraph 1, the purpose of the programme is to ----.",
        options: [
          "A) cooperate with other schools",
          "B) support animals and plants",
          "C) visit beaches and mountains"
        ],
        answer: "B"
      },
      {
        id: 3,
        question: "The underlined word 'vanishing' in paragraph 2 is closest in meaning to ----.",
        options: [
          "A) achieving",
          "B) spreading",
          "C) disappearing"
        ],
        answer: "C"
      },
      {
        id: 4,
        question: "It is clear from paragraph 2 that animals are dying due largely to ----.",
        options: [
          "A) environmental pollution",
          "B) increasing global warming",
          "C) the scarcity of forests"
        ],
        answer: "A"
      },
      {
        id: 5,
        question: "The underlined word 'adverse' in paragraph 3 is closest in meaning to ----.",
        options: [
          "A) beneficial",
          "B) negative",
          "C) favourable"
        ],
        answer: "B"
      },
      {
        id: 6,
        question: "The underlined word 'hazardous' in paragraph 3 is closest in meaning to ----.",
        options: [
          "A) safe",
          "B) promising",
          "C) dangerous"
        ],
        answer: "C"
      },
      {
        id: 7,
        question: "The author asks some questions in paragraph 3 in order to ----.",
        options: [
          "A) emphasize the importance of the biological diversity",
          "B) criticize the environmental policies of the government",
          "C) raise the readers' awareness about the pollution"
        ],
        answer: "C"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "Which word means 'disappearing'?",
        options: ["A) vanishing", "B) reverse", "C) hazardous"],
        answer: "A"
      },
      {
        id: 2,
        question: "What is the synonym of the conjunction 'because'?",
        options: ["A) as", "B) also", "C) though"],
        answer: "A"
      },
      {
        id: 3,
        question: "Which of the following has a NEGATIVE meaning?",
        options: ["A) take care of", "B) adverse", "C) support"],
        answer: "B"
      },
      {
        id: 4,
        question: "Complete: 'Global warming has adverse effects ... the environment.'",
        options: ["A) in", "B) on", "C) with"],
        answer: "B"
      },
      {
        id: 5,
        question: "We should ... our environment by recycling our rubbish.",
        options: ["A) reverse", "B) take care of", "C) litter"],
        answer: "B"
      }
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 3,
    title: "Do You Know What Is Happening?",
    cefr: "A1",
    theme: "Simple Present & Frequency Adverbs",
    paragraphs: [
      "Do you know what is happening around the world these days? Although there are really worrying things happening right now, there are also some good things happening.",
      "Researchers are finally getting close to achieving sustainable nuclear fusion. Nuclear fusion could be the key to producing almost unlimited energy with only a few by-products other than saltwater. Some countries such as Germany, South Korea and China are achieving record-breaking reactions in their own fusion machines but they still need some time to use them properly.",
      "We got rid of smallpox in the past. Now, we are getting close to eradicating Guinea Worm parasite. This kind of parasite is a living nightmare that cause a blister to form on people's skin. It results from drinking contaminated water. Now, thanks to an affordable straw filter, we are having only a few recorded cases in the world.",
      "Nowadays, researchers are working on a drug that can treat autism symptoms. Even though it is too early to early to eradicate this disorder, researchers are getting promising results from clinical trials.",
      "Scientists are developing a method that helps turn seawater into drinking water. For the time being, the innovative technique is still limited to the lab, but one day we could quickly and easily turn one of our most abundant resources, seawater, into one of our most scarce, clean drinking water."
    ],
    vocabulary: [
      { term: "although", meaning: "-e rağmen, -se de, -sa da", partOfSpeech: "conj." },
      { term: "worrying", meaning: "endişe verici, can sıkıcı", partOfSpeech: "adj" },
      { term: "achieve", meaning: "başarmak", partOfSpeech: "v" },
      { term: "sustainable", meaning: "sürdürülebilir", partOfSpeech: "adj" },
      { term: "by-product", meaning: "yan ürün", partOfSpeech: "n" },
      { term: "other than", meaning: "-den başka", partOfSpeech: "" },
      { term: "such as", meaning: "gibi, örneğin", partOfSpeech: "" },
      { term: "get rid of", meaning: "kurtulmak, savuşturmak", partOfSpeech: "v" },
      { term: "eradicate", meaning: "kökünü kazımak, yok etmek", partOfSpeech: "v" },
      { term: "result from", meaning: "-den kaynaklanmak", partOfSpeech: "v" },
      { term: "contaminated", meaning: "kirli, pis", partOfSpeech: "adj" },
      { term: "thanks to", meaning: "-in sayesinde, -den dolayı", partOfSpeech: "" },
      { term: "case", meaning: "vaka, olay", partOfSpeech: "n" },
      { term: "work on", meaning: "üzerinde çalışmak", partOfSpeech: "v" },
      { term: "drug", meaning: "ilaç", partOfSpeech: "n" },
      { term: "treat", meaning: "tedavi etmek", partOfSpeech: "v" },
      { term: "disorder", meaning: "rahatsızlık, bozukluk, hastalık", partOfSpeech: "n" },
      { term: "even though", meaning: "-e rağmen, -se de, -sa da", partOfSpeech: "conj" },
      { term: "promising", meaning: "umut vadeden, ümit veren", partOfSpeech: "adj" },
      { term: "develop", meaning: "geliştirmek", partOfSpeech: "v" },
      { term: "innovative", meaning: "yenilikçi, çığır açıcı", partOfSpeech: "adj" },
      { term: "turn into", meaning: "dönüştürmek", partOfSpeech: "v" },
      { term: "abundant", meaning: "bol, çok", partOfSpeech: "adj" },
      { term: "scarce", meaning: "kıt, az", partOfSpeech: "adj" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "According to paragraph 2, although certain countries are working on sustainable nuclear fusion, they ----.",
        options: [
          "A) can't find highly qualified researchers",
          "B) haven't achieved any promising results",
          "C) haven't achieved it successfully yet"
        ],
        answer: "C"
      },
      {
        id: 2,
        question: "The underlined pronoun 'they' in paragraph 2 refers to ----.",
        options: [
          "A) some countries",
          "B) record-breaking reactions",
          "C) fusion machines"
        ],
        answer: "A"
      },
      {
        id: 3,
        question: "It is clear from paragraph 3 that Guinea Worm parasite is caused by ----.",
        options: [
          "A) a skin disease",
          "B) polluted water",
          "C) smallpox"
        ],
        answer: "B"
      },
      {
        id: 4,
        question: "According to paragraph 4, researchers ----.",
        options: [
          "A) haven't achieved any encouraging results",
          "B) need much more time to wipe out autism",
          "C) may never cure autism symptoms completely"
        ],
        answer: "B"
      },
      {
        id: 5,
        question: "We can understand from paragraph 5 that the new method scientists are using ----.",
        options: [
          "A) aims to meet the energy needs of the society",
          "B) is the best technique available at the moment",
          "C) can work only in artificial environments right now"
        ],
        answer: "C"
      },
      {
        id: 6,
        question: "The author's tone in the passage is ----.",
        options: [
          "A) optimistic",
          "B) sarcastic",
          "C) pessimistic"
        ],
        answer: "A"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "Complete the sentence: 'Seawater purification is a great ... to dry regions.'",
        options: ["A) relief", "B) fusion", "C) parasite"],
        answer: "A"
      },
      {
        id: 2,
        question: "Which word means 'complete destruction of a disease'?",
        options: ["A) fusion", "B) eradication", "C) breakthrough"],
        answer: "B"
      },
      {
        id: 3,
        question: "We need ... to access clean drinking water.",
        options: ["A) purification", "B) fusion", "C) ingenuity"],
        answer: "A"
      },
      {
        id: 4,
        question: "Which of the following is an adjective?",
        options: ["A) relief", "B) achieve", "C) persistent"],
        answer: "C"
      },
      {
        id: 5,
        question: "Ingenuity can help us ... major breakthroughs.",
        options: ["A) achieve", "B) eradicate", "C) access"],
        answer: "A"
      }
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 4,
    title: "India",
    cefr: "A1",
    theme: "Adjectives & Everyday Vocabulary",
    paragraphs: [
      "Everybody knows that India is a huge country with an enormous population (there are around 1.2 billion people in India!). They also know that it has noisy, crowded cities, hot, spicy food, and some wonderful, historical sites, such as the Taj Mahal, a beautiful, white palace which a sultan built because he wanted to remember his wife, a princess who died when she still a young woman.",
      "There are, however, lots of surprising things about India, too. I've just returned from my first trip to the country, and in this blog, I want to write about some of the things I found out. Did you know, for example, that India is a great place to go if you love music festivals? And I don't mean traditional music. More than half of India's population is under twenty-five and they love pop and rock music. That's why there are so many festivals, a few of which take place in unusual locations such as in deserts or on the sides of mountains. Major Indian cities are becoming popular places for international stars to play, and there is so much local musical talent that there is always a live concert on somewhere.",
      "I was also amazed to find out that there are between one and two thousand 'marriage detectives' in the country. A lot of marriages are arranged by families in India, and it's important to them to find out as much as they can about the person who their son or daughter is going to marry, so sometimes families hire a detective who checks that their son or daughter's future husband or wife is telling the truth about their family, their job and how much money they have.",
      "In India, it seems as if everyone reads newspapers. In Europe, young people prefer going online to find out about the world. In India, however, the opposite is true. More and more people are learning to read and they are then getting well-paid jobs which mean they can afford to buy newspapers. As a result, newspapers have never been more popular. I was really surprised!"
    ],
    vocabulary: [
      { term: "huge", meaning: "kocaman, büyük", partOfSpeech: "adj" },
      { term: "enormous", meaning: "çok büyük, muazzam", partOfSpeech: "adj" },
      { term: "population", meaning: "nüfus", partOfSpeech: "n" },
      { term: "traditional", meaning: "geleneksel, alışıldık", partOfSpeech: "adj" },
      { term: "unusual", meaning: "olağandışı, alışılmadık", partOfSpeech: "adj" },
      { term: "amazed", meaning: "şaşkın, şaşırmış, hayretler içinde", partOfSpeech: "adj" },
      { term: "marriage", meaning: "evlilik", partOfSpeech: "n" },
      { term: "detective", meaning: "dedektif", partOfSpeech: "n" },
      { term: "afford", meaning: "parası yetmek, satın almaya gücü yetmek", partOfSpeech: "v" },
      { term: "surprised", meaning: "şaşkın, şaşırmış", partOfSpeech: "adj" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "Which of the following topics does the writer NOT mention in the first paragraph?",
        options: [
          "A) the number of people",
          "B) the things people eat",
          "C) the size of the country",
          "D) the temperature in the cities"
        ],
        answer: "D"
      },
      {
        id: 2,
        question: "Why did a sultan build the Taj Mahal?",
        options: [
          "A) To make his wife happy.",
          "B) To remember his wife.",
          "C) Because he wanted to live somewhere beautiful.",
          "D) Because his wife liked white buildings."
        ],
        answer: "B"
      },
      {
        id: 3,
        question: "What does the writer say about his own experiences of India?",
        options: [
          "A) He's found lots of great places where they do traditional dances.",
          "B) He's been to India many times and loves it more each time he goes.",
          "C) He's found out that they have festivals there in strange places.",
          "D) He's discovered that there aren't many Indian rock stars these days."
        ],
        answer: "C"
      },
      {
        id: 4,
        question: "Why do more people read newspapers in India these days?",
        options: [
          "A) They are very fashionable in Europe.",
          "B) They don't have the same access to online media as in Europe.",
          "C) People have more money now, so newspapers are easier to buy.",
          "D) Newspapers are better in India now."
        ],
        answer: "C"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'enormous' is closest in meaning to ----.",
        options: ["A) unusual", "B) huge", "C) surprised"],
        answer: "B"
      },
      {
        id: 2,
        question: "'traditional' is the antonym of the word ----.",
        options: ["A) unusual", "B) amazed", "C) enormous"],
        answer: "A"
      },
      {
        id: 3,
        question: "Which of the following is used to talk about a person?",
        options: ["A) afford", "B) population", "C) detective"],
        answer: "C"
      },
      {
        id: 4,
        question: "'amazed' is closest in meaning to ----.",
        options: ["A) huge", "B) surprised", "C) unusual"],
        answer: "B"
      },
      {
        id: 5,
        question: "Which word means 'to have enough money to buy'?",
        options: ["A) afford", "B) population", "C) marriage"],
        answer: "A"
      }
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 5,
    title: "The Interrail Pass",
    cefr: "A2",
    theme: "Past Simple (Regular & Irregular)",
    paragraphs: [
      "An Interrail Pass is a type of train ticket. You can use this ticket to travel throughout Europe for a low cost. With an Interrail Pass, you can go to 30 countries by train and you never need to pay extra money for travel. There are two types of Interrail tickets: the Flexi Pass and the Interrail One Pass. You can travel to different European countries with the Flexi Pass, but you can use the Interrail One Pass only in one European country.",
      "The Interrail became very popular soon after the first travelers used it in 1972. Over 8 million people had travelled with an Interrail Pass by 2011. In 2012, about 200.000 people used Interrail tickets to travel. Today, \"Interrailing\" is a fun activity for young people, especially for university students. They work during the winter and make money for their trips. In the summer, the weather is warmer and there are more activities to do in many European cities, so they mostly travel to European countries in this season.",
      "Interrail travelers jump on any train and experience total freedom and adventure every year. They discover new countries and cultures in an inexpensive and safe way. They love Interrail because they just sit down and enjoy the view. They meet new people from different countries and build lifelong friendships. Charlotte Clayson, an Interrailer, says \"I love Interrail because you get to meet new people and make friends from different parts of the world. I got back from my Interrail trip two months ago and now I'm planning a trip to Amsterdam to visit a friend. I met him in my hostel in Rome.\" Interrailing can also be more than just travel. It changes some travelers' life. An old Interrailer, Jack Roberts, became a diplomat and started to travel around the world because he never forgot his Interrail adventure from when he was young."
    ],
    vocabulary: [
      { term: "type", meaning: "tür, tip", partOfSpeech: "n" },
      { term: "ticket", meaning: "bilet", partOfSpeech: "n" },
      { term: "throughout", meaning: "boyunca, başından sonuna", partOfSpeech: "prep" },
      { term: "Europe", meaning: "Avrupa", partOfSpeech: "n" },
      { term: "low", meaning: "düşük", partOfSpeech: "adj" },
      { term: "cost", meaning: "maliyet", partOfSpeech: "n" },
      { term: "country", meaning: "ülke", partOfSpeech: "n" },
      { term: "never", meaning: "asla, hiçbir zaman", partOfSpeech: "adv" },
      { term: "pay", meaning: "ödemek", partOfSpeech: "v" },
      { term: "money", meaning: "para", partOfSpeech: "n" },
      { term: "European", meaning: "Avrupalı", partOfSpeech: "adj" },
      { term: "become", meaning: "olmak, haline gelmek", partOfSpeech: "v" },
      { term: "over", meaning: "üzerinde, aşkın", partOfSpeech: "prep" },
      { term: "about", meaning: "yaklaşık, hemen hemen", partOfSpeech: "prep" },
      { term: "fun", meaning: "eğlence, eğlenme", partOfSpeech: "n" },
      { term: "activity", meaning: "faaliyet, etkinlik", partOfSpeech: "n" },
      { term: "especially", meaning: "özellikle", partOfSpeech: "adv" },
      { term: "university", meaning: "üniversite", partOfSpeech: "n" },
      { term: "during", meaning: "süresince", partOfSpeech: "prep" },
      { term: "winter", meaning: "kış", partOfSpeech: "n" },
      { term: "weather", meaning: "hava", partOfSpeech: "n" },
      { term: "warm", meaning: "ılık, sıcak", partOfSpeech: "adj" },
      { term: "mostly", meaning: "çoğunlukla", partOfSpeech: "adv" },
      { term: "season", meaning: "mevsim", partOfSpeech: "n" },
      { term: "jump", meaning: "zıplamak, atlamak", partOfSpeech: "v" },
      { term: "experience", meaning: "deneyimlemek, yaşamak", partOfSpeech: "v" },
      { term: "total", meaning: "tamamen, sınırsız", partOfSpeech: "adj" },
      { term: "freedom", meaning: "özgürlük", partOfSpeech: "n" },
      { term: "adventure", meaning: "macera", partOfSpeech: "n" },
      { term: "discover", meaning: "keşfetmek, bulmak", partOfSpeech: "v" },
      { term: "inexpensive", meaning: "ucuz, masrafsız", partOfSpeech: "adj" },
      { term: "way", meaning: "yol, yöntem", partOfSpeech: "n" },
      { term: "view", meaning: "manzara, görünüm", partOfSpeech: "n" },
      { term: "lifelong", meaning: "hayat boyu", partOfSpeech: "adj" },
      { term: "relationship", meaning: "ilişki", partOfSpeech: "n" },
      { term: "say", meaning: "söylemek", partOfSpeech: "v" },
      { term: "ago", meaning: "önce", partOfSpeech: "adv" },
      { term: "plan", meaning: "planlamak, tasarlamak", partOfSpeech: "v" },
      { term: "change", meaning: "değiştirmek", partOfSpeech: "v" },
      { term: "world", meaning: "dünya", partOfSpeech: "n" },
      { term: "forget", meaning: "unutmak", partOfSpeech: "v" },
      { term: "young", meaning: "genç", partOfSpeech: "adj" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "According to paragraph 1, the Flexi Pass is different from the Interrail One Pass because with a flexi pass you ----.",
        options: [
          "A) travel anywhere in the world",
          "B) spend much more money",
          "C) visit different countries in Europe"
        ],
        answer: "C"
      },
      {
        id: 2,
        question: "According to paragraph 2, people usually go Interrailing in the summer because ----.",
        options: [
          "A) city life in Europe becomes more fun",
          "B) train tickets are cheaper than usual",
          "C) they can make money in Europe"
        ],
        answer: "A"
      },
      {
        id: 3,
        question: "Which one of the following is FALSE about Interrailing, according to paragraph 3?",
        options: [
          "A) It is inexpensive and safe.",
          "B) It helps you find a job easily.",
          "C) It helps you make new friends."
        ],
        answer: "B"
      },
      {
        id: 4,
        question: "Interrailing is important for Jack Roberts since he ----.",
        options: [
          "A) learned about new cultures",
          "B) made many new friends",
          "C) decided on his career"
        ],
        answer: "C"
      },
      {
        id: 5,
        question: "The underlined word 'lifelong' in paragraph 3 is closest in meaning to ----.",
        options: [
          "A) temporary",
          "B) ancient",
          "C) permanent"
        ],
        answer: "C"
      },
      {
        id: 6,
        question: "The underlined pronoun \"It\" in paragraph 3 refers to -----.",
        options: [],
        answer: "Interrailing",
        openEnded: true
      }
    ],
    exercises: [
      {
        id: 1,
        question: "You need to book your hotel rooms ... to get a discount.",
        options: ["A) widely", "B) in advance", "C) popular"],
        answer: "B"
      },
      {
        id: 2,
        question: "This ticket ... you to travel on any train in Europe.",
        options: ["A) allows", "B) covers", "C) introduces"],
        answer: "A"
      },
      {
        id: 3,
        question: "They want to ... new tourist spots next summer.",
        options: ["A) explore", "B) introduce", "C) cover"],
        answer: "A"
      },
      {
        id: 4,
        question: "The school celebrated its 10th ... yesterday.",
        options: ["A) anniversary", "B) budget", "C) flexibility"],
        answer: "A"
      },
      {
        id: 5,
        question: "Travelers like this ticket because of its high ... .",
        options: ["A) budget", "B) flexibility", "C) anniversary"],
        answer: "B"
      }
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 6,
    title: "Sign Language",
    cefr: "A2",
    theme: "Passive Voice Intro",
    paragraphs: [
      "Sign language is a language for deaf people. Deaf people often use sign languages because they cannot hear any sounds. They do not understand anything when someone speaks to them. They can use sign languages more easily than spoken languages. They use their hands to communicate. Some deaf people also look at a speaker's lips and understand a spoken language. This is called \"lip-reading\". Very few people can lip-read well because it is hard to learn. So most deaf people use a sign language.",
      "People sometimes learn a sign language from their family, especially if their parents are deaf. But most deaf children have hearing parents. Their parents use spoken languages so they must learn a sign language from other deaf people. They meet other deaf people at school. Sometimes deaf people go to a special school to learn a sign language or buy a sign language workbook with an interactive DVD.",
      "Sign languages are not new. In old books, we see stories about deaf people and sign language. In the western world, people did the first research studies on sign languages in the 17th century. In 1620, in Spain, the priest, Juan Pablo Bonet, wrote a book about teaching deaf people to speak. Bonet created the language of signs. Then, a French educator called Abbé Charles-Michel de l-Épée designed a finger-spelling alphabet in the 18th century. After Épée created the alphabet, he became very famous. People started to call him the \"Father of the Deaf\". Today, many people still use his alphabet in many countries.",
      "There is not one single sign language for all deaf people around the world. There are many sign languages. Usually there is a different sign language in each country, but these sign languages are not related to spoken languages. They are independent. According to research, there are about 137 sign languages in the world. These sign languages are not totally different from each other. They can have very similar grammar rules and alphabets. But they are not the same. Different sign languages can use different hand shapes to make words and sentences."
    ],
    vocabulary: [
      { term: "sign", meaning: "işaret, simge", partOfSpeech: "n" },
      { term: "deaf", meaning: "işitme engelli", partOfSpeech: "adj" },
      { term: "sound", meaning: "ses", partOfSpeech: "n" },
      { term: "understand", meaning: "anlamak, idrak etmek", partOfSpeech: "v" },
      { term: "speak", meaning: "konuşmak", partOfSpeech: "v" },
      { term: "communicate", meaning: "iletişime geçmek", partOfSpeech: "v" },
      { term: "speaker", meaning: "konuşucu", partOfSpeech: "n" },
      { term: "lip", meaning: "dudak", partOfSpeech: "n" },
      { term: "well", meaning: "iyi, iyice, güzelce", partOfSpeech: "adv" },
      { term: "research", meaning: "araştırma", partOfSpeech: "n" },
      { term: "study", meaning: "çalışma", partOfSpeech: "n" },
      { term: "century", meaning: "yüzyıl", partOfSpeech: "n" },
      { term: "priest", meaning: "rahip", partOfSpeech: "n" },
      { term: "educator", meaning: "eğitimci", partOfSpeech: "n" },
      { term: "finger", meaning: "parmak", partOfSpeech: "n" },
      { term: "call", meaning: "aramak, çağırmak", partOfSpeech: "v" },
      { term: "related to", meaning: "ile ilgili, ilişkili, bağlı", partOfSpeech: "adj" },
      { term: "independent", meaning: "bağımsız, ayrı", partOfSpeech: "adj" },
      { term: "totally", meaning: "tamamen", partOfSpeech: "adv" },
      { term: "similar", meaning: "benzer", partOfSpeech: "adj" },
      { term: "grammar", meaning: "dilbilgisi", partOfSpeech: "n" },
      { term: "rule", meaning: "kural", partOfSpeech: "n" },
      { term: "hand", meaning: "el", partOfSpeech: "n" },
      { term: "shape", meaning: "şekil", partOfSpeech: "n" },
      { term: "word", meaning: "sözcük", partOfSpeech: "n" },
      { term: "sentence", meaning: "tümce, cümle", partOfSpeech: "n" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "According to paragraph 1, only a small number of people are able to read people's lips since ----.",
        options: [
          "A) many deaf people prefer a sign language",
          "B) it is a difficult task to acquire this skill",
          "C) majority of people speak too fast for them"
        ],
        answer: "B"
      },
      {
        id: 2,
        question: "The underlined pronoun 'it' in paragraph 1 refers to ----",
        options: [],
        answer: "lip-reading (or being able to lip-read well)",
        openEnded: true
      },
      {
        id: 3,
        question: "Which of the following is TRUE about deaf people according to paragraph 2?",
        options: [
          "A) They have to go to a special school to learn sign language.",
          "B) They can learn a sign language from their families better.",
          "C) They can learn a sign language using books and technology."
        ],
        answer: "C"
      },
      {
        id: 4,
        question: "The main purpose of paragraph 3 is to ----.",
        options: [
          "A) give a brief history of sign languages",
          "B) compare some scholars teaching different sign languages",
          "C) explain the different uses of sign languages in some countries"
        ],
        answer: "A"
      },
      {
        id: 5,
        question: "Which of the following is FALSE according to paragraph 3?",
        options: [
          "A) No scientific studies on sign languages were carried out until the 17th century.",
          "B) People are still practising a sign language by making use of the work of Épée.",
          "C) Épée made use of Bonet's book while creating his finger-spelling alphabet."
        ],
        answer: "C"
      },
      {
        id: 6,
        question: "We can understand from paragraph 4 that ----.",
        options: [
          "A) People from different countries use identical sign languages",
          "B) The grammar rules of sign languages are completely different",
          "C) There is no connection between sign and spoken languages"
        ],
        answer: "C"
      },
      {
        id: 7,
        question: "It is stated in the passage that ----.",
        options: [
          "A) there are differences and similarities among sign languages throughout the world",
          "B) each country has its own sets of sign language grammar rules",
          "C) hand shapes of different sign languages show similarities to each other"
        ],
        answer: "A"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "He used gestures ... speaking to explain the path.",
        options: ["A) instead of", "B) unique", "C) universal"],
        answer: "A"
      },
      {
        id: 2,
        question: "Each region has a ... dialect.",
        options: ["A) facial", "B) unique", "C) complex"],
        answer: "B"
      },
      {
        id: 3,
        question: "Smiles are a ... sign of happiness.",
        options: ["A) facial", "B) universal", "C) unique"],
        answer: "B"
      },
      {
        id: 4,
        question: "The organization wants to ... equal rights for all.",
        options: ["A) promote", "B) recognize", "C) shape"],
        answer: "A"
      },
      {
        id: 5,
        question: "Sign language uses hand ... to represent words.",
        options: ["A) expressions", "B) shapes", "C) linguists"],
        answer: "B"
      }
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 7,
    title: "Are You Planning to Get Fit?",
    cefr: "A2",
    theme: "Used to & Past Descriptions",
    paragraphs: [
      "Are you planning to get fit? Never buy an exercise bike. Generally, people buy them and use them for a week and then forget about them. They are helpful when people use them regularly, but you need to be determined. You should exercise often on your bike, but it is not easy. Most people will find it much easier to go for a run around the park.",
      "Running is also much cheaper than most other sports. You don't need to buy expensive clothes to go running around the park or on the beach. They just need to be comfortable and keep you warm in the winter and cool in the summer. In addition, you only need one piece of equipment. That's your running shoes. Remember that you are not looking for a fashion item. Your shoes do not need to look attractive. Your shoes must keep your feet safe and protect you from injury. They can be expensive, but good quality shoes will be in good condition for a long time. You won't need to buy new ones very often. For good shoes, it's always best to get expert advice, and the best place for that is a sports shop.",
      "The secret of running is to start slowly, and not to do too much at the beginning. Try to run for ten minutes about three times a week at first. After you do that, you can start to run for a longer time. After a few months, you will start running at a good speed for thirty minutes three or four times a week. Training too hard is not very effective. According to researchers, exercising for too many hours does not help people to get fitter. So you need to find a good exercise routine for yourself and follow it strictly."
    ],
    vocabulary: [
      { term: "exercise", meaning: "egzersiz", partOfSpeech: "n" },
      { term: "generally", meaning: "genellikle, çoğunlukla", partOfSpeech: "adv" },
      { term: "helpful", meaning: "yararlı, kullanışlı", partOfSpeech: "adj" },
      { term: "regularly", meaning: "düzenli olarak", partOfSpeech: "adv" },
      { term: "determined", meaning: "azimli, kararlı", partOfSpeech: "adj" },
      { term: "easy", meaning: "kolay", partOfSpeech: "adj" },
      { term: "run", meaning: "koşu", partOfSpeech: "n" },
      { term: "run", meaning: "koşmak", partOfSpeech: "v" },
      { term: "beach", meaning: "kumsal, sahil", partOfSpeech: "n" },
      { term: "comfortable", meaning: "rahat", partOfSpeech: "adj" },
      { term: "equipment", meaning: "donanım, malzeme", partOfSpeech: "n" },
      { term: "shoe", meaning: "ayakkabı", partOfSpeech: "n" },
      { term: "look for", meaning: "aramak", partOfSpeech: "phr. v" },
      { term: "fashion", meaning: "moda", partOfSpeech: "n" },
      { term: "attractive", meaning: "çekici, güzel", partOfSpeech: "adj" },
      { term: "injury", meaning: "incinme, sakatlık", partOfSpeech: "n" },
      { term: "quality", meaning: "kalite", partOfSpeech: "n" },
      { term: "expert", meaning: "uzman", partOfSpeech: "n" },
      { term: "advice", meaning: "tavsiye", partOfSpeech: "n" },
      { term: "secret", meaning: "sır, gizli", partOfSpeech: "n" },
      { term: "slowly", meaning: "yavaşça, yavaş bir şekilde", partOfSpeech: "adv" },
      { term: "speed", meaning: "hız", partOfSpeech: "n" },
      { term: "training", meaning: "idman, antrenman", partOfSpeech: "n" },
      { term: "effective", meaning: "etkili", partOfSpeech: "adj" },
      { term: "researcher", meaning: "araştırmacı", partOfSpeech: "n" },
      { term: "routine", meaning: "rutin, alışkanlık", partOfSpeech: "n" },
      { term: "follow", meaning: "takip etmek, izlemek", partOfSpeech: "v" },
      { term: "strictly", meaning: "sıkı sıkıya, katı bir şekilde", partOfSpeech: "adv" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "According to paragraph 1, many individuals prefer going running to using exercise bike since running is ----.",
        options: [
          "A) a lot more simple",
          "B) much more healthy",
          "C) far less dangerous"
        ],
        answer: "A"
      },
      {
        id: 2,
        question: "We can infer from paragraph 2 that in order to do some sports, you ----.",
        options: [
          "A) need to use some items for a long time",
          "B) might need to follow the fashion regularly",
          "C) may have to purchase costly materials"
        ],
        answer: "C"
      },
      {
        id: 3,
        question: "According to paragraph 2, one important thing about running clothes is that ----.",
        options: [
          "A) you need to change them regularly",
          "B) they must make you feel relaxed",
          "C) they should protect you from injuries"
        ],
        answer: "B"
      },
      {
        id: 4,
        question: "The underlined pronoun 'They' in paragraph 2 refers to ----.",
        options: [],
        answer: "(running) clothes",
        openEnded: true
      },
      {
        id: 5,
        question: "The underlined word 'advice' in paragraph 3 is closest in meaning to ----.",
        options: [
          "A) treatment",
          "B) suggestion",
          "C) cooperation"
        ],
        answer: "B"
      },
      {
        id: 6,
        question: "The author's main purpose in paragraph 3 is to ----.",
        options: [
          "A) compare going running with training hard",
          "B) give information about recent research into training",
          "C) inform the reader about the stages of proper running"
        ],
        answer: "C"
      },
      {
        id: 7,
        question: "The underlined word 'strictly' in paragraph 3 is closest in meaning to ----.",
        options: [
          "A) firmly",
          "B) especially",
          "C) naturally"
        ],
        answer: "A"
      },
      {
        id: 8,
        question: "The main purpose of the text is to ----.",
        options: [
          "A) inform the reader about the best ways of keeping fit",
          "B) explain the secrets of running methodologically",
          "C) raise the awareness of the reader about running"
        ],
        answer: "C"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "Buying things you do not need is a ... of money.",
        options: ["A) waste", "B) plan", "C) exercise"],
        answer: "A"
      },
      {
        id: 2,
        question: "You should exercise ... to stay healthy.",
        options: ["A) regularly", "B) instead", "C) bored"],
        answer: "A"
      },
      {
        id: 3,
        question: "This new method is very ... in curing the disease.",
        options: ["A) effective", "B) cardiovascular", "C) bored"],
        answer: "A"
      },
      {
        id: 4,
        question: "Running can help ... your stress levels.",
        options: ["A) reduce", "B) plan", "C) exercise"],
        answer: "A"
      },
      {
        id: 5,
        question: "Playing games is an ... way to learn English.",
        options: ["A) enjoyable", "B) effective", "C) cardiovascular"],
        answer: "A"
      }
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 8,
    title: "My Father's Business Trip",
    cefr: "B1",
    theme: "Past Simple (was/were)",
    paragraphs: [
      "Yesterday was great for me because my father was back home. My father was in Spain last weekend for his business. It was the first time when we were apart. It was a tiring weekend for him and he was very busy. My mother and I were worried about him because he was afraid of travelling by plane. After a short flight, he was safe and happy because he was not afraid of travelling by plane anymore. When he was in Spain, it was late. He phoned us at night as he was busy. He was there for three days, but it was like a decade. We missed him so much. We were very glad to see him back. There were presents in his bags for us. There was a scarf for my mother. It was silk. There was a camera for me. It was a great gift for me."
    ],
    vocabulary: [
      { term: "yesterday", meaning: "dün", partOfSpeech: "adv" },
      { term: "great", meaning: "harika", partOfSpeech: "adj" },
      { term: "because", meaning: "çünkü", partOfSpeech: "conj" },
      { term: "for", meaning: "için", partOfSpeech: "prep" },
      { term: "home", meaning: "ev", partOfSpeech: "n" },
      { term: "Spain", meaning: "İspanya", partOfSpeech: "n" },
      { term: "last", meaning: "son, geçen", partOfSpeech: "adj" },
      { term: "business", meaning: "iş", partOfSpeech: "n" },
      { term: "the first time", meaning: "ilk kez", partOfSpeech: "n" },
      { term: "apart", meaning: "ayrı", partOfSpeech: "adj" },
      { term: "busy", meaning: "meşgul", partOfSpeech: "adj" },
      { term: "very", meaning: "çok", partOfSpeech: "adv" },
      { term: "worried about", meaning: "(bir konu, kişi) hakkında endişeli", partOfSpeech: "adj" },
      { term: "afraid of", meaning: "-den korkan", partOfSpeech: "adj" },
      { term: "plane", meaning: "uçak", partOfSpeech: "n" },
      { term: "travel", meaning: "seyahat etmek", partOfSpeech: "v" },
      { term: "short", meaning: "kısa", partOfSpeech: "adj" },
      { term: "flight", meaning: "uçuş", partOfSpeech: "n" },
      { term: "safe", meaning: "güvenli, güvende", partOfSpeech: "adj" },
      { term: "anymore", meaning: "artık", partOfSpeech: "adv" },
      { term: "phone", meaning: "telefon etmek", partOfSpeech: "v" },
      { term: "night", meaning: "gece", partOfSpeech: "n" },
      { term: "there", meaning: "orada", partOfSpeech: "adv" },
      { term: "day", meaning: "gün", partOfSpeech: "n" },
      { term: "decade", meaning: "on yıl", partOfSpeech: "n" },
      { term: "like", meaning: "gibi", partOfSpeech: "prep" },
      { term: "miss", meaning: "özlemek", partOfSpeech: "v" },
      { term: "glad", meaning: "mutlu, memnun", partOfSpeech: "adj" },
      { term: "see", meaning: "görmek", partOfSpeech: "v" },
      { term: "present", meaning: "hediye, armağan", partOfSpeech: "n" },
      { term: "bag", meaning: "çanta", partOfSpeech: "n" },
      { term: "scarf", meaning: "şal", partOfSpeech: "n" },
      { term: "silk", meaning: "ipek", partOfSpeech: "n" },
      { term: "camera", meaning: "fotoğraf makinesi", partOfSpeech: "n" },
      { term: "gift", meaning: "hediye, armağan", partOfSpeech: "n" },
      { term: "weekend", meaning: "hafta sonu", partOfSpeech: "n" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "It is stated in the passage that the author's father ----.",
        options: [
          "A) got over his fear at the end of his flight",
          "B) is a very successful businessperson",
          "C) bought very expensive gifts for his family"
        ],
        answer: "A"
      },
      {
        id: 2,
        question: "Which of the following is TRUE about the author's father's journey?",
        options: [
          "A) He was away for two days.",
          "B) His plane journey took long.",
          "C) He went abroad on business."
        ],
        answer: "C"
      },
      {
        id: 3,
        question: "The author and the author's mother were nervous since the author's father ----.",
        options: [
          "A) didn't phone until it was late",
          "B) was scared of flying",
          "C) was too busy with his work"
        ],
        answer: "B"
      },
      {
        id: 4,
        question: "The underlined word 'apart' in the passage is closest in meaning to ----.",
        options: [
          "A) not alone",
          "B) not away",
          "C) not together"
        ],
        answer: "C"
      },
      {
        id: 5,
        question: "Which of the following could be the best title for the passage?",
        options: [
          "A) My Father's Greatest Phobia",
          "B) My Father's Business Trip",
          "C) My Father's Dangerous Journey"
        ],
        answer: "B"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "Which of the following has a POSITIVE meaning?",
        options: ["A) tired", "B) worried", "C) safe"],
        answer: "C"
      },
      {
        id: 2,
        question: "'gift' is closest in meaning to...",
        options: ["A) plane", "B) present", "C) silk"],
        answer: "B"
      },
      {
        id: 3,
        question: "'glad' is closest in meaning to...",
        options: ["A) apart", "B) safe", "C) happy"],
        answer: "C"
      },
      {
        id: 4,
        question: "Complete the sentence: 'My mother is always worried ... my safety.'",
        options: ["A) about", "B) of", "C) with"],
        answer: "A"
      },
      {
        id: 5,
        question: "Complete the sentence: 'My father usually travels ... plane for long journeys.'",
        options: ["A) by", "B) with", "C) on"],
        answer: "A"
      }
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 9,
    title: "Our Trip to Windsor Castle",
    cefr: "A2",
    theme: "Passive Voice & Chronology",
    paragraphs: [
      "Our last trip was to Windsor Castle. Windsor Castle is one of the Queen's homes, but she only stays there at weekends. We were there on a Monday, so the Queen and her family weren't there. They were at Buckingham Palace, the Queen's home in London. There were many beautiful chairs and carpets in Windsor Castle, but my favourite thing was Queen Mary's doll's house. It was a gift from the people of England to the Queen Mary, the wife of George V, in the 1920s. Most doll's houses are toys for children, but Queen Mary wasn't a child at the time. She was an adult. The doll's house and the items in it were miniature copies of Windsor Castle and the real things in it – furniture, curtains, lamps, bottles of wines and even toilet paper! The miniatures were amazing. I guess doll's houses aren't only for children."
    ],
    vocabulary: [
      { term: "trip", meaning: "yolculuk, gezi", partOfSpeech: "n" },
      { term: "Monday", meaning: "Pazartesi", partOfSpeech: "n" },
      { term: "palace", meaning: "saray", partOfSpeech: "n" },
      { term: "beautiful", meaning: "güzel", partOfSpeech: "adj" },
      { term: "chair", meaning: "sandalye", partOfSpeech: "n" },
      { term: "carpet", meaning: "halı", partOfSpeech: "n" },
      { term: "castle", meaning: "kale", partOfSpeech: "n" },
      { term: "but", meaning: "ama", partOfSpeech: "conj" },
      { term: "thing", meaning: "şey, nesne", partOfSpeech: "n" },
      { term: "doll", meaning: "oyuncak bebek", partOfSpeech: "n" },
      { term: "wife", meaning: "eş (kadın)", partOfSpeech: "n" },
      { term: "child", meaning: "çocuk", partOfSpeech: "n" },
      { term: "adult", meaning: "yetişkin", partOfSpeech: "n" },
      { term: "item", meaning: "madde, parça", partOfSpeech: "n" },
      { term: "miniature", meaning: "minyatür, küçük", partOfSpeech: "adj" },
      { term: "copy", meaning: "kopya", partOfSpeech: "n" },
      { term: "real", meaning: "gerçek", partOfSpeech: "adj" },
      { term: "furniture", meaning: "mobilya", partOfSpeech: "n" },
      { term: "curtain", meaning: "perde", partOfSpeech: "n" },
      { term: "lamp", meaning: "lamba", partOfSpeech: "n" },
      { term: "bottle", meaning: "şişe", partOfSpeech: "n" },
      { term: "wine", meaning: "şarap", partOfSpeech: "n" },
      { term: "amazing", meaning: "büyüleyici, muhteşem", partOfSpeech: "adj" },
      { term: "guess", meaning: "sanmak, tahmin etmek", partOfSpeech: "v" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "It is stated in the passage that the doll's house ----.",
        options: [
          "A) in Windsor Castle is the largest in England",
          "B) was a present to the Queen of England",
          "C) includes mini figures of people of England"
        ],
        answer: "B"
      },
      {
        id: 2,
        question: "Which of the following is FALSE about Queen Mary?",
        options: [
          "A) She stays at Windsor Castle for two days in a week.",
          "B) She got the doll's house when she was only a kid.",
          "C) English people gave her the doll's house in the early 1900s."
        ],
        answer: "B"
      },
      {
        id: 3,
        question: "We can understand from the passage that the author ----.",
        options: [
          "A) thought that the doll's houses were just for kids",
          "B) didn't enjoy some parts of her trip to the castle",
          "C) had the chance to meet the Queen at the palace"
        ],
        answer: "A"
      },
      {
        id: 4,
        question: "The underlined word 'items' in the passage is closest in meaning to ----.",
        options: [
          "A) gifts",
          "B) objects",
          "C) dolls"
        ],
        answer: "B"
      },
      {
        id: 5,
        question: "Which of the following could be the best title for the passage?",
        options: [
          "A) Buckingham Palace",
          "B) The Royal Family",
          "C) Tour to Windsor Castle"
        ],
        answer: "C"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "The hotel room has windows that ... the sea.",
        options: ["A) overlook", "B) complete with", "C) trip"],
        answer: "A"
      },
      {
        id: 2,
        question: "She has a ... collection of ancient coins.",
        options: ["A) tiny", "B) aristocratic", "C) inhabited"],
        answer: "A"
      },
      {
        id: 3,
        question: "The museum is a major tourist ... in our city.",
        options: ["A) attraction", "B) monarch", "C) trip"],
        answer: "A"
      },
      {
        id: 4,
        question: "This building is still ... by local families.",
        options: ["A) inhabited", "B) tiny", "C) aristocratic"],
        answer: "A"
      },
      {
        id: 5,
        question: "The crown belongs to the reigning ... of the country.",
        options: ["A) monarch", "B) attraction", "C) replica"],
        answer: "A"
      }
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 10,
    title: "The Ancient Egyptian Civilization",
    cefr: "B1",
    theme: "Relative Clauses (Who/Which)",
    paragraphs: [
      "The ancient Egyptian civilization lasted for more than 3000 years, longer than any other civilization in human history. Ancient Egypt depended on the waters of the River Nile, which flows through harsh and arid desert. Egyptians were able to cultivate only the land on the banks of the Nile to support life. The rest of Egypt was, and is, desert. The Nile gave the civilization of Egypt its life.",
      "The ancient Egyptians were among the first people to develop a system of writing. They believed it was significant to write down what was happening. The best-known of the systems of Egyptian writing (there were more than three) is the system using hieroglyphs, a mixture of pictures and 'glyphs' or symbols.",
      "Egyptians believed that there was life after death, so they preserved and buried a dead person's body in a tomb with his / her possessions. They did this so that the dead person could use them in the life after death.",
      "Kings or the pharaohs as well as queens ruled Egypt. There were two kingdoms in Egypt. While the land in Lower Egypt was richer and more fertile, most of the land in Upper Egypt was dry desert."
    ],
    vocabulary: [
      { term: "last", meaning: "sürmek, devam etmek", partOfSpeech: "v" },
      { term: "ancient", meaning: "antik, eski", partOfSpeech: "adj" },
      { term: "civilization", meaning: "uygarlık, medeniyet", partOfSpeech: "n" },
      { term: "depend on", meaning: "bağlı olmak, bel bağlamak, inanmak, güvenmek", partOfSpeech: "v" },
      { term: "harsh", meaning: "katı, sıkı, sert", partOfSpeech: "adj" },
      { term: "arid", meaning: "kurak, çorak", partOfSpeech: "adv" },
      { term: "cultivate", meaning: "ekip biçmek, toprağı işlemek", partOfSpeech: "v" },
      { term: "bank", meaning: "kıyı, yaka", partOfSpeech: "n" },
      { term: "support", meaning: "destek olmak", partOfSpeech: "v" },
      { term: "among", meaning: "arasında", partOfSpeech: "prep" },
      { term: "develop", meaning: "geliştirmek", partOfSpeech: "v" },
      { term: "significant", meaning: "önemli", partOfSpeech: "adj" },
      { term: "preserve", meaning: "korumak, muhafaza etmek", partOfSpeech: "v" },
      { term: "bury", meaning: "gömmek", partOfSpeech: "v" },
      { term: "tomb", meaning: "mezar, lahit, türbe", partOfSpeech: "n" },
      { term: "possessions", meaning: "mal mülk, eşya", partOfSpeech: "n pl." },
      { term: "as well as", meaning: "yanı sıra", partOfSpeech: "conj" },
      { term: "so that", meaning: "-sın diye (amaç)", partOfSpeech: "conj" },
      { term: "while", meaning: "-se de, -e karşın, -e rağmen, iken (zıtlık)", partOfSpeech: "conj" },
      { term: "rule", meaning: "hüküm sürmek, egemen olmak", partOfSpeech: "v" },
      { term: "fertile", meaning: "verimli, bereketli", partOfSpeech: "adj" },
      { term: "land", meaning: "arazi, toprak", partOfSpeech: "n" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "Which of the following is FALSE according to paragraph 1?",
        options: [
          "A) Much of Egypt was arid land.",
          "B) The Nile was significant for Egyptians.",
          "C) Egypt is the oldest civilization in history."
        ],
        answer: "C"
      },
      {
        id: 2,
        question: "The underlined pronoun \"its\" in paragraph 1 refers to ----.",
        options: [
          "A) Egypt",
          "B) The Nile",
          "C) desert"
        ],
        answer: "A"
      },
      {
        id: 3,
        question: "We can understand from paragraph 2 that ----.",
        options: [
          "A) Egyptians developed the first ever writing system",
          "B) some other civilizations had writing systems",
          "C) it was difficult to record history at the time"
        ],
        answer: "B"
      },
      {
        id: 4,
        question: "According to paragraph 3, Egyptians buried people's belongings with them since ----.",
        options: [
          "A) the Pharaohs wanted them to do so",
          "B) they believed people would continue to live",
          "C) they were afraid thieves could steal them"
        ],
        answer: "B"
      },
      {
        id: 5,
        question: "The underlined word 'ruled' in paragraph 4 is closest in meaning to ----.",
        options: [
          "A) reigned",
          "B) ignored",
          "C) confirmed"
        ],
        answer: "A"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "This soil is highly ... and perfect for growing wheat.",
        options: ["A) fertile", "B) divine", "C) majestic"],
        answer: "A"
      },
      {
        id: 2,
        question: "The invention of the wheel was a ... milestone for humanity.",
        options: ["A) fertile", "B) remarkable", "C) divine"],
        answer: "B"
      },
      {
        id: 3,
        question: "Historians use old documents to ... historical events.",
        options: ["A) record", "B) worship", "C) last"],
        answer: "A"
      },
      {
        id: 4,
        question: "Ancient people used to ... the sun as a deity.",
        options: ["A) worship", "B) last", "C) record"],
        answer: "A"
      },
      {
        id: 5,
        question: "The Taj Mahal is a ... monument made of white marble.",
        options: ["A) majestic", "B) fertile", "C) divine"],
        answer: "A"
      }
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 11,
    title: "The Legend of Bruce Lee",
    cefr: "B2",
    theme: "Past Simple Narrative",
    paragraphs: [
      "Bruce Lee was born in 1940. His father was a comedian in the Chinese opera and an actor in Cantonese films. When Bruce was born, Mr. and Mrs. Lee were on tour with the opera company in the United States. His mother was a housewife. A nurse at the hospital gave him the name \"Bruce\". In the beginning, he did not like this name, but when he began to study at secondary school, he started to use it.",
      "Lee went to high school in Washington. There, he worked as a part time waiter in a restaurant. He needed to work because his family had financial problems when he was in high school. After high school, he started studying philosophy. While he was a student, he also taught the Wing Chun style of martial arts. During the years when he was at university, Lee met his future wife Linda Emery. After he graduated from university, he opened his own martial-arts school in Seattle.",
      "Bruce Lee's first film was The Birth of Mankind. He appeared in this film in 1946, when he was only six years old. He appeared in about 20 films as a child actor. Later in the 1960s, Bruce started to make his own movies. He made three very successful films with director Raymond Chow. The names of these films were The Big Boss, Fist of Fury and The Way of the Dragon. His last film was Enter the Dragon and it made more than 200 million US dollars. It was the most successful film he made. Many people liked it so much because the fight scenes were very exciting. Shortly before the release of this film, he died at the age of 33."
    ],
    vocabulary: [
      { term: "when", meaning: "-dığında, -dığı zaman", partOfSpeech: "conj" },
      { term: "while", meaning: "iken", partOfSpeech: "conj" },
      { term: "on tour", meaning: "turnede", partOfSpeech: "adv" },
      { term: "martial arts", meaning: "dövüş sporu, dövüş sanatları", partOfSpeech: "n" },
      { term: "in the beginning", meaning: "başlangıçta, başlarda", partOfSpeech: "adv" },
      { term: "during", meaning: "boyunca, süresince, sırasında, esnasında", partOfSpeech: "prep" },
      { term: "as", meaning: "olarak", partOfSpeech: "prep" },
      { term: "own", meaning: "kendinin, kendisinin", partOfSpeech: "adj" },
      { term: "after", meaning: "sonra", partOfSpeech: "conj" },
      { term: "scene", meaning: "sahne", partOfSpeech: "n" },
      { term: "graduate", meaning: "mezun olmak", partOfSpeech: "v" },
      { term: "release", meaning: "piyasaya sürmek / çıkarmak", partOfSpeech: "n" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "Which of the following is TRUE according to paragraph 1?",
        options: [
          "A) Both Bruce's parents were actors.",
          "B) Bruce always disliked his name.",
          "C) Bruce used his name in secondary school."
        ],
        answer: "C"
      },
      {
        id: 2,
        question: "According to paragraph 2, Bruce had to start working since ----.",
        options: [
          "A) he wanted to earn his own money",
          "B) his parents didn't have enough money",
          "C) he needed money to study at university"
        ],
        answer: "B"
      },
      {
        id: 3,
        question: "According to paragraph 2, when he was at university, Bruce ----.",
        options: [
          "A) attended a course on martial arts",
          "B) decided to set up his own business",
          "C) gave training to people on Wing Chung"
        ],
        answer: "C"
      },
      {
        id: 4,
        question: "According to paragraph 3, before Bruce made his own movies, he ----.",
        options: [
          "A) acted in films as a child actor",
          "B) worked with many famous directors",
          "C) was the assistant of Raymond Chow"
        ],
        answer: "A"
      },
      {
        id: 5,
        question: "We can understand from paragraph 3 that ----.",
        options: [
          "A) Bruce made 200 million dollars out of all his films",
          "B) Bruce's last film was more popular than the others",
          "C) Bruce was unable to complete his last film"
        ],
        answer: "C"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "Choose the correct connector: '... I had finished high school, I found a job.'",
        options: ["A) While", "B) After", "C) Before"],
        answer: "B"
      },
      {
        id: 2,
        question: "Choose the correct word: 'I graduated ... university in 1995.'",
        options: ["A) at", "B) from", "C) for"],
        answer: "B"
      },
      {
        id: 3,
        question: "Complete the sentence: 'I work ... a teacher ... English Reading.'",
        options: ["A) like / from", "B) as / at", "C) with / to"],
        answer: "B"
      },
      {
        id: 4,
        question: "Choose the correct preposition: '... the summer, I worked part-time.'",
        options: ["A) When", "B) During", "C) While"],
        answer: "B"
      },
      {
        id: 5,
        question: "The opposite of 'the end' or 'the release' in terms of starting is...",
        options: ["A) after", "B) before", "C) beginning"],
        answer: "C"
      }
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 12,
    title: "My Amazing Holidays: Peru and China",
    cefr: "A2",
    theme: "Comparatives & Superlatives",
    paragraphs: [
      "I just visited Machu Picchu in Peru. It was the best holiday ever! It took four days to climb to the top of the mountain and I was very tired when we finished. But the old Inca city looked much more beautiful than the photos you see in magazines or on TV! At first it was quiet because there weren't many people around; we watched the sunrise and the city looked very mysterious. Then the train arrived, and it got much busier and noisier with lots of tourists taking photos. I took lots of photos too!",
      "And last week I went to Shanghai. It was amazing! It's huge: in fact, it's the largest city in China with a population of 19 million. We stayed in a hotel in the Bund, the old part of the city, and saw the older, more traditional houses built by the French. Then we visited the newer part of the city and went up the Oriental Pearl Tower. This was the tallest building in Shanghai. However, now there's an even taller one! Yesterday, I bought lots of clothes. They were much cheaper than in London and are all famous designer names!"
    ],
    vocabulary: [
      { term: "visit", meaning: "ziyaret etmek", partOfSpeech: "v" },
      { term: "Shanghai", meaning: "Şangay", partOfSpeech: "n" },
      { term: "Peru", meaning: "Peru", partOfSpeech: "n" },
      { term: "huge", meaning: "büyük, kocaman, iri", partOfSpeech: "adj" },
      { term: "mountain", meaning: "dağ", partOfSpeech: "n" },
      { term: "population", meaning: "nüfus", partOfSpeech: "n" },
      { term: "old", meaning: "yaşlı; eski", partOfSpeech: "adj" },
      { term: "million", meaning: "milyon", partOfSpeech: "n" },
      { term: "look", meaning: "gibi gözükmek", partOfSpeech: "v" },
      { term: "hotel", meaning: "otel", partOfSpeech: "n" },
      { term: "photo", meaning: "fotoğraf", partOfSpeech: "n" },
      { term: "part", meaning: "kısım, parça", partOfSpeech: "n" },
      { term: "magazine", meaning: "dergi", partOfSpeech: "n" },
      { term: "traditional", meaning: "geleneksel", partOfSpeech: "adj" },
      { term: "quiet", meaning: "sessiz", partOfSpeech: "adj" },
      { term: "French", meaning: "Fransız", partOfSpeech: "adj" },
      { term: "sunrise", meaning: "gün doğumu", partOfSpeech: "n" },
      { term: "tower", meaning: "kule", partOfSpeech: "n" },
      { term: "mysterious", meaning: "gizemli", partOfSpeech: "adj" },
      { term: "tall", meaning: "uzun", partOfSpeech: "adj" },
      { term: "then", meaning: "daha sonra, (ondan) sonra", partOfSpeech: "adv" },
      { term: "building", meaning: "bina", partOfSpeech: "n" },
      { term: "train", meaning: "tren", partOfSpeech: "n" },
      { term: "now", meaning: "şimdi, şu anda", partOfSpeech: "adv" },
      { term: "arrive", meaning: "varmak, ulaşmak", partOfSpeech: "v" },
      { term: "cloth", meaning: "kıyafet", partOfSpeech: "n" },
      { term: "tourist", meaning: "turist", partOfSpeech: "n" },
      { term: "cheap", meaning: "ucuz", partOfSpeech: "adj" },
      { term: "week", meaning: "hafta", partOfSpeech: "n" },
      { term: "famous", meaning: "ünlü", partOfSpeech: "adj" },
      { term: "designer", meaning: "tasarımcı", partOfSpeech: "n" },
      { term: "four", meaning: "dört", partOfSpeech: "adj" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "Which of the following is FALSE according to paragraph 1?",
        options: [
          "A) The city was peaceful at the beginning of the author's trip.",
          "B) The author spent 4 days to reach the peak of the mountain.",
          "C) The photos of the old Inca city is prettier than the city itself."
        ],
        answer: "C"
      },
      {
        id: 2,
        question: "We can understand from paragraph 1 that ----.",
        options: [
          "A) the author got bored at the beginning of his visit",
          "B) the old Inca city is a popular destination for travellers",
          "C) you can only reach the old Inca city by train"
        ],
        answer: "B"
      },
      {
        id: 3,
        question: "According to paragraph 1, the author felt exhausted after his climb as ----.",
        options: [
          "A) it was the highest mountain in Peru",
          "B) it took him a long time to climb",
          "C) the author wasn't used to the climate"
        ],
        answer: "B"
      },
      {
        id: 4,
        question: "It is stated in paragraph 2 that ----.",
        options: [
          "A) Oriental Pearl Tower isn't the tallest structure in Shanghai",
          "B) Shanghai is by far the most crowded city in the world",
          "C) the old part of Shanghai is much bigger than the new part"
        ],
        answer: "A"
      },
      {
        id: 5,
        question: "The underlined pronoun \"one\" in paragraph 2 refers to ------",
        options: [],
        answer: "building",
        openEnded: true
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'huge' is closest in meaning to ----.",
        options: ["A) enormous", "B) traditional", "C) quiet"],
        answer: "A"
      },
      {
        id: 2,
        question: "'tall' is the antonym of the word ----.",
        options: ["A) famous", "B) short", "C) new"],
        answer: "B"
      },
      {
        id: 3,
        question: "'cheap' is the antonym of the word ----.",
        options: ["A) mysterious", "B) huge", "C) expensive"],
        answer: "C"
      },
      {
        id: 4,
        question: "Which of the following is a nationality?",
        options: ["A) French", "B) Peru", "C) mountain"],
        answer: "A"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 13,
    title: "The Life of Doris Lessing",
    cefr: "B1",
    theme: "Past Simple Biography",
    paragraphs: [
      "Doris May Lessing was a British novelist, poet and short story writer. Her parents were both English. They met at the Royal Free Hospital. Her father, Captain Alfred Tayler, was a patient because he had lost his leg in World War I. Her mother, Emily Maude Tayler, was a nurse and took care of him at the hospital.",
      "After they married, Alfred Tayler and his wife moved to Kermanshah, Iran. He started a job there as a worker for the Imperial Bank of Persia. Doris was born there in 1919. Later, the family moved to the British colony of Southern Rhodesia in 1925 to farm sheep.",
      "Lessing studied at the Dominican Convent High School in Salisbury. It was a Roman Catholic school for girls. She left school at the age of 14, and taught herself after that. She left home at 15 and worked as a nurse. She started reading about politics and sociology and began writing around this time. She first sold stories to magazines at the age of 16.",
      "In 1937, Lessing moved to Salisbury to work as a telephone operator. She soon married her first husband, Frank Wisdom. They had two children named John and Jean, before the marriage ended in 1943. After her divorce, Lessing joined the Left Book Club and made new friends. She met her second husband, Gottfried Lessing there. They married soon after she joined the group, and had a child named Peter. This marriage ended in divorce in 1949.",
      "She went to London for her writing career and communist ideals. Lessing left two young children with their father in South Africa. Peter, from her second marriage, went with her. She always felt sorry for her other children, but she had dreams. She didn't want to spend all of her time with young children.",
      "Lessing never liked talking about her private life. Instead, she kept diaries and wrote books about her life. She wrote 55 books of fiction, poetry, and nonfiction during her lifetime. She won the Nobel Prize for literature and many other awards.",
      "During the late 1990s, Lessing started to have some health problems. She couldn't travel and write books for a long time. She died on November 17, 2013, at her home in London at the age of 94."
    ],
    vocabulary: [
      { term: "British", meaning: "İngiliz", partOfSpeech: "adj" },
      { term: "join", meaning: "katılmak", partOfSpeech: "v" },
      { term: "novelist", meaning: "roman yazarı", partOfSpeech: "n" },
      { term: "group", meaning: "grup", partOfSpeech: "n" },
      { term: "poet", meaning: "şair", partOfSpeech: "n" },
      { term: "career", meaning: "kariyer", partOfSpeech: "n" },
      { term: "story", meaning: "hikaye", partOfSpeech: "n" },
      { term: "communist", meaning: "komünist", partOfSpeech: "n" },
      { term: "writer", meaning: "yazar", partOfSpeech: "n" },
      { term: "ideal", meaning: "ideal, amaç", partOfSpeech: "n" },
      { term: "captain", meaning: "kaptan, yüzbaşı", partOfSpeech: "n" },
      { term: "sorry", meaning: "üzgün", partOfSpeech: "adj" },
      { term: "patient", meaning: "hasta", partOfSpeech: "n" },
      { term: "dream", meaning: "hayal, istek", partOfSpeech: "n" },
      { term: "lose", meaning: "kaybetmek", partOfSpeech: "v" },
      { term: "private", meaning: "özel", partOfSpeech: "adj" },
      { term: "leg", meaning: "bacak", partOfSpeech: "n" },
      { term: "instead", meaning: "yerine", partOfSpeech: "adv" },
      { term: "war", meaning: "savaş", partOfSpeech: "n" },
      { term: "keep", meaning: "tutmak, korumak", partOfSpeech: "v" },
      { term: "take care of", meaning: "ilgilenmek, bakmak", partOfSpeech: "phr. v" },
      { term: "diary", meaning: "günlük", partOfSpeech: "n" },
      { term: "marry", meaning: "evlenmek", partOfSpeech: "v" },
      { term: "book", meaning: "kitap", partOfSpeech: "n" },
      { term: "worker", meaning: "işçi", partOfSpeech: "n" },
      { term: "fiction", meaning: "kurgu", partOfSpeech: "n" },
      { term: "Persia", meaning: "İran", partOfSpeech: "n" },
      { term: "poetry", meaning: "şiir", partOfSpeech: "n" },
      { term: "sheep", meaning: "koyun", partOfSpeech: "n" },
      { term: "nonfiction", meaning: "kurgu olmayan", partOfSpeech: "n" },
      { term: "southern", meaning: "güney", partOfSpeech: "adj" },
      { term: "lifetime", meaning: "ömür boyu", partOfSpeech: "n" },
      { term: "Catholic", meaning: "Katolik", partOfSpeech: "adj" },
      { term: "win", meaning: "kazanmak", partOfSpeech: "v" },
      { term: "leave", meaning: "ayrılmak, terk etmek", partOfSpeech: "v" },
      { term: "literature", meaning: "edebiyat", partOfSpeech: "n" },
      { term: "age", meaning: "yaş", partOfSpeech: "n" },
      { term: "award", meaning: "ödül", partOfSpeech: "n" },
      { term: "politics", meaning: "politika", partOfSpeech: "n" },
      { term: "health", meaning: "sağlık", partOfSpeech: "n" },
      { term: "sociology", meaning: "sosyoloji", partOfSpeech: "n" },
      { term: "problem", meaning: "problem", partOfSpeech: "n" },
      { term: "sell", meaning: "satmak", partOfSpeech: "v" },
      { term: "die", meaning: "ölmek", partOfSpeech: "v" },
      { term: "end", meaning: "sonlandırmak, sona erdirmek", partOfSpeech: "v" },
      { term: "November", meaning: "Kasım", partOfSpeech: "n" },
      { term: "divorce", meaning: "boşanma", partOfSpeech: "n" },
      { term: "later", meaning: "daha sonra", partOfSpeech: "adv" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "According to paragraph 1, Alfred Tayler and Emily Maude Tayler met at a hospital because Emily Maude Tayler ----.",
        options: [
          "A) cared for Alfred Tayler",
          "B) had a health problem",
          "C) worked as a doctor"
        ],
        answer: "A"
      },
      {
        id: 2,
        question: "According to paragraph 2, Lessing's parents left Iran in order to ----.",
        options: [
          "A) find better-paid jobs in a big country",
          "B) join a well-known British company",
          "C) raise sheep in another country"
        ],
        answer: "C"
      },
      {
        id: 3,
        question: "The underlined pronoun \"there\" in paragraph 2 refers to ------.",
        options: [],
        answer: "Kermanshah (or Iran)",
        openEnded: true
      },
      {
        id: 4,
        question: "According to paragraph 3, after Lessing left school, she ----.",
        options: [
          "A) started reading about psychology",
          "B) became her own teacher",
          "C) sold her poems to magazines"
        ],
        answer: "B"
      },
      {
        id: 5,
        question: "Which of the following is TRUE according to paragraph 4?",
        options: [
          "A) She had a total of three children from two marriages.",
          "B) Doris got married to Gottfried before they joined the club.",
          "C) Doris's second marriage lasted more than a decade."
        ],
        answer: "A"
      },
      {
        id: 6,
        question: "According to paragraph 5, Doris moved to London to ----.",
        options: [
          "A) follow her dreams",
          "B) join the Left Book Club",
          "C) leave her children"
        ],
        answer: "A"
      },
      {
        id: 7,
        question: "According to paragraph 6, Lessing's books are about ----.",
        options: [
          "A) her private life",
          "B) her diaries",
          "C) her life"
        ],
        answer: "C"
      },
      {
        id: 8,
        question: "The underlined word 'awards' in paragraph 6 is closest in meaning to ----.",
        options: [
          "A) benefits",
          "B) rewards",
          "C) offers"
        ],
        answer: "B"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "Which of the following is related to literature?",
        options: ["A) fiction", "B) divorce", "C) sheep"],
        answer: "A"
      },
      {
        id: 2,
        question: "'sorry' is closest in meaning to ----.",
        options: ["A) sad", "B) private", "C) famous"],
        answer: "A"
      },
      {
        id: 3,
        question: "'later' is related to ----.",
        options: ["A) place", "B) time", "C) people"],
        answer: "B"
      },
      {
        id: 4,
        question: "'win' is the antonym of the word ----.",
        options: ["A) lose", "B) keep", "C) marry"],
        answer: "A"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 14,
    title: "The Story of the Olympic Games",
    cefr: "A2",
    theme: "Past Simple & History",
    paragraphs: [
      "The Olympic Games are an international sports competition. Over one billion people watch the games on TV. They happen every four years in a different city. Thousands of athletes from all over the world play games in individual sports like athletics and team sports like football.",
      "People had the first Olympic Games at Olympia, in Greece in 776 B.C. They were called the ancient games. The Olympic Games started because the Greeks wanted to show respect and love for the god Zeus. At that time, only Greek men could join the games. The games consisted of sports like wrestling, boxing, the pentathlon and horse racing. The last event of the games was usually a chariot race.",
      "When the Romans went to Greece in 140 B.C., the games started to lose their religious meaning. People became more interested in having fun and forgot about their god during the games. So, in 393 A.D. the Roman emperor stopped the event. The modern games began in 1896. The Frenchman Pierre de Coubertin started the games to bring peace and friendship to the young people all over the world.",
      "Now, the Olympic Games begin with a ceremony. Athletes from many different countries march into the stadium. Greece comes in first and leads the athletes of other countries, because it was the first country to hold the Olympics."
    ],
    vocabulary: [
      { term: "international", meaning: "uluslararası", partOfSpeech: "adj" },
      { term: "competition", meaning: "yarışma, müsabaka", partOfSpeech: "n" },
      { term: "individual", meaning: "bireysel", partOfSpeech: "adj" },
      { term: "ancient", meaning: "antik, eski", partOfSpeech: "adj" },
      { term: "respect", meaning: "saygı, hürmet", partOfSpeech: "n" },
      { term: "join", meaning: "katılmak", partOfSpeech: "v" },
      { term: "peace", meaning: "barış", partOfSpeech: "n" },
      { term: "wrestling", meaning: "güreş", partOfSpeech: "n" },
      { term: "boxing", meaning: "boks", partOfSpeech: "n" },
      { term: "religious", meaning: "dini", partOfSpeech: "adj" },
      { term: "meaning", meaning: "anlam", partOfSpeech: "n" },
      { term: "emperor", meaning: "imparator", partOfSpeech: "n" },
      { term: "event", meaning: "organizasyon, müsabaka", partOfSpeech: "n" },
      { term: "march", meaning: "düzenli adımlarla yürümek, ilerlemek", partOfSpeech: "v" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "According to paragraph 1, the Olympic Games ----.",
        options: [
          "A) take place in the same city most of the time",
          "B) finish at the end of four years",
          "C) have sports activities with one or more people",
          "D) are only popular among athletes"
        ],
        answer: "C"
      },
      {
        id: 2,
        question: "In the first Olympic Games ----.",
        options: [
          "A) chariot races were at the beginning",
          "B) people did not use any animals in sports",
          "C) people prayed to the god Zeus together",
          "D) women could not enter competitions"
        ],
        answer: "D"
      },
      {
        id: 3,
        question: "The Roman Emperor ended the games in 393 A.D. because ----.",
        options: [
          "A) people stopped showing love and respect to their god",
          "B) he was not interested in Olympic sports anymore",
          "C) the Olympics became less popular after some time",
          "D) the Romans did not believe in the Greek god and religion"
        ],
        answer: "A"
      },
      {
        id: 4,
        question: "In the ceremony, only Greek athletes can ----.",
        options: [
          "A) lift the Olympic flag",
          "B) walk first into the stadium",
          "C) bring the fire from a town",
          "D) carry the Olympic rings"
        ],
        answer: "B"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'team' is the antonym of the word ----.",
        options: ["A) respect", "B) individual", "C) event"],
        answer: "B"
      },
      {
        id: 2,
        question: "'old' is closest in meaning to ----.",
        options: ["A) ancient", "B) international", "C) religious"],
        answer: "A"
      },
      {
        id: 3,
        question: "Which of the following is related to people?",
        options: ["A) meaning", "B) emperor", "C) event"],
        answer: "B"
      },
      {
        id: 4,
        question: "'walk' is closest in meaning to ----.",
        options: ["A) competition", "B) join", "C) march"],
        answer: "C"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 15,
    title: "The Burning Man Festival",
    cefr: "A2",
    theme: "Past Simple & Time Sequence",
    paragraphs: [
      "Burning Man is a festival that happens every year at Black Rock Desert in northern Nevada. It lasts a week, and it starts on the last Monday in August, and ends on the first Monday in September. The festival is called Burning Man because people set a large wood sculpture of a man on fire on Saturday. Many people go to Burning Man; in 2012 over 55,000 people were there. The Black Rock Desert is not close to any cities or towns, and is very dry, so people bring their own water, food, and shelter.",
      "Burning Man started in 1986 in San Francisco. An artist named Larry Harvey made a 2.7 meter wooden sculpture of a man, and decided to burn it on a nearby beach. It was a success, so he did it again at the beach the next year, and then again a couple years after that. Each year the sculpture got bigger. In 1987 \"the Man\" was almost 4.6 meters tall, and in 1989 it was almost 12 meters tall. In 1990, the police stopped Harvey from burning the Man because Harvey did not have a permit. Harvey decided to take the sculpture to the desert to burn it. After that, the festival started to take place in that desert.",
      "The desert was not a good place for a festival, though. It was too big and dangerous. Some people even got lost during the festival. A man called Michael Mike was worried about this situation, so he started a group named the Black Rock Rangers to keep people safe. In 1991, Harvey got a permit from the Bureau of Land Management to hold the festival. The festival was becoming more popular every year. In 1991 about 250 people were there. In 1995 about 4,000 people were there, and in 1997 it was about 10,000. In 2000 attendance was about 25,000, and by 2010 it had reached over 50,000 people. Today, the festival is very large with many people, so sometimes it is called Black Rock City."
    ],
    vocabulary: [
      { term: "last", meaning: "sürmek, devam etmek", partOfSpeech: "v" },
      { term: "end", meaning: "sona ermek, bitmek", partOfSpeech: "v" },
      { term: "sculpture", meaning: "heykel", partOfSpeech: "n" },
      { term: "permit", meaning: "izin, ruhsat", partOfSpeech: "n" },
      { term: "desert", meaning: "çöl", partOfSpeech: "n" },
      { term: "attendance", meaning: "katılım", partOfSpeech: "n" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "The festival gets its name from a ----.",
        options: [
          "A) desert",
          "B) man",
          "C) sculpture",
          "D) city"
        ],
        answer: "C"
      },
      {
        id: 2,
        question: "Which one of the following is TRUE according to paragraph 1?",
        options: [
          "A) The festival begins on the second Monday in August.",
          "B) People can find their basic needs in the festival area.",
          "C) 55,000 people go to the festival every year.",
          "D) The festival area is far from the city center."
        ],
        answer: "D"
      },
      {
        id: 3,
        question: "Larry Harvey took the sculpture to the desert because ----.",
        options: [
          "A) the police didn't let him burn it on the beach",
          "B) it looked more beautiful in the desert",
          "C) it was too tall to keep on the beach",
          "D) the beach wasn't big enough for the festival"
        ],
        answer: "A"
      },
      {
        id: 4,
        question: "The Black Rock Rangers ----.",
        options: [
          "A) help Mike to burn the sculpture",
          "B) try to save people from danger",
          "C) want to change the festival place",
          "D) work with the police for safety"
        ],
        answer: "B"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'continue' is closest in meaning to ----.",
        options: ["A) last", "B) end", "C) desert"],
        answer: "A"
      },
      {
        id: 2,
        question: "'finish' is closest in meaning to ----.",
        options: ["A) sculpture", "B) attendance", "C) end"],
        answer: "C"
      },
      {
        id: 3,
        question: "People set a large wooden sculpture of a man ---- fire.",
        options: ["A) on", "B) in", "C) at"],
        answer: "A"
      },
      {
        id: 4,
        question: "Mike was worried ---- the dangerous situation in the desert.",
        options: ["A) about", "B) towards", "C) for"],
        answer: "A"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 16,
    title: "The Life of Nelson Mandela",
    cefr: "B1",
    theme: "Past Simple Biography & Could",
    paragraphs: [
      "Nelson Mandela was born on July 18, 1918, in South Africa. He had thirteen sisters and brothers by the same father, but by different mothers. He was a member of the Thembu royal family. His father died when he was nine. He was the first member of his family to go to a school. He started to study at Fort Hare University. He met two people there. One was Oliver Tambo and the other was Kaiser 'K.D.' Matanzima. They soon became very close friends and their friendship changed their lives. They were all interested in politics and tried hard to create a better world together.",
      "In 1941 Mandela joined a student protest. He protested against the inequality between the black and white people in South Africa. After this event, his university stopped him from going to classes. At that time, black people could not do the same things as white people. White people could send their children to good schools, live in safe neighborhoods in the city and go to hospitals with good doctors and nurses, but black people could do none of these. Most of them lived in the countryside; very few could live in the city. Their hospitals and schools were not in good condition. They could not sit at the front of a public bus, own a land in white areas, use the public toilets for white people, buy a house or vote. They could become teachers, doctors or lawyers, but they could not work with white people. For example, a black doctor could only treat black people or a black teacher could only teach black students. White and black people could not marry each other. They lived separate lives. Nelson Mandela worked hard to end this situation. In 1964, the police took Mandela to prison. He stayed there for 26 years of his life until 1990. After he was set free, in 1993, he received the Nobel Peace Prize for his work fighting against inequality between black and white people. In 1994, he became the first black South African president.",
      "As president, Mandela earned a lot of money, but he still lived a simple life and donated lots of money to charity, especially his own charity - the Nelson Mandela Children's Fund. He retired in 1999 and had some health problems. In March 2013, Mandela went to hospital because of a lung disease, but he recovered and left the hospital in September. On December 5, 2013, Mandela died at the age of 95. People all around the world felt sorry about his death. They came together at his funeral and promised to remember him and his ideas forever."
    ],
    vocabulary: [
      { term: "member", meaning: "üye", partOfSpeech: "n" },
      { term: "situation", meaning: "durum", partOfSpeech: "n" },
      { term: "royal", meaning: "asil, kraliyet ailesinden", partOfSpeech: "adj" },
      { term: "police", meaning: "polis", partOfSpeech: "n" },
      { term: "friendship", meaning: "arkadaşlık", partOfSpeech: "n" },
      { term: "prison", meaning: "hapishane", partOfSpeech: "n" },
      { term: "create", meaning: "oluşturmak, yaratmak", partOfSpeech: "v" },
      { term: "stay", meaning: "kalmak", partOfSpeech: "v" },
      { term: "protest", meaning: "protesto", partOfSpeech: "n" },
      { term: "free", meaning: "özgür", partOfSpeech: "adj" },
      { term: "protest", meaning: "protesto yapmak, itiraz etmek, karşı çıkmak", partOfSpeech: "v" },
      { term: "receive", meaning: "almak, teslim almak", partOfSpeech: "v" },
      { term: "inequality", meaning: "eşitsizlik", partOfSpeech: "n" },
      { term: "peace", meaning: "barış", partOfSpeech: "n" },
      { term: "black", meaning: "siyah", partOfSpeech: "adj" },
      { term: "president", meaning: "başkan, başbakan", partOfSpeech: "n" },
      { term: "white", meaning: "beyaz", partOfSpeech: "adj" },
      { term: "earn", meaning: "kazanmak", partOfSpeech: "v" },
      { term: "event", meaning: "olay", partOfSpeech: "n" },
      { term: "simple", meaning: "basit, sade", partOfSpeech: "adj" },
      { term: "stop", meaning: "durdurmak, engellemek", partOfSpeech: "v" },
      { term: "donate", meaning: "bağışlamak", partOfSpeech: "v" },
      { term: "send", meaning: "göndermek", partOfSpeech: "v" },
      { term: "charity", meaning: "hayır kuruluşu", partOfSpeech: "n" },
      { term: "condition", meaning: "durum", partOfSpeech: "n" },
      { term: "retire", meaning: "emekli olmak", partOfSpeech: "v" },
      { term: "own", meaning: "sahip olmak", partOfSpeech: "v" },
      { term: "lung", meaning: "akciğer", partOfSpeech: "n" },
      { term: "land", meaning: "toprak", partOfSpeech: "n" },
      { term: "disease", meaning: "hastalık", partOfSpeech: "n" },
      { term: "public", meaning: "halka açık, kamusal", partOfSpeech: "adj" },
      { term: "recover", meaning: "iyileşmek", partOfSpeech: "v" },
      { term: "vote", meaning: "oy vermek", partOfSpeech: "v" },
      { term: "death", meaning: "ölüm", partOfSpeech: "n" },
      { term: "lawyer", meaning: "avukat", partOfSpeech: "n" },
      { term: "funeral", meaning: "cenaze", partOfSpeech: "n" },
      { term: "marry", meaning: "evlenmek", partOfSpeech: "v" },
      { term: "promise", meaning: "söz vermek, vaat etmek", partOfSpeech: "v" },
      { term: "separate", meaning: "ayrı, farklı", partOfSpeech: "adj" },
      { term: "idea", meaning: "fikir", partOfSpeech: "n" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "According to paragraph 1, Mandela was different from the rest of his family because he ----.",
        options: [
          "A) wanted to leave home and live on his own",
          "B) was the first person to receive an education",
          "C) was much more successful and hardworking"
        ],
        answer: "B"
      },
      {
        id: 2,
        question: "We can understand from paragraph 1 that Mandela, Tambo and Matanzima ----.",
        options: [
          "A) worked together to achieve their goals",
          "B) were all members of the royal family",
          "C) enjoyed their time at university"
        ],
        answer: "A"
      },
      {
        id: 3,
        question: "It is stated in paragraph 2 that Mandela was made to end his university education since he ----.",
        options: [
          "A) protested the university",
          "B) failed to pass the final exam",
          "C) took part in a demonstration"
        ],
        answer: "C"
      },
      {
        id: 4,
        question: "The underlined word 'own' in paragraph 2 is closest in meaning to ----.",
        options: [
          "A) have",
          "B) rent",
          "C) sell"
        ],
        answer: "A"
      },
      {
        id: 5,
        question: "Which of the following is FALSE about black people in paragraph 2?",
        options: [
          "A) They could get married only to black people.",
          "B) Great majority of them lived in rural areas.",
          "C) They weren't allowed to have a profession."
        ],
        answer: "C"
      },
      {
        id: 6,
        question: "It is stated in paragraph 2 that Mandela ----.",
        options: [
          "A) received a prize when he was in prison",
          "B) stayed in jail for more than two decades",
          "C) was the first president of South Africa"
        ],
        answer: "B"
      },
      {
        id: 7,
        question: "The underlined word 'donated' in paragraph 3 is closest in meaning to ----.",
        options: [
          "A) promised",
          "B) lent",
          "C) gave"
        ],
        answer: "C"
      },
      {
        id: 8,
        question: "Which of the following is TRUE according to paragraph 3?",
        options: [
          "A) Mandela was unable to become healthy until his death.",
          "B) People from different countries joined Mandela's funeral.",
          "C) Mandela stayed in hospital for a year due to his illness."
        ],
        answer: "B"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'recover' is closest in meaning to ----.",
        options: ["A) get worse", "B) get better", "C) get lost"],
        answer: "B"
      },
      {
        id: 2,
        question: "'marry' is the antonym of the word ----.",
        options: ["A) recover", "B) retire", "C) divorce"],
        answer: "C"
      },
      {
        id: 3,
        question: "Which of the following is related to illness?",
        options: ["A) funeral", "B) friendship", "C) disease"],
        answer: "C"
      },
      {
        id: 4,
        question: "'donate' is closest in meaning to ----.",
        options: ["A) give", "B) lend", "C) sell"],
        answer: "A"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 17,
    title: "Volkswagen Overtakes Toyota",
    cefr: "B2",
    theme: "Present Perfect & Business News",
    paragraphs: [
      "German automobile-maker Volkswagen (VW) has recently overtaken Toyota to become the world's largest car manufacturer. VW, which also produces Audi, Porsche and Skoda cars produced 10.3 million cars last year, about a hundred thousand more than its Japanese rival. American carmaker General Motors followed Toyota. Toyota has dominated the car market over the last decade but failed to take the lead. Its brief domination has been partly because VW has been involved in a diesel emissions scandal for the past few years. Most of the increase in VW's sales comes from Europe and the Chinese market. In China, VW has sold almost 4 million vehicles. However, sales in the United States and Latin American countries have dropped.",
      "The German carmaker has undergone turbulent times during the last few years. Yet, it has managed to stabilize its sales. It wants to earn back the trust of its customers, particularly in the United States. That's why, a short time ago Volkswagen agreed to pay billions of dollars in compensation for installing the software that showed wrong emission data in diesel vehicles. Meanwhile, Toyota has stated that its primary goal has never been to become the world's largest car producer. According to a spokesperson, it has always aimed to make good cars."
    ],
    vocabulary: [
      { term: "overtake", meaning: "sollamak, geçmek, arkada bırakmak", partOfSpeech: "v" },
      { term: "particularly", meaning: "özellikle", partOfSpeech: "adv" },
      { term: "rival", meaning: "rakip, hasım, muhalif", partOfSpeech: "n" },
      { term: "compensation", meaning: "tazminat, telafi, karşılama", partOfSpeech: "n" },
      { term: "be involved in", meaning: "dahil olmak, karışmak", partOfSpeech: "v" },
      { term: "meanwhile", meaning: "bu sırada, bu arada", partOfSpeech: "adv" },
      { term: "vehicle", meaning: "araç, taşıt, vasıta", partOfSpeech: "n" },
      { term: "state", meaning: "ifade etmek, belirtmek, bildirmek, söylemek", partOfSpeech: "v" },
      { term: "drop", meaning: "düşmek, azalmak", partOfSpeech: "v" },
      { term: "primary", meaning: "başlıca, birincil, ana, temel", partOfSpeech: "adj" },
      { term: "undergo", meaning: "çekmek (sıkıntı, hastalık, vb.), -e uğramak, başa gelmek", partOfSpeech: "v" },
      { term: "goal", meaning: "hedef, amaç", partOfSpeech: "n" },
      { term: "turbulent", meaning: "kargaşalı, çalkantılı, problemli", partOfSpeech: "adj" },
      { term: "according to", meaning: "-e göre", partOfSpeech: "prep" },
      { term: "manage to", meaning: "başarmak, muvaffak olmak", partOfSpeech: "v" },
      { term: "aim", meaning: "amaçlamak, hedeflemek", partOfSpeech: "v" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "It is clearly stated in paragraph 1 that the most successful car maker is ----.",
        options: [
          "A) Volkswagen",
          "B) Toyota",
          "C) General Motors"
        ],
        answer: "A"
      },
      {
        id: 2,
        question: "The underlined pronoun 'Its' in paragraph 1 refers to ----.",
        options: [
          "A) Volkswagen's",
          "B) General Motors'",
          "C) Toyota's"
        ],
        answer: "C"
      },
      {
        id: 3,
        question: "According to paragraph 1, Toyota has taken control of the market for ten years due in part to the ----.",
        options: [
          "A) dramatic changes in buyer's spending habits",
          "B) damage to the reputation of Volkswagen",
          "C) efficient policies the company has implemented"
        ],
        answer: "B"
      },
      {
        id: 4,
        question: "According to paragraph 1, much of the growth in the sales of VW vehicles stems from the ones in ----.",
        options: [
          "A) the USA and Latin American countries",
          "B) Europe and China"
        ],
        answer: "B"
      },
      {
        id: 5,
        question: "According to paragraph 2, Volkswagen paid a huge amount of money in order to ----.",
        options: [
          "A) regain its reputation among its customers",
          "B) set up a new software in diesel vehicles",
          "C) produce the best cars in the market"
        ],
        answer: "A"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "Which of the following has a negative meaning?",
        options: ["A) turbulent", "B) primary", "C) meanwhile"],
        answer: "A"
      },
      {
        id: 2,
        question: "'overtake' is closest in meaning to ----.",
        options: ["A) follow", "B) pass", "C) stop"],
        answer: "B"
      },
      {
        id: 3,
        question: "'rival' is closest in meaning to ----.",
        options: ["A) partner", "B) competitor", "C) customer"],
        answer: "B"
      },
      {
        id: 4,
        question: "Human activity has had an adverse impact ---- the environment.",
        options: ["A) on", "B) to", "C) for"],
        answer: "A"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 18,
    title: "Biodiversity Under Threat",
    cefr: "B2",
    theme: "Cause & Effect Connectors",
    paragraphs: [
      "An ecosystem's diversity and its health are directly tied together. The web of relationships in a complex environment such as a rainforest means that many species depend on each other. Genetic diversity among individuals in populations better equips organisms to deal with disaster or disease.",
      "Unfortunately, human activity has had an adverse impact on Earth's biodiversity. As the human population grows, so does the amount of land it requires for food. Also, humanity's constantly-growing population requires more land for transportation and housing. As humans convert Amazon rainforests into cropland or harm the natural habitats of many species, the ecosystem's ability to sustain itself decreases. In some cases, some species have faced extinction. For example, humans have been overhunting some fish species and thus their populations have been in rapid decline over the last century.",
      "Modern agriculture has also damaged biodiversity. Farmers around the world have adopted standardized varieties of crops such as bananas, soy, corn, and rice. As farmers replace local varieties by the new standard, the genetic diversity of these species decreases and some useful genes have already disappeared altogether from the population. Ultimately, the species have become less adept at fighting diseases, and the removal of some beneficial genes has hindered their ability to withstand environmental changes."
    ],
    vocabulary: [
      { term: "diversity", meaning: "çeşitlilik", partOfSpeech: "n" },
      { term: "convert", meaning: "dönüştürmek", partOfSpeech: "v" },
      { term: "species", meaning: "tür, türler", partOfSpeech: "n pl." },
      { term: "sustain", meaning: "sürdürmek, muhafaza etmek", partOfSpeech: "v" },
      { term: "depend on", meaning: "bağlı olmak, bel bağlamak, güvenmek, inanmak", partOfSpeech: "n" },
      { term: "extinction", meaning: "nesli tükenme, yok olma", partOfSpeech: "n" },
      { term: "among", meaning: "arasında, içinde", partOfSpeech: "prep" },
      { term: "adopt", meaning: "benimsemek", partOfSpeech: "v" },
      { term: "equip", meaning: "donatmak, teçhiz etmek", partOfSpeech: "v" },
      { term: "thus", meaning: "böylece, bu yüzden", partOfSpeech: "conj" },
      { term: "deal with", meaning: "ele almak, ilgilenmek, baş etmek", partOfSpeech: "v" },
      { term: "ultimately", meaning: "sonunda, sonuçta, nihayetinde", partOfSpeech: "adv" },
      { term: "adverse", meaning: "olumsuz, ters, kötü", partOfSpeech: "adj" },
      { term: "adept", meaning: "becerikli, hünerli, mahir", partOfSpeech: "adj" },
      { term: "impact", meaning: "etki", partOfSpeech: "n" },
      { term: "hinder", meaning: "engellemek, ket vurmak", partOfSpeech: "v" },
      { term: "require", meaning: "ihtiyacı olmak, gerek duymak, gerektirmek", partOfSpeech: "v" },
      { term: "removal", meaning: "ortadan kaldırma, yok etme, çıkarma", partOfSpeech: "n" },
      { term: "as", meaning: "-dıkça, -dikçe", partOfSpeech: "conj" },
      { term: "withstand", meaning: "karşı koymak, direnmek, dayanmak", partOfSpeech: "v" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "One can understand from paragraph 1 that genetic diversity ----.",
        options: [
          "A) is closely associated with ecosystem's well-being",
          "B) prevents species from becoming extinct",
          "C) may cause some species to destroy others"
        ],
        answer: "A"
      },
      {
        id: 2,
        question: "The underlined word 'amount' in paragraph 2 is closest in meaning to ----.",
        options: [
          "A) offer",
          "B) quantity",
          "C) damage"
        ],
        answer: "B"
      },
      {
        id: 3,
        question: "Paragraph 2 is mainly about the ----.",
        options: [
          "A) causes of the mass destruction of the rainforests",
          "B) main reasons why some species become extinct",
          "C) unfavourable effects of human activity on biodiversity"
        ],
        answer: "C"
      },
      {
        id: 4,
        question: "It is clearly stated in paragraph 3 that new farming methods have ----.",
        options: [
          "A) given some harm to genetic diversity",
          "B) helped farmers produce more crops",
          "C) increased the number of diseases"
        ],
        answer: "A"
      },
      {
        id: 5,
        question: "The underlined word 'replace' in paragraph 3 is closest in meaning to ----.",
        options: [
          "A) use",
          "B) need",
          "C) change"
        ],
        answer: "C"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "Which of the following is negative in meaning?",
        options: ["A) diversity", "B) extinction", "C) adept"],
        answer: "B"
      },
      {
        id: 2,
        question: "Which of the following is positive in meaning?",
        options: ["A) extinction", "B) sustain", "C) adverse"],
        answer: "B"
      },
      {
        id: 3,
        question: "'adverse' is closest in meaning to ----.",
        options: ["A) harmful", "B) helpful", "C) natural"],
        answer: "A"
      },
      {
        id: 4,
        question: "Human activity has had an adverse impact ---- the environment.",
        options: ["A) on", "B) in", "C) at"],
        answer: "A"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 19,
    title: "Climbing Mount Everest",
    cefr: "B1",
    theme: "Time Expressions & Sequencing",
    paragraphs: [
      "Mount Everest is the world's highest mountain and it is 8850 meters above sea level. Edmund Hillary and Tenzing Norgay became the first people to reach the top of it in 1953. In 1978, Reinhold Messner and Peter Habeler climbed the mountain without bottled oxygen for the first time. Since people first started climbing, 3100 climbers have made more than 5100 climbs. Two thousand and two hundred have reached the top but almost 200 have lost their lives on the slopes of Mount Everest.",
      "In the 1990s, successful climbers started organising group tours for climbers. It costs about 40,000 Euros to get guides to help during an expedition. Most climbers try climbing Everest during April and May. Climbing is very difficult from December to March because of low temperatures. In June and September, the \"monsoon\" brings storms and a lot of rain and snowfall. A typical journey takes about two months. Climbers often fly to Nepal's capital, Katmandu, and spend a few days there because they need to buy food and clothes, and get travel visas. Then they go to Lukla, a small town at 2800 meters above sea level.",
      "All in all, there are about fifteen different routes to the top of Mount Everest. Climbers use five different camps. Base Camp is located at 5364 meters. During the spring, there are about 300 people with doctors and scientists in the area. After Base Camp, climbers must pass through the Khumbu Icefall. This part is extremely dangerous. Ice has killed many mountaineers. Another dangerous area is Western Cwm, a valley with little wind and too much sunlight. It can be extremely hot and uncomfortable. The last part of the climb is the Hillary Step at 8440 meters above sea level. Only one climber can go up or down at a time. At this point, climbers often lose their concentration because of the very low temperatures and the thin air.",
      "Since 1953, more and more tourists have begun to tour the Himalayas. They have brought the region a lot of money. Today local people have good jobs and there are new hospitals and famous stores in the area, but visitors have also left a lot of waste on the mountain. A lot of trees are cut down every year. Today the government and some organisations are working hard to protect the environment around Everest.",
      "Mount Everest is an extremely dangerous place. Temperatures at the top are around 36 degrees below zero, and storms come up suddenly. The greatest Everest tragedy occurred in 1996, when eight people died in one day. Most people say the disaster happened because of altitude sickness and a sudden storm, but some climbers think that it was the guide's mistake."
    ],
    vocabulary: [
      { term: "high", meaning: "yüksek", partOfSpeech: "adj" },
      { term: "journey", meaning: "seyahat", partOfSpeech: "n" },
      { term: "above", meaning: "yukarıda, üzerinde", partOfSpeech: "prep" },
      { term: "often", meaning: "sıklıkla, genellikle", partOfSpeech: "adv" },
      { term: "sea", meaning: "deniz", partOfSpeech: "n" },
      { term: "visa", meaning: "vize", partOfSpeech: "n" },
      { term: "level", meaning: "seviye", partOfSpeech: "n" },
      { term: "town", meaning: "şehir, kasaba", partOfSpeech: "n" },
      { term: "reach", meaning: "ulaşmak, erişmek", partOfSpeech: "v" },
      { term: "route", meaning: "güzergah, rota", partOfSpeech: "n" },
      { term: "without", meaning: "-meksizin, -siz", partOfSpeech: "prep" },
      { term: "be located", meaning: "bulunmak, yer almak", partOfSpeech: "" },
      { term: "slope", meaning: "eğim, yokuş", partOfSpeech: "n" },
      { term: "spring", meaning: "bahar", partOfSpeech: "n" },
      { term: "successful", meaning: "başarılı", partOfSpeech: "adj" },
      { term: "scientist", meaning: "bilim insanı", partOfSpeech: "n" },
      { term: "climber", meaning: "tırmanıcı", partOfSpeech: "n" },
      { term: "area", meaning: "bölge, alan", partOfSpeech: "n" },
      { term: "organise", meaning: "düzenlemek, organize etmek", partOfSpeech: "v" },
      { term: "pass", meaning: "geçmek", partOfSpeech: "v" },
      { term: "tour", meaning: "tur", partOfSpeech: "n" },
      { term: "extremely", meaning: "son derece, aşırı derecede, çok", partOfSpeech: "adv" },
      { term: "cost", meaning: "mal olmak, değerinde olmak", partOfSpeech: "v" },
      { term: "dangerous", meaning: "tehlikeli", partOfSpeech: "adj" },
      { term: "Euro", meaning: "Avro", partOfSpeech: "n" },
      { term: "mountaineer", meaning: "dağcı", partOfSpeech: "n" },
      { term: "guide", meaning: "rehber", partOfSpeech: "n" },
      { term: "valley", meaning: "vadi", partOfSpeech: "n" },
      { term: "expedition", meaning: "gezi, keşif gezisi", partOfSpeech: "n" },
      { term: "wind", meaning: "rüzgar", partOfSpeech: "n" },
      { term: "April", meaning: "Nisan", partOfSpeech: "n" },
      { term: "sunlight", meaning: "güneş ışığı", partOfSpeech: "n" },
      { term: "May", meaning: "Mayıs", partOfSpeech: "n" },
      { term: "hot", meaning: "sıcak", partOfSpeech: "adj" },
      { term: "December", meaning: "Aralık", partOfSpeech: "n" },
      { term: "uncomfortable", meaning: "rahatsız, rahatsız edici", partOfSpeech: "adj" },
      { term: "March", meaning: "Mart", partOfSpeech: "n" },
      { term: "point", meaning: "nokta", partOfSpeech: "n" },
      { term: "temperature", meaning: "ısı", partOfSpeech: "n" },
      { term: "concentration", meaning: "konsantrasyon, odaklanma", partOfSpeech: "n" },
      { term: "June", meaning: "Haziran", partOfSpeech: "n" },
      { term: "thin", meaning: "ince", partOfSpeech: "adj" },
      { term: "September", meaning: "Eylül", partOfSpeech: "n" },
      { term: "air", meaning: "hava", partOfSpeech: "n" },
      { term: "monsoon", meaning: "muson", partOfSpeech: "n" },
      { term: "region", meaning: "bölge, alan", partOfSpeech: "n" },
      { term: "bring", meaning: "getirmek", partOfSpeech: "v" },
      { term: "local", meaning: "yerli, yerel", partOfSpeech: "adj" },
      { term: "rain", meaning: "yağmur", partOfSpeech: "n" },
      { term: "waste", meaning: "çöp, atık", partOfSpeech: "n" },
      { term: "snowfall", meaning: "kar yağışı", partOfSpeech: "n" },
      { term: "cut down", meaning: "kesmek", partOfSpeech: "phr. v" },
      { term: "typical", meaning: "tipik, normal", partOfSpeech: "adj" },
      { term: "government", meaning: "hükümet", partOfSpeech: "n" },
      { term: "organisation", meaning: "kuruluş, organizasyon", partOfSpeech: "n" },
      { term: "occur", meaning: "meydana gelmek", partOfSpeech: "v" },
      { term: "protect", meaning: "korumak", partOfSpeech: "v" },
      { term: "disaster", meaning: "felaket", partOfSpeech: "n" },
      { term: "environment", meaning: "çevre", partOfSpeech: "n" },
      { term: "altitude", meaning: "irtifa, rakım", partOfSpeech: "n" },
      { term: "below", meaning: "altında, aşağısında", partOfSpeech: "prep" },
      { term: "sickness", meaning: "hastalık", partOfSpeech: "n" },
      { term: "suddenly", meaning: "aniden", partOfSpeech: "adv" },
      { term: "sudden", meaning: "ani", partOfSpeech: "adj" },
      { term: "tragedy", meaning: "trajedi, felaket", partOfSpeech: "n" },
      { term: "mistake", meaning: "hata, yanlışlık", partOfSpeech: "n" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "According to paragraph 1, until 1978 ----.",
        options: [
          "A) Mount Everest was an unpopular place for climbers",
          "B) only one climber tried to climb Mount Everest",
          "C) people used bottled oxygen to climb Mount Everest"
        ],
        answer: "C"
      },
      {
        id: 2,
        question: "The underlined word 'expedition' in paragraph 2 is closest meaning to ----.",
        options: [
          "A) study",
          "B) journey",
          "C) training"
        ],
        answer: "B"
      },
      {
        id: 3,
        question: "We can understand from paragraph 2 that the most suitable time of the year to climb Mount Everest is between ----.",
        options: [
          "A) December and March",
          "B) June and September",
          "C) April and May"
        ],
        answer: "C"
      },
      {
        id: 4,
        question: "According to paragraph 2, people generally stay in Katmandu for a few days in order to ----.",
        options: [
          "A) avoid extreme weather conditions",
          "B) do some shopping for necessary things",
          "C) apply for a visa in a small town called Lukla"
        ],
        answer: "B"
      },
      {
        id: 5,
        question: "We can understand from paragraph 3 that there are some ----.",
        options: [
          "A) specialists during a certain period in the main camp",
          "B) climbers competing with each other in different camps",
          "C) places for climbers to stay if their climb is unsuccessful"
        ],
        answer: "A"
      },
      {
        id: 6,
        question: "The underlined pronoun \"It\" in paragraph 3 refers to -----.",
        options: [],
        answer: "Western Cwm",
        openEnded: true
      },
      {
        id: 7,
        question: "Which of the following is TRUE about the Hillary Step?",
        options: [
          "A) People start their climb there.",
          "B) Climbers' focus get better there.",
          "C) It is the highest part of the climb."
        ],
        answer: "C"
      },
      {
        id: 8,
        question: "It is stated in paragraph 4 that ----.",
        options: [
          "A) tourism in the Himalayas has some pros and cons as well",
          "B) the local people complain about the visitors in the region",
          "C) the government is trying to save the environment on its own"
        ],
        answer: "A"
      },
      {
        id: 9,
        question: "We can understand from paragraph 5 that ----.",
        options: [
          "A) disasters often occur due to the mistakes of careless guides",
          "B) climbing Mount Everest is not risky if climbers are careful",
          "C) people have differing opinions about the tragedy in 1996"
        ],
        answer: "C"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'often' is related to ----.",
        options: ["A) place", "B) time", "C) people"],
        answer: "B"
      },
      {
        id: 2,
        question: "'dangerous' is the antonym of the word ----.",
        options: ["A) safe", "B) uncomfortable", "C) thin"],
        answer: "A"
      },
      {
        id: 3,
        question: "Which of the following is used to talk about a person?",
        options: ["A) climber", "B) scientist", "C) valley"],
        answer: "A"
      },
      {
        id: 4,
        question: "Everest is the world's ---- mountain.",
        options: ["A) highest", "B) high", "C) higher"],
        answer: "A"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 20,
    title: "The Warming Earth",
    cefr: "B1",
    theme: "First Conditional & Environment",
    paragraphs: [
      "The year is 2080, and the world is a very different place. London, New York and many other cities are underwater. The Earth has become a lot warmer. People are fighting because they don't have enough food or clean water. Some illnesses like malaria have become common in Europe, and many of the animals and plants have disappeared forever. This sounds like the story of a Hollywood film, but it could really happen if we keep damaging the environment.",
      "Many things affect the environment, but which ones could cause the biggest problems in the future? Claire Addison, 23, from Edinburgh, works for an organisation called Envision in London. The organisation was started by a group of young adults in 2000. It teaches teenagers about the environment. \"The biggest problem for our planet has been climate change for some time,\" Claire explains. \"Greenhouse gases are causing higher temperatures around the world and this is causing ice to melt and sea levels to rise.\"",
      "We all cause climate change. Lots of our favourite things like mobile phones, televisions and computers need energy to work. Most of this energy comes from burning fossil fuels like coal, oil and natural gas. All these release carbon dioxide, methane and other gases into the air. These greenhouse gases trap the heat from the sun. As a result, the Earth is getting warmer. Also, we throw things away easily. We buy more food than we can eat and use more water than we need. In the last three decades we have cut down 160,000 square kilometres of forest all around the world. This is as large as the size of England and Wales! This is also bad news for animals. Because we are cutting down trees and building new things, animals have almost nowhere to live. Most of us don't know how much we waste and harm the environment.",
      "Our climate has already started to change. In Bangladesh, there have been more storms. Because of these storms, it is now a lot more difficult to grow food crops. Some scientists think the Earth could be six degrees warmer by 2100. That doesn't sound like a lot, but it would have terrible effects. For example, there could be more droughts – not having enough rain and water – and deserts in Australia and Africa.",
      "There are lots of things we can do to save energy and protect the environment. For example, we should unplug our television and laptop when we don't use them or our laptop is charged. We should take a short shower instead of taking a bath. A bath uses about 100 litres of hot water. We should keep our fridge full. Empty fridges need more energy to stay cool. Finally, we shouldn't boil more water than we need. Let's work together, save energy and save the environment!"
    ],
    vocabulary: [
      { term: "underwater", meaning: "su altı", partOfSpeech: "adj" },
      { term: "energy", meaning: "enerji", partOfSpeech: "n" },
      { term: "fight", meaning: "savaşmak, kavga etmek", partOfSpeech: "v" },
      { term: "burn", meaning: "yanmak, yakmak", partOfSpeech: "v" },
      { term: "enough", meaning: "yeterli", partOfSpeech: "adj" },
      { term: "fossil fuel", meaning: "fosil yakıtı", partOfSpeech: "n" },
      { term: "clean", meaning: "temiz", partOfSpeech: "adj" },
      { term: "coal", meaning: "kömür", partOfSpeech: "n" },
      { term: "water", meaning: "su", partOfSpeech: "n" },
      { term: "oil", meaning: "petrol", partOfSpeech: "n" },
      { term: "illness", meaning: "hastalık", partOfSpeech: "n" },
      { term: "natural gas", meaning: "doğal gaz", partOfSpeech: "n" },
      { term: "malaria", meaning: "sıtma", partOfSpeech: "n" },
      { term: "release", meaning: "serbest bırakmak, salmak", partOfSpeech: "v" },
      { term: "common", meaning: "yaygın, ortak", partOfSpeech: "adj" },
      { term: "greenhouse gas", meaning: "sera gazı", partOfSpeech: "n" },
      { term: "plant", meaning: "bitki", partOfSpeech: "n" },
      { term: "trap", meaning: "hapsetmek, yakalamak", partOfSpeech: "v" },
      { term: "disappear", meaning: "ortadan kaybolmak, yok olmak", partOfSpeech: "v" },
      { term: "heat", meaning: "ısı, sıcaklık", partOfSpeech: "n" },
      { term: "forever", meaning: "sonsuza kadar, daima", partOfSpeech: "adv" },
      { term: "sun", meaning: "güneş", partOfSpeech: "n" },
      { term: "sound like", meaning: "gibi gelmek", partOfSpeech: "phr. v" },
      { term: "throw away", meaning: "atmak, çöpe atmak", partOfSpeech: "phr. v" },
      { term: "film", meaning: "film", partOfSpeech: "n" },
      { term: "easily", meaning: "kolay bir şekilde", partOfSpeech: "adv" },
      { term: "really", meaning: "gerçekten", partOfSpeech: "adv" },
      { term: "size", meaning: "boyut", partOfSpeech: "n" },
      { term: "happen", meaning: "meydana gelmek", partOfSpeech: "v" },
      { term: "England", meaning: "İngiltere", partOfSpeech: "n" },
      { term: "damage", meaning: "zarar vermek", partOfSpeech: "v" },
      { term: "Wales", meaning: "Galler", partOfSpeech: "n" },
      { term: "affect", meaning: "etkilemek", partOfSpeech: "v" },
      { term: "bad", meaning: "kötü", partOfSpeech: "adj" },
      { term: "cause", meaning: "sebep olmak", partOfSpeech: "v" },
      { term: "almost", meaning: "neredeyse", partOfSpeech: "adv" },
      { term: "future", meaning: "gelecek", partOfSpeech: "n" },
      { term: "harm", meaning: "zarar vermek", partOfSpeech: "v" },
      { term: "teenager", meaning: "genç, ergen", partOfSpeech: "n" },
      { term: "already", meaning: "zaten, çoktan", partOfSpeech: "adv" },
      { term: "planet", meaning: "gezegen", partOfSpeech: "n" },
      { term: "Bangladesh", meaning: "Bangladeş", partOfSpeech: "n" },
      { term: "climate", meaning: "iklim", partOfSpeech: "n" },
      { term: "storm", meaning: "fırtına", partOfSpeech: "n" },
      { term: "change", meaning: "değişim, değişiklik", partOfSpeech: "n" },
      { term: "grow", meaning: "yetiştirmek, büyütmek", partOfSpeech: "v" },
      { term: "explain", meaning: "açıklamak, izah etmek", partOfSpeech: "v" },
      { term: "crop", meaning: "mahsul, ekin", partOfSpeech: "n" },
      { term: "ice", meaning: "buz", partOfSpeech: "n" },
      { term: "Earth", meaning: "Dünya", partOfSpeech: "n" },
      { term: "melt", meaning: "erimek, eritmek", partOfSpeech: "v" },
      { term: "degree", meaning: "derece", partOfSpeech: "n" },
      { term: "rise", meaning: "yükselmek", partOfSpeech: "v" },
      { term: "terrible", meaning: "kötü, korkunç", partOfSpeech: "adj" },
      { term: "effect", meaning: "etki", partOfSpeech: "n" },
      { term: "shower", meaning: "duş", partOfSpeech: "n" },
      { term: "drought", meaning: "kuraklık", partOfSpeech: "n" },
      { term: "bath", meaning: "banyo", partOfSpeech: "n" },
      { term: "desert", meaning: "çöl", partOfSpeech: "n" },
      { term: "finally", meaning: "sonunda, son olarak", partOfSpeech: "adv" },
      { term: "Australia", meaning: "Avustralya", partOfSpeech: "n" },
      { term: "fridge", meaning: "buzdolabı", partOfSpeech: "n" },
      { term: "Africa", meaning: "Afrika", partOfSpeech: "n" },
      { term: "empty", meaning: "boş", partOfSpeech: "adj" },
      { term: "save", meaning: "korumak, saklamak", partOfSpeech: "v" },
      { term: "cool", meaning: "serin", partOfSpeech: "adj" },
      { term: "unplug", meaning: "fişini çekmek", partOfSpeech: "v" },
      { term: "boil", meaning: "kaynatmak", partOfSpeech: "v" },
      { term: "charge", meaning: "şarj etmek", partOfSpeech: "v" },
      { term: "together", meaning: "birlikte", partOfSpeech: "adv" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "According to paragraph 1, in the year 2080, ----.",
        options: [
          "A) big cities will get even more overpopulated",
          "B) lots of animals and plants will become extinct",
          "C) there will be new deadly diseases in Europe"
        ],
        answer: "B"
      },
      {
        id: 2,
        question: "Why does the author give the example of a Hollywood film at the end of paragraph 1?",
        options: [
          "A) To give an example of how much s / he likes fiction films",
          "B) To warn the government about the potential diseases",
          "C) To emphasize the risks that the Earth may face in future"
        ],
        answer: "C"
      },
      {
        id: 3,
        question: "We can understand from paragraph 2 that the climate change ----.",
        options: [
          "A) is just one of the factors creating problems to the Earth",
          "B) caused young people to establish many organisations",
          "C) is not one of the concerns of the British government"
        ],
        answer: "A"
      },
      {
        id: 4,
        question: "It is stated in paragraph 3 that ----.",
        options: [
          "A) the sun has become the biggest source of climate change",
          "B) many trees have been cut down in England and Wales",
          "C) majority of people are unaware that they harm the nature"
        ],
        answer: "C"
      },
      {
        id: 5,
        question: "It can be inferred from paragraph 3 that ----.",
        options: [
          "A) scientists are working on alternative sources of energy",
          "B) people have become indifferent towards their environment",
          "C) many species of animals have already become extinct"
        ],
        answer: "B"
      },
      {
        id: 6,
        question: "Which of the following is FALSE about the climate change according to paragraph 4?",
        options: [
          "A) There are already more deserts in some parts of the world.",
          "B) The adverse effects of climate change can easily be seen.",
          "C) Farming has become much harder due to climate change."
        ],
        answer: "A"
      },
      {
        id: 7,
        question: "The author's purpose in paragraph 5 is to ----.",
        options: [
          "A) criticise the people using many technological items and thus consuming too much energy",
          "B) warn young people about the harmful effects of wasting water on the environment",
          "C) suggest ways of conserving energy and thus protecting the environment"
        ],
        answer: "C"
      },
      {
        id: 8,
        question: "The underlined word 'unplug' in the passage is closest in meaning to ----.",
        options: [
          "A) switch off",
          "B) take off",
          "C) put off"
        ],
        answer: "A"
      },
      {
        id: 9,
        question: "Which of the following could be the best title for the passage?",
        options: [
          "A) Let's Work Together",
          "B) Earth in Danger",
          "C) Save Your Future"
        ],
        answer: "B"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'terrible' is closest in meaning to ----.",
        options: ["A) awful", "B) pleasant", "C) common"],
        answer: "A"
      },
      {
        id: 2,
        question: "'unplug' is the antonym of the word ----.",
        options: ["A) charge", "B) connect", "C) waste"],
        answer: "B"
      },
      {
        id: 3,
        question: "We should save energy ---- protect the environment.",
        options: ["A) in order to", "B) despite", "C) because of"],
        answer: "A"
      },
      {
        id: 4,
        question: "Which of the following is related to weather?",
        options: ["A) drought", "B) fridge", "C) profession"],
        answer: "A"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 21,
    title: "A Boom in Toy Sales",
    cefr: "B1",
    theme: "Present Perfect & Trends",
    paragraphs: [
      "For the past several years, toy sales have been low. However, this year, sales of toys were huge. That is good news in the toy business. People bought more toys in 2015 than in the previous years. Also, more people found jobs in toy-making companies. That means that now, companies produce more toys than they did last year. Toy shops order more toys now, and some even rent extra offices to put their stock. And every week someone opens a new shop. However, the prices have been the same as last year. People in the toy-selling business say that sales went up more than they had in a long time. They were not going up very much from one year to the next. In fact, they were going down.",
      "The NPD Group is a company that studies the toy business. NPD said that they expect to see the biggest increase in toy sales in at least the past 10 years. There are several reasons for this. Toys that match movies are becoming more and more popular. At the same time, new technology is making toys more advanced. Also, older kids are buying more toys than they used to.",
      "Successful movies have helped companies sell huge numbers of toys. For example, there is the movie \"Frozen.\" It came out in 2014. It tells the story of a princess who sets off to find her sister. \"Frozen\" and its toys were very popular. This helped last year's toy sales. \"In fact, 'Frozen' was the top toy brand last year\", NPD said. Movie-based toys are popular again this year. The 7th movie of the Star Wars series has recently come out. Toy shops have sold hundreds of \"Star Wars\" toys. Some have already finished their stocks and had to order new ones.",
      "New technology is also helping toy sales. Toys are becoming more advanced. For example, a new Barbie doll can talk to kids. Of course you have to pay more for this little doll. \"Smart Bear\" is a small talking teddy bear that helps kids learn. These will continue to be popular says Geoff Walker. Geoff Walker works at a large toy company. He said that technology can get kids more interested. That is harder to do these days. Many kids play games on smartphones. Toys have to be more interesting to be popular for them. New technologies are helping toy companies sell to teenagers. The MM G15 is one of those technological toys. It is a 4-foot-tall robot, it's not small like the others. This huge machine can walk and talk. Kids can build it themselves. It is a toy that many kids might be interested in. Toy companies hope so. They want toy sales to keep going higher."
    ],
    vocabulary: [
      { term: "several", meaning: "birçok, çeşitli", partOfSpeech: "adj" },
      { term: "increase", meaning: "artış", partOfSpeech: "n" },
      { term: "sale", meaning: "satış", partOfSpeech: "n" },
      { term: "match", meaning: "eşleştirmek", partOfSpeech: "v" },
      { term: "however", meaning: "ama, fakat", partOfSpeech: "conj" },
      { term: "popular", meaning: "popüler, sevilen", partOfSpeech: "adj" },
      { term: "previous", meaning: "önceki, önce", partOfSpeech: "adj" },
      { term: "technology", meaning: "teknoloji", partOfSpeech: "n" },
      { term: "find", meaning: "bulmak", partOfSpeech: "v" },
      { term: "advanced", meaning: "ileri, gelişmiş", partOfSpeech: "adj" },
      { term: "make", meaning: "yapmak", partOfSpeech: "v" },
      { term: "number", meaning: "sayı, rakam", partOfSpeech: "n" },
      { term: "produce", meaning: "üretmek, yapmak", partOfSpeech: "v" },
      { term: "princess", meaning: "prenses", partOfSpeech: "n" },
      { term: "order", meaning: "sipariş etmek", partOfSpeech: "v" },
      { term: "set off", meaning: "yola çıkmak, yola koyulmak", partOfSpeech: "phr. v" },
      { term: "rent", meaning: "kiralamak", partOfSpeech: "v" },
      { term: "again", meaning: "tekrar", partOfSpeech: "adv" },
      { term: "office", meaning: "ofis", partOfSpeech: "n" },
      { term: "recently", meaning: "son zamanlarda, geçtiğimiz günlerde", partOfSpeech: "adv" },
      { term: "open", meaning: "açmak", partOfSpeech: "v" },
      { term: "smart", meaning: "akıllı, zeki", partOfSpeech: "adj" },
      { term: "price", meaning: "ücret, fiyat", partOfSpeech: "n" },
      { term: "bear", meaning: "ayı", partOfSpeech: "n" },
      { term: "same", meaning: "aynı", partOfSpeech: "adj" },
      { term: "small", meaning: "küçük", partOfSpeech: "adj" },
      { term: "go up", meaning: "artmak, yukarıya çıkmak", partOfSpeech: "phr. v" },
      { term: "continue", meaning: "devam etmek", partOfSpeech: "v" },
      { term: "next", meaning: "sonraki, bir sonraki", partOfSpeech: "adj" },
      { term: "interested", meaning: "ilgili, meraklı", partOfSpeech: "adj" },
      { term: "brand", meaning: "marka", partOfSpeech: "n" },
      { term: "interesting", meaning: "ilginç, ilgi çekici", partOfSpeech: "adj" },
      { term: "go down", meaning: "azalmak, inmek", partOfSpeech: "phr. v" },
      { term: "machine", meaning: "makine", partOfSpeech: "n" },
      { term: "expect", meaning: "beklemek, ummak", partOfSpeech: "v" },
      { term: "walk", meaning: "yürümek", partOfSpeech: "v" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "According to paragraph 1, there has been no change in the ----.",
        options: [
          "A) volume of toy business",
          "B) number of toy firms",
          "C) prices of toys"
        ],
        answer: "C"
      },
      {
        id: 2,
        question: "According to paragraph 2, which of the following is NOT one of the reasons why there has been an increase in toy sales?",
        options: [
          "A) increasing number of children",
          "B) technological developments",
          "C) the positive effects of films"
        ],
        answer: "A"
      },
      {
        id: 3,
        question: "We can understand from paragraph 3 that ----.",
        options: [
          "A) Frozen was the most successful animation movie in 2014",
          "B) successful movies play a major part in the sales of toys",
          "C) movies have become more successful due to toys"
        ],
        answer: "B"
      },
      {
        id: 4,
        question: "The underlined word 'order' in paragraph 3 is closest in meaning to ----.",
        options: [
          "A) charge",
          "B) adapt",
          "C) buy"
        ],
        answer: "C"
      },
      {
        id: 5,
        question: "The underlined word 'advanced' in paragraph 4 is closest in meaning to ----.",
        options: [
          "A) experienced",
          "B) innovative",
          "C) flexible"
        ],
        answer: "B"
      },
      {
        id: 6,
        question: "What do the technological toys in paragraph 4 have in common?",
        options: [
          "A) They all are costly.",
          "B) They all are huge.",
          "C) They all can talk."
        ],
        answer: "C"
      },
      {
        id: 7,
        question: "Geoff Walker predicts that technological toys will ----.",
        options: [
          "A) keep their fame",
          "B) become smarter",
          "C) be more interesting"
        ],
        answer: "A"
      },
      {
        id: 8,
        question: "The MM G15 is different from the other toys in paragraph 4 because ----.",
        options: [
          "A) it is much more expensive and technological",
          "B) children put its parts together on their own",
          "C) it has been by far the most popular toy so far"
        ],
        answer: "B"
      },
      {
        id: 9,
        question: "Which of the following could be the best title for paragraph 4?",
        options: [
          "A) Toy Companies Are Using More Technology",
          "B) Kids are More Interested in Smartphone Games",
          "C) Dolls, Teddy Bears or Robots: Which is Better?"
        ],
        answer: "A"
      },
      {
        id: 10,
        question: "Which of the following could be the best title for the passage?",
        options: [
          "A) Things Toy Companies Should Be Careful about",
          "B) The History of Technological Toys and its Effects",
          "C) Different Factors That Help Toy Companies Sell More"
        ],
        answer: "C"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'same' is the antonym of the word ----.",
        options: ["A) interesting", "B) smart", "C) different"],
        answer: "C"
      },
      {
        id: 2,
        question: "'popular' is closest in meaning to ----.",
        options: ["A) famous", "B) same", "C) small"],
        answer: "A"
      },
      {
        id: 3,
        question: "'small' is the antonym of the word ----.",
        options: ["A) big", "B) advanced", "C) interested"],
        answer: "A"
      },
      {
        id: 4,
        question: "Toy sales have ---- a lot this year.",
        options: ["A) gone up", "B) gone down", "C) set off"],
        answer: "A"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 22,
    title: "Bill Gates' Predictions for the Future",
    cefr: "B2",
    theme: "Future Simple & Predictions",
    paragraphs: [
      "In the past, Bill Gates, who is a billionaire philanthropist, made many correct predictions such as the rise of smart phones and social media. And here are his recent predictions about the future of our world.",
      "He predicts that Africa's agriculture industry will increase productivity by 50% by 2030. Therefore, he says that it will become an entirely self-sufficient continent. Currently, the continent imports roughly $50 billion worth of food each year despite the fact that 70% of residents in sub-Saharan Africa are farmers. In the next 15 years, however, innovations in farming will change this situation.",
      "He says that that renewable resources like wind and solar energy will power the majority of the world within the next 30 years. If the world can use these cheap and clean sources of energy more, it will do more than halt climate change. It will transform the lives of millions of the poorest families.",
      "He also predicts that over the next 20 years, majority of factories will have to replace human workers with automated robots. The loss of labour force will probably be in thousands. This figure may change according to which industries automate jobs the most."
    ],
    vocabulary: [
      { term: "philanthropist", meaning: "insaniyet perver, toplumsever, hayırsever", partOfSpeech: "n" },
      { term: "resident", meaning: "bir yerde ikamet eden, oturan, sakin", partOfSpeech: "n" },
      { term: "prediction", meaning: "tahmin", partOfSpeech: "n" },
      { term: "however", meaning: "ama, fakat, ancak", partOfSpeech: "conj" },
      { term: "agriculture", meaning: "tarım", partOfSpeech: "n" },
      { term: "innovation", meaning: "yenilik", partOfSpeech: "n" },
      { term: "productivity", meaning: "üretkenlik, verimlilik", partOfSpeech: "n" },
      { term: "majority", meaning: "çoğunluk", partOfSpeech: "n" },
      { term: "therefore", meaning: "bu yüzden, böylece", partOfSpeech: "conj" },
      { term: "halt", meaning: "durmak, durdurmak", partOfSpeech: "v" },
      { term: "entirely", meaning: "tümüyle, tamamen", partOfSpeech: "adv" },
      { term: "transform", meaning: "dönüştürmek", partOfSpeech: "v" },
      { term: "self-sufficient", meaning: "kendi kendine yeten, kendi kendini idare eden", partOfSpeech: "adj" },
      { term: "replace", meaning: "yerine koymak, -in yerini almak, değiştirmek", partOfSpeech: "v" },
      { term: "currently", meaning: "şu anda", partOfSpeech: "adv" },
      { term: "loss", meaning: "kayıp, zayiat, zarar", partOfSpeech: "n" },
      { term: "roughly", meaning: "yaklaşık olarak, kabaca", partOfSpeech: "adv" },
      { term: "labour force", meaning: "işgücü", partOfSpeech: "n" },
      { term: "despite", meaning: "-e rağmen, karşın", partOfSpeech: "conj" },
      { term: "probably", meaning: "muhtemelen", partOfSpeech: "adv" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "One can understand from paragraph 1 that Bill Gates ----.",
        options: [
          "A) made a huge profit out of his predictions",
          "B) failed to foresee the future of technology",
          "C) made a number of accurate predictions"
        ],
        answer: "C"
      },
      {
        id: 2,
        question: "According to paragraph 2, Africa will be able to ----.",
        options: [
          "A) increase the number of farmers by 70%",
          "B) provide food for itself without the help of others",
          "C) export food to other countries by 2030"
        ],
        answer: "B"
      },
      {
        id: 3,
        question: "According to paragraph 3, which of the following is FALSE about the benefits that sustainable energy sources will bring?",
        options: [
          "A) They will change the lives of impoverished people.",
          "B) They will have a positive impact on climate change.",
          "C) They will provide job opportunities for poor people."
        ],
        answer: "C"
      },
      {
        id: 4,
        question: "The underlined word 'halt' in paragraph 3 is closest in meaning to ----.",
        options: [
          "A) stop",
          "B) refuse",
          "C) lose"
        ],
        answer: "A"
      },
      {
        id: 5,
        question: "We can understand from paragraph 4 that ----.",
        options: [
          "A) all factories will depend entirely on robots",
          "B) some labourers will become unemployed",
          "C) most professions will become extinct"
        ],
        answer: "B"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "Which of the following is related to 'contrast'?",
        options: ["A) therefore", "B) however", "C) currently"],
        answer: "B"
      },
      {
        id: 2,
        question: "Which of the following is related to 'likelihood'?",
        options: ["A) currently", "B) probably", "C) entirely"],
        answer: "B"
      },
      {
        id: 3,
        question: "'roughly' is closest in meaning to ----.",
        options: ["A) exactly", "B) nearly", "C) rarely"],
        answer: "B"
      },
      {
        id: 4,
        question: "The accident had a terrible ---- on her life.",
        options: ["A) tragedy", "B) effect", "C) size"],
        answer: "B"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 23,
    title: "The Smart Homes of the Future",
    cefr: "B1",
    theme: "Future Simple & Technology",
    paragraphs: [
      "Technology will allow homes in the future to be \"smart\". Home appliances will communicate with each other and with you. For instance, refrigerators will suggest recipes based on food items you already have. The technology is possible because of tiny information-storing devices called RFID (radio-frequency identification) chips. People already use them in order to keep track of pets and farm animals so that they can find them if they get lost. Future RFID chips will store information about all the items in your fridge. When you need more food, your fridge will tell you to buy it.",
      "Are you tired of the color or pattern of your walls? In a smart home, you won't have to repaint them. The walls will actually be digital screens, like computer or TV screens. The walls will become clear, like windows, or display colors and patterns. A computer network will link these walls with everything else in your house. This computer \"brain\" will control your entire house. It will also adapt to your preferences. For example, it will set the heat in the house to your favorite temperature. It will also darken the windows at night and lighten them when it's time to wake up.",
      "Futurologists predict that many homes will have robots in the future. Scientists today are starting to build friendly, intelligent and sociable robots. They will be able to show feelings with their faces, just like humans. They will smile and frown, make eye contact, and speak. These robots will do work around the house such as cooking and cleaning. They will even take care of children and the elderly."
    ],
    vocabulary: [
      { term: "allow", meaning: "izin vermek, müsaade etmek", partOfSpeech: "v" },
      { term: "store", meaning: "depolamak, saklamak, biriktirmek", partOfSpeech: "v" },
      { term: "appliance", meaning: "cihaz, aygıt", partOfSpeech: "n" },
      { term: "pattern", meaning: "model, desen", partOfSpeech: "n" },
      { term: "for instance", meaning: "örneğin", partOfSpeech: "conj" },
      { term: "display", meaning: "göstermek, görüntülemek", partOfSpeech: "v" },
      { term: "base on", meaning: "dayanmak, temel almak", partOfSpeech: "n" },
      { term: "link", meaning: "bağlamak, ilişkilendirmek", partOfSpeech: "v" },
      { term: "because of", meaning: "-den dolayı", partOfSpeech: "conj" },
      { term: "entire", meaning: "tüm, bütün", partOfSpeech: "adj" },
      { term: "tiny", meaning: "küçük, minik", partOfSpeech: "adj" },
      { term: "adapt to", meaning: "uyum sağlamak, ayak uydurmak", partOfSpeech: "v" },
      { term: "in order to", meaning: "-mek / mak için", partOfSpeech: "conj" },
      { term: "like / such as", meaning: "gibi", partOfSpeech: "conj" },
      { term: "keep track of", meaning: "takip etmek, izlemek", partOfSpeech: "v" },
      { term: "take care of", meaning: "bakmak, ilgilenmek", partOfSpeech: "v" },
      { term: "so that", meaning: "-sın diye, -mesi için", partOfSpeech: "conj" },
      { term: "(the) elderly", meaning: "yaşlı(lar)", partOfSpeech: "adj" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "We can understand from paragraph 1 that people use RFID technology ----.",
        options: [
          "A) only at homes",
          "B) for several purposes",
          "C) to buy something"
        ],
        answer: "B"
      },
      {
        id: 2,
        question: "The underlined word 'keep track of' in paragraph 1 is closest in meaning to ----.",
        options: [
          "A) show",
          "B) lose",
          "C) follow"
        ],
        answer: "C"
      },
      {
        id: 3,
        question: "It is stated in paragraph 2 that the computer \"brain\" in the house ----.",
        options: [
          "A) will be available in all kinds of houses",
          "B) gives you suggestions about your home design",
          "C) can adjust itself according to your needs"
        ],
        answer: "C"
      },
      {
        id: 4,
        question: "According to paragraph 3 robots will ----.",
        options: [
          "A) be smarter and more sociable than humans",
          "B) be able to display emotions similar to humans",
          "C) look after people with different kinds of disabilities"
        ],
        answer: "B"
      },
      {
        id: 5,
        question: "The underlined word 'just' in paragraph 3 is closest in meaning to ----.",
        options: [
          "A) only",
          "B) soon",
          "C) exactly"
        ],
        answer: "C"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'tiny' is closest in meaning to ----.",
        options: ["A) very small", "B) very smart", "C) very old"],
        answer: "A"
      },
      {
        id: 2,
        question: "'look after' is closest in meaning to ----.",
        options: ["A) adapt to", "B) take care of", "C) keep track of"],
        answer: "B"
      },
      {
        id: 3,
        question: "I'm attending a course ---- I can get a high grade.",
        options: ["A) in order to", "B) such as", "C) because of"],
        answer: "A"
      },
      {
        id: 4,
        question: "The bridge links Britain ---- the rest of Europe.",
        options: ["A) with", "B) for", "C) between"],
        answer: "A"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 24,
    title: "Choosing My Future Profession",
    cefr: "A2",
    theme: "Future Plans & Time Clauses",
    paragraphs: [
      "I often wonder about my future as I am about to finish Secondary School. The number one question on my mind is which profession should I choose? I want a profession that will satisfy me, challenge me, and bring me joy. I believe that a job should be like a hobby. I want to love my work.",
      "First of all, as soon as I finish Secondary School, I will take the first important exam of my life – the final graduation exam. I will be tested in four different subjects: the English and German languages, biology, and chemistry. After my graduation, I will study at the Medical University to become a doctor.",
      "But now, I am focusing my attention on finishing my studies. Also, before I have a family, I would like to travel overseas. I want to see countries like Japan, Finland and travel through the African continent. After I finish my education and travels, I plan to get married and have a family. I would like to live with my future family in a quiet, natural countryside setting."
    ],
    vocabulary: [
      { term: "wonder", meaning: "merak etmek, düşünmek", partOfSpeech: "v" },
      { term: "graduation", meaning: "mezuniyet", partOfSpeech: "n" },
      { term: "profession", meaning: "iş, meslek", partOfSpeech: "n" },
      { term: "focus on", meaning: "odaklanmak, bütün dikkatini vermek", partOfSpeech: "v" },
      { term: "satisfy", meaning: "tatmin etmek, memnun etmek, karşılamak", partOfSpeech: "v" },
      { term: "overseas", meaning: "denizaşırı", partOfSpeech: "adv" },
      { term: "challenge", meaning: "meydan okumak, zorlamak", partOfSpeech: "v" },
      { term: "continent", meaning: "kıta", partOfSpeech: "n" },
      { term: "joy", meaning: "neşe, keyif, sevinç", partOfSpeech: "n" },
      { term: "countryside", meaning: "kırsal kesim, sayfiye", partOfSpeech: "n" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "According to the text, which of the following is true?",
        options: [
          "A) She knows exactly which profession to choose",
          "B) She only wants a job with a satisfying salary",
          "C) In the final exam, she will be tested in 2 languages"
        ],
        answer: "C"
      },
      {
        id: 2,
        question: "Sally wants to have a family ----.",
        options: [
          "A) after she travels overseas",
          "B) while she is studying to become a doctor",
          "C) because she doesn't want to travel alone"
        ],
        answer: "A"
      },
      {
        id: 3,
        question: "According to the text, it can be inferred that ----.",
        options: [
          "A) she doesn't want to be a doctor",
          "B) she has taken many important exams before",
          "C) job selection is very important for her"
        ],
        answer: "C"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'job' is closest in meaning to ----.",
        options: ["A) profession", "B) graduation", "C) continent"],
        answer: "A"
      },
      {
        id: 2,
        question: "Which of the following is about geography?",
        options: ["A) wonder", "B) continent", "C) challenge"],
        answer: "B"
      },
      {
        id: 3,
        question: "'satisfy' is closest in meaning to ----.",
        options: ["A) please", "B) challenge", "C) finish"],
        answer: "A"
      },
      {
        id: 4,
        question: "I will take the exam ---- I finish school.",
        options: ["A) as soon as", "B) despite", "C) in order to"],
        answer: "A"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 25,
    title: "What Makes a Great Limousine Driver",
    cefr: "B1",
    theme: "Modals: Have to, Should, Ought to",
    paragraphs: [
      "In a city like Los Angeles, limousine drivers are popular. You can find good limousine drivers easily, but it may be difficult to find great ones. Great limousine drivers must have many skills and talents. They have to be good listeners, extremely knowledgeable, and professional as well. They must get along with all sorts of people. That is, they need to learn how to establish a nice communication. In order to become great, they need to have some training.",
      "In the past, the training process of one limousine company used to include a test on how to deal with different passenger types. The trainee drivers had to interact with unpleasant and difficult passengers. They needed to put up with these difficult customers. Some of the drivers were able to achieve this difficult task, while some couldn't. Therefore, the limousine company could observe the trainee drivers in authentic situations and was able to choose the best ones.",
      "So, if you really want to find a good limousine driver, you should do some research first. You ought to find a well-trained driver. When you organize a special event like wedding, and need to hire a limousine driver, you had better be careful. Otherwise, you could get into trouble."
    ],
    vocabulary: [
      { term: "skill", meaning: "beceri", partOfSpeech: "n" },
      { term: "process", meaning: "süreç", partOfSpeech: "n" },
      { term: "talent", meaning: "yetenek", partOfSpeech: "n" },
      { term: "establish", meaning: "kurmak, tesis etmek", partOfSpeech: "v" },
      { term: "knowledgeable", meaning: "bilgili", partOfSpeech: "adj" },
      { term: "training", meaning: "eğitim", partOfSpeech: "n" },
      { term: "extremely", meaning: "çok, son derece, aşırı", partOfSpeech: "adv" },
      { term: "interact with", meaning: "etkileşimde bulunmak, etkileşime girmek", partOfSpeech: "v" },
      { term: "get along", meaning: "(birbiriyle) geçinmek", partOfSpeech: "phr. v" },
      { term: "unpleasant", meaning: "hoş olmayan, sevimsiz", partOfSpeech: "adj" },
      { term: "sort", meaning: "çeşit, tür, cins", partOfSpeech: "n" },
      { term: "put up with", meaning: "katlanmak, dayanmak", partOfSpeech: "v" },
      { term: "That is", meaning: "yani, başka bir deyişle", partOfSpeech: "conj" },
      { term: "achieve", meaning: "başarmak", partOfSpeech: "v" },
      { term: "include", meaning: "içermek, kapsamak", partOfSpeech: "v" },
      { term: "observe", meaning: "gözlemlemek", partOfSpeech: "v" },
      { term: "deal with", meaning: "ile ilgilenmek", partOfSpeech: "v" },
      { term: "authentic", meaning: "hakiki, gerçek, özgün", partOfSpeech: "adj" },
      { term: "trainee", meaning: "stajyer, kursiyer", partOfSpeech: "n" },
      { term: "otherwise", meaning: "aksi takdirde", partOfSpeech: "adv" },
      { term: "in order to", meaning: "-mek / mak için, amacıyla", partOfSpeech: "conj" },
      { term: "hire", meaning: "kiralamak", partOfSpeech: "v" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "The underlined word 'get along' in paragraph 1 is closest in meaning to ----.",
        options: [
          "A) have a good relationship",
          "B) talk about something",
          "C) foresee some problems"
        ],
        answer: "A"
      },
      {
        id: 2,
        question: "The underlined word 'deal with' in paragraph 2 is closest in meaning to ----.",
        options: [
          "A) include",
          "B) avoid",
          "C) tackle"
        ],
        answer: "C"
      },
      {
        id: 3,
        question: "The underlined word 'put up with' in paragraph 2 is closest in meaning to ----.",
        options: [
          "A) fight",
          "B) tolerate",
          "C) study"
        ],
        answer: "B"
      },
      {
        id: 4,
        question: "The underlined word 'while' in paragraph 2 is closest in meaning to ----.",
        options: [
          "A) and",
          "B) so",
          "C) but"
        ],
        answer: "C"
      },
      {
        id: 5,
        question: "The underlined pronoun 'ones' in paragraph 2 refers to ----.",
        options: [
          "A) limousine companies",
          "B) trainee drivers",
          "C) authentic situations"
        ],
        answer: "B"
      },
      {
        id: 6,
        question: "The author's aim in paragraph 3 is to ----.",
        options: [
          "A) provide the readers with some advice",
          "B) suggest different ways of finding the best drivers",
          "C) emphasize the importance of training"
        ],
        answer: "A"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'have to' is closest in meaning to ----.",
        options: ["A) must", "B) could", "C) might"],
        answer: "A"
      },
      {
        id: 2,
        question: "'should' is closest in meaning to ----.",
        options: ["A) ought to", "B) be able to", "C) used to"],
        answer: "A"
      },
      {
        id: 3,
        question: "You must work hard in order to ---- your goals.",
        options: ["A) hire", "B) include", "C) achieve"],
        answer: "C"
      },
      {
        id: 4,
        question: "I can't ---- with the noise outside. It's too annoying.",
        options: ["A) interact", "B) put up", "C) get along"],
        answer: "B"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 26,
    title: "A Chat About the Homework Deadline",
    cefr: "A2",
    theme: "Modals: Must, Have to, Should",
    paragraphs: [
      "Maggie: Hi Tom, have you finished your homework?",
      "Tom: Oh hi Maggie. No, I haven't.",
      "Maggie: The deadline is tomorrow you know so you have to submit it tomorrow.",
      "Tom: I can't make it. I haven't even started it yet. Can we hand it in next week?",
      "Maggie: I don't know. You'll have to ask Mrs Robinson about that. I think you must finish it by tomorrow. She probably won't accept projects after tomorrow.",
      "Tom: I've had so many other things to do. I couldn't even start it. I don't know what to do.",
      "Maggie: Don't worry. I'll help you. It's not very difficult. I finished it in one day.",
      "Tom: Really? Great!",
      "Maggie: First, you should read the article that Mrs. Robinson gave us. It's about the Mohican Civilisation. Then, you have to design a poster for a play about them – the Mohicans – for the theatre.",
      "Tom: Yeah I know but it looks a bit difficult…",
      "Maggie: Not at all. You don't have to make the poster from scratch and it doesn't have to be a work of art. There are lots of templates on the internet. You can just use one of those designs to make your own poster.",
      "Tom: Well, I think I can do it. What title shall I use? Can you help me?",
      "Maggie: Yeah, I can give you some suggestions but you mustn't use the same title as anyone else in our class. You have to create your own title.",
      "Tom: Okay, I can come up with something I guess.",
      "Maggie: Alright?",
      "Tom: Yeah, I've got to go now and make a start on it. I'll follow the project guidelines like you said. Thanks, Maggie.",
      "Maggie: No problem. Good luck!"
    ],
    vocabulary: [
      { term: "deadline", meaning: "son teslim tarihi", partOfSpeech: "n" },
      { term: "template", meaning: "şablon", partOfSpeech: "n" },
      { term: "submit", meaning: "teslim etmek, sunmak", partOfSpeech: "v" },
      { term: "title", meaning: "başlık", partOfSpeech: "n" },
      { term: "hand in", meaning: "teslim etmek, iletmek", partOfSpeech: "v" },
      { term: "suggestion", meaning: "öneri, tavsiye", partOfSpeech: "n" },
      { term: "civilization", meaning: "medeniyet", partOfSpeech: "n" },
      { term: "create", meaning: "oluşturmak, yaratmak", partOfSpeech: "v" },
      { term: "design", meaning: "tasarlamak", partOfSpeech: "v" },
      { term: "guideline", meaning: "kılavuz, yönerge, talimat", partOfSpeech: "n" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "According to the text, Tom ----.",
        options: [
          "A) hasn't completed his homework yet",
          "B) doesn't know the deadline",
          "C) is sure to finish his homework on time"
        ],
        answer: "A"
      },
      {
        id: 2,
        question: "According to the text, Maggie knows that ----.",
        options: [
          "A) Mrs Robinson won't accept projects after tomorrow",
          "B) Tom has to hand in the project tomorrow",
          "C) the project can be submitted next week"
        ],
        answer: "B"
      },
      {
        id: 3,
        question: "According to the text, which of the following is true?",
        options: [
          "A) Maggie has completed her project.",
          "B) Tom must design the entire poster by himself.",
          "C) The poster must look great when it's finished."
        ],
        answer: "A"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'hand in' is closest in meaning to ----.",
        options: ["A) follow", "B) design", "C) submit"],
        answer: "C"
      },
      {
        id: 2,
        question: "'destroy' is the antonym of the word ----.",
        options: ["A) create", "B) submit", "C) follow"],
        answer: "A"
      },
      {
        id: 3,
        question: "'advice' is closest in meaning to ----.",
        options: ["A) civilisation", "B) suggestion", "C) deadline"],
        answer: "B"
      },
      {
        id: 4,
        question: "'plan' is closest in meaning to ----.",
        options: ["A) follow", "B) submit", "C) design"],
        answer: "C"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 27,
    title: "Understanding Eating Disorders",
    cefr: "B2",
    theme: "Cause & Effect / Health",
    paragraphs: [
      "Many kids, especially adolescents, are interested in their appearance. Unfortunately, for a number of kids and teens, that interest can become an obsession. They worry about it so much that they stop thinking about anything else. As a result, they develop eating disorders. Eating disorders are negative thoughts and feelings about body weight and food.",
      "The most common eating disorders are \"anorexia\" and \"bulimia\". People with anorexia have an extreme fear of weight gain. Even if they are underweight (too thin), they might see themselves as very fat. They try to eat as little as possible and take in as few calories as they can. Some go on a diet and do excessive exercise for almost five hours a day.",
      "Similar to anorexics, people with bulimia may experience changes in weight. They try to eat as little food as possible and do a lot of exercise like anorexics. However, they often cannot control themselves and start eating too much. When this happens, bulimics eat all their \"forbidden food\" and feel so guilty that they get rid of the calories by vomiting.",
      "The causes of eating disorders are not very clear. However, scientists think psychological, genetic, and social factors play a role. There may be genes that are related to eating disorders. If your siblings or parents have an eating disorder, you may have it, too. In other words, it is likely that you will develop an eating disorder. In addition, people with eating disorders may have psychological and emotional problems that contribute to the disorder. They may have low self-confidence, perfectionism and problematic relationships. Finally, society affects people's ideas about beauty and appearance negatively. In popular culture, success depends on being physically attractive. Most celebrities in advertising, movies, TV, and sports programs are very thin, and this may lead people, especially adolescents, to think that the ideal of beauty is extreme thinness."
    ],
    vocabulary: [
      { term: "adolescent", meaning: "genç, ergenlik çağında olan", partOfSpeech: "n" },
      { term: "guilty", meaning: "suçlu", partOfSpeech: "adj" },
      { term: "appearance", meaning: "dış görünüş", partOfSpeech: "n" },
      { term: "get rid of", meaning: "kurtulmak, başından atmak", partOfSpeech: "v" },
      { term: "obsession", meaning: "takıntı, saplantı", partOfSpeech: "n" },
      { term: "vomit", meaning: "kusmak, istifra etmek", partOfSpeech: "v" },
      { term: "disorder", meaning: "hastalık, bozukluk", partOfSpeech: "n" },
      { term: "related", meaning: "ilişkili, ilgili", partOfSpeech: "adj" },
      { term: "common", meaning: "yaygın", partOfSpeech: "adj" },
      { term: "sibling", meaning: "kardeş", partOfSpeech: "n" },
      { term: "excessive", meaning: "aşırı, çok fazla", partOfSpeech: "adj" },
      { term: "contribute", meaning: "sebep olmak, katkıda bulunmak", partOfSpeech: "v" },
      { term: "experience", meaning: "yaşamak, deneyimlemek", partOfSpeech: "v" },
      { term: "affect", meaning: "etkilemek", partOfSpeech: "v" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "What does \"obsession\" in paragraph 1 mean?",
        options: [
          "A) an extreme passion",
          "B) a great pleasure",
          "C) an unreasonable fear",
          "D) a wrong belief"
        ],
        answer: "A"
      },
      {
        id: 2,
        question: "According to paragraph 2, anorexic people think they ----.",
        options: [
          "A) look fatter than they really are",
          "B) should eat more often",
          "C) have a healthy lifestyle",
          "D) always feel hungry and sick"
        ],
        answer: "A"
      },
      {
        id: 3,
        question: "Bulimics are different from anorexics because bulimics ----.",
        options: [
          "A) try to do a lot of exercise",
          "B) think they are fat",
          "C) prefer low calorie-foods",
          "D) may eat too much"
        ],
        answer: "D"
      },
      {
        id: 4,
        question: "Which of the following can we infer from paragraph 4?",
        options: [
          "A) Mostly, parents cause the eating disorders of their children.",
          "B) Eating disorders are common among famous people.",
          "C) People with eating disorders are generally successful.",
          "D) The media gives a wrong message about beauty and success."
        ],
        answer: "D"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'obsession' is closest in meaning to ----.",
        options: ["A) fixation", "B) pleasure", "C) belief"],
        answer: "A"
      },
      {
        id: 2,
        question: "'attractive' is closest in meaning to ----.",
        options: ["A) plain", "B) good-looking", "C) confident"],
        answer: "B"
      },
      {
        id: 3,
        question: "Emotional problems can ---- an important role in the disorder.",
        options: ["A) play", "B) cause", "C) make"],
        answer: "A"
      },
      {
        id: 4,
        question: "Genetic factors can contribute ---- eating disorders.",
        options: ["A) to", "B) on", "C) for"],
        answer: "A"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 28,
    title: "How Did Life Begin on Earth?",
    cefr: "B2",
    theme: "Modals of Deduction (Must/Might have)",
    paragraphs: [
      "How life appeared on Earth is a tricky question to answer because we lack conclusive evidence. According to one theory, life may have come with meteors in the form of bacteria. Bacteria can withstand excessive heat. Thus, they must have travelled vast distances in space and arrived on earth. To others, life must have originated on earth with the interaction of various chemicals. They believe that something must have caused these chemicals to interact. Changing climate, pressure, gravity or oxygen levels might have caused life on earth to appear."
    ],
    vocabulary: [
      { term: "appear", meaning: "ortaya çıkmak, belirmek", partOfSpeech: "v" },
      { term: "vast", meaning: "engin, muazzam, büyük", partOfSpeech: "adj" },
      { term: "tricky", meaning: "aldatıcı, karmaşık", partOfSpeech: "adj" },
      { term: "distance", meaning: "mesafe", partOfSpeech: "n" },
      { term: "answer", meaning: "cevap vermek, yanıtlamak", partOfSpeech: "v" },
      { term: "space", meaning: "uzay", partOfSpeech: "n" },
      { term: "lack", meaning: "eksik olmak, yoksun kalmak", partOfSpeech: "v" },
      { term: "originate", meaning: "kaynaklanmak, başlamak", partOfSpeech: "v" },
      { term: "conclusive", meaning: "kesin, nihai", partOfSpeech: "adj" },
      { term: "interaction", meaning: "etkileşim", partOfSpeech: "n" },
      { term: "theory", meaning: "teori", partOfSpeech: "n" },
      { term: "various", meaning: "çeşitli, muhtelif, farklı", partOfSpeech: "adj" },
      { term: "meteor", meaning: "meteor", partOfSpeech: "n" },
      { term: "chemical", meaning: "kimyasal", partOfSpeech: "adj" },
      { term: "form", meaning: "biçim, şekil", partOfSpeech: "n" },
      { term: "interact", meaning: "etkileşime geçmek", partOfSpeech: "v" },
      { term: "bacteria", meaning: "bakteri", partOfSpeech: "n" },
      { term: "pressure", meaning: "basınç", partOfSpeech: "n" },
      { term: "withstand", meaning: "dayanmak, direnmek", partOfSpeech: "v" },
      { term: "gravity", meaning: "yerçekimi", partOfSpeech: "n" },
      { term: "excessive", meaning: "aşırı, fazla", partOfSpeech: "adj" },
      { term: "oxygen", meaning: "oksijen", partOfSpeech: "n" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "It is clearly stated in the passage that there are ----.",
        options: [
          "A) many studies into different forms of bacteria from space",
          "B) some people who believe life began on Earth by chance",
          "C) different theories about the beginning of life on Earth"
        ],
        answer: "C"
      },
      {
        id: 2,
        question: "The underlined word 'conclusive' in the passage is closest in meaning to ----.",
        options: [
          "A) detailed",
          "B) ambiguous",
          "C) certain"
        ],
        answer: "C"
      },
      {
        id: 3,
        question: "We can understand from the passage that ----.",
        options: [
          "A) bacteria have the potential to destroy other life forms",
          "B) different factors may have triggered life to start on Earth",
          "C) one of the theories is more probable than the other"
        ],
        answer: "B"
      },
      {
        id: 4,
        question: "The underlined word 'withstand' in the passage is closest in meaning to ----.",
        options: [
          "A) resist",
          "B) support",
          "C) suffer"
        ],
        answer: "A"
      },
      {
        id: 5,
        question: "Which of the following could be the best title for the passage?",
        options: [
          "A) Recent Studies into the History of Mankind",
          "B) Theories on How Life Came into Existence on Earth",
          "C) Disadvantages of Having a Lack of Evidence"
        ],
        answer: "B"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "Which of the following is negative in meaning?",
        options: ["A) lack", "B) excessive", "C) oxygen"],
        answer: "A"
      },
      {
        id: 2,
        question: "'various' is closest in meaning to ----.",
        options: ["A) excessive", "B) chemical", "C) different"],
        answer: "C"
      },
      {
        id: 3,
        question: "'vast' is closest in meaning to ----.",
        options: ["A) large", "B) tricky", "C) great"],
        answer: "A"
      },
      {
        id: 4,
        question: "It is a/an ---- question to answer.",
        options: ["A) excessive", "B) tricky", "C) conclusive"],
        answer: "B"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 29,
    title: "The Story of Helen Keller",
    cefr: "B1",
    theme: "Ability: Could / Was able to / Managed to",
    paragraphs: [
      "Helen Keller could neither see nor hear from the time she was a baby. In addition to this, she had some physical handicaps as well. Yet, she was able to overcome these difficulties and become a useful citizen.",
      "When she was nineteen months old, she was able to walk a little and could say only a few words. One day she fell so ill that her parents had to take her to hospital. There, they learned that she would never be able to see and hear again. In the following years, since she couldn't hear what others said, she couldn't learn how to talk and she was unable to play with other children.",
      "One day, a specialist called Ann Sullivan decided to help Helen. She started visiting her every day. They would spend hours with each other. She managed to teach 300 words to Helen. After some time, Helen was able to put them into sentences. Then, Helen and her teacher were able to talk to each other. Helen was able to learn to read the books for the blind, too.",
      "At the age of 20, Helen Keller managed to pass all the difficult entrance examinations to Radcliffe College. She did extremely well in her classes and was able to keep up with the other students. However, in the past, she used to have great difficulty doing these things."
    ],
    vocabulary: [
      { term: "neither … nor", meaning: "ne … ne de", partOfSpeech: "" },
      { term: "yet", meaning: "fakat, ancak, ama", partOfSpeech: "" },
      { term: "in addition / in addition to", meaning: "ek olarak, ayrıca", partOfSpeech: "" },
      { term: "specialist", meaning: "uzman", partOfSpeech: "n" },
      { term: "handicap", meaning: "özür, engel, yetersizlik", partOfSpeech: "n" },
      { term: "each other", meaning: "birbirini, birbirine", partOfSpeech: "" },
      { term: "overcome", meaning: "üstesinden gelmek", partOfSpeech: "v" },
      { term: "extremely", meaning: "çok, aşırı, fazlaca", partOfSpeech: "adv" },
      { term: "useful", meaning: "faydalı", partOfSpeech: "adj" },
      { term: "keep up with", meaning: "yetişmek, ayak uydurmak, -den geri kalmamak", partOfSpeech: "phr. v" },
      { term: "citizen", meaning: "vatandaş", partOfSpeech: "n" },
      { term: "however", meaning: "fakat, ancak, ama", partOfSpeech: "conj" },
      { term: "as well", meaning: "de, da (=,too)", partOfSpeech: "" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "Which of the following is FALSE about Helen, according to paragraph 1?",
        options: [
          "A) She had difficulties with her hearing and vision.",
          "B) She had physical disabilities when she was a baby.",
          "C) She failed to deal with the difficulties she had."
        ],
        answer: "C"
      },
      {
        id: 2,
        question: "The underlined word 'overcome' in paragraph 1 is closest in meaning to ----.",
        options: [
          "A) spread",
          "B) defeat",
          "C) involve"
        ],
        answer: "B"
      },
      {
        id: 3,
        question: "According to paragraph 2, Helen's parents took her to hospital since she ----.",
        options: [
          "A) could no longer walk",
          "B) became very sick",
          "C) was unable to talk"
        ],
        answer: "B"
      },
      {
        id: 4,
        question: "We can understand from paragraph 3 that Ann Sullivan ----.",
        options: [
          "A) contributed greatly to Helen's education",
          "B) was better than any other specialist at the time",
          "C) used sign language to communicate with Helen"
        ],
        answer: "A"
      },
      {
        id: 5,
        question: "The underlined pronoun 'them' in paragraph 3 refers to ----.",
        options: [
          "A) hours",
          "B) words",
          "C) books"
        ],
        answer: "B"
      },
      {
        id: 6,
        question: "The underlined word 'extremely' in paragraph 4 is closest in meaning to ----.",
        options: [
          "A) very",
          "B) almost",
          "C) exactly"
        ],
        answer: "A"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "Which of the following expresses 'habits in the past'?",
        options: ["A) would", "B) had to", "C) used to"],
        answer: "C"
      },
      {
        id: 2,
        question: "Cotton production was rising. ----, it was still a small industry then.",
        options: ["A) As well", "B) However", "C) In addition"],
        answer: "B"
      },
      {
        id: 3,
        question: "Elderly people usually can't ---- the latest technological devices.",
        options: ["A) keep up with", "B) get along", "C) look forward to"],
        answer: "A"
      },
      {
        id: 4,
        question: "'overcome' is closest in meaning to ----.",
        options: ["A) defeat", "B) spread", "C) involve"],
        answer: "A"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 30,
    title: "The Mystery of Stonehenge",
    cefr: "B2",
    theme: "Modals of Deduction (Must or Cannot have)",
    paragraphs: [
      "Thousands of years ago, an ancient civilization raised a circle of huge, roughly rectangular stones in a field in what is now Wiltshire, England. Stonehenge has been a mystery ever since. Building began on the site around 3100 B.C. and continued up until about 1600 B.C. No written records exist to explain how or why it was built.",
      "The biggest of Stonehenge's stones are up to 9 meters tall and weigh 25 tons on average. Scientists believe that they must have been brought from Marlborough Downs, a distance of 32 km to the north. Transporting the stones that distance can't have been easy.",
      "Smaller stones, referred to as \"bluestones\", weigh up to 4 tons and come from several different sites in western Wales, having been transported as far as 225 km. It's unknown how people in antiquity moved them that far. Scientists speculate that during the last ice age glaciers might have carried these bluestones closer to the Stonehenge area. An earlier theory was that the builders could have used rafts to transport the stones over the water. However, more recent research suggests that this method can't have been used because of the weight of the stones.",
      "There are a number of theories as to what the site was used for. Archaeologists agree that the site must have had a spiritual significance. It may have originally been a cemetery, according to a new study. After examining bones near the stones, scientists believe that the burials must have taken place at the same time as Stonehenge was built, suggesting that the stones could have been gravestones for religious or political elite."
    ],
    vocabulary: [
      { term: "ancient", meaning: "antik, eski", partOfSpeech: "adj" },
      { term: "exist", meaning: "var olmak", partOfSpeech: "v" },
      { term: "civilization", meaning: "uygarlık", partOfSpeech: "n" },
      { term: "distance", meaning: "mesafe, uzaklık", partOfSpeech: "n" },
      { term: "raise", meaning: "yükseltmek, dikmek", partOfSpeech: "v" },
      { term: "refer to", meaning: "adlandırmak, işaret etmek, olarak bilmek", partOfSpeech: "v" },
      { term: "roughly", meaning: "kabaca", partOfSpeech: "adv" },
      { term: "weigh", meaning: "gelmek (ağırlık)", partOfSpeech: "v" },
      { term: "rectangular", meaning: "dikdörtgen", partOfSpeech: "adj" },
      { term: "antiquity", meaning: "eski çağlar", partOfSpeech: "n" },
      { term: "field", meaning: "alan, saha", partOfSpeech: "n" },
      { term: "speculate", meaning: "varsayımda bulunmak, tahmin etmek", partOfSpeech: "v" },
      { term: "mystery", meaning: "sır, gizem", partOfSpeech: "n" },
      { term: "raft", meaning: "sal", partOfSpeech: "n" },
      { term: "suggest", meaning: "öne / ileri sürmek, göstermek", partOfSpeech: "v" },
      { term: "burials", meaning: "gömme, defin", partOfSpeech: "n" },
      { term: "as to", meaning: "-e dair, ilişkin", partOfSpeech: "adv" },
      { term: "take place", meaning: "olmak, meydana gelmek", partOfSpeech: "v" },
      { term: "spiritual", meaning: "ruhsal, manevi", partOfSpeech: "adj" },
      { term: "grave", meaning: "mezar", partOfSpeech: "n" },
      { term: "significance", meaning: "önem, anlam", partOfSpeech: "n" },
      { term: "religious", meaning: "dini", partOfSpeech: "adj" },
      { term: "bone", meaning: "kemik", partOfSpeech: "n" },
      { term: "elite", meaning: "yüksek sınıf", partOfSpeech: "n" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "According to the passage, the building on the site around Stonehenge ----",
        options: [
          "A) largely consists of rectangular stones",
          "B) was started by an illiterate community",
          "C) took far more than a thousand years"
        ],
        answer: "C"
      },
      {
        id: 2,
        question: "Scientists believe that it was difficult to ----",
        options: [
          "A) tell why big stones are used in Stonehenge",
          "B) find enough stones to build Stonehenge",
          "C) carry the stones in Stonehenge"
        ],
        answer: "C"
      },
      {
        id: 3,
        question: "The only thing researchers agree on is about Stonehenge's ----",
        options: [
          "A) building methods",
          "B) spiritual significance",
          "C) building purpose"
        ],
        answer: "B"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "Which of the following is about social status?",
        options: ["A) exist", "B) elite", "C) weigh"],
        answer: "B"
      },
      {
        id: 2,
        question: "'about' is closest in meaning to ----.",
        options: ["A) bone", "B) refer to", "C) as to"],
        answer: "C"
      },
      {
        id: 3,
        question: "'roughly' is closest in meaning to ----.",
        options: ["A) exactly", "B) approximately", "C) rarely"],
        answer: "B"
      },
      {
        id: 4,
        question: "'significance' is closest in meaning to ----.",
        options: ["A) importance", "B) mystery", "C) distance"],
        answer: "A"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 31,
    title: "What Do Doctors Do?",
    cefr: "B1",
    theme: "Passive Voice (Present Simple)",
    paragraphs: [
      "Doctors make people healthier. When people get ill, doctors figure out why. People are examined and listened to by them. People's health problems are identified by doctors, and doctors do tests to see what is wrong. They give people medicine and other kinds of treatment. Patients are advised about going on a diet and so on. There are many kinds of doctors. Family and general practitioners are often the first doctors that people go to when they get sick. Common problems are treated by these doctors. Patients are sent to visit other doctors by other doctors. These are normally called specialists. Specialists are experts in specific types of health problems. For example, internists focus on problems with internal organs. Paediatricians care for children and babies. Surgeons perform operations, like fixing broken bones or transplanting organs. Most doctors are doctors of medicine (M.D.). All kinds of diseases and injuries are treated by them. Some doctors are doctors of osteopathic medicine (D.O.). They focus on muscles and bones. Long hours are worked by doctors, at all times of day and night. About 3 out of 10 physicians worked more than 60 hours a week in 2008. But doctors who work in small offices often have more time off. Doctors sometimes have to hurry up to the hospital to deal with emergencies."
    ],
    vocabulary: [
      { term: "ill", meaning: "hasta", partOfSpeech: "adj" },
      { term: "internal", meaning: "iç", partOfSpeech: "adj" },
      { term: "figure out", meaning: "çözmek, anlamak", partOfSpeech: "phr. v" },
      { term: "organ", meaning: "organ", partOfSpeech: "n" },
      { term: "examine", meaning: "muayene etmek", partOfSpeech: "v" },
      { term: "care for", meaning: "bakmak, bakımını üstlenmek", partOfSpeech: "phr. v" },
      { term: "identify", meaning: "belirlemek, teşhis etmek", partOfSpeech: "v" },
      { term: "surgeon", meaning: "cerrah", partOfSpeech: "n" },
      { term: "wrong", meaning: "yanlış", partOfSpeech: "adj" },
      { term: "perform", meaning: "icra etmek, uygulamak, yerine getirmek, yapmak", partOfSpeech: "v" },
      { term: "treatment", meaning: "tedavi", partOfSpeech: "n" },
      { term: "operation", meaning: "ameliyat", partOfSpeech: "n" },
      { term: "advise", meaning: "tavsiye vermek", partOfSpeech: "v" },
      { term: "fix", meaning: "tamir etmek, onarmak, düzeltmek", partOfSpeech: "v" },
      { term: "kind", meaning: "tür, çeşit", partOfSpeech: "n" },
      { term: "broken", meaning: "kırık, kırılmış", partOfSpeech: "adj" },
      { term: "general", meaning: "genel", partOfSpeech: "adj" },
      { term: "bone", meaning: "kemik", partOfSpeech: "n" },
      { term: "practitioner", meaning: "doktor, pratisyen hekim", partOfSpeech: "n" },
      { term: "transplant", meaning: "organ nakli yapmak", partOfSpeech: "v" },
      { term: "specialist", meaning: "uzman", partOfSpeech: "n" },
      { term: "muscle", meaning: "kas", partOfSpeech: "n" },
      { term: "specific", meaning: "özel, belirli, kendine has", partOfSpeech: "adj" },
      { term: "hurry up", meaning: "acele etmek", partOfSpeech: "phr. v" },
      { term: "example", meaning: "örnek", partOfSpeech: "n" },
      { term: "deal with", meaning: "baş etmek, ilgilenmek", partOfSpeech: "phr. v" },
      { term: "focus on", meaning: "odaklanmak", partOfSpeech: "phr. v" },
      { term: "emergency", meaning: "acil durum", partOfSpeech: "n" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "We can understand from the passage that ----.",
        options: [
          "A) doctors working in small offices often handle emergencies",
          "B) ordinary illnesses are treated by doctors called internists",
          "C) patients are advised by their doctors to see other doctors"
        ],
        answer: "C"
      },
      {
        id: 2,
        question: "The underlined word 'identified' in the passage is closest in meaning to ----.",
        options: [
          "A) classified",
          "B) considered",
          "C) diagnosed"
        ],
        answer: "C"
      },
      {
        id: 3,
        question: "Which of the following is FALSE about doctors?",
        options: [
          "A) Most physicians worked over 60 hours weekly in 2008.",
          "B) People usually consult general practitioners first.",
          "C) Majority of doctors are doctors of medicine (M.D.)."
        ],
        answer: "A"
      },
      {
        id: 4,
        question: "The underlined word 'deal with' in the passage is closest in meaning to ----.",
        options: [
          "A) tackle",
          "B) clarify",
          "C) discuss"
        ],
        answer: "A"
      },
      {
        id: 5,
        question: "Which of the following could be the best title for the passage?",
        options: [
          "A) Difficulties of Being a Doctor",
          "B) Various Kinds of Doctors",
          "C) Why Doctors Work Long Hours"
        ],
        answer: "B"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'ill' is closest in meaning to ----.",
        options: ["A) sick", "B) specific", "C) general"],
        answer: "A"
      },
      {
        id: 2,
        question: "'specialist' is closest in meaning to ----.",
        options: ["A) emergency", "B) example", "C) expert"],
        answer: "C"
      },
      {
        id: 3,
        question: "'kind' is closest in meaning to ----.",
        options: ["A) muscle", "B) bone", "C) type"],
        answer: "C"
      },
      {
        id: 4,
        question: "Which of the following is a part of the human body?",
        options: ["A) muscle", "B) treatment", "C) diet"],
        answer: "A"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 32,
    title: "Biomimetics: Learning from Nature",
    cefr: "B1",
    theme: "Present Continuous & Passive",
    paragraphs: [
      "In a room at Stanford University, a small animal is being studied now. It is called a gecko. It's amazing because it can move very quickly up and down a tree and it can even walk upside down on ceilings. The scientists are interested in the gecko's feet. The animal's natural design will be used on the robot. They are just one step away from bringing their design to an end and the gecko will help them do that. The metal robot looks very similar to the gecko.",
      "Animals and plants can teach humans a lot about design and engineering. As a result, many engineers, scientists and designers spend time studying them. Nature helps them to solve their problems. This science is called biomimetics. Bio- means 'studying living things' and mimetics means 'copying the movement of things'.",
      "Take, for example, whales. Scientists are trying to discover their secret and engineers in Canada are studying the whales' flippers because they help them move so effectively through water. The engineers believe the movement of wind turbines can be improved if small changes are made to the shape."
    ],
    vocabulary: [
      { term: "amazing", meaning: "büyüleyici", partOfSpeech: "adj" },
      { term: "thing", meaning: "şey, eşya, canlılar", partOfSpeech: "n" },
      { term: "move", meaning: "hareket etmek", partOfSpeech: "v" },
      { term: "discover", meaning: "keşfetmek, bulmak", partOfSpeech: "v" },
      { term: "quickly", meaning: "hızlıca", partOfSpeech: "adv" },
      { term: "whales", meaning: "balina", partOfSpeech: "n" },
      { term: "upside down", meaning: "baş aşağı, ters", partOfSpeech: "adv" },
      { term: "flippers", meaning: "palet, yüzgeç", partOfSpeech: "n" },
      { term: "ceilings", meaning: "tavan", partOfSpeech: "n" },
      { term: "effectively", meaning: "etkin bir şekilde", partOfSpeech: "adv" },
      { term: "step", meaning: "adım", partOfSpeech: "n" },
      { term: "through", meaning: "içinde, içinden", partOfSpeech: "adv" },
      { term: "look", meaning: "görünmek", partOfSpeech: "v" },
      { term: "shape", meaning: "şekil", partOfSpeech: "n" },
      { term: "solve", meaning: "çözmek", partOfSpeech: "v" },
      { term: "improve", meaning: "iyileştirmek", partOfSpeech: "v" },
      { term: "mean", meaning: "anlamına gelmek", partOfSpeech: "v" },
      { term: "turbine", meaning: "türbin", partOfSpeech: "n" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "One can infer from paragraph 1 that ----.",
        options: [
          "A) scientists have almost completed the design of a robot similar to a gecko",
          "B) the gecko's secret is hidden in the shape of its body",
          "C) the difference between a gecko and the robot is the number of their feet"
        ],
        answer: "A"
      },
      {
        id: 2,
        question: "It is clear from the passage that biomimetics is the science of ----.",
        options: [
          "A) observing animal behaviour to see how they differ from humans",
          "B) studying nature to create modern technology",
          "C) comparing animals and plants to see what they have in common"
        ],
        answer: "B"
      },
      {
        id: 3,
        question: "What does \"them\" in paragraph 3 refer to?",
        options: [
          "A) flippers",
          "B) engineers",
          "C) whales"
        ],
        answer: "C"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'great' is closest in meaning to ----.",
        options: ["A) shape", "B) amazing", "C) mean"],
        answer: "B"
      },
      {
        id: 2,
        question: "'seem' is closest in meaning to ----.",
        options: ["A) look", "B) discover", "C) solve"],
        answer: "A"
      },
      {
        id: 3,
        question: "Which of the following is a living being?",
        options: ["A) ceiling", "B) whale", "C) step"],
        answer: "B"
      },
      {
        id: 4,
        question: "Which of the following is a direction?",
        options: ["A) move", "B) through", "C) upside down"],
        answer: "C"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 33,
    title: "The Sinking of the Titanic",
    cefr: "B1",
    theme: "Passive Voice (Past Simple)",
    paragraphs: [
      "The Titanic was built in 1912. It was designed in a new way and it was thought to be unsinkable. Because of this, it wasn't given enough lifeboats for the passengers and crew. The ship was damaged by a collision with a huge iceberg and it sank very fast. A total of 1,513 people were drowned that day. Because of this disaster, a lot of magazines were printed in many languages, new international safety laws were passed and Ice Patrol was established. In 1985 the wreck was located on the sea bed and the ship was explored. Several successful films have been made about the Titanic since then, and the most recent was released in 1997."
    ],
    vocabulary: [
      { term: "unsinkable", meaning: "batmaz", partOfSpeech: "adj" },
      { term: "drown", meaning: "boğmak, (suda) boğulmak", partOfSpeech: "v" },
      { term: "lifeboat", meaning: "cankurtaran filikası", partOfSpeech: "n" },
      { term: "print", meaning: "basmak, yayınlamak", partOfSpeech: "v" },
      { term: "passenger", meaning: "yolcu", partOfSpeech: "n" },
      { term: "international", meaning: "uluslararası", partOfSpeech: "adj" },
      { term: "crew", meaning: "mürettebat", partOfSpeech: "n" },
      { term: "safety", meaning: "güvenlik", partOfSpeech: "n" },
      { term: "ship", meaning: "gemi", partOfSpeech: "n" },
      { term: "law", meaning: "yasa", partOfSpeech: "n" },
      { term: "collision", meaning: "çarpışma, çarpma", partOfSpeech: "n" },
      { term: "establish", meaning: "kurmak, oluşturmak", partOfSpeech: "v" },
      { term: "iceberg", meaning: "buzdağı", partOfSpeech: "n" },
      { term: "wreck", meaning: "enkaz", partOfSpeech: "n" },
      { term: "sink", meaning: "batmak", partOfSpeech: "v" },
      { term: "explore", meaning: "keşfetmek, incelemek, araştırmak", partOfSpeech: "v" },
      { term: "fast", meaning: "hızlıca, hızlı bir şekilde", partOfSpeech: "adv" },
      { term: "recent", meaning: "yeni, yeni tarihli, son günlerdeki", partOfSpeech: "adj" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "It is stated in the passage that the Titanic disaster ----.",
        options: [
          "A) caused many explorers to look for the Titanic",
          "B) caused some rules and regulations to change",
          "C) resulted in the changes in future ship designs"
        ],
        answer: "B"
      },
      {
        id: 2,
        question: "The remains of the Titanic were ----.",
        options: [
          "A) found accidentally",
          "B) discovered by Ice Patrol",
          "C) never explored in detail"
        ],
        answer: "B"
      },
      {
        id: 3,
        question: "There weren't plenty of lifeboats on the Titanic since ----.",
        options: [
          "A) there weren't any international laws related to lifeboats",
          "B) they thought the number of lifeboats would be enough",
          "C) the designers of the ship thought it would never sink"
        ],
        answer: "C"
      },
      {
        id: 4,
        question: "The underlined word 'collision' in the passage is closest in meaning to ----.",
        options: [
          "A) failure",
          "B) struggle",
          "C) crash"
        ],
        answer: "C"
      },
      {
        id: 5,
        question: "Which of the following is FALSE about the Titanic disaster?",
        options: [
          "A) Few movies about the disaster have been successful.",
          "B) The remains of the ship were discovered in 1985.",
          "C) The Titanic went under the ocean very rapidly."
        ],
        answer: "A"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "The underlined word 'collision' is closest in meaning to ----.",
        options: ["A) failure", "B) struggle", "C) crash"],
        answer: "C"
      },
      {
        id: 2,
        question: "'establish' is closest in meaning to ----.",
        options: ["A) drown", "B) set up", "C) sink"],
        answer: "B"
      },
      {
        id: 3,
        question: "'fast' is the antonym of the word ----.",
        options: ["A) slowly", "B) recent", "C) passenger"],
        answer: "A"
      },
      {
        id: 4,
        question: "Which of the following is negative in meaning?",
        options: ["A) safety", "B) drown", "C) passenger"],
        answer: "B"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 34,
    title: "The Shard: The Tallest Tower in London",
    cefr: "B2",
    theme: "Passive Voice & Reported Speech",
    paragraphs: [
      "In early February 2013, the tallest building in the EU was opened to the public. This structure was originally known as London Bridge Tower but became the Shard, after critics claimed it looked like \"a shard of glass\".",
      "The Shard was designed in the year 2000 by an Italian architect called Renzo Piano. He is said to have been inspired by church designs across the city of London. In 1998, a property developer called Irvine Sellar purchased a site near London Bridge and later met with Renzo Piano in a restaurant to discuss the redevelopment of the area. It has been reported that Mr Piano at first rejected the idea of designing a tall building, as he believed they were \"statements of arrogance\"; however, he was later persuaded to participate in the project.",
      "The Shard was constructed around a very strong concrete centre, which contains key building services such as escape routes and 44 lifts. To ensure that people can move around the building efficiently, the offices will be serviced by lifts. The structure is designed to move as much as 20 inches if necessary, so that the centre of the building can withstand forces such as high winds and earthquakes. In total, 11,000 glass panels have been used and the glass exterior is 56,000 square metres. An interesting fact is that the Shard was built using approximately 95% recycled materials."
    ],
    vocabulary: [
      { term: "public", meaning: "halk", partOfSpeech: "n" },
      { term: "redevelopment", meaning: "yenileme, yeniden geliştirmek", partOfSpeech: "n" },
      { term: "structure", meaning: "yapı, bina", partOfSpeech: "n" },
      { term: "reject", meaning: "kabul etmemek, karşı çıkmak", partOfSpeech: "v" },
      { term: "claim", meaning: "iddia etmek", partOfSpeech: "v" },
      { term: "arrogance", meaning: "kibir", partOfSpeech: "n" },
      { term: "shard", meaning: "parça", partOfSpeech: "n" },
      { term: "statement", meaning: "ifade", partOfSpeech: "n" },
      { term: "inspire", meaning: "ilham vermek", partOfSpeech: "v" },
      { term: "persuade", meaning: "ikna etmek", partOfSpeech: "v" },
      { term: "church", meaning: "kilise", partOfSpeech: "n" },
      { term: "participate", meaning: "katılmak", partOfSpeech: "v" },
      { term: "property", meaning: "mülk, gayri menkul", partOfSpeech: "n" },
      { term: "concrete", meaning: "beton", partOfSpeech: "n" },
      { term: "developer", meaning: "geliştirici", partOfSpeech: "n" },
      { term: "lift", meaning: "asansör", partOfSpeech: "n" },
      { term: "purchase", meaning: "satın almak", partOfSpeech: "v" },
      { term: "efficiently", meaning: "etkin şekilde", partOfSpeech: "" },
      { term: "withstand", meaning: "dayanmak, katlanmak", partOfSpeech: "v" },
      { term: "recycle", meaning: "geri dönüşüm yapmak", partOfSpeech: "v" },
      { term: "exterior", meaning: "dış, dış cephe", partOfSpeech: "n" },
      { term: "skyscraper", meaning: "gökdelen", partOfSpeech: "n" },
      { term: "approximately", meaning: "aşağı yukarı, yaklaşık", partOfSpeech: "" },
      { term: "compose", meaning: "bestelemek", partOfSpeech: "v" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "It can be understood from the passage that ----.",
        options: [
          "A) no building in Europe is taller than the Shard",
          "B) the Shard is the totally made of glass",
          "C) many people objected to the building of the Shard"
        ],
        answer: "A"
      },
      {
        id: 2,
        question: "It is clear from the passage that the designer of the Shard ----.",
        options: [
          "A) had never built any tall building until he agreed to design it",
          "B) benefitted from the designs of some structures while working for its design",
          "C) is now running a restaurant which is very close it"
        ],
        answer: "B"
      },
      {
        id: 3,
        question: "It is understood from the passage that while designing the Shard, the designer ----.",
        options: [
          "A) felt worried because of the high number of glass panels",
          "B) first thought more than 44 escape routes and lifts were necessary",
          "C) took security and possible risk factors into account"
        ],
        answer: "C"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "Which of the following is negative in meaning?",
        options: ["A) inspire", "B) arrogant", "C) efficiently"],
        answer: "B"
      },
      {
        id: 2,
        question: "'about / around' is closest in meaning to ----.",
        options: ["A) inspire", "B) concrete", "C) approximately"],
        answer: "C"
      },
      {
        id: 3,
        question: "'withstand' is closest in meaning to ----.",
        options: ["A) resist", "B) design", "C) inspire"],
        answer: "A"
      },
      {
        id: 4,
        question: "The tower will be known ---- the best place in town.",
        options: ["A) off", "B) as", "C) in"],
        answer: "B"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 35,
    title: "The Story of Tattoos",
    cefr: "B1",
    theme: "Present Simple & Passive Voice",
    paragraphs: [
      "A tattoo is a picture or writing on your body. It is marked on your skin by putting ink into it. The word tattoo comes from the word \"tatau\". It means \"symbol\" in Polynesian. Tattoos are made on human or animal skin. People get tattoos because they think they look beautiful. Some people also get tattoos to show that they are members of a gang or culture group. Animal tattoos are used to identify animals on big farms. When farmers see the logo or letter of their farm on an animal, they know that it is their own cow or sheep, so they never lose any animals.",
      "Most people get tattoos in a tattoo shop. These places need to be clean and reliable. If they are dirty, getting a tattoo can be dangerous. People may catch some illnesses when they go to a tattoo shop which is dirty. Also, many people are allergic to the dyes in tattoos and have some health problems after they get them. Getting a tattoo is also painful. Some people experience more pain than others, and some parts of the body are more sensitive to pain than other parts. People say that getting a tattoo on their foot or behind their ear hurts more than on other parts. However, everyone feels some pain while they are getting a tattoo no matter where it is placed.",
      "Tattooing is an ancient art. It has existed for more than 5,000 years. Otzi the Iceman, a man who lived around 3300 BC, had 57 tattoos. Scientists found his body in the Alps in 1991. The tattoos on his body were possibly an early form of medicine because people got tattoos for health problems at that time. Tattoos were also used by the ancient civilisations for medicine and for other reasons, such as magic and power.",
      "Tattoos became popular in the Western world after sailors visited the American Indians and Polynesians during the 1700s. A British explorer, James Cook, visited Tahiti and New Zealand in 1769. He wrote about people who were getting tattoos on their faces. Today Polynesian people like the Māori in New Zealand still have face tattoos. These tattoos are called \"moko\" and have a religious meaning. They also show a person's status.",
      "Many celebrities have tattoos, too. Footballer David Beckham, and his wife, Victoria, both have tattoos of their first son's name, Brooklyn. David has one on his back and Victoria has one on her left arm. Other famous people include singers, and actors such as Robbie Williams, Britney Spears, and Angelina Jolie."
    ],
    vocabulary: [
      { term: "tattoo", meaning: "dövme", partOfSpeech: "n" },
      { term: "writing", meaning: "yazı", partOfSpeech: "n" },
      { term: "mark", meaning: "işaretlemek, iz bırakmak", partOfSpeech: "v" },
      { term: "symbol", meaning: "sembol", partOfSpeech: "n" },
      { term: "human", meaning: "insan", partOfSpeech: "n" },
      { term: "skin", meaning: "deri", partOfSpeech: "n" },
      { term: "show", meaning: "göstermek", partOfSpeech: "v" },
      { term: "gang", meaning: "çete", partOfSpeech: "n" },
      { term: "logo", meaning: "logo", partOfSpeech: "n" },
      { term: "cow", meaning: "inek", partOfSpeech: "n" },
      { term: "reliable", meaning: "güvenilir, sağlam", partOfSpeech: "adj" },
      { term: "dirty", meaning: "kirli", partOfSpeech: "adj" },
      { term: "allergic", meaning: "alerjik", partOfSpeech: "adj" },
      { term: "dye", meaning: "boya", partOfSpeech: "n" },
      { term: "painful", meaning: "sancılı, ağrılı", partOfSpeech: "adj" },
      { term: "pain", meaning: "acı, ağrı", partOfSpeech: "n" },
      { term: "sensitive", meaning: "hassas", partOfSpeech: "adj" },
      { term: "foot", meaning: "ayak", partOfSpeech: "n" },
      { term: "ear", meaning: "kulak", partOfSpeech: "n" },
      { term: "hurt", meaning: "acımak, incinmek, ağrımak", partOfSpeech: "v" },
      { term: "ancient", meaning: "eski, antik, kadim", partOfSpeech: "adj" },
      { term: "exist", meaning: "var olmak", partOfSpeech: "v" },
      { term: "body", meaning: "vücut, ceset", partOfSpeech: "n" },
      { term: "possibly", meaning: "muhtemelen", partOfSpeech: "adv" },
      { term: "civilisation", meaning: "medeniyet", partOfSpeech: "n" },
      { term: "magic", meaning: "sihir", partOfSpeech: "n" },
      { term: "power", meaning: "güç", partOfSpeech: "n" },
      { term: "sailor", meaning: "denizci", partOfSpeech: "n" },
      { term: "explorer", meaning: "kaşif", partOfSpeech: "n" },
      { term: "face", meaning: "yüz", partOfSpeech: "n" },
      { term: "meaning", meaning: "anlam", partOfSpeech: "n" },
      { term: "status", meaning: "statü", partOfSpeech: "n" },
      { term: "celebrity", meaning: "ünlü", partOfSpeech: "n" },
      { term: "back", meaning: "sırt", partOfSpeech: "n" },
      { term: "left", meaning: "sol", partOfSpeech: "adj" },
      { term: "arm", meaning: "kol", partOfSpeech: "n" },
      { term: "singer", meaning: "şarkıcı", partOfSpeech: "n" },
      { term: "actor", meaning: "oyuncu", partOfSpeech: "n" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "Which of the following is not one of the reasons why people get tattoos?",
        options: [
          "A) To become more good-looking.",
          "B) To show that they appreciate art.",
          "C) To be involved in a special group."
        ],
        answer: "B"
      },
      {
        id: 2,
        question: "The underlined word 'identify' in paragraph 1 is closest in meaning to ----.",
        options: [
          "A) recognise",
          "B) learn",
          "C) describe"
        ],
        answer: "A"
      },
      {
        id: 3,
        question: "Paragraph 1 is mainly about the ----.",
        options: [
          "A) history of tattoos",
          "B) origin of the word tattoo",
          "C) different uses of tattoos"
        ],
        answer: "C"
      },
      {
        id: 4,
        question: "The underlined pronoun 'they' in paragraph 2 refers to ----.",
        options: [
          "A) tattoos",
          "B) tattoo shops",
          "C) people making tattoos"
        ],
        answer: "B"
      },
      {
        id: 5,
        question: "The author's main purpose in paragraph 2 is to ----.",
        options: [
          "A) exemplify the bad experiences of people getting tattoos",
          "B) give information about the right places to get tattoos",
          "C) warn the audience about the risks of getting tattoos"
        ],
        answer: "C"
      },
      {
        id: 6,
        question: "Which of the following is FALSE according to paragraph 2?",
        options: [
          "A) Some people feel no pain while they are getting tattoos.",
          "B) Some people may face problems after getting tattoos.",
          "C) Many people show a reaction to a substance in tattoos."
        ],
        answer: "A"
      },
      {
        id: 7,
        question: "Which of the following could be the best title for paragraph 3?",
        options: [
          "A) The Art of Tattoos",
          "B) The Early History of Tattoos",
          "C) The Research into Tattoos"
        ],
        answer: "B"
      },
      {
        id: 8,
        question: "According to paragraph 3, which of the following is not one the reasons why ancient people got tattoos?",
        options: [
          "A) To become stronger",
          "B) To recover from illnesses",
          "C) To protect their civilisation"
        ],
        answer: "C"
      },
      {
        id: 9,
        question: "Which of the following is TRUE about face tattoos in paragraph 4?",
        options: [
          "A) James Cook did not like the ones in Tahiti.",
          "B) They are still popular among Māori people.",
          "C) British explorers got them for their religion."
        ],
        answer: "B"
      },
      {
        id: 10,
        question: "According to paragraph 5, David Beckham's tattoo is ----.",
        options: [
          "A) the same as his wife's",
          "B) his own family name",
          "C) on his left arm"
        ],
        answer: "A"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'ancient' is the antonym of the word ----.",
        options: ["A) modern", "B) painful", "C) reliable"],
        answer: "A"
      },
      {
        id: 2,
        question: "'reliable' is closest in meaning to ----.",
        options: ["A) trustworthy", "B) dirty", "C) allergic"],
        answer: "A"
      },
      {
        id: 3,
        question: "Which of the following is a part of the human body?",
        options: ["A) ear", "B) ink", "C) dye"],
        answer: "A"
      },
      {
        id: 4,
        question: "A tattoo is marked ---- your skin.",
        options: ["A) on", "B) in", "C) at"],
        answer: "A"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 36,
    title: "The Sweet History of Chocolate",
    cefr: "B1",
    theme: "Passive Voice & Sequencing",
    paragraphs: [
      "Chocolate is a very popular gift around the world for many different occasions. It simply makes people feel happy and energetic. Why is chocolate so popular? Where does it come from originally? Well, first of all, chocolate is made from cocoa beans. It was a spicy drink before it became a food. The people of Central America and Mexico were the first people to drink it thousands of years ago. Also, the drink was used by the Aztecs as part of their religious ceremonies. People say that the Aztec Emperor Montezuma drank fifty cups of chocolate each day! Cocoa beans were also used as a form of currency. In other words, cocoa beans were like money. For example, you could buy a rabbit for ten cocoa beans.",
      "Cocoa beans were brought by Spanish explorers to Europe in the 16th century. At that time, only rich people could afford drinking chocolate because it was expensive to bring the cocoa beans and sugar from Central America. People didn’t start to eat chocolate until about 150 years ago. Nowadays chocolate isn’t only for rich people, but for everyone. Europeans are the biggest consumers of chocolate. They mostly eat chocolate between 8.00 pm and midnight.",
      "Eating too much chocolate is not good because there is a lot of sugar and fat in it. However, some scientists say eating small amounts of chocolate can be good for you. They suggest that eating a little dark chocolate once or twice a week can help prevent heart diseases. Also, dark chocolate is better for you than milk chocolate because it contains more cocoa.",
      "You can eat or drink chocolate but you could also use it to run your car! In 2007 a team of British people drove a special truck 4,500 miles from the UK across the Sahara Desert to Timbuktu in Mali, West Africa. A special fuel was used. It was made from waste chocolate!",
      "Every year a chocolate company in the United States has a competition. The prize is a chocolate hotel room! Yes, almost everything in the room is made of chocolate. For example, the walls are covered in chocolate, the pictures on the walls are made of chocolate pieces and even the furniture is partly covered in chocolate. The lucky winner can eat as much chocolate as they like!",
      "When you fall in love, your body produces a chemical naturally. Interestingly, chocolate contains the same chemical. Because of this, chocolate is still a popular romantic gift in many parts of the world."
    ],
    vocabulary: [
      { term: "chocolate", meaning: "çikolata", partOfSpeech: "n" },
      { term: "suggest", meaning: "önermek, tavsiye etmek", partOfSpeech: "v" },
      { term: "occasion", meaning: "durum, vesile, olay", partOfSpeech: "n" },
      { term: "prevent", meaning: "önlemek, engellemek", partOfSpeech: "v" },
      { term: "simply", meaning: "basitçe, basit bir şekilde", partOfSpeech: "adv" },
      { term: "milk", meaning: "süt", partOfSpeech: "n" },
      { term: "energetic", meaning: "enerjik", partOfSpeech: "adj" },
      { term: "contain", meaning: "içermek, kapsamak", partOfSpeech: "v" },
      { term: "originally", meaning: "aslen, aslında, köken itibari ile", partOfSpeech: "adv" },
      { term: "truck", meaning: "kamyon", partOfSpeech: "n" },
      { term: "cocoa bean", meaning: "kakao çekirdeği", partOfSpeech: "n" },
      { term: "fuel", meaning: "yakıt", partOfSpeech: "n" },
      { term: "spicy", meaning: "baharatlı", partOfSpeech: "adj" },
      { term: "competition", meaning: "yarışma", partOfSpeech: "n" },
      { term: "ceremony", meaning: "merasim, tören", partOfSpeech: "n" },
      { term: "prize", meaning: "ödül", partOfSpeech: "n" },
      { term: "emperor", meaning: "imparator, hükümdar", partOfSpeech: "n" },
      { term: "room", meaning: "oda", partOfSpeech: "n" },
      { term: "currency", meaning: "para birimi", partOfSpeech: "n" },
      { term: "wall", meaning: "duvar", partOfSpeech: "n" },
      { term: "rabbit", meaning: "tavşan", partOfSpeech: "n" },
      { term: "cover", meaning: "kaplamak, örtmek", partOfSpeech: "v" },
      { term: "afford", meaning: "(satın almaya) gücü yetmek", partOfSpeech: "v" },
      { term: "partly", meaning: "kısmen", partOfSpeech: "adv" },
      { term: "eat", meaning: "yemek", partOfSpeech: "v" },
      { term: "lucky", meaning: "şanslı", partOfSpeech: "adj" },
      { term: "nowadays", meaning: "bugünlerde", partOfSpeech: "adv" },
      { term: "winner", meaning: "galip, kazanan", partOfSpeech: "n" },
      { term: "consumer", meaning: "tüketici", partOfSpeech: "n" },
      { term: "fall in love", meaning: "aşık olmak", partOfSpeech: "phr. v" },
      { term: "midnight", meaning: "gece yarısı", partOfSpeech: "n" },
      { term: "naturally", meaning: "doğal olarak, doğal şekilde", partOfSpeech: "adv" },
      { term: "fat", meaning: "yağ", partOfSpeech: "n" },
      { term: "interestingly", meaning: "ilginç biçimde, ilginç şekilde", partOfSpeech: "adv" },
      { term: "amount", meaning: "miktar", partOfSpeech: "n" },
      { term: "romantic", meaning: "romantik", partOfSpeech: "adj" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "We can understand from paragraph 1 that in ancient times, chocolate was ----.",
        options: [
          "A) first used by Mexicans during some rituals",
          "B) a kind of drink before people started eating it",
          "C) consumed by kings as a kind of spicy food"
        ],
        answer: "B"
      },
      {
        id: 2,
        question: "Which of the following could be the best title for paragraph 1?",
        options: [
          "A) The Origins and Uses of Chocolate",
          "B) The Myths and Facts about Chocolate",
          "C) Chocolate The Royal Food"
        ],
        answer: "A"
      },
      {
        id: 3,
        question: "The underlined word 'afford' in paragraph 2 is closest in meaning to ----.",
        options: [
          "A) look for",
          "B) ask for",
          "C) pay for"
        ],
        answer: "C"
      },
      {
        id: 4,
        question: "According to paragraph 2, chocolate was not a cheap product since ----.",
        options: [
          "A) it was difficult to find cocoa beans",
          "B) its transportation cost lots of money",
          "C) it was an expensive crop to grow"
        ],
        answer: "B"
      },
      {
        id: 5,
        question: "It can be inferred from paragraph 2 that ----.",
        options: [
          "A) Spanish explorers were the first people to discover chocolate",
          "B) people in Europe tend not to have chocolate before evening",
          "C) chocolate in Central America is far cheaper than in Europe"
        ],
        answer: "B"
      },
      {
        id: 6,
        question: "Paragraph 3 is mainly about ----.",
        options: [
          "A) the health benefits of eating chocolate in small amounts",
          "B) why milk chocolate is less beneficial than dark one",
          "C) the detrimental effects of consuming too much chocolate"
        ],
        answer: "A"
      },
      {
        id: 7,
        question: "We can understand from paragraph 4 that some people ----.",
        options: [
          "A) carry out research into renewable energy",
          "B) took chocolate to underdeveloped regions",
          "C) used chocolate for an unusual purpose"
        ],
        answer: "C"
      },
      {
        id: 8,
        question: "The underlined word 'competition' in paragraph 5 is closest in meaning to ----.",
        options: [
          "A) reservation",
          "B) treatment",
          "C) contest"
        ],
        answer: "C"
      },
      {
        id: 9,
        question: "Which of the following is FALSE about the hotel room in paragraph 5?",
        options: [
          "A) The entire room is made of chocolate.",
          "B) An American company organizes the event.",
          "C) The competition takes place once a year."
        ],
        answer: "A"
      },
      {
        id: 10,
        question: "Which of the following is TRUE about chocolate according to paragraph 6?",
        options: [
          "A) Eating chocolate causes your body to produce a hormone.",
          "B) Chocolate is still exchanged as a popular present in the world.",
          "C) Falling in love makes you wish to consume chocolate more."
        ],
        answer: "B"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'contain' is closest in meaning to ----.",
        options: ["A) include", "B) eat", "C) afford"],
        answer: "A"
      },
      {
        id: 2,
        question: "'prize' is closest in meaning to ----.",
        options: ["A) rabbit", "B) award", "C) consumer"],
        answer: "B"
      },
      {
        id: 3,
        question: "Which of the following is used to talk about a person?",
        options: ["A) winner", "B) truck", "C) wall"],
        answer: "A"
      },
      {
        id: 4,
        question: "Which of the following is positive in meaning?",
        options: ["A) lucky", "B) sugar", "C) fat"],
        answer: "A"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 37,
    title: "Ambidexterity: Using Both Hands",
    cefr: "B2",
    theme: "Relative Clauses",
    paragraphs: [
      "People who can use both of their hands equally well are called ambidextrous. Ambidexterity can be extremely advantageous to athletes whose sports require an equal amount of dexterity in both hands, and sometimes feet, as well.",
      "Ambidexterity is beneficial for artists as well. The famous artist Michelangelo who painted the ceiling of the Sistine Chapel was able to substitute one hand for the other when one of his hands got tired. Another famous artist from the 1800s, Landseer, was able to work on two completely different drawings at the same time, one with each hand, which must have enabled him to complete his work faster.",
      "Perhaps even more extraordinary were the skills of the 20th U.S. president, James Garfield, who never failed to amaze all who witnessed it. Garfield was not only able to write different things with two hands at the same time is quite a success but he could write in Greek with the left hand and in Latin with the right.",
      "Speaking of Greek, the Greeks were aware of the great benefits of ambidexterity in both sports and in battle. They even created a style of writing which combined right to left and left to right eye movement. In addition to being more efficient, it was believed by some that this type of reading might help to balance the two hemispheres of the brain which some believe is necessary for true ambidexterity."
    ],
    vocabulary: [
      { term: "ambidexterity", meaning: "her iki elini de maharetle kullanabilme", partOfSpeech: "n" },
      { term: "equally", meaning: "eşit derecede", partOfSpeech: "adv" },
      { term: "extremely", meaning: "aşırı şekilde, çok", partOfSpeech: "adv" },
      { term: "require", meaning: "gerektirmek", partOfSpeech: "v" },
      { term: "dexterity", meaning: "hüner, maharet", partOfSpeech: "n" },
      { term: "beneficial", meaning: "faydalı, yararlı", partOfSpeech: "adj" },
      { term: "completely", meaning: "tamamen, bütünüyle", partOfSpeech: "adv" },
      { term: "amount", meaning: "miktar", partOfSpeech: "n" },
      { term: "enable", meaning: "olanak sağlamak, mümkün kılmak", partOfSpeech: "v" },
      { term: "extraordinary", meaning: "sıradışı", partOfSpeech: "adj" },
      { term: "witness", meaning: "tanıklık etmek", partOfSpeech: "v" },
      { term: "success", meaning: "başarı", partOfSpeech: "n" },
      { term: "combine", meaning: "birleştirmek", partOfSpeech: "v" },
      { term: "balance", meaning: "dengelemek", partOfSpeech: "v" },
      { term: "hemisphere", meaning: "yarımküre, lob", partOfSpeech: "n" },
      { term: "efficient", meaning: "etkili, etkin, verimli", partOfSpeech: "adj" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "Ambidextrous people can use ---- hands skillfully.",
        options: [
          "A) both",
          "B) neither",
          "C) each"
        ],
        answer: "A"
      },
      {
        id: 2,
        question: "The underlined word \"substitute\" in the passage is closest in meaning to ----.",
        options: [
          "A) spend",
          "B) write",
          "C) exchange"
        ],
        answer: "C"
      },
      {
        id: 3,
        question: "According to the passage Michelangelo ----.",
        options: [
          "A) had to use both hands because of his job",
          "B) could work on two drawings at the same time",
          "C) Hans and his family live in the countryside."
        ],
        answer: "B"
      },
      {
        id: 4,
        question: "James Garfield was an extraordinary ambidextruous because he ----.",
        options: [
          "A) read and write Greek and Latin",
          "B) became the first US President with ambidexterity",
          "C) write in two different languages at the same time"
        ],
        answer: "C"
      },
      {
        id: 5,
        question: "Ambidexterity is believed to ----.",
        options: [
          "A) balance the hemispheres of the brain",
          "B) combine different learning skills",
          "C) bring little sports and in battle"
        ],
        answer: "A"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'usual' is the antonym of the word ----.",
        options: ["A) extraordinary", "B) witness", "C) success"],
        answer: "A"
      },
      {
        id: 2,
        question: "'useful' is closest in meaning to ----.",
        options: ["A) dexterity", "B) beneficial", "C) enable"],
        answer: "B"
      },
      {
        id: 3,
        question: "Which of the following is about geography?",
        options: ["A) witness", "B) require", "C) hemisphere"],
        answer: "C"
      },
      {
        id: 4,
        question: "'moderately' is the antonym of the word ----.",
        options: ["A) extremely", "B) equally", "C) completely"],
        answer: "A"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 38,
    title: "Anne Frank and the Holocaust",
    cefr: "B1",
    theme: "Past Simple Biography",
    paragraphs: [
      "The Holocaust was when Nazi Germany killed Jewish people during World War II (WW2). Almost six million Jews were killed. Anne Frank is one of the most famous Jewish people who died in the Holocaust. Her diary which is one of the most popular books today is seen as a classic in war literature. There are many plays and movies about the diary.",
      "Anne Frank was the second daughter of Otto Frank, a German businessman, and Edith Frank-Holländer. The Franks were Jews who lived with many Jewish and non-Jewish citizens. Anne and her older sister Margot grew up with Catholic, Protestant, and Jewish friends. Their mother was very religious, but their father was more interested in studying. Their father who had a large library wanted his children to read like him.",
      "The Nazis became powerful in Germany in 1933. The Franks were afraid of the Nazis and didn't want to stay in Germany. So later that year, Edith and the children went to Aachen. They stayed there with Edith's mother, Rosa Holländer. Otto continued to live in Frankfurt, but later he moved to Amsterdam to begin a new business and find a place to live with his family. Anne and Margot began going to school. Margot went to a public school and Anne went to a Montessori school. Margot liked maths, and Anne enjoyed reading and writing. Anne often wrote, but she tried to hide her writings and did not like talking about them. Margot and Anne had very different personalities. Margot was polite, quiet, and thoughtful, but Anne was brave, energetic, and friendly.",
      "In 1940, Nazi soldiers went to Amsterdam. They started to hurt and kill the Jews. Many people left the city, but the family decided to hide. They hid in the secret rooms of Otto Frank's office building for two years. A few months before the Franks went into hiding, her father gave Anne a notebook for her birthday. She called it \"Kitty\" in which she wrote about all the things that were happening to her and to her family. Anne was only a young girl, but she knew how to write beautifully. She wrote about all the things that young girls think about – her friends and parents, boys, her life and emotions. After a while, Anne had a strong ambition: to become a writer. She hoped to write a book that everyone would read.",
      "After two years of hiding, Nazi soldiers came into the Frank's secret hiding place. They sent the Franks to a concentration camp where Edith Frank was killed and Anne and Margot died from a disease. Anne's father, Otto Frank, was the only person to survive the war and came back to Amsterdam where unfortunately, he couldn't find his family. Otto Frank lived through much pain. When he felt better, he found Anne's diary which then was published."
    ],
    vocabulary: [
      { term: "holocaust", meaning: "soykırım, katliam", partOfSpeech: "n" },
      { term: "Germany", meaning: "Almanya", partOfSpeech: "n" },
      { term: "Jewish", meaning: "Yahudi, Yahudilik dinine ilişkin", partOfSpeech: "adj" },
      { term: "Jew", meaning: "Yahudi", partOfSpeech: "n" },
      { term: "classic", meaning: "klasik", partOfSpeech: "n" },
      { term: "play", meaning: "oyun", partOfSpeech: "n" },
      { term: "businessman", meaning: "işadamı", partOfSpeech: "n" },
      { term: "citizen", meaning: "vatandaş", partOfSpeech: "n" },
      { term: "grow up", meaning: "yetişmek, büyümek", partOfSpeech: "phr. v" },
      { term: "Protestant", meaning: "Protestan", partOfSpeech: "adj" },
      { term: "powerful", meaning: "güçlü", partOfSpeech: "adj" },
      { term: "hide", meaning: "saklamak, saklanmak", partOfSpeech: "v" },
      { term: "personality", meaning: "kişilik", partOfSpeech: "n" },
      { term: "polite", meaning: "kibar", partOfSpeech: "adj" },
      { term: "thoughtful", meaning: "düşünceli", partOfSpeech: "adj" },
      { term: "brave", meaning: "cesur", partOfSpeech: "adj" },
      { term: "friendly", meaning: "arkadaş canlısı", partOfSpeech: "adj" },
      { term: "soldier", meaning: "asker", partOfSpeech: "n" },
      { term: "hunt", meaning: "avlamak, avlanmak", partOfSpeech: "v" },
      { term: "decide", meaning: "karar vermek", partOfSpeech: "v" },
      { term: "notebook", meaning: "defter, not defteri", partOfSpeech: "n" },
      { term: "birthday", meaning: "doğum günü", partOfSpeech: "n" },
      { term: "beautifully", meaning: "güzel bir şekilde, güzelce", partOfSpeech: "adv" },
      { term: "emotion", meaning: "duygu, his", partOfSpeech: "n" },
      { term: "strong", meaning: "güçlü, kuvvetli", partOfSpeech: "adj" },
      { term: "ambition", meaning: "hırs, tutku, heves", partOfSpeech: "n" },
      { term: "come into", meaning: "girmek, gelmek", partOfSpeech: "phr. v" },
      { term: "concentration camp", meaning: "toplama kampı", partOfSpeech: "n" },
      { term: "survive", meaning: "hayatta kalmak, sağ çıkmak", partOfSpeech: "v" },
      { term: "publish", meaning: "yayımlamak, basmak", partOfSpeech: "v" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "It is stated paragraph 1 that Anne Frank became famous owing to her ----.",
        options: [
          "A) death in the Holocaust",
          "B) movies",
          "C) diary"
        ],
        answer: "C"
      },
      {
        id: 2,
        question: "We can understand from paragraph 1 that ----.",
        options: [
          "A) many literary works were published during the war",
          "B) Holocaust claimed the lives of millions of people",
          "C) Anne Frank was the most popular figure in WW2"
        ],
        answer: "B"
      },
      {
        id: 3,
        question: "According to paragraph 2, Otto Frank ----.",
        options: [
          "A) had no religion",
          "B) liked reading",
          "C) did business with Jews"
        ],
        answer: "B"
      },
      {
        id: 4,
        question: "According to paragraph 3, Anne and Margot ----.",
        options: [
          "A) had dissimilar personality traits",
          "B) attended the same school",
          "C) liked similar subjects at school"
        ],
        answer: "A"
      },
      {
        id: 5,
        question: "It is stated in paragraph 3 that Anne Frank, her sister and mother went to Aachen to ----.",
        options: [
          "A) find better schools",
          "B) start a new business",
          "C) find a safe place to live"
        ],
        answer: "C"
      },
      {
        id: 6,
        question: "According to paragraph 3, although Anne Frank kept a diary regularly, she ----.",
        options: [
          "A) didn't enjoy it much",
          "B) wanted to keep it secret",
          "C) also told Margo about it"
        ],
        answer: "B"
      },
      {
        id: 7,
        question: "The underlined pronoun 'They' in paragraph 4 refers to ----.",
        options: [
          "A) Nazi soldiers",
          "B) the family",
          "C) the Jews"
        ],
        answer: "A"
      },
      {
        id: 8,
        question: "It is stated in paragraph 4 that Kitty is the name of the ----.",
        options: [
          "A) notebook Anne started using",
          "B) hiding place the family stayed in",
          "C) young girl in Anne's school"
        ],
        answer: "A"
      },
      {
        id: 9,
        question: "The underlined word 'ambition' in paragraph 4 is closest in meaning to ----.",
        options: [
          "A) evidence",
          "B) resistance",
          "C) desire"
        ],
        answer: "C"
      },
      {
        id: 10,
        question: "Which of the following is FALSE according to paragraph 5?",
        options: [
          "A) Anne and Margot lost their lives because they got sick.",
          "B) Otto Frank was able to find the diary after a while.",
          "C) Nazi soldiers could only find Edith Frank in the secret place."
        ],
        answer: "C"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "Which of the following is a country?",
        options: ["A) Jew", "B) Protestant", "C) Germany"],
        answer: "C"
      },
      {
        id: 2,
        question: "'powerful' is closest in meaning to ----.",
        options: ["A) strong", "B) thoughtful", "C) brave"],
        answer: "A"
      },
      {
        id: 3,
        question: "Which of the following is positive in meaning?",
        options: ["A) hunt", "B) polite", "C) afraid"],
        answer: "B"
      },
      {
        id: 4,
        question: "Which of the following is used to talk about a person?",
        options: ["A) soldier", "B) classic", "C) notebook"],
        answer: "A"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 39,
    title: "Jeffrey and the Surprise Quiz",
    cefr: "B1",
    theme: "Noun Clauses (Wh- words)",
    paragraphs: [
      "What Mrs. Murphy is doing is the reason why Jeffrey is so worried. Mrs. Murphy is giving her students a \"surprise\" history quiz today, and Jeffrey isn't very happy about it. He has been absent for the past several days, and he's having a lot of trouble answering the questions.",
      "He doesn't know who the nineteenth president of the United States was. He isn't sure when the Civil War ended. He doesn't remember when California became a state. He has forgotten where George Washington was born. He can't remember how many people signed the Declaration of Independence. He doesn't know where Abraham Lincoln was assassinated. He has forgotten why Washington D.C. was chosen as the capital. And he has no idea what Alexander Graham Bell invented!",
      "Jeffrey is very upset. He's sure he's going to fail Mrs. Murphy's \"surprise\" history quiz. He doesn't know what to do."
    ],
    vocabulary: [
      { term: "reason", meaning: "sebep", partOfSpeech: "n" },
      { term: "forget", meaning: "unutmak", partOfSpeech: "v" },
      { term: "worried", meaning: "endişeli", partOfSpeech: "adj" },
      { term: "sign", meaning: "imzalamak", partOfSpeech: "v" },
      { term: "quiz", meaning: "sınav", partOfSpeech: "n" },
      { term: "declaration", meaning: "bildiri, ilan", partOfSpeech: "n" },
      { term: "absent", meaning: "yok, mevcut değil", partOfSpeech: "adj" },
      { term: "independence", meaning: "bağımsızlık", partOfSpeech: "n" },
      { term: "several", meaning: "çeşitli, bir kaç", partOfSpeech: "adv" },
      { term: "assassinate", meaning: "suikast yapmak", partOfSpeech: "v" },
      { term: "trouble", meaning: "sıkıntı, problem", partOfSpeech: "n" },
      { term: "invent", meaning: "icat etmek", partOfSpeech: "v" },
      { term: "sure", meaning: "emin, kesin", partOfSpeech: "adj" },
      { term: "remember", meaning: "hatırlamak", partOfSpeech: "v" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "According to the passage, Jeffrey can't answer the questions as ----.",
        options: [
          "A) other students didn't tell him about the history quiz",
          "B) Mrs. Murphy always asks very difficult questions",
          "C) he has been absent from school for a few days"
        ],
        answer: "C"
      },
      {
        id: 2,
        question: "According to the passage, Jeffrey isn't sure ----",
        options: [
          "A) when George Washington was born",
          "B) whether Abraham Lincoln was killed",
          "C) when the Civil War ended"
        ],
        answer: "C"
      },
      {
        id: 3,
        question: "We can infer from the passage that ----.",
        options: [
          "A) Jeffrey is not a very responsible student",
          "B) Mrs. Murphy likes giving surprise quizzes",
          "C) everyone else studied for the quiz"
        ],
        answer: "A"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'present' is the antonym of the word ----.",
        options: ["A) absent", "B) sure", "C) worried"],
        answer: "A"
      },
      {
        id: 2,
        question: "Which of the following is negative in meaning?",
        options: ["A) upset", "B) invent", "C) sign"],
        answer: "A"
      },
      {
        id: 3,
        question: "'select' is closest in meaning to ----.",
        options: ["A) forget", "B) choose", "C) surprise"],
        answer: "B"
      },
      {
        id: 4,
        question: "Which of the following is related to 'quantity'?",
        options: ["A) capital", "B) assassinate", "C) several"],
        answer: "C"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 40,
    title: "Alexander Graham Bell: Inventor of the Telephone",
    cefr: "B1",
    theme: "Relative Clauses & Past Simple",
    paragraphs: [
      "Alexander Graham Bell who was a Scottish-born American was a scientist and inventor. He is most famous for his work on the development of the telephone. Alexander Graham Bell was born on March 3, 1847, in Edinburgh and he went to school there and in London. In 1870, Bell moved to Canada with his family, and the next year he moved to the United States to teach. First his mother didn't want to move to the United States but she went with Bell in the end because she wanted to be with her son. There Bell started a system called Visible Speech which first his father developed. They used this system to teach deaf-mute children. \"Deaf-mute children\" cannot hear and speak. In 1872, Bell started a school in Boston to educate teachers of the deaf.",
      "Bell was always excited about sending speech, and in 1875 he made a simple receiver which could turn electricity into sound. There were other people as well. These people worked on the same thing, one of whom was an Italian-American, Antonio Meucci. Some people say Bell invented the telephone first, but other people say that Meucci was the first person. But the people at the patent office gave Bell a patent for the telephone on March 7, 1876. So a second person couldn't get a patent for it. The telephone developed quickly. In a year there was the first telephone call in Connecticut and Bell started the Bell Telephone Company in 1877. In 1888, Bell started the National Geographic Society, the president of which was him between 1896 and 1904. He also helped to start its gazette. Bell died on August 2, 1922, at his home in Nova Scotia."
    ],
    vocabulary: [
      { term: "work", meaning: "çalışma, iş", partOfSpeech: "n" },
      { term: "speech", meaning: "konuşma", partOfSpeech: "n" },
      { term: "development", meaning: "gelişim, gelişme", partOfSpeech: "n" },
      { term: "receiver", meaning: "alıcı", partOfSpeech: "n" },
      { term: "telephone", meaning: "telefon", partOfSpeech: "n" },
      { term: "electricity", meaning: "elektrik", partOfSpeech: "n" },
      { term: "Canada", meaning: "Kanada", partOfSpeech: "n" },
      { term: "American", meaning: "Amerikalı", partOfSpeech: "adj" },
      { term: "system", meaning: "sistem", partOfSpeech: "n" },
      { term: "patent", meaning: "patent", partOfSpeech: "n" },
      { term: "develop", meaning: "geliştirmek", partOfSpeech: "v" },
      { term: "quickly", meaning: "hızlı bir şekilde, hızlıca", partOfSpeech: "adv" },
      { term: "deaf-mute", meaning: "sağır-dilsiz kişi", partOfSpeech: "n" },
      { term: "national", meaning: "ulusal", partOfSpeech: "adj" },
      { term: "educate", meaning: "eğitmek, öğretmek", partOfSpeech: "v" },
      { term: "society", meaning: "cemiyet, topluluk", partOfSpeech: "n" },
      { term: "excited", meaning: "heyecanlı, coşkulu", partOfSpeech: "adj" },
      { term: "gazette", meaning: "gazete", partOfSpeech: "n" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "Which of the following is TRUE about Graham Bell according to paragraph 1?",
        options: [
          "A) He received his education in the United States.",
          "B) He came up with the idea of a system called Visible Speech.",
          "C) He started teaching in a school after he went to Canada."
        ],
        answer: "B"
      },
      {
        id: 2,
        question: "According to paragraph 1, Bell's mother eventually decided to go to the US because ----.",
        options: [
          "A) she did not want to leave Bell alone there",
          "B) Bell would have better opportunities there",
          "C) Bell was planning to found a school there"
        ],
        answer: "A"
      },
      {
        id: 3,
        question: "Why did Bell establish a special school in Boston according to paragraph 1?",
        options: [
          "A) To improve the system that he started in the United States",
          "B) To provide education for the students called deaf-mute",
          "C) To give training to instructors of hearing-impaired people"
        ],
        answer: "C"
      },
      {
        id: 4,
        question: "We can understand from paragraph 2 that ----.",
        options: [
          "A) Meucci got the patent for the telephone just after Graham Bell",
          "B) there was a controversy over who first invented the telephone",
          "C) Graham Bell started working on the telephone before Meucci"
        ],
        answer: "B"
      },
      {
        id: 5,
        question: "It is stated in paragraph 2 that ----.",
        options: [
          "A) Bell founded his own firm a year after he got the patent",
          "B) Bell Telephone Company developed rapidly in just one year",
          "C) the very first telephone call was made in the year 1876"
        ],
        answer: "A"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'quickly' is closest in meaning to ----.",
        options: ["A) slowly", "B) excited", "C) fast"],
        answer: "C"
      },
      {
        id: 2,
        question: "Which of the following is a country?",
        options: ["A) society", "B) American", "C) Canada"],
        answer: "C"
      },
      {
        id: 3,
        question: "Which of the following is used to talk about a person?",
        options: ["A) deaf-mute", "B) Canada", "C) society"],
        answer: "A"
      },
      {
        id: 4,
        question: "Which of the following is positive in meaning?",
        options: ["A) educate", "B) gazette", "C) excited"],
        answer: "C"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 41,
    title: "The Science of Dreams",
    cefr: "B2",
    theme: "Present Perfect & Explanation",
    paragraphs: [
      "Dreams are pictures, sounds and feelings that happen during sleep. They are often similar to real life in some ways, but they can also be very strange. In dreams, we mostly dream about our thoughts and wishes.",
      "In history, people have had many explanations for dreams. In ancient Greece, people thought that dreaming was a kind of contact with the gods. Sometimes they believed that dreams showed the future. Many scientists have done research on dreams. The most famous expert on dreaming is Sigmund Freud, an Austrian doctor. At the end of the 19th century, he found that our mind is a place where we keep our thoughts and wishes. In dreams, we act out these wishes.",
      "Dreaming is an activity of the brain and it produces electrical waves in the brain. We have dreams when brain waves are especially fast. There are five stages in our sleep. In the first stage, we do not sleep very deeply and we wake up easily. During the other stages, our sleep gets deeper and deeper. At the fourth stage, REM (Rapid Eye Movement) sleep begins. We have most dreams during REM sleep. During REM, our heart rate and breathing get faster. Blood pressure goes up and the brain starts to work but the body does not. That is, we don't act out our dreams because the body is inactive and we can't move it. We can have almost seven REM sleeps in one night.",
      "Everyone dreams. If you think that you never dream, you are wrong. Most of the time, we cannot remember our dreams and think that we don't dream. This is because dreams usually do not have a strong effect on us. So it is difficult to remember them. Also, dreams are never the same and each dream has different details. We can't remember them if they are not repeated. So we forget them easily.",
      "Most people cannot control their dreams, they just happen. Very few people experience something called \"lucid dreaming\". In a lucid dream, people know that they are dreaming. They try to control their dreams and enjoy this experience. It is possible to do anything that the dreamer wants, such as flying, traveling back in time and meeting yourself as a child. Lucid dreamers know that everything is possible because it all depends on your imagination."
    ],
    vocabulary: [
      { term: "feeling", meaning: "his, duygu", partOfSpeech: "n" },
      { term: "movement", meaning: "hareket", partOfSpeech: "n" },
      { term: "sleep", meaning: "uyku", partOfSpeech: "n" },
      { term: "begin", meaning: "başlamak", partOfSpeech: "v" },
      { term: "strange", meaning: "garip, tuhaf", partOfSpeech: "adj" },
      { term: "rate", meaning: "oran", partOfSpeech: "n" },
      { term: "thought", meaning: "düşünce", partOfSpeech: "n" },
      { term: "breathe", meaning: "nefes almak", partOfSpeech: "v" },
      { term: "wish", meaning: "arzu, dilek", partOfSpeech: "n" },
      { term: "blood", meaning: "kan", partOfSpeech: "n" },
      { term: "explanation", meaning: "açıklama", partOfSpeech: "n" },
      { term: "inactive", meaning: "pasif, hareketsiz, aktif olmayan", partOfSpeech: "adj" },
      { term: "Greece", meaning: "Yunanistan", partOfSpeech: "n" },
      { term: "dream", meaning: "rüya görmek", partOfSpeech: "v" },
      { term: "contact", meaning: "iletişim, irtibat", partOfSpeech: "n" },
      { term: "effect", meaning: "etki, tesir", partOfSpeech: "n" },
      { term: "do", meaning: "yapmak", partOfSpeech: "v" },
      { term: "detail", meaning: "ayrıntı, detay", partOfSpeech: "n" },
      { term: "Austrian", meaning: "Avusturyalı", partOfSpeech: "adj" },
      { term: "repeat", meaning: "tekrarlamak, tekrar etmek", partOfSpeech: "v" },
      { term: "mind", meaning: "zihin", partOfSpeech: "n" },
      { term: "control", meaning: "kontrol etmek, denetlemek", partOfSpeech: "v" },
      { term: "wave", meaning: "dalga", partOfSpeech: "n" },
      { term: "lucid dream", meaning: "bilinçli rüya, kontrol edilebilir rüya", partOfSpeech: "n" },
      { term: "stage", meaning: "evre, aşama", partOfSpeech: "n" },
      { term: "experience", meaning: "deneyim, tecrübe", partOfSpeech: "n" },
      { term: "fast", meaning: "hızlı, süratli, çabuk", partOfSpeech: "adj" },
      { term: "possible", meaning: "mümkün, olası", partOfSpeech: "adj" },
      { term: "deeply", meaning: "derinden, derin bir şekilde", partOfSpeech: "adv" },
      { term: "dreamer", meaning: "rüya gören kimse", partOfSpeech: "n" },
      { term: "rapid", meaning: "hızlı, çabuk", partOfSpeech: "adj" },
      { term: "depend on", meaning: "bağlı olmak", partOfSpeech: "phr. v." },
      { term: "eye", meaning: "göz", partOfSpeech: "n" },
      { term: "imagination", meaning: "hayal gücü", partOfSpeech: "n" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "The author's purpose in paragraph 1 is to ----.",
        options: [
          "A) inform the reader about the reasons why we dream",
          "B) compare the real-life experiences and dreams",
          "C) provide the reader with the effects of dreams"
        ],
        answer: "B"
      },
      {
        id: 2,
        question: "Which of the following is TRUE about ancient Greeks in paragraph 2?",
        options: [
          "A) They believed that dreams revealed their past mistakes.",
          "B) They thought they communicated with gods in their dreams.",
          "C) They had a discussion about the explanation of the dreams."
        ],
        answer: "B"
      },
      {
        id: 3,
        question: "The underlined word 'stages' in paragraph 3 is closest in meaning to ----.",
        options: [
          "A) amounts",
          "B) positions",
          "C) steps"
        ],
        answer: "C"
      },
      {
        id: 4,
        question: "It is stated in paragraph 3 that ----.",
        options: [
          "A) our brain becomes active in the later periods of our sleep",
          "B) we remember the dreams we have during REM sleep better",
          "C) we are able to move our body during some sleep periods"
        ],
        answer: "A"
      },
      {
        id: 5,
        question: "Which of the following is FALSE according to paragraph 3?",
        options: [
          "A) Our heart beats more quickly than usual during REM sleep.",
          "B) REM sleep is divided into different periods of sleep.",
          "C) Our brain generates electrical waves while dreaming."
        ],
        answer: "B"
      },
      {
        id: 6,
        question: "The underlined pronoun 'it' in paragraph 3 refers to ----.",
        options: [
          "A) blood pressure",
          "B) the brain",
          "C) the body"
        ],
        answer: "C"
      },
      {
        id: 7,
        question: "It is stated in paragraph 4 that it is hard to recall our dreams since ----.",
        options: [
          "A) majority of us often sleep too deeply",
          "B) we usually prefer to forget them quickly",
          "C) they generally don't have a major impact"
        ],
        answer: "C"
      },
      {
        id: 8,
        question: "Paragraph 4 is mainly about ----.",
        options: [
          "A) different beliefs and ideas about dreams",
          "B) the reasons for forgetting dreams",
          "C) the factors affecting the way we dream"
        ],
        answer: "B"
      },
      {
        id: 9,
        question: "According to paragraph 5, ----.",
        options: [
          "A) a small number of people can manipulate their dreams",
          "B) lucid dreamers are usually imaginative people",
          "C) lucid dreamers enjoy travelling back in time more than flying"
        ],
        answer: "A"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'strange' is closest in meaning to ----.",
        options: ["A) unusual", "B) normal", "C) real"],
        answer: "A"
      },
      {
        id: 2,
        question: "'inactive' is the antonym of the word ----.",
        options: ["A) active", "B) strange", "C) lucid"],
        answer: "A"
      },
      {
        id: 3,
        question: "Which of the following is a nationality?",
        options: ["A) Austrian", "B) research", "C) detail"],
        answer: "A"
      },
      {
        id: 4,
        question: "'control' is closest in meaning to ----.",
        options: ["A) manage", "B) forget", "C) repeat"],
        answer: "A"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 42,
    title: "RFID: The Technology That Knows You",
    cefr: "B2",
    theme: "Modals of Possibility (May / Might)",
    paragraphs: [
      "Have you ever seen the film Minority Report? It is a very good action film. It tells us about the future of advertising. Detective John Anderton is walking through a shopping mall when the advertisements on the walls start talking to him. They say to him \"Hello, John!\" and tell him about the latest products he should buy. How do they know who he is? And how do they know what his shopping habits are? The answer is RFID—radio frequency identification.",
      "People use RFID for different reasons. But before that, what is RFID? In 1948, the researcher Harry Stokman came up with the idea. Later in the 1950s, he and his partners thought about it and built a machine. After around twenty years, in 1970, RFID technology became very popular among businesses and they began to benefit from this technology. But let's talk about how this technology works and what it is. Scientists connect small computer chips to objects or clothes. A central computer network can read these chips. For example, your dog is lost and you want to find your dog. RFID can help you. You just put the chip on the animal. Then you can watch it from a distance. RFID has other uses, too. Delta Airlines uses it to track luggage, and the US Department of Defense uses it to count its weapons and vehicles.",
      "Imagine your clothes have an RFID chip. Every time you enter the shopping mall a machine \"reads\" your name, age, and buying habits. It knows which shampoo you buy, bread you prefer, and what size your feet are. The machine then uses this information and makes you special offers. So this tells us about the connection between RFID and advertising. It sounds like science fiction, but some businesses already use RFID, and one US supermarket company plans to use it in the near future.",
      "So what might be bad about this technology? The problem is that this technology may affect people's life negatively in the future. The businesses may use RFID to follow people, not products. Your boss, for example, may decide to follow his workers. He may want to learn who spends their time smoking outside or who takes long lunch breaks or what his employees are doing at that moment. Also, employers may decide to follow people, too. For example, they might want to learn which books they read or which political meetings they attend. As all shoppers know that everything costs something."
    ],
    vocabulary: [
      { term: "minority", meaning: "azınlık", partOfSpeech: "n" },
      { term: "weapon", meaning: "silah", partOfSpeech: "n" },
      { term: "report", meaning: "rapor", partOfSpeech: "n" },
      { term: "vehicle", meaning: "araç, vasıta", partOfSpeech: "n" },
      { term: "advertising", meaning: "reklamcılık", partOfSpeech: "n" },
      { term: "imagine", meaning: "hayal etmek, düşlemek, sanmak, farz etmek", partOfSpeech: "v" },
      { term: "detective", meaning: "dedektif", partOfSpeech: "n" },
      { term: "enter", meaning: "girmek, giriş yapmak", partOfSpeech: "v" },
      { term: "shopping mall", meaning: "alışveriş merkezi", partOfSpeech: "n" },
      { term: "shampoo", meaning: "şampuan", partOfSpeech: "n" },
      { term: "advertisement", meaning: "reklam", partOfSpeech: "n" },
      { term: "bread", meaning: "ekmek", partOfSpeech: "n" },
      { term: "habit", meaning: "alışkanlık", partOfSpeech: "n" },
      { term: "prefer", meaning: "tercih etmek, yeğlemek", partOfSpeech: "v" },
      { term: "frequency", meaning: "frekans, sıklık", partOfSpeech: "n" },
      { term: "information", meaning: "bilgi", partOfSpeech: "n" },
      { term: "identification", meaning: "teşhis, kimliğini belirleme", partOfSpeech: "n" },
      { term: "offer", meaning: "teklif, öneri", partOfSpeech: "n" },
      { term: "come up with", meaning: "bulmak (fikir), ileri sürmek, ortaya atmak", partOfSpeech: "phr. v" },
      { term: "connection", meaning: "bağlantı", partOfSpeech: "n" },
      { term: "partner", meaning: "partner, ortak", partOfSpeech: "n" },
      { term: "science fiction", meaning: "bilim kurgu", partOfSpeech: "n" },
      { term: "benefit from", meaning: "-den faydalanmak, yararlanmak", partOfSpeech: "phr. v" },
      { term: "supermarket", meaning: "süpermarket", partOfSpeech: "n" },
      { term: "connect", meaning: "bağlanmak, bağlantı kurmak", partOfSpeech: "v" },
      { term: "affect", meaning: "etkilemek", partOfSpeech: "v" },
      { term: "chip", meaning: "çip", partOfSpeech: "n" },
      { term: "negatively", meaning: "olumsuz şekilde", partOfSpeech: "adv" },
      { term: "object", meaning: "nesne, obje", partOfSpeech: "n" },
      { term: "boss", meaning: "patron", partOfSpeech: "n" },
      { term: "central", meaning: "merkezi", partOfSpeech: "adj" },
      { term: "smoke", meaning: "sigara içmek", partOfSpeech: "v" },
      { term: "network", meaning: "ağ, şebeke", partOfSpeech: "n" },
      { term: "break", meaning: "ara, mola", partOfSpeech: "n" },
      { term: "use", meaning: "kullanım, kullanma", partOfSpeech: "n" },
      { term: "employer", meaning: "işveren", partOfSpeech: "n" },
      { term: "track", meaning: "izlemek, takip etmek, izini sürmek", partOfSpeech: "v" },
      { term: "political", meaning: "politik", partOfSpeech: "adj" },
      { term: "luggage", meaning: "bavul", partOfSpeech: "n" },
      { term: "meeting", meaning: "toplantı, miting", partOfSpeech: "n" },
      { term: "count", meaning: "saymak", partOfSpeech: "v" },
      { term: "shopper", meaning: "alışveriş yapan kimse, müşteri", partOfSpeech: "n" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "Why does the author use the example of the film called \"Minority Report\" in paragraph 1?",
        options: [
          "A) To exemplify the risks of using RFID technology",
          "B) To show how advertisers deceive consumers",
          "C) To illustrate how RFID technology works"
        ],
        answer: "C"
      },
      {
        id: 2,
        question: "The underlined phrase 'came up with' in paragraph 3 is closest in meaning to ----.",
        options: [
          "A) distributed",
          "B) found",
          "C) noticed"
        ],
        answer: "B"
      },
      {
        id: 3,
        question: "It is stated in paragraph 2 that RFID is used to ----.",
        options: [
          "A) monitor the changes in plane routes",
          "B) locate non-living and living things as well",
          "C) carry out research in different fields"
        ],
        answer: "B"
      },
      {
        id: 4,
        question: "Paragraph 2 is mainly about the ----.",
        options: [
          "A) various purposes of using RFID",
          "B) many changes in RFID technology",
          "C) profound effects of RFID on businesses"
        ],
        answer: "A"
      },
      {
        id: 5,
        question: "The underlined phrase 'track' in paragraph 2 is closest in meaning to ----.",
        options: [
          "A) analyse",
          "B) advise",
          "C) follow"
        ],
        answer: "C"
      },
      {
        id: 6,
        question: "It is stated in paragraph 3 that RFID technology ----.",
        options: [
          "A) is being used in many shopping malls at the moment",
          "B) can be used for marketing purposes in some businesses",
          "C) may offer smart solutions to your personal problems"
        ],
        answer: "B"
      },
      {
        id: 7,
        question: "We can understand from paragraph 4 that RFID technology can be used to ----.",
        options: [
          "A) gather information about shoppers",
          "B) manage a business efficiently",
          "C) violate the private lives of people"
        ],
        answer: "C"
      },
      {
        id: 8,
        question: "The underlined phrase 'attend' in paragraph 4 is closest in meaning to ----.",
        options: [
          "A) join",
          "B) catch",
          "C) protect"
        ],
        answer: "A"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "Which of the following is negative in meaning?",
        options: ["A) negatively", "B) count", "C) prefer"],
        answer: "A"
      },
      {
        id: 2,
        question: "Which of the following is positive in meaning?",
        options: ["A) negatively", "B) benefit from", "C) weapon"],
        answer: "B"
      },
      {
        id: 3,
        question: "'track' is closest in meaning to ----.",
        options: ["A) follow", "B) advise", "C) protect"],
        answer: "A"
      },
      {
        id: 4,
        question: "Businesses began to benefit ---- this technology.",
        options: ["A) from", "B) with", "C) to"],
        answer: "A"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 43,
    title: "Moving to Australia for a Better Life",
    cefr: "B1",
    theme: "Reasons & Past Simple",
    paragraphs: [
      "Thousands of British people – or Brits – decide to move to Australia every year because they are looking for a better life. On the other hand, more and more Brits think that living in Australia is not for them. As a result, they return home. Why? British people go to live in Australia for many reasons. Some go for work and decide to stay, some go for family reasons. Some other British people go because they think that the UK is dark, cold, rainy, expensive and crowded. They'd like to live in a place where the air is clean, there is a lot of space and it's sunny.",
      "When they both stopped working, 65-year-old Terry and 61-year-old Sarah Hudson went to Tasmania – an island state in Australia to look after Terry's old father. At the time, his father was living there alone. When Terry's father died six months later, they sold their house in the UK and moved there. They moved to Tasmania because the weather was sunny, there were open spaces, and the life style was relaxed. Also, in Tasmania, houses, cars and petrol were not as expensive as in Britain.",
      "At first, they enjoyed their life there. Everything was exciting and new. Then, when the excitement of moving was over, they realised something. It was true that Tasmania was sunnier than Britain, but the sun was strong and burnt you when you stayed outside for a long time. Moreover, winter evenings were darker, longer and more boring than the winter evenings in Britain. They thought the television programmes were worse. There was a library in the village but it was too far away from their house! They had to take a bus to go there. The only water they had was rain, and it didn't come very often. Flowers and vegetables needed lots of water. So, it was impossible to have a good garden!",
      "Three years after they moved, Terry thought he was too old to change from British to Tasmanian ways of life. Furthermore, flying from Tasmania to Britain for visits was expensive and tiring for a person of his age. Also, Sarah wanted to come back to be with their son and his family. Now, they have returned to dark, cold, rainy Britain. Life is more expensive but they have a nice garden, they can get together with their old friends, read library books, enjoy their favourite TV programmes and see their grandchildren every week. They are home!"
    ],
    vocabulary: [
      { term: "return", meaning: "dönmek", partOfSpeech: "v" },
      { term: "cold", meaning: "soğuk", partOfSpeech: "adj" },
      { term: "rainy", meaning: "yağmurlu", partOfSpeech: "adj" },
      { term: "crowded", meaning: "kalabalık", partOfSpeech: "adj" },
      { term: "island", meaning: "ada", partOfSpeech: "n" },
      { term: "state", meaning: "eyalet, bölge", partOfSpeech: "n" },
      { term: "look after", meaning: "bakımını üstlenmek, ilgilenmek, bakmak", partOfSpeech: "phr. v" },
      { term: "alone", meaning: "yalnız", partOfSpeech: "adj" },
      { term: "relaxed", meaning: "rahat, rahatlamış", partOfSpeech: "adj" },
      { term: "petrol", meaning: "benzin", partOfSpeech: "n" },
      { term: "exciting", meaning: "heyecan verici", partOfSpeech: "adj" },
      { term: "realise", meaning: "fark etmek, farkına varmak", partOfSpeech: "v" },
      { term: "true", meaning: "doğru, gerçek", partOfSpeech: "adj" },
      { term: "burn", meaning: "yakmak, yanmak", partOfSpeech: "v" },
      { term: "boring", meaning: "sıkıcı", partOfSpeech: "adj" },
      { term: "village", meaning: "köy", partOfSpeech: "n" },
      { term: "far", meaning: "uzak", partOfSpeech: "adj" },
      { term: "vegetable", meaning: "sebze", partOfSpeech: "n" },
      { term: "impossible", meaning: "imkansız, olanaksız", partOfSpeech: "adj" },
      { term: "grandchild", meaning: "torun", partOfSpeech: "n" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "Which of the following is the main idea of paragraph 1?",
        options: [
          "A) There are several reasons why Brits move to and from Australia.",
          "B) Some British people prefer to stay in their own country.",
          "C) British people move to Australia to get a well-paid job."
        ],
        answer: "A"
      },
      {
        id: 2,
        question: "One of the reasons why the Hudson family decided to live in Australia is that ----.",
        options: [
          "A) Terry's father became ill",
          "B) Sarah hated cold and rainy weather",
          "C) the cost of living was higher in the UK"
        ],
        answer: "C"
      },
      {
        id: 3,
        question: "The underlined pronoun 'there' in paragraph 2 refers to ----.",
        options: [
          "A) Tasmania",
          "B) the UK"
        ],
        answer: "A"
      },
      {
        id: 4,
        question: "The underlined word 'burnt' in paragraph 3 is closest in meaning to ----.",
        options: [
          "A) excited",
          "B) cut",
          "C) hurt"
        ],
        answer: "C"
      },
      {
        id: 5,
        question: "It can be inferred from paragraph 3 that ----.",
        options: [
          "A) the Hudsons were happy despite a couple of problems",
          "B) Tasmania failed to meet the expectations of the Hudsons",
          "C) the lack of water was the most serious issue for the Hudsons"
        ],
        answer: "B"
      },
      {
        id: 6,
        question: "Which of the following is TRUE according to paragraph 4?",
        options: [
          "A) Sarah and Terry went back to Britain for the same reasons.",
          "B) They were both satisfied with their decision to return home.",
          "C) The cost of life in Britain was not as expensive as they thought."
        ],
        answer: "B"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'cold' is the antonym of the word ----.",
        options: ["A) hot", "B) alone", "C) far"],
        answer: "A"
      },
      {
        id: 2,
        question: "'crowded' is the antonym of the word ----.",
        options: ["A) empty", "B) boring", "C) rainy"],
        answer: "A"
      },
      {
        id: 3,
        question: "Which of the following can be used to talk about people?",
        options: ["A) island", "B) grandchild", "C) village"],
        answer: "B"
      },
      {
        id: 4,
        question: "'impossible' is the antonym of the word ----.",
        options: ["A) rainy", "B) possible", "C) cold"],
        answer: "B"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 44,
    title: "A Day in the Life of a Street Musician",
    cefr: "A2",
    theme: "Present Simple & Continuous",
    paragraphs: [
      "Susana Martinez is from Argentina, but she's travelling around Europe at the moment. Back home, she is a classical musician who plays the violin in an orchestra, and she's using this skill to make money while she's travelling. Susana is a 'busker'; a street musician who spends her days performing for passers-by in the crowded streets of Europe's big cities.",
      "Where are you right now?",
      "At the moment, I'm staying with friends in a suburb of Paris. Every morning, I get up really early before all my friends wake up and I travel to the streets of Montmartre which is near the centre of the city. Then I find a good place to play, put a big hat on the floor in front of me, and get out my violin. Sometimes I sing, too. What I play changes – I play what I think passers-by will be interested in. For example, if it's raining, I play a song about the rain."
    ],
    vocabulary: [
      { term: "violin", meaning: "keman", partOfSpeech: "n" },
      { term: "passer-by", meaning: "yoldan geçen kişi", partOfSpeech: "n" },
      { term: "skill", meaning: "yetenek, beceri", partOfSpeech: "n" },
      { term: "crowded", meaning: "kalabalık", partOfSpeech: "adj" },
      { term: "perform", meaning: "icra etmek, yapmak, performans sergilemek", partOfSpeech: "v" },
      { term: "suburb", meaning: "banliyö, kenar mahalle", partOfSpeech: "n" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "According to paragraph 1, Susana ----.",
        options: [
          "A) can play other instruments as well as violin",
          "B) doesn't know how to be a 'busker'",
          "C) is in Europe right now, not in Argentina"
        ],
        answer: "C"
      },
      {
        id: 2,
        question: "According to paragraph 2, which of the following is FALSE?",
        options: [
          "A) She doesn't play the same music all day.",
          "B) She travels to the city centre with her friends every day.",
          "C) She plays the violin and sometimes sings as well."
        ],
        answer: "B"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'talent' is closest in meaning to ----.",
        options: ["A) suburb", "B) skill", "C) violin"],
        answer: "B"
      },
      {
        id: 2,
        question: "Which of the following is an instrument?",
        options: ["A) violin", "B) passer-by", "C) orchestra"],
        answer: "A"
      },
      {
        id: 3,
        question: "Which of the following can be used to talk about people?",
        options: ["A) violin", "B) suburb", "C) passer-by"],
        answer: "C"
      },
      {
        id: 4,
        question: "'empty' is the antonym of the word ----.",
        options: ["A) skilled", "B) crowded", "C) interested"],
        answer: "B"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 45,
    title: "A Rainy Saturday at Home",
    cefr: "A2",
    theme: "Present Continuous",
    paragraphs: [
      "It's a rainy Saturday. It's raining a lot and Mary and her family are spending the afternoon at home. Her uncle and aunt are visiting them. Mary and her father are in the living room. Mary is drawing a picture and her father, Mr Harris, is surfing the net. They are also talking.",
      "Mary's older brother, Peter, is in his bedroom playing computer games. He is a computer fanatic and he spends much time playing on the computer. His little brother, Jim is also in the living room. He is playing with his dinosaurs' collection. Sometimes he teases Mary; he is a really naughty boy.",
      "Mary's mother, Mrs Harris, is in the kitchen preparing a snack for all of them. She is making some tea and talking to Mary's aunt and uncle – Lucy and Tom. They are from the nearest town and stopped by to say hello. Fluffy, the family cat, is sleeping on the kitchen's sofa. He is a true fluffy cat."
    ],
    vocabulary: [
      { term: "rainy", meaning: "yağmurlu", partOfSpeech: "ad" },
      { term: "naughty", meaning: "yaramaz", partOfSpeech: "adj" },
      { term: "draw", meaning: "resim çizmek", partOfSpeech: "v" },
      { term: "prepare", meaning: "hazırlamak", partOfSpeech: "v" },
      { term: "collection", meaning: "koleksiyon", partOfSpeech: "n" },
      { term: "snack", meaning: "ara öğün, atıştırmalık", partOfSpeech: "n" },
      { term: "tease", meaning: "sataşmak, kızdırmak, takılmak", partOfSpeech: "v" },
      { term: "fluffy", meaning: "kabarık, pofuduk", partOfSpeech: "adj" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "According to paragraph 1, what is Mary doing?",
        options: [
          "A) She is surfing the net.",
          "B) She is drawing a picture.",
          "C) She is visiting her uncle."
        ],
        answer: "B"
      },
      {
        id: 2,
        question: "According to paragraph 2, which of the following is TRUE about Peter?",
        options: [
          "A) He is playing with dinosaurs.",
          "B) He is playing with his little brother Jim.",
          "C) He is playing computer games."
        ],
        answer: "C"
      },
      {
        id: 3,
        question: "According to paragraph 3, Mrs Harris ----.",
        options: [
          "A) is talking to Mary's aunt and uncle",
          "B) is watching the cat sleeping",
          "C) is going to the nearest town"
        ],
        answer: "A"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "Which of the following is related to the weather?",
        options: ["A) naughty", "B) rainy", "C) fluffy"],
        answer: "B"
      },
      {
        id: 2,
        question: "Which of the following can be used to talk about people?",
        options: ["A) draw", "B) snack", "C) naughty"],
        answer: "C"
      },
      {
        id: 3,
        question: "Which of the following is 'food'?",
        options: ["A) snack", "B) collection", "C) tease"],
        answer: "A"
      },
      {
        id: 4,
        question: "'rainy' is the antonym of the word ----.",
        options: ["A) naughty", "B) fluffy", "C) dry"],
        answer: "C"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 46,
    title: "Egypt: Land of the Nile",
    cefr: "B1",
    theme: "Prepositions of Place & First Conditional",
    paragraphs: [
      "Egypt is a country in Africa. It is in the north part of the continent. The north side of Egypt borders the Mediterranean. The east side of it is along the Red Sea. Sudan is to the south and Libya is to the west. Other countries are on its other sides. Egypt is close to Asia and the Nile, one of the longest rivers in the world, runs through the country. That's why, it is in a very special location. The Nile is the main water source of Egypt. People need water for farming and this comes from the river.",
      "The capital of Egypt is Cairo. It is a really great city that has been important for a long time. Cairo is the largest city in Africa. If you visit, you will find a very modern place. You will see a lot of cars. There are usually traffic jams during the summer season because of the huge number of tourists and tour buses. You will also see many businesses, schools, and homes.",
      "About 82 million people live in Egypt. They have a rich history. Long ago, Egyptians made this the greatest place in the world. They built pyramids. These very smart people invented their own ways to farm and they were successful. Egyptians were also wonderful leaders. They built great buildings and set up schools. They invented a special way of writing, too. It was called hieroglyphics. They looked like pictures instead of alphabet letters. Egyptians used hieroglyphics for religious literature on papyrus and wood. You can still see hieroglyphics in Egypt today, but people do not use them to read and write anymore. They are a part of a great history.",
      "Today most Egyptians live near the banks of the Nile River. It's a great place to live in. In Egypt, there are other parts and they are difficult places to live in because they are deserts. So not many people live there. About half of the Egyptian people live in big cities. The big cities are in the area of the Nile River. If you go to Cairo, the biggest city, you will find millions of people. Unfortunately, there is so much air pollution especially in these big cities. The sky looks almost grey on some days even if the weather is sunny.",
      "There were a lot of wars in Egypt years ago. These wars caused poverty. Poor people in the cities needed jobs and homes. Egypt still needs to work hard to solve these problems. Education, for example, is one of the most serious problems they have. They need to make the schools better. The school leaders need to make plans to help students learn more.",
      "Egypt is a great country. It has a wonderful history. It will have a great future because people are working harder. They are working together to make things better."
    ],
    vocabulary: [
      { term: "Egypt", meaning: "Mısır", partOfSpeech: "n" },
      { term: "pyramid", meaning: "piramit", partOfSpeech: "n" },
      { term: "north", meaning: "kuzey", partOfSpeech: "adj" },
      { term: "invent", meaning: "icat etmek, yaratmak", partOfSpeech: "v" },
      { term: "continent", meaning: "kıta", partOfSpeech: "n" },
      { term: "wonderful", meaning: "mükemmel", partOfSpeech: "adj" },
      { term: "side", meaning: "yön, taraf, yan", partOfSpeech: "n" },
      { term: "leader", meaning: "lider", partOfSpeech: "n" },
      { term: "border", meaning: "sınır komşusu olmak", partOfSpeech: "v" },
      { term: "set up", meaning: "kurmak, oluşturmak", partOfSpeech: "phr. v" },
      { term: "Mediterranean", meaning: "Akdeniz", partOfSpeech: "n" },
      { term: "alphabet", meaning: "abece", partOfSpeech: "n" },
      { term: "east", meaning: "doğu", partOfSpeech: "n" },
      { term: "letter", meaning: "harf", partOfSpeech: "n" },
      { term: "along", meaning: "boyunca", partOfSpeech: "prep" },
      { term: "religious", meaning: "dini", partOfSpeech: "adj" },
      { term: "close", meaning: "yakın", partOfSpeech: "adj" },
      { term: "papyrus", meaning: "papirüs", partOfSpeech: "n" },
      { term: "long", meaning: "uzun", partOfSpeech: "adj" },
      { term: "wood", meaning: "tahta", partOfSpeech: "n" },
      { term: "main", meaning: "ana, başlıca", partOfSpeech: "adj" },
      { term: "still", meaning: "hala", partOfSpeech: "adv" },
      { term: "source", meaning: "kaynak", partOfSpeech: "n" },
      { term: "near", meaning: "yakınında, yanında", partOfSpeech: "adj" },
      { term: "river", meaning: "nehir", partOfSpeech: "n" },
      { term: "sky", meaning: "gökyüzü", partOfSpeech: "n" },
      { term: "Cairo", meaning: "Kahire", partOfSpeech: "n" },
      { term: "sunny", meaning: "güneşli", partOfSpeech: "adj" },
      { term: "important", meaning: "önemli", partOfSpeech: "adj" },
      { term: "poverty", meaning: "yoksulluk, fakirlik", partOfSpeech: "n" },
      { term: "modern", meaning: "modern", partOfSpeech: "adj" },
      { term: "solve", meaning: "(sorunu) çözmek", partOfSpeech: "v" },
      { term: "car", meaning: "araba", partOfSpeech: "n" },
      { term: "education", meaning: "eğitim", partOfSpeech: "n" },
      { term: "plan", meaning: "plan", partOfSpeech: "n" },
      { term: "serious", meaning: "ciddi", partOfSpeech: "adj" },
      { term: "bus", meaning: "otobüs", partOfSpeech: "n" },
      { term: "rich", meaning: "zengin", partOfSpeech: "adj" },
      { term: "pollution", meaning: "kirlilik", partOfSpeech: "n" },
      { term: "unfortunately", meaning: "ne yazık ki", partOfSpeech: "adv" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "Paragraph 1 is mainly about the ----.",
        options: [
          "A) importance of the Nile",
          "B) location of Egypt",
          "C) countries bordering Egypt"
        ],
        answer: "B"
      },
      {
        id: 2,
        question: "The underlined pronoun \"it\" in paragraph 1 refers to ------.",
        options: [],
        answer: "Egypt",
        openEnded: true
      },
      {
        id: 3,
        question: "According to paragraph 2, there is a traffic congestion in Cairo in certain periods of time during the year owing to ----.",
        options: [
          "A) the huge numbers of cars",
          "B) its very large population",
          "C) the tourists visiting the city"
        ],
        answer: "C"
      },
      {
        id: 4,
        question: "Which of the following is FALSE about Egyptians according to paragraph 3?",
        options: [
          "A) They developed new farming methods.",
          "B) They were the most intelligent people.",
          "C) They invented a set of written characters."
        ],
        answer: "B"
      },
      {
        id: 5,
        question: "The underlined word 'set up' in paragraph 3 is closest in meaning to ----.",
        options: [
          "A) established",
          "B) destroyed",
          "C) selected"
        ],
        answer: "A"
      },
      {
        id: 6,
        question: "Which of the following is FALSE about hieroglyphics, according to paragraph 3?",
        options: [
          "A) They are only used for religious purposes nowadays.",
          "B) They used to be written on papyrus as well as wood.",
          "C) Nobody makes use of them any longer at the moment."
        ],
        answer: "A"
      },
      {
        id: 7,
        question: "The underlined pronoun \"there\" in paragraph 4 refers to ------.",
        options: [],
        answer: "deserts",
        openEnded: true
      },
      {
        id: 8,
        question: "We can understand from paragraph 4 that ----.",
        options: [
          "A) air pollution is the most serious problem in Cairo",
          "B) there will be more deserts in Egypt in the future",
          "C) around 50% of Egypt's population reside in rural areas"
        ],
        answer: "C"
      },
      {
        id: 9,
        question: "It is stated in paragraph 5 that poverty resulted from ----.",
        options: [
          "A) lack of job opportunities in cities",
          "B) many battles in the history of Egypt",
          "C) insufficient numbers of schools"
        ],
        answer: "B"
      },
      {
        id: 10,
        question: "We can infer from paragraph 6 that the author is ----.",
        options: [
          "A) optimistic about Egypt's future",
          "B) doubtful about Egyptian people",
          "C) sarcastic about Egypt's history"
        ],
        answer: "A"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'set up' is closest in meaning to ----.",
        options: ["A) establish", "B) destroy", "C) select"],
        answer: "A"
      },
      {
        id: 2,
        question: "Which of the following is a direction?",
        options: ["A) east", "B) leader", "C) river"],
        answer: "A"
      },
      {
        id: 3,
        question: "Which of the following is positive in meaning?",
        options: ["A) wonderful", "B) poverty", "C) pollution"],
        answer: "A"
      },
      {
        id: 4,
        question: "'rich' is the antonym of the word ----.",
        options: ["A) modern", "B) poor", "C) serious"],
        answer: "B"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 47,
    title: "StoryCorps: Saving People's Stories",
    cefr: "B1",
    theme: "Future Simple & Purpose",
    paragraphs: [
      "Stories can be hard to remember, but a company called StoryCorps helps people save their stories. \"Almost every story gets lost in the end, and we want to end this\" they say. StoryCorps records people telling their stories. We can listen to them anytime. And now StoryCorps is trying something new. It has a special project just for teens. StoryCorps wants teens to be reporters. A reporter's job is to ask questions. Teens will ask their grandparents questions and record their stories. Why? This is because older people have many good stories. We can read fake stories in a book, but theirs are real.",
      "In the project, teens will ask their grandparents some questions. They will record the answers. This will save the stories. To help with this, StoryCorps has a free app. It lets teens use their phones to make the recordings. StoryCorps wants everyone to hear each other's stories. The company will put the recordings in a big library. The library is in Washington, D.C. There, everyone will be able to listen to the stories of the grandparents.",
      "As we know, Thanksgiving is a very popular holiday. Families and friends share big meals. Some people travel a long way to be there. So of course, Thanksgiving is a good day to catch up. People cook and eat and relax. They have time to talk. StoryCorps wants teens to be reporters on Thanksgiving Day. Their grandparents might not be there. It is OK. They can ask someone else the questions. StoryCorps has a special name for this project. It is called \"The Great Thanksgiving Listen.\"",
      "StoryCorps has also asked teachers for help. They need teachers to tell students about the project. Some teachers will make it part of their classes. The questions and stories are fun homework for students. At least Dave Isay believes so. Dave Isay started StoryCorps. He says being a reporter is not hard. Teens just have to be good listeners. They can learn a lot from their grandparents. Then, they can share their stories in their classes.",
      "Going to the library is just one way to hear StoryCorps stories. People can listen to them on the radio. They will be on a popular radio show every Friday. StoryCorps also make videos from the recordings. They produce a few videos every year, and they use cartoons to act out the stories."
    ],
    vocabulary: [
      { term: "remember", meaning: "hatırlamak", partOfSpeech: "v" },
      { term: "app (application)", meaning: "uygulama", partOfSpeech: "n" },
      { term: "lost", meaning: "kayıp, kaybolmuş", partOfSpeech: "adj" },
      { term: "hear", meaning: "duymak", partOfSpeech: "v" },
      { term: "record", meaning: "kaydetmek", partOfSpeech: "v" },
      { term: "library", meaning: "kütüphane", partOfSpeech: "n" },
      { term: "listen", meaning: "dinlemek", partOfSpeech: "v" },
      { term: "share", meaning: "paylaşmak", partOfSpeech: "v" },
      { term: "try", meaning: "denemek, çabalamak", partOfSpeech: "v" },
      { term: "meal", meaning: "öğün, yemek", partOfSpeech: "n" },
      { term: "special", meaning: "özel", partOfSpeech: "adj" },
      { term: "catch up", meaning: "yetişmek, bilgilendirmek", partOfSpeech: "phr. v" },
      { term: "project", meaning: "proje", partOfSpeech: "n" },
      { term: "relax", meaning: "rahatlamak", partOfSpeech: "v" },
      { term: "reporter", meaning: "muhabir", partOfSpeech: "n" },
      { term: "believe", meaning: "inanmak", partOfSpeech: "v" },
      { term: "ask", meaning: "sormak", partOfSpeech: "v" },
      { term: "show", meaning: "gösteri", partOfSpeech: "n" },
      { term: "question", meaning: "soru", partOfSpeech: "n" },
      { term: "video", meaning: "video", partOfSpeech: "n" },
      { term: "grandparents", meaning: "büyükbaba ve büyükanne", partOfSpeech: "n" },
      { term: "recording", meaning: "kayıt", partOfSpeech: "n" },
      { term: "fake", meaning: "sahte", partOfSpeech: "adj" },
      { term: "cartoon", meaning: "çizgi film", partOfSpeech: "n" },
      { term: "free", meaning: "ücretsiz", partOfSpeech: "adj" },
      { term: "act out", meaning: "(rol) canlandırmak", partOfSpeech: "phr. v" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "StoryCorps wants teens to record their grandparents' stories because ----.",
        options: [
          "A) it does not want any stories to get lost",
          "B) older people may not remember old stories",
          "C) it wants to give a special job to teenagers"
        ],
        answer: "A"
      },
      {
        id: 2,
        question: "The underlined word 'fake' in paragraph 1 is closest in meaning to ----.",
        options: [
          "A) ancient",
          "B) fictional",
          "C) desperate"
        ],
        answer: "B"
      },
      {
        id: 3,
        question: "We can understand from paragraph 2 that ----.",
        options: [
          "A) teens have to prepare the questions on their own",
          "B) people will reach the stories in any library they want",
          "C) StoryCorps provides teens with some technology"
        ],
        answer: "C"
      },
      {
        id: 4,
        question: "We can understand from paragraph 3 that Thanksgiving ----.",
        options: [
          "A) is the best time for family members to share stories",
          "B) is a good opportunity for teens to record stories",
          "C) is a holiday when many people go on a journey"
        ],
        answer: "B"
      },
      {
        id: 5,
        question: "The underlined pronoun 'it' in paragraph 4 refers to -----.",
        options: [],
        answer: "(the) project",
        openEnded: true
      },
      {
        id: 6,
        question: "Dave Isay is of the opinion that ----.",
        options: [
          "A) teachers must include the project in the school curriculum",
          "B) being a reporter brings many responsibilities to students",
          "C) the project is a kind of enjoyable assignment for students"
        ],
        answer: "C"
      },
      {
        id: 7,
        question: "According to David Isay, young people ----.",
        options: [
          "A) can learn many things from their elderly relatives",
          "B) don't have to share the things they learn in classes",
          "C) are usually more creative in asking good questions"
        ],
        answer: "A"
      },
      {
        id: 8,
        question: "Which of the following is FALSE about StoryCorps stories, according to paragraph 5?",
        options: [
          "A) People can listen to them on the radio once a week.",
          "B) Film producers make animation movies using them.",
          "C) There are a variety of ways of reaching them."
        ],
        answer: "B"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'fake' is closest in meaning to ----.",
        options: ["A) ancient", "B) fictional", "C) real"],
        answer: "B"
      },
      {
        id: 2,
        question: "'long' is the antonym of the word ----.",
        options: ["A) tall", "B) short", "C) rich"],
        answer: "B"
      },
      {
        id: 3,
        question: "Which of the following is a person?",
        options: ["A) reporter", "B) library", "C) video"],
        answer: "A"
      },
      {
        id: 4,
        question: "Teens will listen ---- the stories of their grandparents.",
        options: ["A) to", "B) at", "C) on"],
        answer: "A"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 48,
    title: "The Crows That Collect Hangers",
    cefr: "B2",
    theme: "Past Simple & Present Perfect Continuous",
    paragraphs: [
      "It was a quiet day in March three years ago. I was on a platform, waiting for the train, and I could see a huge beautiful Keyaki tree a few steps ahead. There was a crow's nest, up high in the tree. A crow was in its nest and playing with something. \"It must be a twig from a tree,\" I thought. But when the crow flew down near me, I saw that it was a hanger, just like the ones we use to hang up our clothes! The next moment, the crow flew north, and couldn't see it any more. \"We use hangers to hang up our clothes after we wash them. Now a crow is flying with a hanger in its mouth! Hangers on a Keyaki tree. What's going on?\" I thought.",
      "Crows are some of the most common birds in Japan. You can see them anytime, everywhere. When you observe them carefully, you will be surprised at how intelligent and interesting they are. One of their most curious behaviours is that they use metal or wooden hangers to build their nests. However, that doesn't mean there are no twigs, branches or sticks left in the city. Actually, I once found a nest and it didn't include any hangers.",
      "I have been watching one pair's nesting behaviour for three years. I call these crows Igui and Ugui. I named them after places in Alaska. I saw those places on an American television programme. Each year, in early March, Igui and Ugui started collecting hangers on a metal barrel above a railway, used the hangers to build a nest, and laid their eggs. I wondered and asked myself \"Where did the birds find all of those hangers?\" I learned the answer one night while watching the local news on TV. \"Crows are collecting hangers from dumps and stealing them from people's balconies,\" the news presenter said.",
      "When we pick up clothes from the dry-cleaners, those clothes are on hangers. In the cities of Japan, we keep the hangers and use them to hang laundry on the veranda. There, the laundry will dry in the sun. After the laundry has dried, we usually leave the hangers outside for the next time we want to dry some laundry. And then, crows take a few of the hangers. \"How nice! The crows are not doing any harm,\" I thought. People don't care; in fact, they don't even notice when they lose one or two hangers because the hangers are free and most people have a lot of them.",
      "Crows' sources of hangers are not limited to the ones they pick from our verandas. We put out bags of garbage and bins of recyclables on a regular schedule. The crows have learned that they could find food in those bags. To get more food, they have to fight for the heavier ones. After tearing open the bags, the crows get a feast. At the same time, they can find the hangers nearby in the plastic bins. One day, I checked a dozen bins at different garbage sites and found that more than half of them contained hangers. My city does not recycle hangers, but crows certainly reuse them."
    ],
    vocabulary: [
      { term: "crow", meaning: "karga", partOfSpeech: "n" },
      { term: "steal", meaning: "çalmak", partOfSpeech: "v" },
      { term: "step", meaning: "adım", partOfSpeech: "n" },
      { term: "balcony", meaning: "balkon", partOfSpeech: "n" },
      { term: "nest", meaning: "yuva", partOfSpeech: "n" },
      { term: "presenter", meaning: "sunucu", partOfSpeech: "n" },
      { term: "twig", meaning: "dal, dal parçası, ince dal", partOfSpeech: "n" },
      { term: "pick up", meaning: "almak, toplamak", partOfSpeech: "phr. v" },
      { term: "fly", meaning: "uçmak", partOfSpeech: "v" },
      { term: "dry-cleaner", meaning: "kuru temizlemeci", partOfSpeech: "n" },
      { term: "hanger", meaning: "elbise askısı", partOfSpeech: "n" },
      { term: "laundry", meaning: "çamaşır", partOfSpeech: "n" },
      { term: "hang up", meaning: "(çamaşır) asmak", partOfSpeech: "phr. v" },
      { term: "dry", meaning: "kurutmak", partOfSpeech: "v" },
      { term: "moment", meaning: "an", partOfSpeech: "n" },
      { term: "take", meaning: "almak", partOfSpeech: "v" },
      { term: "wash", meaning: "yıkamak", partOfSpeech: "v" },
      { term: "harm", meaning: "zarar, hasar", partOfSpeech: "n" },
      { term: "mouth", meaning: "ağız", partOfSpeech: "n" },
      { term: "care", meaning: "önemsemek, önem vermek", partOfSpeech: "v" },
      { term: "observe", meaning: "gözlemlemek, incelemek", partOfSpeech: "v" },
      { term: "notice", meaning: "fark etmek, farkına varmak", partOfSpeech: "v" },
      { term: "carefully", meaning: "dikkatle, yakından", partOfSpeech: "adv" },
      { term: "limited to", meaning: "sınırlı", partOfSpeech: "adj" },
      { term: "surprised", meaning: "şaşırmış, şaşkın", partOfSpeech: "adj" },
      { term: "put", meaning: "koymak", partOfSpeech: "v" },
      { term: "intelligent", meaning: "zeki", partOfSpeech: "adj" },
      { term: "garbage", meaning: "çöp", partOfSpeech: "n" },
      { term: "curious", meaning: "ilginç, tuhaf", partOfSpeech: "adj" },
      { term: "bin", meaning: "çöp kutusu", partOfSpeech: "n" },
      { term: "behaviour", meaning: "davranış, tutum", partOfSpeech: "n" },
      { term: "recyclable", meaning: "geri dönüştürülebilir", partOfSpeech: "adj" },
      { term: "metal", meaning: "metal", partOfSpeech: "n" },
      { term: "regular", meaning: "düzenli", partOfSpeech: "adj" },
      { term: "wooden", meaning: "ahşap, ahşaptan, tahtadan", partOfSpeech: "adj" },
      { term: "schedule", meaning: "program, plan", partOfSpeech: "n" },
      { term: "branch", meaning: "dal", partOfSpeech: "n" },
      { term: "heavy", meaning: "ağır", partOfSpeech: "adj" },
      { term: "stick", meaning: "dal, dal parçası", partOfSpeech: "n" },
      { term: "tear", meaning: "yırtmak, parçalamak", partOfSpeech: "v" },
      { term: "include", meaning: "kapsamak, içermek", partOfSpeech: "v" },
      { term: "feast", meaning: "ziyafet, şölen", partOfSpeech: "n" },
      { term: "pair", meaning: "çift", partOfSpeech: "n" },
      { term: "plastic", meaning: "plastik", partOfSpeech: "adj" },
      { term: "name", meaning: "adlandırmak, isimlendirmek", partOfSpeech: "v" },
      { term: "check", meaning: "kontrol etmek, denetlemek", partOfSpeech: "v" },
      { term: "collect", meaning: "toplamak", partOfSpeech: "v" },
      { term: "dozen", meaning: "düzine, on iki", partOfSpeech: "n" },
      { term: "barrel", meaning: "fıçı, varil", partOfSpeech: "n" },
      { term: "contain", meaning: "içermek, kapsamak", partOfSpeech: "v" },
      { term: "lay", meaning: "(yumurta) yumurtlamak", partOfSpeech: "v" },
      { term: "recycle", meaning: "geri dönüştürmek", partOfSpeech: "v" },
      { term: "wonder", meaning: "merak etmek", partOfSpeech: "v" },
      { term: "certainly", meaning: "kesinlikle, muhakkak", partOfSpeech: "adv" },
      { term: "dump", meaning: "çöplük", partOfSpeech: "n" },
      { term: "reuse", meaning: "tekrar kullanmak", partOfSpeech: "v" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "According to paragraph 1, the Keyaki tree is ----.",
        options: [
          "A) very close to the railway platform",
          "B) full of birds with hangers in their mouths",
          "C) a home to all kinds of birds in winter"
        ],
        answer: "A"
      },
      {
        id: 2,
        question: "The underlined pronoun 'them' in paragraph 1 refers to ----.",
        options: [],
        answer: "clothes",
        openEnded: true
      },
      {
        id: 3,
        question: "We can understand from paragraph 2 that in Japan, ----.",
        options: [
          "A) crows are the most widespread species of birds",
          "B) the population of crows is considerably high",
          "C) crows are having difficulties building their nests"
        ],
        answer: "B"
      },
      {
        id: 4,
        question: "We can understand from paragraph 2 that the author ----.",
        options: [
          "A) used to live in the countryside for some time",
          "B) spends much of his free time looking for nests",
          "C) thinks crows are quite fascinating animals"
        ],
        answer: "C"
      },
      {
        id: 5,
        question: "According to paragraph 3, the author found out how crows found hangers while he was ----.",
        options: [
          "A) observing the birds in their natural environment",
          "B) watching a news programme on television",
          "C) monitoring the places that crows visit regularly"
        ],
        answer: "B"
      },
      {
        id: 6,
        question: "It is stated in paragraph 3 that the author has ----.",
        options: [
          "A) spent a long time to observe specific crows",
          "B) watched many documentaries about crows on TV",
          "C) read a lot about crows and their behaviours"
        ],
        answer: "A"
      },
      {
        id: 7,
        question: "According to paragraph 3, the names Igui and Ugui come from ----.",
        options: [
          "A) a popular TV channel in US",
          "B) some locations in Alaska",
          "C) the names of two birds in a documentary"
        ],
        answer: "B"
      },
      {
        id: 8,
        question: "The underlined word 'notice' in paragraph 4 is closest in meaning to ----.",
        options: [
          "A) answer",
          "B) miss",
          "C) realize"
        ],
        answer: "C"
      },
      {
        id: 9,
        question: "It is stated in paragraph 4 that Japanese people ----.",
        options: [
          "A) don't pay any money to get hangers",
          "B) collect hangers from their verandas",
          "C) leave the hangers outside for crows"
        ],
        answer: "A"
      },
      {
        id: 10,
        question: "The underlined word 'feast' in paragraph 5 is closest in meaning to -----.",
        options: [
          "A) surprise",
          "B) meal",
          "C) function"
        ],
        answer: "B"
      },
      {
        id: 11,
        question: "The underlined word 'contained' in paragraph 5 is closest in meaning to ----.",
        options: [
          "A) suited",
          "B) stayed",
          "C) included"
        ],
        answer: "C"
      },
      {
        id: 12,
        question: "We can understand from paragraph 5 that ----.",
        options: [
          "A) the people living in author's city never recycle anything",
          "B) crows can find hangers in different places from verandas",
          "C) the author collects hangers from garbage sites to help crows"
        ],
        answer: "B"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'intelligent' is closest in meaning to ----.",
        options: ["A) heavy", "B) regular", "C) smart"],
        answer: "C"
      },
      {
        id: 2,
        question: "Which of the following can be used to talk about people?",
        options: ["A) dump", "B) presenter", "C) bin"],
        answer: "B"
      },
      {
        id: 3,
        question: "Which of the following is about 'garbage'?",
        options: ["A) dump", "B) certainly", "C) hanger"],
        answer: "A"
      },
      {
        id: 4,
        question: "Which of the following is negative in meaning?",
        options: ["A) steal", "B) recycle", "C) observe"],
        answer: "A"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 49,
    title: "The Story of Coca-Cola",
    cefr: "B1",
    theme: "Passive Voice (Past Simple)",
    paragraphs: [
      "Do you like Coke®? Most people do. It is a soft drink that looks like syrup. It is brown and sweet. It is a carbonated and sweetened soft drink. It can be in a can, or it can be in a glass. It can be in a tall thin bottle. It is the world's best-selling drink. It is sold in more than 200 countries. A man named John Pemberton invented Coca-Cola®. He was a doctor in Atlanta, Georgia. He made medicine for sick people. He was also an inventor – he made new things. John made many kinds of syrup. He made pills and syrups to help people feel better. They were sold in a store.",
      "John also made a drink that people liked to drink for fun. There was no medicine in it. It was just for fun. He made it out of wine, coffee beans, and caffeine. People everywhere wanted his drink. One day there was a new law. No one could use wine. No one could drink it. But John still wanted to earn money. He still wanted to sell his drinks, but they could not have wine in the drink so he didn't use wine. The first Coca-Cola® was made by him; he put sugar and fruit in the mix. It looked good, and it had a good taste.",
      "He called it Pemberton's French Wine Coca at first and it was sold as a medicine to help cure colds and give people more energy. First, he sold it for five cents a glass. In the first year, he didn't earn much money but people loved it. The name Coca Cola® came from Frank Robinson. He was a friend of John's. His handwriting was very good. The famous Coca Cola® writing was written by him and it is still on every Coca-Cola® product today – on cans, glasses and bottles.",
      "Then, John thought that his business wasn't successful so he sold his business to Asa G. Candler in 1888. He was a businessman. He bought the formula from John for $2,300. Coca-Cola® was sold in bottles by Asa for the first time in 1894 and there was real cocaine in it until 1903. Today of course there is no cocaine in it and people enjoy Coca-Cola® all over the world."
    ],
    vocabulary: [
      { term: "soft drink", meaning: "alkolsüz içecek", partOfSpeech: "n" },
      { term: "sugar", meaning: "şeker", partOfSpeech: "n" },
      { term: "syrup", meaning: "şurup", partOfSpeech: "n" },
      { term: "mix", meaning: "karışım", partOfSpeech: "n" },
      { term: "brown", meaning: "kahverengi", partOfSpeech: "adj" },
      { term: "taste", meaning: "tat", partOfSpeech: "n" },
      { term: "sweet", meaning: "tatlı", partOfSpeech: "adj" },
      { term: "cold", meaning: "soğuk algınlığı", partOfSpeech: "n" },
      { term: "can", meaning: "teneke", partOfSpeech: "n" },
      { term: "glass", meaning: "bardak; cam", partOfSpeech: "n" },
      { term: "inventor", meaning: "mucit", partOfSpeech: "n" },
      { term: "handwriting", meaning: "el yazısı", partOfSpeech: "n" },
      { term: "pill", meaning: "ilaç, hap", partOfSpeech: "n" },
      { term: "product", meaning: "ürün", partOfSpeech: "n" },
      { term: "coffee bean", meaning: "kahve çekirdeği", partOfSpeech: "n" },
      { term: "formula", meaning: "formül", partOfSpeech: "n" },
      { term: "caffeine", meaning: "kafein", partOfSpeech: "n" },
      { term: "cocaine", meaning: "kokain", partOfSpeech: "n" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "We can understand from paragraph 1 that Pemberton ----.",
        options: [
          "A) made lots of profit out of his inventions",
          "B) was a medical person and also an inventor",
          "C) sold some medical stuff in his own shop"
        ],
        answer: "B"
      },
      {
        id: 2,
        question: "It is clearly stated in paragraph 1 that Coca-Cola ----.",
        options: [
          "A) included sugar and a wide variety of syrups",
          "B) was first used as a medicine to cure sick people",
          "C) is sold more than any other drink in the world"
        ],
        answer: "C"
      },
      {
        id: 3,
        question: "According to paragraph 1, ----.",
        options: [
          "A) John invented drinks for different purposes",
          "B) one of John's drinks failed to become popular",
          "C) John wanted to become rich by selling drinks"
        ],
        answer: "A"
      },
      {
        id: 4,
        question: "According to paragraph 2, John was unable to sell one of his drinks since ----.",
        options: [
          "A) he changed his popular formula",
          "B) some people didn't like the taste of it",
          "C) the substance he used was banned"
        ],
        answer: "C"
      },
      {
        id: 5,
        question: "The underlined word 'cure' in paragraph 3 is closest in meaning to ----.",
        options: [
          "A) change",
          "B) treat",
          "C) simplify"
        ],
        answer: "B"
      },
      {
        id: 6,
        question: "We can understand from paragraph 3 that famous Coca Cola writing ----.",
        options: [
          "A) was written by John Pemberton",
          "B) is still being used these days",
          "C) helped John to sell more drinks"
        ],
        answer: "B"
      },
      {
        id: 7,
        question: "According to paragraph 4, John sold his business as he ----.",
        options: [
          "A) couldn't manage the company",
          "B) wanted to start a new business",
          "C) believed it wasn't good enough"
        ],
        answer: "C"
      },
      {
        id: 8,
        question: "It is stated in paragraph 4 that Coca-Cola ----.",
        options: [
          "A) contained a kind of drug for nearly a decade",
          "B) company was sold in the early 19th century",
          "C) may still include some well-known illegal drugs"
        ],
        answer: "A"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'pill' is closest in meaning to ----.",
        options: ["A) product", "B) sugar", "C) medicine"],
        answer: "C"
      },
      {
        id: 2,
        question: "Which of the following can be used to talk about people?",
        options: ["A) cocaine", "B) inventor", "C) caffeine"],
        answer: "B"
      },
      {
        id: 3,
        question: "'invent' is closest in meaning to ----.",
        options: ["A) create", "B) sell", "C) drink"],
        answer: "A"
      },
      {
        id: 4,
        question: "'earn' is closest in meaning to ----.",
        options: ["A) make (money)", "B) lose", "C) spend"],
        answer: "A"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 50,
    title: "The Amazing Octopus",
    cefr: "B1",
    theme: "Ability & Present Simple",
    paragraphs: [
      "What do three hearts, eight arms and one huge brain mean? It means an octopus, a creature that can do surprising things. Octopuses are extremely intelligent. They even know a few things to get them out of dangerous situations, for example, when they are afraid of a sea animal. Octopuses don't have teeth or sharp claws to fight for themselves. When they are afraid of a sea animal, they hide themselves in the sand on the bottom of the ocean floor. How do they do that? Well, the octopus is like a chameleon because it can change the colour of its skin to match the sand. This colour change happens in less than a minute. When the colour of the sand and the colour of the octopus are the same, sea animals cannot see it.",
      "Some octopuses like to stay in more shallow water – not deep water – where there are rocks and coral. They can fit themselves into small spaces between the rocks to get away from sea animals. An octopus can also hide by shooting ink. An octopus uses a part of its body called a siphon to shoot ink into the water. The ink forms a cloud which hides the octopus. It's like a magician doing magic.",
      "That's not all! If a sea animal attacks an octopus, the octopus can actually make itself look like a very dangerous sea snake. It will hide itself in the sand but keep two arms above the sand. It will change the colour of those arms to match a sea snake. But if there's no time to hide? If an octopus is in trouble, it can break off one of its arms which will then change colours and go around the water to surprise the sea animal. So the octopus swims away to a safe place. But don't worry. The octopus's arm will grow again.",
      "There is one kind of octopus which is blue-ringed octopus. It has poison so it is not safe to be around it. The blue-ringed octopus is small; it can fit in the palm of your hand. Bigger sea animals can think it is an easy meal, but they need to stay away. The blue-ringed octopus which can kill very big sea animals, even humans is very poisonous."
    ],
    vocabulary: [
      { term: "heart", meaning: "kalp", partOfSpeech: "n" },
      { term: "brain", meaning: "beyin", partOfSpeech: "n" },
      { term: "octopus", meaning: "ahtapot", partOfSpeech: "n" },
      { term: "creature", meaning: "varlık, yaratık, hayvan", partOfSpeech: "n" },
      { term: "surprising", meaning: "şaşırtıcı", partOfSpeech: "adj" },
      { term: "know", meaning: "bilmek", partOfSpeech: "v" },
      { term: "tooth", meaning: "diş", partOfSpeech: "n" },
      { term: "sharp", meaning: "keskin", partOfSpeech: "adj" },
      { term: "claw", meaning: "pençe", partOfSpeech: "n" },
      { term: "sand", meaning: "kum", partOfSpeech: "n" },
      { term: "bottom", meaning: "dip, alt, taban", partOfSpeech: "n" },
      { term: "ocean", meaning: "okyanus", partOfSpeech: "n" },
      { term: "floor", meaning: "zemin, yer, taban", partOfSpeech: "n" },
      { term: "chameleon", meaning: "bukalemun", partOfSpeech: "n" },
      { term: "colour", meaning: "renk", partOfSpeech: "n" },
      { term: "shallow", meaning: "sığ, yüzeysel", partOfSpeech: "adj" },
      { term: "deep", meaning: "derin", partOfSpeech: "adj" },
      { term: "rock", meaning: "kaya", partOfSpeech: "n" },
      { term: "coral", meaning: "mercan", partOfSpeech: "n" },
      { term: "fit into", meaning: "sığmak, sığdırmak", partOfSpeech: "phr. v" },
      { term: "get away from", meaning: "uzak tutmak, uzaklaştırmak", partOfSpeech: "phr. v" },
      { term: "shoot", meaning: "fırlatmak, atmak, ateş etmek", partOfSpeech: "v" },
      { term: "ink", meaning: "mürekkep", partOfSpeech: "n" },
      { term: "form", meaning: "şekillendirmek, oluşturmak, biçimlendirmek", partOfSpeech: "v" },
      { term: "cloud", meaning: "bulut", partOfSpeech: "n" },
      { term: "magician", meaning: "sihirbaz", partOfSpeech: "n" },
      { term: "attack", meaning: "saldırmak", partOfSpeech: "v" },
      { term: "snake", meaning: "yılan", partOfSpeech: "n" },
      { term: "trouble", meaning: "sorun, bela, problem", partOfSpeech: "n" },
      { term: "surprise", meaning: "şaşırtmak", partOfSpeech: "v" },
      { term: "swim", meaning: "yüzmek", partOfSpeech: "v" },
      { term: "poison", meaning: "zehir", partOfSpeech: "n" },
      { term: "palm", meaning: "avuç, avuç içi", partOfSpeech: "n" },
      { term: "stay away", meaning: "uzak durmak", partOfSpeech: "phr. v" },
      { term: "poisonous", meaning: "zehirli", partOfSpeech: "adj" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "We can understand from paragraph 1 that the octopus is ----.",
        options: [
          "A) able to alter its colour much faster than a chameleon",
          "B) capable of doing some tricks to avoid risky conditions",
          "C) by far the cleverest sea animal throughout the world"
        ],
        answer: "B"
      },
      {
        id: 2,
        question: "Which of the following is FALSE about the octopus according to paragraph 1?",
        options: [
          "A) It can shift its colour under sixty seconds.",
          "B) The size of its brain is extremely large.",
          "C) It has very strong arms and teeth as well."
        ],
        answer: "C"
      },
      {
        id: 3,
        question: "According to paragraph 2, octopuses ----.",
        options: [
          "A) never live in deep water",
          "B) can hide in an ink cloud",
          "C) cannot shoot ink deep water"
        ],
        answer: "B"
      },
      {
        id: 4,
        question: "Why does the author give the example of a magician at the end of paragraph 2?",
        options: [
          "A) To give an example of tricks famous magicians perform",
          "B) To show the similarities between magicians and octopuses",
          "C) To emphasize the incredible tricks octopuses can perform"
        ],
        answer: "C"
      },
      {
        id: 5,
        question: "The underlined word 'forms' in paragraph 2 is closest in meaning to ----.",
        options: [
          "A) builds",
          "B) changes",
          "C) destroys"
        ],
        answer: "A"
      },
      {
        id: 6,
        question: "We can understand from paragraph 3 that octopuses are capable of ----.",
        options: [
          "A) growing some extra body parts to scare animals",
          "B) imitating the behaviours of other sea animals",
          "C) swimming rapidly under enormous pressure"
        ],
        answer: "B"
      },
      {
        id: 7,
        question: "What happens when an octopus breaks off one of its arms according to paragraph 3?",
        options: [
          "A) Sea animals get afraid and they go away.",
          "B) The octopus gets the chance to escape.",
          "C) The octopus swims more quickly than usual."
        ],
        answer: "B"
      },
      {
        id: 8,
        question: "Which of the following is FALSE about the blue-ringed octopus?",
        options: [
          "A) It is quite a tiny sea animal.",
          "B) Big sea animals can easily hunt it.",
          "C) It has a lethal substance that causes death."
        ],
        answer: "B"
      },
      {
        id: 9,
        question: "The underlined pronoun 'they' in paragraph 4 refers to ----.",
        options: [
          "A) bigger sea animals",
          "B) humans",
          "C) blue-ringed octopuses"
        ],
        answer: "A"
      },
      {
        id: 10,
        question: "Which of the following could be the best title of the passage?",
        options: [
          "A) The Interesting Features of Different Kinds of Octopuses",
          "B) Octopuses and How They Defeat Their Deadliest Enemies",
          "C) The Similarities between Octopuses and Magicians"
        ],
        answer: "A"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'shallow' is the antonym of the word ----.",
        options: ["A) deep", "B) sharp", "C) small"],
        answer: "A"
      },
      {
        id: 2,
        question: "Which of the following lives in the sea?",
        options: ["A) octopus", "B) magician", "C) cloud"],
        answer: "A"
      },
      {
        id: 3,
        question: "'intelligent' is closest in meaning to ----.",
        options: ["A) poisonous", "B) clever", "C) shallow"],
        answer: "B"
      },
      {
        id: 4,
        question: "Which of the following is negative in meaning?",
        options: ["A) poisonous", "B) surprising", "C) intelligent"],
        answer: "A"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 51,
    title: "The Internet Around the World",
    cefr: "B1",
    theme: "Comparatives & Quantifiers",
    paragraphs: [
      "MADELAINE — My country is one of the poorest countries in the world. Very few people have computers or use the Internet. Some places have no computers because there is no electricity. Other places have electricity, but there are no telephone lines. Even if they have a computer, people can't use the Internet because there is no connection.",
      "I was very lucky because my school was one of the few high schools that had computers. In my IT (Information Technology) classes, I learned all about how to use computers and different programs. I think computers are important because they help people do their work better.",
      "Now, I want my parents to get an Internet connection at home, but it costs $20 a month. This is expensive for us. To have the full Internet costs $10 more. That's another reason why so few people in my country use the Internet. In fact, less than 0.1% of the people have an Internet connection in their homes. Most of these users live in or near the capital. We have many cyber cafés here. They are quite expensive – about $3 an hour – but they are very popular. The problem is that sometimes so many customers use the Internet at the same time. It can be so slow!",
      "SANDY — I can't remember when I first started using a computer. There is one computer in our house for each member of the family. My dad has two – a desktop and a laptop. I don't think this is unusual in my country. The Internet system began in 1982 here and of course we have it at home. We pay about $33 a month.",
      "We have lots of computers in school, too. I use them for my maths and social studies classes. In fact, every classroom in my country has computers which are connected to the Internet. We have more computers for each schoolchild than any other country. This is great for us because students who can use computers do better in some school subjects.",
      "There are also many cyber cafés in my country. These are not just in the capital. The first cyber café started in 1995, and now we have over 22,000 around the country. The computers are modern, the connection is fast and it only costs about $1 an hour! I think more than 65% of the population uses the Internet.",
      "MEG — I use the computer quite a lot now. I remember when we first got computers in my office. We all had training on how to use them. It's great for my work and now it is very difficult to do my job without a computer. In 1999, most of the Internet connections in my country were from office computers, but not anymore. This is because cyber cafés are more popular, and you can find them in almost every city or small town.",
      "Now, the first reason why cyber cafés are so popular here is they are much cheaper than using the Internet at home. It costs about $30 a month to have access at home, but cafés can be as little as $1 an hour. Another reason is that the cafés are very popular with students. Many schools and universities still don't have computers or the Internet. I think most people in my country use the Internet outside of the home, especially because it is expensive to buy a computer. Only about 15% of the people in my country use the Internet and only 6% have it at home."
    ],
    vocabulary: [
      { term: "poor", meaning: "fakir, yoksul", partOfSpeech: "adj" },
      { term: "telephone line", meaning: "telefon hattı", partOfSpeech: "n" },
      { term: "user", meaning: "kullanıcı", partOfSpeech: "n" },
      { term: "quite", meaning: "oldukça", partOfSpeech: "adv" },
      { term: "customer", meaning: "müşteri", partOfSpeech: "n" },
      { term: "slow", meaning: "yavaş", partOfSpeech: "adj" },
      { term: "desktop", meaning: "masaüstü bilgisayar", partOfSpeech: "n" },
      { term: "laptop", meaning: "dizüstü bilgisayar", partOfSpeech: "n" },
      { term: "unusual", meaning: "olağandışı, alışılmadık", partOfSpeech: "adj" },
      { term: "social studies", meaning: "sosyal bilgiler, sosyal bilimler", partOfSpeech: "n" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "In some parts of Madelaine's country, people cannot connect to the Internet because ----.",
        options: [
          "A) it costs more than $20 for a month",
          "B) they don't have phone lines",
          "C) the price of electricity is very high"
        ],
        answer: "B"
      },
      {
        id: 2,
        question: "The underlined pronoun 'they' in paragraph 2 refers to ----.",
        options: [
          "A) IT classes",
          "B) different programs",
          "C) computers"
        ],
        answer: "C"
      },
      {
        id: 3,
        question: "Cyber cafés in Madelaine's city ----.",
        options: [
          "A) have become more popular recently",
          "B) have problems with their customers",
          "C) might sometimes be too crowded"
        ],
        answer: "C"
      },
      {
        id: 4,
        question: "According to the passage, Sandy ----.",
        options: [
          "A) pays more than Meg for the internet connection at home",
          "B) learnt to use a computer when she was at high school",
          "C) needs to use her father's laptop to do her homework"
        ],
        answer: "A"
      },
      {
        id: 5,
        question: "In Meg's country, most of the people ----.",
        options: [
          "A) don't prefer to go to cyber cafés",
          "B) learn how to use computers at work",
          "C) don't have Internet access at home"
        ],
        answer: "C"
      },
      {
        id: 6,
        question: "The underlined pronoun 'them' in paragraph 7 refers to ----.",
        options: [
          "A) cyber cafés",
          "B) Internet connections",
          "C) office computers"
        ],
        answer: "A"
      },
      {
        id: 7,
        question: "Which of the following is TRUE according to the passage?",
        options: [
          "A) Less than half of the population uses the Internet in Sandy's country.",
          "B) Very few people have an internet connection at home in Meg's and Madelaine's countries.",
          "C) Internet connection is always fast in cyber cafés in Madelaine's and Sandy's countries."
        ],
        answer: "B"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'poor' is the antonym of the word ----.",
        options: ["A) rich", "B) slow", "C) unusual"],
        answer: "A"
      },
      {
        id: 2,
        question: "'fast' is the antonym of the word ----.",
        options: ["A) unusual", "B) quite", "C) slow"],
        answer: "C"
      },
      {
        id: 3,
        question: "Which of the following can be used to talk about people?",
        options: ["A) user", "B) desktop", "C) laptop"],
        answer: "A"
      },
      {
        id: 4,
        question: "'unusual' is the antonym of the word ----.",
        options: ["A) slow", "B) poor", "C) common"],
        answer: "C"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 52,
    title: "Diana Nyad: Never Give Up",
    cefr: "B1",
    theme: "Past Simple & Superlatives",
    paragraphs: [
      "American swimmer Diana Nyad is the first person to swim from Cuba to Florida. The 64-year-old woman swam for 53 hours nonstop. It was dangerous not only for the long distance. There were sharks and jellyfish in the waters, too. The woman had no protection. She had no shark cage; she was the first person to swim from Cuba to Florida without one. She worked really hard to be successful. She started her training in the Caribbean in January of 2013. Firstly, she swam for 12 hours nonstop. She eventually worked her way up to 14 hours, 18, 20, and 24 hours.",
      "Diana tried to swim this distance three times before, but she didn't succeed. And finally she reached her goal on August 31, 2013. She completed her historic 110-mile swim because she never gave up. A 35-person support team helped her during her journey, and they gave her a warm welcome after she got on the beach in Florida. The president, Barack Obama, sent her a message on tweeter saying, \"Congratulations to Diana Nyad. Never give up on your dreams.\" After her success, she appeared on TV for many days. Oprah Winfrey invited Diana to her program for an interview.",
      "Diana Nyad began swimming seriously in the seventh grade. After her father died, she and her mother moved to Florida. She took lessons for marathon swimming at school and won many school championships there until she became a professional swimmer. She is not only passionate about swimming, she is also interested in writing and playing squash and tennis. She wrote three books, Other Shores, Basic Training for Women and Boss of Me: The Keyshawn Johnson Story. She reads Stephen Hawking books, sings and solves puzzles in her free time."
    ],
    vocabulary: [
      { term: "nonstop", meaning: "aralıksız, durmaksızın", partOfSpeech: "adv" },
      { term: "distance", meaning: "mesafe, uzaklık", partOfSpeech: "n" },
      { term: "shark", meaning: "köpekbalığı", partOfSpeech: "n" },
      { term: "jellyfish", meaning: "denizanası", partOfSpeech: "n" },
      { term: "protection", meaning: "koruma, korunma", partOfSpeech: "n" },
      { term: "cage", meaning: "kafes", partOfSpeech: "n" },
      { term: "interview", meaning: "görüşme, röportaj", partOfSpeech: "n" },
      { term: "eventually", meaning: "sonunda, neticede", partOfSpeech: "adv" },
      { term: "succeed", meaning: "başarılı olmak, başarmak", partOfSpeech: "v" },
      { term: "finally", meaning: "sonunda, neticede", partOfSpeech: "adv" },
      { term: "reach", meaning: "ulaşmak, erişmek", partOfSpeech: "v" },
      { term: "goal", meaning: "amaç, hedef", partOfSpeech: "n" },
      { term: "give up", meaning: "vazgeçmek, bırakmak", partOfSpeech: "v" },
      { term: "passionate", meaning: "tutkulu, hırslı", partOfSpeech: "adj" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "Swimming from Cuba to Florida was risky for Diana because ----.",
        options: [
          "A) she was too old to swim",
          "B) she swam 24 hours non-stop",
          "C) there were dangerous sea animals",
          "D) nobody helped her during her journey"
        ],
        answer: "C"
      },
      {
        id: 2,
        question: "Which one of the following is TRUE about Diana Nyad?",
        options: [
          "A) She swam 18 hours when she first started.",
          "B) She finished her journey in Cuba.",
          "C) Her training started in August",
          "D) She became famous after her swim."
        ],
        answer: "D"
      },
      {
        id: 3,
        question: "Which one of the following is FALSE about Diana Nyad's childhood?",
        options: [
          "A) She lived in Florida alone",
          "B) Her father died",
          "C) She had swimming teachers",
          "D) She was a successful swimmer at school"
        ],
        answer: "A"
      },
      {
        id: 4,
        question: "Diana Nyad ----.",
        options: [
          "A) only likes swimming",
          "B) is also a writer",
          "C) plays basketball",
          "D) is a friend of Stephen Hawking"
        ],
        answer: "B"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "Which of the following lives in the sea?",
        options: ["A) jellyfish", "B) goal", "C) cage"],
        answer: "A"
      },
      {
        id: 2,
        question: "'fail' is the antonym of the word ----.",
        options: ["A) distance", "B) give up", "C) succeed"],
        answer: "C"
      },
      {
        id: 3,
        question: "'aim' is closest in meaning to ----.",
        options: ["A) goal", "B) cage", "C) interview"],
        answer: "A"
      },
      {
        id: 4,
        question: "'finally' is closest in meaning to ----.",
        options: ["A) nonstop", "B) eventually", "C) passionate"],
        answer: "B"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 53,
    title: "Yellowstone: The First National Park",
    cefr: "B1",
    theme: "Past Simple & Past Perfect",
    paragraphs: [
      "Yellowstone National Park is a national park in the United States. It was the first national park in the world. It was called the Yellowstone River because there was a river with the same name in the park. Yellowstone was made a UNESCO World Heritage Site in 1978. Yellowstone National Park is famous for its hot springs. Hot water comes from deep underground throughout the year.",
      "People have lived in the Yellowstone area for about 11,000 years. Some Native Americans still lived there when the first people came from Europe in 1807. John Colter, an explorer from St. Louis, visited the large area. The western world did not know this area at that time. Three years later, he returned to St. Louis and told the people there that he had discovered a wonderland of hot springs. This area was Yellowstone, but nobody believed him, so Yellowstone still was not a famous place. For the next sixty years, a few other explorers traveled through the area and told the same story about Yellowstone, but the same thing happened to them. Then, three expeditions between 1868 and 1871 visited Yellowstone. At the end of the expeditions they showed the western world that the place was real. One year later, on March 1, 1872, the United States President, Ulysses S. Grant, decided to create the first national park in the world. For the first twenty years, there was no money for the park. So from 1886 to 1916, the US Army took care of it. Then the new National Park Service started to manage the park.",
      "Millions of people come to see Yellowstone each and every year. This is mostly because of the natural beauty of it. Yellowstone offers many beautiful attractions; for example, hot springs, a deep canyon, a river with many falls, forests, seas, mountains, wilderness and wildlife."
    ],
    vocabulary: [
      { term: "hot spring", meaning: "kaplıca, sıcak kaynak suyu", partOfSpeech: "n" },
      { term: "underground", meaning: "yeraltı", partOfSpeech: "n" },
      { term: "explorer", meaning: "kaşif", partOfSpeech: "n" },
      { term: "return", meaning: "geri gelmek, dönmek", partOfSpeech: "v" },
      { term: "discover", meaning: "keşfetmek, bulmak", partOfSpeech: "v" },
      { term: "expedition", meaning: "keşif gezisi", partOfSpeech: "n" },
      { term: "take care of", meaning: "ilgilenmek, halletmek", partOfSpeech: "v" },
      { term: "manage", meaning: "yönetmek, idare etmek", partOfSpeech: "v" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "Which one of the following is TRUE about Yellowstone National Park?",
        options: [
          "A) It gets its name from the hot springs.",
          "B) There were other national parks before it was opened.",
          "C) It was not a suitable place to live in the past.",
          "D) John Colter was impressed by its hot springs."
        ],
        answer: "D"
      },
      {
        id: 2,
        question: "Yellowstone National Park was not famous for a long time because ----.",
        options: [
          "A) it took people a long time to explore it",
          "B) people found the explorers' story unbelievable",
          "C) the area was too big to walk through",
          "D) very few people tried to explore the area"
        ],
        answer: "B"
      },
      {
        id: 3,
        question: "Between 1868 and 1871 ----.",
        options: [
          "A) western people went to Yellowstone for hot springs",
          "B) John Colter made Yellowstone a famous place",
          "C) more people went to Yellowstone for exploration",
          "D) everybody already knew about Yellowstone"
        ],
        answer: "C"
      },
      {
        id: 4,
        question: "When you go to Yellowstone today, you CANNOT see ----.",
        options: [
          "A) a deep canyon",
          "B) the Rocky Mountains",
          "C) the US army",
          "D) gray wolves"
        ],
        answer: "C"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "Which of the following can be used to talk about people?",
        options: ["A) explorer", "B) expedition", "C) underground"],
        answer: "A"
      },
      {
        id: 2,
        question: "'find' is closest in meaning to ----.",
        options: ["A) manage", "B) return", "C) discover"],
        answer: "C"
      },
      {
        id: 3,
        question: "Yellowstone is famous ---- its hot springs.",
        options: ["A) for", "B) at", "C) of"],
        answer: "A"
      },
      {
        id: 4,
        question: "The US Army took care ---- the park.",
        options: ["A) of", "B) with", "C) for"],
        answer: "A"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 54,
    title: "The Renaissance: A Rebirth in Europe",
    cefr: "B2",
    theme: "Past Simple & Historical Narrative",
    paragraphs: [
      "The Renaissance is a period in the history of Europe that began in about 1400, and followed the Medieval period. The Medieval period \"Renaissance\" is a French word meaning \"rebirth\". The period is called by this name because at that time, people started taking an interest in the learning of ancient times, especially the learning of Ancient Greece and Rome. The Renaissance was seen as a \"rebirth\" of that learning. People became less interested in Christian beliefs and got attracted by ancient philosophy. This greatly changed Europe and improved the lives of people there. Therefore, many people think that the Renaissance was an age of growth and the start of the \"modern age\" in Europe.",
      "In the 15th century, the \"plague\" (a disease which killed a large number of people in Europe) was over. So, the population began to grow. People became wealthier and had more money to spend. They began to build larger houses, buy more expensive clothes and get interested in foreign languages, art and literature. Before the Renaissance, only rich people could do these things. However, during the Renaissance, the middle class also began to gain power and earn more money. They also had more free time and spent it on learning foreign languages, reading and playing musical instruments. The Renaissance was especially strong in Italian cities. They became centres of trade, wealth and education. Many cities, like Venice, Genoa and Florence had famous citizens who helped their cities develop and become popular.",
      "Exploring the seas and sailing to other continents became very important during this period. Sailors had better maps and ships so they could travel longer than before. Portuguese explorers started to explore the western coast of Africa and got gold from it. Later on, they discovered India and Asia. These places offered spices, valuable cloths and silk. Explorers brought them home and sold them to wealthy families in Europe. After Columbus discovered America in 1492, many Spanish, French and Italian explorers followed. The Spanish were the most successful. They got control of most of Central and South America and brought home gold and silver from the Inca and Aztec empires."
    ],
    vocabulary: [
      { term: "period", meaning: "dönem, süreç", partOfSpeech: "n" },
      { term: "plague", meaning: "veba", partOfSpeech: "n" },
      { term: "rebirth", meaning: "yeniden doğuş, canlanma, uyanma", partOfSpeech: "n" },
      { term: "literature", meaning: "edebiyat", partOfSpeech: "n" },
      { term: "especially", meaning: "özellikle, bilhassa", partOfSpeech: "adv" },
      { term: "trade", meaning: "ticaret", partOfSpeech: "n" },
      { term: "greatly", meaning: "büyük ölçüde, büyük oranda", partOfSpeech: "adv" },
      { term: "develop", meaning: "geliş(tir)mek, iyileş(tir)mek", partOfSpeech: "v" },
      { term: "improve", meaning: "geliş(tir)mek, iyileş(tir)mek", partOfSpeech: "v" },
      { term: "explore", meaning: "keşfetmek, keşfe çıkmak", partOfSpeech: "v" },
      { term: "age", meaning: "çağ, dönem", partOfSpeech: "n" },
      { term: "valuable", meaning: "değerli, kıymetli", partOfSpeech: "adj" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "According to paragraph 1, the Renaissance ----.",
        options: [
          "A) began in Greece and France",
          "B) was the end of the Modern Age",
          "C) was a period in Ancient times",
          "D) came after the Medieval period"
        ],
        answer: "D"
      },
      {
        id: 2,
        question: "What does \"growth\" in paragraph 1 mean?",
        options: [
          "A) development",
          "B) technology",
          "C) religion",
          "D) education"
        ],
        answer: "A"
      },
      {
        id: 3,
        question: "According to paragraph 2, before the Renaissance, rich people ----.",
        options: [
          "A) did not learn foreign languages",
          "B) had less free time than the middle class",
          "C) weren't interested in art and literature",
          "D) already had a high standard of living"
        ],
        answer: "D"
      },
      {
        id: 4,
        question: "It was easy to travel longer distances in the Renaissance because ----.",
        options: [
          "A) explorers were rich enough to travel longer",
          "B) wealthy families helped explorers financially",
          "C) sailors had better information and ways to travel",
          "D) most explorers learned new ways to travel in India"
        ],
        answer: "C"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'develop' is closest in meaning to ----.",
        options: ["A) explore", "B) improve", "C) rebirth"],
        answer: "B"
      },
      {
        id: 2,
        question: "'period' is closest in meaning to ----.",
        options: ["A) trade", "B) plague", "C) age"],
        answer: "C"
      },
      {
        id: 3,
        question: "Which of the following is a disease?",
        options: ["A) explore", "B) greatly", "C) plague"],
        answer: "C"
      },
      {
        id: 4,
        question: "'especially' is closest in meaning to ----.",
        options: ["A) particularly", "B) eventually", "C) greatly"],
        answer: "A"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 55,
    title: "Building a Dream Home in Paradise",
    cefr: "B2",
    theme: "Past Simple & Purpose Clauses",
    paragraphs: [
      "Alex Sheshunoff is a writer and Sarah Kalish is a lawyer. They both had good jobs and an apartment in Iowa city. However, one day they decided to build a new home for themselves. Most people would probably look locally, perhaps in the nicer neighbourhoods. They didn't even try Iowa and immediately, they planned to find a place in paradise so as to create their home.",
      "For Alex, it was fairly easy to choose an island with everything he wanted. As a keen scuba diver, Alex first visited the Palau group of islands years ago on account of the beautiful ocean. He continued to go back there from time to time so this seemed like a good choice for paradise. The islands are about 7,500 kilometres west of Hawaii. That's why, they are difficult to reach. However, they have green forests with interesting wildlife as well as being surrounded by a blue ocean full of colourful fish. In the end, Alex and Sarah chose one island in particular – Angaur.",
      "Angaur is only thirteen kilometres around with a population of about 150 people. Before they could start to work on the house, they had to get permission from the head of the island – an 83-year-old woman. She was worried they intended to develop the area for other tourists but Alex said, 'We would like to build a simple house.' They agreed on the rent of $100 a month for twenty years. The head of the island was happy. So, she said, 'Angaur welcomes you.'",
      "Then the real work began. Alex and Sarah didn't want to pay for a construction company. Therefore, they taught themselves a lot about building. They also had a lot of friends in Iowa. They came out to help and in return got a free holiday by the beach. The local people of Anguar also worked for the couple and after many months of hard work and a final visit from the head of the island, their dream house was ready."
    ],
    vocabulary: [
      { term: "neighbourhood", meaning: "muhit, civar", partOfSpeech: "n" },
      { term: "island", meaning: "ada", partOfSpeech: "n" },
      { term: "even", meaning: "bile, hatta", partOfSpeech: "adv" },
      { term: "permission", meaning: "izin", partOfSpeech: "n" },
      { term: "immediately", meaning: "derhal, hemen", partOfSpeech: "adv" },
      { term: "head", meaning: "yönetici, başkan", partOfSpeech: "n" },
      { term: "paradise", meaning: "cennet", partOfSpeech: "n" },
      { term: "intend", meaning: "amaçlamak, planlamak", partOfSpeech: "v" },
      { term: "create", meaning: "yaratmak, oluşturmak", partOfSpeech: "v" },
      { term: "develop", meaning: "geliştirmek", partOfSpeech: "v" },
      { term: "fairly", meaning: "oldukça", partOfSpeech: "adv" },
      { term: "simple", meaning: "basit, alelade", partOfSpeech: "adj" },
      { term: "choose", meaning: "seçmek", partOfSpeech: "v" },
      { term: "ocean", meaning: "okyanus", partOfSpeech: "n" },
      { term: "scuba diver", meaning: "balıkadam, dalışçı", partOfSpeech: "n" },
      { term: "welcome", meaning: "hoş karşılama", partOfSpeech: "v" },
      { term: "seem", meaning: "gibi görünmek", partOfSpeech: "v" },
      { term: "construction", meaning: "inşa", partOfSpeech: "n" },
      { term: "wildlife", meaning: "yaban, vahşi doğa", partOfSpeech: "n" },
      { term: "in return", meaning: "karşılığında", partOfSpeech: "adv" },
      { term: "surround", meaning: "çevrelemek, sarmak", partOfSpeech: "v" },
      { term: "dream", meaning: "rüya, hayal", partOfSpeech: "n" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "Which one is FALSE about Alex and Sarah?",
        options: [
          "A) Alex and Sarah had good jobs in Iowa city.",
          "B) They had an apartment in Iowa city.",
          "C) They wanted to have a house in Iowa city.",
          "D) They planned to build a new house."
        ],
        answer: "C"
      },
      {
        id: 2,
        question: "It is clearly stated that Alex ----.",
        options: [
          "A) couldn't easily move to another place",
          "B) liked to dive in the lake with his friends",
          "C) did not like going to the Palau islands",
          "D) chose Angaur as a paradise with Sarah"
        ],
        answer: "C"
      },
      {
        id: 3,
        question: "After Alex talked with the head of the island, she ----.",
        options: [
          "A) started to build the house with them",
          "B) agreed with Alex about the tourist hotel",
          "C) let Alex and Sarah build their place there",
          "D) got rent from Alex for the tourist hotel"
        ],
        answer: "B"
      },
      {
        id: 4,
        question: "After Alex's and Sarah's friends came from Iowa to help the couple, ----.",
        options: [
          "A) Alex and Sarah paid some extra money to them for their work",
          "B) they had the chance to eat very large plates of delicious meat",
          "C) local people of the island invited them to the beach events",
          "D) they got the chance to have a free holiday near the beach"
        ],
        answer: ""
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'keen' is closest in meaning to ----.",
        options: ["A) enthusiastic", "B) tired", "C) worried"],
        answer: "A"
      },
      {
        id: 2,
        question: "They had to get permission ---- the head of the island.",
        options: ["A) from", "B) to", "C) at"],
        answer: "A"
      },
      {
        id: 3,
        question: "'reach' is closest in meaning to ----.",
        options: ["A) leave", "B) arrive at", "C) build"],
        answer: "B"
      },
      {
        id: 4,
        question: "'intend' is closest in meaning to ----.",
        options: ["A) plan", "B) refuse", "C) forget"],
        answer: "A"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 56,
    title: "The Man Behind KFC",
    cefr: "B1",
    theme: "Past Simple & Sequence",
    paragraphs: [
      "Harland Sanders was born in the USA in 1890, but he wasn't a happy child. His father died when he was six years old. His mother didn't have much money so she needed to find a job. She went to work in a shirt factory and Harland stayed at home with his young sister and brother. While he was cooking for them, he became a good cook.",
      "He left home when he was twelve and worked on a farm. Fortunately, the farm was close to his home. Later, he worked in a lot of different jobs and in 1930 he became the manager of a gas station in Corbin, Kentucky. There were a lot of hungry travelers on the roads between cities and thus they stopped at this gas station to eat. Harland started cooking meals for them. Later, many people came to the gas station only for great food. The restaurant at the gas station was very small and Harland couldn't give food to every customer. Therefore, he decided to move to a large restaurant. It was across the street. In 9 years, he invented a secret chicken recipe and it made him very successful and famous.",
      "The first official Kentucky Fried Chicken restaurant opened in 1952 and in 12 years there were more than 600 KFCs in North America. In 1964, Sanders sold the company for $2 million to Heublein and it became international, but he didn't stop working for KFC. He visited restaurants all over the world and he traveled 250.000 miles every year. He died in 1980, at the age of 90. Six years later, PepsiCo bought KFC for $840 million. There are now KFC restaurants in more than 110 countries around the world and KFC has 12 million customers every day. However, the recipe is still a secret."
    ],
    vocabulary: [
      { term: "need", meaning: "ihtiyaç duymak", partOfSpeech: "v" },
      { term: "invent", meaning: "icat etmek", partOfSpeech: "v" },
      { term: "factory", meaning: "fabrika", partOfSpeech: "n" },
      { term: "recipe", meaning: "tarif", partOfSpeech: "n" },
      { term: "stay", meaning: "kalmak", partOfSpeech: "v" },
      { term: "international", meaning: "uluslararası", partOfSpeech: "adj" },
      { term: "close", meaning: "yakın", partOfSpeech: "adj" },
      { term: "customer", meaning: "müşteri", partOfSpeech: "n" },
      { term: "become", meaning: "olmak", partOfSpeech: "v" },
      { term: "still", meaning: "hala, yine de", partOfSpeech: "adv" },
      { term: "manager", meaning: "müdür, yönetici", partOfSpeech: "n" },
      { term: "secret", meaning: "sır", partOfSpeech: "n" },
      { term: "later", meaning: "sonra(sında)", partOfSpeech: "adv" },
      { term: "across", meaning: "aşmak, karşısına geçmek", partOfSpeech: "v" },
      { term: "great", meaning: "harika, muhteşem", partOfSpeech: "adj" },
      { term: "station", meaning: "istasyon, durak", partOfSpeech: "n" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "Harland's mother worked in a shirt factory as ----.",
        options: [
          "A) her husband left home",
          "B) she didn't have enough money",
          "C) she needed a new house"
        ],
        answer: "B"
      },
      {
        id: 2,
        question: "Who taught Harland to cook?",
        options: [
          "A) He taught himself.",
          "B) His mother taught him.",
          "C) His brother and sister taught him."
        ],
        answer: "A"
      },
      {
        id: 3,
        question: "What does \"them\" in paragraph 2 refer to?",
        options: [
          "A) his brother and his sister",
          "B) meals",
          "C) travelers"
        ],
        answer: "C"
      },
      {
        id: 4,
        question: "What was TRUE about the gas station?",
        options: [
          "A) It was close to Harland's home.",
          "B) It had a large restaurant.",
          "C) It became very popular."
        ],
        answer: "C"
      },
      {
        id: 5,
        question: "What does \"him\" in paragraph 2 refer to?",
        options: [
          "A) Harland's",
          "B) Harland",
          "C) The recipe"
        ],
        answer: "B"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "Which of the following is related to time?",
        options: ["A) great", "B) later", "C) stay"],
        answer: "B"
      },
      {
        id: 2,
        question: "Which of the following is a place?",
        options: ["A) station", "B) across", "C) become"],
        answer: "A"
      },
      {
        id: 3,
        question: "Which of the following is related to food?",
        options: ["A) become", "B) recipe", "C) international"],
        answer: "B"
      },
      {
        id: 4,
        question: "Choose the odd word.",
        options: ["A) later", "B) still", "C) across"],
        answer: "C"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 57,
    title: "The Yes Man Experiment",
    cefr: "B2",
    theme: "Past Simple & Contrast Connectors",
    paragraphs: [
      "Yes Man is the best book I've ever read. It's true story of a year in the life of author, Danny Wallace. Before Danny Wallace became the 'Yes Man', his life was boring and he felt old. So he decided to make things more exciting. He started saying 'yes' to every question people asked him. And he did it for a whole year. As of the day he started, it completely changed his life and he had all kinds of adventures. It's a fantastic story. The moment I finished the book, I wanted to change my life like Danny Wallace. So I took some holiday from work, and became a 'Yes Man' for a week. This is what happened.",
      "Day One: I started on Saturday morning. At 10 am, I got my first question. I saw a poster in the window of a travel agent's. It said, \"Tired?\" (Yes – I slept badly the night before, so I was tired). Under this, it said, \"Do you need a holiday?\" (Yes, definitely.) Therefore, I went in. The travel agent asked me \"Where do you want to go?\" But before I could answer, she said, \"Somewhere hot?\" I don't like hot weather, yet I said, \"Yes.\" \"A beach holiday? Perhaps in Greece? I don't like the beach. Nevertheless, I said, \"Yes.\" \"What kind of accommodation? A hotel? Or a …\" I hate hotels, but before she could continue, I said, \"Yes.\" Five minutes later everything was ready. My flight was the next day.",
      "Day Two: I arrived at my hotel on the island of Zante at lunchtime. It was very, very hot. I just wanted to check in and unpack my suitcase, but the receptionist said, \"We have a minibus to the beach in ten minutes. Do you want to go?\" You know the answer I gave her. It was about 40°C at the beach. Luckily, I brought suntan lotion. A man came towards me: \"Sunglasses? Do you want sunglasses?\" I had some in my bag, but I said, \"Yes.\" Five minutes later, another man came: \"Beautiful hat, sir?\" I tried not to look at him. Three hours later, I had two pairs of sunglasses, three hats, a watch and a woman's necklace. It was difficult to carry all my new things back to the minibus. I decided: no trips tomorrow, just rest. After I got back, the receptionist asked, \"Did you like the beach?\" I didn't, but I said, \"Yes\". \"Oh, there's a water skiing course tomorrow. Do you want me to book a place for you?\" I can't swim very well. Besides, I don't like the sea. I wanted to cry."
    ],
    vocabulary: [
      { term: "ever", meaning: "herhangi bir zamanda, daha önce", partOfSpeech: "adv" },
      { term: "flight", meaning: "uçuş", partOfSpeech: "n" },
      { term: "boring", meaning: "sıkıcı", partOfSpeech: "adj" },
      { term: "suntan lotion", meaning: "güneş losyonu", partOfSpeech: "n" },
      { term: "exciting", meaning: "heyecan verici", partOfSpeech: "adj" },
      { term: "yet", meaning: "ancak, ama, fakat", partOfSpeech: "adv" },
      { term: "as of", meaning: "-den / -dan itibaren", partOfSpeech: "adv" },
      { term: "towards", meaning: "-e doğru", partOfSpeech: "adv" },
      { term: "completely", meaning: "tamamen", partOfSpeech: "adv" },
      { term: "another", meaning: "farklı / başka bir", partOfSpeech: "adj" },
      { term: "kind", meaning: "tür, çeşit", partOfSpeech: "adj" },
      { term: "pair", meaning: "çift", partOfSpeech: "n" },
      { term: "definitely", meaning: "kesinlikle", partOfSpeech: "adv" },
      { term: "necklace", meaning: "gerdanlık, kolye", partOfSpeech: "n" },
      { term: "therefore", meaning: "bu sebepten, bu yüzden, bundan dolayı", partOfSpeech: "adv" },
      { term: "difficult", meaning: "zor", partOfSpeech: "adj" },
      { term: "perhaps", meaning: "belki, galiba", partOfSpeech: "adv" },
      { term: "trips", meaning: "gezi", partOfSpeech: "n" },
      { term: "nevertheless", meaning: "ama, yine de, ancak", partOfSpeech: "adv" },
      { term: "skiing", meaning: "kayak", partOfSpeech: "n" },
      { term: "accommodation", meaning: "barınma", partOfSpeech: "n" },
      { term: "course", meaning: "kurs, ders", partOfSpeech: "n" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "Danny Wallace wanted to ----.",
        options: [
          "A) make a change in his life",
          "B) continue his boring life",
          "C) change people's lives"
        ],
        answer: "A"
      },
      {
        id: 2,
        question: "Richard took holiday from work because ----.",
        options: [
          "A) his job was quite tiring",
          "B) he needed a change",
          "C) he wanted to write a book"
        ],
        answer: "B"
      },
      {
        id: 3,
        question: "When Richard first arrived at the hotel, he wanted to ----.",
        options: [
          "A) have lunch on the island of Zante",
          "B) go to the beach",
          "C) take his clothes out of his suitcase"
        ],
        answer: "C"
      },
      {
        id: 4,
        question: "How did Richard feel at the end of the second day?",
        options: [
          "A) relaxed",
          "B) unhappy",
          "C) rude"
        ],
        answer: "B"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'exciting' is the antonym of the word ----.",
        options: ["A) boring", "B) fantastic", "C) hot"],
        answer: "A"
      },
      {
        id: 2,
        question: "Which of the following is negative in meaning?",
        options: ["A) boring", "B) exciting", "C) definitely"],
        answer: "A"
      },
      {
        id: 3,
        question: "'maybe' is closest in meaning to ----.",
        options: ["A) perhaps", "B) another", "C) definitely"],
        answer: "A"
      },
      {
        id: 4,
        question: "He decided ---- go on holiday.",
        options: ["A) to", "B) for", "C) with"],
        answer: "A"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 58,
    title: "Digital Communication: Good or Bad?",
    cefr: "B1",
    theme: "Present Simple & Preferences",
    paragraphs: [
      "Communication is quick and easy with digital technology. But is it making us lazy? Should some things be more personal?",
      "Julie: 'I'd prefer a phone call to a text message.\" I absolutely hate it when friends cancel by text message. It's so rude. My friend Sara and I planned to go to the cinema tonight. But I'm pretty sure she'll cancel – she generally does so. I'm waiting for her text message now.",
      "Gin: \"Facebook means I don't forget anything.\" I'm really into Facebook. It's especially useful for birthdays, that kind of thing. Every time I check my Facebook page, it tells me whose birthday it is. Therefore, I never forget and I can just write a message on their wall. And when people have big news – maybe a new baby or something – you can write a comment straight away.",
      "Marc: \"Writing a blog is a lot easier than sending emails.\" I'm studying in New York, away from my family. While I'm here, I'm writing a blog and thus my friends and family at home know my news. I particularly like putting all my photos on there because people leave comments. Most of my friends use Facebook. However, I prefer writing a blog. It's fairly easy to do and it's far quicker than writing 50 separate emails.",
      "Claudio: \"I just send an instant message.\" I normally communicate with people by instant message as they're free. I've even finished relationships with girlfriends by IM. In fact, I mainly do that. I know it's not the best thing to do – but it's better than a lot of shouting and crying. Some of my friends don't even send a message. Instead, they just stop all communication and wait for her to realise they're not interested."
    ],
    vocabulary: [
      { term: "prefer", meaning: "tercih etmek", partOfSpeech: "v" },
      { term: "thus", meaning: "o halde, böyle(ce), bu yüzden", partOfSpeech: "adv" },
      { term: "absolutely", meaning: "kesinlikle, mutlak surette, tamamıyla", partOfSpeech: "adv" },
      { term: "particularly", meaning: "özellikle, bilhassa, açıkça", partOfSpeech: "adv" },
      { term: "pretty", meaning: "hayli, çok", partOfSpeech: "adv" },
      { term: "put", meaning: "koymak, yerleştirmek", partOfSpeech: "v" },
      { term: "especially", meaning: "özellikler, bilhassa", partOfSpeech: "adv" },
      { term: "fairly", meaning: "oldukça", partOfSpeech: "adv" },
      { term: "therefore", meaning: "dolayısıyla, bu yüzden, bunun sonucunda", partOfSpeech: "adv" },
      { term: "separate", meaning: "ayrı, farklı", partOfSpeech: "adj" },
      { term: "comment", meaning: "yorum", partOfSpeech: "n" },
      { term: "instant", meaning: "çabuk, derhal", partOfSpeech: "adj" },
      { term: "straight away", meaning: "derhal, hemen", partOfSpeech: "adv" },
      { term: "even", meaning: "hattâ, bile, dahi", partOfSpeech: "adv" },
      { term: "realise", meaning: "farketmek, anlamak", partOfSpeech: "v" },
      { term: "instead", meaning: "yerine", partOfSpeech: "adv" }
    ],
    vocabularySource: "kitap",
    questions: [
      {
        id: 1,
        question: "If Julie's friends cancel an event by text message, she doesn't like it because she ----.",
        options: [
          "A) hates checking texts",
          "B) doesn't enjoy calling people",
          "C) thinks it is not polite"
        ],
        answer: "C"
      },
      {
        id: 2,
        question: "Gin is interested in Facebook because ----.",
        options: [
          "A) she can upload photos there",
          "B) she always announces big news on her wall",
          "C) it helps her to remember important dates"
        ],
        answer: "C"
      },
      {
        id: 3,
        question: "Claudio generally prefers IM when he wants to ----.",
        options: [
          "A) finish his relationships with his girlfriends",
          "B) shout at people",
          "C) do the best things for his friends and family"
        ],
        answer: "A"
      },
      {
        id: 4,
        question: "Claudio's friends finish their relationship by ---- their girlfriends.",
        options: [
          "A) texting",
          "B) stopping communication with",
          "C) sending e-mails to"
        ],
        answer: "B"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'instant' is the antonym of the word ----.",
        options: ["A) prompt", "B) quick", "C) slow"],
        answer: "C"
      },
      {
        id: 2,
        question: "'rude' is closest in meaning to ----.",
        options: ["A) impolite", "B) friendly", "C) quick"],
        answer: "A"
      },
      {
        id: 3,
        question: "Which of the following is closest in meaning to 'especially'?",
        options: ["A) particularly", "B) instead", "C) separate"],
        answer: "A"
      },
      {
        id: 4,
        question: "Julie prefers a phone call ---- a text message.",
        options: ["A) to", "B) for", "C) with"],
        answer: "A"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 59,
    title: "Kissing Customs Around the World",
    cefr: "B2",
    theme: "Synonyms & Cultural Customs",
    paragraphs: [
      "What are the customs for kissing people in your country? Do you kiss your relatives when you visit them? Do you kiss your friends hello when you meet them? Is it polite to kiss someone in public places in your country? All of these kissing customs depend on where in the world you are. Kissing may seem as universal as language, but in fact, kissing customs differ around the world",
      "In many places, kisses are used for saying hello. If you are in Europe or South \" America, you will see lots of these greeting kisses. But the kissing customs for greeting people vary from country to country, and traveling to new places can be confusing if soon as you don't know them. Many European men and women say hello with two kisses, one on each cheek. But three kisses are polite in Belgium, and young people in Paris often prefer four. In these countries, you must to start with the right cheek. Starting with your left cheek would be as awkward as sticking out your left hand for a handshake. A variation on the cheek kiss is found in Brazil. When women meet, they put their cheeks together and kiss the air. In some cultures, men kiss each other on the cheeks at some parts of the world, people don't kiss when they meet each other. In fact, kissing in public is considered impolite. In Japan and China, for example, people in public places rarely kiss each other. In most Middle Eastern countries, men and women do not kiss in public, either",
      "Kisses aren't just for saying hello; people kiss for lots of other reasons as well. For example, a kiss can also be a sign of respect. Some people show respect by kissing religious articles and flags. Others kiss the ground when they come home to a country they love. Europeans J and Latin Americans also use kisses to say - beautiful!” They kiss their fingertips when they see a pretty woman, an expensive car, or a great s soccer play. In other places, people say good-bye by kissing their fingertips and blowing the kiss away. Kisses are associated with - good luck, too. The French started the custom of kissing their cards for good luck before playing, 5 and today, some people kiss a pair of dice before they roll them. The English kissed hurt fingers to make them better, as many mothers still do today. And, of course, people also kiss to make up after a fight"
    ],
    vocabulary: [
      { term: "custom", meaning: "gelenek, adet", partOfSpeech: "n", definition: "A traditional way of behaving in a society.", exampleSentence: "Kissing customs differ around the world." },
      { term: "depend on", meaning: "-e bağlı olmak", partOfSpeech: "v", definition: "To be decided by something else.", exampleSentence: "These customs depend on where you are." },
      { term: "confusing", meaning: "kafa karıştırıcı", partOfSpeech: "adj", definition: "Difficult to understand.", exampleSentence: "New customs can be confusing if you don't know them." },
      { term: "awkward", meaning: "garip, tuhaf", partOfSpeech: "adj", definition: "Causing difficulty or embarrassment.", exampleSentence: "It would be as awkward as using the wrong hand." },
      { term: "consider", meaning: "saymak, değerlendirmek", partOfSpeech: "v", definition: "To think of something in a particular way.", exampleSentence: "Kissing in public is considered impolite there." },
      { term: "reason", meaning: "sebep, neden", partOfSpeech: "n", definition: "A cause or explanation for something.", exampleSentence: "People kiss for lots of other reasons." },
      { term: "rarely", meaning: "nadiren", partOfSpeech: "adv", definition: "Not often.", exampleSentence: "People in Japan rarely kiss in public." },
      { term: "associate", meaning: "ilişkilendirmek", partOfSpeech: "v", definition: "To connect one thing with another in your mind.", exampleSentence: "Kisses are associated with good luck." },
      { term: "pair", meaning: "çift", partOfSpeech: "n", definition: "Two things of the same kind together.", exampleSentence: "Some people kiss a pair of dice for luck." },
      { term: "make up", meaning: "barışmak", partOfSpeech: "v", definition: "To become friends again after an argument.", exampleSentence: "People also kiss to make up after a fight." },
      { term: "universal", meaning: "evrensel", partOfSpeech: "adj", definition: "Existing everywhere; shared by everyone.", exampleSentence: "Kissing may seem as universal as language." },
      { term: "polite", meaning: "kibar, nazik", partOfSpeech: "adj", definition: "Having good manners.", exampleSentence: "Three kisses are polite in Belgium." },
    ],
    vocabularySource: "uygulama",
    questions: [
      {
        id: 1,
        question: "the text. 1. The writer compares kissing with language in order to ——.",
        options: [
          "A) inform the reader about their similarities",
          "B) show that kissing is universal to some extent",
          "C) claim that language is much less universal",
          "D) suggest that they have nothing in common"
        ],
        answer: "B"
      },
      {
        id: 2,
        question: "The word “them” in the text refers to ----,",
        options: [
          "A) places",
          "B) people",
          "C) kissing customs",
          "D) many European men"
        ],
        answer: "C"
      },
      {
        id: 3,
        question: "Which of the following is NOT mentioned as one of the reasons for kissing in paragraph 3?",
        options: [
          "A) Showing respect bey",
          "B) Understanding religious articles",
          "C) Saying hi and goodbye",
          "D) Becoming friends again after a fight"
        ],
        answer: "B"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'custom' is closest in meaning to ----.",
        options: ["A) convention", "B) difficulty", "C) reason"],
        answer: "A"
      },
      {
        id: 2,
        question: "'awkward' is closest in meaning to ----.",
        options: ["A) polite", "B) weird", "C) easy"],
        answer: "B"
      },
      {
        id: 3,
        question: "'rarely' is closest in meaning to ----.",
        options: ["A) often", "B) seldom", "C) always"],
        answer: "B"
      },
      {
        id: 4,
        question: "'associate' is closest in meaning to ----.",
        options: ["A) relate", "B) gain", "C) forget"],
        answer: "A"
      },
    ],
    sourceFidelity: "ocr-yapisal"
  },
  {
    id: 60,
    title: "Homeschooling",
    cefr: "B1",
    theme: "Connectors & Vocabulary",
    paragraphs: [
      ": school but soon as they study at home with g a parent. ad Homeschooling appeared in the 1960s in the U.S.; A philosopher called John Rushdoony was the first person who had this idea in mind. He thought that children needed to learn about religion at school. But schools did not teach them anything regarding religion, so he decided to devise his own education system and teach his kids at home. The idea suddenly became so popular that more and more parents stopped sending their children to school and taught their children at home. Today, home schooling is most popular in Canada, France and the US. Many families in these countries don't send their children to schools and they play an active role in their children’s education. Currently, there are over one million families that school their children at home. 3 Homeschooling is popular and there are three: reasons for it. The first reason is about ’ teachers at schools. People homeschool because. they are not happy with the education in schools. y They think teachers are not good enough. There are, also economic reasons: Some don’t have enough: money for private or even public schools. And the 3 last reason is about safety. Some think schools are not safe places for their children. They think school environment and friends may be dangerous for them",
      "How can parents teach their children when there is no teacher or a standard program? Home school families use technology to find teaching materials. Many parents use the internet or computer programs to teach standard subjects like math, reading, history, science and grammar. Most of them create their own lesson plans. They regularly meet with other home schooling parents and share their ideas. They help each other to plan good lessons- to make their lesson plans better. 3 o> There are negative opinions about homeschooling. z For some people, it is a terrible idea. They don't like - it because they think homeschooled children can’t GS) socialize, interact with other people easily, and they become unsociable. They also think that parents are not professional teachers. They can't teach their children math, science and literature well. We have to say this is not true. Exam scores show that homeschool children are more successful- they perform better than public school children in standard exams"
    ],
    vocabulary: [
      { term: "homeschooling", meaning: "evde eğitim", partOfSpeech: "n", definition: "Educating children at home instead of at a school.", exampleSentence: "Homeschooling is education at home." },
      { term: "appear", meaning: "ortaya çıkmak", partOfSpeech: "v", definition: "To begin to exist or be seen.", exampleSentence: "Homeschooling appeared in the 1960s." },
      { term: "philosopher", meaning: "filozof", partOfSpeech: "n", definition: "A person who studies ideas about life and knowledge.", exampleSentence: "A philosopher had this idea first." },
      { term: "regarding", meaning: "-e ilişkin, hakkında", partOfSpeech: "prep", definition: "About; concerning.", exampleSentence: "Schools didn't teach anything regarding religion." },
      { term: "devise", meaning: "tasarlamak, geliştirmek", partOfSpeech: "v", definition: "To plan or invent something new.", exampleSentence: "He decided to devise his own education system." },
      { term: "currently", meaning: "şu anda", partOfSpeech: "adv", definition: "At the present time.", exampleSentence: "Currently, over a million families homeschool." },
      { term: "active role", meaning: "etkin rol", partOfSpeech: "n", definition: "A part in which you take part directly.", exampleSentence: "Parents play an active role in education." },
      { term: "economic", meaning: "ekonomik, iktisadi", partOfSpeech: "adj", definition: "Related to money and finances.", exampleSentence: "There are also economic reasons." },
      { term: "private", meaning: "özel", partOfSpeech: "adj", definition: "Not owned by the state; belonging to a person.", exampleSentence: "Some can't afford private schools." },
      { term: "public", meaning: "devlete ait, kamusal", partOfSpeech: "adj", definition: "Provided by the government for everyone.", exampleSentence: "Some can't afford even public schools." },
      { term: "environment", meaning: "ortam, çevre", partOfSpeech: "n", definition: "The conditions and surroundings of a place.", exampleSentence: "They think the school environment may be dangerous." },
      { term: "dangerous", meaning: "tehlikeli", partOfSpeech: "adj", definition: "Likely to cause harm.", exampleSentence: "They think schools may be dangerous for children." },
    ],
    vocabularySource: "uygulama",
    questions: [
      {
        id: 1,
        question: "According to paragraph 2, homeschooling owes its birth to",
        options: [
          "A) the bad education system in Canada, France and the U.S",
          "B) a philosopher who believed kids should leam religion",
          "C) American schools which allow kids to learn religion at home",
          "D) some parents who didn't want their kids to be taught by the state shock/scream/Injury/storm",
          "E) terrible",
          "F) unsociable"
        ],
        answer: "B"
      },
      {
        id: 2,
        question: "What are the THREE reasons for homeschooling according to paragraph 3?",
        options: [
          "A) Economy, friends and exams",
          "B) Teachers, exams and safety",
          "C) Economy, teachers and safety",
          "D) Safety, parants and teachers"
        ],
        answer: "C"
      },
      {
        id: 3,
        question: "It is stated in the passage that homeschooled children-",
        options: [
          "A) rarely make friends easily",
          "B) don't study math and science",
          "C) get high scores in the exams",
          "D) don't like professional teachers EXERCISE 4. Choose the correct option."
        ],
        answer: "C"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'regarding' is closest in meaning to ----.",
        options: ["A) with", "B) about", "C) after"],
        answer: "B"
      },
      {
        id: 2,
        question: "'currently' is closest in meaning to ----.",
        options: ["A) recently", "B) at present", "C) rarely"],
        answer: "B"
      },
      {
        id: 3,
        question: "'dangerous' is closest in meaning to ----.",
        options: ["A) hazardous", "B) incorrect", "C) safe"],
        answer: "A"
      },
      {
        id: 4,
        question: "'devise' is closest in meaning to ----.",
        options: ["A) develop", "B) consume", "C) buy"],
        answer: "A"
      },
    ],
    sourceFidelity: "ocr-yapisal"
  },
  {
    id: 61,
    title: "Tattoos in Fashion",
    cefr: "B1",
    theme: "Quantifiers & Vocabulary",
    paragraphs: [
      "Tattoos are in fashion in many countries. On TV you can see a famous actor with a picture on: her arm, or your favourite musician with a word on: his hand. Many sports personalities have: got them on their necks and backs. The most, popular designs are Japanese and Chinese characters and the names of people who we love. i Women often prefer smaller designs like stars,: flowers and men are interested in much bigger 3) images. In the USA, tattoos are very popular. 40% of Americans between the age of 26 and 40 have got a tattoo and 60% of customers in US tattoo shops are women. These people are often professional people like doctors, teachers and lawyers. So, now tattoos are popular with all kinds of people and it's normal to have a tattoo these days",
      "However, tattoos are not modern. In fact, they are very old in human history. For example, archaeologists found a human in ice from 5000 years ago. He had 57 tattoos on his back, ankles, legs, knees and feet. They were used for many different reasons. In ancient Egypt, people put on tattoos because they were ‘beautiful’. But in ancient",
      "Rome, tattoos were negative and put on criminals: and prisoners. In India, tattoos were religious.: 3 Inthe 16™ and 17\" century, European sailors arrived in the islands of Polynesia. They saw tattoos for the first time. The people on the islands had tattoos on: their shoulders, chest, backs and legs. Often the tattoos were designs of animals or natural features like a river or a mountain. The European sailors liked them and made their own tattoos. And so the idea travelled to Europe. Tattoos in Polynesia are still important today. They give information about a person's history, their island or their job",
      "So is there a connection between traditional tattoos and fashionable tattoos? And can you call tattoos a fashion? Chris Rainier of National Geographic is an expert in tattoos. So, he studies the tattoos in detail but he designs tattoos, too. His book Ancient Marks has photos of tattoos from all over the world. Those photos were taken by his friend David K night — a world famous photographer. He thinks people in modern societies often have tattoos pe because they are a connection with the traditional world. x"
    ],
    vocabulary: [
      { term: "in fashion", meaning: "moda, revaçta", partOfSpeech: "phr", definition: "Popular and stylish at a particular time.", exampleSentence: "Tattoos are in fashion in many countries." },
      { term: "personality", meaning: "ünlü kişi, şöhret", partOfSpeech: "n", definition: "A famous person, especially in sport or media.", exampleSentence: "Many sports personalities have tattoos." },
      { term: "design", meaning: "tasarım, desen", partOfSpeech: "n", definition: "A pattern or drawing.", exampleSentence: "The most popular designs are characters and names." },
      { term: "prefer", meaning: "tercih etmek", partOfSpeech: "v", definition: "To like one thing more than another.", exampleSentence: "Women often prefer smaller designs." },
      { term: "professional", meaning: "meslek sahibi, profesyonel", partOfSpeech: "adj", definition: "Doing a job that needs special training.", exampleSentence: "They are often professional people like doctors." },
      { term: "archaeologist", meaning: "arkeolog", partOfSpeech: "n", definition: "A person who studies ancient peoples and objects.", exampleSentence: "Archaeologists found a human in ice." },
      { term: "ancient", meaning: "antik, kadim", partOfSpeech: "adj", definition: "Belonging to the very distant past.", exampleSentence: "In ancient Egypt, people wore tattoos." },
      { term: "negative", meaning: "olumsuz", partOfSpeech: "adj", definition: "Bad or harmful.", exampleSentence: "In ancient Rome, tattoos were seen as negative." },
      { term: "criminal", meaning: "suçlu", partOfSpeech: "n", definition: "A person who has committed a crime.", exampleSentence: "Tattoos were put on criminals in Rome." },
      { term: "religious", meaning: "dini", partOfSpeech: "adj", definition: "Connected with religion.", exampleSentence: "In India, tattoos were religious." },
      { term: "sailor", meaning: "denizci", partOfSpeech: "n", definition: "A person who works on a ship.", exampleSentence: "European sailors arrived in Polynesia." },
      { term: "natural feature", meaning: "doğal oluşum", partOfSpeech: "n", definition: "A part of the natural landscape.", exampleSentence: "The tattoos showed natural features like rivers." },
    ],
    vocabularySource: "uygulama",
    questions: [
      {
        id: 1,
        question: "the text. 4, 1. According to paragraph 1, King Jigme Singye Wangchuck believes —--.",
        options: [
          "A) flowers and stars",
          "B) Japanese words",
          "C) large pictures",
          "D) Chinese celebrities EXERCISE 4. Choose the correct option. 1. popular",
          "E) from teenagers/surfers/tourists",
          "F) with people/ceremony",
          "G) religious",
          "H) interested"
        ],
        answer: "D"
      },
      {
        id: 2,
        question: "The word “infirm” in paragraph 2 means ---.",
        options: [
          "A) affluent",
          "B) ill",
          "C) C) satisfied",
          "D) D) wealthy"
        ],
        answer: "A"
      },
      {
        id: 3,
        question: "ecitin One can infer from paragraph 3 that —--. vit",
        options: [
          "A) People in Polynesia made tattoos on European sailors bodies.",
          "B) The Europeans learned tattooing from the Polynesians",
          "C) There were pictures of river or mountains on animals in Polynesia",
          "D) Tattoo lost its importance in Polynesia today"
        ],
        answer: "B"
      },
      {
        id: 4,
        question: "reliable result",
        options: [
          "A) people",
          "B) photos of tattoos",
          "C) modem societies",
          "D) tattoos EXERCISE 3. Choose the correct option according to the text."
        ],
        answer: "D"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'famous' is closest in meaning to ----.",
        options: ["A) acclaimed", "B) perilous", "C) costly"],
        answer: "A"
      },
      {
        id: 2,
        question: "'different' is closest in meaning to ----.",
        options: ["A) scarce", "B) diverse", "C) lucrative"],
        answer: "B"
      },
      {
        id: 3,
        question: "'important' is closest in meaning to ----.",
        options: ["A) ultimate", "B) crucial", "C) costly"],
        answer: "B"
      },
      {
        id: 4,
        question: "'expert' is closest in meaning to ----.",
        options: ["A) specialist", "B) investor", "C) view"],
        answer: "A"
      },
    ],
    sourceFidelity: "ocr-yapisal"
  },
  {
    id: 62,
    title: "Bhutan: Measuring Happiness",
    cefr: "B2",
    theme: "Comparatives & Vocabulary",
    paragraphs: [
      "The small country of Bhutan in the Himalayan mountains is over one thousand years old. In the past, it was a poor country and not many people visited it. But nowadays, it is becoming more and more popular with tourists. Medicine and health are improving and its economy is growing. King Jigme Singye Wangchuck, the king of Bhutan until 2006, talked about his country's 'Gross National Happiness'. In other words, he thought happiness is the way to measure the country's development.",
      "But how do you measure happiness? Perhaps health is the best way because a famous doctor once said, 'Happy people generally don't get infirm.' It's also easy to measure how many people feel ill or unhealthy in a country. For example, one survey says Iceland is the 'healthiest country in the world' because men and women live a long time there, the air is very clean and there are more doctors available per person than anywhere else in the world.",
      "However, there was another survey of the happiest countries in the world and Iceland was not near the top. The questions on this survey included: How much do you earn? How healthy are you? How safe do you feel? After visiting 155 different countries, the researchers decided that Denmark feels happier than other countries.",
      "So, does happiness equal money and good health? Not according to some scientists. They feel that there are other ways of measuring happiness. To do so, they started a website and visitors click on different happy or sad faces to comment on how well they sleep, their family and friends, their level of stress, their inspiration and their physical activity. When you finish, the website adds the results for each area and it gives you a final result for your happiness individually."
    ],
    vocabulary: [
      { term: "measure", meaning: "ölçmek", partOfSpeech: "v", definition: "To find the size, amount or degree of something.", exampleSentence: "How do you measure happiness?" },
      { term: "improve", meaning: "iyileşmek, gelişmek", partOfSpeech: "v", definition: "To become or make better.", exampleSentence: "Medicine and health are improving." },
      { term: "economy", meaning: "ekonomi", partOfSpeech: "n", definition: "The system of money and trade in a country.", exampleSentence: "Its economy is growing." },
      { term: "king", meaning: "kral", partOfSpeech: "n", definition: "The male ruler of a country.", exampleSentence: "He was the king of Bhutan until 2006." },
      { term: "development", meaning: "kalkınma, gelişme", partOfSpeech: "n", definition: "The process of growing or improving.", exampleSentence: "Happiness is the way to measure development." },
      { term: "infirm", meaning: "zayıf, hasta, dermansız", partOfSpeech: "adj", definition: "Weak or ill, especially over a long time.", exampleSentence: "Happy people generally don't get infirm." },
      { term: "survey", meaning: "anket, araştırma", partOfSpeech: "n", definition: "A study of what people think or do.", exampleSentence: "One survey says Iceland is the healthiest country." },
      { term: "available", meaning: "mevcut, ulaşılabilir", partOfSpeech: "adj", definition: "Able to be used or obtained.", exampleSentence: "There are more doctors available per person." },
      { term: "per", meaning: "başına", partOfSpeech: "prep", definition: "For each.", exampleSentence: "More doctors are available per person there." },
      { term: "include", meaning: "içermek, kapsamak", partOfSpeech: "v", definition: "To have something as a part.", exampleSentence: "The survey included several questions." },
      { term: "researcher", meaning: "araştırmacı", partOfSpeech: "n", definition: "A person who studies something carefully.", exampleSentence: "The researchers visited 155 countries." },
      { term: "earn", meaning: "kazanmak", partOfSpeech: "v", definition: "To get money for work you do.", exampleSentence: "One question was: how much do you earn?" },
    ],
    vocabularySource: "uygulama",
    questions: [
      {
        id: 1,
        question: "According to paragraph 1, King Jigme Singye Wangchuck believes ----.",
        options: [
          "A) there is a relation between development and happiness",
          "B) good economy is the result of happiness",
          "C) he is the one who brought happiness to his country",
          "D) Bhutan is popular thanks to his efforts only"
        ],
        answer: "A"
      },
      {
        id: 2,
        question: "The word \"infirm\" in paragraph 2 means ----.",
        options: [
          "A) affluent",
          "B) ill",
          "C) satisfied",
          "D) wealthy"
        ],
        answer: "B"
      },
      {
        id: 3,
        question: "One can infer from paragraph 3 that ----.",
        options: [
          "A) Denmark wasn't one of the 155 countries that the researchers visited",
          "B) the questions on the survey weren't enough for a reliable result",
          "C) the reason for happiness in Denmark isn't money or health",
          "D) Iceland isn't one of the happiest countries in the world"
        ],
        answer: "D"
      },
      {
        id: 4,
        question: "According to paragraph 4, some researchers ----.",
        options: [
          "A) don't measure happiness by money and health",
          "B) have fewer than 5 categories to measure happiness",
          "C) have a website which tells people how to be happy",
          "D) don't tell the results of their survey to the visitors"
        ],
        answer: "A"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'measure' is closest in meaning to ----.",
        options: ["A) calculate", "B) purchase", "C) contain"],
        answer: "A"
      },
      {
        id: 2,
        question: "'king' is closest in meaning to ----.",
        options: ["A) owner", "B) ruler", "C) investor"],
        answer: "B"
      },
      {
        id: 3,
        question: "'survey' is closest in meaning to ----.",
        options: ["A) research", "B) expense", "C) profit"],
        answer: "A"
      },
      {
        id: 4,
        question: "'sad' is the antonym of the word ----.",
        options: ["A) happy", "B) upset", "C) infirm"],
        answer: "A"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 63,
    title: "The Plastiki: A Boat Made of Bottles",
    cefr: "B1",
    theme: "Vocabulary & Environment",
    paragraphs: [
      "3 1 The Plastiki looks like other boats or yachts in Sydney harbour. It's 18 m long, 6 m wide and it - weighs about 12000 kg. It carries a crew of 6 people - and has an average speed of 5 knots. However, when you get near to the Plastiki, you realise there's a difference. It's made of 12500 z recycled plastic bottles. 2 One day, the environmentalist David De Rothschild was reading some information about all the plastic in the seas and oceans. He couldn't believe what he was reading. For example, humans throw away four out of every five plastic bottles that they use and plastic rubbish causes about eighty per cent of the pollution in the sea. Soon afterwards, Rothschild decided that he wanted to help the fight against pollution in the sea. To create publicity for the problem, he started building a boat made of plastic bottles so that everyone would learn and care about it",
      "As well as building the boat with recycled plastic, it was important for him to make the boat, environmentally-friendly. It uses wind power and: solar energy. The crew make meals with vegetables from the garden at the back of the boat. They can do exercise by using the special exercise 1 bicycle. The energy from the bike provides power for the computers. And if anyone needs to take a shower, the boat's shower uses saltwater from the sea",
      "De Rothschild sailed the Plastiki across the Pacific Ocean from San Francisco to Sydney. That's 15372 nautical kilometres. On the way, De Rothschild took the special boat through the ‘Great Garbage Patch’. It is a huge area in the Pacific with 3.5 billion wane ak indi! foe kilogrammes of rubbish. You can see every kind of human rubbish here: shoes, toys, bags, toothbrushes, but the worst problem is the plastic. It kills birds and sea life",
      "The journey wasn't always easy and De Rothschild and his crew had to take care during storms. There were giant ocean waves and winds of over 100 km per hour. The whole journey i took 129 days. Originally, De Rothschild thought the boat could only travel once but it 5 survived so well that he is planning to sail it again a one day. “"
    ],
    vocabulary: [
      { term: "yacht", meaning: "yat", partOfSpeech: "n", definition: "A large boat used for pleasure or racing.", exampleSentence: "The Plastiki looks like other yachts." },
      { term: "harbour", meaning: "liman", partOfSpeech: "n", definition: "A place on the coast where ships are kept safely.", exampleSentence: "The boat is in Sydney harbour." },
      { term: "weigh", meaning: "ağırlığında olmak", partOfSpeech: "v", definition: "To have a particular weight.", exampleSentence: "It weighs about 12,000 kg." },
      { term: "crew", meaning: "mürettebat", partOfSpeech: "n", definition: "The people who work on a ship or boat.", exampleSentence: "It carries a crew of 6 people." },
      { term: "realise", meaning: "fark etmek, anlamak", partOfSpeech: "v", definition: "To become aware of something.", exampleSentence: "You realise there's a difference." },
      { term: "recycled", meaning: "geri dönüştürülmüş", partOfSpeech: "adj", definition: "Made from used materials that are treated again.", exampleSentence: "It's made of recycled plastic bottles." },
      { term: "environmentalist", meaning: "çevreci, çevre aktivisti", partOfSpeech: "n", definition: "A person who works to protect the environment.", exampleSentence: "David De Rothschild is an environmentalist." },
      { term: "throw away", meaning: "atmak, çöpe atmak", partOfSpeech: "v", definition: "To get rid of something you no longer want.", exampleSentence: "Humans throw away many plastic bottles." },
      { term: "rubbish", meaning: "çöp, atık", partOfSpeech: "n", definition: "Things you throw away because they are not wanted.", exampleSentence: "Plastic rubbish causes much sea pollution." },
      { term: "pollution", meaning: "kirlilik", partOfSpeech: "n", definition: "Harmful substances in the air, water or land.", exampleSentence: "Plastic causes most of the pollution in the sea." },
      { term: "publicity", meaning: "tanıtım, kamuoyu ilgisi", partOfSpeech: "n", definition: "Public attention given to something.", exampleSentence: "He built the boat to create publicity." },
      { term: "environmentally-friendly", meaning: "çevre dostu", partOfSpeech: "adj", definition: "Not harmful to the environment.", exampleSentence: "It was important to make the boat environmentally-friendly." },
      { term: "reuse", meaning: "yeniden kullanmak", partOfSpeech: "v", definition: "To use something again.", exampleSentence: "We can reuse plastic instead of throwing it away." },
      { term: "solar energy", meaning: "güneş enerjisi", partOfSpeech: "n", definition: "Energy from the sun.", exampleSentence: "The boat uses wind power and solar energy." },
    ],
    vocabularySource: "uygulama",
    questions: [
      {
        id: 1,
        question: "--- income / number / level",
        options: [
          "A) imply that it's the first boat that is made of plastic botties",
          "B) point out how easy it is to build it",
          "C) express his great admiration for it",
          "D) tell how it's similar to and different from the other boats"
        ],
        answer: "D"
      },
      {
        id: 2,
        question: "---- glass / paper / cartridge",
        options: [
          "A) making progress",
          "B) attracting attention",
          "C) avoiding confusion",
          "D) causing trouble"
        ],
        answer: "B"
      },
      {
        id: 3,
        question: "---- needs / treatment / offer",
        options: [
          "A) to explain how the idea of the Plastik come out",
          "B) to give the reasons of environmental pollution",
          "C) to emphasize human beings effect on pollution",
          "D) to show Rothschild's interest in the environment"
        ],
        answer: "A"
      },
      {
        id: 4,
        question: "---- fund / help / food / information",
        options: [
          "A) crew",
          "B) sources",
          "C) meals DJ vegetables WI ANIN BIL KGETIN"
        ],
        answer: "A"
      },
      {
        id: 5,
        question: "--- step / machine",
        options: [
          "A) De Rothschild discovered an area with tons of rubbish in the Pacific",
          "B) the Plastiki did not travel so long on its first joumey",
          "C) there is not only plastic in the 'Great Garbage Patch",
          "D) the 'Great Garbage Patch' is visible from San Francisco and Sydney"
        ],
        answer: "C"
      },
      {
        id: 6,
        question: "-— 10 days 6. -—~ 18 days / medicine / a taxi / medicine / a taxi",
        options: [
          "A) sarcastic",
          "B) narrative",
          "C) encouraging",
          "D) persuasive EXERCISE 4. Choose the correct option. 1.-income/number/level",
          "E) harmful",
          "F) average 2.-glass/paper/cartridge",
          "G) recycled",
          "H) honest"
        ],
        answer: "B"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'look like' is closest in meaning to ----.",
        options: ["A) resemble", "B) continue", "C) supply"],
        answer: "A"
      },
      {
        id: 2,
        question: "'rubbish' is closest in meaning to ----.",
        options: ["A) waste", "B) profit", "C) crew"],
        answer: "A"
      },
      {
        id: 3,
        question: "'need' is closest in meaning to ----.",
        options: ["A) combine", "B) require", "C) reuse"],
        answer: "B"
      },
      {
        id: 4,
        question: "'provide' is closest in meaning to ----.",
        options: ["A) take", "B) supply", "C) throw away"],
        answer: "B"
      },
    ],
    sourceFidelity: "ocr-yapisal"
  },
  {
    id: 64,
    title: "Koko: The Gorilla Who Learned Sign Language",
    cefr: "B1",
    theme: "Past Simple & Vocabulary",
    paragraphs: [
      "Did you know that animals are also in contact with each other? Bees communicate by dancing. Whales talk to each other by singing. And some apes talk to humans by using American Sign Language.",
      "Meet Koko: a female gorilla born at the San Francisco Zoo on July 4th, 1971. Koko learned sign language from her trainer, Dr. Penny Patterson. Patterson began teaching sign language to Koko in 1972, when Koko was one year old. Koko was a good student for sure, so two years later she moved onto the Stanford University campus with Dr. Patterson. Koko continued to learn on the campus until 1976. That's when she began living full-time with Patterson's group, the Gorilla Foundation. The relationship between Patterson and Koko has blossomed ever since.",
      "Dr. Patterson says that Koko has mastered sign language. She says that Koko knows over 1,000 words, and that Koko makes up new words. For example, Koko didn't know the sign for ring, so she signed the words finger and bracelet. Dr. Patterson thinks that this shows meaningful and constructive use of language.",
      "Not everyone agrees with Dr. Patterson. Some argue that apes like Koko do not understand the meaning of what they are doing. Skeptics say that these apes are just performing complex tricks. For example, if Koko points to an apple and signs red or apple, Dr. Patterson will give her an apple. They argue that Koko does not really know what the sign apple means. She only knows that if she makes the right motion, then she gets an apple. The debate is unsolved, but one thing is for certain: Koko is an extraordinary ape."
    ],
    vocabulary: [
      { term: "in contact with", meaning: "ile iletişim halinde", partOfSpeech: "phr", definition: "Communicating with someone or something.", exampleSentence: "Animals are also in contact with each other." },
      { term: "communicate", meaning: "iletişim kurmak", partOfSpeech: "v", definition: "To share information with others.", exampleSentence: "Bees communicate by dancing." },
      { term: "ape", meaning: "insansı maymun", partOfSpeech: "n", definition: "A large primate such as a gorilla or chimpanzee.", exampleSentence: "Apes talk to humans by using sign language." },
      { term: "sign language", meaning: "işaret dili", partOfSpeech: "n", definition: "A language that uses hand movements.", exampleSentence: "Koko learned American Sign Language." },
      { term: "gorilla", meaning: "goril", partOfSpeech: "n", definition: "A very large, strong ape from Africa.", exampleSentence: "Koko is a female gorilla." },
      { term: "trainer", meaning: "eğitmen", partOfSpeech: "n", definition: "A person who teaches skills to a person or animal.", exampleSentence: "Koko learned from her trainer, Dr. Patterson." },
      { term: "campus", meaning: "kampüs, yerleşke", partOfSpeech: "n", definition: "The grounds of a university or college.", exampleSentence: "She moved onto the Stanford University campus." },
      { term: "blossom", meaning: "gelişmek, serpilmek", partOfSpeech: "v", definition: "To develop and become successful.", exampleSentence: "Their relationship has blossomed ever since." },
      { term: "master", meaning: "ustalaşmak, iyi öğrenmek", partOfSpeech: "v", definition: "To learn a skill so well that you can do it perfectly.", exampleSentence: "Patterson says Koko has mastered sign language." },
      { term: "make up", meaning: "uydurmak, oluşturmak", partOfSpeech: "v", definition: "To invent something new.", exampleSentence: "Koko makes up new words." },
      { term: "meaningful", meaning: "anlamlı", partOfSpeech: "adj", definition: "Having a clear purpose or meaning.", exampleSentence: "This shows meaningful use of language." },
      { term: "creative", meaning: "yaratıcı", partOfSpeech: "adj", definition: "Involving new and original ideas.", exampleSentence: "This shows creative use of language." },
      { term: "argue", meaning: "iddia etmek, savunmak", partOfSpeech: "v", definition: "To give reasons for or against an idea.", exampleSentence: "Some scientists argue apes don't understand language." },
      { term: "relationship", meaning: "ilişki", partOfSpeech: "n", definition: "The way two people or things are connected.", exampleSentence: "The relationship between them has blossomed." },
    ],
    vocabularySource: "uygulama",
    questions: [
      {
        id: 1,
        question: "In paragraph 1, the author mentions different animals to show that ----.",
        options: [
          "A) communication is easy and even animals can talk",
          "B) animals are as intelligent as human beings",
          "C) humans are not the only species using languages",
          "D) bees and whales cannot use sign language"
        ],
        answer: "C"
      },
      {
        id: 2,
        question: "The word \"blossom\" in paragraph 2 means ----.",
        options: [
          "A) end",
          "B) start",
          "C) break",
          "D) develop"
        ],
        answer: "D"
      },
      {
        id: 3,
        question: "Which of the following is TRUE according to paragraph 3?",
        options: [
          "A) Koko could learn more than 1000 words.",
          "B) Dr. Patterson teaches Koko one word every day.",
          "C) Koko had difficulty learning the word bracelet.",
          "D) Dr. Patterson taught Koko different languages."
        ],
        answer: "A"
      },
      {
        id: 4,
        question: "One can infer from paragraph 4 that ----.",
        options: [
          "A) Koko is the last gorilla that can use sign language",
          "B) other apes are not as clever as Koko",
          "C) Koko isn't the only gorilla who can use sign language",
          "D) red apples are favourite food of apes"
        ],
        answer: "C"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'communicate' is closest in meaning to ----.",
        options: ["A) hesitate", "B) interact", "C) demonstrate"],
        answer: "B"
      },
      {
        id: 2,
        question: "'trainer' is closest in meaning to ----.",
        options: ["A) teacher", "B) product", "C) institution"],
        answer: "A"
      },
      {
        id: 3,
        question: "'over' (in 'over 1,000 signs') is closest in meaning to ----.",
        options: ["A) more than", "B) equal to", "C) fewer than"],
        answer: "A"
      },
      {
        id: 4,
        question: "'make up' is closest in meaning to ----.",
        options: ["A) invent", "B) spend", "C) show"],
        answer: "A"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 65,
    title: "Google: When a Company Name Becomes a Verb",
    cefr: "B2",
    theme: "Vocabulary & Contrast",
    paragraphs: [
      "You know that you're doing something big when your company name becomes a verb. Ask Xerox. In 1959 they created the first plain paper copy machine. It was one of the most successful products ever. The company name Xerox grew into a verb that means \"to copy,\" as in \"Bob, can you Xerox this for me?\". Around 50 years later, the same thing happened to Google. Their company name grew into a verb that means \"to do an internet search.\" Now everyone and their grandma know what it means to Google it.",
      "Unlike Xerox, Google wasn't the first company to invent their product. Lycos released their search engine in 1993. Yahoo! came out in 1994. AltaVista began serving results in 1995. Google did not come out until years later, in 1998. Although a few years difference may not seem like much, this is a major advantage in the fast moving world of tech. So how did Google do it? How did they overtake their competitors who were such big leaders in time and money? Maybe one good idea made all the difference.",
      "There are millions and millions of sites on the internet. How does a search engine know which ones are relevant to your search? This is a question that great minds have worked on for decades. To understand how Google changed the game, you need to know how search engines worked in 1998. Back then most websites looked at the words in your query. They counted how many times those words appeared on pages. Then they showed pages where the words in your query appeared the most. This system did not work well and people often had to click through pages and pages of results to find what they wanted.",
      "Google was the first search engine that began considering links. Links are those blue underlined words that take you to other pages when you click on them. Larry Page, cofounder of Google, believed that meaningful data could be drawn from how those links connect. Page figured that websites with many links that point at them were more important than those that had few. He was right. Google's search results were much better than their rivals. They soon became the world's most used search engine."
    ],
    vocabulary: [
      { term: "create", meaning: "yaratmak, oluşturmak", partOfSpeech: "v", definition: "To make something new.", exampleSentence: "In 1959 they created the first copy machine." },
      { term: "plain", meaning: "sade, düz", partOfSpeech: "adj", definition: "Simple and ordinary; without decoration.", exampleSentence: "They created the first plain paper copy machine." },
      { term: "successful", meaning: "başarılı", partOfSpeech: "adj", definition: "Achieving what was wanted; doing well.", exampleSentence: "It was one of the most successful products ever." },
      { term: "verb", meaning: "fiil", partOfSpeech: "n", definition: "A word that describes an action.", exampleSentence: "The company name grew into a verb." },
      { term: "happen", meaning: "olmak, meydana gelmek", partOfSpeech: "v", definition: "To take place or occur.", exampleSentence: "The same thing happened to Google." },
      { term: "search engine", meaning: "arama motoru", partOfSpeech: "n", definition: "A program that finds information on the internet.", exampleSentence: "Lycos released their search engine in 1993." },
      { term: "come out", meaning: "piyasaya çıkmak", partOfSpeech: "v", definition: "To become available to the public.", exampleSentence: "Yahoo! came out in 1994." },
      { term: "advantage", meaning: "avantaj, üstünlük", partOfSpeech: "n", definition: "Something that helps you do better than others.", exampleSentence: "This is a major advantage in tech." },
      { term: "overtake", meaning: "geçmek, sollamak", partOfSpeech: "v", definition: "To become more successful than someone.", exampleSentence: "Google overtook its competitors." },
      { term: "competitor", meaning: "rakip", partOfSpeech: "n", definition: "A person or company that competes with another.", exampleSentence: "Its competitors were big leaders." },
      { term: "relevant", meaning: "ilgili, alakalı", partOfSpeech: "adj", definition: "Connected with what is being discussed.", exampleSentence: "Google found the most relevant sites." },
      { term: "figure out", meaning: "çözmek, anlamak", partOfSpeech: "v", definition: "To find the answer to a problem.", exampleSentence: "Google figured out which sites were most relevant." },
      { term: "result", meaning: "sonuç", partOfSpeech: "n", definition: "Something produced by an action or process.", exampleSentence: "AltaVista began serving results in 1995." },
      { term: "major", meaning: "büyük, önemli", partOfSpeech: "adj", definition: "Very large or important.", exampleSentence: "This is a major advantage." },
    ],
    vocabularySource: "uygulama",
    questions: [
      {
        id: 1,
        question: "In paragraph 1, the author's purpose is to----.",
        options: [
          "A) inform the readers about the recent developments in English language",
          "B) persuade the readers that some companies become big by choosing the right name",
          "C) entertain the readers by telling strange facts about famous websites",
          "D) help readers understand if a company is successful or not"
        ],
        answer: "D"
      },
      {
        id: 2,
        question: "In paragraph 2, the author mentions Xerox in order to ----.",
        options: [
          "A) show how it differs from Google",
          "B) explain why some companies are rich",
          "C) remind that its name is a verb",
          "D) claim that it is the best company"
        ],
        answer: "A"
      },
      {
        id: 3,
        question: "The word \"they\" in paragraph 3 refers to ----.",
        options: [
          "A) pages",
          "B) websites",
          "C) words",
          "D) times"
        ],
        answer: "B"
      },
      {
        id: 4,
        question: "According to paragraph 4, which of the following is FALSE about links?",
        options: [
          "A) Links allow people to surf from one website to the next.",
          "B) Larry Page's ideas about links helped Google get to the top.",
          "C) Larry Page invented links and contributed to the internet.",
          "D) Links and their connection were first studied by Google."
        ],
        answer: "C"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'plain' is closest in meaning to ----.",
        options: ["A) wealthy", "B) simple", "C) major"],
        answer: "B"
      },
      {
        id: 2,
        question: "'happen' is closest in meaning to ----.",
        options: ["A) occur", "B) study", "C) create"],
        answer: "A"
      },
      {
        id: 3,
        question: "'come out' is closest in meaning to ----.",
        options: ["A) emerge", "B) lose", "C) overtake"],
        answer: "A"
      },
      {
        id: 4,
        question: "'result' is closest in meaning to ----.",
        options: ["A) consequence", "B) treat", "C) advantage"],
        answer: "A"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 66,
    title: "Life on Mars? Terraforming a Planet",
    cefr: "C1",
    theme: "Conditionals & Vocabulary",
    paragraphs: [
      "If we tried to, could we really transform the frozen surface of Mars into something more friendly – a place where humans could live? And equally importantly, should we?",
      "The first question has a clear answer: Yes, we probably could. NASA planetary scientist Chris McKay says, \"Most of the work in 'terraforming' (making it similar to Earth) would be done by life itself. We wouldn't have to build Mars, just modify its atmosphere\", \"If we warmed it up and threw in some seeds, plants would grow there\".",
      "Robert Zubrin, an engineer and president of the Mars Society, dreams of Martian cities. He thinks one day, we will have urban areas in Mars! Zubrin believes civilisation cannot succeed if it doesn't expand limitlessly. He also thinks that if we transformed Mars, we might learn to manage our limited Earth better. He also says, if he was an astronaut, he wouldn't volunteer for that six-month journey!",
      "YEAR ZERO: The thousand-year project might begin with a series of eighteen-month survey missions. Each crew member who make the six-month journey from Earth to Mars would add a small habitation module to the base.",
      "100 YEARS: We could make an Earth-like atmosphere. First, we would release the carbon dioxide which is now frozen in the ice. Maybe mirrors could focus sunlight on the ice to do this.",
      "200 YEARS: With enough carbon dioxide, the temperature would go up and rain would fall. Algae and microbes could survive and transform the rocky surface.",
      "600 YEARS: Flowering plants could be introduced when the microbes had created soil. This would add oxygen to the atmosphere. Forests might even grow."
    ],
    vocabulary: [
      { term: "transform", meaning: "dönüştürmek", partOfSpeech: "v", definition: "To change something completely.", exampleSentence: "Could we transform the surface of Mars?" },
      { term: "surface", meaning: "yüzey", partOfSpeech: "n", definition: "The outer or top layer of something.", exampleSentence: "The frozen surface of Mars is very cold." },
      { term: "modify", meaning: "değiştirmek, düzenlemek", partOfSpeech: "v", definition: "To make small changes to something.", exampleSentence: "We would just modify its atmosphere." },
      { term: "atmosphere", meaning: "atmosfer", partOfSpeech: "n", definition: "The layer of gases around a planet.", exampleSentence: "We would modify the planet's atmosphere." },
      { term: "urban", meaning: "kentsel", partOfSpeech: "adj", definition: "Relating to a city or town.", exampleSentence: "One day we will have urban areas on Mars." },
      { term: "succeed", meaning: "başarılı olmak", partOfSpeech: "v", definition: "To achieve what you wanted.", exampleSentence: "Civilisation cannot succeed without expanding." },
      { term: "expand", meaning: "genişlemek, yayılmak", partOfSpeech: "v", definition: "To become larger.", exampleSentence: "He believes civilisation must expand." },
      { term: "volunteer", meaning: "gönüllü olmak", partOfSpeech: "v", definition: "To offer to do something without being asked.", exampleSentence: "He wouldn't volunteer for that journey." },
      { term: "mission", meaning: "görev, sefer", partOfSpeech: "n", definition: "An important task or journey with a purpose.", exampleSentence: "The project might begin with survey missions." },
      { term: "crew member", meaning: "mürettebat üyesi", partOfSpeech: "n", definition: "One of the people who work on a ship or spacecraft.", exampleSentence: "Each crew member would add a module." },
      { term: "release", meaning: "salıvermek, açığa çıkarmak", partOfSpeech: "v", definition: "To let a substance escape.", exampleSentence: "We would release the frozen carbon dioxide." },
      { term: "focus", meaning: "odaklamak, yoğunlaştırmak", partOfSpeech: "v", definition: "To direct light or attention onto one point.", exampleSentence: "Mirrors could focus sunlight on the ice." },
      { term: "probably", meaning: "muhtemelen", partOfSpeech: "adv", definition: "Almost certainly; very likely.", exampleSentence: "Yes, we probably could do it." },
      { term: "survive", meaning: "hayatta kalmak", partOfSpeech: "v", definition: "To continue to live or exist.", exampleSentence: "Could humans survive on Mars?" },
    ],
    vocabularySource: "uygulama",
    questions: [
      {
        id: 1,
        question: "According to paragraph 3, Robert Zubrin thinks, on Mars, we will have ----.",
        options: [
          "A) animal farms",
          "B) cities",
          "C) villages",
          "D) new people"
        ],
        answer: "B"
      },
      {
        id: 2,
        question: "In which Martian year, small organisms might start to live after some climate changes?",
        options: [
          "A) year zero",
          "B) 100 years",
          "C) 200 years",
          "D) 600 years"
        ],
        answer: "C"
      },
      {
        id: 3,
        question: "The word \"this\" in paragraph 5 refers to ----.",
        options: [
          "A) to change the Martian atmosphere",
          "B) to change the colour of Martian sun",
          "C) to freeze the ice on Mars",
          "D) to release carbondioxide from Earth"
        ],
        answer: "A"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'transform' is closest in meaning to ----.",
        options: ["A) build", "B) change", "C) fall"],
        answer: "B"
      },
      {
        id: 2,
        question: "'probably' is closest in meaning to ----.",
        options: ["A) even", "B) perhaps", "C) never"],
        answer: "B"
      },
      {
        id: 3,
        question: "'succeed' is closest in meaning to ----.",
        options: ["A) accomplish", "B) seek", "C) fall"],
        answer: "A"
      },
      {
        id: 4,
        question: "'survive' is closest in meaning to ----.",
        options: ["A) yield", "B) endure", "C) create"],
        answer: "B"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 67,
    title: "Trans-fats and Your Health",
    cefr: "B2",
    theme: "Cause & Effect / Vocabulary",
    paragraphs: [
      "Many people prefer \"junk food\" to healthy food because they develop a taste for it. However, trans fat raises the bad cholesterol in your body and lowers the good cholesterol that the body needs. Fatty foods do more than cause obesity. Trans fats build up in the body and block blood flow to the heart. People whose diet contains a high percentage of trans fats are at risk for heart diseases.",
      "Trans-fat is made by adding hydrogen to liquid oil. Food companies and restaurants use trans-fat oil as it is inexpensive and makes food last longer. It also improves the taste and texture of food. They became very popular in the second half of the 20th century. This is when butter got a bad name. By health care professionals, people were told to use margarine instead which was made from trans fats.",
      "Today doctors know how dangerous these processed foods are. In countries such as the US and Canada there are new government restrictions on food production. Food and beverage makers have to attach Nutrition Fact labels to their products. These have a list of daily recommendations and give details about all ingredients including the amount of trans-fats in a product. New York City banned trans fats from all restaurants. Even fast food chains such as McDonalds are being forced to change their recipes. In Europe, food manufacturers have started using a voluntary labelling system at the consumers' request.",
      "We all need some fat in our diet. There are three different types of fats: saturated fats, trans fats, and unsaturated fats. Doctors recommend that we get most of our fatty calories from unsaturated fats. Neither butter nor margarine fit in this category, though there are some spreads that contain zero trans fats. Labels are a good way to avoid eating fatty foods, but a better way is to avoid eating out."
    ],
    vocabulary: [
      { term: "junk food", meaning: "abur cubur, sağlıksız yiyecek", partOfSpeech: "n", definition: "Food that is unhealthy but quick and easy to eat.", exampleSentence: "Many people prefer junk food to healthy food." },
      { term: "develop a taste for", meaning: "-e alışmak, tadını sevmek", partOfSpeech: "phr", definition: "To start to like something over time.", exampleSentence: "They develop a taste for junk food." },
      { term: "cholesterol", meaning: "kolesterol", partOfSpeech: "n", definition: "A fatty substance in the blood.", exampleSentence: "Trans fat raises the bad cholesterol." },
      { term: "obesity", meaning: "obezite, aşırı şişmanlık", partOfSpeech: "n", definition: "The state of being very overweight.", exampleSentence: "Fatty foods can cause obesity." },
      { term: "block", meaning: "engellemek, tıkamak", partOfSpeech: "v", definition: "To stop something from moving through.", exampleSentence: "Trans fats block blood flow to the heart." },
      { term: "diet", meaning: "beslenme, diyet", partOfSpeech: "n", definition: "The kind of food a person usually eats.", exampleSentence: "A diet high in trans fats is risky." },
      { term: "inexpensive", meaning: "ucuz, ekonomik", partOfSpeech: "adj", definition: "Not costing much money.", exampleSentence: "Trans-fat oil is inexpensive." },
      { term: "improve", meaning: "iyileştirmek, geliştirmek", partOfSpeech: "v", definition: "To make something better.", exampleSentence: "It improves the taste and texture of food." },
      { term: "texture", meaning: "doku, kıvam", partOfSpeech: "n", definition: "The way something feels or its structure.", exampleSentence: "It improves the taste and texture." },
      { term: "processed", meaning: "işlenmiş", partOfSpeech: "adj", definition: "(Of food) changed and prepared using industry.", exampleSentence: "Doctors know how dangerous these processed foods are." },
      { term: "restriction", meaning: "kısıtlama", partOfSpeech: "n", definition: "A rule that limits what you can do.", exampleSentence: "There are new government restrictions." },
      { term: "recommendation", meaning: "tavsiye, öneri", partOfSpeech: "n", definition: "A suggestion about the best thing to do.", exampleSentence: "Labels give a list of daily recommendations." },
      { term: "ingredient", meaning: "içindekiler, malzeme", partOfSpeech: "n", definition: "One of the foods used to make a dish.", exampleSentence: "Labels give details about all ingredients." },
      { term: "ban", meaning: "yasaklamak", partOfSpeech: "v", definition: "To officially say something is not allowed.", exampleSentence: "New York City banned trans fats." },
    ],
    vocabularySource: "uygulama",
    questions: [
      {
        id: 1,
        question: "Which of the following is NOT given as a result of eating food with high amount of trans fats in paragraph 1?",
        options: [
          "A) getting overweight",
          "B) problems with heart",
          "C) high blood pressure",
          "D) increase in bad cholesterol"
        ],
        answer: "C"
      },
      {
        id: 2,
        question: "The word \"restrictions\" in paragraph 3 closest in meaning to ----.",
        options: [
          "A) permissions",
          "B) regulations",
          "C) aims",
          "D) plans"
        ],
        answer: "B"
      },
      {
        id: 3,
        question: "What does \"these\" in paragraph 3 refer to?",
        options: [
          "A) Nutrition Fact labels",
          "B) food and beverage makers",
          "C) processed foods",
          "D) products"
        ],
        answer: "A"
      },
      {
        id: 4,
        question: "One can infer from the text that ----.",
        options: [
          "A) in Europe, foods that have trans fats in them have to indicate it on their labels",
          "B) small amounts of trans fats occur naturally in some meat and dairy products",
          "C) in 1990, scientists began to find the bad effects of trans fats",
          "D) nutrition Fact labels help consumers make healthier choices"
        ],
        answer: "D"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'raise' is closest in meaning to ----.",
        options: ["A) increase", "B) drop", "C) contain"],
        answer: "A"
      },
      {
        id: 2,
        question: "'inexpensive' is closest in meaning to ----.",
        options: ["A) cheap", "B) gainful", "C) obvious"],
        answer: "A"
      },
      {
        id: 3,
        question: "'improve' is closest in meaning to ----.",
        options: ["A) deteriorate", "B) enhance", "C) require"],
        answer: "B"
      },
      {
        id: 4,
        question: "'recommendation' is closest in meaning to ----.",
        options: ["A) threat", "B) advice", "C) demand"],
        answer: "B"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 68,
    title: "The Fitness Pill",
    cefr: "B2",
    theme: "Vocabulary & Present Continuous",
    paragraphs: [
      "These days there are pills for just about everything. If you can't sleep, take a pill. If you're unhappy, take a pill. What about if you're overweight and you don't have time to exercise? A new fitness pill may soon be available. Scientists are developing a pill that provides the same benefits as exercise. According to a BBC report, the fitness pill will \"build muscle, increase stamina, and even burn fat.\"",
      "Would you take a pill if it meant you no longer needed the treadmill? Researchers found that mice who took these pills could run long-distances without previous training. The test mice also ran almost twice as far. There is evidence that humans on these pills will also be able to build muscles without exercising. Furthermore, the research suggests that those who exercise and take the fitness pill will be even stronger.",
      "Some researchers think the fitness pill will be useful in certain situations. People who cannot get out of bed due to ill health may benefit from the drug. There are also patients whose diseases cause their muscles waste away. Those with diabetes may benefit as well. Other researchers feel that the average adult might benefit from such a drug. Most adults do not get the 40 minutes of daily exercise that doctors recommend. The fitness pill requires no need for spare time.",
      "The greatest concern about the fitness pill is in the sports world. Some fear that athletes will be tempted to use this drug to enhance performance. The pill has not been approved for human use yet, however, some athletes may already be taking it. Top athletes already go through extensive drug testing before national and international events. The renowned gold medalist swimmer, Michael Phelps, voluntarily went through extra drug testing before the 2008 Olympics. He wanted to prove to the public that his strength comes from hard work and training before the world became skeptical."
    ],
    vocabulary: [
      { term: "pill", meaning: "hap, ilaç", partOfSpeech: "n", definition: "A small round piece of medicine to be swallowed.", exampleSentence: "There are pills for just about everything." },
      { term: "available", meaning: "mevcut, ulaşılabilir", partOfSpeech: "adj", definition: "Able to be obtained or used.", exampleSentence: "A new fitness pill may soon be available." },
      { term: "develop", meaning: "geliştirmek", partOfSpeech: "v", definition: "To create something new over time.", exampleSentence: "Scientists are developing a fitness pill." },
      { term: "benefit", meaning: "fayda; yararlanmak", partOfSpeech: "n", definition: "A helpful or useful effect.", exampleSentence: "The pill provides the same benefits as exercise." },
      { term: "stamina", meaning: "dayanıklılık", partOfSpeech: "n", definition: "The physical energy to keep going for a long time.", exampleSentence: "The pill will increase stamina." },
      { term: "treadmill", meaning: "koşu bandı", partOfSpeech: "n", definition: "A machine for walking or running indoors.", exampleSentence: "You would no longer need the treadmill." },
      { term: "previous", meaning: "önceki", partOfSpeech: "adj", definition: "Coming before something in time.", exampleSentence: "The mice ran without previous training." },
      { term: "evidence", meaning: "kanıt, delil", partOfSpeech: "n", definition: "Facts that show something is true.", exampleSentence: "There is evidence that humans will benefit too." },
      { term: "disease", meaning: "hastalık", partOfSpeech: "n", definition: "An illness affecting the body.", exampleSentence: "Some diseases cause muscles to waste away." },
      { term: "waste away", meaning: "erimek, güçten düşmek", partOfSpeech: "v", definition: "To become gradually thinner and weaker.", exampleSentence: "Their muscles waste away." },
      { term: "require", meaning: "gerektirmek", partOfSpeech: "v", definition: "To need something.", exampleSentence: "The pill would require no spare time." },
      { term: "enhance", meaning: "artırmak, geliştirmek", partOfSpeech: "v", definition: "To improve the quality of something.", exampleSentence: "Athletes might use it to enhance performance." },
      { term: "approve", meaning: "onaylamak", partOfSpeech: "v", definition: "To officially accept something.", exampleSentence: "The pill has not been approved for humans yet." },
      { term: "renowned", meaning: "ünlü, tanınmış", partOfSpeech: "adj", definition: "Famous and admired for something.", exampleSentence: "The renowned gold medalist was tested." },
    ],
    vocabularySource: "uygulama",
    questions: [
      {
        id: 1,
        question: "What does \"stamina\" in paragraph 1 is closest in meaning to ----.?",
        options: [
          "A) assistance",
          "B) profit",
          "C) interaction",
          "D) energy"
        ],
        answer: "D"
      },
      {
        id: 2,
        question: "The author starts paragraph 2 with a question to ----.",
        options: [
          "A) have the reader question the concepts in the text",
          "B) encourage the reader think more deeply about what he presents",
          "C) learn about the readers' ideas about his subject",
          "D) to make his writing more interesting, memorable and persuasive"
        ],
        answer: "D"
      },
      {
        id: 3,
        question: "What is the main idea of paragraph 2?",
        options: [
          "A) Evidence suggests that fitness pills have several advantages.",
          "B) Mice benefit from fitness pills more than humans.",
          "C) When you are on fitness pills, you can run faster and further.",
          "D) The best way to build muscles is taking fitness pills."
        ],
        answer: "A"
      },
      {
        id: 4,
        question: "According to the passage Michael Phelps ----.",
        options: [
          "A) gets his strength and energy from fitness pills",
          "B) refused to go through extra drug testing",
          "C) owes his gold medals to hard work and training",
          "D) failed the drug test before the 2008 Olympics"
        ],
        answer: "C"
      },
      {
        id: 5,
        question: "What is the author's attitude towards fitness pills?",
        options: [
          "A) humorous",
          "B) objective",
          "C) pessimistic",
          "D) indifferent"
        ],
        answer: "B"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'previous' is closest in meaning to ----.",
        options: ["A) substantial", "B) former", "C) nearly"],
        answer: "B"
      },
      {
        id: 2,
        question: "'almost' is closest in meaning to ----.",
        options: ["A) nearly", "B) easily", "C) former"],
        answer: "A"
      },
      {
        id: 3,
        question: "'disease' is closest in meaning to ----.",
        options: ["A) disorder", "B) appearance", "C) medication"],
        answer: "A"
      },
      {
        id: 4,
        question: "'pill' is closest in meaning to ----.",
        options: ["A) rise", "B) medication", "C) former"],
        answer: "B"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 69,
    title: "The Most Successful Animal on Earth",
    cefr: "C1",
    theme: "Vocabulary & Argument",
    paragraphs: [
      "Which is the most successful animal alive today? Is it the lion, stretching in the midday African sun, or is it some insect reproducing itself in millions, deep in the Amazon rainforest? A good z argument could be made for humans themselves.. But the animal that seems to have made have made the most of its limited opportunities is the - domestic sheep, closely followed follow by - the horse, the pig, the cow, the dog, and all the other creatures. 2 These animals have made a huge progress similar to that of humans. They have escaped the pressures which would have wiped out some of them. In 1860, humans and domesticated animals represented represented about five percent of all plant and animal life, while today they are about twenty percent, according to biologists. The domestic animals, the ones that have made themselves fit in with the existence of humans, are the success stories in the history of animal development",
      "This is certain to cause an argument because it denies a central claim of the animal rights movement which argues that animals should have - the same right as humans. Domestication ie means humans profiting from animals. Humans have - simply used animals for their own selfish purposes, - using use increasingly cruel methods. The B idea of domestication has actually helped animals survive and develop is a revolutionary, and will probably make the animal S rights movement even angrier. Yet, there is evidence to support it. prams ppp",
      "But if it was animals that took the first step in the process of domestication, agreeing to live with humans on a voluntary basis, what exactly did they get from it? Biologists argue that the driving force in all animals is the desire to ensure that they and their future generations survive, and if this is right then, wild cows and wild horses would have been wiped out if it were not for domestication. ™"
    ],
    vocabulary: [
      { term: "successful", meaning: "başarılı", partOfSpeech: "adj", definition: "Achieving a desired result; doing well.", exampleSentence: "Which is the most successful animal alive today?" },
      { term: "reproduce", meaning: "üremek, çoğalmak", partOfSpeech: "v", definition: "To produce young or offspring.", exampleSentence: "Some insects reproduce in their millions." },
      { term: "argument", meaning: "iddia, tartışma", partOfSpeech: "n", definition: "A reason given to support or oppose an idea.", exampleSentence: "A good argument could be made for humans." },
      { term: "domestic", meaning: "evcil", partOfSpeech: "adj", definition: "(Of animals) kept by humans; not wild.", exampleSentence: "The domestic sheep is very successful." },
      { term: "domesticated", meaning: "evcilleştirilmiş", partOfSpeech: "adj", definition: "(Of animals) tamed and kept by humans.", exampleSentence: "Sheep and cows are domesticated creatures." },
      { term: "progress", meaning: "ilerleme, gelişme", partOfSpeech: "n", definition: "Forward movement or improvement.", exampleSentence: "These animals have made huge progress." },
      { term: "pressure", meaning: "baskı", partOfSpeech: "n", definition: "A difficult force or influence.", exampleSentence: "They escaped the pressures of nature." },
      { term: "wipe out", meaning: "yok etmek", partOfSpeech: "v", definition: "To destroy something completely.", exampleSentence: "Those pressures would have wiped out some of them." },
      { term: "represent", meaning: "oluşturmak, temsil etmek", partOfSpeech: "v", definition: "To form or make up a particular amount.", exampleSentence: "They represented about five percent of life." },
      { term: "existence", meaning: "varlık, var oluş", partOfSpeech: "n", definition: "The state of being or living.", exampleSentence: "They fit in with the existence of humans." },
      { term: "certain", meaning: "kesin, muhakkak", partOfSpeech: "adj", definition: "Sure to happen; without doubt.", exampleSentence: "This is certain to cause an argument." },
      { term: "deny", meaning: "reddetmek, inkar etmek", partOfSpeech: "v", definition: "To say that something is not true.", exampleSentence: "It denies a central claim of the movement." },
      { term: "selfish", meaning: "bencil", partOfSpeech: "adj", definition: "Caring only about yourself.", exampleSentence: "Humans used animals for selfish purposes." },
      { term: "revolutionary", meaning: "devrimci, çığır açan", partOfSpeech: "adj", definition: "Completely new and very different.", exampleSentence: "This idea is revolutionary." },
    ],
    vocabularySource: "uygulama",
    questions: [
      {
        id: 1,
        question: "rely on (phr.v)",
        options: [
          "A) the number of domestic animals was far more than that of humans in the 19\" century",
          "B) domestic animals have benefited greatly from living with humans",
          "C) animals are more successful than humans in terms of survival strategies",
          "D) people learned how to domesticate animals during the late 19th century"
        ],
        answer: "B"
      },
      {
        id: 2,
        question: "depiction (n)",
        options: [
          "A) there has been a fierce confict among biologists over the domestication of animals",
          "B) some animals didn't have the opportunity to live with humans and thus became extinct",
          "C) the number of wild animals could have been more if they hadn't started living with humans",
          "D) wild animals could have become extinct if they hadn't been domesticated"
        ],
        answer: "D"
      },
      {
        id: 3,
        question: "Which of the following could be the best title of the passage?",
        options: [
          "A) How Domestication Has Helped Animals Survive",
          "B) Why People Started Domesticating Animals",
          "C) The History of Animal Domestication",
          "D) The Ways People Have Benefited from Animals"
        ],
        answer: "A"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'reproduce' is closest in meaning to ----.",
        options: ["A) proliferate", "B) cause", "C) refuse"],
        answer: "A"
      },
      {
        id: 2,
        question: "'wipe out' is closest in meaning to ----.",
        options: ["A) destroy", "B) increase", "C) change"],
        answer: "A"
      },
      {
        id: 3,
        question: "'certain' is closest in meaning to ----.",
        options: ["A) doubtful", "B) definite", "C) former"],
        answer: "B"
      },
      {
        id: 4,
        question: "'argument' is closest in meaning to ----.",
        options: ["A) effort", "B) claim", "C) target"],
        answer: "B"
      },
    ],
    sourceFidelity: "ocr-yapisal"
  },
  {
    id: 70,
    title: "King Arthur and the Round Table",
    cefr: "C1",
    theme: "Relative Clauses & Vocabulary",
    paragraphs: [
      "Many places in England claim connections with King: Arthur and his Knights of the Round T able and none wants to share this honour. Yet even today, with all high tech tools of modern archaeology, it is still impossible to know if such a king really existed, or whether the fabulous story of him and his men is just made-up. Similarly, many people wonder if the Round T able, around which he and his Knights gathered, was a real round table",
      "In fact, Arthur's Round T able exists near Winchester. It was first described 1155 by the French poet Wace, who relied on previous depictions by the guards of the mighty king. Its symbolism developed developed over time; by the 12\" century it had represented the chivalric order associated with Arthur's court. Today it is preserved inside the Great Hall, which is the only part of the former Winchester Castle that remains undamaged",
      "Certainly there are plenty of references to King Arthur. He is known to be the British leader in the early 6\" century, who led the defense of Britain against Saxon invaders. Arthur had already become a folk hero by the 9t century as a warrior king. But none of the information is very reliable. What is certain is that the idea of honor associated with him was not so popular in that period of British history, known as the Dark Ages",
      "The significance of the Round T able was that no one person, not even the mighty King Arthur, would be able to sit at the head of such a table. As its name suggests, it has no head, implying that everyone who sits there has equal status. A round table symbolized the concept of equality. The legend states that King Arthur ordered it to be built so that to it would resolve a conflict among his knights with regard to superiority. The Round T able was therefore - built to ensure that all the Knights of the Round T able were equal. -"
    ],
    vocabulary: [
      { term: "claim", meaning: "iddia etmek", partOfSpeech: "v", definition: "To say that something is true or yours.", exampleSentence: "Many places claim connections with King Arthur." },
      { term: "honour", meaning: "onur, şeref", partOfSpeech: "n", definition: "Great respect or a privilege.", exampleSentence: "None wants to share this honour." },
      { term: "archaeology", meaning: "arkeoloji", partOfSpeech: "n", definition: "The study of ancient peoples through their remains.", exampleSentence: "Modern archaeology still cannot prove it." },
      { term: "exist", meaning: "var olmak", partOfSpeech: "v", definition: "To be real or present.", exampleSentence: "It is impossible to know if the king existed." },
      { term: "made-up", meaning: "uydurma", partOfSpeech: "adj", definition: "Invented; not true.", exampleSentence: "The story may just be made-up." },
      { term: "gather", meaning: "toplanmak, bir araya gelmek", partOfSpeech: "v", definition: "To come together in a group.", exampleSentence: "The Knights gathered around the table." },
      { term: "rely on", meaning: "-e dayanmak, güvenmek", partOfSpeech: "v", definition: "To depend on someone or something.", exampleSentence: "Wace relied on previous depictions." },
      { term: "depiction", meaning: "betimleme, tasvir", partOfSpeech: "n", definition: "A description or picture of something.", exampleSentence: "He relied on depictions by the guards." },
      { term: "mighty", meaning: "güçlü, kudretli", partOfSpeech: "adj", definition: "Very powerful or strong.", exampleSentence: "He described the mighty king." },
      { term: "preserve", meaning: "korumak, muhafaza etmek", partOfSpeech: "v", definition: "To keep something safe and in good condition.", exampleSentence: "The table is preserved in the Great Hall." },
      { term: "reference", meaning: "atıf, gönderme", partOfSpeech: "n", definition: "A mention of something.", exampleSentence: "There are plenty of references to King Arthur." },
      { term: "reliable", meaning: "güvenilir", partOfSpeech: "adj", definition: "Able to be trusted.", exampleSentence: "None of the information is very reliable." },
      { term: "significance", meaning: "önem, anlam", partOfSpeech: "n", definition: "The importance or meaning of something.", exampleSentence: "The significance of the Round Table was equality." },
      { term: "associated with", meaning: "ile ilişkili", partOfSpeech: "adj", definition: "Connected with something.", exampleSentence: "Honour was associated with him." },
    ],
    vocabularySource: "uygulama",
    questions: [
      {
        id: 1,
        question: "rely on (phr.v)",
        options: [
          "A) many archaeologists from different parts of Britain are stil carrying out excavations",
          "B) most British people do not believe in the legend of King Arthur and his Knights of the Round Table",
          "C) we may never be sure of the existence of King Arthur and the Round Table",
          "D) archaeologists using cutting-edge technology fools can accurately tell whether the legend is true 5.",
          "E) mighty",
          "F) impossible --status/rights/pay/treatment/opportunities",
          "G) historical",
          "H) equal a conflict/matter/crisis/dispute/problem",
          "I) claim",
          "J) resolve"
        ],
        answer: "C"
      },
      {
        id: 2,
        question: "depiction (n)",
        options: [
          "A) Saxon invaders destroyed most of them",
          "B) most historians disagree on their authenticity",
          "C) they are not dependable at all",
          "D) there are others stating that he never existed"
        ],
        answer: "C"
      },
      {
        id: 3,
        question: "associated with (v)",
        options: [
          "A) how the Round Table was constructed",
          "B) the importance and symbolism of the Round Table",
          "C) the issues King Arthur and his Knights discussed",
          "D) how King Arthur became such a mighty ruler AAKİN DİL EĞİTİM www.shivcht.com"
        ],
        answer: "B"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'claim' is closest in meaning to ----.",
        options: ["A) represent", "B) maintain", "C) gather"],
        answer: "B"
      },
      {
        id: 2,
        question: "'gather' is closest in meaning to ----.",
        options: ["A) come together", "B) talk about", "C) depend on"],
        answer: "A"
      },
      {
        id: 3,
        question: "'mighty' is closest in meaning to ----.",
        options: ["A) very strong", "B) very honest", "C) very old"],
        answer: "A"
      },
      {
        id: 4,
        question: "'depiction' is closest in meaning to ----.",
        options: ["A) information", "B) description", "C) claim"],
        answer: "B"
      },
    ],
    sourceFidelity: "ocr-yapisal"
  },
  {
    id: 71,
    title: "Bollywood and Hollywood",
    cefr: "B2",
    theme: "Comparison & Vocabulary",
    paragraphs: [
      "Bollywood and Hollywood are two internationally recognized film industries. Hollywood is basically the entire American film industry distributing movies worldwide. It's named after a district in California which became the centre of movie studios in the early 1900s. It was established WWI and is considered to be the world’s leading and influential film industry. Both Hollywood movies and stars are recognized by many people around the world. Hollywood movies are made on a large scale. They usually involve elements of blood, violence, and other controversial themes. In terms of revenue, Hollywood dominates the sales. The industry earns more money by utilising a franchise system apart from revenue from the actual film. The movie is often tied with various other media such as TV networks and magazines. In terms of worldwide cinema, Hollywood gets around 75 per cent of all movie revenues. 2 On the other hand part of the Hindi cinema industry. The term “Bollywood” was coined and popularized during the 1970s, when Hindi cinema surpassed Hollywood. The name is a combination of Bombay and Hollywood. Movies created by Bollywood are often family-oriented and appeal to human sensitivity. The dominant themes in these movies are musicals with large casts and several song and dance sequences. A major criticism of Bollywood movies is that they have a predictable and consistent plot. In addition, plots lack creativity and a form of escapist entertainment. Another criticism is that Bollywood replicates plots from Hollywood movies. Just as Tv pre Hollywood, Bollywood also produces and distributes its films internationally but does not get the same attention as Hollywood. The Bollywood industry produces more films than Hollywood but spends less on production. A movie's success or earnings is reliant on the theater revenues and music videos that the movie produces"
    ],
    vocabulary: [
      { term: "recognized", meaning: "tanınan, bilinen", partOfSpeech: "adj", definition: "Widely known and accepted.", exampleSentence: "They are two internationally recognized industries." },
      { term: "industry", meaning: "endüstri, sektör", partOfSpeech: "n", definition: "A group of businesses that make a product.", exampleSentence: "Hollywood is the American film industry." },
      { term: "distribute", meaning: "dağıtmak", partOfSpeech: "v", definition: "To supply goods to different places.", exampleSentence: "Hollywood distributes movies worldwide." },
      { term: "district", meaning: "bölge, semt", partOfSpeech: "n", definition: "An area of a city or country.", exampleSentence: "It is named after a district in California." },
      { term: "establish", meaning: "kurmak", partOfSpeech: "v", definition: "To start an organisation or system.", exampleSentence: "It was established before WWI." },
      { term: "leading", meaning: "önde gelen, başlıca", partOfSpeech: "adj", definition: "Most important or most successful.", exampleSentence: "It is the world's leading film industry." },
      { term: "influential", meaning: "etkili, nüfuzlu", partOfSpeech: "adj", definition: "Having a lot of influence.", exampleSentence: "It is an influential industry." },
      { term: "budget", meaning: "bütçe", partOfSpeech: "n", definition: "The amount of money available for something.", exampleSentence: "Hollywood movies are made on a large budget." },
      { term: "controversial", meaning: "tartışmalı", partOfSpeech: "adj", definition: "Causing a lot of disagreement.", exampleSentence: "Some themes are controversial." },
      { term: "revenue", meaning: "gelir, hasılat", partOfSpeech: "n", definition: "The money a business earns.", exampleSentence: "Hollywood dominates the sales in terms of revenue." },
      { term: "franchise", meaning: "imtiyaz, marka hakkı", partOfSpeech: "n", definition: "A right to sell a company's products or series.", exampleSentence: "It earns money by utilising a franchise system." },
      { term: "family-oriented", meaning: "aile odaklı", partOfSpeech: "adj", definition: "Suitable for and focused on families.", exampleSentence: "Bollywood movies are often family-oriented." },
      { term: "predictable", meaning: "tahmin edilebilir", partOfSpeech: "adj", definition: "Behaving in a way that is easy to guess.", exampleSentence: "The plots are often predictable." },
      { term: "replicate", meaning: "kopyalamak, taklit etmek", partOfSpeech: "v", definition: "To copy something exactly.", exampleSentence: "Bollywood sometimes replicates Hollywood plots." },
    ],
    vocabularySource: "uygulama",
    questions: [
      {
        id: 1,
        question: "the text. 1. According to paragraph 1, Hollywood ----.",
        options: [
          "A) is criticized harshly due largely to the controversial themes of its films",
          "B) revenue",
          "C) criticism"
        ],
        answer: "D"
      },
      {
        id: 2,
        question: "revenues 2. Which of the following is FALSE about Bollywood films?",
        options: [
          "A) There is no variety in terms of their themes.",
          "C) G) A huge sum of money is spent on them.",
          "D) Its easy to guess what will happen while"
        ],
        answer: "C"
      },
      {
        id: 3,
        question: "watching them. ial 3. The aim of the author is to ----.",
        options: [
          "A) criticize Bollywood film industry",
          "B) compare Hollywood and Bollywood",
          "C) emphasize the importance of Hollywood",
          "D) inform us about pros and cons of film industry"
        ],
        answer: "B"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'entire' is closest in meaning to ----.",
        options: ["A) whole", "B) perfect", "C) leading"],
        answer: "A"
      },
      {
        id: 2,
        question: "'leading' is closest in meaning to ----.",
        options: ["A) the least successful", "B) the most important", "C) comfortable"],
        answer: "B"
      },
      {
        id: 3,
        question: "'influential' is closest in meaning to ----.",
        options: ["A) powerful", "B) comfortable", "C) whole"],
        answer: "A"
      },
      {
        id: 4,
        question: "'establish' is closest in meaning to ----.",
        options: ["A) found", "B) distribute", "C) recognize"],
        answer: "A"
      },
    ],
    sourceFidelity: "ocr-yapisal"
  },
  {
    id: 72,
    title: "Scuba Diving: Exploring Underwater",
    cefr: "B2",
    theme: "Vocabulary & Connectors",
    paragraphs: [
      ") 1 Scuba diving is a type of underwater diving. Divers use a self-contained underwater breathing apparatus; called scuba. Since humans are not designed to see and breathe underwater, scuba diving requires some vital equipment. Scuba divers breathe with the help of a regulator. There is another; other regulator called an octopus. It is used in case of emergency situations. Divers also wear a pressure gauge showing how much air is left in the air tank. Becoming a certified need to about the safety of diving. Moreover, they must practise diving skills first in a closed water area",
      "Scuba diving first became become possible with the development of the Aqualung by Jacques Cousteau in the early 1940s. Articles in popular magazines about Cousteau and his underwater exploration methods brought attention to scuba diving. Owing to high cost of the equipment, diving couldn't become a widely available sport until years later",
      "There are many safety issues to consider when diving. For example, when the time going down deeper in the water, a diver must be careful to equalize the pressure in his ears. This is done by holding the nose and blowing very gently. Otherwise, the extreme pressure can cause damage to the middle ear and sinuses. Decompression sickness is a major concern for divers. The deeper a diver goes, the more pressure the water puts on the volume of the air inside his lungs. And, the deeper a dive, the more nitrogen gas goes into the diver's blood. For safety reasons, a diver must measure the length of his dive based on its depth so as not to exceed a safe amount of nitrogen absorption. When divers rise to the surface, they must carry on breathing and rise no faster than the air bubbles around them. For very deep dives, they must stop and decompress at certain levels. Therefore, the highly pressurized air in the diver's lungs has time to leave the body before it expands"
    ],
    vocabulary: [
      { term: "underwater", meaning: "su altı", partOfSpeech: "adj", definition: "Below the surface of the water.", exampleSentence: "Scuba diving is a type of underwater diving." },
      { term: "apparatus", meaning: "cihaz, aygıt", partOfSpeech: "n", definition: "Equipment used for a particular purpose.", exampleSentence: "Divers use underwater breathing apparatus." },
      { term: "vital", meaning: "hayati, çok önemli", partOfSpeech: "adj", definition: "Extremely important; necessary for life.", exampleSentence: "Scuba diving requires vital equipment." },
      { term: "equipment", meaning: "ekipman, teçhizat", partOfSpeech: "n", definition: "The tools needed for an activity.", exampleSentence: "New divers need special equipment." },
      { term: "regulator", meaning: "regülatör", partOfSpeech: "n", definition: "A device that controls the flow of air.", exampleSentence: "Divers breathe with the help of a regulator." },
      { term: "emergency", meaning: "acil durum", partOfSpeech: "n", definition: "A serious situation needing immediate action.", exampleSentence: "The octopus is used in emergency situations." },
      { term: "certified", meaning: "sertifikalı, belgeli", partOfSpeech: "adj", definition: "Officially approved as qualified.", exampleSentence: "Becoming a certified diver takes lessons." },
      { term: "practise", meaning: "pratik yapmak, alıştırma yapmak", partOfSpeech: "v", definition: "To do something repeatedly to improve.", exampleSentence: "They must practise diving skills first." },
      { term: "attention", meaning: "dikkat, ilgi", partOfSpeech: "n", definition: "Notice or interest given to something.", exampleSentence: "The articles brought attention to diving." },
      { term: "owing to", meaning: "-den dolayı", partOfSpeech: "prep", definition: "Because of.", exampleSentence: "Owing to the high cost, it was not popular." },
      { term: "widely", meaning: "yaygın olarak", partOfSpeech: "adv", definition: "In many places; by many people.", exampleSentence: "It became a widely available sport later." },
      { term: "consider", meaning: "düşünmek, göz önünde bulundurmak", partOfSpeech: "v", definition: "To think carefully about something.", exampleSentence: "There are many safety issues to consider." },
      { term: "equalize", meaning: "eşitlemek, dengelemek", partOfSpeech: "v", definition: "To make things equal.", exampleSentence: "A diver must equalize the pressure in his ears." },
      { term: "concern", meaning: "endişe, kaygı", partOfSpeech: "n", definition: "A worry about something.", exampleSentence: "Decompression is a major concern for divers." },
    ],
    vocabularySource: "uygulama",
    questions: [
      {
        id: 1,
        question: "The author's main aim in paragraph 3 is to ----.",
        options: [
          "A) warn divers against various sicknesses divers may develop",
          "B) inform divers about the suitable places for deep diving",
          "C) emphasize the significance of being a certified diver",
          "D) provide divers information on some precautions to be taken when diving deep"
        ],
        answer: "D"
      },
      {
        id: 2,
        question: "The author's primary purpose in the passage is to",
        options: [
          "A) stress the importance of Scuba diving",
          "B) inform us about the history of Scuba Diving",
          "C) give some information about Scuba diving",
          "D) emphasize the pros and cons of Scuba diving"
        ],
        answer: "C"
      },
      {
        id: 3,
        question: "The author's tone in the passage is",
        options: [
          "A) critical",
          "B) satincal",
          "C) informative",
          "D) biased AKIS DIL EGITEN"
        ],
        answer: "C"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'require' is closest in meaning to ----.",
        options: ["A) necessitate", "B) offer", "C) avoid"],
        answer: "A"
      },
      {
        id: 2,
        question: "'vital' is closest in meaning to ----.",
        options: ["A) minor", "B) significant", "C) widely"],
        answer: "B"
      },
      {
        id: 3,
        question: "'widely' is closest in meaning to ----.",
        options: ["A) extensively", "B) particularly", "C) vital"],
        answer: "A"
      },
      {
        id: 4,
        question: "'consider' is closest in meaning to ----.",
        options: ["A) avoid", "B) think", "C) offer"],
        answer: "B"
      },
    ],
    sourceFidelity: "ocr-yapisal"
  },
  {
    id: 73,
    title: "The Origin of Language",
    cefr: "C1",
    theme: "Vocabulary & Cause-Effect",
    paragraphs: [
      "Recent research has revealed that all languages have a common ancestor. Some scientists studied 504 modern languages, from English to Mandarin Chinese, and discovered that every language on Earth has stemmed from a dialect people spoke in Africa in prehistoric times. According to the researchers, they began to speak for the first time approximately 100,000 years ago and this was the first language in the world. However, it is not spoken any more. Early humans then left Africa, moving across Europe, Asia, them which then altered along the way. 2 Most scientists agree that the first humans came from Africa, but some believe languages developed at different times in different parts of the world and there is no connection between them. Thus, this research is important as it suggests this is not the case. It suggests that all languages must originate from the same place — somewhere in Africa. The scientists made this discovery by looking at how many different sounds there were in various languages across the world. They discovered that the number of sounds that languages had was different in different continents. Then, they compared them with the ones in Africa, and found out that if a spoken language was a long way from Africa, it didn’t have many sounds. However other hand, if a language was close to Africa, it had a lot of sounds. For example As a result For example, Hadza, which is spoken in Tanzania, has 69 sounds, English has about 45 sounds, and Mandarin Chinese has 32 sounds",
      "So it seems that thousands of years ago, as human beings were moving further away from Africa, they used fewer sounds in their languages. So it seems the first language was African! Interestingly, some African languages have a large number of sounds. For instance, Xu, a South African language, has 141 G different sounds. While some languages - that are far away from Africa have many sounds, Bandjalang, an Australian language, has merely sixteen sounds. 2"
    ],
    vocabulary: [
      { term: "research", meaning: "araştırma", partOfSpeech: "n", definition: "A careful study to discover facts.", exampleSentence: "Recent research has revealed this." },
      { term: "reveal", meaning: "ortaya çıkarmak", partOfSpeech: "v", definition: "To make something known.", exampleSentence: "Research has revealed a common ancestor." },
      { term: "common", meaning: "ortak, müşterek", partOfSpeech: "adj", definition: "Shared by two or more people or things.", exampleSentence: "All languages have a common ancestor." },
      { term: "ancestor", meaning: "ata, kök", partOfSpeech: "n", definition: "Something from which later things developed.", exampleSentence: "Languages share a common ancestor." },
      { term: "stem from", meaning: "kaynaklanmak", partOfSpeech: "v", definition: "To come or develop from something.", exampleSentence: "Every language has stemmed from one source." },
      { term: "prehistoric", meaning: "tarih öncesi", partOfSpeech: "adj", definition: "Belonging to the time before written records.", exampleSentence: "People spoke it in prehistoric times." },
      { term: "approximately", meaning: "yaklaşık olarak", partOfSpeech: "adv", definition: "Roughly; about.", exampleSentence: "Humans began to speak approximately 100,000 years ago." },
      { term: "alter", meaning: "değişmek, değiştirmek", partOfSpeech: "v", definition: "To change.", exampleSentence: "The language altered along the way." },
      { term: "connection", meaning: "bağlantı", partOfSpeech: "n", definition: "A link between two things.", exampleSentence: "Some believe there is no connection between them." },
      { term: "suggest", meaning: "işaret etmek, düşündürmek", partOfSpeech: "v", definition: "To show that something is likely.", exampleSentence: "The research suggests this is not the case." },
      { term: "originate", meaning: "kaynaklanmak, başlamak", partOfSpeech: "v", definition: "To begin or come from a place.", exampleSentence: "All languages originate from one place." },
      { term: "compare", meaning: "karşılaştırmak", partOfSpeech: "v", definition: "To examine things to find similarities.", exampleSentence: "They compared the sounds with African languages." },
      { term: "diverse", meaning: "çeşitli, farklı", partOfSpeech: "adj", definition: "Very different from each other.", exampleSentence: "There are diverse languages around the world." },
      { term: "continent", meaning: "kıta", partOfSpeech: "n", definition: "One of the large land areas of the Earth.", exampleSentence: "The number of sounds differed on each continent." },
    ],
    vocabularySource: "uygulama",
    questions: [
      {
        id: 1,
        question: "overwhelming (adj)",
        options: [
          "A) It is still a prevalent language in various parts of Africa",
          "B) It has never undergone any changes since people started speaking it. EXERCISE 4. Choose the correct option. knowledge/practice/good 1.",
          "C) various",
          "D) common"
        ],
        answer: "C"
      },
      {
        id: 2,
        question: "calculate (v)",
        options: [
          "A) The farther away you move from Africa, the fewer sounds you find in a language.",
          "B) People in different continents actually speak similar languages.",
          "C) It is extremely difficult to find out the origins of the very first language.",
          "D) The number of the sounds in different languages shows no similarities at all ARIN BIL EGITEN A"
        ],
        answer: "A"
      },
      {
        id: 3,
        question: "definitely (v)",
        options: [
          "A) The Reasons behind the Changes to Languages",
          "B) The Father of All Languages: African",
          "C) Various Studies into the Evolution of Languages",
          "D) Recent Research Methods implemented by Scientists EXERCISE 3. Choose the correct option according to the text."
        ],
        answer: "B"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'common' is closest in meaning to ----.",
        options: ["A) shared", "B) individual", "C) diverse"],
        answer: "A"
      },
      {
        id: 2,
        question: "'approximately' is closest in meaning to ----.",
        options: ["A) exactly", "B) nearly", "C) always"],
        answer: "B"
      },
      {
        id: 3,
        question: "'alter' is closest in meaning to ----.",
        options: ["A) change", "B) remain", "C) reveal"],
        answer: "A"
      },
      {
        id: 4,
        question: "'diverse' is closest in meaning to ----.",
        options: ["A) resembling", "B) different", "C) shared"],
        answer: "B"
      },
    ],
    sourceFidelity: "ocr-yapisal"
  },
  {
    id: 74,
    title: "Civilization and History",
    cefr: "C1",
    theme: "Vocabulary & Contrast",
    paragraphs: [
      "An overwhelming majority of the people who appear most often and most gloriously in the history books are great conquerors and soldiers, whereas the people who really helped civilization develop are almost never mentioned at all instance, we do not know who first treated a broken leg, or calculated the length of a year, or grew crops; however addition, we do know all about the killers and destroyers. They could be great indeed, but we must note that they are definitely not the most civilized ones. It is true that fighting is a part of the nature of all living things, but can we say the same for war-fighting? Animals fight; so do savages; hence, to be good at fighting is to be good in the way in which an animal or a savage is good, but it is not to be civilized. People fight to settle quarrels. Fighting means killing, and civilized people ought to be able to find some way of settling their disputes other than of by seeing which side can kill off the greater number of the other side, and then saying that the side which has killed most has won. 2 On the whole, that is what the story of mankind has been like. But we must not expect too much. After all, the race of men has only just started. From the point of view of evolution, human beings are just babies of a few months old. Suppose that we calculate the whole past of living creatures on Earth as one hundred years; then the whole past of man works out to about one month, and during that month there have been civilizations for between about seven or eight hours, we may able to estimate his future, that is to say, the whole period between now and when the sun grows too cold to maintain life any longer on the earth, at about one hundred thousand years. Thus mankind is only at the outset of its civilized life"
    ],
    vocabulary: [
      { term: "overwhelming", meaning: "ezici, çok büyük", partOfSpeech: "adj", definition: "Very great in amount or effect.", exampleSentence: "The overwhelming majority are soldiers and conquerors." },
      { term: "gloriously", meaning: "şanla, görkemle", partOfSpeech: "adv", definition: "In a way that brings great fame or honour.", exampleSentence: "They appear most gloriously in history books." },
      { term: "conqueror", meaning: "fatih, istilacı", partOfSpeech: "n", definition: "A person who takes control of a country by force.", exampleSentence: "History books are full of great conquerors." },
      { term: "civilization", meaning: "medeniyet, uygarlık", partOfSpeech: "n", definition: "An advanced and organised human society.", exampleSentence: "Some people really helped civilization." },
      { term: "mention", meaning: "bahsetmek, anmak", partOfSpeech: "v", definition: "To speak or write about briefly.", exampleSentence: "They are almost never mentioned at all." },
      { term: "calculate", meaning: "hesaplamak", partOfSpeech: "v", definition: "To find an amount using mathematics.", exampleSentence: "Someone first calculated the length of a year." },
      { term: "savage", meaning: "vahşi, ilkel", partOfSpeech: "n", definition: "(old use) A person seen as wild or uncivilised.", exampleSentence: "Animals fight; so do savages." },
      { term: "hence", meaning: "bu yüzden, dolayısıyla", partOfSpeech: "adv", definition: "For this reason; therefore.", exampleSentence: "Hence, being good at fighting is not civilized." },
      { term: "settle", meaning: "çözmek, halletmek", partOfSpeech: "v", definition: "To end a disagreement.", exampleSentence: "People fight to settle quarrels." },
      { term: "quarrel", meaning: "kavga, anlaşmazlık", partOfSpeech: "n", definition: "An angry disagreement.", exampleSentence: "People fight to settle quarrels." },
      { term: "dispute", meaning: "anlaşmazlık, uyuşmazlık", partOfSpeech: "n", definition: "A serious disagreement.", exampleSentence: "Civilized people should settle disputes peacefully." },
      { term: "expect", meaning: "beklemek, ummak", partOfSpeech: "v", definition: "To think that something will happen.", exampleSentence: "We must not expect too much." },
      { term: "suppose", meaning: "varsaymak, farz etmek", partOfSpeech: "v", definition: "To imagine that something is true.", exampleSentence: "Suppose we calculate the past as a hundred years." },
      { term: "estimate", meaning: "tahmin etmek", partOfSpeech: "v", definition: "To make an approximate judgement of an amount.", exampleSentence: "We may estimate man's future." },
      { term: "outset", meaning: "başlangıç", partOfSpeech: "n", definition: "The beginning of something.", exampleSentence: "Man is only at the outset of its civilized life." },
    ],
    vocabularySource: "uygulama",
    questions: [
      {
        id: 1,
        question: "overwhelming (adj)",
        options: [
          "A) Some authors of history books are critical of the people who changed history, particularly conquerors and soldiers.",
          "B) Conquerors and soldiers have been our most famous men, but they did not help civilization forward.",
          "C) Great conquerors and soldiers are mostly in history books because fighting is a part of human nature.",
          "D) Animals and humans are similar to each other since both species fight in order to maintain their lives. ABIN BIL EGITEN EXERCISE 4. Choose the correct option."
        ],
        answer: "B"
      },
      {
        id: 2,
        question: "calculate (v)",
        options: [
          "A) To show how the human race has been cruel to each other.",
          "B) To ilustrate the different stages that human beings have gone through.",
          "C) To underline that he is pessimistic about the future of the human race.",
          "D) To emphasize that human beings are at the beginning of their civilization."
        ],
        answer: "D"
      },
      {
        id: 3,
        question: "definitely (v)",
        options: [
          "A) informative",
          "B) optimistic",
          "C) critical",
          "D) impartial 050-420 AKIN (25460 BIL COTTEN www.acoal.com"
        ],
        answer: "C"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'overwhelming' is closest in meaning to ----.",
        options: ["A) satisfactory", "B) vast", "C) certain"],
        answer: "B"
      },
      {
        id: 2,
        question: "'calculate' is closest in meaning to ----.",
        options: ["A) measure", "B) praise", "C) resolve"],
        answer: "A"
      },
      {
        id: 3,
        question: "'settle' is closest in meaning to ----.",
        options: ["A) soar", "B) resolve", "C) overlook"],
        answer: "B"
      },
      {
        id: 4,
        question: "'suppose' is closest in meaning to ----.",
        options: ["A) assume", "B) refuse", "C) anticipate"],
        answer: "A"
      },
    ],
    sourceFidelity: "ocr-yapisal"
  },
  {
    id: 75,
    title: "The Study of Happiness",
    cefr: "B2",
    theme: "Vocabulary & Comparison",
    paragraphs: [
      "» use of his or her intelligence. Such \" religious books as the Koran and the Bible - discuss faith as a form of happiness. The British <) scientist Charles Darwin believed that all species were formed in a way so as to enjoy happiness. People throughout history may have had different ideas about happiness. Today, however, many people are still searching for its meaning",
      "But how do you study something like happiness? You could start with the World Database of Happiness. This set of information includes how to define and measure happiness. Some findings are not surprising. For example, the database suggests that married people are happier than single ones. People who like to be S) with other people are happier than 3 unsocial people. Yet other findings - are less expected: people with children are equally as ’ happy as couples without children. And i wealthier people are only a little happier A than poorer people. Moreover, people living in strongly democratic and affluent countries: are happier than those who do not. This database 3 also shows that studying happiness no longer involves just theories and ideas. Economists, psychiatrists, and doctors are finding ways of understanding happiness by examining real sets of information",
      "There is also an increasing amount of medical research on the physical qualities of happiness. Doctors can now look at happiness in a person's brain utilizing a method called MRI. For example, an MRI can show how one area of a person's brain is stimulated when he or she is shown happy pictures. A different area of the brain becomes active when the person sees pictures of terrible subjects. This p> research may lead to better insight into depression and other mental problems"
    ],
    vocabulary: [
      { term: "debate", meaning: "tartışma", partOfSpeech: "n", definition: "A discussion about a subject where people disagree.", exampleSentence: "The debate about happiness continues." },
      { term: "continue", meaning: "devam etmek", partOfSpeech: "v", definition: "To keep happening or existing.", exampleSentence: "The debate continues today." },
      { term: "philosopher", meaning: "filozof", partOfSpeech: "n", definition: "A person who studies ideas about life and knowledge.", exampleSentence: "Aristotle was a Greek philosopher." },
      { term: "stem from", meaning: "kaynaklanmak", partOfSpeech: "v", definition: "To be caused by or come from something.", exampleSentence: "Happiness stems from the use of intelligence." },
      { term: "faith", meaning: "inanç", partOfSpeech: "n", definition: "Strong belief, especially religious belief.", exampleSentence: "Some books discuss faith as a form of happiness." },
      { term: "species", meaning: "tür", partOfSpeech: "n", definition: "A group of similar living things.", exampleSentence: "All species were formed to enjoy happiness." },
      { term: "throughout", meaning: "boyunca", partOfSpeech: "prep", definition: "During the whole of a period.", exampleSentence: "People throughout history had different ideas." },
      { term: "search", meaning: "aramak", partOfSpeech: "v", definition: "To look carefully for something.", exampleSentence: "Many people are still searching for its meaning." },
      { term: "database", meaning: "veri tabanı", partOfSpeech: "n", definition: "A large organised collection of information.", exampleSentence: "You could start with the World Database of Happiness." },
      { term: "define", meaning: "tanımlamak", partOfSpeech: "v", definition: "To say exactly what something means.", exampleSentence: "The database includes ways to define happiness." },
      { term: "measure", meaning: "ölçmek", partOfSpeech: "v", definition: "To find the size or amount of something.", exampleSentence: "It includes ways to measure happiness." },
      { term: "finding", meaning: "bulgu", partOfSpeech: "n", definition: "A result of research or a study.", exampleSentence: "Some findings are not surprising." },
      { term: "affluent", meaning: "varlıklı, zengin", partOfSpeech: "adj", definition: "Having a lot of money.", exampleSentence: "People in affluent countries are happier." },
      { term: "examine", meaning: "incelemek", partOfSpeech: "v", definition: "To look at something carefully.", exampleSentence: "They understand happiness by examining information." },
    ],
    vocabularySource: "uygulama",
    questions: [
      {
        id: 1,
        question: "the text. 1. Paragraph 1 is mainly concerned with the —--,",
        options: [
          "A) various ideas of happiness",
          "B) methods of finding happiness",
          "C) famous philasaphers wha studied happiness",
          "D) living organisms in pursuit of happiness"
        ],
        answer: "A"
      },
      {
        id: 2,
        question: "Which of the following is FALSE according to paragraph 2?",
        options: [
          "A) People residing in well-off countries are happier",
          "B) Exarrining happiness is no longer theoretical.",
          "C) People from certain professions are less happy than others.",
          "D) Maintaining a regular relationship with someone makes you happier."
        ],
        answer: "C"
      },
      {
        id: 3,
        question: "have had bitter experiences.",
        options: [
          "A) Some people who participated in the research have had bitter experiences.",
          "B) Research findings may provide useful information about mental disorders.",
          "C) MRI is the only way of studying happiness and mental illnesses",
          "D) The methods utilized in the research have been unsatisfactory so far.",
          "E) affluent",
          "F) mental www.okmat.com 085-420 AKN (1546)"
        ],
        answer: "B"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'debate' is closest in meaning to ----.",
        options: ["A) harmony", "B) dispute", "C) faith"],
        answer: "B"
      },
      {
        id: 2,
        question: "'stem from' is closest in meaning to ----.",
        options: ["A) originate from", "B) find out", "C) search"],
        answer: "A"
      },
      {
        id: 3,
        question: "'search' is closest in meaning to ----.",
        options: ["A) seek", "B) overcome", "C) define"],
        answer: "A"
      },
      {
        id: 4,
        question: "'measure' is closest in meaning to ----.",
        options: ["A) convert", "B) assess", "C) describe"],
        answer: "B"
      },
    ],
    sourceFidelity: "ocr-yapisal"
  },
  {
    id: 76,
    title: "The Titanic: What Went Wrong?",
    cefr: "C1",
    theme: "Third Conditional & Vocabulary",
    paragraphs: [
      "The sinking of the Titanic on its maiden voyage has fascinated all over the world for more than hundred years. It has been a matter of many research studies, books, films and so on. Regardless of genre of product, millions of people have burst into tears as they are all about a different aspect of the appalling disaster. It is a story surrounded by mystery and speculation. Here are some possible scenarios",
      "The regulations controlling the number of lifeboats that a ship should carry were inadequate in addition to the obsolete regulations. In line with of these regulations, the Titanic only had to have 16 lifeboats. Nobody would have died on April 14th,1912, if the Titanic had had enough lifeboats for all the passengers",
      "A small ship called the Californian was only 20 kilometres away from the Titanic at the time of the disaster. It had to stop for the night owing to of the icebergs. It was so near that the two ships could see each other's lights. The radio operator had gone away from the radio and thus thus since he didn’t hear the distress call. Later sailors saw the Titanic's distress flares in the sky and woke up the captain but he didn't do anything as he didn't think it was something important. If the Californian had realized the Titanic was sinking, it would have rescued. The captain of the Californian was later blamed for not going to help the Titanic and his reputation was destroyed. IL Eiri 4 Although they had received several warnings of icebergs from other ships in the area, the Titanic was going at top speed. The captain of the Titanic, like as other captains, was under great commercial pressure to make the Atlantic crossing as quickly as possible. Another criticism of captain Smith is that he was not on the bridge at the time of the collision. Perhaps if he had been there, he would have had time to devise a plan to avoid the disaster. Captain Smith and the ship's h designer Thomas Andrews both drowned. 2"
    ],
    vocabulary: [
      { term: "maiden voyage", meaning: "ilk sefer", partOfSpeech: "n", definition: "A ship's first journey.", exampleSentence: "The Titanic sank on its maiden voyage." },
      { term: "fascinate", meaning: "büyülemek, hayran bırakmak", partOfSpeech: "v", definition: "To attract and hold someone's interest strongly.", exampleSentence: "The disaster has fascinated people for a century." },
      { term: "aspect", meaning: "yön, boyut", partOfSpeech: "n", definition: "A particular part or feature of something.", exampleSentence: "Each work is about a different aspect of the disaster." },
      { term: "appalling", meaning: "korkunç, dehşet verici", partOfSpeech: "adj", definition: "Shocking and very bad.", exampleSentence: "It was an appalling disaster." },
      { term: "speculation", meaning: "spekülasyon, tahmin", partOfSpeech: "n", definition: "Guessing about something without full facts.", exampleSentence: "The story is surrounded by mystery and speculation." },
      { term: "regulation", meaning: "düzenleme, kural", partOfSpeech: "n", definition: "An official rule.", exampleSentence: "The regulations about lifeboats were inadequate." },
      { term: "inadequate", meaning: "yetersiz", partOfSpeech: "adj", definition: "Not enough; not good enough.", exampleSentence: "The lifeboat rules were inadequate." },
      { term: "obsolete", meaning: "modası geçmiş, eskimiş", partOfSpeech: "adj", definition: "No longer used because it is out of date.", exampleSentence: "The regulations were old and obsolete." },
      { term: "passenger", meaning: "yolcu", partOfSpeech: "n", definition: "A person travelling in a vehicle.", exampleSentence: "There weren't enough lifeboats for the passengers." },
      { term: "distress call", meaning: "imdat çağrısı", partOfSpeech: "n", definition: "A message asking for urgent help.", exampleSentence: "He didn't hear the Titanic's distress call." },
      { term: "flare", meaning: "işaret fişeği", partOfSpeech: "n", definition: "A bright light used as a signal.", exampleSentence: "Sailors saw the distress flares in the sky." },
      { term: "realize", meaning: "fark etmek, anlamak", partOfSpeech: "v", definition: "To become aware of something.", exampleSentence: "If the Californian had realized the Titanic was sinking..." },
      { term: "rescue", meaning: "kurtarmak", partOfSpeech: "v", definition: "To save someone from danger.", exampleSentence: "It could have rescued the passengers." },
      { term: "blame", meaning: "suçlamak", partOfSpeech: "v", definition: "To say someone is responsible for something bad.", exampleSentence: "The captain was blamed for not helping." },
      { term: "reputation", meaning: "itibar, ün", partOfSpeech: "n", definition: "The opinion people have of someone.", exampleSentence: "His reputation was destroyed." },
    ],
    vocabularySource: "uygulama",
    questions: [
      {
        id: 1,
        question: "the text, 1. According to paragraph 1, Canadian government is unwilling to limit logging since it ----.",
        options: [
          "A) is actually to the benefit of all species",
          "B) brings considerable benefits to the nation",
          "C) causes only a little destruction of forests",
          "D) gives no harm to the citizens at all"
        ],
        answer: "D"
      },
      {
        id: 2,
        question: "Which of the following is NOT one of the possible explanations of the disaster?",
        options: [
          "A) the ignorance of the captain of the Californian in spite of his crew's warnings",
          "B) the speed of the Titanic despite warnings against icebergs",
          "C) the commercial pressure on the Titanic's designer, Thomas Andrews",
          "D) the out of date regulations regarding the number of lifeboats"
        ],
        answer: "C"
      },
      {
        id: 3,
        question: "the cultivation of this plant",
        options: [
          "A) criticise the individuals causing the disaster",
          "B) underline the importance of the disaster",
          "C) outline some potential causes of the disaster",
          "D) warm the officials against potential future disasters EXERCISE 4. Choose the correct option. 1.a method/way/plan/strategy",
          "E) rescue",
          "F) devise EXERCISE 3. Choose the correct option according to the text."
        ],
        answer: "C"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'aspect' is closest in meaning to ----.",
        options: ["A) part", "B) rule", "C) result"],
        answer: "A"
      },
      {
        id: 2,
        question: "'appalling' is closest in meaning to ----.",
        options: ["A) horrifying", "B) fascinating", "C) invaluable"],
        answer: "A"
      },
      {
        id: 3,
        question: "'inadequate' is closest in meaning to ----.",
        options: ["A) invaluable", "B) insufficient", "C) obsolete"],
        answer: "B"
      },
      {
        id: 4,
        question: "'blame' is closest in meaning to ----.",
        options: ["A) accuse", "B) allocate", "C) rescue"],
        answer: "A"
      },
    ],
    sourceFidelity: "ocr-yapisal"
  },
  {
    id: 77,
    title: "A New Hope for Paper: Hemp",
    cefr: "C1",
    theme: "Passive Voice & Vocabulary",
    paragraphs: [
      "0) 1 Every second, about 1 hectare of the world's rainforest is destroyed. In a year, that - adds up to 31 million hectares. This alarming rate of: destruction has serious consequences for 3 the environment. Scientists estimate that 137 species of plant and animal become extinct every day due to. Logging, however, provides jobs, profits, taxes for the government and affordable products of all kinds for consumers, so the Canadian government is reluctant to restrict or control 2 Much of Canada's forestry production much of the world's wood pulp and newsprint paper. If these paper products could be produced in some other way, Canadian forests could be preserved. Recently, a possible alternative way of producing paper has been suggested by environmentalists: a plant called hemp. Hemp has been cultivated for thousands of years. For many centuries, it was essential to the economies of many countries as it was used to make the ropes and cables used on sailing ships. Colonial expansion and the establishment of a world-wide trading network wouldn’t have been possible without hemp. Nowadays, scientists suggest that its cultivation should be brought back for the production of paper and pulp. According to its proponents, four times as much paper can be produced from land using hemp rather than of trees, and also the cultivation of hemp on a large scale could reduce the pressure on Canada's forests. 3 However, hemp is illegal in many countries since it is related to the plant from which marijuana is produced. In the late 1930s, a movement to ban the drug marijuana resulted in the eventual banning of the cultivation not only of the plant used to produce the drug, but also of the commercial fiber-producing hemp plant. Nowadays, some people believe that it should not be illegal. They argue that marijuana is not dangerous or addictive. They also point out that marijuana is less pl toxic than alcohol or tobacco. As a result of movement, in 1997, Canada legalized the farming of hemp. -"
    ],
    vocabulary: [
      { term: "hectare", meaning: "hektar", partOfSpeech: "n", definition: "A unit of area equal to 10,000 square metres.", exampleSentence: "One hectare of rainforest is destroyed every second." },
      { term: "destroy", meaning: "yok etmek, tahrip etmek", partOfSpeech: "v", definition: "To damage something so badly it no longer exists.", exampleSentence: "Rainforest is destroyed every second." },
      { term: "alarming", meaning: "endişe verici, ürkütücü", partOfSpeech: "adj", definition: "Causing worry or fear.", exampleSentence: "The rate of destruction is alarming." },
      { term: "consequence", meaning: "sonuç", partOfSpeech: "n", definition: "A result of an action or situation.", exampleSentence: "This has serious consequences for the environment." },
      { term: "extinct", meaning: "nesli tükenmiş", partOfSpeech: "adj", definition: "No longer existing as a species.", exampleSentence: "Many species become extinct every day." },
      { term: "logging", meaning: "ağaç kesimi, tomrukçuluk", partOfSpeech: "n", definition: "The activity of cutting down trees for wood.", exampleSentence: "Species become extinct due to logging." },
      { term: "provide", meaning: "sağlamak", partOfSpeech: "v", definition: "To give or supply something.", exampleSentence: "Logging provides jobs and profits." },
      { term: "reluctant", meaning: "isteksiz, gönülsüz", partOfSpeech: "adj", definition: "Not wanting to do something.", exampleSentence: "The government is reluctant to restrict logging." },
      { term: "restrict", meaning: "kısıtlamak", partOfSpeech: "v", definition: "To limit something.", exampleSentence: "They don't want to restrict logging." },
      { term: "preserve", meaning: "korumak", partOfSpeech: "v", definition: "To keep something safe from harm.", exampleSentence: "The forests could be preserved." },
      { term: "alternative", meaning: "alternatif, seçenek", partOfSpeech: "n", definition: "Another possible choice.", exampleSentence: "Hemp is a possible alternative to trees." },
      { term: "cultivate", meaning: "yetiştirmek, ekmek", partOfSpeech: "v", definition: "To grow plants or crops.", exampleSentence: "Hemp has been cultivated for thousands of years." },
      { term: "essential", meaning: "gerekli, elzem", partOfSpeech: "adj", definition: "Extremely important; necessary.", exampleSentence: "Hemp was essential to many economies." },
      { term: "proponent", meaning: "savunucu, destekçi", partOfSpeech: "n", definition: "A person who supports an idea.", exampleSentence: "Its proponents say hemp produces more paper." },
      { term: "reduce", meaning: "azaltmak", partOfSpeech: "v", definition: "To make something smaller in amount.", exampleSentence: "Growing hemp could reduce pressure on forests." },
    ],
    vocabularySource: "uygulama",
    questions: [
      {
        id: 1,
        question: "the text, 1. According to paragraph 1, Canadian government is unwilling to limit logging since it ----.",
        options: [
          "A) is actually to the benefit of all species",
          "B) brings considerable benefits to the nation",
          "C) causes only a little destruction of forests",
          "D) gives no harm to the citizens at all"
        ],
        answer: "B"
      },
      {
        id: 2,
        question: "According to paragraph 2, currently, some people favour the utilization and farming of hemp because ----,",
        options: [
          "A) it is a much more affordable plant to grow compared with all other plants",
          "B) an overwhelming majority of Canadians voted for the cultivation of this plant",
          "C) this plant was beneficial for the scenomy in the previous centuries",
          "D) considerably more amounts of paper can be produced with the help of this plant EXERCISE 4. Choose the correct option."
        ],
        answer: "D"
      },
      {
        id: 3,
        question: "the cultivation of this plant",
        options: [
          "A) some people cultivated hemp in order to produce large amounts of marijuana",
          "B) the law regarding hemp has undergane some changes during the 20^{\\\\circ} century",
          "C) an overwhelming majority of Canadians voted for the legalization of the farming of hemp",
          "D) Canadian government had no choice but make changes to the use of alcohol and tobacco products EXERCISE 3. Choose the correct option according to the text."
        ],
        answer: "B"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'consequence' is closest in meaning to ----.",
        options: ["A) result", "B) response", "C) advocate"],
        answer: "A"
      },
      {
        id: 2,
        question: "'reluctant' is closest in meaning to ----.",
        options: ["A) unwilling", "B) inadequate", "C) essential"],
        answer: "A"
      },
      {
        id: 3,
        question: "'cultivate' is closest in meaning to ----.",
        options: ["A) grow", "B) trigger", "C) limit"],
        answer: "A"
      },
      {
        id: 4,
        question: "'reduce' is closest in meaning to ----.",
        options: ["A) expand", "B) lessen", "C) supply"],
        answer: "B"
      },
    ],
    sourceFidelity: "ocr-yapisal"
  },
  {
    id: 78,
    title: "The Eskimo Way of Life",
    cefr: "B2",
    theme: "Vocabulary & Present Simple",
    paragraphs: [
      ") 1 The Eskimo people have a very interesting life style. They live in small bands, under a leader respected for his ability to provide for the group. Only the most personal property is considered private and collaboration is very important. For example, any equipment that they aren't currently using must go to a neighbour who needs it. In the past, the division of labour between the sexes was strict. Men hunted, whereas women took care of the homes. However, today women take part in hunting as / too as much as men. Eskimos make use of various types of houses. Among some Eskimo groups, the snow hut, known as the igloo, is used as a winter residence. 2 As for their eating habits, Eskimos eat a wide variety of food. They consume fish, seals, whales, and other sea mammals. Meat, fat and fish make up a large part of their diet. Vegetables are rarely consumed because they are scarce. They don't waste any food as they depend on fishing and hunting. They sometimes eat berries, roots, stems and some other parts of plants",
      "Their education takes place within the family and the community circle. By constant exposure to their parents and other adults in the community, children learn all they need to live successfully. The Eskimo of old did not have a written language, so skills and knowledge were passed down by word of mouth. After a successful hunt, for example, the details were shared with the community. The children, boys in particular, listened to reports of the hunters and learned from them. Hunters were like teachers to them. They would describe in detail the location where they spotted the animal and tell about the animal's behaviour and how they responded to that behaviour. Besides listening to the hunters' stories, the children would observe the behaviours of animals. As opposed to the noisy children of modern society, being silent is something Eskimo children are taught as it is a necessity for hunting. Moreover contrast, they learn to memorize the landscape and thus know the region just like an adult"
    ],
    vocabulary: [
      { term: "lifestyle", meaning: "yaşam tarzı", partOfSpeech: "n", definition: "The way a person or group lives.", exampleSentence: "Eskimo people have an interesting lifestyle." },
      { term: "band", meaning: "topluluk, grup", partOfSpeech: "n", definition: "A small group of people.", exampleSentence: "They live in small bands." },
      { term: "respect", meaning: "saygı duymak", partOfSpeech: "v", definition: "To admire and value someone.", exampleSentence: "The leader is respected by the group." },
      { term: "provide for", meaning: "geçindirmek, bakmak", partOfSpeech: "v", definition: "To supply what someone needs to live.", exampleSentence: "The leader can provide for the group." },
      { term: "property", meaning: "mülk, mal", partOfSpeech: "n", definition: "Things that a person owns.", exampleSentence: "Only personal property is considered private." },
      { term: "division of labour", meaning: "iş bölümü", partOfSpeech: "n", definition: "The way work is shared among people.", exampleSentence: "The division of labour was strict." },
      { term: "strict", meaning: "katı, sıkı", partOfSpeech: "adj", definition: "Firm and not flexible.", exampleSentence: "The division of labour was strict." },
      { term: "hunt", meaning: "avlamak", partOfSpeech: "v", definition: "To chase and kill animals for food.", exampleSentence: "Men hunted while women took care of the homes." },
      { term: "take part in", meaning: "katılmak", partOfSpeech: "v", definition: "To be involved in an activity.", exampleSentence: "Today women take part in hunting too." },
      { term: "residence", meaning: "konut, ikametgah", partOfSpeech: "n", definition: "A place where someone lives.", exampleSentence: "The igloo is used as a winter residence." },
      { term: "consume", meaning: "tüketmek", partOfSpeech: "v", definition: "To eat or use something.", exampleSentence: "They consume fish and sea mammals." },
      { term: "scarce", meaning: "kıt, az bulunan", partOfSpeech: "adj", definition: "Not enough; rare.", exampleSentence: "Plants are scarce in their region." },
      { term: "exposure", meaning: "maruz kalma", partOfSpeech: "n", definition: "The state of experiencing something.", exampleSentence: "Children learn by constant exposure to adults." },
      { term: "word of mouth", meaning: "ağızdan ağıza", partOfSpeech: "n", definition: "Information passed on by speaking.", exampleSentence: "Knowledge was passed down by word of mouth." },
    ],
    vocabularySource: "uygulama",
    questions: [
      {
        id: 1,
        question: "the text. 1. We can understand from paragraph 1 that ----. can understand from paragraph that",
        options: [
          "A) the cooperation between men and women has decreased",
          "B) Eskimos would prefer to live in igloos throughout the year",
          "C) some roles of women in Eskimo society have changed",
          "D) Eskimo men do not go hunting as much as they did in the past"
        ],
        answer: "C"
      },
      {
        id: 2,
        question: "did in the past 2. Vegetables constitute only a small part of the Eskimo diet since ----.",
        options: [
          "A) meat provides more calories",
          "B) Eskimos don't know how to cultivate them",
          "C) they are inadequate",
          "D) they don't taste as good as meat"
        ],
        answer: "C"
      },
      {
        id: 3,
        question: "EğirtiN 3. Paragraph 3 is mainly concerned with the ----.",
        options: [
          "A) strategies Eskimo children leam when hunting",
          "B) various ways of observing animals",
          "C) differences between the Eskimos and modem society",
          "D) education of Eskimo children ANIN DIL EGETINA www.akindl.com"
        ],
        answer: "D"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'property' is closest in meaning to ----.",
        options: ["A) possession", "B) recovery", "C) division"],
        answer: "A"
      },
      {
        id: 2,
        question: "'take part in' is closest in meaning to ----.",
        options: ["A) depend on", "B) participate in", "C) refer to"],
        answer: "B"
      },
      {
        id: 3,
        question: "'strict' is closest in meaning to ----.",
        options: ["A) flexible", "B) rigid", "C) various"],
        answer: "B"
      },
      {
        id: 4,
        question: "'take care of' is closest in meaning to ----.",
        options: ["A) deal with", "B) refer to", "C) waste"],
        answer: "A"
      },
    ],
    sourceFidelity: "ocr-yapisal"
  },
  {
    id: 79,
    title: "Where Happiness Comes From",
    cefr: "C1",
    theme: "Vocabulary & Contrast",
    paragraphs: [
      "3 1 So many of us strive so hard for material success that you might think there is a clear relationship. between wealth and happiness. The media and our 5 governments encourage us to believe this since they need us to keep earning and - spending to boost economic growth.: 2 Consequently, it comes as a shock for many people - to learn that there is no straightforward 3 relationship between wealth and well-being. Once our basic material needs are satisfied (i.e. regular food, adequate shelter, and financial security), wealth only has a negligible effect on well-being. For example have shown that in general, lottery winners do not become significantly happier than they were before, and that even extremely rich people — such as billionaires — are not significantly happier than others. Studies have shown that American and British people are less content now than they were 50 years ago, although their material wealth is much higher. On an international level, there does appear to be some correlation between wealth and well-being, partly because there are many countries in the world where people’s basic material needs are not: satisfied. But this correlation is not a straightforward: one, since wealthier countries tend to be more, politically stable, peaceful and democratic, with less oppression and more freedom — all of whichch are themselves important factors in well- being. \"3 However, it does appear that there is a relationship between non-materialism and well-being. While possessing wealth and material goods doesn’t lead to happiness, giving these things away actually does. Generosity is strongly associated with well-being. For example, recent studies of people who practise volunteering have shown that they have better psychological and TT aatr SIE mental health and increased life spans. The benefits of volunteering have been found to be greater than fact, even greater than giving up smoking",
      "So if you really want to enhance your well-being — and as long as material needs are satisfied — don’t try to accumulate money in your bank account, and don't treat yourself to material goods you don’t really need. Be more generous and altruistic; increase the amount of ol money you give to people in need, give more of your pu time to volunteering, or spend more time helping - other people, or behaving more kindly to everyonene around you"
    ],
    vocabulary: [
      { term: "strive", meaning: "çabalamak, uğraşmak", partOfSpeech: "v", definition: "To try very hard to achieve something.", exampleSentence: "Many of us strive hard for material success." },
      { term: "material", meaning: "maddi", partOfSpeech: "adj", definition: "Relating to money and possessions.", exampleSentence: "People strive for material success." },
      { term: "wealth", meaning: "zenginlik, servet", partOfSpeech: "n", definition: "A large amount of money and possessions.", exampleSentence: "Is there a link between wealth and happiness?" },
      { term: "boost", meaning: "artırmak, canlandırmak", partOfSpeech: "v", definition: "To increase or improve something.", exampleSentence: "Spending helps boost economic growth." },
      { term: "straightforward", meaning: "basit, dolambaçsız", partOfSpeech: "adj", definition: "Simple and easy to understand.", exampleSentence: "There is no straightforward relationship." },
      { term: "well-being", meaning: "refah, esenlik", partOfSpeech: "n", definition: "The state of being healthy and happy.", exampleSentence: "Wealth has little effect on well-being." },
      { term: "adequate", meaning: "yeterli", partOfSpeech: "adj", definition: "Enough for a particular purpose.", exampleSentence: "Adequate shelter is a basic need." },
      { term: "negligible", meaning: "önemsiz, göz ardı edilebilir", partOfSpeech: "adj", definition: "So small it is not worth considering.", exampleSentence: "Extra wealth has a negligible effect." },
      { term: "significantly", meaning: "önemli ölçüde", partOfSpeech: "adv", definition: "In a large or important way.", exampleSentence: "Lottery winners are not significantly happier." },
      { term: "content", meaning: "memnun, hoşnut", partOfSpeech: "adj", definition: "Happy and satisfied.", exampleSentence: "People are less content than before." },
      { term: "correlation", meaning: "bağıntı, ilişki", partOfSpeech: "n", definition: "A connection between two things.", exampleSentence: "There is some correlation between wealth and well-being." },
      { term: "stable", meaning: "istikrarlı", partOfSpeech: "adj", definition: "Firmly fixed; not likely to change.", exampleSentence: "Wealthier countries tend to be more stable." },
      { term: "generosity", meaning: "cömertlik", partOfSpeech: "n", definition: "The quality of giving freely to others.", exampleSentence: "Generosity is strongly associated with well-being." },
      { term: "volunteer", meaning: "gönüllü çalışmak", partOfSpeech: "v", definition: "To do work without being paid, to help others.", exampleSentence: "People who practise volunteering are healthier." },
    ],
    vocabularySource: "uygulama",
    questions: [
      {
        id: 1,
        question: "It can be inferred from paragraph 1 that ----",
        options: [
          "A) people are led to assume that happiness is the sole factor in acquiring wealth",
          "B) the media and governments prefer us to be wealthy so that we can be happy",
          "C) everybody knows that happiness cannot be achieved without being wealthy",
          "D) officials are responsible for making people happy and wealthy"
        ],
        answer: "B"
      },
      {
        id: 2,
        question: "What is the main idea of paragraph 2?",
        options: [
          "A) There is not so much difference in happiness between very rich people and others.",
          "B) in some countries, people are less happy than before although they earn more now.",
          "C) Even if you win the lottery, it won't make you significantly happier.",
          "D) There is no clear-cut link between being rich and being happy KGITIM"
        ],
        answer: "D"
      },
      {
        id: 3,
        question: "According to the passage,",
        options: [
          "A) Psychological health, mental health and a long life can only be sustained by volunteering.",
          "B) Acquiring material goods is a way of spending your money that makes you more satisfied and happier.",
          "C) You will benefit from doing exercises more than volunteering or attending religious services",
          "D) Spending the money you have on someone other than yourself will make you happier. EXERCISE 3. Choose the correct option according to the text."
        ],
        answer: "D"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'strive' is closest in meaning to ----.",
        options: ["A) struggle", "B) grow", "C) satisfy"],
        answer: "A"
      },
      {
        id: 2,
        question: "'boost' is closest in meaning to ----.",
        options: ["A) satisfy", "B) enhance", "C) reduce"],
        answer: "B"
      },
      {
        id: 3,
        question: "'adequate' is closest in meaning to ----.",
        options: ["A) generous", "B) sufficient", "C) negligible"],
        answer: "B"
      },
      {
        id: 4,
        question: "'stable' is closest in meaning to ----.",
        options: ["A) steady", "B) basic", "C) direct"],
        answer: "A"
      },
    ],
    sourceFidelity: "ocr-yapisal"
  },
  {
    id: 80,
    title: "How Safe Can Artificial Intelligence Be?",
    cefr: "C1",
    theme: "Vocabulary & Future Speculation",
    paragraphs: [
      "I worrying about. For a start, we live with Al already. The calculations behind your Google searches or your browsing on Amazon are not just running in the background — the software is constantly learning how to respond more rapidly and usefully",
      "This is remarkable, but it is described as \"narrow\" or \"weak\" Al because it can only work within the guidelines created by its human inventors — a crucial limitation. By contrast, \"general\" or \"strong\" Al which does not exist yet implies a more assertive ability to do things that go beyond the original human intentions, not just to \"think\" but also to improvise. Huge obstacles stand in the way of getting there, like mimicking how a human brain works. For a reality check, we visited NASA engineers working on some of the most capable robots in the world. People working there over - \"I am not concerned about intelligent machines,\" said project leader Brett Kennedy. He said: \"For the foreseeable future, am not concerned, nor do expect to see a robot as intelligent as a human. have first-hand knowledge of how hard it is for us to make a robot that does much of anything. \"To anyone worried about Al, this would be reassuring",
      "But predicting the future pace of technology is impossible. The key and most momentous milestone — human-machine equality — is called Artificial General Intelligence, and academics are trying to assess when that might arrive and what it would mean. One is Prof Nick Bostrom, who, in his recent book, suggests that there's a 50% chance that computers could reach human-level: intelligence as soon as 2050. The same study says there's a 90% chance of machine-human equality by 2075. Prof Bostrom describes himself as a supporter of Al — because it could help tackle climate change, energy and new medicines — but he also brings up a compelling image of mankind behaving like a curious child who has picked up an unexploded bomb, without realising the dangers. \"Maybe it is decades away, but we are just as immature and naive as this child. We really don't realise the power o of this thing we are creating.\"",
      "Prof Bostrom is now receiving funding from Elon Musk to explore these issues, and the aim is to z develop a shared approach to safety. We could: imagine a scenario where the technology is unstoppable but the scariest scenarios — of robot destroyers — are somehow evaded because the right steps are taken in advance. But then another quieter, less obvious form of takeover may still be possible. In his latest book, Prof Jerry Kaplan states that \"As we learn to trust these systems to transport us, introduce us to potential mates, customise our news, protect our property, monitor our environment, care for our children and elderly, grow, prepare and serve our food, it will be easy to miss the bigger picture.” Ultimately, there are risks, no doubt. The question is whether the right safeguards can be built in, and soon enough"
    ],
    vocabulary: [
      { term: "portray", meaning: "betimlemek, resmetmek", partOfSpeech: "v", definition: "To describe or show someone or something.", exampleSentence: "Movies portray a terrifying AI future." },
      { term: "terrifying", meaning: "dehşet verici", partOfSpeech: "adj", definition: "Causing great fear.", exampleSentence: "They portray a terrifying future." },
      { term: "dominate", meaning: "hükmetmek, egemen olmak", partOfSpeech: "v", definition: "To have power and control over something.", exampleSentence: "Machines might dominate us." },
      { term: "destroy", meaning: "yok etmek", partOfSpeech: "v", definition: "To damage something so it no longer exists.", exampleSentence: "Machines might even destroy us." },
      { term: "caution", meaning: "dikkat, tedbir", partOfSpeech: "n", definition: "Great care to avoid danger.", exampleSentence: "Influential figures have called for caution." },
      { term: "inevitable", meaning: "kaçınılmaz", partOfSpeech: "adj", definition: "Certain to happen; unavoidable.", exampleSentence: "Is the conquest by computers inevitable?" },
      { term: "plausible", meaning: "makul, akla yatkın", partOfSpeech: "adj", definition: "Seeming reasonable or probable.", exampleSentence: "We distinguish what is plausible from what is not." },
      { term: "far-fetched", meaning: "abartılı, gerçekten uzak", partOfSpeech: "adj", definition: "Very unlikely to be true.", exampleSentence: "Some ideas are too far-fetched to worry about." },
      { term: "constantly", meaning: "sürekli olarak", partOfSpeech: "adv", definition: "All the time; continually.", exampleSentence: "The software is constantly learning." },
      { term: "crucial", meaning: "çok önemli, kritik", partOfSpeech: "adj", definition: "Extremely important.", exampleSentence: "This is a crucial limitation." },
      { term: "mimic", meaning: "taklit etmek", partOfSpeech: "v", definition: "To copy the way something works or behaves.", exampleSentence: "It is hard to mimic a human brain." },
      { term: "obstacle", meaning: "engel", partOfSpeech: "n", definition: "Something that blocks progress.", exampleSentence: "Huge obstacles stand in the way." },
      { term: "concerned", meaning: "endişeli", partOfSpeech: "adj", definition: "Worried about something.", exampleSentence: "He is not concerned about intelligent machines." },
      { term: "pace", meaning: "hız, tempo", partOfSpeech: "n", definition: "The speed at which something happens.", exampleSentence: "Predicting the pace of technology is impossible." },
      { term: "assess", meaning: "değerlendirmek", partOfSpeech: "v", definition: "To judge the amount or quality of something.", exampleSentence: "Academics assess when AGI might arrive." },
    ],
    vocabularySource: "uygulama",
    questions: [
      {
        id: 1,
        question: "According to paragraph 2, is the following sentence TRUE or FALSE? “Weak Al has not been realised yet.”",
        options: [
          "A) thie",
          "B) False",
          "A) True",
          "B) False"
        ],
        answer: "C"
      },
      {
        id: 2,
        question: "According to paragraph 3, Prof Nick Bostrom is of the opinion that----.",
        options: [
          "A) has not been realised yet.\"",
          "B) True",
          "C) False"
        ],
        answer: "B"
      },
      {
        id: 3,
        question: "eğirTiM of our species",
        options: [
          "A) Al is something we should try to achieve in a short period of time",
          "B) achieving machine-human equality will be the end of our species",
          "C) adults are no different than children when il comes to achieving machine-human equality",
          "D) mankind isn't able to comprehend the potential complications and dangers",
          "E) can cause yet"
        ],
        answer: "D"
      },
      {
        id: 4,
        question: "complications and dangers Al can cause yet What is the text mainly about?",
        options: [
          "A) the unpredictability of the consequences of achieving Al",
          "B) the threats Al can pose",
          "C) how Al can be achieved",
          "D) what prominent scientists think about the dangers"
        ],
        answer: "A"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'destroy' is closest in meaning to ----.",
        options: ["A) mimic", "B) terminate", "C) predict"],
        answer: "B"
      },
      {
        id: 2,
        question: "'inevitable' is closest in meaning to ----.",
        options: ["A) momentous", "B) unavoidable", "C) continual"],
        answer: "B"
      },
      {
        id: 3,
        question: "'concerned' is closest in meaning to ----.",
        options: ["A) intelligent", "B) worried", "C) curious"],
        answer: "B"
      },
      {
        id: 4,
        question: "'pace' is closest in meaning to ----.",
        options: ["A) speed", "B) limitation", "C) obstacle"],
        answer: "A"
      },
    ],
    sourceFidelity: "ocr-yapisal"
  },
  {
    id: 81,
    title: "The Price of an Extra Year of Life",
    cefr: "C1",
    theme: "Vocabulary & Medical Ethics",
    paragraphs: [
      "We all strive to prevent death — but at what cost does it become too expensive? Human life is so precious; it seems rude to put a price on it. Yet addition, that is the morbid decision that health services, everywhere, inevitably have to make. They have limited money to spend on sick and dying people, and whenever a new drug becomes available, they have to make a choice: will the few gained months, or years, be worth the money it costs?",
      "Our gut instincts may seem obvious: we should do all that we can to buy more time for the people we love. Recently, Dominic Wilkinson, a medical ethicist, has written a thought-provoking article questioning these assumptions and asks us all to consider just has much we should be willing to pay for a longer life. To better understand the ways we currently calculate the price of life, a closer look at his argument is needed. At the moment, drugs for terminal illnesses tend to be judged on two things — by how much they extend the lifespan, and the quality of life of the patient. From these calculations, a health service can then start to set a price on how a drug is worth the cost. The UK's recommendations, for example, are about £20,000 to £30,000 ($30,000 to $45,000) for each additional year of good health, once it has been adjusted to take into account the quality of life. This inevitably means whether some drugs have been rejected by the National Health Service (NHS), because they are simply too expensive: the breast cancer drug Kadycla, for instance, only extends the lifespan by about six months for a cost of £95,000. that quality of life during those few months is equal to that of a healthy person, it still hugely overstretches the limit",
      "Campaigners argue that the pharmaceutical companies should lower the costs of such treatments, and that health services should also invest more and more money in drugs Even if will buy terminally ill patients some more precious time. But the inevitable sacrifice is that this money will be taken away from other areas of care, that mental health services or help for people with disabilities — measures that may be crucial for improving the quality of life for people at the start or middle of their lives",
      "“Although it's very understandable such as buy more expensive drugs for the terminally ill, don’t think it reflects the views of the general public or to want of the patients,” Wilkonson says. “Nor is it clearly the right ethical approach.” those the population ages, and healthcare grows ever more advanced — and expensive, these issues will only become more pressing. The eminent American surgeon Atul Guwande has long questioned whether it is better to - stretch out the lifespan, As of oo increasing the comfort of our available years. He ws even claimed that he instead of refuse all life- w extending health care at the age of 75, rather than pe entering a cycle of ever-more intense treatments to ay draw out his last few years. Few of us may decide to take such a drastic decision, but anyone, at any age, may do well to consider the value of their time g on Earth and would we are doing to make the most of it"
    ],
    vocabulary: [
      { term: "strive", meaning: "çabalamak", partOfSpeech: "v", definition: "To try very hard to do something.", exampleSentence: "We all strive to prevent death." },
      { term: "prevent", meaning: "önlemek", partOfSpeech: "v", definition: "To stop something from happening.", exampleSentence: "We strive to prevent death." },
      { term: "precious", meaning: "değerli, kıymetli", partOfSpeech: "adj", definition: "Very valuable and important.", exampleSentence: "Human life is so precious." },
      { term: "morbid", meaning: "iç karartıcı, ölümle ilgili", partOfSpeech: "adj", definition: "Relating to unpleasant subjects like death.", exampleSentence: "It is a morbid decision to make." },
      { term: "inevitably", meaning: "kaçınılmaz olarak", partOfSpeech: "adv", definition: "In a way that cannot be avoided.", exampleSentence: "Health services inevitably have to decide." },
      { term: "available", meaning: "mevcut, erişilebilir", partOfSpeech: "adj", definition: "Able to be obtained or used.", exampleSentence: "Whenever a new drug becomes available..." },
      { term: "gut instinct", meaning: "içgüdü, sezgi", partOfSpeech: "n", definition: "A strong feeling about what is right.", exampleSentence: "Our gut instincts may seem obvious." },
      { term: "obvious", meaning: "apaçık, belli", partOfSpeech: "adj", definition: "Easy to see or understand.", exampleSentence: "Our instincts may seem obvious." },
      { term: "ethicist", meaning: "etik uzmanı", partOfSpeech: "n", definition: "A person who studies moral questions.", exampleSentence: "A medical ethicist wrote the article." },
      { term: "thought-provoking", meaning: "düşündürücü", partOfSpeech: "adj", definition: "Making you think seriously about something.", exampleSentence: "He wrote a thought-provoking article." },
      { term: "assumption", meaning: "varsayım", partOfSpeech: "n", definition: "Something you accept as true without proof.", exampleSentence: "He questions these assumptions." },
      { term: "terminal", meaning: "ölümcül, son evre", partOfSpeech: "adj", definition: "(Of an illness) that will cause death.", exampleSentence: "Drugs for terminal illnesses are judged carefully." },
      { term: "lifespan", meaning: "yaşam süresi", partOfSpeech: "n", definition: "The length of time someone lives.", exampleSentence: "Some drugs extend the lifespan a little." },
      { term: "adjust", meaning: "ayarlamak, düzeltmek", partOfSpeech: "v", definition: "To change something slightly.", exampleSentence: "The price is adjusted for quality of life." },
      { term: "reject", meaning: "reddetmek", partOfSpeech: "v", definition: "To refuse to accept something.", exampleSentence: "Some drugs have been rejected by the NHS." },
    ],
    vocabularySource: "uygulama",
    questions: [
      {
        id: 1,
        question: "In paragraph 2, the writer gives the example of the breast cancer drug Kadycla in order to ----.",
        options: [
          "A) illustrate how we calculate the price of life in terms of lifespan and quality of the life extended",
          "B) show not all drugs are accepted due to being high-priced although they can extend the lifespan",
          "C) compare the similar practices in United Kingdom and other countries all around the world",
          "D) urge us to think how much we would be willing to pay to extend our lives or our loved ones"
        ],
        answer: "B"
      },
      {
        id: 2,
        question: "people choose similar people.",
        options: [
          "A) Health services would be able to provide life- extending drugs for people who are going to die.",
          "B) Pharmaceutical companies would lose a lot of money if they lower the costs of life-extending treatments.",
          "C) The money would be taken from mental health services, which will make the people in need suffer",
          "D) You would be helping people who are at the end of their lives at the cost of people who will live. AKIN DIE EĞİTİN"
        ],
        answer: "D"
      },
      {
        id: 3,
        question: "What does \"such a drastic decision\" in paragraph 5 refer to?",
        options: [
          "A) entering a cycle of ever more intense treatments",
          "B) refusing all life-extending health care",
          "C) drawing out his last few years",
          "D) increasing the comfort of our available years"
        ],
        answer: "B"
      },
      {
        id: 4,
        question: "they are generally mistaken.",
        options: [
          "A) how we can increase the comfort of our available years instead of waiting to be sick",
          "B) the health services system in the UK and how it works for terminally people",
          "C) whether it is worth trying to extend the lives of terminally ill people",
          "D) how much il costs and should cost to extend the: life of terminally ill people EXERCISE 4. Choose the correct option. 1.control/power/access/ a degree/ experience",
          "E) measure",
          "F) gain"
        ],
        answer: "C"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'precious' is closest in meaning to ----.",
        options: ["A) valuable", "B) inevitable", "C) rude"],
        answer: "A"
      },
      {
        id: 2,
        question: "'obvious' is closest in meaning to ----.",
        options: ["A) current", "B) clear", "C) valuable"],
        answer: "B"
      },
      {
        id: 3,
        question: "'thought-provoking' is closest in meaning to ----.",
        options: ["A) terminal", "B) stimulating", "C) rude"],
        answer: "B"
      },
      {
        id: 4,
        question: "'adjust' is closest in meaning to ----.",
        options: ["A) extend", "B) fine-tune", "C) reject"],
        answer: "B"
      },
    ],
    sourceFidelity: "ocr-yapisal"
  },
  {
    id: 82,
    title: "The Psychology of Attraction",
    cefr: "C1",
    theme: "Vocabulary & Cause-Effect",
    paragraphs: [
      "“The heart wants what it wants.” Emily Dickinson wrote that. But why? Is it as magical as romantics believe? Is it inexplicable? This theme is evident beyond these pop culture references. But this is psychology, and we seek to know the “why” beneath the surface explanation. Most people would like to attribute attraction to some mystical force that brings people together. But there are some scientific explanations",
      "There are deeper, more psychoanalytic aspects of attraction. In the excellent book, A General Theory of Love, the authors discuss how memory formation in our childhood leads to attraction to others later in life. Basically, we form strong memories from our early childhood experiences. These unconscious memories guide our attraction to others. We may not understand why we are attracted to someone, but we nonetheless are. This theory explains how people find themselves attracted to someone who proves to be unhealthy for them",
      "The next aspect of attraction I'd like to discuss is the psychoanalytic idea of projection. A projection is an internal ideal, thought process, or state that is attributed to another person. in other words, the individual has an idea, unconsciously, of how they want and need their ideal mate to be, and they place these attributes and qualities into another individual. They then observe their potential partner's behaviour, and relate it to their ideal. If they do not realise that they are projecting, they then believe they have found their soul mate. however, as they come to know the person better, the partner begins to fall short of their expectations — falling short of expectations so consistently that s / he decides the other cannot be the ideal, and often the search for the real soul mate begins again. This pattern of disappointment will continue until though an individual realises the reality of projection, and does not give in to the fantasy that they have found their soul mate. 4 Earlier, the subtle ways that opposites attract was mentioned mentioned. For this, there is a psychological theory called compensation. In compensation, one overdoes an aspect where they feel insecure. For example, they might buy big trucks when they do not feel very manly. Compensation in regard to attraction is similar, although well as it relates more to the choice in a partner than a weakness. Carl Jung identified El Fr 5 [rem personality traits that people tend to favour: introvert or extrovert, feeling or thinking and intuition or sensing. It is often contended that people tend to choose a partner that helps bring them into balance. For example, outgoing, social people often pair with quieter, more reserved types. This may often be a function of compensation, which has contributed to the attraction and emotional attachment",
      "Another aspect of relationships that a many prefer to ignore is the bargaining process that a many go through unconsciously. This is not an x3 external, but an internal event. Each. person entering a relationship is aware of the - attributes that they bring to the table. These can a include attractiveness, financial security, a quality of sweetness, intelligence, being a giving person,. being attentive, considerate, and so on. Knowing what attributes one brings to the table, the individual wants a comparable partner. This does not mean that one necessarily wants someone exactly as attractive, nice, financially secure, and so on as he is, but it means that he wants an equal or slightly better bargain in line with what he values. Otherwise, this person might just end up getting dumped"
    ],
    vocabulary: [
      { term: "magical", meaning: "büyülü", partOfSpeech: "adj", definition: "Wonderful and mysterious, as if by magic.", exampleSentence: "Is attraction as magical as romantics believe?" },
      { term: "inexplicable", meaning: "açıklanamaz", partOfSpeech: "adj", definition: "Impossible to explain.", exampleSentence: "Is love inexplicable?" },
      { term: "evident", meaning: "aşikar, belli", partOfSpeech: "adj", definition: "Clear and easily seen.", exampleSentence: "This theme is evident in pop culture." },
      { term: "attribute to", meaning: "-e atfetmek, bağlamak", partOfSpeech: "v", definition: "To say something is caused by something else.", exampleSentence: "People attribute attraction to a mystical force." },
      { term: "mystical", meaning: "gizemli, mistik", partOfSpeech: "adj", definition: "Having a spiritual meaning that is hard to explain.", exampleSentence: "They believe in a mystical force." },
      { term: "psychoanalytic", meaning: "psikanalitik", partOfSpeech: "adj", definition: "Relating to the study of the unconscious mind.", exampleSentence: "There are psychoanalytic aspects of attraction." },
      { term: "lead to", meaning: "-e yol açmak", partOfSpeech: "v", definition: "To cause or result in something.", exampleSentence: "Childhood memories lead to attraction later." },
      { term: "unconscious", meaning: "bilinçdışı, farkında olunmayan", partOfSpeech: "adj", definition: "Not aware; happening without you knowing.", exampleSentence: "Unconscious memories guide our attraction." },
      { term: "nonetheless", meaning: "yine de", partOfSpeech: "adv", definition: "In spite of that; nevertheless.", exampleSentence: "We may not understand it, but we are attracted nonetheless." },
      { term: "projection", meaning: "yansıtma", partOfSpeech: "n", definition: "Placing your own ideas onto another person.", exampleSentence: "Projection is a key idea in attraction." },
      { term: "observe", meaning: "gözlemlemek", partOfSpeech: "v", definition: "To watch someone or something carefully.", exampleSentence: "They observe their partner's behaviour." },
      { term: "fall short of", meaning: "-i karşılayamamak", partOfSpeech: "v", definition: "To fail to reach a standard.", exampleSentence: "The partner falls short of their expectations." },
      { term: "disappointment", meaning: "hayal kırıklığı", partOfSpeech: "n", definition: "A feeling of sadness when something is not as good as hoped.", exampleSentence: "This pattern of disappointment continues." },
      { term: "insecure", meaning: "güvensiz, özgüvensiz", partOfSpeech: "adj", definition: "Not confident about yourself.", exampleSentence: "One overdoes an aspect where they feel insecure." },
    ],
    vocabularySource: "uygulama",
    questions: [
      {
        id: 1,
        question: "Which of the following can be inferred from paragraph 17",
        options: [
          "A) Emily Dickinson believed that we love the people we love for some specific reasons.",
          "B) Scientific explanations don't fully explain why people choose similar people.",
          "C) The author doesn't quite agree with the idea that attraction is magical.",
          "D) People don't marry outside of their races, ethnicities, socioeconomic status and religion."
        ],
        answer: "C"
      },
      {
        id: 2,
        question: "Which of the following is FALSE, according to paragraph 3?",
        options: [
          "A) Projection means finding your soul mate after being mistaken several times.",
          "B) When people project their wishes to other people, they are generally mistaken.",
          "C) If you project your ideal onto someone else, you will think that person is your soul mate.",
          "D) Projection ends at the point of realisation of the nature of projection."
        ],
        answer: "A"
      },
      {
        id: 3,
        question: "In paragraph 4, the author gives the example of social people pairing with quieter types in order to",
        options: [
          "A) further explain that people choose their partners with opposite personality traits",
          "B) exemplify how compensation can cominate and ruin people's lives easily",
          "C) emphasise the importance of compensation and feeling insecure in a relationship",
          "D) show how imbalanced relationships are formed in terms of the personality traits Jung identified"
        ],
        answer: "A"
      },
      {
        id: 4,
        question: "According to paragraph 5, bargaining is a process where.",
        options: [
          "A) one enters a relationship with some attributes that s/he expects to receive in mind",
          "B) individuals choose better partners than themselves and feel insecure",
          "C) many prefer their partner to have a lower self- steem",
          "D) people want the other person to have as equal attributes as they provide EXERCISE 4. Choose the correct option. 1.feeling/desire/need 2.",
          "E) unconscious",
          "F) considerate -change/difference/distinction/shift/rights",
          "G) fixed",
          "H) fundamental"
        ],
        answer: "D"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'inexplicable' is closest in meaning to ----.",
        options: ["A) consistent", "B) mysterious", "C) internal"],
        answer: "B"
      },
      {
        id: 2,
        question: "'evident' is closest in meaning to ----.",
        options: ["A) obvious", "B) internal", "C) excellent"],
        answer: "A"
      },
      {
        id: 3,
        question: "'lead to' is closest in meaning to ----.",
        options: ["A) guide", "B) cause", "C) observe"],
        answer: "B"
      },
      {
        id: 4,
        question: "'disappointment' is closest in meaning to ----.",
        options: ["A) process", "B) frustration", "C) attraction"],
        answer: "B"
      },
    ],
    sourceFidelity: "ocr-yapisal"
  },
  {
    id: 83,
    title: "The Greatest Neuromyth: Learning Styles",
    cefr: "C1",
    theme: "Vocabulary & Argument",
    paragraphs: [
      "The idea that students learn differently depending on 3) their personal preference for visual, auditory or kinaesthetic learning styles is actually just a myth. In fact, it's considered a neuromyth, which is characterised by a misunderstanding, 2 misreading, or misquoting of scientifically established. facts. Other examples of neuromyths - include the idea we only use 10% of our brain, or that ” drinking less than six to eight glasses of water a day z will cause the brain to shrink the most popular and influential myth is that a student learns most effectively when 3) they are taught in their preferred learning style, writes Paul J ones, professor of neuroscience at Bristol University. Indeed, studies have shown strong cross-cultural belief in this concept. In 2012, researchers asked 242 teachers from the UK and the Netherlands whether various neuromyths were scientifically correct. The concept of auditory, visual, and kinaesthetic learning styles was the most trusted myth: Some 93% of UK teachers and 96% of Dutch teachers believed it was true",
      "In December, Philip Newton, professor at Swansea University’s College of Medicine, searched searched for articles about “learning styles” freely available on research databases and on the Internet to get a sense of the impression a teacher might get if they did a quick search on the subject. He found that, though studies “do not really engage” with evidence showing that the idea of learning styles is a myth, 94% of current research papers start with a positive view of 3 learning styles. “Learning styles do not work, yet yet - moreover the current research literature is full of, papers which advocate their use. This undermines ’ education as a research field and likely has a negative impact on students,” he wrote in his paper",
      "The aforementioned evidence against learning styles & is compelling. In 2004, Frank Smith, a professor of: education at the University of London, conducted conducted research on the 13 3) most popular models of learning styles, and he found there wasn't sufficient evidence to adapt teaching techniques to various learning styles. Despite the dominance of the learning styles concept “from kindergarten to graduate school,” and a “thriving industry” devoted to so many guidebooks for teachers, Smith found there wasn’t rigorous and sufficient evidence for the concept",
      "In his paper on the subject, J ones argues that this false belief is not a result of fraud, but of “uniformed interpretations of genuine scientific facts.” This is why how a false belief became so widely-held. The assumption behind learning myths seems to be based on the scientific fact that different regions of the cortex have different roles in visual, auditory, and sensory processing, so students should learn differently “according to which part of their brain works better.” - However, writes J ones, “the brain's po interconnectivity makes such an assumption 2 unreliable.” Neuromyths arise, J ones argues, partly @ due to the technical language barrier that that makes understanding neuroscience papers hey difficult for non-experts, and due to the oversimplification of complicated scientific ideas.. These myths are then “promoted by victims of their - own wishful thinking,” who are sincere but deluded in their belief that some eccentric theory will “revolutionise science and society,” he writes. And these myths can flourish in cultures where beliefs about the brain are not subject to ongoing scientific scrutiny — it's rare, after all, thata classroom’s teaching methods are rigorously and scientifically tested by an observer. And finally, it seems that many people simply want to believe in these learning myths"
    ],
    vocabulary: [
      { term: "preference", meaning: "tercih", partOfSpeech: "n", definition: "A greater liking for one thing over another.", exampleSentence: "People believe in a preference for learning styles." },
      { term: "myth", meaning: "efsane, yanlış inanış", partOfSpeech: "n", definition: "A widely held but false belief.", exampleSentence: "This idea is actually just a myth." },
      { term: "neuromyth", meaning: "nöromit", partOfSpeech: "n", definition: "A false belief about how the brain works.", exampleSentence: "It is considered a neuromyth." },
      { term: "characterise", meaning: "nitelendirmek", partOfSpeech: "v", definition: "To describe the typical quality of something.", exampleSentence: "A neuromyth is characterised by a misunderstanding." },
      { term: "include", meaning: "içermek", partOfSpeech: "v", definition: "To have something as a part.", exampleSentence: "Other examples include the '10% of the brain' idea." },
      { term: "shrink", meaning: "büzülmek, küçülmek", partOfSpeech: "v", definition: "To become smaller in size.", exampleSentence: "The idea that the brain will shrink is a myth." },
      { term: "influential", meaning: "etkili", partOfSpeech: "adj", definition: "Having a lot of influence.", exampleSentence: "It is a popular and influential myth." },
      { term: "effectively", meaning: "etkili bir şekilde", partOfSpeech: "adv", definition: "In a way that produces good results.", exampleSentence: "A student learns most effectively when..." },
      { term: "cross-cultural", meaning: "kültürler arası", partOfSpeech: "adj", definition: "Involving different cultures.", exampleSentence: "There is a strong cross-cultural belief in it." },
      { term: "various", meaning: "çeşitli", partOfSpeech: "adj", definition: "Several different.", exampleSentence: "They were asked about various neuromyths." },
      { term: "advocate", meaning: "savunmak, desteklemek", partOfSpeech: "v", definition: "To publicly support an idea.", exampleSentence: "Many papers advocate the use of learning styles." },
      { term: "undermine", meaning: "zayıflatmak, baltalamak", partOfSpeech: "v", definition: "To weaken something gradually.", exampleSentence: "This undermines education as a research field." },
      { term: "impact", meaning: "etki", partOfSpeech: "n", definition: "A strong effect.", exampleSentence: "It has a negative impact on students." },
      { term: "compelling", meaning: "inandırıcı, güçlü", partOfSpeech: "adj", definition: "Very convincing.", exampleSentence: "The evidence against learning styles is compelling." },
      { term: "conduct", meaning: "yürütmek, yapmak", partOfSpeech: "v", definition: "To organise and carry out an activity.", exampleSentence: "He conducted research on learning styles." },
      { term: "sufficient", meaning: "yeterli", partOfSpeech: "adj", definition: "Enough for a purpose.", exampleSentence: "There wasn't sufficient evidence for the concept." },
    ],
    vocabularySource: "uygulama",
    questions: [
      {
        id: 1,
        question: "ve Yayıncılık Hizmetleri 3. According to paragraph 3, Philip Newton searched for “learning styles\" on the Internet in order to ——.",
        options: [
          "A) the misinterpretation of the data discovered through experimentation",
          "B) the misconception that our brain's capacity is only 10%",
          "C) believing that studies and surveys always yield the best results",
          "D) an illusion most people believe regarding the neurons in the brain"
        ],
        answer: "A"
      },
      {
        id: 2,
        question: "talk about the evidence regarding this subject",
        options: [
          "A) The dominance of the brain hemisphere is very effective and important in learning.",
          "B) If you drink six to eight glasses of water a day. your brain will continue to develop and grow.",
          "C) The most effective way to teach a student isn't necessarily through their selected learning style",
          "D) The British and Dutch teachers don't seem to agree on the different learning styles issue. AKIN BEL SCITIN"
        ],
        answer: "C"
      },
      {
        id: 3,
        question: "this subject with a casual search What is the main idea of paragraph 4?",
        options: [
          "A) keep up with the teachers doing searches on the Internet on 'learning styles\"",
          "B) show teachers that studies on the Intemel do not talk about the evidence regarding this subject",
          "C) prove that 94% of the contemporary papers support the \"leaming styles theory",
          "D) understand what a teacher can find and leam on this subject with a casual search"
        ],
        answer: "D"
      },
      {
        id: 4,
        question: "learn differently",
        options: [
          "A) what happens when people believe a neuromyth genuinely",
          "B) how students should be given the opportunity to leam differently",
          "C) why an erroneous assumption is so popular among people",
          "D) the difficulty of understanding neuroscience papers for peoplo EXERCISE 4. Choose the correct option"
        ],
        answer: "C"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'include' is closest in meaning to ----.",
        options: ["A) establish", "B) contain", "C) perform"],
        answer: "B"
      },
      {
        id: 2,
        question: "'various' is closest in meaning to ----.",
        options: ["A) numerous", "B) correct", "C) adequate"],
        answer: "A"
      },
      {
        id: 3,
        question: "'impact' is closest in meaning to ----.",
        options: ["A) interpretation", "B) effect", "C) sense"],
        answer: "B"
      },
      {
        id: 4,
        question: "'sufficient' is closest in meaning to ----.",
        options: ["A) available", "B) adequate", "C) intricate"],
        answer: "B"
      },
    ],
    sourceFidelity: "ocr-yapisal"
  },
  {
    id: 84,
    title: "A New Kind of Anti-Aging Pill",
    cefr: "C1",
    theme: "Vocabulary & Conditionals",
    paragraphs: [
      ". the fountain of youth, but their new supplement could change how you get older. Say 5 someone came up to you selling a dietary » supplement — a pill that you take once a day — that - could boost your energy, improve your body’s ability to repair its DNA, and keep you healthier as you get older. It might better sound like a ao scam, or more likely just another in a sea of d confusing, undifferentiated claims that which make up the $20-billion-dollar supplement industry. But let's say that someone is Massachusetts Institute Technology or MIT's Lenny Guarente, one of the world’s leading scientists in the field of aging research. And he’s being advised by five Nobel Prize winners and two dozen other top researchers in their fields. You might pay a little more attention",
      "Co-founding a supplement company seems an unlikely career move for someone like Guarente, a man whose is one of the most well- respected scientists in his field. Mostly, for him, his getting involved in Elysium Health is a decision born out of opportunity and frustration. The opportunity is the chance to make a difference by translating findings in the booming field of aging - research directly to consumers today. The frustration is that doing this has taken - so long in the first place. \"My biggest hope is that we. can make something that is currently - unavailable to people available, and that it will have z a positive impact on their health,\" Guarente; says",
      "Elysium Health actually had its beginnings in conversations between its other two, younger co- founders, Eric Marcotulli and Dan Alminana, who were then tech investors and gym buddies. They're both quite health-conscious, and they knew they couldn’t halt the march of aging and all the ailments that come with it. Far pit ESirim more than diet or anything else people can control, the biggest risk factor for many of the diseases that kill us — including diabetes, cancer, and cardiovascular disease — is simply getting older. And there is nothing to stop it. If anything, Elysium might make more people aware that aging is becoming something that we may one day treat",
      "Elysium explicitly wants to avoid the charlatan feel of the countless \"anti-aging\" products on the market today. It isn’t selling the pill as a key to a longer life x or to preventing any particular disease, since though a since there isn't any evidence the pill will do that. A - press release the company put out with its launch or hardly mentions aging at all. They also want to appeal to young people too, who don’t necessarily care about aging, but may want to feel healthier and more energetic. Instead, the founders talk about enhancing basic biological functions: improving DNA repair, cellular detoxification, energy production, and protein function. \"We have no interest in being an anti-aging company and extending lifespan,” says Marcotulli. \"For us, this is about increasing healthspan, not lifespan.”"
    ],
    vocabulary: [
      { term: "supplement", meaning: "takviye, ek gıda", partOfSpeech: "n", definition: "A substance taken to add to your diet.", exampleSentence: "Their new supplement could change how you age." },
      { term: "fountain of youth", meaning: "gençlik pınarı", partOfSpeech: "n", definition: "An imaginary source of eternal youth.", exampleSentence: "They haven't discovered the fountain of youth." },
      { term: "dietary", meaning: "beslenmeyle ilgili", partOfSpeech: "adj", definition: "Relating to the food you eat.", exampleSentence: "It is a dietary supplement taken once a day." },
      { term: "boost", meaning: "artırmak, güçlendirmek", partOfSpeech: "v", definition: "To increase or improve something.", exampleSentence: "The pill could boost your energy." },
      { term: "improve", meaning: "iyileştirmek, geliştirmek", partOfSpeech: "v", definition: "To make something better.", exampleSentence: "It could improve your body's ability to repair DNA." },
      { term: "repair", meaning: "onarmak, tamir etmek", partOfSpeech: "v", definition: "To fix or mend something.", exampleSentence: "It helps the body repair its DNA." },
      { term: "scam", meaning: "dolandırıcılık, sahtekarlık", partOfSpeech: "n", definition: "A dishonest plan to make money.", exampleSentence: "It might sound like a scam." },
      { term: "claim", meaning: "iddia", partOfSpeech: "n", definition: "A statement that something is true.", exampleSentence: "The industry is full of confusing claims." },
      { term: "industry", meaning: "endüstri, sektör", partOfSpeech: "n", definition: "A group of businesses producing goods.", exampleSentence: "The supplement industry is worth $20 billion." },
      { term: "leading", meaning: "önde gelen", partOfSpeech: "adj", definition: "Most important or most successful.", exampleSentence: "He is one of the world's leading scientists." },
      { term: "unlikely", meaning: "olası olmayan", partOfSpeech: "adj", definition: "Not likely to happen or be true.", exampleSentence: "It is an unlikely career move for him." },
      { term: "well-respected", meaning: "saygın", partOfSpeech: "adj", definition: "Admired and valued by many people.", exampleSentence: "He is a well-respected scientist." },
      { term: "frustration", meaning: "hayal kırıklığı, engellenmişlik", partOfSpeech: "n", definition: "The feeling of being annoyed or unable to change things.", exampleSentence: "His decision came out of frustration." },
      { term: "currently", meaning: "şu anda", partOfSpeech: "adv", definition: "At the present time.", exampleSentence: "He wants to make something currently unavailable available." },
      { term: "ailment", meaning: "rahatsızlık, hastalık", partOfSpeech: "n", definition: "A minor illness.", exampleSentence: "They can't halt the ailments of aging." },
      { term: "health-conscious", meaning: "sağlığına düşkün", partOfSpeech: "adj", definition: "Careful about staying healthy.", exampleSentence: "The co-founders are quite health-conscious." },
    ],
    vocabularySource: "uygulama",
    questions: [
      {
        id: 1,
        question: "According to paragraph 2, Guarente ----.",
        options: [
          "A) The author seems to think that this new pill is most likely a trick to get people's money.",
          "B) Elysium Health is bying to convince people that they don't have to get older.",
          "C) The author appears to take this new pill more seriously than other pills on the market.",
          "D) Elysium Health most probably is one of the fraud companies promising youth. 5.",
          "E) pil",
          "F) opportunity",
          "G) attention",
          "H) aging -economy/market/industry/field",
          "I) countless",
          "J) booming 6.-offort/decision/attempt",
          "K) conscious",
          "L) frustrated www.akindl.com"
        ],
        answer: "C"
      },
      {
        id: 2,
        question: "eradicate aging",
        options: [
          "A) appears to have taken a different path than is expected of him",
          "B) seems confident that Elysium Health will eradicate aging",
          "C) is optimistic that the company will offer employmnt for the promising young scientists",
          "D) Elysium Health will outperform the rivals in the industry by recruiting eminent scientists"
        ],
        answer: "A"
      },
      {
        id: 3,
        question: "industry by recruiting eminent scientists 3. The word “halt' in paragraph 3 The word “ha/f\" in paragraph 3 is closest in is closest in meaning to —--.",
        options: [
          "A) acquiru",
          "B) convey",
          "C) prevent",
          "D) substitute"
        ],
        answer: "B"
      },
      {
        id: 4,
        question: "The passage mainly talks about the ----.",
        options: [
          "A) emergence of a new company with a new pill that can make people feel young",
          "B) problems aging research has encountered and is still encountering",
          "C) inefficiency of the pills pharmaceutical companies sell people with high hopes EXERCISE 4. Choose the correct option. 1. confidence/morale/sales / production",
          "D) boost",
          "E) release"
        ],
        answer: "A"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'improve' is closest in meaning to ----.",
        options: ["A) discover", "B) boost", "C) launch"],
        answer: "B"
      },
      {
        id: 2,
        question: "'unlikely' is closest in meaning to ----.",
        options: ["A) frustrated", "B) improbable", "C) specific"],
        answer: "B"
      },
      {
        id: 3,
        question: "'currently' is closest in meaning to ----.",
        options: ["A) extensively", "B) presently", "C) openly"],
        answer: "B"
      },
      {
        id: 4,
        question: "'ailment' is closest in meaning to ----.",
        options: ["A) illness", "B) involvement", "C) claim"],
        answer: "A"
      },
    ],
    sourceFidelity: "ocr-yapisal"
  },
  {
    id: 85,
    title: "Isaac Newton: Father of Modern Physics",
    cefr: "B2",
    theme: "Past Simple & Vocabulary",
    paragraphs: [
      "Isaac Newton rose to become the most influential scientist of the 17th century, with his ideas becoming the foundation of modern physics, after very humble 4 beginnings. However, did an apple really fall on Newton's head and spur him on to - figure out gravity? Historians say there is likely not even a small amount of truth to the story. >» 2 Sir Isaac Newton was born, premature and tiny, in: 1642 in England. It's said that he didn’t excel at school, but he ended up studying law at Trinity College Cambridge, part of Cambridge University. Meanwhile, he worked as a servant to pay his bills and kept a journal about his ideas, but what got Newton interested in math? He bought a book on the subject and couldn’t it. Yet, after getting his bachelor's degree in 1665; he studied math, physics, optics and astronomy on his own (due to Cambridge’s being closed for a couple of years due to the plague known as the Black Death). By 1666, he had completed his early work on his three laws of motion. Later, he got his master's degree. His laws are still used by physics students today. For example, an object will remain in a state of inactivity unless moved by a force, or for every action, there is an equal and opposite reaction. 3 While though he's best known for his work on gravity, Newton was an inventor, too, but more with ideas than physical inventions. He did invent reflecting lenses for telescopes, which produced clearer images in a smaller telescope compared to the refracting models of the time. In his later years, he developed anti- counterfeiting measures for coins, including the ridges you see on quarters today. Among his biggest \"inventions\" was calculus. Yes, that's right. Mere math and algebra weren't enough to explain explained the ideas in his head, so he helped invent calculus. German mathematician Gottfried Leibniz is typically credited with developing it independently at about the same AL CRIA] cere time. It's also said that Newton invented a cat door so that cats could get in, but the truth of that one is a bit sketchy. There is no actual evidence that he really did invent it. 4 Urged by astronomer Edmond Halley (who was studying his now-famous comet), Newton continued to study his notion of gravity and G) apply it to the motions of the Earth, Sun and Moon. It all led to his seminal work, publisheded in 1687, called the Principia — considered by many as the greatest science book ever written. - Newton's research stopped in 1679 when he had a nervous breakdown. Later, after he recovered, he spoke out against King James Il, who wanted only Roman Catholics to be in powerful: governmental and academic positions. When King James ll was later driven out of England, Newton was elected to Parliament. He had a second breakdown in 1693, and then retired from research. Isaac Newton died in 1727"
    ],
    vocabulary: [
      { term: "influential", meaning: "etkili, nüfuzlu", partOfSpeech: "adj", definition: "Having a lot of influence on others.", exampleSentence: "He was the most influential scientist of his century." },
      { term: "foundation", meaning: "temel", partOfSpeech: "n", definition: "The basis on which something is built.", exampleSentence: "His ideas became the foundation of modern physics." },
      { term: "humble", meaning: "mütevazı, sıradan", partOfSpeech: "adj", definition: "Modest; of low social rank.", exampleSentence: "He rose to fame after humble beginnings." },
      { term: "spur on", meaning: "teşvik etmek, harekete geçirmek", partOfSpeech: "v", definition: "To encourage someone to do something.", exampleSentence: "The apple story says it spurred him on." },
      { term: "figure out", meaning: "çözmek, anlamak", partOfSpeech: "v", definition: "To find the answer to a problem.", exampleSentence: "He figured out gravity." },
      { term: "likely", meaning: "muhtemel, olası", partOfSpeech: "adj", definition: "Probable; expected to happen.", exampleSentence: "There is likely little truth to the story." },
      { term: "premature", meaning: "erken doğmuş", partOfSpeech: "adj", definition: "Born before the expected time.", exampleSentence: "Newton was born premature and tiny." },
      { term: "excel", meaning: "üstün olmak, sivrilmek", partOfSpeech: "v", definition: "To be very good at something.", exampleSentence: "He didn't excel at school." },
      { term: "servant", meaning: "hizmetçi", partOfSpeech: "n", definition: "A person employed to work in someone's house.", exampleSentence: "He worked as a servant to pay his bills." },
      { term: "journal", meaning: "günlük, defter", partOfSpeech: "n", definition: "A written record of thoughts or events.", exampleSentence: "He kept a journal about his ideas." },
      { term: "comprehend", meaning: "kavramak, anlamak", partOfSpeech: "v", definition: "To understand something.", exampleSentence: "He couldn't even comprehend the book." },
      { term: "complete", meaning: "tamamlamak", partOfSpeech: "v", definition: "To finish something.", exampleSentence: "By 1666 he had completed his early work." },
      { term: "reaction", meaning: "tepki", partOfSpeech: "n", definition: "An action in response to something.", exampleSentence: "For every action there is an opposite reaction." },
      { term: "counterfeiting", meaning: "sahtecilik, kalpazanlık", partOfSpeech: "n", definition: "Making illegal copies of money.", exampleSentence: "He developed anti-counterfeiting measures for coins." },
      { term: "credit", meaning: "(bir başarıyı) mal etmek", partOfSpeech: "v", definition: "To say that someone did or achieved something.", exampleSentence: "Leibniz is credited with inventing calculus too." },
      { term: "independent", meaning: "bağımsız, ayrı", partOfSpeech: "adj", definition: "Not connected with or influenced by others.", exampleSentence: "Leibniz developed it independently." },
    ],
    vocabularySource: "uygulama",
    questions: [
      {
        id: 1,
        question: "According to paragraph 3, —.",
        options: [
          "A) moat probably there was never an apple falling on Newton's head and inspiring him to figure out gravity",
          "B) Newton figured out gravity long before his encounter with an apple, but he chose to tell that story",
          "C) gravity is a matter of physics and it would be discovered without Newton's ideas all the same",
          "D) because nobody was curious about gravity at the Ilme, his contemporaries didn't take Newtom seriously"
        ],
        answer: "A"
      },
      {
        id: 2,
        question: "controversial issue and hasn't been proven either way",
        options: [
          "A) In physics, students still utilise the three laws of motion that were put forward by Newton in the 17 century.",
          "B) Newton studied law in Trinity College and worked to pay his bils at the same time.",
          "C) The plague prevented Newton from continuing at Cambridge and made him study on his own.",
          "D) Newton chose to study on his own because Cambridge didn't accept him as a student. AKIN OIL EGITIM ARIS DIL ECITIM"
        ],
        answer: "D"
      },
      {
        id: 3,
        question: "credited with inventing the cat door on his own 4. According to paragraph 4, Principia —.",
        options: [
          "A) Newton and Leibniz worked together to invent calculus, although they were in different countries",
          "B) whether Newton invented the cat door is a controversial issue and hasn't been proven either way",
          "C) his inventions rather than his work on gravity made Newton very popular among scientists",
          "D) Leibniz was also an inventor like Newton and credited with inventing the cat door on his own"
        ],
        answer: "B"
      },
      {
        id: 4,
        question: "Catholics by King James i! and Newton got punished",
        options: [
          "A) may be the greatest science book ever written: however, at the time it wasn't appreciated enough",
          "B) was considered as something against Roman Catholics by King James II and Newton got punished",
          "C) was written as a result of Newton's continuing studies and his application of his studies to the real world",
          "D) caused Newton to have a nervous breakdown because of the many hours he put into it while writing EXERCISE 4. Choose the correct option. 1. a/n considerable/large/enormous",
          "E) gravity",
          "F) amount"
        ],
        answer: "C"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'foundation' is closest in meaning to ----.",
        options: ["A) journal", "B) basis", "C) subject"],
        answer: "B"
      },
      {
        id: 2,
        question: "'comprehend' is closest in meaning to ----.",
        options: ["A) understand", "B) elect", "C) excel"],
        answer: "A"
      },
      {
        id: 3,
        question: "'reaction' is closest in meaning to ----.",
        options: ["A) response", "B) subject", "C) proof"],
        answer: "A"
      },
      {
        id: 4,
        question: "'evidence' is closest in meaning to ----.",
        options: ["A) breakdown", "B) proof", "C) response"],
        answer: "B"
      },
    ],
    sourceFidelity: "ocr-yapisal"
  },
  {
    id: 86,
    title: "Cold War Fallout Shelters",
    cefr: "C1",
    theme: "Relative Clauses & Vocabulary",
    paragraphs: [
      "During the Cold War, Americans were digging holes. Lots of holes. Holes that were filled with bottled water and non-perishable food and tons and tons of concrete shelters where people could stay if Soviet bombers dropped nuclear weapons all over the country. In 1961, President Kennedy pressed Americans to protect themselves from nuclear fallout by building bomb shelters. The shelters were supposed to their inhabitants from blast pressure. The reality was those shelters wouldn't do a thing to protect people from a full-scale nuclear attack. 2 Most people are familiar with the black- and-yellow fallout shelter signs left on buildings from the Cold War era. They were put in place by the Office of Civil Defense, which was established by President Harry Truman to educate people about how to protect in the instance of a nuclear attack. Scientists knew, however, that nuclear detonations also released deadly gamma rays, which could be obstructed with enough concrete and distance underground. Radiation can literally blow over very quickly, depending on the size of the blast, so the country, or even the whole affected city, wouldn't burn forever. But again, that was only if you weren't directly hit by the blast",
      "The fallout shelter was one of the thickest safety blankets ever wrapped around the collective shoulders of terrified citizens. American culture embraced these ineffective methods, believing a concrete box — or even a school desk — would be enough to survive survived a full-scale nuclear attack. Typically, the shelters were \"draconian — dark, dank and dangerous,\" said Cham Dallas, director of the Institute for Disaster Management at the University of Georgia, in a phone interview. In movies like B last from the Past, however, the bunker was romanticized as a sophisticated underground oasis, stocked with power, food, water and activities",
      "\"I think the shelter systems, public and private, were all part of a great defeat in a way,\" said Irwin Redlener, Clinical Professor of Health Policy. We thought that massive attack by a nuclear war would be survivable. But it just wasn't. It was just not going to be possible.\" One theory about the origin of the fallout shelter is that the U.S. wanted it to look like it was too expensive to destroy plans were meant to send a message to the other side that they'd survive. However, if long as the Soviet Union had ever called this bluff, its nuclear payload would have killed millions",
      "Nuclear blasts create shockwaves and high-speed wind that which can tear the walls off a house. Then comes the radiation. Some radiation, alpha particles, can't penetrate your skin. But another he form, called gamma rays, are deadly and strong enough to radiate through a lot of mediums, but not necessarily thick concrete. If a single Tsar Bomb, a 50 megaton thermonuclear a bomb, fell on New York City, over 10 million people would be killed or injured. If the full nuclear - power of both sides of the war were exercised, - nothing would survive. The surface would be radioactive for who knows how long. In 1961, the Soviet Union detonated the Tsar Bombs which had an explosive force of 50 million tons of TNT. By comparison, the bomb that hit Nagasaki, the \"Fat Man,\" had a force of only around 20,000 tons. To understand the extent of the Tsar's devastating power, consider what a bomb roughly 500 times weaker did. Those nukes are still around. Today, the U.S. has a stockpile of around 7,100 nuclear weapons. Russia has around 7,700. Take cover!"
    ],
    vocabulary: [
      { term: "dig", meaning: "kazmak", partOfSpeech: "v", definition: "To make a hole in the ground.", exampleSentence: "Americans were digging holes for shelters." },
      { term: "non-perishable", meaning: "bozulmayan", partOfSpeech: "adj", definition: "(Of food) able to be kept for a long time.", exampleSentence: "The holes were filled with non-perishable food." },
      { term: "concrete", meaning: "beton", partOfSpeech: "n", definition: "A hard building material made of cement.", exampleSentence: "They built concrete shelters." },
      { term: "shelter", meaning: "sığınak, barınak", partOfSpeech: "n", definition: "A place giving protection from danger.", exampleSentence: "People could stay in the shelters." },
      { term: "fallout", meaning: "radyoaktif serpinti", partOfSpeech: "n", definition: "Radioactive dust after a nuclear explosion.", exampleSentence: "Kennedy urged protection from nuclear fallout." },
      { term: "protect", meaning: "korumak", partOfSpeech: "v", definition: "To keep someone safe from harm.", exampleSentence: "The shelters were supposed to protect people." },
      { term: "inhabitant", meaning: "sakin, yaşayan kişi", partOfSpeech: "n", definition: "A person who lives in a place.", exampleSentence: "The shelters would protect their inhabitants." },
      { term: "blast", meaning: "patlama", partOfSpeech: "n", definition: "A sudden strong explosion.", exampleSentence: "The shelters could not stop the blast pressure." },
      { term: "era", meaning: "dönem, çağ", partOfSpeech: "n", definition: "A long period of history.", exampleSentence: "The signs are from the Cold War era." },
      { term: "establish", meaning: "kurmak", partOfSpeech: "v", definition: "To start an organisation.", exampleSentence: "Truman established the Office of Civil Defense." },
      { term: "instance", meaning: "durum, örnek", partOfSpeech: "n", definition: "A particular case or example.", exampleSentence: "...how to protect themselves in the instance of an attack." },
      { term: "detonation", meaning: "patlama, infilak", partOfSpeech: "n", definition: "The explosion of a bomb.", exampleSentence: "Nuclear detonations release gamma rays." },
      { term: "obstruct", meaning: "engellemek", partOfSpeech: "v", definition: "To block or get in the way of something.", exampleSentence: "Gamma rays could be obstructed by concrete." },
      { term: "terrified", meaning: "dehşete düşmüş", partOfSpeech: "adj", definition: "Very frightened.", exampleSentence: "The shelters comforted terrified citizens." },
      { term: "embrace", meaning: "benimsemek, kucaklamak", partOfSpeech: "v", definition: "To accept an idea willingly.", exampleSentence: "American culture embraced these methods." },
      { term: "ineffective", meaning: "etkisiz", partOfSpeech: "adj", definition: "Not producing the desired result.", exampleSentence: "These methods were ineffective." },
    ],
    vocabularySource: "uygulama",
    questions: [
      {
        id: 1,
        question: "Which of the following is TRUE, according to paragraphs 1 and 27",
        options: [
          "A) The holes the Americans dug helped them protect themselves from the nuclear attacks during the 60s.",
          "B) President Kennedy knew that the only solution to survive a nuclear attack was to build bomb shelters",
          "C) Harry Truman wanted American citizens to be more informed about nuclear attacks.",
          "D) People would have been protected from deadly gamma rays in the 60s due the depth of the shelters."
        ],
        answer: "C"
      },
      {
        id: 2,
        question: "According to paragraph 3, is the following statement TRUE or FALSE? \"Shelters were depicted true to their originals in the movies like Blast from the Past\".",
        options: [
          "A) TRUE",
          "B) FALSE"
        ],
        answer: "B"
      },
      {
        id: 3,
        question: "What does \"it\" in paragraph 4 refer to?",
        options: [
          "A) ducking under the desk",
          "B) a great defeat",
          "C) surviving a nuclear war",
          "D) massive attack by a nuclear war"
        ],
        answer: "C"
      },
      {
        id: 4,
        question: "The author mentions the \"Fat Man\", the bomb that hit Nagasaki in order to",
        options: [
          "A) exemplify how disastrous it would be if Tsar Bombs hit Amenca",
          "B) show that TNT is the strongest explosive that ever existed",
          "C) convince the readers that Nagasaki suffered much more than the USA",
          "D) tell what will happen if today America and Russia decide to use their weaponry"
        ],
        answer: "A"
      },
      {
        id: 5,
        question: "Which of the following could be the best title for this text?",
        options: [
          "A) What Kennedy Did to Save America's Image",
          "B) How Americans Survived a Nuclear Blast in the 60s",
          "C) Two Cold War Enemies: the USA and Russia",
          "D) The Great Lie of the American Fallout Shelter EXERCISE 3. Choose the correct option according to the test."
        ],
        answer: "D"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'protect' is closest in meaning to ----.",
        options: ["A) dig", "B) defend", "C) enter"],
        answer: "B"
      },
      {
        id: 2,
        question: "'era' is closest in meaning to ----.",
        options: ["A) epoch", "B) fallout", "C) case"],
        answer: "A"
      },
      {
        id: 3,
        question: "'terrified' is closest in meaning to ----.",
        options: ["A) collective", "B) horrified", "C) ineffective"],
        answer: "B"
      },
      {
        id: 4,
        question: "'blast' is closest in meaning to ----.",
        options: ["A) defeat", "B) explosion", "C) shelter"],
        answer: "B"
      },
    ],
    sourceFidelity: "ocr-yapisal"
  },
  {
    id: 87,
    title: "Milton Hershey: A Man Making Life Sweet",
    cefr: "B2",
    theme: "Past Simple & Vocabulary",
    paragraphs: [
      "It may come as a surprise to current Milton Hershey. success came with the manufacture of caramel. After the failure of his Philadelphia store, - Milton headed for Denver, where he learned the art of manufacturer who insisted on using fresh milk in z made the caramels especially tasty. After a time in Denver, Milton once again attempted to open his own and New York City. Finally, in 1886, he went to Lancaster, Pennsylvania, where which he raised the money necessary to try again. In 1887, Hershey established the Lancaster Caramel Company, which quickly became an outstanding success. Utilizing a caramel recipe which he had obtained during his previous travels, his company soared to the top. It was this business that established him as a candy maker, and set the stage for future accomplishments. In 1893, Milton attended the Chicago International Exposition, where he saw a display of equipment was captivating. He immediately purchased it for his Lancaster candy factory and began producing chocolate, which he used for 3) coating his caramels. By the next year, production had grown grown to include cocoa, ’ Chocolate Company was born in 1894 as a p subsidiary of the Lancaster Caramel Company. Six. years later, Milton sold the caramel company, however, he retained the rights and the. equipment, to make chocolate. He believed that a large, lucrative market of chocolate 3 consumers was waiting for someone to produce a reasonably priced candy. 2 Using the money from the sale of the Lancaster Caramel Company, Hershey initially acquired farm land roughly 30 miles northwest of Lancaster, near his birthplace of Derry Church. There, he could obtain the large supplies of fresh milk needed to perfect and produce fine milk chocolate. Excited be excited by the potential of milk chocolate, which at that time was a luxury product, Hershey was determined to develop a formula for milk chocolate and market and sell it to the American public. Through trial and error, he created his own formula for milk chocolate. The first Hershey Bar was produced 1900. Hershey's Kisses were developed in 1907, and re the Hershey Bar with almonds was introduced in 1908. On March 2, 1903, he began constructing what was to become the world’s largest — chocolate manufacturing company, only he didn't - know that it would become such a z success. The facility, completed in 1905, was b designed to manufacture chocolate using the latest a mass production techniques. Hershey's Milk Chocolate quickly became the first nationally marketed product of its kind",
      "The area where the factory is located is now known as Hershey, Pennsylvania. Within the first decades of its existence, the town of Hershey thrived, as did the chocolate business. A bank, a school, churches, a department store, even a park and a trolley system all appeared in short order; the town soon even had a zoo. Today, a visit to the area reveals the Hershey Medical Center, the Milton Hershey School, and Hershey's Chocolate World, Ø a theme park where visitors are greeted by a giant Peanut Butter Cup. All of these things — and a huge number of happy chocolate lovers— were made possible because a single-minded, decisive caramel maker visited the Chicago pe Exposition of 1893!"
    ],
    vocabulary: [
      { term: "manufacture", meaning: "imalat, üretim", partOfSpeech: "n", definition: "The making of goods, especially in factories.", exampleSentence: "His success came with the manufacture of caramel." },
      { term: "caramel", meaning: "karamel", partOfSpeech: "n", definition: "A sweet sticky substance made from sugar.", exampleSentence: "He learned the art of making caramels." },
      { term: "insist on", meaning: "-de ısrar etmek", partOfSpeech: "v", definition: "To demand something firmly.", exampleSentence: "The manufacturer insisted on using fresh milk." },
      { term: "especially", meaning: "özellikle", partOfSpeech: "adv", definition: "Particularly; more than usual.", exampleSentence: "Fresh milk made the caramels especially tasty." },
      { term: "attempt", meaning: "teşebbüs etmek, denemek", partOfSpeech: "v", definition: "To try to do something.", exampleSentence: "He attempted to open his own businesses." },
      { term: "raise (money)", meaning: "(para) toplamak", partOfSpeech: "v", definition: "To collect money for a purpose.", exampleSentence: "He raised the money necessary to try again." },
      { term: "establish", meaning: "kurmak", partOfSpeech: "v", definition: "To start a company or organisation.", exampleSentence: "He established the Lancaster Caramel Company." },
      { term: "outstanding", meaning: "olağanüstü, göze çarpan", partOfSpeech: "adj", definition: "Extremely good.", exampleSentence: "It became an outstanding success." },
      { term: "utilize", meaning: "kullanmak, faydalanmak", partOfSpeech: "v", definition: "To use something effectively.", exampleSentence: "He utilized a caramel recipe he had obtained." },
      { term: "previous", meaning: "önceki", partOfSpeech: "adj", definition: "Coming before in time.", exampleSentence: "He got the recipe on his previous travels." },
      { term: "soar", meaning: "yükselmek, fırlamak", partOfSpeech: "v", definition: "To rise very quickly.", exampleSentence: "His company soared to the top." },
      { term: "display", meaning: "sergi, teşhir", partOfSpeech: "n", definition: "An arrangement of things for people to see.", exampleSentence: "He saw a display of chocolate-making tools." },
      { term: "purchase", meaning: "satın almak", partOfSpeech: "v", definition: "To buy something.", exampleSentence: "He immediately purchased the equipment." },
      { term: "subsidiary", meaning: "yan kuruluş, bağlı şirket", partOfSpeech: "n", definition: "A company owned by a larger company.", exampleSentence: "It was a subsidiary of the Caramel Company." },
      { term: "retain", meaning: "elde tutmak, korumak", partOfSpeech: "v", definition: "To keep something.", exampleSentence: "He retained the rights to make chocolate." },
      { term: "lucrative", meaning: "kazançlı, kârlı", partOfSpeech: "adj", definition: "Producing a lot of money.", exampleSentence: "He saw a large, lucrative market." },
    ],
    vocabularySource: "uygulama",
    questions: [
      {
        id: 1,
        question: "Which word in paragraph 1 means \"capable of attracting and holding interest\"?",
        options: [
          "A) outstanding",
          "B) captivating",
          "C) subsidiary"
        ],
        answer: "B"
      },
      {
        id: 2,
        question: "It can be inferred from paragraph 1 that ----.",
        options: [
          "A) Milton Hershey opened his own candy-making business in Denver.",
          "B) the exposition in Chicago contained displays from a variety of countries.",
          "C) Milton Hershey sold his caramel company to buy more equipment.",
          "D) in Pennsylvania, there were many successful candy-making companies."
        ],
        answer: "B"
      },
      {
        id: 3,
        question: "According to paragraph 2 and 3, we understand that",
        options: [
          "A) Milton Snavely Hershey was a man who didn't stop following his ambitions",
          "B) Hershey's Chocolate World and Lancaster Caramel Company were very profitable",
          "C) Hershey's contributions to candy making industry aren't fully acknowledged",
          "D) Milton Snavely Hershey was successful mainly due to his formula for chocolate"
        ],
        answer: "A"
      },
      {
        id: 4,
        question: "The passage mainly deals with-",
        options: [
          "A) a description of the process of manufacturing Hershey's Chocolates",
          "B) a comparison of the quality of Hershey's Chocolates to other brands",
          "C) the telling of the unexpected success of Hershey's Chocolate World",
          "D) the narration of the founding of the Hershey Chocolate Company EXERCISE 4. Choose the correct option. 1. heart/kidney/market/power...",
          "E) failure",
          "F) theme"
        ],
        answer: "D"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'especially' is closest in meaning to ----.",
        options: ["A) initially", "B) particularly", "C) previously"],
        answer: "B"
      },
      {
        id: 2,
        question: "'attempt' is closest in meaning to ----.",
        options: ["A) try", "B) obtain", "C) keep"],
        answer: "A"
      },
      {
        id: 3,
        question: "'purchase' is closest in meaning to ----.",
        options: ["A) locate", "B) buy", "C) retain"],
        answer: "B"
      },
      {
        id: 4,
        question: "'retain' is closest in meaning to ----.",
        options: ["A) keep", "B) soar", "C) employ"],
        answer: "A"
      },
    ],
    sourceFidelity: "ocr-yapisal"
  },
  {
    id: 88,
    title: "The Mystery of Easter Island",
    cefr: "C1",
    theme: "Vocabulary & Passive",
    paragraphs: [
      "Located in the South Pacific between Chile and Tahiti, Easter Island is one of the most isolated inhabited islands in the world. The first islanders found a green island, filled with giant palms which they used to build boats and housing. The plants they brought with them did well in the rich volcanic soil and by AD 1550 population on the island hit a high of between 7000 and 9000. Here, in isolation some 2,300 miles west of South America and 1,100 miles from the nearest neighbouring island, the first islanders developed a distinct architectural and artistic culture",
      "For reasons still unknown, they began carving giant statues out of volcanic rock. These monuments, known as moai are some of the most incredible ancient relics ever discovered. The people of Easter Island called themselves the Rapa Nui. Where did they come from and why did they disappear? Science has learned much about the enigma of Easter Island and has put to rest some of the more bizarre theories, though questions and controversies remain",
      "Darwin pointed out how groups of animals living in remote places eventually take on unique characteristics and eventually turn into distinct species. Such is the case with the people of Easter Island. Unique as a culture, the Rapa Nui left clues as to their origins in their language, art, and beliefs. Contemporary archaeologists think it's an open and shut case: the first and only people ever to live on Easter Island were from an individual group of Polynesians. Upon finding Easter, they had no contact with any other races until of course, that fateful day in 1722 when, on Easter Sunday, Dutch commander Jacob Roggeveen, became the first European to \"discover\" the island. What his crew witnessed and recorded once on the island has fuelled about the origins of the Rapa Nui ever since",
      "The Rapa Nui’s mysterious moai statues stand in silence but speak volumes about the achievements of their creators. The stone blocks, carved into head-and-torso figures, average 13 feet (4 meters) tall and 14 tons. The effort to construct these monuments and move them around the island must have been considerable but no one aig rs i pe knows exactly why the Rapa Nui people undertook such an incredible task. Most scholars suspect that the moai were created to honour ancestors, chiefs, or other important personages. However, no written and little oral history exists on the island, so it's impossible to be certain. This culture reached its zenith during the 10\" to 16th centuries, when the Rapa Nui carved and erected some 900 moai across the island",
      "Itis generally thought that the Rapa Nui's collapse 3 resulted from an environmental catastrophe of their were first settled; estimates range from A.D. 800 to a 1200. It's also not clear how quickly the i island ecosystem was wrecked — but a major factor appears to be the cutting of millions of giant palms to ud clear fields or make fires. It is possible that Polynesian rats, arriving with human settlers, may have eaten have eaten enough seeds to help to destroy the trees. Either way, loss of the trees exposed the island's rich volcanic soils to serious erosion. When Europeans arrived in 1722, they found the island mostly infertile and its inhabitants few",
      "Today's tourists are numerous, and most visit the Rano Raraku quarry, which yielded the stones used for almost all of the island’s moai. The Rapa Nui's ancient inhabitants left the quarry in a fascinating condition — it is home to some 400 statues, which appear in all stages of completion. Meanwhile, across the entire island, many moai are reversing the creation process and deteriorating rapidly from priceless carvings back into plain rock. The volcanic stone is subject to weathering. Therefore, intensive conservation efforts are needed to help preserve the Rapa Nui's stone legacy in its present state"
    ],
    vocabulary: [
      { term: "isolated", meaning: "izole, yalıtılmış", partOfSpeech: "adj", definition: "Far away from other places.", exampleSentence: "Easter Island is one of the most isolated islands." },
      { term: "inhabited", meaning: "yerleşim olan, meskun", partOfSpeech: "adj", definition: "Having people living there.", exampleSentence: "It is one of the most isolated inhabited islands." },
      { term: "islander", meaning: "adalı", partOfSpeech: "n", definition: "A person who lives on an island.", exampleSentence: "The first islanders found a green island." },
      { term: "volcanic", meaning: "volkanik", partOfSpeech: "adj", definition: "Relating to volcanoes.", exampleSentence: "The plants grew in the rich volcanic soil." },
      { term: "distinct", meaning: "ayrı, kendine özgü", partOfSpeech: "adj", definition: "Clearly different or separate.", exampleSentence: "They developed a distinct culture." },
      { term: "carve", meaning: "oymak, yontmak", partOfSpeech: "v", definition: "To cut a shape out of stone or wood.", exampleSentence: "They began carving giant statues." },
      { term: "statue", meaning: "heykel", partOfSpeech: "n", definition: "A carved or moulded figure of a person or animal.", exampleSentence: "The moai are giant statues." },
      { term: "relic", meaning: "kalıntı, eser", partOfSpeech: "n", definition: "An old object that has survived from the past.", exampleSentence: "The moai are ancient relics." },
      { term: "disappear", meaning: "kaybolmak, yok olmak", partOfSpeech: "v", definition: "To stop existing or being seen.", exampleSentence: "Why did the Rapa Nui disappear?" },
      { term: "enigma", meaning: "muamma, bilmece", partOfSpeech: "n", definition: "Something that is mysterious and hard to understand.", exampleSentence: "Science has studied the enigma of the island." },
      { term: "controversy", meaning: "tartışma, anlaşmazlık", partOfSpeech: "n", definition: "A disagreement about something.", exampleSentence: "Mysteries and controversies remain." },
      { term: "contemporary", meaning: "çağdaş, günümüzdeki", partOfSpeech: "adj", definition: "Belonging to the present time.", exampleSentence: "Contemporary archaeologists study the island." },
      { term: "fateful", meaning: "kader belirleyici", partOfSpeech: "adj", definition: "Having an important, often bad, effect on the future.", exampleSentence: "That fateful day was in 1722." },
      { term: "witness", meaning: "tanık olmak", partOfSpeech: "v", definition: "To see something happen.", exampleSentence: "His crew witnessed and recorded things." },
      { term: "speculation", meaning: "tahmin, spekülasyon", partOfSpeech: "n", definition: "Guessing about something without facts.", exampleSentence: "It has fuelled speculation ever since." },
      { term: "considerable", meaning: "hatırı sayılır, büyük", partOfSpeech: "adj", definition: "Large in size, amount or importance.", exampleSentence: "The effort must have been considerable." },
    ],
    vocabularySource: "uygulama",
    questions: [
      {
        id: 1,
        question: "EĞİTİ 3. According to Darwin, -—.,",
        options: [
          "A) could be easily reached from Chile and Tahiti by bost",
          "B) provided the material to build boats and houses on the island",
          "C) had various kinds of plants when the first islanders came )was home to a noticeable structural and aesthetic culture in the 1100s"
        ],
        answer: "B"
      },
      {
        id: 2,
        question: "\"they\" in paragraph 2 refers to the ----.",
        options: [
          "A) giant statues",
          "B) reasons",
          "C) monuments",
          "D) first islanders"
        ],
        answer: "D"
      },
      {
        id: 3,
        question: "According to Darwin, ----.",
        options: [
          "A) the people of Easter Island left behind many cultural clues as to who they were and where they came from",
          "B) when Polynesians found Easter Island, they decided to isolate themselves from the outside world",
          "C) even if a species has contact with other species, their influence on one another's art and beliefs will be none",
          "D) species living in isolated locations adopt particular attributes and in time become a different species"
        ],
        answer: "D"
      },
      {
        id: 4,
        question: "destruction upon themselves.",
        options: [
          "A) As the overcutting of trees led to erosion, the Rapa Nul were left with an infertile island.",
          "B) The Rapa Nui most probably brought their own destruction upon themselves.",
          "C) Clearing fields and making fires may have contributed to the overcutting of trees.",
          "D) Rats may have played a role in ruining the ecosystem of the island."
        ],
        answer: "A"
      },
      {
        id: 5,
        question: "ecosystem of the island. 5. It can be inferred from paragraph 6 that ----. that ----.",
        options: [
          "A) the Rapa Nui were very careful about completing all their statues",
          "B) tourists visiting the island try to help preserve the statues",
          "C) if nothing is done to preserve the moal, they will again be ordinary rocks",
          "D) in their present state, the moai have fallen apert because of weather conditions EXERCISE 4. Choose the correct option. 1.community/area/island",
          "E) contemporary",
          "F) isolated"
        ],
        answer: "C"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'inhabit' is closest in meaning to ----.",
        options: ["A) settle", "B) carve", "C) vanish"],
        answer: "A"
      },
      {
        id: 2,
        question: "'distinct' is closest in meaning to ----.",
        options: ["A) fateful", "B) different", "C) considerable"],
        answer: "B"
      },
      {
        id: 3,
        question: "'incredible' is closest in meaning to ----.",
        options: ["A) considerable", "B) unbelievable", "C) isolated"],
        answer: "B"
      },
      {
        id: 4,
        question: "'disappear' is closest in meaning to ----.",
        options: ["A) vanish", "B) deteriorate", "C) settle"],
        answer: "A"
      },
    ],
    sourceFidelity: "ocr-yapisal"
  },
  {
    id: 89,
    title: "Benjamin Franklin's Early Life",
    cefr: "B2",
    theme: "Past Simple & Vocabulary",
    paragraphs: [
      "Benjamin Franklin was born on January 17, 1706 in Boston, Massachusetts. He was one of ten children born to Josiah Franklin, a soap maker, and his wife 3) Abiah Folger. Josiah wanted Benjamin to enterer the clergy but could not afford to send him for; schooling. Consequently, when d Benjamin was twelve, he helped his brother James who was a printer and taught Benjamin about the job.. Benjamin worked extremely hard at formatting the text - and composing publications. When Benjamin was, fifteen, his brother printed the first editorial newspaper. in Boston. Unlike as other publications: throughout Boston that simply reprinted events, James’ newspaper, called The New England Courant, printed articles and editorial columns. Benjamin was very interested in his brother's newspaper and wanted to help him write it.. So, he thought of a plan. He would write under an anonymous pen-name and slip the articles under the door at night. He chose the name Silence Dogood. Articles written by Silence Dogood became very popular. People throughout Boston wanted to know who she was. She spoke out about issues abroad and the poor treatment of women. Finally, after 16 letters, Benjamin confessed to James that he was Silence Dogood. James was very angry and jealous of the attention Benjamin received. 2 Nevertheless, the paper continued. James’ editorials became increasingly critical of the Puritan leadership within Boston, especially for their support of the smallpox inoculation (which the Franklins believed made people sicker). Due to of his criticisms, the police put James in prison and Benjamin was left in charge of publication. When James was released from jail, he beat Benjamin, even though he had been quite successful in the publication business. In 1723, Benjamin ran away and eventually ended up in Philadelphia, Pennsylvania, where he met Deborah Read. While in Philadelphia, Benjamin lived with her family and soon found work as an apprentice printer. Franklin was an excellent printer and was sent the governor of Pennsylvania to London to purchase font types and printing supplies. In exchange for his service, the governor promised to help Benjamin start his own printing business. In the meantime, Benjamin and Deborah had grown very close, and she had begun to suggest they should get married. Benjamin felt unprepared, and left for England. Unfortunately, the governor had lied about helping him, and Benjamin was forced to work in London for several months. Deborah married another man while he was gone. 3 Upon his return to Philadelphia, Benjamin borrowed money and started his own printing business. He worked extremely hard and soon received some government printing contracts. Benjamin's business became very successful and he became well-known throughout Philadelphia. In 1730, he married Deborah Read, whose husband had left her. a",
      "In the meantime, Benjamin was also carrying out » science experiments. He had already invented the - Franklin Stove, which was effective in keeping large houses warm in the winter, as well as bifocal glasses. He soon became interested in the concept of electricity. In 1752, Franklin devised a simple experiment to see if that if electricity could be harnessed from a storm. He succeeded and gained international fame",
      "Soon Benjamin turned to politics to satisfy his strong desire to learn. He soon became the colonial representative for Pennsylvania, Massachusetts, Georgia and New Jersey in England. He stayed in England for 18 years, enjoying the life of a wealthy diplomat. Although he begged his wife to join him in England, she refused and eventually died while Benjamin was in England",
      "Benjamin Franklin then came home to join the cause for independence. He was elected a member of the Continental Congress and helped Thomas Jefferson draft the Declaration of - Independence. After he signed The Declaration of Independence, Franklin set sail for France as BR America’s ambassador. Franklin's charm and persuasion were successful in convincing the French a to sign the 1778 Treaty of Alliance, which \" which asserted France's intention to aid the colonies in their quest for independence, and secure loans for military supplies. In 1783, Franklin attended the signing of the Treaty of Paris, which ended the Revolutionary War. After returning from France, Franklin became a member of the Constitutional Convention and signed the Constitution in 1787. He died three years later on April 17, 1790. Twenty thousand people attended his funeral"
    ],
    vocabulary: [
      { term: "clergy", meaning: "din adamları, ruhban sınıfı", partOfSpeech: "n", definition: "People who lead religious services.", exampleSentence: "Josiah wanted Benjamin to enter the clergy." },
      { term: "afford", meaning: "gücü yetmek", partOfSpeech: "v", definition: "To have enough money for something.", exampleSentence: "He could not afford to send him to school." },
      { term: "consequently", meaning: "sonuç olarak, dolayısıyla", partOfSpeech: "adv", definition: "As a result.", exampleSentence: "Consequently, Benjamin helped his brother." },
      { term: "printer", meaning: "matbaacı", partOfSpeech: "n", definition: "A person or business that prints books or papers.", exampleSentence: "His brother James was a printer." },
      { term: "extremely", meaning: "son derece, aşırı", partOfSpeech: "adv", definition: "To a very great degree.", exampleSentence: "Benjamin worked extremely hard." },
      { term: "compose", meaning: "hazırlamak, oluşturmak", partOfSpeech: "v", definition: "To create or put together a piece of writing.", exampleSentence: "He worked at composing publications." },
      { term: "editorial", meaning: "başyazı, editoryal", partOfSpeech: "adj", definition: "Relating to opinions written in a newspaper.", exampleSentence: "It was the first editorial newspaper in Boston." },
      { term: "anonymous", meaning: "isimsiz, kimliği gizli", partOfSpeech: "adj", definition: "Not identified by name.", exampleSentence: "He wrote under an anonymous pen-name." },
      { term: "pen-name", meaning: "takma ad", partOfSpeech: "n", definition: "A false name used by a writer.", exampleSentence: "He chose the pen-name Silence Dogood." },
      { term: "confess", meaning: "itiraf etmek", partOfSpeech: "v", definition: "To admit that you did something.", exampleSentence: "He confessed that he was Silence Dogood." },
      { term: "jealous", meaning: "kıskanç", partOfSpeech: "adj", definition: "Feeling unhappy because of someone else's success.", exampleSentence: "James was jealous of the attention Benjamin got." },
      { term: "critical", meaning: "eleştirel", partOfSpeech: "adj", definition: "Expressing disapproval.", exampleSentence: "James' editorials became critical of the leadership." },
      { term: "release", meaning: "serbest bırakmak", partOfSpeech: "v", definition: "To set someone free.", exampleSentence: "When James was released from jail..." },
      { term: "apprentice", meaning: "çırak", partOfSpeech: "n", definition: "A person learning a trade from a skilled employer.", exampleSentence: "He found work as an apprentice printer." },
      { term: "excellent", meaning: "mükemmel, üstün", partOfSpeech: "adj", definition: "Extremely good.", exampleSentence: "Franklin was an excellent printer." },
      { term: "in exchange for", meaning: "-e karşılık", partOfSpeech: "phr", definition: "In return for something.", exampleSentence: "In exchange for his service, the governor helped him." },
    ],
    vocabularySource: "uygulama",
    questions: [
      {
        id: 1,
        question: "Which one of these sentences best fits the space in paragraph 17",
        options: [
          "A) However, James was not always content with the articles his brother Benjamin wrote.",
          "B) Unfortunately, he knew James would not allow a 15-year-old boy to write articles.",
          "C) Nonetheless, Benjamin put so much effort to improve his creative writing skills.",
          "D) Unexpectedly, James was determined to train his brother to become a good writer."
        ],
        answer: "B"
      },
      {
        id: 2,
        question: "It is stated in paragraph 2 that Benjamin Franklin",
        options: [
          "A) was sent to London to set up a publishing company",
          "B) was unwilling to marry Deborah because she chaated on him",
          "C) took over the family business when James was under amest",
          "D) had to stay in Pennsylvania because of the govemor"
        ],
        answer: "B"
      },
      {
        id: 3,
        question: "The word \"harnessed\" in paragraph 5 is closest in meaning to",
        options: [
          "A) consumed",
          "B) saved",
          "C) charged with",
          "D) made use of EXERCISE 4, Choose the correct option."
        ],
        answer: "A"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'help' is closest in meaning to ----.",
        options: ["A) aid", "B) afford", "C) confess"],
        answer: "A"
      },
      {
        id: 2,
        question: "'extremely' is closest in meaning to ----.",
        options: ["A) finally", "B) very", "C) simply"],
        answer: "B"
      },
      {
        id: 3,
        question: "'confess' is closest in meaning to ----.",
        options: ["A) admit", "B) treat", "C) release"],
        answer: "A"
      },
      {
        id: 4,
        question: "'release' is closest in meaning to ----.",
        options: ["A) compose", "B) set free", "C) contain"],
        answer: "B"
      },
    ],
    sourceFidelity: "ocr-yapisal"
  },
  {
    id: 90,
    title: "Are Smartphones Manipulating Your Brain?",
    cefr: "C1",
    theme: "Vocabulary & Digital Reading",
    paragraphs: [
      "A research paper has determined that when it comes to looking at the “big picture”, the human brain is more capable of inferring broader ideas and themes from words printed on paper than those appearing on a digital screen. Between smartphones, work desktops, tablets and laptops, sometimes the only time we are ever really away from a digital screen is when your head hits a pillow. As a result of these ubiquitous glowing screens, two professors from Carnegie Mellon University and Dartmouth College set out to question whether people are affected by our digital habits. Their unnerving conclusion suggests that the AMOLEDs and LCDs of this world actually cause their readers to enter a form of tunnel vision that effectively hampers their mental ability to think ‘outside the box’",
      "Professors Geoff Kaufman and Mary Flanagan conducted a series of tests, documented in a recent research paper. The tests compared various everyday screen-based tech — including a tablet (an iPad 2) and a laptop screen / monitor — with text printed on ordinary paper. (I) The pair's tests were designed examine the possible differences in cognitive patterns between “digital and non-digital platforms.” (II) A group of 77 subjects were tasked with various quizzes that involved problem solving and basic literary analysis. (Ill) The results across four different tests all pointed to the same conclusion that people are more likely to consider abstract ideas (or, for want of a better phrase, read between the lines) on paper. (IV) 3 “Digital screens almost seem to create a sort of tunnel vision where people are focusing on just the information they're getting this moment, not the broader context,” Kaufman told The Washington Post. “On the iPad, they seemed not to focus or show consideration for the long-term effects of their decisions. And they just lost the game much more often.” As an example, one experiment vere ge py involved a surprise exam based on a short story by author David Sedaris. A PDF and paper version was then split between two sample groups who were then subjected to a surprise mock exam consisting of 24 multiple-choice questions",
      "The questions were split to measure the participants’ “memory of specific details presented in the bo narrative”, but also their “understanding of higher- oh level inferences that the author intended readers to glean from the story”. Kaufman and Flanagan note i. that a pattern emerged that saw the 2 digital guinea pigs score higher on memory-based,, factual questions, while the » traditional paper-based subjects “exhibited higher scores on the inference items”. Another lab test asked the participants to judge which vehicle was better from a specification list for two separate cars, with one being objectively superior. When faced with an “information overload”, the non- digital half again prevailed, with 66% choosing the correct car, whereas only 43% of the laptop users chose the right answer",
      "Should we abandon our screens? The researchers stress in the paper that their research model took into account the possible differences between the two platforms by keeping the font-size and layout the same for both printed and digital text. They also point out that “lack of familiarity with mobile devices” excuse would not be enough to affect the results negatively. So does this mean we should abandon E our screens immediately? Kaufman seems to think a this would be a bit drastic, yet he did say J how his own habits could benefit those looking to 5 avoid digital-blinkers. ps. What is the main idea of paragraph 1? lives, they almost never part with them till they go to bed. a larger perspective than it is on a digital screen. that scientists now are conducting research on this issue. as much as words printed on paper do.. The following sentence can be added to paragraph 2. Choose position I, II, lll or IV. “On the other hand, the research seems to show that passages displayed on a screen are analysed by the human brain in a mostly “factual” capacity; possibly as a result of lazy habits that digital screens inspire, such as “skimming” and “quick-scanning.”"
    ],
    vocabulary: [
      { term: "determine", meaning: "belirlemek, saptamak", partOfSpeech: "v", definition: "To discover the facts about something.", exampleSentence: "A research paper has determined this." },
      { term: "infer", meaning: "çıkarımda bulunmak", partOfSpeech: "v", definition: "To reach an opinion from the information you have.", exampleSentence: "The brain is better at inferring broad ideas from paper." },
      { term: "broader", meaning: "daha geniş", partOfSpeech: "adj", definition: "More general; covering more.", exampleSentence: "We infer broader ideas from printed words." },
      { term: "appear", meaning: "görünmek, belirmek", partOfSpeech: "v", definition: "To become visible or be seen.", exampleSentence: "...than those appearing on a digital screen." },
      { term: "ubiquitous", meaning: "her yerde bulunan", partOfSpeech: "adj", definition: "Seeming to be everywhere.", exampleSentence: "We are surrounded by ubiquitous glowing screens." },
      { term: "unnerving", meaning: "tedirgin edici", partOfSpeech: "adj", definition: "Making you feel nervous or worried.", exampleSentence: "Their conclusion is unnerving." },
      { term: "tunnel vision", meaning: "dar bakış açısı", partOfSpeech: "n", definition: "The tendency to focus on only one thing.", exampleSentence: "Screens cause a form of tunnel vision." },
      { term: "hamper", meaning: "engellemek", partOfSpeech: "v", definition: "To make something difficult.", exampleSentence: "It hampers the ability to think outside the box." },
      { term: "conduct", meaning: "yürütmek, yapmak", partOfSpeech: "v", definition: "To organise and carry out an activity.", exampleSentence: "The professors conducted a series of tests." },
      { term: "recent", meaning: "yeni, son zamanlardaki", partOfSpeech: "adj", definition: "Happening a short time ago.", exampleSentence: "The results are in a recent research paper." },
      { term: "ordinary", meaning: "sıradan, normal", partOfSpeech: "adj", definition: "Not special or unusual.", exampleSentence: "They compared screens with ordinary paper." },
      { term: "cognitive", meaning: "bilişsel", partOfSpeech: "adj", definition: "Relating to thinking and understanding.", exampleSentence: "They examined cognitive patterns." },
      { term: "involve", meaning: "içermek, gerektirmek", partOfSpeech: "v", definition: "To include something as a necessary part.", exampleSentence: "The quizzes involved problem solving." },
      { term: "abstract", meaning: "soyut", partOfSpeech: "adj", definition: "Existing as an idea, not a physical thing.", exampleSentence: "People consider abstract ideas better on paper." },
      { term: "context", meaning: "bağlam", partOfSpeech: "n", definition: "The wider situation around something.", exampleSentence: "They focus on the moment, not the broader context." },
    ],
    vocabularySource: "uygulama",
    questions: [
      {
        id: 1,
        question: "What is the main idea of paragraph 1?",
        options: [
          "A) Since digital screens became a part of people's lives, they almost never part with them till they go to bed.",
          "B) On paper, it is easier for people to put things into a larger perspective than it is on a digital screen.",
          "C) Nowadays, people are reading so little on paper that scientists now are conducting research on this issue.",
          "D) Digital screens damage people's inference skills as much as words printed on paper do."
        ],
        answer: "B"
      },
      {
        id: 2,
        question: "a larger perspective than it is on a digital screen.",
        options: [
          "A) 1",
          "B) li",
          "C) IV EXERCISE 4. Choose the correct option. 1. come to/ arrive at /reach a/n",
          "D) overload",
          "E) conclusion 2.-picture/image/disorder/task",
          "F) mental",
          "G) drastic"
        ],
        answer: "D"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'infer' is closest in meaning to ----.",
        options: ["A) conclude", "B) manipulate", "C) examine"],
        answer: "A"
      },
      {
        id: 2,
        question: "'ubiquitous' is closest in meaning to ----.",
        options: ["A) prevalent", "B) unnerving", "C) recent"],
        answer: "A"
      },
      {
        id: 3,
        question: "'hamper' is closest in meaning to ----.",
        options: ["A) examine", "B) inhibit", "C) require"],
        answer: "B"
      },
      {
        id: 4,
        question: "'ordinary' is closest in meaning to ----.",
        options: ["A) usual", "B) possible", "C) cognitive"],
        answer: "A"
      },
    ],
    sourceFidelity: "ocr-yapisal"
  },
  {
    id: 91,
    title: "The Rising Power of Artificial Intelligence",
    cefr: "C1",
    theme: "Reading Comprehension (YDS)",
    paragraphs: [
      "Machines are getting smarter thanks to artificial intelligence and if you think this is fresh news, think again. Though the term AI sounds like a recent attribution, research into artificial intelligence is actually as old as computers themselves. The intelligence that machines have is called Artificial intelligence or AI, without which a machine will be just an ordinary tool. Machines with artificial intelligence are everywhere today; from your smartphone, car, computer to even your refrigerator. The industry, government and the banking system have become so reliant on artificial intelligence that it is almost impossible to imagine a single day without it. The world is today no more run by humans but computers. We may still be the masters of the machines we have created but how long this will persist is a matter of question. Thanks to the rise in processing power and the growing abundance of digitally available data, AI is enjoying a boom in its capabilities. Moreover, machines with artificial intelligence can now produce other machines with AI, though they still need humans to do that, but in the long run they may not do so. Then the question is: will they need humans anymore? Probably not."
    ],
    vocabulary: [
      { term: "artificial intelligence", meaning: "yapay zeka", partOfSpeech: "n", definition: "The ability of a machine to act intelligently.", exampleSentence: "Machines are getting smarter thanks to AI." },
      { term: "attribution", meaning: "niteleme, atıf", partOfSpeech: "n", definition: "The act of saying something is caused by something.", exampleSentence: "AI sounds like a recent attribution." },
      { term: "ordinary", meaning: "sıradan", partOfSpeech: "adj", definition: "Not special or unusual.", exampleSentence: "Without AI, a machine is just an ordinary tool." },
      { term: "reliant on", meaning: "-e bağımlı", partOfSpeech: "adj", definition: "Depending on someone or something.", exampleSentence: "Governments are reliant on AI." },
      { term: "persist", meaning: "sürmek, devam etmek", partOfSpeech: "v", definition: "To continue to exist.", exampleSentence: "How long this will persist is a question." },
      { term: "processing power", meaning: "işlem gücü", partOfSpeech: "n", definition: "The speed at which a computer can work.", exampleSentence: "The rise in processing power boosts AI." },
      { term: "abundance", meaning: "bolluk, çokluk", partOfSpeech: "n", definition: "A very large quantity of something.", exampleSentence: "There is a growing abundance of data." },
      { term: "boom", meaning: "patlama, hızlı büyüme", partOfSpeech: "n", definition: "A period of sudden growth.", exampleSentence: "AI is enjoying a boom in its capabilities." },
      { term: "capability", meaning: "yetenek, kapasite", partOfSpeech: "n", definition: "The ability to do something.", exampleSentence: "AI's capabilities are growing quickly." },
      { term: "in the long run", meaning: "uzun vadede", partOfSpeech: "phr", definition: "Over a long period of time.", exampleSentence: "In the long run, machines may not need humans." },
      { term: "master", meaning: "efendi, hakim", partOfSpeech: "n", definition: "A person who has control over something.", exampleSentence: "We may still be the masters of the machines." },
      { term: "intricate", meaning: "karmaşık", partOfSpeech: "adj", definition: "Very complicated or detailed.", exampleSentence: "Some tasks are still intricate for machines." },
    ],
    vocabularySource: "uygulama",
    questions: [
      {
        id: 1,
        question: "It is mentioned in the paragraph that artificial intelligence -------.",
        options: [
          "A) needs to be enhanced to meet the needs of our modern life",
          "B) dates back to the emergence of computers",
          "C) has made our life much more complicated than it should have",
          "D) will become mainstream in the short run thanks to the spread of computers",
          "E) should not be regarded as threat to humanity"
        ],
        answer: "C"
      },
      {
        id: 2,
        question: "We can understand from the passage that for a machine -----.",
        options: [
          "A) performing intricate tasks is still challenging",
          "B) humans have become a nuisance and obstacle",
          "C) there is no need for a human to create other machines anymore",
          "D) to be considered as intelligent, it has to be used in the industry",
          "E) artificial intelligence is of crucial importance so that it can perform smart applications"
        ],
        answer: "A"
      },
      {
        id: 3,
        question: "As we learn from the passage one of the concerns stated by the writer is that ------.",
        options: [
          "A) one day the industry and the banking system may fail",
          "B) most smart devices may become redundant in the near future",
          "C) machines could create other machines without the help of humans",
          "D) humans will become the masters of the planet thanks to AI technology",
          "E) machines equipped with AI may take over the jobs run by humans"
        ],
        answer: "C"
      },
      {
        id: 4,
        question: "The best title for the passage could be -----",
        options: [
          "A) The rising power of artificial intelligence",
          "B) Humans versus machines",
          "C) What is artificial intelligence?",
          "D) How to get along with AI",
          "E) Steps to be taken against AI"
        ],
        answer: "A"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'ordinary' is closest in meaning to ----.",
        options: ["A) usual", "B) intelligent", "C) intricate"],
        answer: "A"
      },
      {
        id: 2,
        question: "'reliant on' is closest in meaning to ----.",
        options: ["A) dependent on", "B) opposed to", "C) aware of"],
        answer: "A"
      },
      {
        id: 3,
        question: "'persist' is closest in meaning to ----.",
        options: ["A) continue", "B) stop", "C) fail"],
        answer: "A"
      },
      {
        id: 4,
        question: "'abundance' is the antonym of the word ----.",
        options: ["A) shortage", "B) power", "C) boom"],
        answer: "A"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 92,
    title: "Bitcoin: The Cryptocurrency Frenzy",
    cefr: "C1",
    theme: "Reading Comprehension (YDS)",
    paragraphs: [
      "Of all the existing cryptocurrencies, Bitcoin has become the frenzy in international markets. But what it is and how it works have yet to be thoroughly recognized by the public. Bitcoin is a new currency that was created in 2009 by an unknown person using the alias Satoshi Nakamoto. Unlike traditional money we use, Bitcoin is not backed by any physical asset, nor is it regulated by any government. Apart from supply and demand, in trade there is another main issue: trust. That is what Bitcoin lacks at the moment. Names of buyers and sellers are never revealed – only their wallet IDs. While that keeps bitcoin users' transactions private, it also lets them buy or sell anything without being traced easily. That's why it has become the currency of choice for people buying drugs online or those engaged in other illicit activities. Transactions are made with no intermediaries, which lets buyers and sellers trade directly. Bitcoin can be used to book hotels, shop for furniture and buy Xbox games. As of 2017, the price of Bitcoin skyrocketed into the thousands. No one knows what will become of Bitcoin. It is mostly unregulated, but some countries like Japan, China and Australia have begun weighing regulations as they are concerned about taxation and their lack of control over the currency. In the meantime, they are not the only ones apprehensive of the Bitcoin."
    ],
    vocabulary: [
      { term: "cryptocurrency", meaning: "kripto para", partOfSpeech: "n", definition: "A digital currency that uses encryption.", exampleSentence: "Bitcoin is the most famous cryptocurrency." },
      { term: "frenzy", meaning: "çılgınlık, cinnet", partOfSpeech: "n", definition: "A state of wild excitement.", exampleSentence: "Bitcoin has become a frenzy in markets." },
      { term: "thoroughly", meaning: "tamamen, iyice", partOfSpeech: "adv", definition: "Completely and carefully.", exampleSentence: "It is not thoroughly recognized by the public." },
      { term: "alias", meaning: "takma ad", partOfSpeech: "n", definition: "A false name used to hide identity.", exampleSentence: "He used the alias Satoshi Nakamoto." },
      { term: "asset", meaning: "varlık, kıymet", partOfSpeech: "n", definition: "Something valuable that is owned.", exampleSentence: "Bitcoin is not backed by any physical asset." },
      { term: "regulate", meaning: "düzenlemek, denetlemek", partOfSpeech: "v", definition: "To control something with rules.", exampleSentence: "It is not regulated by any government." },
      { term: "supply and demand", meaning: "arz ve talep", partOfSpeech: "n", definition: "The amount available and the amount wanted.", exampleSentence: "Its value depends on supply and demand." },
      { term: "reveal", meaning: "açığa çıkarmak, ifşa etmek", partOfSpeech: "v", definition: "To make something known.", exampleSentence: "Names are never revealed." },
      { term: "trace", meaning: "izini sürmek", partOfSpeech: "v", definition: "To find or follow something.", exampleSentence: "Users can trade without being traced easily." },
      { term: "illicit", meaning: "yasadışı", partOfSpeech: "adj", definition: "Not allowed by law.", exampleSentence: "It is used for illicit activities." },
      { term: "intermediary", meaning: "aracı", partOfSpeech: "n", definition: "A person or thing that acts between two others.", exampleSentence: "Transactions are made with no intermediaries." },
      { term: "skyrocket", meaning: "fırlamak, hızla yükselmek", partOfSpeech: "v", definition: "To rise very quickly and suddenly.", exampleSentence: "The price of Bitcoin skyrocketed in 2017." },
      { term: "apprehensive", meaning: "endişeli, kaygılı", partOfSpeech: "adj", definition: "Worried that something bad may happen.", exampleSentence: "Many are apprehensive of the Bitcoin." },
      { term: "volatile", meaning: "oynak, istikrarsız", partOfSpeech: "adj", definition: "Likely to change suddenly.", exampleSentence: "Bitcoin's value is very volatile." },
    ],
    vocabularySource: "uygulama",
    questions: [
      {
        id: 1,
        question: "The writers asserts that Bitcoin ------.",
        options: [
          "A) has not become a medium of exchange in trade yet",
          "B) has not become a complete trustworthy asset so far",
          "C) is being used in banking transaction in markets alone",
          "D) is mainly used by illicit third-parties such as drug dealers",
          "E) has already replaced conventional money as we know"
        ],
        answer: "B"
      },
      {
        id: 2,
        question: "As we learn from the passage, one of the things that remains unknown is -------.",
        options: [
          "A) what Bitcoin's current market value is",
          "B) how exchangeable Bitcoin is",
          "C) whether Bitcoin will hit another record this year",
          "D) what cryptocurrencies actually are",
          "E) by whom Bitcoin was developed"
        ],
        answer: "E"
      },
      {
        id: 3,
        question: "Which one of the following statements is not true about the Bitcoin ?",
        options: [
          "A) Though there is a huge interest in the Bitcoin, many people still find the Bitcoin hard to comprehend.",
          "B) Satoshi Nakamoto is a cover name that is used to conceal the true identity of its creator.",
          "C) In a Bitcoin transaction, the buyers and sellers are in favour of names rather than wallet IDs.",
          "D) The privacy of Bitcoin makes it appealing for illegal sales and purchases.",
          "E) When using Bitcoin in trade, there is only the buyer and seller and nobody else in between."
        ],
        answer: "C"
      },
      {
        id: 4,
        question: "According to the passage,, -------.",
        options: [
          "A) Bitcoin has been a challenge to governments",
          "B) the value of Bitcoin is volatile due to its speculative nature",
          "C) the more intricate Bitcoin is, the more appealing it becomes for investors",
          "D) the range of products that Bitcoins can buy is still limited to few items",
          "E) Bitcoin still lacks credibility as it reached it limits in 2017"
        ],
        answer: "A"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'illicit' is closest in meaning to ----.",
        options: ["A) illegal", "B) private", "C) traditional"],
        answer: "A"
      },
      {
        id: 2,
        question: "'skyrocket' is closest in meaning to ----.",
        options: ["A) rise sharply", "B) fall slowly", "C) stay the same"],
        answer: "A"
      },
      {
        id: 3,
        question: "'apprehensive' is closest in meaning to ----.",
        options: ["A) worried", "B) excited", "C) certain"],
        answer: "A"
      },
      {
        id: 4,
        question: "'reveal' is the antonym of the word ----.",
        options: ["A) conceal", "B) trace", "C) regulate"],
        answer: "A"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 93,
    title: "The Diesel Engine and Its Inventor",
    cefr: "C1",
    theme: "Reading Comprehension (YDS)",
    paragraphs: [
      "Once deemed too sluggish for passenger cars, today diesel powers high-speed vehicles with efficiency. At the time when Rudolph Diesel, the inventor of the diesel engine, introduced the first diesel engine, it was merely used in the industry. While Diesel appreciated the significance of his achievement, his hopes for the new diesel engine were actually modest. He thought it may be of use to small businesses and craftsmen alone to compete with larger manufacturers. He could never have imagined how significant the diesel engine would soon become to the automotive world. But even in its early days, diesel became a mainstay of the industrial revolution as it was used in trains, power stations, factories and ships. As the post World War II austerity required more fuel efficient engines in Europe, diesel became preferable for car manufacturers in the 1950s and 1960s, as they woke up to the greater efficiency and longevity of the diesel engine. Unfortunately, Rudolf Diesel was not able to see what his invention caused as he disappeared mysteriously on a ship voyage in September 29, 1913. There are some theories as to the death of Diesel, one of which is suicide - most likely one. Some conspiracy theories, on the other hand, suggest homicide based on military interest in his works."
    ],
    vocabulary: [
      { term: "deem", meaning: "saymak, kabul etmek", partOfSpeech: "v", definition: "To consider or judge something in a certain way.", exampleSentence: "It was once deemed too slow for cars." },
      { term: "sluggish", meaning: "yavaş, ağır", partOfSpeech: "adj", definition: "Moving or working slowly.", exampleSentence: "Diesel was thought too sluggish for cars." },
      { term: "efficiency", meaning: "verimlilik", partOfSpeech: "n", definition: "Working well without wasting energy.", exampleSentence: "Diesel powers vehicles with efficiency." },
      { term: "merely", meaning: "sadece, yalnızca", partOfSpeech: "adv", definition: "Only; nothing more than.", exampleSentence: "It was merely used in the industry at first." },
      { term: "appreciate", meaning: "takdir etmek, değerini bilmek", partOfSpeech: "v", definition: "To understand the value of something.", exampleSentence: "Diesel appreciated the significance of his work." },
      { term: "significance", meaning: "önem", partOfSpeech: "n", definition: "The importance of something.", exampleSentence: "He appreciated its significance." },
      { term: "modest", meaning: "mütevazı, iddiasız", partOfSpeech: "adj", definition: "Not large; humble.", exampleSentence: "His hopes for the engine were modest." },
      { term: "craftsman", meaning: "zanaatkar, usta", partOfSpeech: "n", definition: "A skilled worker who makes things by hand.", exampleSentence: "He thought it would help small craftsmen." },
      { term: "mainstay", meaning: "dayanak, temel unsur", partOfSpeech: "n", definition: "The most important part of something.", exampleSentence: "Diesel became a mainstay of the industrial revolution." },
      { term: "austerity", meaning: "kemer sıkma, tutumluluk", partOfSpeech: "n", definition: "A situation of reduced spending, often after hard times.", exampleSentence: "Post-war austerity required fuel-efficient engines." },
      { term: "longevity", meaning: "uzun ömürlülük, dayanıklılık", partOfSpeech: "n", definition: "Long life or long duration.", exampleSentence: "They valued the engine's longevity." },
      { term: "disappear", meaning: "kaybolmak", partOfSpeech: "v", definition: "To stop being seen; to vanish.", exampleSentence: "He disappeared mysteriously on a voyage." },
      { term: "conspiracy theory", meaning: "komplo teorisi", partOfSpeech: "n", definition: "A belief that events are secretly plotted.", exampleSentence: "Some conspiracy theories suggest homicide." },
      { term: "homicide", meaning: "cinayet", partOfSpeech: "n", definition: "The killing of one person by another.", exampleSentence: "Some theories suggest homicide." },
    ],
    vocabularySource: "uygulama",
    questions: [
      {
        id: 1,
        question: "It has been suggested in the passage that in the early days of the diesel engine, the new invention ------.",
        options: [
          "A) was used widely in a great variety of fields",
          "B) was nothing more than a frustration",
          "C) was realized by small manufactures but not by large ones",
          "D) led to conspiracies and technological espionage",
          "E) was thought to be inefficient enough for passenger cars"
        ],
        answer: "C"
      },
      {
        id: 2,
        question: "According to the passage, diesel engines were preferable in Europe partly because -------.",
        options: [
          "A) these engines proved to be far efficient than others only in trains and factories",
          "B) they were much easier to install on passenger cars",
          "C) war conditions required far faster vehicles on the battle field",
          "D) they consumed almost the same amount of fuel than those running on gasoline",
          "E) car manufacturers realized its efficiency and durability"
        ],
        answer: "E"
      },
      {
        id: 3,
        question: "We learn from the passage that Rudolf Diesel ----",
        options: [
          "A) transformed the passenger car industry with his contributions to gasoline engines",
          "B) did not expect his invention to make such an impact",
          "C) was the founder of the car manufacture industry in Europe",
          "D) worked hard to work on a diesel engine that could be used by larger manufacturers",
          "E) believed that diesel engines should not be used by businesses and craftsmen"
        ],
        answer: "B"
      },
      {
        id: 4,
        question: "We can learn from the passage that -------.",
        options: [
          "A) the death of Rudolf Diesel is mainly related with his military deals",
          "B) car manufacturers in the 1950s and 1960s were unable to foresee the fruits of the diesel engines",
          "C) Rudolf Diesel had the chance to witness what his invention brought about",
          "D) there is still uncertainty as to whom actually embraced diesel engines for passenger cars",
          "E) how Rudolf Diesel actually died is nothing but a mystery"
        ],
        answer: "E"
      },
      {
        id: 5,
        question: "The passage is mainly about -----.",
        options: [
          "A) The life and death of Rudolph Diesel",
          "B) What is a diesel engine?",
          "C) A concise history of the diesel engine and Its Inventor",
          "D) How Rudolph Diesel developed his invention",
          "E) The conspiracy behind the death of Rudolph Diesel"
        ],
        answer: "C"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'sluggish' is closest in meaning to ----.",
        options: ["A) slow", "B) fast", "C) modest"],
        answer: "A"
      },
      {
        id: 2,
        question: "'merely' is closest in meaning to ----.",
        options: ["A) only", "B) widely", "C) hardly"],
        answer: "A"
      },
      {
        id: 3,
        question: "'modest' is closest in meaning to ----.",
        options: ["A) humble", "B) huge", "C) efficient"],
        answer: "A"
      },
      {
        id: 4,
        question: "'appreciate' is closest in meaning to ----.",
        options: ["A) value", "B) ignore", "C) deem"],
        answer: "A"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 94,
    title: "Lawns: A Symbol of Wealth",
    cefr: "C1",
    theme: "Reading Comprehension (YDS)",
    paragraphs: [
      "\"Keep off the grass\": a warning you would see all around the globe. Growing grass requires a lot of water, fertilisers and manpower. For instance, approximately 80% of all homes in the United States have grass where lawns use more water than is used to grow all crops in the United States. But if you cannot graze animals on it and gives us no grain, why are lawns are so important? Because they simply indicate wealth. The larger your lawn field is, the wealthier you are it means. The very first lawns were grassy fields that surrounded English and French castles. Castle grounds had to be kept clear of trees so that the soldiers protecting them had a clear view of their surroundings. By the late 17th century, grass lawns, with the grass cut close to the ground, started popping up on the grounds of the wealthy, such as at the famed Versailles gardens in France. This practice quickly spread among the elite and turns out, the lawn as a status symbol has its origins in European aristocracy. Without trees, grasses sprouted naturally just like they do in fields and clearings today. Unlike modern days, in a village farmers were able to graze their livestock on lawns in the past. As the sheep and cows \"mowed\" the lawn, they also left behind fertiliser, ensuring the grass would keep growing."
    ],
    vocabulary: [
      { term: "lawn", meaning: "çim, çimenlik", partOfSpeech: "n", definition: "An area of short grass in a garden or park.", exampleSentence: "American homes often have a lawn." },
      { term: "fertiliser", meaning: "gübre", partOfSpeech: "n", definition: "A substance added to soil to help plants grow.", exampleSentence: "Growing grass requires fertilisers." },
      { term: "manpower", meaning: "insan gücü, işgücü", partOfSpeech: "n", definition: "The workers needed for a job.", exampleSentence: "Grass needs water and manpower." },
      { term: "graze", meaning: "otlatmak, otlamak", partOfSpeech: "v", definition: "(Of animals) to eat grass in a field.", exampleSentence: "You cannot graze animals on a lawn." },
      { term: "grain", meaning: "tahıl", partOfSpeech: "n", definition: "The seeds of food plants such as wheat.", exampleSentence: "A lawn gives us no grain." },
      { term: "indicate", meaning: "göstermek, işaret etmek", partOfSpeech: "v", definition: "To show or point to something.", exampleSentence: "Lawns simply indicate wealth." },
      { term: "surround", meaning: "çevrelemek", partOfSpeech: "v", definition: "To be all around something.", exampleSentence: "Lawns surrounded English castles." },
      { term: "elite", meaning: "seçkinler, elit", partOfSpeech: "n", definition: "The richest or most powerful people.", exampleSentence: "The practice spread among the elite." },
      { term: "status symbol", meaning: "statü sembolü", partOfSpeech: "n", definition: "A possession that shows a person's high rank.", exampleSentence: "The lawn is a status symbol." },
      { term: "aristocracy", meaning: "aristokrasi, soylu sınıf", partOfSpeech: "n", definition: "The people of the highest social class.", exampleSentence: "It has origins in European aristocracy." },
      { term: "sprout", meaning: "filizlenmek, bitmek", partOfSpeech: "v", definition: "To begin to grow.", exampleSentence: "Grasses sprouted naturally without trees." },
      { term: "livestock", meaning: "çiftlik hayvanları", partOfSpeech: "n", definition: "Animals kept on a farm.", exampleSentence: "Farmers grazed their livestock on lawns." },
      { term: "mow", meaning: "biçmek", partOfSpeech: "v", definition: "To cut grass.", exampleSentence: "Cows 'mowed' the lawn as they ate." },
      { term: "pragmatic", meaning: "pragmatik, faydacı", partOfSpeech: "adj", definition: "Dealing with things in a practical way.", exampleSentence: "The farmers' attitude was pragmatic." },
    ],
    vocabularySource: "uygulama",
    questions: [
      {
        id: 1,
        question: "We learn from the paragraph that lawns are plants that ------.",
        options: [
          "A) shaped the design of ancient castles in Europe",
          "B) require extreme effort to plant as they need much available land",
          "C) weren't seen around until the ones in Versailles caught on",
          "D) could make one wealthier than he is",
          "E) still have no value in any field"
        ],
        answer: "A"
      },
      {
        id: 2,
        question: "According to the passage, apart from being a way of showing off, -------.",
        options: [
          "A) lawns still provide grazing lands for villagers in France",
          "B) lawns are vital for trees to flourish in an open field",
          "C) grass makes the soil more resilient against floods",
          "D) grassy fields were used for better surveillance around castles in the past",
          "E) grass make soil become more fertile and wet"
        ],
        answer: "D"
      },
      {
        id: 3,
        question: "Which one of the following can be inferred from the passage?",
        options: [
          "A) By water consumption, grass is the United States' leading \"plant\" by far",
          "B) Lawn fields were already common among the royalty before they appeared around the Versailles gardens",
          "C) Rather than organic lawns, we have to turn to synthetic ones to save water",
          "D) France is second to the US in terms of planting lawns in households",
          "E) The sheep and cows had to be kept away from grassy fields to keep the lawns growing"
        ],
        answer: "A"
      },
      {
        id: 4,
        question: "The village farmers' attitude towards growing lawns sounds -----.",
        options: [
          "A) hesitant",
          "B) satirical",
          "C) indifferent",
          "D) negligent",
          "E) pragmatic"
        ],
        answer: "E"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'graze' is related to ----.",
        options: ["A) animals eating grass", "B) cutting down trees", "C) building castles"],
        answer: "A"
      },
      {
        id: 2,
        question: "'indicate' is closest in meaning to ----.",
        options: ["A) show", "B) hide", "C) require"],
        answer: "A"
      },
      {
        id: 3,
        question: "'elite' is closest in meaning to ----.",
        options: ["A) the wealthy few", "B) ordinary people", "C) farmers"],
        answer: "A"
      },
      {
        id: 4,
        question: "'pragmatic' is closest in meaning to ----.",
        options: ["A) practical", "B) hesitant", "C) careless"],
        answer: "A"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 95,
    title: "Hidden Societies of the Amazon",
    cefr: "C1",
    theme: "Reading Comprehension (YDS)",
    paragraphs: [
      "Satellite images of the upper Amazon Basin in Brazil taken since 1999 have revealed hundreds of circles, squares, and other geometric shapes once hidden by the Amazon rain forests. They hint at a previously unknown ancient society that flourished in the Amazon. Now researchers estimate that nearly ten times as many such structures, of unknown purpose, may exist undetected under the Amazon forest cover. The discovery adds to evidence that the hinterlands of the Amazon once teemed with complex societies, which were largely wiped out by diseases brought to South America by European colonists in the 15 and 16th centuries. Since these vanished societies had gone unrecorded, earlier research had suggested that soils in the upper Amazon were too poor to support the extensive agriculture needed for such large, permanent settlements. The researchers say \"We found that this view is wrong, and there is a lot more to discover in these places\"."
    ],
    vocabulary: [
      { term: "satellite image", meaning: "uydu görüntüsü", partOfSpeech: "n", definition: "A picture of the Earth taken from a satellite.", exampleSentence: "Satellite images revealed hidden shapes." },
      { term: "reveal", meaning: "ortaya çıkarmak", partOfSpeech: "v", definition: "To make something known or visible.", exampleSentence: "The images revealed geometric shapes." },
      { term: "geometric", meaning: "geometrik", partOfSpeech: "adj", definition: "Having regular shapes such as circles or squares.", exampleSentence: "They found circles and other geometric shapes." },
      { term: "hint at", meaning: "-e işaret etmek, ima etmek", partOfSpeech: "v", definition: "To suggest something indirectly.", exampleSentence: "They hint at a previously unknown society." },
      { term: "flourish", meaning: "gelişmek, serpilmek", partOfSpeech: "v", definition: "To grow or develop successfully.", exampleSentence: "An ancient society flourished in the Amazon." },
      { term: "estimate", meaning: "tahmin etmek", partOfSpeech: "v", definition: "To make an approximate judgement.", exampleSentence: "Researchers estimate many more structures exist." },
      { term: "undetected", meaning: "fark edilmemiş", partOfSpeech: "adj", definition: "Not noticed or discovered.", exampleSentence: "Many structures may exist undetected." },
      { term: "hinterland", meaning: "iç bölge, arka bölge", partOfSpeech: "n", definition: "The remote area away from the coast or a city.", exampleSentence: "The hinterlands of the Amazon teemed with life." },
      { term: "teem with", meaning: "dolup taşmak, kaynamak", partOfSpeech: "v", definition: "To be full of something.", exampleSentence: "The area once teemed with complex societies." },
      { term: "wipe out", meaning: "yok etmek", partOfSpeech: "v", definition: "To destroy something completely.", exampleSentence: "They were wiped out by diseases." },
      { term: "colonist", meaning: "sömürgeci, koloni kuran", partOfSpeech: "n", definition: "A person who settles in a new colony.", exampleSentence: "European colonists brought new diseases." },
      { term: "vanished", meaning: "yok olmuş, kaybolmuş", partOfSpeech: "adj", definition: "No longer existing.", exampleSentence: "These vanished societies went unrecorded." },
      { term: "extensive", meaning: "geniş çaplı, kapsamlı", partOfSpeech: "adj", definition: "Covering a large area or amount.", exampleSentence: "The soils could not support extensive agriculture." },
      { term: "permanent settlement", meaning: "kalıcı yerleşim", partOfSpeech: "n", definition: "A place where people live for a long time.", exampleSentence: "Large permanent settlements existed there." },
    ],
    vocabularySource: "uygulama",
    questions: [
      {
        id: 1,
        question: "According to the passage, the new discovery -----.",
        options: [
          "A) has strengthened the already known facts about the upper Amazon Basin",
          "B) is too poor to become an evidence for the ancient Amazon society",
          "C) has proved that the satellite pictures were misleading",
          "D) has falsified the previous assumptions about the land",
          "E) indicates the fact that the upper Amazon Basin was made of geometric shapes"
        ],
        answer: "C"
      },
      {
        id: 2,
        question: "From the passage, we can infer that ----.",
        options: [
          "A) pictures taken by satellites can provide scientists with valuable new data",
          "B) there is no longer any reason to further investigate the upper Amazon Basin",
          "C) the ancient Amazon people were in close contact with the outer world",
          "D) researchers can learn a lot from the written historical data relating to the region",
          "E) the geometric shapes should not be taken too seriously"
        ],
        answer: "A"
      },
      {
        id: 3,
        question: "It can be inferred from the passage that the ancient Amazon people ----.",
        options: [
          "A) killed large numbers of would-be colonists",
          "B) had no resistance to new diseases",
          "C) hid themselves in the Amazon rain forest",
          "D) led a plain life and lived as separate tribes",
          "E) are the ancestors of the present-day inhabitants of the region"
        ],
        answer: "B"
      },
      {
        id: 4,
        question: "As can be understood from the passage, the researchers now tend to think that ----.",
        options: [
          "A) they have revealed almost everything about the region",
          "B) the natives had no idea about agriculture",
          "C) the colonists helped the natives become civilized",
          "D) the geometric shapes reveal something about the new industrial areas",
          "E) the land might have once been inhabited densely"
        ],
        answer: "E"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'reveal' is closest in meaning to ----.",
        options: ["A) uncover", "B) hide", "C) estimate"],
        answer: "A"
      },
      {
        id: 2,
        question: "'flourish' is closest in meaning to ----.",
        options: ["A) thrive", "B) vanish", "C) reveal"],
        answer: "A"
      },
      {
        id: 3,
        question: "'wipe out' is closest in meaning to ----.",
        options: ["A) destroy", "B) create", "C) detect"],
        answer: "A"
      },
      {
        id: 4,
        question: "'undetected' is the antonym of the word ----.",
        options: ["A) noticed", "B) hidden", "C) ancient"],
        answer: "A"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 96,
    title: "The Barcode and the QR Code",
    cefr: "C1",
    theme: "Reading Comprehension (YDS)",
    paragraphs: [
      "The omnipresent \"Barcode\" is everywhere, but it seems that its reign is coming to an end. As retailers and manufacturers need more information than basic storage and logistics information, the new QR code is gradually replacing the barcode. The first use of the barcode was to label railroad cars, but they were not commercially successful until they were used to automate supermarket checkout systems, by which they have become almost universal. The very first scanning of the now ubiquitous barcode was on a pack of Wrigley Company chewing gum in June 1974. On the other hand, while the concept of QR codes is not very old compared to the barcode, it has gained considerable steam in the past few years in the mobile and print world. When the QR Code was established, it presented a greater potential to carry information in a smaller space. Compared to a barcode, it's no competition at all. People are just now waking up to the possibilities of the QR Code, and are aware of how awesome it is. The QR code, similar to a barcode, is an example of an information matrix. However, a significant difference in the two is that while a barcode only holds information nicely in the horizontal direction, a QR can do so vertically as well."
    ],
    vocabulary: [
      { term: "omnipresent", meaning: "her yerde bulunan", partOfSpeech: "adj", definition: "Present everywhere.", exampleSentence: "The omnipresent barcode is everywhere." },
      { term: "reign", meaning: "hüküm sürme, hakimiyet", partOfSpeech: "n", definition: "A period of rule or dominance.", exampleSentence: "Its reign is coming to an end." },
      { term: "retailer", meaning: "perakendeci", partOfSpeech: "n", definition: "A business that sells goods to the public.", exampleSentence: "Retailers need more information." },
      { term: "manufacturer", meaning: "üretici, imalatçı", partOfSpeech: "n", definition: "A company that makes goods.", exampleSentence: "Manufacturers need more than basic data." },
      { term: "logistics", meaning: "lojistik", partOfSpeech: "n", definition: "The organisation of moving and storing goods.", exampleSentence: "They need storage and logistics information." },
      { term: "automate", meaning: "otomatikleştirmek", partOfSpeech: "v", definition: "To make a process work by machines.", exampleSentence: "Barcodes automate supermarket checkouts." },
      { term: "universal", meaning: "evrensel, her yerde geçerli", partOfSpeech: "adj", definition: "Used or accepted everywhere.", exampleSentence: "Barcodes have become almost universal." },
      { term: "ubiquitous", meaning: "her yerde bulunan", partOfSpeech: "adj", definition: "Seeming to be everywhere.", exampleSentence: "The ubiquitous barcode is on every product." },
      { term: "gain steam", meaning: "hız kazanmak, güçlenmek", partOfSpeech: "v", definition: "To become more popular or powerful.", exampleSentence: "QR codes have gained considerable steam." },
      { term: "potential", meaning: "potansiyel, olanak", partOfSpeech: "n", definition: "The possibility to develop or achieve something.", exampleSentence: "The QR code has greater potential." },
      { term: "matrix", meaning: "matris, kalıp", partOfSpeech: "n", definition: "A pattern of rows and columns.", exampleSentence: "A QR code is an information matrix." },
      { term: "significant", meaning: "önemli, kayda değer", partOfSpeech: "adj", definition: "Large or important enough to notice.", exampleSentence: "There is a significant difference between them." },
      { term: "horizontal", meaning: "yatay", partOfSpeech: "adj", definition: "Going from side to side, level.", exampleSentence: "A barcode holds information horizontally." },
      { term: "vertical", meaning: "dikey", partOfSpeech: "adj", definition: "Going straight up and down.", exampleSentence: "A QR code works vertically as well." },
    ],
    vocabularySource: "uygulama",
    questions: [
      {
        id: 1,
        question: "It is mentioned in the paragraph that one reason why the QR code is preferable is that -----.",
        options: [
          "A) it can store information in a minute space compared to the barcode",
          "B) you don't necessarily have to use them in supermarket chains",
          "C) it can merely provide information horizontally",
          "D) it has become universal, while the barcode has not",
          "E) it lowers production costs for any item, good or service"
        ],
        answer: "A"
      },
      {
        id: 2,
        question: "According to the writer, ---------.",
        options: [
          "A) manufacturers should cease to print barcodes on their products",
          "B) there are more similarities than differences between the QR and the barcode",
          "C) the barcode is no match to the QR code and they are incomparable",
          "D) there are limits to the use of the QR code in some products",
          "E) it may take some time until the QR code completely replaces the barcode"
        ],
        answer: "E"
      },
      {
        id: 3,
        question: "It is stated in the passage that the barcode ------.",
        options: [
          "A) can be provided with more flexibility if it is designed as the QR code",
          "B) owed its success to its use in supermarket checkout systems",
          "C) met its own demise when it was printed on a pack of chewing gum in June 1974",
          "D) overshadows the QR code in terms of both resilience and dependability",
          "E) is far easier for retailers and buyers to decode than the QR code"
        ],
        answer: "B"
      },
      {
        id: 4,
        question: "The writer emphasizes that ------.",
        options: [
          "A) a barcode should be designed to hold information both horizontally and vertically",
          "B) the concept of QR code will hardly catch on due to its rigidity",
          "C) two coding systems bear identical features rather than differences",
          "D) it would be wise to rely on the ubiquitous barcode",
          "E) people have been late to realize the potential in the QR code"
        ],
        answer: "E"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'omnipresent' is closest in meaning to ----.",
        options: ["A) everywhere", "B) rare", "C) old"],
        answer: "A"
      },
      {
        id: 2,
        question: "'universal' is closest in meaning to ----.",
        options: ["A) widespread", "B) limited", "C) vertical"],
        answer: "A"
      },
      {
        id: 3,
        question: "'significant' is closest in meaning to ----.",
        options: ["A) important", "B) tiny", "C) similar"],
        answer: "A"
      },
      {
        id: 4,
        question: "'horizontal' is the antonym of the word ----.",
        options: ["A) vertical", "B) universal", "C) basic"],
        answer: "A"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 97,
    title: "Charles Goodyear and Vulcanized Rubber",
    cefr: "C1",
    theme: "Reading Comprehension (YDS)",
    paragraphs: [
      "The tires seen on millions of cars across the world are the result of multiple inventors working across several decades. And those inventors have names that should be recognizable to anyone who's ever bought tires for their car: Michelin, Goodyear, and Dunlop. Of these, however, none had greater impact on the invention of the rubber pneumatic tires than Charles Goodyear, who discovered the process of strengthening rubber, known as vulcanization or curing, in 1839, nearly more than 50 years before the first rubber tires would appear on cars and so patented a process known as vulcanization. He had actually been experimenting with rubber since 1830 but had been unable to develop a suitable curing process, yet during an experiment with a mixture of rubber and sulfur, Goodyear dropped the mixture on a hot stove accidentally. Then, a chemical reaction took place and, instead of melting, the rubber-sulfur mixture formed a hard lump, which is called vulcanization. He continued his experiments until he could treat continuous sheets of rubber. This process involved heating and removing the sulfur from rubber, thus making the rubber waterproof and winter-proof and allowing it to retain its elasticity. While Goodyear's claim to have invented vulcanization was challenged, he is considered as the father of vulcanized rubber tires. And that became largely important once people realized it would be perfect for making tires."
    ],
    vocabulary: [
      { term: "tire", meaning: "lastik", partOfSpeech: "n", definition: "A rubber ring that fits around a wheel.", exampleSentence: "The tires on cars result from many inventors." },
      { term: "pneumatic", meaning: "havalı, pnömatik", partOfSpeech: "adj", definition: "Filled with or worked by air.", exampleSentence: "Goodyear helped invent rubber pneumatic tires." },
      { term: "impact", meaning: "etki", partOfSpeech: "n", definition: "A powerful effect.", exampleSentence: "No one had a greater impact than Goodyear." },
      { term: "vulcanization", meaning: "vulkanizasyon", partOfSpeech: "n", definition: "A process that makes rubber stronger.", exampleSentence: "He discovered the process of vulcanization." },
      { term: "curing", meaning: "sertleştirme, kürleme", partOfSpeech: "n", definition: "A process of treating rubber to strengthen it.", exampleSentence: "Vulcanization is also known as curing." },
      { term: "patent", meaning: "patent almak", partOfSpeech: "v", definition: "To get the official right to an invention.", exampleSentence: "He patented the process of vulcanization." },
      { term: "experiment", meaning: "deney yapmak", partOfSpeech: "v", definition: "To do a scientific test.", exampleSentence: "He had been experimenting with rubber since 1830." },
      { term: "mixture", meaning: "karışım", partOfSpeech: "n", definition: "A combination of different substances.", exampleSentence: "He worked with a mixture of rubber and sulfur." },
      { term: "sulfur", meaning: "kükürt", partOfSpeech: "n", definition: "A yellow chemical element.", exampleSentence: "The mixture contained rubber and sulfur." },
      { term: "accidentally", meaning: "kazara, yanlışlıkla", partOfSpeech: "adv", definition: "By chance; not on purpose.", exampleSentence: "He dropped the mixture on a stove accidentally." },
      { term: "chemical reaction", meaning: "kimyasal tepkime", partOfSpeech: "n", definition: "A process that changes substances.", exampleSentence: "A chemical reaction took place." },
      { term: "waterproof", meaning: "su geçirmez", partOfSpeech: "adj", definition: "Not letting water through.", exampleSentence: "The process made the rubber waterproof." },
      { term: "retain", meaning: "korumak, elde tutmak", partOfSpeech: "v", definition: "To keep something.", exampleSentence: "It allowed the rubber to retain its elasticity." },
      { term: "elasticity", meaning: "esneklik", partOfSpeech: "n", definition: "The ability to stretch and return to shape.", exampleSentence: "The rubber kept its elasticity." },
      { term: "challenge", meaning: "itiraz etmek, meydan okumak", partOfSpeech: "v", definition: "To question whether something is true or right.", exampleSentence: "His claim was challenged by others." },
    ],
    vocabularySource: "uygulama",
    questions: [
      {
        id: 1,
        question: "We learn from the passage that Goodyear -----.",
        options: [
          "A) developed his method of developing tires with several inventors",
          "B) is widely regarded as the sole creator of tires",
          "C) collaborated with Michelin and Dunlop to develop rubber tires",
          "D) is accepted as the first one to come up with the idea of vulcanized rubber tires",
          "E) was inspired by several other inventors such as Michelin and Dunlop"
        ],
        answer: "D"
      },
      {
        id: 2,
        question: "What does the passage mainly focus on?",
        options: [
          "A) How rubber pneumatic tires and the process of vulcanization came into being",
          "B) What makes vulcanization preferable in tire manufacturing",
          "C) The inventors of the first rubber tires and their contributions on the tires",
          "D) Charles Goodyear and his inventions",
          "E) The challenge among inventors over the patent of the vulcanization"
        ],
        answer: "A"
      },
      {
        id: 3,
        question: "What makes Goodyear's invention distinct from other tire inventors?",
        options: [
          "A) it could prevent tires from blowing out in case of an accident",
          "B) it enables the rubber to be waterproof rather than winter-proof",
          "C) when put on a hot stove, the rubber-sulfur mixture melts",
          "D) it was the first one allowing the treatment of continuous sheets of rubber",
          "E) it had a convenient curing process called vulcanization, making the rubber more elastic"
        ],
        answer: "E"
      },
      {
        id: 4,
        question: "We can understand from the passage that -----.",
        options: [
          "A) before Charles Goodyear, the pioneers of the tire technology were seen as Michelin and Dunlop",
          "B) when a mixture of rubber and sulfur is dropped on a stove, it never melts",
          "C) Charles Goodyear was not intentionally working on the vulcanization process when he discovered it",
          "D) the rubber tires Goodyear appeared on cars nearly 50 years before those of other firms",
          "E) Goodyear got the patent of the vulcanization though it was also carried out by Michelin"
        ],
        answer: "C"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'accidentally' is closest in meaning to ----.",
        options: ["A) by chance", "B) on purpose", "C) carefully"],
        answer: "A"
      },
      {
        id: 2,
        question: "'retain' is closest in meaning to ----.",
        options: ["A) keep", "B) lose", "C) melt"],
        answer: "A"
      },
      {
        id: 3,
        question: "'impact' is closest in meaning to ----.",
        options: ["A) effect", "B) mixture", "C) patent"],
        answer: "A"
      },
      {
        id: 4,
        question: "'waterproof' means not letting ---- through.",
        options: ["A) water", "B) air", "C) heat"],
        answer: "A"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 98,
    title: "Satire and Parody",
    cefr: "C1",
    theme: "Reading Comprehension (YDS)",
    paragraphs: [
      "The overall purpose of satire is usually to make some kind of moral or political change in society through the use of critical humor. A satirist will choose a subject or person with whom he finds faults and use humor to make those faults obvious. In theory, many satirists hope that the humor will have a corrective effect, almost like a punishment for bad behavior, but it may not always be as efficient as desired. Since the overall purpose of satire is generally to point out the faults in people, satirists often rely on exaggeration to make a point. For example, a politician who favors heavy taxation might be depicted as a pig stealing people's food from their plates. This sort of exaggeration shows the fault in question and puts a critical spin on it, but only if it's handled correctly, the message should ideally stick with them much longer than the initial entertainment element. The terms \"satire\" and \"parody\" are often confused, but the purpose of satire makes it generally very distinct from parody. When people do a parody of something, they may rely on many of the same techniques that a satirist would use, including exaggeration, but their primary purpose is to make people laugh, without any intension of any real political effect or not."
    ],
    vocabulary: [
      { term: "satire", meaning: "hiciv, taşlama", partOfSpeech: "n", definition: "Humor used to criticise people's faults.", exampleSentence: "The purpose of satire is to bring about change." },
      { term: "satirist", meaning: "hicivci", partOfSpeech: "n", definition: "A person who writes or performs satire.", exampleSentence: "A satirist chooses a subject with faults." },
      { term: "moral", meaning: "ahlaki", partOfSpeech: "adj", definition: "Relating to right and wrong behaviour.", exampleSentence: "Satire aims for moral or political change." },
      { term: "critical", meaning: "eleştirel", partOfSpeech: "adj", definition: "Expressing disapproval or judgement.", exampleSentence: "Satire uses critical humor." },
      { term: "fault", meaning: "kusur, hata", partOfSpeech: "n", definition: "A weakness or bad quality.", exampleSentence: "A satirist finds faults in his subject." },
      { term: "corrective", meaning: "düzeltici", partOfSpeech: "adj", definition: "Intended to put right something wrong.", exampleSentence: "They hope the humor has a corrective effect." },
      { term: "efficient", meaning: "etkili, verimli", partOfSpeech: "adj", definition: "Producing a good result without waste.", exampleSentence: "It may not always be as efficient as desired." },
      { term: "exaggeration", meaning: "abartma", partOfSpeech: "n", definition: "Making something seem larger or worse than it is.", exampleSentence: "Satirists often rely on exaggeration." },
      { term: "depict", meaning: "tasvir etmek, resmetmek", partOfSpeech: "v", definition: "To show or describe something.", exampleSentence: "A politician might be depicted as a pig." },
      { term: "spin", meaning: "yorum, bakış açısı", partOfSpeech: "n", definition: "A particular way of presenting information.", exampleSentence: "It puts a critical spin on the fault." },
      { term: "stick with", meaning: "akılda kalmak", partOfSpeech: "v", definition: "To remain in someone's memory.", exampleSentence: "The message should stick with the audience." },
      { term: "parody", meaning: "parodi, taklit", partOfSpeech: "n", definition: "A funny imitation of something.", exampleSentence: "Satire is distinct from parody." },
      { term: "distinct", meaning: "ayrı, farklı", partOfSpeech: "adj", definition: "Clearly different or separate.", exampleSentence: "Satire is distinct from parody." },
      { term: "primary", meaning: "birincil, asıl", partOfSpeech: "adj", definition: "Main; most important.", exampleSentence: "The primary purpose of parody is to make people laugh." },
      { term: "intention", meaning: "niyet, amaç", partOfSpeech: "n", definition: "A plan or aim.", exampleSentence: "Parody has no intention of political effect." },
    ],
    vocabularySource: "uygulama",
    questions: [
      {
        id: 1,
        question: "According to the passage, what makes a satire and parody distinct is -------.",
        options: [
          "A) their use and magnitude of exaggeration of telling events",
          "B) the range of audience and the effect of humor",
          "C) what they aim on the audience and the society as a consequence",
          "D) that a parody aims to ridicule a politician while a satire does not",
          "E) where and how they are staged, presented or broadcast"
        ],
        answer: "C"
      },
      {
        id: 2,
        question: "It is indicated in the passage that -------.",
        options: [
          "A) a satire may not always lead to a desired result",
          "B) both a parody and satire could be misleading for the general audience",
          "C) political figures are the only ones that are exposed to satirical works of art",
          "D) there is no other intension other than humor in a satire",
          "E) the techniques used in a satire and parody are distinct from each other"
        ],
        answer: "A"
      },
      {
        id: 3,
        question: "We can understand from the passage that ------",
        options: [
          "A) satirical essays are usually regarded as harassment by politicians",
          "B) unless dealt properly, the message in a satire may not last for long",
          "C) the terms \"satire\" and \"parody\" actually stand for the same thing",
          "D) the main motive behind a parody is to exhibit what is wrong in the society",
          "E) exaggeration and elements of humor must be avoided in a satire"
        ],
        answer: "B"
      },
      {
        id: 4,
        question: "The best title for this passage could be ------",
        options: [
          "A) Parody and satire are actually the same thing",
          "B) An overall outlook into a satire",
          "C) How a society can be corrected by literary works",
          "D) The society shapes a satire",
          "E) Techniques used in a satire"
        ],
        answer: "B"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'fault' is closest in meaning to ----.",
        options: ["A) flaw", "B) strength", "C) humor"],
        answer: "A"
      },
      {
        id: 2,
        question: "'exaggeration' is related to ----.",
        options: ["A) making something seem bigger than it is", "B) telling the exact truth", "C) staying silent"],
        answer: "A"
      },
      {
        id: 3,
        question: "'distinct' is closest in meaning to ----.",
        options: ["A) different", "B) identical", "C) confusing"],
        answer: "A"
      },
      {
        id: 4,
        question: "'primary' is closest in meaning to ----.",
        options: ["A) main", "B) minor", "C) final"],
        answer: "A"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 99,
    title: "Sugar: A Bittersweet History",
    cefr: "C1",
    theme: "Reading Comprehension (YDS)",
    paragraphs: [
      "Today sugar leads almost any food seductive and irresistible in taste. But in the past it led to more than that, as it was not as white as it seemed. While sugar would bring wealth and independence to some, it would also bring misery, slavery and wrath to many others. Profit from the sugar trade was so significant that it may have even helped America achieve independence from Great Britain. Sugar, as British colonists called White Gold , was the engine of the slave trade that brought millions of Africans to the Americas in the early 16th-century. Though the Dutch and the Portuguese predated other European colonizers in the slave trade, it was the British and the Spanish that pioneered the affair. The demand for sugar in Europe and Asia reached to such a height that the European colonizers had a hard time compensating for the production due to the lack of labor. As the Spanish had almost wiped out the entire inhabitants of the West Indies and South America, labor had to be imported so as to keep up with the production of commodities such as sugar, tobacco and other crops, not mention gold. For instance, it is impossible to think about sugar production in the West Indies without thinking about slavery. The labor of enslaved Africans was integral to the cultivation of the cane and production of sugar. So, when you add some sugar in your tea, keep the history behind it in your mind. Bon appetite !"
    ],
    vocabulary: [
      { term: "seductive", meaning: "cazip, baştan çıkarıcı", partOfSpeech: "adj", definition: "Very attractive or tempting.", exampleSentence: "Sugar makes food seductive in taste." },
      { term: "irresistible", meaning: "karşı konulmaz", partOfSpeech: "adj", definition: "So attractive that you cannot refuse it.", exampleSentence: "Sugar makes food irresistible." },
      { term: "wealth", meaning: "zenginlik, servet", partOfSpeech: "n", definition: "A large amount of money or possessions.", exampleSentence: "Sugar brought wealth to some people." },
      { term: "misery", meaning: "sefalet, ıstırap", partOfSpeech: "n", definition: "great suffering or unhappiness.", exampleSentence: "It brought misery to many others." },
      { term: "slavery", meaning: "kölelik", partOfSpeech: "n", definition: "The system of owning people as property.", exampleSentence: "Sugar brought slavery to many." },
      { term: "wrath", meaning: "gazap, öfke", partOfSpeech: "n", definition: "Extreme anger.", exampleSentence: "It brought misery and wrath." },
      { term: "profit", meaning: "kâr, kazanç", partOfSpeech: "n", definition: "Money gained from business.", exampleSentence: "Profit from the sugar trade was significant." },
      { term: "colonist", meaning: "sömürgeci", partOfSpeech: "n", definition: "A person who settles in a colony.", exampleSentence: "British colonists called sugar 'White Gold'." },
      { term: "engine", meaning: "itici güç, motor", partOfSpeech: "n", definition: "Something that makes a process work.", exampleSentence: "Sugar was the engine of the slave trade." },
      { term: "predate", meaning: "-den önce gelmek", partOfSpeech: "v", definition: "To exist or happen before something else.", exampleSentence: "The Dutch predated other colonizers in the trade." },
      { term: "pioneer", meaning: "öncülük etmek", partOfSpeech: "v", definition: "To be among the first to do something.", exampleSentence: "The British and Spanish pioneered the affair." },
      { term: "compensate for", meaning: "telafi etmek", partOfSpeech: "v", definition: "To make up for something.", exampleSentence: "They could not compensate for the production." },
      { term: "commodity", meaning: "emtia, ticari mal", partOfSpeech: "n", definition: "A raw material or product that is traded.", exampleSentence: "Sugar and tobacco were valuable commodities." },
      { term: "cultivation", meaning: "yetiştirme, ekim", partOfSpeech: "n", definition: "The growing of crops.", exampleSentence: "African labor was integral to the cultivation of cane." },
      { term: "integral", meaning: "ayrılmaz, temel", partOfSpeech: "adj", definition: "Necessary and essential.", exampleSentence: "Their labor was integral to sugar production." },
    ],
    vocabularySource: "uygulama",
    questions: [
      {
        id: 1,
        question: "We learn from the passage that Sugar ------.",
        options: [
          "A) was the main and the sole commodity imported from the colonies to Europe",
          "B) became a source of conflict between the Spanish and the English",
          "C) brought about both prosperity and misery to people in history",
          "D) is considered as the reason how and why America became independent of slaves",
          "E) did not grow without the expertise of African slaves"
        ],
        answer: "C"
      },
      {
        id: 2,
        question: "We can conclude from the passage that -------.",
        options: [
          "A) if it had not been for the sugar cane production, European slave trade would not have been so extensive",
          "B) the Spanish had nothing to do with the massacre of the inhabitants of the West Indies",
          "C) European colonists were often locked in battle in order to secure their sugar plantations in the West Indies",
          "D) South America was the most suitable place for sugar plantation",
          "E) while Sugar and tobacco were the essential commodities for the colonist Europeans, gold was not"
        ],
        answer: "A"
      },
      {
        id: 3,
        question: "What does the writer mean by the phrase \"it was not as white as it seemed\"?",
        options: [
          "A) Gold and sugar had the identical commercial values.",
          "B) Sugar was by far the most essential ingredient of international trade.",
          "C) It is a challenge to lower ones's resistance to sugar.",
          "D) Sugar also had a dark side in history.",
          "E) The complicated history behind sugar as an ingredient in food and beverages."
        ],
        answer: "D"
      },
      {
        id: 4,
        question: "It is stated in the passage that -----.",
        options: [
          "A) sugar plantation and slavery had no connection whatsoever",
          "B) a collaboration among European slave traders had to be established",
          "C) although the demand for sugar was negligible, the European traders fostered sugar production",
          "D) the British and the Spanish were not the first slave traders",
          "E) the enslaved Africans who were brought to America triggered the continents independence"
        ],
        answer: "D"
      },
      {
        id: 5,
        question: "The tone of the writer can be described as ------.",
        options: [
          "A) apprehensive",
          "B) realistic",
          "C) jubilant",
          "D) indifferent",
          "E) encouraging"
        ],
        answer: "B"
      },
      {
        id: 6,
        question: "The best title for the passage could be -----.",
        options: [
          "A) A brief history of sugar",
          "B) The history of slavery in the West Indies",
          "C) The shameful history of slave trade",
          "D) How slavery emerged as a tool of commerce",
          "E) The connection between sugar and slavery in History"
        ],
        answer: "A"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'wealth' is the antonym of the word ----.",
        options: ["A) poverty", "B) profit", "C) misery"],
        answer: "A"
      },
      {
        id: 2,
        question: "'irresistible' is closest in meaning to ----.",
        options: ["A) tempting", "B) unpleasant", "C) ordinary"],
        answer: "A"
      },
      {
        id: 3,
        question: "'integral' is closest in meaning to ----.",
        options: ["A) essential", "B) optional", "C) minor"],
        answer: "A"
      },
      {
        id: 4,
        question: "'commodity' is closest in meaning to ----.",
        options: ["A) traded good", "B) colony", "C) profit"],
        answer: "A"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  },
  {
    id: 100,
    title: "Tea: A Cup of History",
    cefr: "C1",
    theme: "Reading Comprehension (YDS)",
    paragraphs: [
      "Drinking tea is actually drinking a lot of history. Tea has been one of the most wide-spread beverages around the globe with a very distant past. The British, for example, had a good appetite for tea. Although the earliest custom of drinking tea dates back to the third millennium BC in China, it was not until the mid 17th century that the beverage first appeared in England. Once tea caught on, Britain had to import as much as tea as they could from the world. And this meant they had to pour a fortune into buying tea, which would soon cause various conflicts. For example, in an incident known as the \"Boston Tea party\", the tea growing Americans protested both the tax on tea and the perceived monopoly of Britain over tea and other commodities. This would soon lead to the liberation and foundation of the United States. China was another main source of tea, but China would only accept silver as payment for its tea, due to which the British had to pour an immense amount of silver into China. This would place a toll on the British economy, so they then began to remedy the financial debt by trading opium to China, instead of silver. This opium trade paid for the tea exported from China and soon money was flowing out of China to Britain, which would cause the wars known as \"The Opium Wars\" and the defeat of China. So when you have a cup of tea, remember that you are actually consuming history."
    ],
    vocabulary: [
      { term: "widespread", meaning: "yaygın", partOfSpeech: "adj", definition: "Existing or happening in many places.", exampleSentence: "Tea is one of the most widespread beverages." },
      { term: "beverage", meaning: "içecek", partOfSpeech: "n", definition: "A drink.", exampleSentence: "Tea is a popular beverage worldwide." },
      { term: "distant", meaning: "uzak", partOfSpeech: "adj", definition: "Far away in space or time.", exampleSentence: "Tea has a very distant past." },
      { term: "appetite", meaning: "iştah, düşkünlük", partOfSpeech: "n", definition: "A strong desire for something.", exampleSentence: "The British had a good appetite for tea." },
      { term: "custom", meaning: "gelenek, adet", partOfSpeech: "n", definition: "A traditional way of doing something.", exampleSentence: "The custom of drinking tea dates back to China." },
      { term: "millennium", meaning: "bin yıl", partOfSpeech: "n", definition: "A period of one thousand years.", exampleSentence: "It dates back to the third millennium BC." },
      { term: "catch on", meaning: "tutulmak, yaygınlaşmak", partOfSpeech: "v", definition: "To become popular.", exampleSentence: "Once tea caught on, Britain imported a lot." },
      { term: "import", meaning: "ithal etmek", partOfSpeech: "v", definition: "To bring goods in from another country.", exampleSentence: "Britain had to import a lot of tea." },
      { term: "fortune", meaning: "servet, büyük para", partOfSpeech: "n", definition: "A very large amount of money.", exampleSentence: "They poured a fortune into buying tea." },
      { term: "conflict", meaning: "çatışma, anlaşmazlık", partOfSpeech: "n", definition: "A serious disagreement or fight.", exampleSentence: "This would cause various conflicts." },
      { term: "monopoly", meaning: "tekel", partOfSpeech: "n", definition: "Complete control of a trade by one group.", exampleSentence: "They protested the monopoly of Britain." },
      { term: "liberation", meaning: "kurtuluş, özgürleşme", partOfSpeech: "n", definition: "The act of setting free.", exampleSentence: "This led to the liberation of the United States." },
      { term: "immense", meaning: "muazzam, çok büyük", partOfSpeech: "adj", definition: "Extremely large.", exampleSentence: "The British poured an immense amount of silver." },
      { term: "toll", meaning: "bedel, ağır yük", partOfSpeech: "n", definition: "A serious cost or damage.", exampleSentence: "This placed a toll on the British economy." },
      { term: "remedy", meaning: "gidermek, düzeltmek", partOfSpeech: "v", definition: "To put right a problem.", exampleSentence: "They tried to remedy the financial debt." },
      { term: "opium", meaning: "afyon", partOfSpeech: "n", definition: "A drug made from the poppy plant.", exampleSentence: "They began trading opium to China." },
    ],
    vocabularySource: "uygulama",
    questions: [
      {
        id: 1,
        question: "We learn from the passage that tea ------.",
        options: [
          "A) was heavily taxed by the Americans against the British crown",
          "B) has untied people and nation in a peaceful manner",
          "C) has been a source of remedy and meditation",
          "D) has been both at the centre of pleasure and conflict throughout history",
          "E) was the only conflict between the Americans and the British"
        ],
        answer: "D"
      },
      {
        id: 2,
        question: "It is stated in the passage that due to the immense demand for tea, ------.",
        options: [
          "A) the British had a hard time meeting the demand and funding it",
          "B) people in Britain had turned to opium that was imported from China",
          "C) the Chinese and the British sold it to various parts of the globe",
          "D) the silver coin became the main currency in Britain",
          "E) the Chinese were incapable of supply the demand"
        ],
        answer: "A"
      },
      {
        id: 3,
        question: "Which of the following is not true according to the passage?",
        options: [
          "A) the appearance of tea in Britain took hundreds of years",
          "B) the demand and trade of tea caused various conflicts",
          "C) for the British, opium made up for the silver sent to China",
          "D) opium trade was a source of conflict between Britain and China",
          "E) The Boston Tea party was a reaction to the taxation of the British"
        ],
        answer: "D"
      },
      {
        id: 4,
        question: "The overall aim of the writer is to -------.",
        options: [
          "A) give us a glimpse of the history of tea",
          "B) tell about the causes behind both the opium wars and liberation of the American continent",
          "C) seduce us to appreciate tea as a global beverage",
          "D) present the delicate balance between the supply and demand of a commodity",
          "E) indicate the relation between silver and tea throughout history"
        ],
        answer: "A"
      }
    ],
    exercises: [
      {
        id: 1,
        question: "'beverage' is closest in meaning to ----.",
        options: ["A) drink", "B) food", "C) custom"],
        answer: "A"
      },
      {
        id: 2,
        question: "'widespread' is closest in meaning to ----.",
        options: ["A) common", "B) rare", "C) distant"],
        answer: "A"
      },
      {
        id: 3,
        question: "'immense' is closest in meaning to ----.",
        options: ["A) enormous", "B) tiny", "C) cheap"],
        answer: "A"
      },
      {
        id: 4,
        question: "'catch on' is closest in meaning to ----.",
        options: ["A) become popular", "B) disappear", "C) import"],
        answer: "A"
      },
    ],
    sourceFidelity: "goruntuden-birebir"
  }
];
