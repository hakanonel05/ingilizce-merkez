export interface WorkbookQuestion { prompt: string; options: string[]; answers: string[]; }
export interface WorkbookExercise { type: "collocation" | "synonyms" | "sentence"; title: string; instruction: string; multi: boolean; questions: WorkbookQuestion[]; }
export interface WorkbookGroup { theme: string; words: string[]; }
export interface WorkbookTable { id: string; category: "adjectives" | "verbs"; tableNo: number; groups: WorkbookGroup[]; exercises: WorkbookExercise[]; }

export const WORKBOOK_TABLES: WorkbookTable[] = [
  {
    "id": "adj-1",
    "category": "adjectives",
    "tableNo": 1,
    "groups": [
      {
        "theme": "önemli, öncelikli",
        "words": [
          "important",
          "crucial",
          "critical",
          "vital",
          "significant"
        ]
      },
      {
        "theme": "temel, gerekli",
        "words": [
          "necessary",
          "essential",
          "fundamental",
          "required",
          "basic",
          "needed"
        ]
      },
      {
        "theme": "zorunlu, şart",
        "words": [
          "mandatory",
          "obligatory",
          "compulsory",
          "enforced"
        ]
      },
      {
        "theme": "tuhaf, garip",
        "words": [
          "strange",
          "weird",
          "odd",
          "bizarre",
          "peculiar"
        ]
      },
      {
        "theme": "saçma, absürt",
        "words": [
          "ridiculous",
          "absurd",
          "irrational",
          "silly"
        ]
      },
      {
        "theme": "şahane, sıradışı",
        "words": [
          "fantastic",
          "wonderful",
          "excellent",
          "outstanding",
          "extraordinary"
        ]
      },
      {
        "theme": "çok miktarda, bol",
        "words": [
          "abundant",
          "numerous",
          "ample",
          "considerable",
          "substantial"
        ]
      },
      {
        "theme": "az sayıda, az",
        "words": [
          "few",
          "little",
          "meagre",
          "scarce",
          "rare"
        ]
      },
      {
        "theme": "yetersiz, sınırlı",
        "words": [
          "inadequate",
          "insufficient",
          "insignificant",
          "restricted",
          "limited"
        ]
      },
      {
        "theme": "ufak, önemsiz, kısa",
        "words": [
          "tiny",
          "paltry",
          "brief",
          "concise"
        ]
      }
    ],
    "exercises": [
      {
        "type": "collocation",
        "title": "EXERCISE 1 - Collocation Test",
        "instruction": "Aşağıdaki ifadeleri doğru şekilde tamamlayan sözcüğü bulunuz.",
        "multi": false,
        "questions": [
          {
            "prompt": "____ importance / significance",
            "options": [
              "crucial",
              "concise"
            ],
            "answers": [
              "crucial"
            ]
          },
          {
            "prompt": "____ achievement / success",
            "options": [
              "short",
              "significant"
            ],
            "answers": [
              "significant"
            ]
          },
          {
            "prompt": "____ time / man",
            "options": [
              "low",
              "short"
            ],
            "answers": [
              "short"
            ]
          },
          {
            "prompt": "____ performance / effort",
            "options": [
              "extraordinary",
              "plenty"
            ],
            "answers": [
              "extraordinary"
            ]
          },
          {
            "prompt": "____ amount",
            "options": [
              "silly",
              "considerable"
            ],
            "answers": [
              "considerable"
            ]
          },
          {
            "prompt": "____ species",
            "options": [
              "rare",
              "enforced"
            ],
            "answers": [
              "rare"
            ]
          },
          {
            "prompt": "____ sense of humour",
            "options": [
              "weird",
              "brief"
            ],
            "answers": [
              "weird"
            ]
          },
          {
            "prompt": "____ registration",
            "options": [
              "mandatory",
              "scarce"
            ],
            "answers": [
              "mandatory"
            ]
          },
          {
            "prompt": "basic ____",
            "options": [
              "scientist",
              "training"
            ],
            "answers": [
              "training"
            ]
          },
          {
            "prompt": "ridiculous ____",
            "options": [
              "argument",
              "health"
            ],
            "answers": [
              "argument"
            ]
          },
          {
            "prompt": "____ news",
            "options": [
              "low",
              "fantastic"
            ],
            "answers": [
              "fantastic"
            ]
          },
          {
            "prompt": "____ amount",
            "options": [
              "substantial",
              "wonderful"
            ],
            "answers": [
              "substantial"
            ]
          },
          {
            "prompt": "____ sleep / time / money",
            "options": [
              "absurd",
              "lack of"
            ],
            "answers": [
              "lack of"
            ]
          },
          {
            "prompt": "____ sum / amount",
            "options": [
              "negligible",
              "silly"
            ],
            "answers": [
              "negligible"
            ]
          },
          {
            "prompt": "____ income / temperature",
            "options": [
              "low",
              "compulsory"
            ],
            "answers": [
              "low"
            ]
          }
        ]
      },
      {
        "type": "synonyms",
        "title": "EXERCISE 2 - Synonyms Test",
        "instruction": "Verilen sözcüğe anlamca yakın (eş anlamlı) TÜM sözcükleri seçiniz.",
        "multi": true,
        "questions": [
          {
            "prompt": "abundant",
            "options": [
              "strange",
              "important",
              "compulsory",
              "ample",
              "numerous"
            ],
            "answers": [
              "numerous",
              "ample"
            ]
          },
          {
            "prompt": "silly",
            "options": [
              "necessary",
              "inadequate",
              "scarce",
              "peculiar",
              "ridiculous"
            ],
            "answers": [
              "ridiculous"
            ]
          },
          {
            "prompt": "fantastic",
            "options": [
              "wonderful",
              "concise",
              "critical",
              "excellent",
              "abundant"
            ],
            "answers": [
              "wonderful",
              "excellent"
            ]
          },
          {
            "prompt": "needed",
            "options": [
              "fundamental",
              "ridiculous",
              "strange",
              "necessary",
              "essential"
            ],
            "answers": [
              "necessary",
              "essential",
              "fundamental"
            ]
          },
          {
            "prompt": "absurd",
            "options": [
              "ridiculous",
              "considerable",
              "irrational",
              "mandatory",
              "silly"
            ],
            "answers": [
              "ridiculous",
              "irrational",
              "silly"
            ]
          },
          {
            "prompt": "basic",
            "options": [
              "weird",
              "necessary",
              "enforced",
              "abundant",
              "essential"
            ],
            "answers": [
              "necessary",
              "essential"
            ]
          },
          {
            "prompt": "numerous",
            "options": [
              "silly",
              "ample",
              "strange",
              "abundant",
              "considerable"
            ],
            "answers": [
              "abundant",
              "ample",
              "considerable"
            ]
          },
          {
            "prompt": "inadequate",
            "options": [
              "brief",
              "scarce",
              "restricted",
              "insignificant",
              "insufficient"
            ],
            "answers": [
              "insufficient",
              "insignificant",
              "restricted"
            ]
          },
          {
            "prompt": "obligatory",
            "options": [
              "compulsory",
              "mandatory",
              "ridiculous",
              "inadequate",
              "vital"
            ],
            "answers": [
              "mandatory",
              "compulsory"
            ]
          },
          {
            "prompt": "vital",
            "options": [
              "peculiar",
              "important",
              "crucial",
              "needed",
              "essential"
            ],
            "answers": [
              "important",
              "crucial"
            ]
          },
          {
            "prompt": "little",
            "options": [
              "few",
              "insignificant",
              "outstanding",
              "required",
              "weird"
            ],
            "answers": [
              "few"
            ]
          },
          {
            "prompt": "significant",
            "options": [
              "crucial",
              "important",
              "needed",
              "fantastic",
              "necessary"
            ],
            "answers": [
              "important",
              "crucial"
            ]
          }
        ]
      },
      {
        "type": "sentence",
        "title": "EXERCISE 3 - Sentence Completion",
        "instruction": "Cümleyi doğru tamamlayan ifadeyi seçiniz.",
        "multi": false,
        "questions": [
          {
            "prompt": "The most ____ achievement in human history is the invention of writing.",
            "options": [
              "significant",
              "abundant"
            ],
            "answers": [
              "significant"
            ]
          },
          {
            "prompt": "Wearing a helmet when riding a motorcycle is ____.",
            "options": [
              "mandatory",
              "tiny"
            ],
            "answers": [
              "mandatory"
            ]
          },
          {
            "prompt": "Sandra is hardworking and has the potential to be an ____ teacher.",
            "options": [
              "odd",
              "excellent"
            ],
            "answers": [
              "excellent"
            ]
          },
          {
            "prompt": "There has been ____ rainfall over the past two years, and farmers are having trouble.",
            "options": [
              "numerous",
              "insufficient"
            ],
            "answers": [
              "insufficient"
            ]
          },
          {
            "prompt": "Luke put out his hand and touched the ____ fingers of his baby daughter.",
            "options": [
              "enforced",
              "tiny"
            ],
            "answers": [
              "tiny"
            ]
          },
          {
            "prompt": "Some questions seem critical, but others are ____.",
            "options": [
              "crucial",
              "silly"
            ],
            "answers": [
              "silly"
            ]
          },
          {
            "prompt": "I could suggest many different methods, but here are just a ____.",
            "options": [
              "few",
              "compulsory"
            ],
            "answers": [
              "few"
            ]
          },
          {
            "prompt": "The president read a ____ statement to reporters before boarding his plane.",
            "options": [
              "low",
              "brief"
            ],
            "answers": [
              "brief"
            ]
          },
          {
            "prompt": "She struggled to overcome her ____ fear of the dark.",
            "options": [
              "necessary",
              "irrational"
            ],
            "answers": [
              "irrational"
            ]
          },
          {
            "prompt": "The city of Mycenae played a ____ role in the history of Greece.",
            "options": [
              "crucial",
              "few"
            ],
            "answers": [
              "crucial"
            ]
          },
          {
            "prompt": "This useful leaflet gives some ____ information.",
            "options": [
              "basic",
              "irrational"
            ],
            "answers": [
              "basic"
            ]
          },
          {
            "prompt": "She felt there was something ____ about his voice.",
            "options": [
              "short",
              "strange"
            ],
            "answers": [
              "strange"
            ]
          },
          {
            "prompt": "There is no ____ difference between people of different races.",
            "options": [
              "fundamental",
              "restricted"
            ],
            "answers": [
              "fundamental"
            ]
          },
          {
            "prompt": "Military service is ____ for all men who are over 20 in New Zealand.",
            "options": [
              "obligatory",
              "lack of"
            ],
            "answers": [
              "obligatory"
            ]
          },
          {
            "prompt": "During the war, things like clothes and shoes were ____.",
            "options": [
              "scarce",
              "excellent"
            ],
            "answers": [
              "scarce"
            ]
          },
          {
            "prompt": "There were ____ arrests and injuries, as well as unconfirmed stories of killings.",
            "options": [
              "fantastic",
              "numerous"
            ],
            "answers": [
              "numerous"
            ]
          },
          {
            "prompt": "Some people think yoga is ____.",
            "options": [
              "ridiculous",
              "plenty"
            ],
            "answers": [
              "ridiculous"
            ]
          },
          {
            "prompt": "The book is a series of interviews with ____ artists and famous writers.",
            "options": [
              "brief",
              "outstanding"
            ],
            "answers": [
              "outstanding"
            ]
          },
          {
            "prompt": "Certain health problems are linked to poor diet and ____ exercise.",
            "options": [
              "lack of",
              "fundamental"
            ],
            "answers": [
              "lack of"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "adj-2",
    "category": "adjectives",
    "tableNo": 2,
    "groups": [
      {
        "theme": "büyük, devasa",
        "words": [
          "huge",
          "immense",
          "gigantic",
          "vast",
          "enormous"
        ]
      },
      {
        "theme": "ayrı, farklı",
        "words": [
          "separate",
          "distinct",
          "different",
          "diverse"
        ]
      },
      {
        "theme": "açık, net",
        "words": [
          "evident",
          "clear",
          "apparent",
          "obvious",
          "visible"
        ]
      },
      {
        "theme": "canlı, ışıltılı",
        "words": [
          "shining",
          "gleaming",
          "lively",
          "vibrant"
        ]
      },
      {
        "theme": "değerli, kıymetli",
        "words": [
          "invaluable",
          "valuable",
          "priceless",
          "precious"
        ]
      },
      {
        "theme": "iflas etmiş, parasız",
        "words": [
          "bankrupt",
          "broke"
        ]
      },
      {
        "theme": "uygulanabilir, karlı",
        "words": [
          "feasible",
          "viable",
          "practical",
          "applicable",
          "lucrative"
        ]
      },
      {
        "theme": "düzgün, uygun, yetkin",
        "words": [
          "appropriate",
          "proper",
          "competent",
          "qualified",
          "innovative"
        ]
      }
    ],
    "exercises": [
      {
        "type": "collocation",
        "title": "EXERCISE 1 - Collocation Test",
        "instruction": "Aşağıdaki ifadeleri doğru şekilde tamamlayan sözcüğü bulunuz.",
        "multi": false,
        "questions": [
          {
            "prompt": "____ difference / gap",
            "options": [
              "huge",
              "lucrative"
            ],
            "answers": [
              "huge"
            ]
          },
          {
            "prompt": "____ areas of rainforest",
            "options": [
              "innovative",
              "vast"
            ],
            "answers": [
              "vast"
            ]
          },
          {
            "prompt": "____ effect / impact",
            "options": [
              "profound",
              "qualified"
            ],
            "answers": [
              "profound"
            ]
          },
          {
            "prompt": "____ category / country",
            "options": [
              "separate",
              "broke"
            ],
            "answers": [
              "separate"
            ]
          },
          {
            "prompt": "It is ____ that they agree with us.",
            "options": [
              "giant",
              "apparent"
            ],
            "answers": [
              "apparent"
            ]
          },
          {
            "prompt": "____ solution to a problem",
            "options": [
              "viable",
              "bankrupt"
            ],
            "answers": [
              "viable"
            ]
          },
          {
            "prompt": "____ colour / character",
            "options": [
              "vivid",
              "lucrative"
            ],
            "answers": [
              "vivid"
            ]
          },
          {
            "prompt": "____ sky",
            "options": [
              "commercial",
              "clear"
            ],
            "answers": [
              "clear"
            ]
          },
          {
            "prompt": "____ lawyer / engineer",
            "options": [
              "competent",
              "lucrative"
            ],
            "answers": [
              "competent"
            ]
          },
          {
            "prompt": "____ investment",
            "options": [
              "vivid",
              "profitable"
            ],
            "answers": [
              "profitable"
            ]
          },
          {
            "prompt": "____ jewel",
            "options": [
              "fit",
              "precious"
            ],
            "answers": [
              "precious"
            ]
          },
          {
            "prompt": "____ job / attitude",
            "options": [
              "proper",
              "broke"
            ],
            "answers": [
              "proper"
            ]
          },
          {
            "prompt": "____ information",
            "options": [
              "broke",
              "invaluable"
            ],
            "answers": [
              "invaluable"
            ]
          },
          {
            "prompt": "____ activity",
            "options": [
              "broke",
              "commercial"
            ],
            "answers": [
              "commercial"
            ]
          },
          {
            "prompt": "____ social life / atmosphere",
            "options": [
              "lively",
              "bankrupt"
            ],
            "answers": [
              "lively"
            ]
          }
        ]
      },
      {
        "type": "synonyms",
        "title": "EXERCISE 2 - Synonyms Test",
        "instruction": "Verilen sözcüğe anlamca yakın (eş anlamlı) TÜM sözcükleri seçiniz.",
        "multi": true,
        "questions": [
          {
            "prompt": "bankrupt",
            "options": [
              "vast",
              "valuable",
              "apparent",
              "applicable",
              "broke"
            ],
            "answers": [
              "broke"
            ]
          },
          {
            "prompt": "vast",
            "options": [
              "different",
              "bankrupt",
              "obvious",
              "huge",
              "qualified"
            ],
            "answers": [
              "huge"
            ]
          },
          {
            "prompt": "lucrative",
            "options": [
              "invaluable",
              "separate",
              "feasible",
              "immense",
              "bankrupt"
            ],
            "answers": [
              "feasible"
            ]
          },
          {
            "prompt": "shining",
            "options": [
              "lively",
              "vibrant",
              "gleaming",
              "qualified",
              "competent"
            ],
            "answers": [
              "gleaming",
              "lively",
              "vibrant"
            ]
          },
          {
            "prompt": "practical",
            "options": [
              "feasible",
              "clear",
              "shining",
              "vast",
              "viable"
            ],
            "answers": [
              "feasible",
              "viable"
            ]
          },
          {
            "prompt": "enormous",
            "options": [
              "applicable",
              "valuable",
              "immense",
              "practical",
              "huge"
            ],
            "answers": [
              "huge",
              "immense"
            ]
          },
          {
            "prompt": "immense",
            "options": [
              "separate",
              "huge",
              "valuable",
              "clear",
              "lucrative"
            ],
            "answers": [
              "huge"
            ]
          },
          {
            "prompt": "invaluable",
            "options": [
              "appropriate",
              "distinct",
              "lucrative",
              "valuable",
              "priceless"
            ],
            "answers": [
              "valuable",
              "priceless"
            ]
          },
          {
            "prompt": "gigantic",
            "options": [
              "huge",
              "gleaming",
              "appropriate",
              "different",
              "practical"
            ],
            "answers": [
              "huge"
            ]
          },
          {
            "prompt": "lively",
            "options": [
              "evident",
              "gleaming",
              "vibrant",
              "shining",
              "invaluable"
            ],
            "answers": [
              "shining",
              "gleaming",
              "vibrant"
            ]
          },
          {
            "prompt": "appropriate",
            "options": [
              "lucrative",
              "vibrant",
              "invaluable",
              "proper",
              "separate"
            ],
            "answers": [
              "proper"
            ]
          },
          {
            "prompt": "clear",
            "options": [
              "evident",
              "separate",
              "obvious",
              "broke",
              "apparent"
            ],
            "answers": [
              "evident",
              "apparent",
              "obvious"
            ]
          }
        ]
      },
      {
        "type": "sentence",
        "title": "EXERCISE 3 - Sentence Completion",
        "instruction": "Cümleyi doğru tamamlayan ifadeyi seçiniz.",
        "multi": false,
        "questions": [
          {
            "prompt": "He has an ____ amount of work to finish before Friday.",
            "options": [
              "enormous",
              "innovative"
            ],
            "answers": [
              "enormous"
            ]
          },
          {
            "prompt": "At last, the city introduced an ____ system of traffic control.",
            "options": [
              "broke",
              "innovative"
            ],
            "answers": [
              "innovative"
            ]
          },
          {
            "prompt": "New students are expected to be ____ in mathematics.",
            "options": [
              "commercial",
              "competent"
            ],
            "answers": [
              "competent"
            ]
          },
          {
            "prompt": "China is a ____ country in terms of population.",
            "options": [
              "huge",
              "evident"
            ],
            "answers": [
              "huge"
            ]
          },
          {
            "prompt": "He tries to keep his professional life completely ____ from his private life.",
            "options": [
              "separate",
              "enormous"
            ],
            "answers": [
              "separate"
            ]
          },
          {
            "prompt": "It was clearly ____ that the company was in financial difficulty.",
            "options": [
              "feasible",
              "evident"
            ],
            "answers": [
              "evident"
            ]
          },
          {
            "prompt": "His watch didn't have a ____ screen, so he couldn't tell the time.",
            "options": [
              "luminous",
              "bankrupt"
            ],
            "answers": [
              "luminous"
            ]
          },
          {
            "prompt": "Catering is a very ____ business if you succeed in it.",
            "options": [
              "lucrative",
              "visible"
            ],
            "answers": [
              "lucrative"
            ]
          },
          {
            "prompt": "She just came back from holiday and she's completely ____.",
            "options": [
              "broke",
              "innovative"
            ],
            "answers": [
              "broke"
            ]
          },
          {
            "prompt": "Their most ____ belongings were locked in a safe.",
            "options": [
              "deep",
              "valuable"
            ],
            "answers": [
              "valuable"
            ]
          },
          {
            "prompt": "He did well in his exams, despite his ____ lack of interest.",
            "options": [
              "apparent",
              "proper"
            ],
            "answers": [
              "apparent"
            ]
          },
          {
            "prompt": "The mother's behaviour has a ____ impact on the developing child.",
            "options": [
              "profound",
              "profitable"
            ],
            "answers": [
              "profound"
            ]
          },
          {
            "prompt": "The use of sound was effective and ____.",
            "options": [
              "appropriate",
              "broke"
            ],
            "answers": [
              "appropriate"
            ]
          },
          {
            "prompt": "Our top priorities must be profit and ____ growth.",
            "options": [
              "bankrupt",
              "commercial"
            ],
            "answers": [
              "commercial"
            ]
          },
          {
            "prompt": "Istanbul is one of the most culturally ____ cities in the world.",
            "options": [
              "diverse",
              "broke"
            ],
            "answers": [
              "diverse"
            ]
          },
          {
            "prompt": "Stars are ____ at night when the sky is clear.",
            "options": [
              "visible",
              "competent"
            ],
            "answers": [
              "visible"
            ]
          },
          {
            "prompt": "It is not ____ for teachers to give exam questions beforehand.",
            "options": [
              "gigantic",
              "proper"
            ],
            "answers": [
              "proper"
            ]
          },
          {
            "prompt": "The doll is old, but it's ____ to me because it was my mother's.",
            "options": [
              "precious",
              "lucrative"
            ],
            "answers": [
              "precious"
            ]
          },
          {
            "prompt": "My uncle spends too much and thus he is ____ now.",
            "options": [
              "proper",
              "broke"
            ],
            "answers": [
              "broke"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "adj-3",
    "category": "adjectives",
    "tableNo": 3,
    "groups": [
      {
        "theme": "olası, muhtemel",
        "words": [
          "possible",
          "probable",
          "likely"
        ]
      },
      {
        "theme": "imkansız, olası değil",
        "words": [
          "improbable",
          "impossible",
          "unlikely"
        ]
      },
      {
        "theme": "tarafsız, nesnel",
        "words": [
          "objective",
          "neutral",
          "impartial",
          "fair"
        ]
      },
      {
        "theme": "kızgın, hayal kırıklığına uğramış",
        "words": [
          "angry",
          "annoyed",
          "disappointed",
          "frustrated"
        ]
      },
      {
        "theme": "yenilmez, güçlü",
        "words": [
          "invincible",
          "unbeatable",
          "powerful",
          "mighty"
        ]
      },
      {
        "theme": "dikkatli, titiz",
        "words": [
          "careful",
          "cautious",
          "meticulous"
        ]
      },
      {
        "theme": "ünlü, iyi bilinen",
        "words": [
          "eminent",
          "famous",
          "celebrated"
        ]
      },
      {
        "theme": "şüpheci, kuşkucu",
        "words": [
          "doubtful",
          "sceptical",
          "dubious"
        ]
      },
      {
        "theme": "kararlı",
        "words": [
          "determined",
          "decisive"
        ]
      }
    ],
    "exercises": [
      {
        "type": "collocation",
        "title": "EXERCISE 1 - Collocation Test",
        "instruction": "Aşağıdaki ifadeleri doğru şekilde tamamlayan sözcüğü bulunuz.",
        "multi": false,
        "questions": [
          {
            "prompt": "as soon as ____",
            "options": [
              "possible",
              "careful"
            ],
            "answers": [
              "possible"
            ]
          },
          {
            "prompt": "____ cause",
            "options": [
              "unbeatable",
              "probable"
            ],
            "answers": [
              "probable"
            ]
          },
          {
            "prompt": "____ customer",
            "options": [
              "angry",
              "neutral"
            ],
            "answers": [
              "angry"
            ]
          },
          {
            "prompt": "____ effort / researcher",
            "options": [
              "belligerent",
              "determined"
            ],
            "answers": [
              "determined"
            ]
          },
          {
            "prompt": "____ play / decision",
            "options": [
              "annoyed",
              "fair"
            ],
            "answers": [
              "fair"
            ]
          },
          {
            "prompt": "____ artist / singer",
            "options": [
              "celebrated",
              "impossible"
            ],
            "answers": [
              "celebrated"
            ]
          },
          {
            "prompt": "____ character",
            "options": [
              "strong",
              "likely"
            ],
            "answers": [
              "strong"
            ]
          },
          {
            "prompt": "____ planning",
            "options": [
              "eminent",
              "meticulous"
            ],
            "answers": [
              "meticulous"
            ]
          },
          {
            "prompt": "on the ____ of bankruptcy",
            "options": [
              "edge",
              "objective"
            ],
            "answers": [
              "edge"
            ]
          },
          {
            "prompt": "____ look / tone",
            "options": [
              "eminent",
              "doubtful"
            ],
            "answers": [
              "doubtful"
            ]
          },
          {
            "prompt": "____ analysis / attitude",
            "options": [
              "objective",
              "annoyed"
            ],
            "answers": [
              "objective"
            ]
          },
          {
            "prompt": "____ customers / audience",
            "options": [
              "disappointed",
              "invincible"
            ],
            "answers": [
              "disappointed"
            ]
          },
          {
            "prompt": "____ building / actor",
            "options": [
              "offensive",
              "famous"
            ],
            "answers": [
              "famous"
            ]
          },
          {
            "prompt": "____ driver / parents",
            "options": [
              "careful",
              "neutral"
            ],
            "answers": [
              "careful"
            ]
          }
        ]
      },
      {
        "type": "synonyms",
        "title": "EXERCISE 2 - Synonyms Test",
        "instruction": "Verilen sözcüğe anlamca yakın (eş anlamlı) TÜM sözcükleri seçiniz.",
        "multi": true,
        "questions": [
          {
            "prompt": "improbable",
            "options": [
              "famous",
              "impossible",
              "angry",
              "unlikely",
              "celebrated"
            ],
            "answers": [
              "impossible",
              "unlikely"
            ]
          },
          {
            "prompt": "unbeatable",
            "options": [
              "cautious",
              "invincible",
              "impartial",
              "decisive",
              "meticulous"
            ],
            "answers": [
              "invincible"
            ]
          },
          {
            "prompt": "fair",
            "options": [
              "neutral",
              "meticulous",
              "objective",
              "frustrated",
              "angry"
            ],
            "answers": [
              "objective",
              "neutral"
            ]
          },
          {
            "prompt": "impartial",
            "options": [
              "eminent",
              "improbable",
              "unlikely",
              "objective",
              "neutral"
            ],
            "answers": [
              "objective",
              "neutral"
            ]
          },
          {
            "prompt": "impossible",
            "options": [
              "possible",
              "angry",
              "determined",
              "improbable",
              "meticulous"
            ],
            "answers": [
              "improbable"
            ]
          },
          {
            "prompt": "probable",
            "options": [
              "cautious",
              "likely",
              "famous",
              "disappointed",
              "possible"
            ],
            "answers": [
              "possible",
              "likely"
            ]
          },
          {
            "prompt": "famous",
            "options": [
              "angry",
              "eminent",
              "celebrated",
              "possible",
              "disappointed"
            ],
            "answers": [
              "eminent",
              "celebrated"
            ]
          },
          {
            "prompt": "sceptical",
            "options": [
              "unlikely",
              "doubtful",
              "eminent",
              "impartial",
              "frustrated"
            ],
            "answers": [
              "doubtful"
            ]
          },
          {
            "prompt": "likely",
            "options": [
              "fair",
              "decisive",
              "eminent",
              "cautious",
              "possible"
            ],
            "answers": [
              "possible"
            ]
          },
          {
            "prompt": "eminent",
            "options": [
              "famous",
              "impossible",
              "impartial",
              "mighty",
              "likely"
            ],
            "answers": [
              "famous"
            ]
          },
          {
            "prompt": "meticulous",
            "options": [
              "probable",
              "sceptical",
              "careful",
              "impossible",
              "cautious"
            ],
            "answers": [
              "careful",
              "cautious"
            ]
          },
          {
            "prompt": "powerful",
            "options": [
              "doubtful",
              "unbeatable",
              "cautious",
              "determined",
              "invincible"
            ],
            "answers": [
              "invincible",
              "unbeatable"
            ]
          }
        ]
      },
      {
        "type": "sentence",
        "title": "EXERCISE 3 - Sentence Completion",
        "instruction": "Cümleyi doğru tamamlayan ifadeyi seçiniz.",
        "multi": false,
        "questions": [
          {
            "prompt": "Children in African rural areas are very ____ to be poor.",
            "options": [
              "likely",
              "doubtful"
            ],
            "answers": [
              "likely"
            ]
          },
          {
            "prompt": "Immigrants have a ____ influence on the local culture.",
            "options": [
              "careful",
              "powerful"
            ],
            "answers": [
              "powerful"
            ]
          },
          {
            "prompt": "It's hard to give an ____ opinion about one's own children.",
            "options": [
              "famous",
              "objective"
            ],
            "answers": [
              "objective"
            ]
          },
          {
            "prompt": "Our representative attended the peace negotiations as an ____ observer.",
            "options": [
              "impartial",
              "offensive"
            ],
            "answers": [
              "impartial"
            ]
          },
          {
            "prompt": "The BBC received complaints about the ____ remarks in the interview.",
            "options": [
              "celebrated",
              "offensive"
            ],
            "answers": [
              "offensive"
            ]
          },
          {
            "prompt": "The portrait drew the attention of at least two ____ artists.",
            "options": [
              "eminent",
              "impossible"
            ],
            "answers": [
              "eminent"
            ]
          },
          {
            "prompt": "Paul was very ____ with the coffee so as not to spill it.",
            "options": [
              "impartial",
              "careful"
            ],
            "answers": [
              "careful"
            ]
          },
          {
            "prompt": "We will take ____ steps towards political union with Europe.",
            "options": [
              "decisive",
              "disappointed"
            ],
            "answers": [
              "decisive"
            ]
          },
          {
            "prompt": "It is ____ whether the patient will survive the operation.",
            "options": [
              "doubtful",
              "famous"
            ],
            "answers": [
              "doubtful"
            ]
          },
          {
            "prompt": "Van Gogh, perhaps Holland's most ____ artist, died in poverty.",
            "options": [
              "likely",
              "celebrated"
            ],
            "answers": [
              "celebrated"
            ]
          },
          {
            "prompt": "Her back injury may make it ____ for her to play tennis anymore.",
            "options": [
              "impossible",
              "powerful"
            ],
            "answers": [
              "impossible"
            ]
          },
          {
            "prompt": "Work is ____ start on a new factory building.",
            "options": [
              "about to",
              "annoyed"
            ],
            "answers": [
              "about to"
            ]
          },
          {
            "prompt": "There are ____ protesters outside the closed factory.",
            "options": [
              "improbable",
              "angry"
            ],
            "answers": [
              "angry"
            ]
          },
          {
            "prompt": "The nuclear power plant project met ____ opposition from local people.",
            "options": [
              "strong",
              "eminent"
            ],
            "answers": [
              "strong"
            ]
          },
          {
            "prompt": "David is ____ to minimize the mistakes.",
            "options": [
              "determined",
              "impossible"
            ],
            "answers": [
              "determined"
            ]
          },
          {
            "prompt": "The injured passenger was ____ death when the ambulance arrived.",
            "options": [
              "celebrated",
              "on the edge of"
            ],
            "answers": [
              "on the edge of"
            ]
          },
          {
            "prompt": "Richard gets ____ when his team loses the match.",
            "options": [
              "frustrated",
              "objective"
            ],
            "answers": [
              "frustrated"
            ]
          },
          {
            "prompt": "This piece of jewellery is the work of a ____ craftsman.",
            "options": [
              "belligerent",
              "meticulous"
            ],
            "answers": [
              "meticulous"
            ]
          },
          {
            "prompt": "Switzerland remained ____ during World War II.",
            "options": [
              "eminent",
              "neutral"
            ],
            "answers": [
              "neutral"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "adj-4",
    "category": "adjectives",
    "tableNo": 4,
    "groups": [
      {
        "theme": "istekli, hevesli",
        "words": [
          "willing",
          "eager",
          "keen"
        ]
      },
      {
        "theme": "çılgın, deli",
        "words": [
          "insane",
          "crazy",
          "mad"
        ]
      },
      {
        "theme": "ılımlı, dengeli",
        "words": [
          "moderate",
          "temperate"
        ]
      },
      {
        "theme": "iyimser, kötümser",
        "words": [
          "optimistic",
          "hopeful",
          "pessimistic"
        ]
      },
      {
        "theme": "isyankar, savurgan",
        "words": [
          "rebellious",
          "disobedient",
          "extravagant"
        ]
      },
      {
        "theme": "düşüncesiz, umursamaz",
        "words": [
          "thoughtless",
          "reckless",
          "careless",
          "irresponsible"
        ]
      },
      {
        "theme": "emin, kendine güvenen, kesin",
        "words": [
          "confident",
          "sure",
          "certain",
          "assured"
        ]
      },
      {
        "theme": "zengin, varlıklı",
        "words": [
          "rich",
          "wealthy",
          "prosperous",
          "affluent",
          "thriving"
        ]
      },
      {
        "theme": "tutarlı, kalıcı",
        "words": [
          "consistent",
          "stable",
          "steady",
          "persistent"
        ]
      },
      {
        "theme": "değişen, dalgalanan, geçici",
        "words": [
          "changing",
          "fluctuating",
          "temporary",
          "momentary"
        ]
      }
    ],
    "exercises": [
      {
        "type": "collocation",
        "title": "EXERCISE 1 - Collocation Test",
        "instruction": "Aşağıdaki ifadeleri doğru şekilde tamamlayan sözcüğü bulunuz.",
        "multi": false,
        "questions": [
          {
            "prompt": "drive somebody ____",
            "options": [
              "crazy",
              "fixed"
            ],
            "answers": [
              "crazy"
            ]
          },
          {
            "prompt": "____ families",
            "options": [
              "momentary",
              "wealthy"
            ],
            "answers": [
              "wealthy"
            ]
          },
          {
            "prompt": "____ teenagers",
            "options": [
              "rebellious",
              "sure"
            ],
            "answers": [
              "rebellious"
            ]
          },
          {
            "prompt": "____ growth",
            "options": [
              "consistent",
              "eager"
            ],
            "answers": [
              "consistent"
            ]
          },
          {
            "prompt": "____ supporter",
            "options": [
              "careless",
              "keen"
            ],
            "answers": [
              "keen"
            ]
          },
          {
            "prompt": "____ driving",
            "options": [
              "reckless",
              "prosperous"
            ],
            "answers": [
              "reckless"
            ]
          },
          {
            "prompt": "____ job",
            "options": [
              "disobedient",
              "temporary"
            ],
            "answers": [
              "temporary"
            ]
          },
          {
            "prompt": "____ life style",
            "options": [
              "extravagant",
              "willing"
            ],
            "answers": [
              "extravagant"
            ]
          },
          {
            "prompt": "____ doses of caffeine",
            "options": [
              "affluent",
              "moderate"
            ],
            "answers": [
              "moderate"
            ]
          },
          {
            "prompt": "____ economic forecast",
            "options": [
              "optimistic",
              "rich"
            ],
            "answers": [
              "optimistic"
            ]
          },
          {
            "prompt": "____ exchange rate",
            "options": [
              "eager",
              "fluctuating"
            ],
            "answers": [
              "fluctuating"
            ]
          },
          {
            "prompt": "____ problem",
            "options": [
              "persistent",
              "optimistic"
            ],
            "answers": [
              "persistent"
            ]
          },
          {
            "prompt": "feel ____",
            "options": [
              "confident",
              "fixed"
            ],
            "answers": [
              "confident"
            ]
          },
          {
            "prompt": "____ parents",
            "options": [
              "momentary",
              "irresponsible"
            ],
            "answers": [
              "irresponsible"
            ]
          },
          {
            "prompt": "____ societies / individuals",
            "options": [
              "affluent",
              "sure"
            ],
            "answers": [
              "affluent"
            ]
          },
          {
            "prompt": "____ price",
            "options": [
              "thriving",
              "fixed"
            ],
            "answers": [
              "fixed"
            ]
          }
        ]
      },
      {
        "type": "synonyms",
        "title": "EXERCISE 2 - Synonyms Test",
        "instruction": "Verilen sözcüğe anlamca yakın (eş anlamlı) TÜM sözcükleri seçiniz.",
        "multi": true,
        "questions": [
          {
            "prompt": "careless",
            "options": [
              "thoughtless",
              "stable",
              "willing",
              "momentary",
              "certain"
            ],
            "answers": [
              "thoughtless"
            ]
          },
          {
            "prompt": "insane",
            "options": [
              "crazy",
              "sure",
              "temporary",
              "affluent",
              "persistent"
            ],
            "answers": [
              "crazy"
            ]
          },
          {
            "prompt": "reckless",
            "options": [
              "careless",
              "thoughtless",
              "certain",
              "sure",
              "affluent"
            ],
            "answers": [
              "thoughtless",
              "careless"
            ]
          },
          {
            "prompt": "crazy",
            "options": [
              "reckless",
              "persistent",
              "prosperous",
              "temporary",
              "insane"
            ],
            "answers": [
              "insane"
            ]
          },
          {
            "prompt": "rebellious",
            "options": [
              "disobedient",
              "careless",
              "extravagant",
              "hopeful",
              "fluctuating"
            ],
            "answers": [
              "disobedient",
              "extravagant"
            ]
          },
          {
            "prompt": "disobedient",
            "options": [
              "irresponsible",
              "temporary",
              "persistent",
              "rebellious",
              "extravagant"
            ],
            "answers": [
              "rebellious",
              "extravagant"
            ]
          },
          {
            "prompt": "momentary",
            "options": [
              "temporary",
              "certain",
              "fluctuating",
              "wealthy",
              "changing"
            ],
            "answers": [
              "changing",
              "fluctuating",
              "temporary"
            ]
          },
          {
            "prompt": "eager",
            "options": [
              "assured",
              "optimistic",
              "crazy",
              "willing",
              "temperate"
            ],
            "answers": [
              "willing"
            ]
          },
          {
            "prompt": "moderate",
            "options": [
              "optimistic",
              "crazy",
              "temporary",
              "temperate",
              "disobedient"
            ],
            "answers": [
              "temperate"
            ]
          },
          {
            "prompt": "pessimistic",
            "options": [
              "keen",
              "hopeful",
              "assured",
              "optimistic",
              "rebellious"
            ],
            "answers": [
              "optimistic",
              "hopeful"
            ]
          },
          {
            "prompt": "keen",
            "options": [
              "disobedient",
              "moderate",
              "rebellious",
              "willing",
              "eager"
            ],
            "answers": [
              "willing",
              "eager"
            ]
          },
          {
            "prompt": "confident",
            "options": [
              "consistent",
              "certain",
              "pessimistic",
              "sure",
              "careless"
            ],
            "answers": [
              "sure",
              "certain"
            ]
          }
        ]
      },
      {
        "type": "sentence",
        "title": "EXERCISE 3 - Sentence Completion",
        "instruction": "Cümleyi doğru tamamlayan ifadeyi seçiniz.",
        "multi": false,
        "questions": [
          {
            "prompt": "Judges must be firm, fair and ____ in their application of the law.",
            "options": [
              "consistent",
              "crazy"
            ],
            "answers": [
              "consistent"
            ]
          },
          {
            "prompt": "Jack's report is far more ____; it is full of errors.",
            "options": [
              "careless",
              "temperate"
            ],
            "answers": [
              "careless"
            ]
          },
          {
            "prompt": "The study shows a ____ decline in the number of private college students.",
            "options": [
              "rich",
              "steady"
            ],
            "answers": [
              "steady"
            ]
          },
          {
            "prompt": "I told them I was perfectly ____ to help.",
            "options": [
              "willing",
              "pessimistic"
            ],
            "answers": [
              "willing"
            ]
          },
          {
            "prompt": "The Prime Minister appeared relaxed and ____ of winning a majority.",
            "options": [
              "confident",
              "irresponsible"
            ],
            "answers": [
              "confident"
            ]
          },
          {
            "prompt": "It is ____ to go camping in this stormy and cold weather.",
            "options": [
              "wealthy",
              "insane"
            ],
            "answers": [
              "insane"
            ]
          },
          {
            "prompt": "When you are ____, your attitude is often negative towards everything.",
            "options": [
              "pessimistic",
              "temporary"
            ],
            "answers": [
              "pessimistic"
            ]
          },
          {
            "prompt": "After the war, Germany became one of Europe's most ____ countries.",
            "options": [
              "thoughtless",
              "prosperous"
            ],
            "answers": [
              "prosperous"
            ]
          },
          {
            "prompt": "In spite of their problems, Turkish people manage to remain ____.",
            "options": [
              "fluctuating",
              "optimistic"
            ],
            "answers": [
              "optimistic"
            ]
          },
          {
            "prompt": "A ____ cloud sometimes passes in front of the sun.",
            "options": [
              "momentary",
              "affluent"
            ],
            "answers": [
              "momentary"
            ]
          },
          {
            "prompt": "It is highly ____ of him to leave the children alone in the pool.",
            "options": [
              "irresponsible",
              "thriving"
            ],
            "answers": [
              "irresponsible"
            ]
          },
          {
            "prompt": "The ____ size of an infant's head is an index of brain growth.",
            "options": [
              "changing",
              "hopeful"
            ],
            "answers": [
              "changing"
            ]
          },
          {
            "prompt": "It is ____ of the teenagers not to offer their seats to the elderly.",
            "options": [
              "certain",
              "thoughtless"
            ],
            "answers": [
              "thoughtless"
            ]
          },
          {
            "prompt": "Simon is ____ to get back to work as soon as possible.",
            "options": [
              "rich",
              "eager"
            ],
            "answers": [
              "eager"
            ]
          },
          {
            "prompt": "____ exercise, such as walking and swimming, can protect our hearts.",
            "options": [
              "Moderate",
              "Pessimistic"
            ],
            "answers": [
              "Moderate"
            ]
          },
          {
            "prompt": "Pam's ambition is always to marry a ____ man.",
            "options": [
              "rich",
              "momentary"
            ],
            "answers": [
              "rich"
            ]
          },
          {
            "prompt": "The local police are ____ of catching those responsible for the graffiti.",
            "options": [
              "wealthy",
              "hopeful"
            ],
            "answers": [
              "hopeful"
            ]
          },
          {
            "prompt": "Fuel prices have become more ____ after several increases last year.",
            "options": [
              "willing",
              "stable"
            ],
            "answers": [
              "stable"
            ]
          },
          {
            "prompt": "Exports will be affected negatively by ____ exchange rates.",
            "options": [
              "fluctuating",
              "willing"
            ],
            "answers": [
              "fluctuating"
            ]
          },
          {
            "prompt": "Thailand's ____ tourist industry is very successful.",
            "options": [
              "flourishing",
              "irresponsible"
            ],
            "answers": [
              "flourishing"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "adj-5",
    "category": "adjectives",
    "tableNo": 5,
    "groups": [
      {
        "theme": "kalıcı, uzun süreli",
        "words": [
          "permanent",
          "lasting",
          "eternal",
          "constant"
        ]
      },
      {
        "theme": "yavaş, kademeli",
        "words": [
          "gradual",
          "slow"
        ]
      },
      {
        "theme": "artan, yükselen",
        "words": [
          "increasing",
          "growing",
          "soaring",
          "mounting"
        ]
      },
      {
        "theme": "azalan, düşen",
        "words": [
          "decreasing",
          "declining",
          "lessening"
        ]
      },
      {
        "theme": "ani, beklenmedik",
        "words": [
          "instant",
          "sudden",
          "immediate",
          "abrupt"
        ]
      },
      {
        "theme": "dakik, hızlı, tez",
        "words": [
          "swift",
          "prompt",
          "quick",
          "rapid"
        ]
      },
      {
        "theme": "benzer, alakalı",
        "words": [
          "similar",
          "resembling",
          "relevant"
        ]
      },
      {
        "theme": "aynı",
        "words": [
          "identical",
          "uniform"
        ]
      },
      {
        "theme": "eşit, denk",
        "words": [
          "equal",
          "even"
        ]
      },
      {
        "theme": "çeşitli",
        "words": [
          "varied",
          "various"
        ]
      }
    ],
    "exercises": [
      {
        "type": "collocation",
        "title": "EXERCISE 1 - Collocation Test",
        "instruction": "Aşağıdaki ifadeleri doğru şekilde tamamlayan sözcüğü bulunuz.",
        "multi": false,
        "questions": [
          {
            "prompt": "____ growth / reaction",
            "options": [
              "rapid",
              "alike"
            ],
            "answers": [
              "rapid"
            ]
          },
          {
            "prompt": "gradual ____",
            "options": [
              "societies",
              "rise"
            ],
            "answers": [
              "rise"
            ]
          },
          {
            "prompt": "____ sum in size",
            "options": [
              "slow",
              "equal"
            ],
            "answers": [
              "equal"
            ]
          },
          {
            "prompt": "____ to the economy",
            "options": [
              "related",
              "various"
            ],
            "answers": [
              "related"
            ]
          },
          {
            "prompt": "____ coffee",
            "options": [
              "eternal",
              "instant"
            ],
            "answers": [
              "instant"
            ]
          },
          {
            "prompt": "____ response",
            "options": [
              "identical",
              "immediate"
            ],
            "answers": [
              "immediate"
            ]
          },
          {
            "prompt": "____ damage / residence",
            "options": [
              "permanent",
              "versatile"
            ],
            "answers": [
              "permanent"
            ]
          },
          {
            "prompt": "____ as the original",
            "options": [
              "abrupt",
              "the same"
            ],
            "answers": [
              "the same"
            ]
          },
          {
            "prompt": "____ change",
            "options": [
              "mounting",
              "sudden"
            ],
            "answers": [
              "sudden"
            ]
          },
          {
            "prompt": "____ to the original",
            "options": [
              "akin",
              "various"
            ],
            "answers": [
              "akin"
            ]
          },
          {
            "prompt": "____ distribution of wealth",
            "options": [
              "even",
              "lessening"
            ],
            "answers": [
              "even"
            ]
          },
          {
            "prompt": "____ fear",
            "options": [
              "quick",
              "constant"
            ],
            "answers": [
              "constant"
            ]
          },
          {
            "prompt": "a/an ____ animal / car",
            "options": [
              "fast",
              "immediate"
            ],
            "answers": [
              "fast"
            ]
          },
          {
            "prompt": "____ to the previous version",
            "options": [
              "similar",
              "the same"
            ],
            "answers": [
              "similar"
            ]
          },
          {
            "prompt": "____ unemployment / worries",
            "options": [
              "various",
              "soaring"
            ],
            "answers": [
              "soaring"
            ]
          }
        ]
      },
      {
        "type": "synonyms",
        "title": "EXERCISE 2 - Synonyms Test",
        "instruction": "Verilen sözcüğe anlamca yakın (eş anlamlı) TÜM sözcükleri seçiniz.",
        "multi": true,
        "questions": [
          {
            "prompt": "growing",
            "options": [
              "lessening",
              "quick",
              "constant",
              "increasing",
              "eternal"
            ],
            "answers": [
              "increasing"
            ]
          },
          {
            "prompt": "rapid",
            "options": [
              "swift",
              "abrupt",
              "instant",
              "growing",
              "varied"
            ],
            "answers": [
              "swift"
            ]
          },
          {
            "prompt": "varied",
            "options": [
              "permanent",
              "similar",
              "various",
              "identical",
              "growing"
            ],
            "answers": [
              "various"
            ]
          },
          {
            "prompt": "mounting",
            "options": [
              "equal",
              "slow",
              "increasing",
              "growing",
              "sudden"
            ],
            "answers": [
              "increasing",
              "growing"
            ]
          },
          {
            "prompt": "quick",
            "options": [
              "increasing",
              "swift",
              "similar",
              "lessening",
              "prompt"
            ],
            "answers": [
              "swift",
              "prompt"
            ]
          },
          {
            "prompt": "permanent",
            "options": [
              "lasting",
              "rapid",
              "varied",
              "even",
              "instant"
            ],
            "answers": [
              "lasting"
            ]
          },
          {
            "prompt": "swift",
            "options": [
              "quick",
              "rapid",
              "prompt",
              "eternal",
              "mounting"
            ],
            "answers": [
              "prompt",
              "quick",
              "rapid"
            ]
          },
          {
            "prompt": "gradual",
            "options": [
              "immediate",
              "equal",
              "increasing",
              "slow",
              "instant"
            ],
            "answers": [
              "slow"
            ]
          },
          {
            "prompt": "eternal",
            "options": [
              "permanent",
              "lasting",
              "resembling",
              "increasing",
              "constant"
            ],
            "answers": [
              "permanent",
              "lasting",
              "constant"
            ]
          },
          {
            "prompt": "resembling",
            "options": [
              "similar",
              "relevant",
              "permanent",
              "slow",
              "constant"
            ],
            "answers": [
              "similar",
              "relevant"
            ]
          },
          {
            "prompt": "even",
            "options": [
              "increasing",
              "eternal",
              "abrupt",
              "equal",
              "sudden"
            ],
            "answers": [
              "equal"
            ]
          },
          {
            "prompt": "increasing",
            "options": [
              "soaring",
              "permanent",
              "growing",
              "immediate",
              "similar"
            ],
            "answers": [
              "growing",
              "soaring"
            ]
          }
        ]
      },
      {
        "type": "sentence",
        "title": "EXERCISE 3 - Sentence Completion",
        "instruction": "Cümleyi doğru tamamlayan ifadeyi seçiniz.",
        "multi": false,
        "questions": [
          {
            "prompt": "Tourists have to sign ____ documents before visiting another country.",
            "options": [
              "various",
              "slow"
            ],
            "answers": [
              "various"
            ]
          },
          {
            "prompt": "A significant number of car accidents cause ____ damage.",
            "options": [
              "fast",
              "permanent"
            ],
            "answers": [
              "permanent"
            ]
          },
          {
            "prompt": "A good education system should provide ____ opportunities for all children.",
            "options": [
              "equal",
              "abrupt"
            ],
            "answers": [
              "equal"
            ]
          },
          {
            "prompt": "Ali kept in ____ contact with his family while he was abroad.",
            "options": [
              "constant",
              "unlike"
            ],
            "answers": [
              "constant"
            ]
          },
          {
            "prompt": "These two coins may look ____ but one of them is a forgery.",
            "options": [
              "the same",
              "ascending"
            ],
            "answers": [
              "the same"
            ]
          },
          {
            "prompt": "Rebuilding a country's economy is a long and ____ process.",
            "options": [
              "sudden",
              "slow"
            ],
            "answers": [
              "slow"
            ]
          },
          {
            "prompt": "This picture is ____ to the one in the museum of Modern Art.",
            "options": [
              "identical",
              "lessening"
            ],
            "answers": [
              "identical"
            ]
          },
          {
            "prompt": "One's stress level increases rapidly with ____ temperature.",
            "options": [
              "slow",
              "increasing"
            ],
            "answers": [
              "increasing"
            ]
          },
          {
            "prompt": "Applicants must hold a degree in accounting or a ____ field.",
            "options": [
              "related",
              "permanent"
            ],
            "answers": [
              "related"
            ]
          },
          {
            "prompt": "The patient was admitted to hospital with a ____ temperature.",
            "options": [
              "varied",
              "soaring"
            ],
            "answers": [
              "soaring"
            ]
          },
          {
            "prompt": "The Russian President's speech is strikingly ____ to the American president's.",
            "options": [
              "decreasing",
              "similar"
            ],
            "answers": [
              "similar"
            ]
          },
          {
            "prompt": "Rural communities are struggling because of ____ resources due to drought.",
            "options": [
              "declining",
              "soaring"
            ],
            "answers": [
              "declining"
            ]
          },
          {
            "prompt": "There has been a ____ increase in the population recently.",
            "options": [
              "alike",
              "rapid"
            ],
            "answers": [
              "rapid"
            ]
          },
          {
            "prompt": "Let's grab a ____ lunch at that small coffee shop.",
            "options": [
              "quick",
              "increasing"
            ],
            "answers": [
              "quick"
            ]
          },
          {
            "prompt": "Underwater cables permit ____ communication between the continents.",
            "options": [
              "instant",
              "descending"
            ],
            "answers": [
              "instant"
            ]
          },
          {
            "prompt": "____ changes in your life may lead to depression.",
            "options": [
              "Sudden",
              "Identical"
            ],
            "answers": [
              "Sudden"
            ]
          },
          {
            "prompt": "Until we all give up violence, there cannot be ____ peace in the world.",
            "options": [
              "lasting",
              "identical"
            ],
            "answers": [
              "lasting"
            ]
          },
          {
            "prompt": "The committee had to make an ____ change to spend less money.",
            "options": [
              "abrupt",
              "lessening"
            ],
            "answers": [
              "abrupt"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "adj-6",
    "category": "adjectives",
    "tableNo": 6,
    "groups": [
      {
        "theme": "zıt, karşıt, muhalif",
        "words": [
          "opposing",
          "contrary"
        ]
      },
      {
        "theme": "uyumsuz, uyuşmaz",
        "words": [
          "incompatible",
          "alien",
          "foreign"
        ]
      },
      {
        "theme": "kötü, olumsuz",
        "words": [
          "adverse",
          "unfavourable",
          "terrible",
          "awful"
        ]
      },
      {
        "theme": "verimsiz, kısır",
        "words": [
          "barren",
          "infertile",
          "arid",
          "fruitless"
        ]
      },
      {
        "theme": "acı, sert",
        "words": [
          "bitter",
          "harsh",
          "severe"
        ]
      },
      {
        "theme": "karmaşık, kafa karıştırıcı",
        "words": [
          "confusing",
          "puzzling",
          "perplexing"
        ]
      },
      {
        "theme": "tartışmalı",
        "words": [
          "controversial",
          "contradictory"
        ]
      },
      {
        "theme": "zalim, acımasız",
        "words": [
          "cruel",
          "brutal",
          "evil"
        ]
      },
      {
        "theme": "yozlaşmış, ahlak dışı",
        "words": [
          "corrupt",
          "immoral",
          "dishonest",
          "misleading"
        ]
      },
      {
        "theme": "sahte, korsan",
        "words": [
          "counterfeit",
          "forged",
          "false"
        ]
      }
    ],
    "exercises": [
      {
        "type": "collocation",
        "title": "EXERCISE 1 - Collocation Test",
        "instruction": "Aşağıdaki ifadeleri doğru şekilde tamamlayan sözcüğü bulunuz.",
        "multi": false,
        "questions": [
          {
            "prompt": "____ plan",
            "options": [
              "controversial",
              "alien"
            ],
            "answers": [
              "controversial"
            ]
          },
          {
            "prompt": "____ weather",
            "options": [
              "dishonest",
              "terrible"
            ],
            "answers": [
              "terrible"
            ]
          },
          {
            "prompt": "____ money",
            "options": [
              "counterfeit",
              "resisting"
            ],
            "answers": [
              "counterfeit"
            ]
          },
          {
            "prompt": "____ ideas",
            "options": [
              "barren",
              "opposing"
            ],
            "answers": [
              "opposing"
            ]
          },
          {
            "prompt": "____ society",
            "options": [
              "false",
              "corrupt"
            ],
            "answers": [
              "corrupt"
            ]
          },
          {
            "prompt": "____ rate",
            "options": [
              "alarming",
              "opposing"
            ],
            "answers": [
              "alarming"
            ]
          },
          {
            "prompt": "____ impression / accusation",
            "options": [
              "false",
              "arid"
            ],
            "answers": [
              "false"
            ]
          },
          {
            "prompt": "____ murder / attack",
            "options": [
              "barren",
              "brutal"
            ],
            "answers": [
              "brutal"
            ]
          },
          {
            "prompt": "____ questions / explanation",
            "options": [
              "confusing",
              "forged"
            ],
            "answers": [
              "confusing"
            ]
          },
          {
            "prompt": "____ land",
            "options": [
              "infertile",
              "contrary"
            ],
            "answers": [
              "infertile"
            ]
          },
          {
            "prompt": "____ with the new computer",
            "options": [
              "incompatible",
              "arid"
            ],
            "answers": [
              "incompatible"
            ]
          },
          {
            "prompt": "____ depression",
            "options": [
              "severe",
              "corrupt"
            ],
            "answers": [
              "severe"
            ]
          },
          {
            "prompt": "a/an ____ language",
            "options": [
              "alarming",
              "foreign"
            ],
            "answers": [
              "foreign"
            ]
          },
          {
            "prompt": "____ statements / claims",
            "options": [
              "forged",
              "contradictory"
            ],
            "answers": [
              "contradictory"
            ]
          },
          {
            "prompt": "a ____ ID card",
            "options": [
              "fake",
              "harsh"
            ],
            "answers": [
              "fake"
            ]
          },
          {
            "prompt": "____ regions / land",
            "options": [
              "arid",
              "contradictory"
            ],
            "answers": [
              "arid"
            ]
          }
        ]
      },
      {
        "type": "synonyms",
        "title": "EXERCISE 2 - Synonyms Test",
        "instruction": "Verilen sözcüğe anlamca yakın (eş anlamlı) TÜM sözcükleri seçiniz.",
        "multi": true,
        "questions": [
          {
            "prompt": "alien",
            "options": [
              "incompatible",
              "brutal",
              "awful",
              "misleading",
              "harsh"
            ],
            "answers": [
              "incompatible"
            ]
          },
          {
            "prompt": "foreign",
            "options": [
              "unfavourable",
              "alien",
              "incompatible",
              "corrupt",
              "controversial"
            ],
            "answers": [
              "incompatible",
              "alien"
            ]
          },
          {
            "prompt": "harsh",
            "options": [
              "contrary",
              "bitter",
              "cruel",
              "terrible",
              "severe"
            ],
            "answers": [
              "bitter",
              "severe"
            ]
          },
          {
            "prompt": "perplexing",
            "options": [
              "counterfeit",
              "unfavourable",
              "confusing",
              "puzzling",
              "dishonest"
            ],
            "answers": [
              "confusing",
              "puzzling"
            ]
          },
          {
            "prompt": "bitter",
            "options": [
              "severe",
              "misleading",
              "harsh",
              "corrupt",
              "alien"
            ],
            "answers": [
              "harsh",
              "severe"
            ]
          },
          {
            "prompt": "opposing",
            "options": [
              "arid",
              "misleading",
              "adverse",
              "barren",
              "contrary"
            ],
            "answers": [
              "contrary"
            ]
          },
          {
            "prompt": "misleading",
            "options": [
              "confusing",
              "forged",
              "perplexing",
              "opposing",
              "corrupt"
            ],
            "answers": [
              "corrupt"
            ]
          },
          {
            "prompt": "incompatible",
            "options": [
              "brutal",
              "corrupt",
              "adverse",
              "foreign",
              "alien"
            ],
            "answers": [
              "alien",
              "foreign"
            ]
          },
          {
            "prompt": "adverse",
            "options": [
              "controversial",
              "terrible",
              "unfavourable",
              "barren",
              "contrary"
            ],
            "answers": [
              "unfavourable",
              "terrible"
            ]
          },
          {
            "prompt": "fruitless",
            "options": [
              "false",
              "contradictory",
              "infertile",
              "harsh",
              "barren"
            ],
            "answers": [
              "barren",
              "infertile"
            ]
          },
          {
            "prompt": "evil",
            "options": [
              "cruel",
              "awful",
              "brutal",
              "immoral",
              "controversial"
            ],
            "answers": [
              "cruel",
              "brutal"
            ]
          },
          {
            "prompt": "confusing",
            "options": [
              "puzzling",
              "false",
              "perplexing",
              "fruitless",
              "adverse"
            ],
            "answers": [
              "puzzling",
              "perplexing"
            ]
          }
        ]
      },
      {
        "type": "sentence",
        "title": "EXERCISE 3 - Sentence Completion",
        "instruction": "Cümleyi doğru tamamlayan ifadeyi seçiniz.",
        "multi": false,
        "questions": [
          {
            "prompt": "A global oil crisis could have an ____ effect on financial markets.",
            "options": [
              "arid",
              "adverse"
            ],
            "answers": [
              "adverse"
            ]
          },
          {
            "prompt": "Gangsters were arrested for making ____ computer chips.",
            "options": [
              "brutal",
              "counterfeit"
            ],
            "answers": [
              "counterfeit"
            ]
          },
          {
            "prompt": "Throughout the negotiations, they took ____ views.",
            "options": [
              "opposing",
              "foreign"
            ],
            "answers": [
              "opposing"
            ]
          },
          {
            "prompt": "If Sam fails, it will be a ____ disappointment to his parents.",
            "options": [
              "bitter",
              "infertile"
            ],
            "answers": [
              "bitter"
            ]
          },
          {
            "prompt": "The electric chair is a ____ method of execution.",
            "options": [
              "fake",
              "cruel"
            ],
            "answers": [
              "cruel"
            ]
          },
          {
            "prompt": "The most probable cause of starvation is the soil being ____.",
            "options": [
              "infertile",
              "dishonest"
            ],
            "answers": [
              "infertile"
            ]
          },
          {
            "prompt": "Jan's last-minute decision not to race was very ____.",
            "options": [
              "puzzling",
              "barren"
            ],
            "answers": [
              "puzzling"
            ]
          },
          {
            "prompt": "The student's behaviour is clearly ____ the expectations of the college.",
            "options": [
              "at odds with",
              "corrupt"
            ],
            "answers": [
              "at odds with"
            ]
          },
          {
            "prompt": "The police force there is small, ____ and ill-trained.",
            "options": [
              "arid",
              "corrupt"
            ],
            "answers": [
              "corrupt"
            ]
          },
          {
            "prompt": "Water from the Great Lakes is pumped to ____ regions.",
            "options": [
              "arid",
              "confusing"
            ],
            "answers": [
              "arid"
            ]
          },
          {
            "prompt": "Candidates must decide quickly, but they sometimes have ____ information.",
            "options": [
              "arid",
              "contradictory"
            ],
            "answers": [
              "contradictory"
            ]
          },
          {
            "prompt": "Some people sell ____ Rolex watches on the market stall.",
            "options": [
              "brutal",
              "fake"
            ],
            "answers": [
              "fake"
            ]
          },
          {
            "prompt": "There is no address, and the writing is in a ____ language.",
            "options": [
              "foreign",
              "alarming"
            ],
            "answers": [
              "foreign"
            ]
          },
          {
            "prompt": "Everyone is shocked due to the ____ murder of a young mother.",
            "options": [
              "alien",
              "brutal"
            ],
            "answers": [
              "brutal"
            ]
          },
          {
            "prompt": "The victims generally suffer ____ head injuries in car accidents.",
            "options": [
              "dishonest",
              "severe"
            ],
            "answers": [
              "severe"
            ]
          },
          {
            "prompt": "I think he was being ____ as he was telling too many lies.",
            "options": [
              "dishonest",
              "infertile"
            ],
            "answers": [
              "dishonest"
            ]
          },
          {
            "prompt": "Something ____ might happen to children in the kitchen.",
            "options": [
              "terrible",
              "alien"
            ],
            "answers": [
              "terrible"
            ]
          },
          {
            "prompt": "The road signs were very ____ and we ended up getting lost.",
            "options": [
              "barren",
              "confusing"
            ],
            "answers": [
              "confusing"
            ]
          },
          {
            "prompt": "The sea here is very ____ - it looks calm but is dangerous.",
            "options": [
              "fruitless",
              "deceptive"
            ],
            "answers": [
              "deceptive"
            ]
          },
          {
            "prompt": "The officials cancelled rescue efforts after three days of ____ searching.",
            "options": [
              "arid",
              "fruitless"
            ],
            "answers": [
              "fruitless"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "adj-7",
    "category": "adjectives",
    "tableNo": 7,
    "groups": [
      {
        "theme": "yaşamaya elverişsiz",
        "words": [
          "inhospitable",
          "uninhabitable"
        ]
      },
      {
        "theme": "kızdıran, üzen",
        "words": [
          "disappointing",
          "frustrating",
          "annoying",
          "upsetting"
        ]
      },
      {
        "theme": "beyhude, faydasız, demode",
        "words": [
          "futile",
          "pointless",
          "useless",
          "obsolete"
        ]
      },
      {
        "theme": "düşmanca, saldırgan",
        "words": [
          "antagonistic",
          "hostile"
        ]
      },
      {
        "theme": "iğrenç, ürkütücü",
        "words": [
          "disgusting",
          "nasty",
          "frightening",
          "horrifying"
        ]
      },
      {
        "theme": "bozuk, çalışmayan",
        "words": [
          "malfunctioning",
          "broken",
          "out of order"
        ]
      },
      {
        "theme": "kötü huylu, fena",
        "words": [
          "malignant",
          "wicked",
          "bad"
        ]
      },
      {
        "theme": "iyi, zararsız",
        "words": [
          "benign",
          "gentle",
          "harmless"
        ]
      },
      {
        "theme": "kötüye kullanan, aşağılayan",
        "words": [
          "abusive",
          "insulting",
          "humiliating",
          "embarrassing",
          "shameful"
        ]
      },
      {
        "theme": "etik olmayan, ahlak dışı",
        "words": [
          "unethical",
          "immoral"
        ]
      },
      {
        "theme": "zararlı, tehlikeli",
        "words": [
          "detrimental",
          "harmful",
          "hazardous",
          "dangerous",
          "lethal"
        ]
      }
    ],
    "exercises": [
      {
        "type": "collocation",
        "title": "EXERCISE 1 - Collocation Test",
        "instruction": "Aşağıdaki ifadeleri doğru şekilde tamamlayan sözcüğü bulunuz.",
        "multi": false,
        "questions": [
          {
            "prompt": "____ neighbourhood / area",
            "options": [
              "dangerous",
              "broken"
            ],
            "answers": [
              "dangerous"
            ]
          },
          {
            "prompt": "____ attitude",
            "options": [
              "broken",
              "hostile"
            ],
            "answers": [
              "hostile"
            ]
          },
          {
            "prompt": "____ questions",
            "options": [
              "embarrassing",
              "lethal"
            ],
            "answers": [
              "embarrassing"
            ]
          },
          {
            "prompt": "____ act",
            "options": [
              "benign",
              "immoral"
            ],
            "answers": [
              "immoral"
            ]
          },
          {
            "prompt": "a/an ____ piece of information",
            "options": [
              "uninhabitable",
              "useless"
            ],
            "answers": [
              "useless"
            ]
          },
          {
            "prompt": "____ medical practices",
            "options": [
              "out of order",
              "unethical"
            ],
            "answers": [
              "unethical"
            ]
          },
          {
            "prompt": "____ region",
            "options": [
              "inhospitable",
              "immoral"
            ],
            "answers": [
              "inhospitable"
            ]
          },
          {
            "prompt": "a/an ____ effort",
            "options": [
              "inhospitable",
              "futile"
            ],
            "answers": [
              "futile"
            ]
          },
          {
            "prompt": "____ comment / behaviour",
            "options": [
              "obsolete",
              "humiliating"
            ],
            "answers": [
              "humiliating"
            ]
          },
          {
            "prompt": "____ airway disease",
            "options": [
              "obstructive",
              "disgraceful"
            ],
            "answers": [
              "obstructive"
            ]
          },
          {
            "prompt": "____ substance",
            "options": [
              "harmful",
              "inhospitable"
            ],
            "answers": [
              "harmful"
            ]
          },
          {
            "prompt": "____ behaviour / attitude",
            "options": [
              "out of order",
              "aggressive"
            ],
            "answers": [
              "aggressive"
            ]
          },
          {
            "prompt": "____ nuclear arsenal",
            "options": [
              "formidable",
              "gentle"
            ],
            "answers": [
              "formidable"
            ]
          },
          {
            "prompt": "____ injection",
            "options": [
              "uninhabitable",
              "lethal"
            ],
            "answers": [
              "lethal"
            ]
          },
          {
            "prompt": "____ performance",
            "options": [
              "broken",
              "disappointing"
            ],
            "answers": [
              "disappointing"
            ]
          },
          {
            "prompt": "____ to health",
            "options": [
              "hazardous",
              "shameful"
            ],
            "answers": [
              "hazardous"
            ]
          }
        ]
      },
      {
        "type": "synonyms",
        "title": "EXERCISE 2 - Synonyms Test",
        "instruction": "Verilen sözcüğe anlamca yakın (eş anlamlı) TÜM sözcükleri seçiniz.",
        "multi": true,
        "questions": [
          {
            "prompt": "obsolete",
            "options": [
              "lethal",
              "futile",
              "hostile",
              "frightening",
              "pointless"
            ],
            "answers": [
              "futile",
              "pointless"
            ]
          },
          {
            "prompt": "abusive",
            "options": [
              "insulting",
              "out of order",
              "immoral",
              "useless",
              "futile"
            ],
            "answers": [
              "insulting"
            ]
          },
          {
            "prompt": "out of order",
            "options": [
              "embarrassing",
              "malfunctioning",
              "broken",
              "useless",
              "abusive"
            ],
            "answers": [
              "malfunctioning",
              "broken"
            ]
          },
          {
            "prompt": "frightening",
            "options": [
              "bad",
              "wicked",
              "futile",
              "detrimental",
              "disgusting"
            ],
            "answers": [
              "disgusting"
            ]
          },
          {
            "prompt": "futile",
            "options": [
              "abusive",
              "pointless",
              "frightening",
              "useless",
              "unethical"
            ],
            "answers": [
              "pointless",
              "useless"
            ]
          },
          {
            "prompt": "detrimental",
            "options": [
              "shameful",
              "harmful",
              "broken",
              "hazardous",
              "uninhabitable"
            ],
            "answers": [
              "harmful",
              "hazardous"
            ]
          },
          {
            "prompt": "insulting",
            "options": [
              "inhospitable",
              "antagonistic",
              "abusive",
              "upsetting",
              "gentle"
            ],
            "answers": [
              "abusive"
            ]
          },
          {
            "prompt": "disgusting",
            "options": [
              "nasty",
              "uninhabitable",
              "malignant",
              "annoying",
              "detrimental"
            ],
            "answers": [
              "nasty"
            ]
          },
          {
            "prompt": "humiliating",
            "options": [
              "abusive",
              "lethal",
              "embarrassing",
              "dangerous",
              "insulting"
            ],
            "answers": [
              "abusive",
              "insulting",
              "embarrassing"
            ]
          },
          {
            "prompt": "unethical",
            "options": [
              "harmful",
              "immoral",
              "obsolete",
              "bad",
              "humiliating"
            ],
            "answers": [
              "immoral"
            ]
          },
          {
            "prompt": "lethal",
            "options": [
              "useless",
              "detrimental",
              "wicked",
              "inhospitable",
              "harmful"
            ],
            "answers": [
              "detrimental",
              "harmful"
            ]
          },
          {
            "prompt": "frustrating",
            "options": [
              "embarrassing",
              "detrimental",
              "benign",
              "disappointing",
              "hostile"
            ],
            "answers": [
              "disappointing"
            ]
          }
        ]
      },
      {
        "type": "sentence",
        "title": "EXERCISE 3 - Sentence Completion",
        "instruction": "Cümleyi doğru tamamlayan ifadeyi seçiniz.",
        "multi": false,
        "questions": [
          {
            "prompt": "It is ____ to discuss an issue again and again; we should act.",
            "options": [
              "gentle",
              "pointless"
            ],
            "answers": [
              "pointless"
            ]
          },
          {
            "prompt": "A ____ tumour was detected in Jack's lungs and successfully removed.",
            "options": [
              "benign",
              "immoral"
            ],
            "answers": [
              "benign"
            ]
          },
          {
            "prompt": "Electric cars are relatively safe, and not ____ to the environment.",
            "options": [
              "harmful",
              "embarrassing"
            ],
            "answers": [
              "harmful"
            ]
          },
          {
            "prompt": "Antarctica is covered by ice and is ____ for people.",
            "options": [
              "uninhabitable",
              "insulting"
            ],
            "answers": [
              "uninhabitable"
            ]
          },
          {
            "prompt": "While driving, anxiety attacks can be a truly ____ experience.",
            "options": [
              "horrifying",
              "unethical"
            ],
            "answers": [
              "horrifying"
            ]
          },
          {
            "prompt": "Talking about childhood memories can sometimes be ____ for teenagers.",
            "options": [
              "humiliating",
              "inhospitable"
            ],
            "answers": [
              "humiliating"
            ]
          },
          {
            "prompt": "It is ____ to reveal your friend's secret.",
            "options": [
              "out of order",
              "immoral"
            ],
            "answers": [
              "immoral"
            ]
          },
          {
            "prompt": "The team lost 7-1. The score was ____ for the fans.",
            "options": [
              "frustrating",
              "gentle"
            ],
            "answers": [
              "frustrating"
            ]
          },
          {
            "prompt": "The old patient is dying and further treatment is ____.",
            "options": [
              "benign",
              "useless"
            ],
            "answers": [
              "useless"
            ]
          },
          {
            "prompt": "I think the doorbell must be ____ - I didn't hear anything.",
            "options": [
              "frightening",
              "broken"
            ],
            "answers": [
              "broken"
            ]
          },
          {
            "prompt": "She developed a ____ tumour in her breast.",
            "options": [
              "malignant",
              "unethical"
            ],
            "answers": [
              "malignant"
            ]
          },
          {
            "prompt": "The chemicals in paint can be ____ to health.",
            "options": [
              "shameful",
              "hazardous"
            ],
            "answers": [
              "hazardous"
            ]
          },
          {
            "prompt": "It is ____ to see people drop litter on the streets.",
            "options": [
              "annoying",
              "good"
            ],
            "answers": [
              "annoying"
            ]
          },
          {
            "prompt": "The man was accused of ____ behaviour and assaulting an officer.",
            "options": [
              "gentle",
              "insulting"
            ],
            "answers": [
              "insulting"
            ]
          },
          {
            "prompt": "Kevin made one last ____ attempt to persuade Sandra, then left.",
            "options": [
              "broken",
              "futile"
            ],
            "answers": [
              "futile"
            ]
          },
          {
            "prompt": "The director has to replace the ____ machine with a better one.",
            "options": [
              "malfunctioning",
              "hostile"
            ],
            "answers": [
              "malfunctioning"
            ]
          },
          {
            "prompt": "At home with the family, my grandfather was always quiet and ____.",
            "options": [
              "gentle",
              "dangerous"
            ],
            "answers": [
              "gentle"
            ]
          },
          {
            "prompt": "The doctor asked me a lot of ____ questions about my private life.",
            "options": [
              "uninhabitable",
              "embarrassing"
            ],
            "answers": [
              "embarrassing"
            ]
          },
          {
            "prompt": "It's too ____ to try to land the plane in this terrible weather.",
            "options": [
              "benign",
              "dangerous"
            ],
            "answers": [
              "dangerous"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "adj-8",
    "category": "adjectives",
    "tableNo": 8,
    "groups": [
      {
        "theme": "bilinçli, farkında",
        "words": [
          "conscious",
          "aware"
        ]
      },
      {
        "theme": "faydalı, yararlı",
        "words": [
          "beneficial",
          "helpful",
          "useful"
        ]
      },
      {
        "theme": "muhteşem, görülmeye değer",
        "words": [
          "fascinating",
          "picturesque",
          "magnificent"
        ]
      },
      {
        "theme": "verimli, doğurgan",
        "words": [
          "fertile",
          "productive",
          "fruitful",
          "prolific"
        ]
      },
      {
        "theme": "zarif, çekici",
        "words": [
          "graceful",
          "alluring",
          "appealing",
          "charming"
        ]
      },
      {
        "theme": "etkileyici, heyecan verici",
        "words": [
          "impressive",
          "striking",
          "thrilling",
          "exciting"
        ]
      },
      {
        "theme": "kayda değer",
        "words": [
          "remarkable",
          "noteworthy",
          "considerable"
        ]
      },
      {
        "theme": "zeki, dahi, akıllıca",
        "words": [
          "ingenious",
          "clever",
          "brilliant",
          "intelligent"
        ]
      },
      {
        "theme": "masum",
        "words": [
          "innocent",
          "blameless"
        ]
      },
      {
        "theme": "umut vaat eden, yetenekli",
        "words": [
          "promising",
          "gifted",
          "talented"
        ]
      }
    ],
    "exercises": [
      {
        "type": "collocation",
        "title": "EXERCISE 1 - Collocation Test",
        "instruction": "Aşağıdaki ifadeleri doğru şekilde tamamlayan sözcüğü bulunuz.",
        "multi": false,
        "questions": [
          {
            "prompt": "____ effects on the economy",
            "options": [
              "beneficial",
              "gifted"
            ],
            "answers": [
              "beneficial"
            ]
          },
          {
            "prompt": "____ musician",
            "options": [
              "blameless",
              "gifted"
            ],
            "answers": [
              "gifted"
            ]
          },
          {
            "prompt": "a/an ____ number of people",
            "options": [
              "substantial",
              "ingenious"
            ],
            "answers": [
              "substantial"
            ]
          },
          {
            "prompt": "____ of danger / risks",
            "options": [
              "excellent",
              "aware"
            ],
            "answers": [
              "aware"
            ]
          },
          {
            "prompt": "____ cropland",
            "options": [
              "talented",
              "fertile"
            ],
            "answers": [
              "fertile"
            ]
          },
          {
            "prompt": "her ____ English",
            "options": [
              "excellent",
              "aware of"
            ],
            "answers": [
              "excellent"
            ]
          },
          {
            "prompt": "the ____ magic of Hong Kong",
            "options": [
              "talented",
              "alluring"
            ],
            "answers": [
              "alluring"
            ]
          },
          {
            "prompt": "____ advice",
            "options": [
              "useful",
              "gifted"
            ],
            "answers": [
              "useful"
            ]
          },
          {
            "prompt": "a ____ achievement",
            "options": [
              "noteworthy",
              "blameless"
            ],
            "answers": [
              "noteworthy"
            ]
          },
          {
            "prompt": "____ phones",
            "options": [
              "conscious",
              "smart"
            ],
            "answers": [
              "smart"
            ]
          },
          {
            "prompt": "a ____ journalist",
            "options": [
              "talented",
              "substantial"
            ],
            "answers": [
              "talented"
            ]
          },
          {
            "prompt": "a/an ____ mistake",
            "options": [
              "innocent",
              "charming"
            ],
            "answers": [
              "innocent"
            ]
          },
          {
            "prompt": "a ____ young actor / football player",
            "options": [
              "blameless",
              "promising"
            ],
            "answers": [
              "promising"
            ]
          },
          {
            "prompt": "a ____ victory / experience",
            "options": [
              "thrilling",
              "talented"
            ],
            "answers": [
              "thrilling"
            ]
          },
          {
            "prompt": "____ progress / increase",
            "options": [
              "aware of",
              "remarkable"
            ],
            "answers": [
              "remarkable"
            ]
          },
          {
            "prompt": "____ results / scenery / view",
            "options": [
              "impressive",
              "gifted"
            ],
            "answers": [
              "impressive"
            ]
          }
        ]
      },
      {
        "type": "synonyms",
        "title": "EXERCISE 2 - Synonyms Test",
        "instruction": "Verilen sözcüğe anlamca yakın (eş anlamlı) TÜM sözcükleri seçiniz.",
        "multi": true,
        "questions": [
          {
            "prompt": "fruitful",
            "options": [
              "fertile",
              "exciting",
              "clever",
              "prolific",
              "productive"
            ],
            "answers": [
              "fertile",
              "productive",
              "prolific"
            ]
          },
          {
            "prompt": "charming",
            "options": [
              "graceful",
              "innocent",
              "useful",
              "alluring",
              "noteworthy"
            ],
            "answers": [
              "graceful",
              "alluring"
            ]
          },
          {
            "prompt": "conscious",
            "options": [
              "productive",
              "charming",
              "blameless",
              "thrilling",
              "aware"
            ],
            "answers": [
              "aware"
            ]
          },
          {
            "prompt": "innocent",
            "options": [
              "impressive",
              "graceful",
              "striking",
              "brilliant",
              "blameless"
            ],
            "answers": [
              "blameless"
            ]
          },
          {
            "prompt": "thrilling",
            "options": [
              "striking",
              "alluring",
              "impressive",
              "fertile",
              "intelligent"
            ],
            "answers": [
              "impressive",
              "striking"
            ]
          },
          {
            "prompt": "useful",
            "options": [
              "beneficial",
              "promising",
              "charming",
              "helpful",
              "fertile"
            ],
            "answers": [
              "beneficial",
              "helpful"
            ]
          },
          {
            "prompt": "graceful",
            "options": [
              "appealing",
              "productive",
              "ingenious",
              "innocent",
              "alluring"
            ],
            "answers": [
              "alluring",
              "appealing"
            ]
          },
          {
            "prompt": "intelligent",
            "options": [
              "ingenious",
              "exciting",
              "fertile",
              "appealing",
              "blameless"
            ],
            "answers": [
              "ingenious"
            ]
          },
          {
            "prompt": "fascinating",
            "options": [
              "magnificent",
              "remarkable",
              "productive",
              "considerable",
              "picturesque"
            ],
            "answers": [
              "picturesque",
              "magnificent"
            ]
          },
          {
            "prompt": "considerable",
            "options": [
              "intelligent",
              "impressive",
              "noteworthy",
              "beneficial",
              "remarkable"
            ],
            "answers": [
              "remarkable",
              "noteworthy"
            ]
          },
          {
            "prompt": "impressive",
            "options": [
              "brilliant",
              "thrilling",
              "useful",
              "fascinating",
              "striking"
            ],
            "answers": [
              "striking",
              "thrilling"
            ]
          },
          {
            "prompt": "gifted",
            "options": [
              "promising",
              "innocent",
              "talented",
              "remarkable",
              "graceful"
            ],
            "answers": [
              "promising",
              "talented"
            ]
          }
        ]
      },
      {
        "type": "sentence",
        "title": "EXERCISE 3 - Sentence Completion",
        "instruction": "Cümleyi doğru tamamlayan ifadeyi seçiniz.",
        "multi": false,
        "questions": [
          {
            "prompt": "London is one of the most exciting and ____ cities in the world.",
            "options": [
              "talented",
              "fascinating"
            ],
            "answers": [
              "fascinating"
            ]
          },
          {
            "prompt": "The Soviet Union made ____ scientific progress after WWII.",
            "options": [
              "noteworthy",
              "aware"
            ],
            "answers": [
              "noteworthy"
            ]
          },
          {
            "prompt": "Socrates was ____ but unfortunately was sentenced to death.",
            "options": [
              "innocent",
              "alluring"
            ],
            "answers": [
              "innocent"
            ]
          },
          {
            "prompt": "Parents should be ____ that kids listen to every word.",
            "options": [
              "conscious",
              "substantial"
            ],
            "answers": [
              "conscious"
            ]
          },
          {
            "prompt": "____ land and enough rain help farmers to plant more corn.",
            "options": [
              "Fertile",
              "clever"
            ],
            "answers": [
              "Fertile"
            ]
          },
          {
            "prompt": "A ____ number of houses can be damaged by the floods.",
            "options": [
              "substantial",
              "promising"
            ],
            "answers": [
              "substantial"
            ]
          },
          {
            "prompt": "Peter gave up a ____ career in engineering to become a teacher.",
            "options": [
              "innocent",
              "promising"
            ],
            "answers": [
              "promising"
            ]
          },
          {
            "prompt": "Cycling is really ____ to health and the environment.",
            "options": [
              "beneficial",
              "aware"
            ],
            "answers": [
              "beneficial"
            ]
          },
          {
            "prompt": "The professor and her students have very ____ discussions.",
            "options": [
              "talented",
              "fruitful"
            ],
            "answers": [
              "fruitful"
            ]
          },
          {
            "prompt": "Today children are so ____ that they understand almost all adult talk.",
            "options": [
              "blameless",
              "smart"
            ],
            "answers": [
              "smart"
            ]
          },
          {
            "prompt": "Picasso was one of the most ____ artists.",
            "options": [
              "gifted",
              "innocent"
            ],
            "answers": [
              "gifted"
            ]
          },
          {
            "prompt": "The bank gave us a lot of ____ advice about starting a business.",
            "options": [
              "useful",
              "blameless"
            ],
            "answers": [
              "useful"
            ]
          },
          {
            "prompt": "Istanbul offers an ____ combination of palaces and cultural events.",
            "options": [
              "aware",
              "appealing"
            ],
            "answers": [
              "appealing"
            ]
          },
          {
            "prompt": "Many fish have ____ ways of protecting their eggs from predators.",
            "options": [
              "ingenious",
              "hopeful"
            ],
            "answers": [
              "ingenious"
            ]
          },
          {
            "prompt": "Mary is hardworking and has the potential to be an ____ teacher.",
            "options": [
              "blameless",
              "excellent"
            ],
            "answers": [
              "excellent"
            ]
          },
          {
            "prompt": "The Brazilian team includes some highly ____ young players.",
            "options": [
              "blameless",
              "talented"
            ],
            "answers": [
              "talented"
            ]
          },
          {
            "prompt": "Jane is no longer ____ of the people around her, only of herself.",
            "options": [
              "innocent",
              "aware"
            ],
            "answers": [
              "aware"
            ]
          },
          {
            "prompt": "A ____ woman at the tourist office gave us some tips.",
            "options": [
              "helpful",
              "hopeful"
            ],
            "answers": [
              "helpful"
            ]
          },
          {
            "prompt": "The most ____ members of staff are rewarded with bonuses.",
            "options": [
              "productive",
              "blameless"
            ],
            "answers": [
              "productive"
            ]
          },
          {
            "prompt": "China has taken ____ economic steps to become a superpower.",
            "options": [
              "innocent",
              "remarkable"
            ],
            "answers": [
              "remarkable"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "adj-9",
    "category": "adjectives",
    "tableNo": 9,
    "groups": [
      {
        "theme": "kabul edilebilir, makul",
        "words": [
          "acceptable",
          "plausible",
          "reasonable",
          "logical",
          "sound"
        ]
      },
      {
        "theme": "saf, temiz",
        "words": [
          "pure",
          "clean",
          "sanitary",
          "hygienic"
        ]
      },
      {
        "theme": "mütevazi, doğrudan",
        "words": [
          "humble",
          "modest",
          "straightforward"
        ]
      },
      {
        "theme": "yerleşik, hareketsiz",
        "words": [
          "settled",
          "sedentary",
          "inactive"
        ]
      },
      {
        "theme": "bağlantılı",
        "words": [
          "linked",
          "related",
          "associated"
        ]
      },
      {
        "theme": "mevcut, bulunan",
        "words": [
          "existing",
          "vacant",
          "accessible"
        ]
      },
      {
        "theme": "eksik, noksan",
        "words": [
          "lacking",
          "missing",
          "absent"
        ]
      },
      {
        "theme": "belirsiz, açık olmayan",
        "words": [
          "ambiguous",
          "vague",
          "unclear",
          "obscure"
        ]
      },
      {
        "theme": "dirençli, dayanıklı",
        "words": [
          "durable",
          "enduring",
          "robust"
        ]
      },
      {
        "theme": "hassas, zayıf",
        "words": [
          "delicate",
          "fragile",
          "weak"
        ]
      }
    ],
    "exercises": [
      {
        "type": "collocation",
        "title": "EXERCISE 1 - Collocation Test",
        "instruction": "Aşağıdaki ifadeleri doğru şekilde tamamlayan sözcüğü bulunuz.",
        "multi": false,
        "questions": [
          {
            "prompt": "a/an ____ lifestyle",
            "options": [
              "as to",
              "sedentary"
            ],
            "answers": [
              "sedentary"
            ]
          },
          {
            "prompt": "____ rooms / position",
            "options": [
              "vacant",
              "weak"
            ],
            "answers": [
              "vacant"
            ]
          },
          {
            "prompt": "a/an ____ excuse / explanation",
            "options": [
              "reasonable",
              "inactive"
            ],
            "answers": [
              "reasonable"
            ]
          },
          {
            "prompt": "____ with society / family",
            "options": [
              "fragile",
              "associated"
            ],
            "answers": [
              "associated"
            ]
          },
          {
            "prompt": "____ questions / comments",
            "options": [
              "unpolluted",
              "ambiguous"
            ],
            "answers": [
              "ambiguous"
            ]
          },
          {
            "prompt": "____ income / house / lifestyle",
            "options": [
              "modest",
              "pure"
            ],
            "answers": [
              "modest"
            ]
          },
          {
            "prompt": "____ connection / link",
            "options": [
              "sedentary",
              "direct"
            ],
            "answers": [
              "direct"
            ]
          },
          {
            "prompt": "____ criticism",
            "options": [
              "implicit",
              "accessible"
            ],
            "answers": [
              "implicit"
            ]
          },
          {
            "prompt": "____ laws / rules",
            "options": [
              "modest",
              "existing"
            ],
            "answers": [
              "existing"
            ]
          },
          {
            "prompt": "____ economy / item",
            "options": [
              "hygienic",
              "fragile"
            ],
            "answers": [
              "fragile"
            ]
          },
          {
            "prompt": "____ legal phrases / terminology",
            "options": [
              "obscure",
              "vacant"
            ],
            "answers": [
              "obscure"
            ]
          },
          {
            "prompt": "poor ____ conditions at hospital",
            "options": [
              "hygienic",
              "plausible"
            ],
            "answers": [
              "hygienic"
            ]
          },
          {
            "prompt": "____ decisions / conclusion",
            "options": [
              "open",
              "logical"
            ],
            "answers": [
              "logical"
            ]
          },
          {
            "prompt": "____ air / room",
            "options": [
              "clean",
              "straightforward"
            ],
            "answers": [
              "clean"
            ]
          },
          {
            "prompt": "____ to a topic / something",
            "options": [
              "connected",
              "lacking"
            ],
            "answers": [
              "connected"
            ]
          }
        ]
      },
      {
        "type": "synonyms",
        "title": "EXERCISE 2 - Synonyms Test",
        "instruction": "Verilen sözcüğe anlamca yakın (eş anlamlı) TÜM sözcükleri seçiniz.",
        "multi": true,
        "questions": [
          {
            "prompt": "linked",
            "options": [
              "inactive",
              "unclear",
              "related",
              "accessible",
              "pure"
            ],
            "answers": [
              "related"
            ]
          },
          {
            "prompt": "straightforward",
            "options": [
              "humble",
              "obscure",
              "pure",
              "existing",
              "modest"
            ],
            "answers": [
              "humble",
              "modest"
            ]
          },
          {
            "prompt": "delicate",
            "options": [
              "fragile",
              "vague",
              "weak",
              "ambiguous",
              "enduring"
            ],
            "answers": [
              "fragile",
              "weak"
            ]
          },
          {
            "prompt": "associated",
            "options": [
              "sedentary",
              "related",
              "humble",
              "linked",
              "accessible"
            ],
            "answers": [
              "linked",
              "related"
            ]
          },
          {
            "prompt": "settled",
            "options": [
              "robust",
              "related",
              "sedentary",
              "inactive",
              "straightforward"
            ],
            "answers": [
              "sedentary",
              "inactive"
            ]
          },
          {
            "prompt": "acceptable",
            "options": [
              "enduring",
              "straightforward",
              "pure",
              "plausible",
              "reasonable"
            ],
            "answers": [
              "plausible",
              "reasonable"
            ]
          },
          {
            "prompt": "obscure",
            "options": [
              "vague",
              "related",
              "lacking",
              "ambiguous",
              "clean"
            ],
            "answers": [
              "ambiguous",
              "vague"
            ]
          },
          {
            "prompt": "humble",
            "options": [
              "lacking",
              "hygienic",
              "delicate",
              "modest",
              "obscure"
            ],
            "answers": [
              "modest"
            ]
          },
          {
            "prompt": "related",
            "options": [
              "associated",
              "inactive",
              "linked",
              "accessible",
              "robust"
            ],
            "answers": [
              "linked",
              "associated"
            ]
          },
          {
            "prompt": "lacking",
            "options": [
              "vague",
              "absent",
              "existing",
              "sedentary",
              "missing"
            ],
            "answers": [
              "missing",
              "absent"
            ]
          },
          {
            "prompt": "enduring",
            "options": [
              "pure",
              "robust",
              "accessible",
              "vacant",
              "durable"
            ],
            "answers": [
              "durable",
              "robust"
            ]
          },
          {
            "prompt": "fragile",
            "options": [
              "lacking",
              "sedentary",
              "pure",
              "delicate",
              "obscure"
            ],
            "answers": [
              "delicate"
            ]
          }
        ]
      },
      {
        "type": "sentence",
        "title": "EXERCISE 3 - Sentence Completion",
        "instruction": "Cümleyi doğru tamamlayan ifadeyi seçiniz.",
        "multi": false,
        "questions": [
          {
            "prompt": "Some birth defects may be ____ to smoking during pregnancy.",
            "options": [
              "hygienic",
              "linked"
            ],
            "answers": [
              "linked"
            ]
          },
          {
            "prompt": "The ____ building is too small; there are plans to build a new one.",
            "options": [
              "existing",
              "unclear"
            ],
            "answers": [
              "existing"
            ]
          },
          {
            "prompt": "There don't seem to be any ____ rooms in the hotels of Istanbul!",
            "options": [
              "vacant",
              "fragile"
            ],
            "answers": [
              "vacant"
            ]
          },
          {
            "prompt": "After failing her driving tests five times, Jane was ____ in confidence.",
            "options": [
              "lacking",
              "unpolluted"
            ],
            "answers": [
              "lacking"
            ]
          },
          {
            "prompt": "The instructions were ____ and we didn't know which part to run.",
            "options": [
              "ambiguous",
              "modest"
            ],
            "answers": [
              "ambiguous"
            ]
          },
          {
            "prompt": "The relationship between the three was very ____; no one understood it.",
            "options": [
              "accessible",
              "unclear"
            ],
            "answers": [
              "unclear"
            ]
          },
          {
            "prompt": "What you need for bumpy roads is a simple, ____ and inexpensive vehicle.",
            "options": [
              "delicate",
              "durable"
            ],
            "answers": [
              "durable"
            ]
          },
          {
            "prompt": "The museum sent old ____ porcelain objects to specialists to be restored.",
            "options": [
              "reasonable",
              "fragile"
            ],
            "answers": [
              "fragile"
            ]
          },
          {
            "prompt": "I am seeking your professional advice on a very ____ matter.",
            "options": [
              "inactive",
              "delicate"
            ],
            "answers": [
              "delicate"
            ]
          },
          {
            "prompt": "Smoking is no longer considered socially ____ by many people.",
            "options": [
              "acceptable",
              "absent"
            ],
            "answers": [
              "acceptable"
            ]
          },
          {
            "prompt": "Teachers need a ____ amount of time to prepare course work.",
            "options": [
              "reasonable",
              "ambiguous"
            ],
            "answers": [
              "reasonable"
            ]
          },
          {
            "prompt": "Fortunately, large parts of the oceans are still ____ by toxic waste.",
            "options": [
              "reasonable",
              "unpolluted"
            ],
            "answers": [
              "unpolluted"
            ]
          },
          {
            "prompt": "Jason, a scholarship winner, has always been ____ about his achievements.",
            "options": [
              "sanitary",
              "modest"
            ],
            "answers": [
              "modest"
            ]
          },
          {
            "prompt": "Tyler's public image was a ____ contrast to his love for his family.",
            "options": [
              "fragile",
              "direct"
            ],
            "answers": [
              "direct"
            ]
          },
          {
            "prompt": "Jack was tired of moving around and decided to lead a more ____ life.",
            "options": [
              "settled",
              "absent"
            ],
            "answers": [
              "settled"
            ]
          },
          {
            "prompt": "Governments should solve the problems ____ global warming.",
            "options": [
              "lacking of",
              "associated with"
            ],
            "answers": [
              "associated with"
            ]
          },
          {
            "prompt": "It is a ____ site for a new supermarket, with housing nearby.",
            "options": [
              "logical",
              "unclear"
            ],
            "answers": [
              "logical"
            ]
          },
          {
            "prompt": "____ air and water is a necessity of life.",
            "options": [
              "Clean",
              "fragile"
            ],
            "answers": [
              "Clean"
            ]
          },
          {
            "prompt": "Derek is still not sure ____ whether a law office is the right place.",
            "options": [
              "lacking",
              "as to"
            ],
            "answers": [
              "as to"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "adj-10",
    "category": "adjectives",
    "tableNo": 10,
    "groups": [
      {
        "theme": "katı, sıkı",
        "words": [
          "solid",
          "firm",
          "rigid"
        ]
      },
      {
        "theme": "gerçek, orjinal",
        "words": [
          "genuine",
          "authentic",
          "original"
        ]
      },
      {
        "theme": "inanılmaz",
        "words": [
          "incredible",
          "unbelievable"
        ]
      },
      {
        "theme": "savunmasız, yatkın",
        "words": [
          "susceptible",
          "prone",
          "vulnerable",
          "inclined"
        ]
      },
      {
        "theme": "yasal, yasadışı",
        "words": [
          "legal",
          "legitimate",
          "illegal",
          "illicit"
        ]
      },
      {
        "theme": "ölümlü, ölümsüz",
        "words": [
          "mortal",
          "immortal"
        ]
      },
      {
        "theme": "geçersiz, kabul edilemez",
        "words": [
          "invalid",
          "unacceptable",
          "undesirable"
        ]
      },
      {
        "theme": "gelişigüzel, rastgele",
        "words": [
          "random",
          "arbitrary",
          "accidental"
        ]
      },
      {
        "theme": "istikrarsız, geçici",
        "words": [
          "unstable",
          "volatile"
        ]
      },
      {
        "theme": "uygun, doğru",
        "words": [
          "convenient",
          "suitable",
          "correct"
        ]
      }
    ],
    "exercises": [
      {
        "type": "collocation",
        "title": "EXERCISE 1 - Collocation Test",
        "instruction": "Aşağıdaki ifadeleri doğru şekilde tamamlayan sözcüğü bulunuz.",
        "multi": false,
        "questions": [
          {
            "prompt": "____ password",
            "options": [
              "invalid",
              "mortal"
            ],
            "answers": [
              "invalid"
            ]
          },
          {
            "prompt": "____ diamond / leather",
            "options": [
              "genuine",
              "relevant"
            ],
            "answers": [
              "genuine"
            ]
          },
          {
            "prompt": "____ political situation / markets",
            "options": [
              "random",
              "volatile"
            ],
            "answers": [
              "volatile"
            ]
          },
          {
            "prompt": "____ limit of alcohol",
            "options": [
              "legal",
              "accidental"
            ],
            "answers": [
              "legal"
            ]
          },
          {
            "prompt": "____ answer",
            "options": [
              "illicit",
              "correct"
            ],
            "answers": [
              "correct"
            ]
          },
          {
            "prompt": "____ love / beings in mythology",
            "options": [
              "relevant",
              "immortal"
            ],
            "answers": [
              "immortal"
            ]
          },
          {
            "prompt": "____ decision",
            "options": [
              "arbitrary",
              "immortal"
            ],
            "answers": [
              "arbitrary"
            ]
          },
          {
            "prompt": "____ levels of pollution / behaviour",
            "options": [
              "unacceptable",
              "accidental"
            ],
            "answers": [
              "unacceptable"
            ]
          },
          {
            "prompt": "____ as a rock / object",
            "options": [
              "random",
              "solid"
            ],
            "answers": [
              "solid"
            ]
          },
          {
            "prompt": "____ rules / parents / diet",
            "options": [
              "strict",
              "immortal"
            ],
            "answers": [
              "strict"
            ]
          },
          {
            "prompt": "a/an ____ house for a large family",
            "options": [
              "illegal",
              "suitable"
            ],
            "answers": [
              "suitable"
            ]
          },
          {
            "prompt": "a/an ____ talent / performance",
            "options": [
              "unbelievable",
              "strict"
            ],
            "answers": [
              "unbelievable"
            ]
          },
          {
            "prompt": "____ drugs / actions",
            "options": [
              "rigid",
              "illicit"
            ],
            "answers": [
              "illicit"
            ]
          },
          {
            "prompt": "____ to diseases",
            "options": [
              "vulnerable to",
              "compatible with"
            ],
            "answers": [
              "vulnerable to"
            ]
          },
          {
            "prompt": "____ materials / work / design",
            "options": [
              "immortal",
              "authentic"
            ],
            "answers": [
              "authentic"
            ]
          },
          {
            "prompt": "a mentally ____ man",
            "options": [
              "unstable",
              "relevant"
            ],
            "answers": [
              "unstable"
            ]
          }
        ]
      },
      {
        "type": "synonyms",
        "title": "EXERCISE 2 - Synonyms Test",
        "instruction": "Verilen sözcüğe anlamca yakın (eş anlamlı) TÜM sözcükleri seçiniz.",
        "multi": true,
        "questions": [
          {
            "prompt": "unstable",
            "options": [
              "legal",
              "rigid",
              "volatile",
              "correct",
              "mortal"
            ],
            "answers": [
              "volatile"
            ]
          },
          {
            "prompt": "rigid",
            "options": [
              "undesirable",
              "solid",
              "legal",
              "firm",
              "legitimate"
            ],
            "answers": [
              "solid",
              "firm"
            ]
          },
          {
            "prompt": "immortal",
            "options": [
              "mortal",
              "unacceptable",
              "unstable",
              "correct",
              "genuine"
            ],
            "answers": [
              "mortal"
            ]
          },
          {
            "prompt": "genuine",
            "options": [
              "undesirable",
              "authentic",
              "suitable",
              "convenient",
              "original"
            ],
            "answers": [
              "authentic",
              "original"
            ]
          },
          {
            "prompt": "suitable",
            "options": [
              "accidental",
              "convenient",
              "undesirable",
              "rigid",
              "correct"
            ],
            "answers": [
              "convenient",
              "correct"
            ]
          },
          {
            "prompt": "random",
            "options": [
              "correct",
              "invalid",
              "firm",
              "arbitrary",
              "accidental"
            ],
            "answers": [
              "arbitrary",
              "accidental"
            ]
          },
          {
            "prompt": "unbelievable",
            "options": [
              "correct",
              "incredible",
              "unacceptable",
              "vulnerable",
              "genuine"
            ],
            "answers": [
              "incredible"
            ]
          },
          {
            "prompt": "arbitrary",
            "options": [
              "unbelievable",
              "rigid",
              "correct",
              "random",
              "accidental"
            ],
            "answers": [
              "random",
              "accidental"
            ]
          },
          {
            "prompt": "mortal",
            "options": [
              "undesirable",
              "illicit",
              "unacceptable",
              "susceptible",
              "immortal"
            ],
            "answers": [
              "immortal"
            ]
          },
          {
            "prompt": "solid",
            "options": [
              "original",
              "rigid",
              "legitimate",
              "firm",
              "unacceptable"
            ],
            "answers": [
              "firm",
              "rigid"
            ]
          },
          {
            "prompt": "incredible",
            "options": [
              "legal",
              "firm",
              "unbelievable",
              "susceptible",
              "solid"
            ],
            "answers": [
              "unbelievable"
            ]
          },
          {
            "prompt": "inclined",
            "options": [
              "incredible",
              "susceptible",
              "prone",
              "original",
              "mortal"
            ],
            "answers": [
              "susceptible",
              "prone"
            ]
          }
        ]
      },
      {
        "type": "sentence",
        "title": "EXERCISE 3 - Sentence Completion",
        "instruction": "Cümleyi doğru tamamlayan ifadeyi seçiniz.",
        "multi": false,
        "questions": [
          {
            "prompt": "While hunting, Danny received a ____ wound from an accidental shot.",
            "options": [
              "correct",
              "mortal"
            ],
            "answers": [
              "mortal"
            ]
          },
          {
            "prompt": "A passport becomes ____ when the expiry date on it is over.",
            "options": [
              "original",
              "invalid"
            ],
            "answers": [
              "invalid"
            ]
          },
          {
            "prompt": "Are you insured against ____ damage to your property?",
            "options": [
              "suitable",
              "accidental"
            ],
            "answers": [
              "accidental"
            ]
          },
          {
            "prompt": "People are afraid to change jobs in today's ____ economy.",
            "options": [
              "correct",
              "volatile"
            ],
            "answers": [
              "volatile"
            ]
          },
          {
            "prompt": "Certain TV shows are definitely not ____ for children or teenagers.",
            "options": [
              "incredible",
              "suitable"
            ],
            "answers": [
              "suitable"
            ]
          },
          {
            "prompt": "Could we postpone the meeting until a more ____ time?",
            "options": [
              "convenient",
              "mortal"
            ],
            "answers": [
              "convenient"
            ]
          },
          {
            "prompt": "Soil on the mountain slopes is very ____ to erosion.",
            "options": [
              "illegal",
              "susceptible"
            ],
            "answers": [
              "susceptible"
            ]
          },
          {
            "prompt": "A fine is paid when a driver's blood alcohol is over the ____ limit.",
            "options": [
              "irrelevant",
              "legal"
            ],
            "answers": [
              "legal"
            ]
          },
          {
            "prompt": "Most doctors recommend sleeping on a ____ mattress.",
            "options": [
              "firm",
              "illegal"
            ],
            "answers": [
              "firm"
            ]
          },
          {
            "prompt": "The noise is becoming a ____ problem in crowded cities.",
            "options": [
              "correct",
              "real"
            ],
            "answers": [
              "real"
            ]
          },
          {
            "prompt": "Virginia Woolf's writing was completely ____; nothing like it before.",
            "options": [
              "mortal",
              "original"
            ],
            "answers": [
              "original"
            ]
          },
          {
            "prompt": "In ancient societies, discipline was ____ and scandals were rare.",
            "options": [
              "strict",
              "accidental"
            ],
            "answers": [
              "strict"
            ]
          },
          {
            "prompt": "Factories may produce an ____ number of cars per hour.",
            "options": [
              "incredible",
              "volatile"
            ],
            "answers": [
              "incredible"
            ]
          },
          {
            "prompt": "I don't think Sam's arguments are ____ to this discussion.",
            "options": [
              "immortal",
              "relevant"
            ],
            "answers": [
              "relevant"
            ]
          },
          {
            "prompt": "The slopes of the Dikmen valley are particularly ____ to frost in winter.",
            "options": [
              "unstable",
              "prone"
            ],
            "answers": [
              "prone"
            ]
          },
          {
            "prompt": "Experts say ____ diamond exports are worth over $20 billion a year.",
            "options": [
              "irrelevant",
              "illicit"
            ],
            "answers": [
              "illicit"
            ]
          },
          {
            "prompt": "People thought the picture was a ____ Van Gogh, but it is a fake.",
            "options": [
              "volatile",
              "genuine"
            ],
            "answers": [
              "genuine"
            ]
          },
          {
            "prompt": "Most cities in Thailand cannot tolerate ____ levels of pollution.",
            "options": [
              "unacceptable",
              "correct"
            ],
            "answers": [
              "unacceptable"
            ]
          },
          {
            "prompt": "The union believes that ____ drug testing of employees invades privacy.",
            "options": [
              "random",
              "convenient"
            ],
            "answers": [
              "random"
            ]
          },
          {
            "prompt": "You are absolutely ____; the Missouri is the longest river in the US.",
            "options": [
              "prone to",
              "correct"
            ],
            "answers": [
              "correct"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "adj-11",
    "category": "adjectives",
    "tableNo": 11,
    "groups": [
      {
        "theme": "eski, yaşlı",
        "words": [
          "old",
          "elderly"
        ]
      },
      {
        "theme": "uyumlu",
        "words": [
          "matching",
          "corresponding",
          "compatible"
        ]
      },
      {
        "theme": "yeni, modern",
        "words": [
          "novel",
          "fresh",
          "new"
        ]
      },
      {
        "theme": "en son çıkan, güncel",
        "words": [
          "latest",
          "recent",
          "current",
          "up to date"
        ]
      },
      {
        "theme": "gecikmiş, modası geçmiş",
        "words": [
          "overdue",
          "outdated",
          "delayed"
        ]
      }
    ],
    "exercises": [
      {
        "type": "collocation",
        "title": "EXERCISE 1 - Collocation Test",
        "instruction": "Aşağıdaki ifadeleri doğru şekilde tamamlayan sözcüğü bulunuz.",
        "multi": false,
        "questions": [
          {
            "prompt": "____ bacteria / temple",
            "options": [
              "matching",
              "ancient"
            ],
            "answers": [
              "ancient"
            ]
          },
          {
            "prompt": "____ gas bill",
            "options": [
              "overdue",
              "compatible"
            ],
            "answers": [
              "overdue"
            ]
          },
          {
            "prompt": "____ studies of modern sciences",
            "options": [
              "recent",
              "elderly"
            ],
            "answers": [
              "recent"
            ]
          },
          {
            "prompt": "____ people",
            "options": [
              "elderly",
              "latest"
            ],
            "answers": [
              "elderly"
            ]
          },
          {
            "prompt": "a green shirt and a ____ tie",
            "options": [
              "elderly",
              "matching"
            ],
            "answers": [
              "matching"
            ]
          },
          {
            "prompt": "increase in salaries ____ inflation",
            "options": [
              "in line with",
              "outdated"
            ],
            "answers": [
              "in line with"
            ]
          },
          {
            "prompt": "a ____ idea",
            "options": [
              "novel",
              "compatible with"
            ],
            "answers": [
              "novel"
            ]
          },
          {
            "prompt": "Coca-Cola's ____ advertising campaign",
            "options": [
              "elderly",
              "current"
            ],
            "answers": [
              "current"
            ]
          },
          {
            "prompt": "____ civilizations",
            "options": [
              "ancient",
              "overdue"
            ],
            "answers": [
              "ancient"
            ]
          },
          {
            "prompt": "____ with all leading software / new smart phones",
            "options": [
              "up to date",
              "compatible"
            ],
            "answers": [
              "compatible"
            ]
          },
          {
            "prompt": "people who are getting ____",
            "options": [
              "old",
              "recent"
            ],
            "answers": [
              "old"
            ]
          },
          {
            "prompt": "flight ____ by bad weather",
            "options": [
              "latest",
              "delayed"
            ],
            "answers": [
              "delayed"
            ]
          },
          {
            "prompt": "actions ____ words",
            "options": [
              "elderly",
              "in harmony with"
            ],
            "answers": [
              "in harmony with"
            ]
          }
        ]
      },
      {
        "type": "synonyms",
        "title": "EXERCISE 2 - Synonyms Test",
        "instruction": "Verilen sözcüğe anlamca yakın (eş anlamlı) TÜM sözcükleri seçiniz.",
        "multi": true,
        "questions": [
          {
            "prompt": "delayed",
            "options": [
              "compatible",
              "old",
              "latest",
              "overdue",
              "outdated"
            ],
            "answers": [
              "overdue",
              "outdated"
            ]
          },
          {
            "prompt": "current",
            "options": [
              "recent",
              "novel",
              "old",
              "latest",
              "delayed"
            ],
            "answers": [
              "latest",
              "recent"
            ]
          },
          {
            "prompt": "new",
            "options": [
              "overdue",
              "corresponding",
              "fresh",
              "novel",
              "latest"
            ],
            "answers": [
              "novel",
              "fresh"
            ]
          },
          {
            "prompt": "fresh",
            "options": [
              "corresponding",
              "up to date",
              "novel",
              "overdue",
              "compatible"
            ],
            "answers": [
              "novel"
            ]
          },
          {
            "prompt": "compatible",
            "options": [
              "novel",
              "matching",
              "delayed",
              "current",
              "latest"
            ],
            "answers": [
              "matching"
            ]
          },
          {
            "prompt": "corresponding",
            "options": [
              "delayed",
              "matching",
              "compatible",
              "novel",
              "up to date"
            ],
            "answers": [
              "matching",
              "compatible"
            ]
          },
          {
            "prompt": "latest",
            "options": [
              "old",
              "compatible",
              "current",
              "elderly",
              "recent"
            ],
            "answers": [
              "recent",
              "current"
            ]
          },
          {
            "prompt": "novel",
            "options": [
              "matching",
              "compatible",
              "current",
              "fresh",
              "new"
            ],
            "answers": [
              "fresh",
              "new"
            ]
          },
          {
            "prompt": "recent",
            "options": [
              "current",
              "delayed",
              "overdue",
              "latest",
              "matching"
            ],
            "answers": [
              "latest",
              "current"
            ]
          },
          {
            "prompt": "matching",
            "options": [
              "delayed",
              "corresponding",
              "compatible",
              "fresh",
              "old"
            ],
            "answers": [
              "corresponding",
              "compatible"
            ]
          },
          {
            "prompt": "up to date",
            "options": [
              "new",
              "old",
              "latest",
              "recent",
              "matching"
            ],
            "answers": [
              "latest",
              "recent"
            ]
          },
          {
            "prompt": "old",
            "options": [
              "corresponding",
              "elderly",
              "novel",
              "delayed",
              "matching"
            ],
            "answers": [
              "elderly"
            ]
          }
        ]
      },
      {
        "type": "sentence",
        "title": "EXERCISE 3 - Sentence Completion",
        "instruction": "Cümleyi doğru tamamlayan ifadeyi seçiniz.",
        "multi": false,
        "questions": [
          {
            "prompt": "Jade was the youngest, so she had to wear her sisters' ____ clothes.",
            "options": [
              "old",
              "current"
            ],
            "answers": [
              "old"
            ]
          },
          {
            "prompt": "____ Greece was home to numerous philosophers and explorers.",
            "options": [
              "Fresh",
              "Ancient"
            ],
            "answers": [
              "Ancient"
            ]
          },
          {
            "prompt": "The results of the study are ____ the analysts' earlier estimates.",
            "options": [
              "out of date",
              "in line with"
            ],
            "answers": [
              "in line with"
            ]
          },
          {
            "prompt": "A fall in steel productivity caused a ____ decrease in profits.",
            "options": [
              "ancient",
              "corresponding"
            ],
            "answers": [
              "corresponding"
            ]
          },
          {
            "prompt": "The hardest part of this job is understanding the ____ technology.",
            "options": [
              "delayed",
              "new"
            ],
            "answers": [
              "new"
            ]
          },
          {
            "prompt": "____ fish tastes completely different to frozen fish.",
            "options": [
              "Fresh",
              "matching"
            ],
            "answers": [
              "Fresh"
            ]
          },
          {
            "prompt": "A ____ study suggests students aged 60-65 have better results.",
            "options": [
              "elderly",
              "recent"
            ],
            "answers": [
              "recent"
            ]
          },
          {
            "prompt": "Engineers should get a better education, according to the ____ survey.",
            "options": [
              "overdue",
              "latest"
            ],
            "answers": [
              "latest"
            ]
          },
          {
            "prompt": "In the ____ economic climate of Europe, businessmen should be careful.",
            "options": [
              "outdated",
              "present"
            ],
            "answers": [
              "present"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "verb-1",
    "category": "verbs",
    "tableNo": 1,
    "groups": [
      {
        "theme": "yaşamak, hayatta kalmak",
        "words": [
          "live",
          "reside",
          "endure",
          "survive"
        ]
      },
      {
        "theme": "maruz kalmak, katlanmak",
        "words": [
          "be exposed to",
          "undergo",
          "suffer",
          "confront",
          "tolerate"
        ]
      },
      {
        "theme": "durdurmak, terk etmek",
        "words": [
          "stop",
          "cease",
          "quit",
          "halt",
          "abandon"
        ]
      },
      {
        "theme": "başlamak",
        "words": [
          "start",
          "begin",
          "initiate",
          "commence",
          "originate"
        ]
      },
      {
        "theme": "tartışmak, müzakere etmek",
        "words": [
          "argue",
          "debate",
          "discuss",
          "negotiate"
        ]
      },
      {
        "theme": "anlaşmak, uzlaşmak",
        "words": [
          "agree",
          "consent",
          "concur"
        ]
      },
      {
        "theme": "anlamak, fark etmek",
        "words": [
          "understand",
          "comprehend",
          "realize",
          "recognize"
        ]
      },
      {
        "theme": "bulmak, sonuca varmak",
        "words": [
          "conclude",
          "discover",
          "find out"
        ]
      },
      {
        "theme": "önermek, tavsiye etmek",
        "words": [
          "suggest",
          "offer",
          "propose",
          "recommend",
          "advise"
        ]
      },
      {
        "theme": "karşı çıkmak, reddetmek",
        "words": [
          "oppose",
          "reject",
          "refuse",
          "resist",
          "deny"
        ]
      },
      {
        "theme": "düşünmek, varsaymak",
        "words": [
          "think",
          "consider",
          "regard",
          "suppose",
          "assume"
        ]
      }
    ],
    "exercises": [
      {
        "type": "collocation",
        "title": "EXERCISE 1 - Collocation Test",
        "instruction": "Aşağıdaki ifadeleri doğru şekilde tamamlayan sözcüğü bulunuz.",
        "multi": false,
        "questions": [
          {
            "prompt": "____ in Turkey / in peace",
            "options": [
              "live",
              "think"
            ],
            "answers": [
              "live"
            ]
          },
          {
            "prompt": "____ an offer / a proposal",
            "options": [
              "turn down",
              "suffer from"
            ],
            "answers": [
              "turn down"
            ]
          },
          {
            "prompt": "____ on a plan / with someone",
            "options": [
              "reside",
              "agree"
            ],
            "answers": [
              "agree"
            ]
          },
          {
            "prompt": "____ the new bill / a view",
            "options": [
              "oppose",
              "originate"
            ],
            "answers": [
              "oppose"
            ]
          },
          {
            "prompt": "____ America / the truth",
            "options": [
              "come to terms",
              "discover"
            ],
            "answers": [
              "discover"
            ]
          },
          {
            "prompt": "____ a good hotel / a cafe",
            "options": [
              "tolerate",
              "recommend"
            ],
            "answers": [
              "recommend"
            ]
          },
          {
            "prompt": "Buddhism ____ in India.",
            "options": [
              "originated",
              "suggested"
            ],
            "answers": [
              "originated"
            ]
          },
          {
            "prompt": "____ pressure from the public / heat",
            "options": [
              "resist",
              "bargain"
            ],
            "answers": [
              "resist"
            ]
          },
          {
            "prompt": "____ abroad / in a palace",
            "options": [
              "propose",
              "reside"
            ],
            "answers": [
              "reside"
            ]
          },
          {
            "prompt": "fully ____ a topic / a reading text",
            "options": [
              "comprehend",
              "feel"
            ],
            "answers": [
              "comprehend"
            ]
          },
          {
            "prompt": "____ massive changes / an operation",
            "options": [
              "give up",
              "undergo"
            ],
            "answers": [
              "undergo"
            ]
          },
          {
            "prompt": "____ many hardships / noise / kids",
            "options": [
              "put up with",
              "advise"
            ],
            "answers": [
              "put up with"
            ]
          },
          {
            "prompt": "____ school at the age of 15 / a game",
            "options": [
              "consent",
              "quit"
            ],
            "answers": [
              "quit"
            ]
          },
          {
            "prompt": "____ an offer carefully / a suggestion",
            "options": [
              "consider",
              "abandon"
            ],
            "answers": [
              "consider"
            ]
          },
          {
            "prompt": "____ a trade agreement / a ceasefire",
            "options": [
              "live",
              "negotiate"
            ],
            "answers": [
              "negotiate"
            ]
          },
          {
            "prompt": "____ smoking / football / yoga",
            "options": [
              "find out",
              "give up"
            ],
            "answers": [
              "give up"
            ]
          }
        ]
      },
      {
        "type": "synonyms",
        "title": "EXERCISE 2 - Synonyms Test",
        "instruction": "Verilen sözcüğe anlamca yakın (eş anlamlı) TÜM sözcükleri seçiniz.",
        "multi": true,
        "questions": [
          {
            "prompt": "conclude",
            "options": [
              "discuss",
              "consent",
              "suffer",
              "discover",
              "find out"
            ],
            "answers": [
              "discover",
              "find out"
            ]
          },
          {
            "prompt": "comprehend",
            "options": [
              "propose",
              "understand",
              "consider",
              "think",
              "realize"
            ],
            "answers": [
              "understand",
              "realize"
            ]
          },
          {
            "prompt": "be exposed to",
            "options": [
              "offer",
              "recognize",
              "advise",
              "undergo",
              "agree"
            ],
            "answers": [
              "undergo"
            ]
          },
          {
            "prompt": "begin",
            "options": [
              "conclude",
              "survive",
              "start",
              "initiate",
              "cease"
            ],
            "answers": [
              "start",
              "initiate"
            ]
          },
          {
            "prompt": "discover",
            "options": [
              "conclude",
              "abandon",
              "live",
              "consent",
              "find out"
            ],
            "answers": [
              "conclude",
              "find out"
            ]
          },
          {
            "prompt": "concur",
            "options": [
              "consent",
              "originate",
              "survive",
              "agree",
              "recommend"
            ],
            "answers": [
              "agree",
              "consent"
            ]
          },
          {
            "prompt": "assume",
            "options": [
              "think",
              "abandon",
              "argue",
              "consider",
              "debate"
            ],
            "answers": [
              "think",
              "consider"
            ]
          },
          {
            "prompt": "live",
            "options": [
              "refuse",
              "realize",
              "initiate",
              "endure",
              "reside"
            ],
            "answers": [
              "reside",
              "endure"
            ]
          },
          {
            "prompt": "tolerate",
            "options": [
              "recognize",
              "initiate",
              "comprehend",
              "be exposed to",
              "start"
            ],
            "answers": [
              "be exposed to"
            ]
          },
          {
            "prompt": "undergo",
            "options": [
              "be exposed to",
              "begin",
              "concur",
              "confront",
              "suffer"
            ],
            "answers": [
              "be exposed to",
              "suffer",
              "confront"
            ]
          },
          {
            "prompt": "oppose",
            "options": [
              "refuse",
              "assume",
              "realize",
              "reject",
              "live"
            ],
            "answers": [
              "reject",
              "refuse"
            ]
          },
          {
            "prompt": "recognize",
            "options": [
              "commence",
              "understand",
              "realize",
              "comprehend",
              "suggest"
            ],
            "answers": [
              "understand",
              "comprehend",
              "realize"
            ]
          }
        ]
      },
      {
        "type": "sentence",
        "title": "EXERCISE 3 - Sentence Completion",
        "instruction": "Cümleyi doğru tamamlayan ifadeyi seçiniz.",
        "multi": false,
        "questions": [
          {
            "prompt": "They ____ abroad for several years but moved back later.",
            "options": [
              "lived",
              "agreed"
            ],
            "answers": [
              "lived"
            ]
          },
          {
            "prompt": "Children need to ____ things for themselves in order to learn.",
            "options": [
              "refuse",
              "experience"
            ],
            "answers": [
              "experience"
            ]
          },
          {
            "prompt": "Anne still ____ a lot of pain in her leg despite the operation.",
            "options": [
              "suffers",
              "debates"
            ],
            "answers": [
              "suffers"
            ]
          },
          {
            "prompt": "Flowers will develop only if the plants are ____ sunlight daily.",
            "options": [
              "exposed to",
              "consider"
            ],
            "answers": [
              "exposed to"
            ]
          },
          {
            "prompt": "Jennifer will ____ working for two years when she becomes a mother.",
            "options": [
              "advise",
              "stop"
            ],
            "answers": [
              "stop"
            ]
          },
          {
            "prompt": "The majority of smokers say they would like to ____ the habit.",
            "options": [
              "propose",
              "quit"
            ],
            "answers": [
              "quit"
            ]
          },
          {
            "prompt": "Adding acid to the test tube ____ a chemical process.",
            "options": [
              "starts",
              "recommends"
            ],
            "answers": [
              "starts"
            ]
          },
          {
            "prompt": "Many philosophical ideas ____ with the ancient Greek philosophers.",
            "options": [
              "agreed",
              "originated"
            ],
            "answers": [
              "originated"
            ]
          },
          {
            "prompt": "Quaresma continued to ____ with the referee throughout the game.",
            "options": [
              "offer",
              "argue"
            ],
            "answers": [
              "argue"
            ]
          },
          {
            "prompt": "Colombia and Venezuela are currently ____ a trade agreement.",
            "options": [
              "residing",
              "negotiating"
            ],
            "answers": [
              "negotiating"
            ]
          },
          {
            "prompt": "Most experts ____ that drugs like heroin cause permanent brain damage.",
            "options": [
              "agree",
              "begin"
            ],
            "answers": [
              "agree"
            ]
          },
          {
            "prompt": "After serious discussions, Pam's father ____ to the marriage.",
            "options": [
              "consented",
              "survived"
            ],
            "answers": [
              "consented"
            ]
          },
          {
            "prompt": "Australian researchers have ____ a substance in coffee like morphine.",
            "options": [
              "given up",
              "discovered"
            ],
            "answers": [
              "discovered"
            ]
          },
          {
            "prompt": "Can I ____ you a drink while we discuss the issue?",
            "options": [
              "offer",
              "survive"
            ],
            "answers": [
              "offer"
            ]
          },
          {
            "prompt": "Doctors ____ that all children be immunized against polio.",
            "options": [
              "recommend",
              "undergo"
            ],
            "answers": [
              "recommend"
            ]
          },
          {
            "prompt": "Lauren has ____ her parents' offer of help though she needs it.",
            "options": [
              "rejected",
              "recognized"
            ],
            "answers": [
              "rejected"
            ]
          },
          {
            "prompt": "Studies show that the virus is able to ____ most antibiotics.",
            "options": [
              "resist",
              "advise"
            ],
            "answers": [
              "resist"
            ]
          },
          {
            "prompt": "Many people ____ that it is wrong to experiment on animals.",
            "options": [
              "think",
              "originate"
            ],
            "answers": [
              "think"
            ]
          },
          {
            "prompt": "We should start ____ the possibility of moving to Japan.",
            "options": [
              "quitting",
              "considering"
            ],
            "answers": [
              "considering"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "verb-2",
    "category": "verbs",
    "tableNo": 2,
    "groups": [
      {
        "theme": "açıklamak, ışık tutmak",
        "words": [
          "explain",
          "identify",
          "depict",
          "illustrate",
          "enlighten"
        ]
      },
      {
        "theme": "izin vermek, olanak sağlamak",
        "words": [
          "permit",
          "allow",
          "authorize",
          "enable",
          "facilitate"
        ]
      },
      {
        "theme": "başarmak, tamamlamak",
        "words": [
          "succeed",
          "accomplish",
          "achieve",
          "fulfil",
          "complete"
        ]
      },
      {
        "theme": "etkilemek, ilham vermek",
        "words": [
          "affect",
          "impress",
          "inspire",
          "motivate"
        ]
      },
      {
        "theme": "ihmal etmek, göz ardı etmek",
        "words": [
          "ignore",
          "overlook",
          "neglect",
          "disregard"
        ]
      },
      {
        "theme": "dikkate almak, değerlendirmek",
        "words": [
          "judge",
          "appreciate",
          "assess"
        ]
      },
      {
        "theme": "güvenmek, dayanmak",
        "words": [
          "trust",
          "count on",
          "rely on",
          "depend on"
        ]
      },
      {
        "theme": "bozmak, zarar vermek",
        "words": [
          "ruin",
          "harm",
          "damage",
          "injure",
          "impair",
          "destroy"
        ]
      },
      {
        "theme": "yönetmek",
        "words": [
          "direct",
          "supervise",
          "administer",
          "govern",
          "rule"
        ]
      },
      {
        "theme": "ortaya çıkmak, yok olmak",
        "words": [
          "arise",
          "appear",
          "break out",
          "vanish",
          "disappear",
          "become extinct"
        ]
      }
    ],
    "exercises": [
      {
        "type": "collocation",
        "title": "EXERCISE 1 - Collocation Test",
        "instruction": "Aşağıdaki ifadeleri doğru şekilde tamamlayan sözcüğü bulunuz.",
        "multi": false,
        "questions": [
          {
            "prompt": "smoking here is not ____",
            "options": [
              "injured",
              "allowed"
            ],
            "answers": [
              "allowed"
            ]
          },
          {
            "prompt": "____ a promise",
            "options": [
              "govern",
              "fulfil"
            ],
            "answers": [
              "fulfil"
            ]
          },
          {
            "prompt": "____ the environment",
            "options": [
              "achieve",
              "destroy"
            ],
            "answers": [
              "destroy"
            ]
          },
          {
            "prompt": "____ your colleagues",
            "options": [
              "trust",
              "vanish"
            ],
            "answers": [
              "trust"
            ]
          },
          {
            "prompt": "____ children's behaviour",
            "options": [
              "break out",
              "influence"
            ],
            "answers": [
              "influence"
            ]
          },
          {
            "prompt": "____ a criminal",
            "options": [
              "identify",
              "succeed"
            ],
            "answers": [
              "identify"
            ]
          },
          {
            "prompt": "____ many young people",
            "options": [
              "inspire",
              "emerge"
            ],
            "answers": [
              "inspire"
            ]
          },
          {
            "prompt": "____ advice / the rules",
            "options": [
              "supervise",
              "ignore"
            ],
            "answers": [
              "ignore"
            ]
          },
          {
            "prompt": "____ heavily on oil income",
            "options": [
              "depend",
              "impair"
            ],
            "answers": [
              "depend"
            ]
          },
          {
            "prompt": "insects that ____ crops",
            "options": [
              "motivate",
              "damage"
            ],
            "answers": [
              "damage"
            ]
          },
          {
            "prompt": "a style that ____ in the 1990s",
            "options": [
              "assessed",
              "emerged"
            ],
            "answers": [
              "emerged"
            ]
          }
        ]
      },
      {
        "type": "synonyms",
        "title": "EXERCISE 2 - Synonyms Test",
        "instruction": "Verilen sözcüğe anlamca yakın (eş anlamlı) TÜM sözcükleri seçiniz.",
        "multi": true,
        "questions": [
          {
            "prompt": "become extinct",
            "options": [
              "direct",
              "appreciate",
              "rule",
              "destroy",
              "arise"
            ],
            "answers": [
              "arise"
            ]
          },
          {
            "prompt": "allow",
            "options": [
              "accomplish",
              "authorize",
              "permit",
              "affect",
              "count on"
            ],
            "answers": [
              "permit",
              "authorize"
            ]
          },
          {
            "prompt": "identify",
            "options": [
              "appreciate",
              "administer",
              "depict",
              "explain",
              "depend on"
            ],
            "answers": [
              "explain",
              "depict"
            ]
          },
          {
            "prompt": "administer",
            "options": [
              "supervise",
              "govern",
              "direct",
              "appreciate",
              "affect"
            ],
            "answers": [
              "direct",
              "supervise",
              "govern"
            ]
          },
          {
            "prompt": "injure",
            "options": [
              "direct",
              "disappear",
              "harm",
              "become extinct",
              "ruin"
            ],
            "answers": [
              "ruin",
              "harm"
            ]
          },
          {
            "prompt": "appear",
            "options": [
              "arise",
              "explain",
              "impress",
              "accomplish",
              "trust"
            ],
            "answers": [
              "arise"
            ]
          },
          {
            "prompt": "accomplish",
            "options": [
              "succeed",
              "injure",
              "neglect",
              "count on",
              "administer"
            ],
            "answers": [
              "succeed"
            ]
          },
          {
            "prompt": "damage",
            "options": [
              "harm",
              "impress",
              "rely on",
              "ruin",
              "ignore"
            ],
            "answers": [
              "ruin",
              "harm"
            ]
          },
          {
            "prompt": "overlook",
            "options": [
              "harm",
              "authorize",
              "complete",
              "motivate",
              "ignore"
            ],
            "answers": [
              "ignore"
            ]
          },
          {
            "prompt": "impair",
            "options": [
              "become extinct",
              "ruin",
              "harm",
              "rule",
              "direct"
            ],
            "answers": [
              "ruin",
              "harm"
            ]
          },
          {
            "prompt": "ruin",
            "options": [
              "affect",
              "disregard",
              "harm",
              "direct",
              "identify"
            ],
            "answers": [
              "harm"
            ]
          },
          {
            "prompt": "neglect",
            "options": [
              "impair",
              "succeed",
              "ignore",
              "permit",
              "direct"
            ],
            "answers": [
              "ignore"
            ]
          }
        ]
      },
      {
        "type": "sentence",
        "title": "EXERCISE 3 - Sentence Completion",
        "instruction": "Cümleyi doğru tamamlayan ifadeyi seçiniz.",
        "multi": false,
        "questions": [
          {
            "prompt": "Doctors are unable to ____ why the disease spread so quickly.",
            "options": [
              "harm",
              "explain"
            ],
            "answers": [
              "explain"
            ]
          },
          {
            "prompt": "Scientists have ____ the gene that causes abnormal growth.",
            "options": [
              "vanished",
              "identified"
            ],
            "answers": [
              "identified"
            ]
          },
          {
            "prompt": "Most colleges will ____ students to change their subject choices.",
            "options": [
              "allow",
              "spoil"
            ],
            "answers": [
              "allow"
            ]
          },
          {
            "prompt": "Language ____ us to communicate with other people.",
            "options": [
              "enables",
              "overlooks"
            ],
            "answers": [
              "enables"
            ]
          },
          {
            "prompt": "If you don't change your attitude, you will never ____ as a manager.",
            "options": [
              "succeed",
              "ruin"
            ],
            "answers": [
              "succeed"
            ]
          },
          {
            "prompt": "Roger has already ____ all his goals in his career.",
            "options": [
              "interrupted",
              "achieved"
            ],
            "answers": [
              "achieved"
            ]
          },
          {
            "prompt": "Climate changes ____ the ozone.",
            "options": [
              "trust",
              "affect"
            ],
            "answers": [
              "affect"
            ]
          },
          {
            "prompt": "Positive feedback ____ employees' performance a lot.",
            "options": [
              "disregards",
              "influences"
            ],
            "answers": [
              "influences"
            ]
          },
          {
            "prompt": "It was very stupid of you to ____ your mother's advice.",
            "options": [
              "ignore",
              "disappear"
            ],
            "answers": [
              "ignore"
            ]
          },
          {
            "prompt": "Parents must not ____ serious lies of their children.",
            "options": [
              "overlook",
              "arise"
            ],
            "answers": [
              "overlook"
            ]
          },
          {
            "prompt": "Companies should always ____ the quality of their products.",
            "options": [
              "break out",
              "pay attention to"
            ],
            "answers": [
              "pay attention to"
            ]
          },
          {
            "prompt": "A local man wrote a guidebook that ____ the quality of hotels.",
            "options": [
              "assesses",
              "dies out"
            ],
            "answers": [
              "assesses"
            ]
          },
          {
            "prompt": "David is a person you can always ____ when you need help.",
            "options": [
              "trust",
              "mess up"
            ],
            "answers": [
              "trust"
            ]
          },
          {
            "prompt": "Many working women ____ their mothers to help with the children.",
            "options": [
              "rely on",
              "disclose"
            ],
            "answers": [
              "rely on"
            ]
          },
          {
            "prompt": "During an operation, doctors must not ____ the delicate nerve endings.",
            "options": [
              "depend on",
              "damage"
            ],
            "answers": [
              "damage"
            ]
          },
          {
            "prompt": "The recent devastating flood has ____ even the most durable houses.",
            "options": [
              "facilitated",
              "ruined"
            ],
            "answers": [
              "ruined"
            ]
          },
          {
            "prompt": "The Navajo ____ their own territory within the United States.",
            "options": [
              "administer",
              "allow"
            ],
            "answers": [
              "administer"
            ]
          },
          {
            "prompt": "While the queen was ____ the country, she remained isolated.",
            "options": [
              "ruling",
              "emerging"
            ],
            "answers": [
              "ruling"
            ]
          },
          {
            "prompt": "Buddhism ____ in India and came to China in the first century A.D.",
            "options": [
              "originated",
              "permitted"
            ],
            "answers": [
              "originated"
            ]
          },
          {
            "prompt": "Drugs won't make the pain ____ altogether, but they will help.",
            "options": [
              "inspire",
              "disappear"
            ],
            "answers": [
              "disappear"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "verb-3",
    "category": "verbs",
    "tableNo": 3,
    "groups": [
      {
        "theme": "sebep olmak",
        "words": [
          "cause",
          "bring about",
          "lead to",
          "result in",
          "stimulate",
          "trigger"
        ]
      },
      {
        "theme": "değiş(tir)mek, kaynaklanmak",
        "words": [
          "alter",
          "shift",
          "transform",
          "revolutionize",
          "modify",
          "stem from"
        ]
      },
      {
        "theme": "kullanmak, harcamak, israf etmek",
        "words": [
          "spend",
          "consume",
          "exploit",
          "deplete",
          "waste"
        ]
      },
      {
        "theme": "ilgilenmek, ele almak",
        "words": [
          "deal with",
          "cope with",
          "handle",
          "tackle",
          "address"
        ]
      },
      {
        "theme": "ayrılmak, farklı olmak",
        "words": [
          "separate",
          "diverge",
          "differ",
          "vary"
        ]
      },
      {
        "theme": "kurmak, inşa etmek",
        "words": [
          "set up",
          "build",
          "construct",
          "establish"
        ]
      },
      {
        "theme": "aşmak, geçmek",
        "words": [
          "exceed",
          "surpass",
          "overtake",
          "overwhelm"
        ]
      },
      {
        "theme": "azal(t)mak",
        "words": [
          "lessen",
          "diminish",
          "reduce",
          "mitigate",
          "shrink"
        ]
      },
      {
        "theme": "durumunu korumak",
        "words": [
          "remain",
          "maintain",
          "stay"
        ]
      },
      {
        "theme": "art(ır)mak",
        "words": [
          "increase",
          "rise",
          "boost",
          "go up"
        ]
      }
    ],
    "exercises": [
      {
        "type": "collocation",
        "title": "EXERCISE 1 - Collocation Test",
        "instruction": "Aşağıdaki ifadeleri doğru şekilde tamamlayan sözcüğü bulunuz.",
        "multi": false,
        "questions": [
          {
            "prompt": "a new plan to ____ crime / unemployment",
            "options": [
              "vary",
              "reduce"
            ],
            "answers": [
              "reduce"
            ]
          },
          {
            "prompt": "____ from other cities / people",
            "options": [
              "differ",
              "misuse"
            ],
            "answers": [
              "differ"
            ]
          },
          {
            "prompt": "____ money on clothes / books",
            "options": [
              "spend",
              "evolve"
            ],
            "answers": [
              "spend"
            ]
          },
          {
            "prompt": "____ a problem / a customer",
            "options": [
              "consume",
              "deal with"
            ],
            "answers": [
              "deal with"
            ]
          },
          {
            "prompt": "____ a civil war / a disease",
            "options": [
              "trigger",
              "spend"
            ],
            "answers": [
              "trigger"
            ]
          },
          {
            "prompt": "birds that ____ from dinosaurs",
            "options": [
              "evolved",
              "surpassed"
            ],
            "answers": [
              "evolved"
            ]
          },
          {
            "prompt": "____ the speed limit",
            "options": [
              "separate",
              "exceed"
            ],
            "answers": [
              "exceed"
            ]
          },
          {
            "prompt": "____ energy / sugar",
            "options": [
              "consume",
              "remain"
            ],
            "answers": [
              "consume"
            ]
          },
          {
            "prompt": "____ natural sources / time",
            "options": [
              "lead to",
              "waste"
            ],
            "answers": [
              "waste"
            ]
          },
          {
            "prompt": "____ a company",
            "options": [
              "vary",
              "establish"
            ],
            "answers": [
              "establish"
            ]
          },
          {
            "prompt": "technologies that ____ farm production",
            "options": [
              "remain",
              "revolutionize"
            ],
            "answers": [
              "revolutionize"
            ]
          },
          {
            "prompt": "technology to ____ the quality of our lives",
            "options": [
              "boost",
              "separate"
            ],
            "answers": [
              "boost"
            ]
          },
          {
            "prompt": "____ a disease / a problem",
            "options": [
              "waste",
              "cause"
            ],
            "answers": [
              "cause"
            ]
          },
          {
            "prompt": "regulations for ____ a new company",
            "options": [
              "setting up",
              "exceeding"
            ],
            "answers": [
              "setting up"
            ]
          },
          {
            "prompt": "____ unclear / unknown / a mystery",
            "options": [
              "remain",
              "consume"
            ],
            "answers": [
              "remain"
            ]
          },
          {
            "prompt": "____ a dictionary / right hand",
            "options": [
              "use",
              "increase"
            ],
            "answers": [
              "use"
            ]
          }
        ]
      },
      {
        "type": "synonyms",
        "title": "EXERCISE 2 - Synonyms Test",
        "instruction": "Verilen sözcüğe anlamca yakın (eş anlamlı) TÜM sözcükleri seçiniz.",
        "multi": true,
        "questions": [
          {
            "prompt": "cause",
            "options": [
              "tackle",
              "address",
              "bring about",
              "reduce",
              "overtake"
            ],
            "answers": [
              "bring about"
            ]
          },
          {
            "prompt": "rise",
            "options": [
              "vary",
              "increase",
              "boost",
              "deplete",
              "maintain"
            ],
            "answers": [
              "increase",
              "boost"
            ]
          },
          {
            "prompt": "bring about",
            "options": [
              "set up",
              "alter",
              "lead to",
              "cause",
              "vary"
            ],
            "answers": [
              "cause",
              "lead to"
            ]
          },
          {
            "prompt": "consume",
            "options": [
              "deplete",
              "shrink",
              "exploit",
              "spend",
              "cope with"
            ],
            "answers": [
              "spend",
              "exploit",
              "deplete"
            ]
          },
          {
            "prompt": "lead to",
            "options": [
              "bring about",
              "cause",
              "boost",
              "surpass",
              "address"
            ],
            "answers": [
              "cause",
              "bring about"
            ]
          },
          {
            "prompt": "stimulate",
            "options": [
              "deal with",
              "cause",
              "surpass",
              "bring about",
              "handle"
            ],
            "answers": [
              "cause",
              "bring about"
            ]
          },
          {
            "prompt": "shift",
            "options": [
              "alter",
              "transform",
              "remain",
              "diverge",
              "surpass"
            ],
            "answers": [
              "alter",
              "transform"
            ]
          },
          {
            "prompt": "transform",
            "options": [
              "revolutionize",
              "shift",
              "overwhelm",
              "alter",
              "bring about"
            ],
            "answers": [
              "alter",
              "shift",
              "revolutionize"
            ]
          },
          {
            "prompt": "result in",
            "options": [
              "increase",
              "reduce",
              "bring about",
              "cause",
              "maintain"
            ],
            "answers": [
              "cause",
              "bring about"
            ]
          },
          {
            "prompt": "revolutionize",
            "options": [
              "spend",
              "shift",
              "transform",
              "alter",
              "result in"
            ],
            "answers": [
              "alter",
              "shift",
              "transform"
            ]
          },
          {
            "prompt": "diverge",
            "options": [
              "increase",
              "result in",
              "spend",
              "transform",
              "separate"
            ],
            "answers": [
              "separate"
            ]
          },
          {
            "prompt": "tackle",
            "options": [
              "cause",
              "exceed",
              "deal with",
              "cope with",
              "mitigate"
            ],
            "answers": [
              "deal with",
              "cope with"
            ]
          }
        ]
      },
      {
        "type": "sentence",
        "title": "EXERCISE 3 - Sentence Completion",
        "instruction": "Cümleyi doğru tamamlayan ifadeyi seçiniz.",
        "multi": false,
        "questions": [
          {
            "prompt": "Lack of sleep may ____ a problem related to dopamine in the brain.",
            "options": [
              "trigger",
              "vary"
            ],
            "answers": [
              "trigger"
            ]
          },
          {
            "prompt": "The Enterprise Centre runs courses for people who want to ____ a business.",
            "options": [
              "set up",
              "exceed"
            ],
            "answers": [
              "set up"
            ]
          },
          {
            "prompt": "The recent contract has ____ the company into an international giant.",
            "options": [
              "stayed",
              "transformed"
            ],
            "answers": [
              "transformed"
            ]
          },
          {
            "prompt": "The city council has failed to ____ the problem of homelessness.",
            "options": [
              "deal with",
              "result in"
            ],
            "answers": [
              "deal with"
            ]
          },
          {
            "prompt": "Opposition leaders will watch how the prime minister ____ the crisis.",
            "options": [
              "consumes",
              "handles"
            ],
            "answers": [
              "handles"
            ]
          },
          {
            "prompt": "Farmers ____ calves from their mothers when they are a few days old.",
            "options": [
              "cause",
              "separate"
            ],
            "answers": [
              "separate"
            ]
          },
          {
            "prompt": "Politicians agree inflation must be beaten but they ____ over methods.",
            "options": [
              "rise",
              "differ"
            ],
            "answers": [
              "differ"
            ]
          },
          {
            "prompt": "The city of Boerne was ____ by German settlers in the 1840s.",
            "options": [
              "reduced",
              "established"
            ],
            "answers": [
              "established"
            ]
          },
          {
            "prompt": "Despite drops in sales, Mr. Parker still ____ as the manager.",
            "options": [
              "depletes",
              "remains"
            ],
            "answers": [
              "remains"
            ]
          },
          {
            "prompt": "The population of Indian cities ____ dramatically in the 1950s.",
            "options": [
              "spent",
              "increased"
            ],
            "answers": [
              "increased"
            ]
          },
          {
            "prompt": "The high-tech electronic equipment ____ the sound quality.",
            "options": [
              "enhances",
              "stays"
            ],
            "answers": [
              "enhances"
            ]
          },
          {
            "prompt": "The company can ____ any design to make it suitable for production.",
            "options": [
              "modify",
              "waste"
            ],
            "answers": [
              "modify"
            ]
          },
          {
            "prompt": "In order to survive, human beings need to ____ food and water.",
            "options": [
              "consume",
              "mitigate"
            ],
            "answers": [
              "consume"
            ]
          },
          {
            "prompt": "Working hours in Germany must not ____ 42 hours a week.",
            "options": [
              "construct",
              "exceed"
            ],
            "answers": [
              "exceed"
            ]
          },
          {
            "prompt": "Overeating and unhealthy food may ____ obesity.",
            "options": [
              "lead to",
              "misuse"
            ],
            "answers": [
              "lead to"
            ]
          },
          {
            "prompt": "Television ____ the cinema as the most popular entertainment in the 1980s.",
            "options": [
              "overtook",
              "remained"
            ],
            "answers": [
              "overtook"
            ]
          },
          {
            "prompt": "Although violence has ____ in China since the mid-90s, it remains.",
            "options": [
              "increased",
              "lessened"
            ],
            "answers": [
              "lessened"
            ]
          },
          {
            "prompt": "The new bridge should ____ travelling time from 50 to 15 minutes.",
            "options": [
              "build",
              "reduce"
            ],
            "answers": [
              "reduce"
            ]
          },
          {
            "prompt": "Letting the water run while you brush your teeth ____ water.",
            "options": [
              "wastes",
              "causes"
            ],
            "answers": [
              "wastes"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "verb-4",
    "category": "verbs",
    "tableNo": 4,
    "groups": [
      {
        "theme": "aramak, araştırmak",
        "words": [
          "search",
          "investigate",
          "explore",
          "seek"
        ]
      },
      {
        "theme": "hatırlamak, hatırlatmak",
        "words": [
          "recall",
          "remember",
          "remind"
        ]
      },
      {
        "theme": "bakmak",
        "words": [
          "stare at",
          "gaze at",
          "glance at"
        ]
      },
      {
        "theme": "iptal etmek, ertelemek",
        "words": [
          "cancel",
          "call off",
          "postpone",
          "put off"
        ]
      },
      {
        "theme": "sağlamak, kaynak sağlamak",
        "words": [
          "provide",
          "supply",
          "grant",
          "fund",
          "finance"
        ]
      },
      {
        "theme": "yürürlükten kaldırmak, kökünü kazımak",
        "words": [
          "abolish",
          "eradicate",
          "put an end to"
        ]
      },
      {
        "theme": "geliş(tir)mek",
        "words": [
          "improve",
          "develop",
          "enhance"
        ]
      },
      {
        "theme": "geri çek(il)mek",
        "words": [
          "withdraw",
          "retreat"
        ]
      }
    ],
    "exercises": [
      {
        "type": "collocation",
        "title": "EXERCISE 1 - Collocation Test",
        "instruction": "Aşağıdaki ifadeleri doğru şekilde tamamlayan sözcüğü bulunuz.",
        "multi": false,
        "questions": [
          {
            "prompt": "____ the meeting",
            "options": [
              "cancel",
              "gaze"
            ],
            "answers": [
              "cancel"
            ]
          },
          {
            "prompt": "____ old memories",
            "options": [
              "abolish",
              "remember"
            ],
            "answers": [
              "remember"
            ]
          },
          {
            "prompt": "____ evidence",
            "options": [
              "nullify",
              "look for"
            ],
            "answers": [
              "look for"
            ]
          },
          {
            "prompt": "____ a disease",
            "options": [
              "eradicate",
              "glance"
            ],
            "answers": [
              "eradicate"
            ]
          },
          {
            "prompt": "____ support for the new government",
            "options": [
              "stare",
              "withdraw"
            ],
            "answers": [
              "withdraw"
            ]
          },
          {
            "prompt": "slavery was ____ in the 19th century",
            "options": [
              "glanced",
              "abolished"
            ],
            "answers": [
              "abolished"
            ]
          },
          {
            "prompt": "____ at me angrily",
            "options": [
              "stare",
              "nullify"
            ],
            "answers": [
              "stare"
            ]
          },
          {
            "prompt": "____ financial advice",
            "options": [
              "look",
              "provide"
            ],
            "answers": [
              "provide"
            ]
          },
          {
            "prompt": "____ a friend from childhood",
            "options": [
              "recognize",
              "put off"
            ],
            "answers": [
              "recognize"
            ]
          },
          {
            "prompt": "nullify ____",
            "options": [
              "the contract",
              "good old days"
            ],
            "answers": [
              "the contract"
            ]
          },
          {
            "prompt": "____ the Antarctica",
            "options": [
              "put off",
              "explore"
            ],
            "answers": [
              "explore"
            ]
          },
          {
            "prompt": "____ underdeveloped countries",
            "options": [
              "finance",
              "cancel"
            ],
            "answers": [
              "finance"
            ]
          },
          {
            "prompt": "____ from the battlefield",
            "options": [
              "supply",
              "retreat"
            ],
            "answers": [
              "retreat"
            ]
          },
          {
            "prompt": "____ visa / permission",
            "options": [
              "grant",
              "remember"
            ],
            "answers": [
              "grant"
            ]
          },
          {
            "prompt": "____ violence",
            "options": [
              "put an end to",
              "provide"
            ],
            "answers": [
              "put an end to"
            ]
          }
        ]
      },
      {
        "type": "synonyms",
        "title": "EXERCISE 2 - Synonyms Test",
        "instruction": "Verilen sözcüğe anlamca yakın (eş anlamlı) TÜM sözcükleri seçiniz.",
        "multi": true,
        "questions": [
          {
            "prompt": "gaze at",
            "options": [
              "stare at",
              "postpone",
              "abolish",
              "recall",
              "call off"
            ],
            "answers": [
              "stare at"
            ]
          },
          {
            "prompt": "postpone",
            "options": [
              "glance at",
              "eradicate",
              "cancel",
              "seek",
              "stare at"
            ],
            "answers": [
              "cancel"
            ]
          },
          {
            "prompt": "withdraw",
            "options": [
              "finance",
              "retreat",
              "explore",
              "fund",
              "cancel"
            ],
            "answers": [
              "retreat"
            ]
          },
          {
            "prompt": "supply",
            "options": [
              "remember",
              "provide",
              "develop",
              "stare at",
              "glance at"
            ],
            "answers": [
              "provide"
            ]
          },
          {
            "prompt": "remember",
            "options": [
              "develop",
              "finance",
              "recall",
              "remind",
              "enhance"
            ],
            "answers": [
              "recall",
              "remind"
            ]
          },
          {
            "prompt": "stare at",
            "options": [
              "remember",
              "gaze at",
              "explore",
              "glance at",
              "retreat"
            ],
            "answers": [
              "gaze at",
              "glance at"
            ]
          },
          {
            "prompt": "explore",
            "options": [
              "remember",
              "search",
              "investigate",
              "recall",
              "postpone"
            ],
            "answers": [
              "search",
              "investigate"
            ]
          },
          {
            "prompt": "glance at",
            "options": [
              "gaze at",
              "grant",
              "stare at",
              "improve",
              "enhance"
            ],
            "answers": [
              "stare at",
              "gaze at"
            ]
          },
          {
            "prompt": "finance",
            "options": [
              "retreat",
              "put an end to",
              "supply",
              "provide",
              "recall"
            ],
            "answers": [
              "provide",
              "supply"
            ]
          },
          {
            "prompt": "put an end to",
            "options": [
              "abolish",
              "provide",
              "remember",
              "call off",
              "eradicate"
            ],
            "answers": [
              "abolish",
              "eradicate"
            ]
          },
          {
            "prompt": "recall",
            "options": [
              "remember",
              "fund",
              "remind",
              "seek",
              "cancel"
            ],
            "answers": [
              "remember",
              "remind"
            ]
          },
          {
            "prompt": "grant",
            "options": [
              "fund",
              "seek",
              "cancel",
              "provide",
              "supply"
            ],
            "answers": [
              "provide",
              "supply",
              "fund"
            ]
          }
        ]
      },
      {
        "type": "sentence",
        "title": "EXERCISE 3 - Sentence Completion",
        "instruction": "Cümleyi doğru tamamlayan ifadeyi seçiniz.",
        "multi": false,
        "questions": [
          {
            "prompt": "The Canadian government has just ____ from a plan to build a nuclear plant.",
            "options": [
              "looked",
              "retreated"
            ],
            "answers": [
              "retreated"
            ]
          },
          {
            "prompt": "The football match has been ____ until tomorrow because of bad weather.",
            "options": [
              "provided with",
              "put off"
            ],
            "answers": [
              "put off"
            ]
          },
          {
            "prompt": "Every season, a few footballers have to ____ their careers due to injuries.",
            "options": [
              "recollect",
              "put an end to"
            ],
            "answers": [
              "put an end to"
            ]
          },
          {
            "prompt": "Everybody wants an enquiry that will ____ an explanation for the bankruptcy.",
            "options": [
              "provide",
              "postpone"
            ],
            "answers": [
              "provide"
            ]
          },
          {
            "prompt": "If you ____ carefully, you can see the painting represents a human figure.",
            "options": [
              "nullify",
              "look"
            ],
            "answers": [
              "look"
            ]
          },
          {
            "prompt": "Brad felt better so he ____ his doctor's appointment.",
            "options": [
              "searched",
              "cancelled"
            ],
            "answers": [
              "cancelled"
            ]
          },
          {
            "prompt": "Rescuers had to ____ the search because of worsening weather.",
            "options": [
              "remember",
              "call off"
            ],
            "answers": [
              "call off"
            ]
          },
          {
            "prompt": "The company ____ the energy industry with various products.",
            "options": [
              "abolishes",
              "supplies"
            ],
            "answers": [
              "supplies"
            ]
          },
          {
            "prompt": "More than $100,000 was donated to help ____ Ryan's heart transplant.",
            "options": [
              "withdraw",
              "finance"
            ],
            "answers": [
              "finance"
            ]
          },
          {
            "prompt": "The World Bank refused to ____ the charity project because of trust issues.",
            "options": [
              "glance",
              "fund"
            ],
            "answers": [
              "fund"
            ]
          },
          {
            "prompt": "A research team is ____ causes of learning difficulties in children.",
            "options": [
              "looking for",
              "cancelling"
            ],
            "answers": [
              "looking for"
            ]
          },
          {
            "prompt": "Recent inflation could ____ the economic growth of the last several years.",
            "options": [
              "nullify",
              "seek"
            ],
            "answers": [
              "nullify"
            ]
          },
          {
            "prompt": "One of the aims of UNICEF is to ____ child poverty in the world.",
            "options": [
              "enhance",
              "eradicate"
            ],
            "answers": [
              "eradicate"
            ]
          },
          {
            "prompt": "We'll be in Istanbul for six days, so there will be time to ____.",
            "options": [
              "abolish",
              "explore"
            ],
            "answers": [
              "explore"
            ]
          },
          {
            "prompt": "The unpopular tax was finally ____ five days ago thanks to protests.",
            "options": [
              "gazed",
              "abolished"
            ],
            "answers": [
              "abolished"
            ]
          },
          {
            "prompt": "____ the exact date of their wedding might be problematic for some.",
            "options": [
              "Financing",
              "Remembering"
            ],
            "answers": [
              "Remembering"
            ]
          },
          {
            "prompt": "A speaker should make notes to ____ himself of what he wants to say.",
            "options": [
              "eradicate",
              "remind"
            ],
            "answers": [
              "remind"
            ]
          },
          {
            "prompt": "Finley ____ the exam paper for several minutes, trying to understand it.",
            "options": [
              "cancelled",
              "stared at"
            ],
            "answers": [
              "stared at"
            ]
          },
          {
            "prompt": "The federation had to ____ several games because of heavy snow.",
            "options": [
              "develop",
              "postpone"
            ],
            "answers": [
              "postpone"
            ]
          },
          {
            "prompt": "Parents have the right to ____ their children from PE classes if needed.",
            "options": [
              "subsidize",
              "withdraw"
            ],
            "answers": [
              "withdraw"
            ]
          }
        ]
      }
    ]
  }
];