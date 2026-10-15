/* DİKTE KATALOĞU — EnglishClub alıştırmalarının dizini
 * ============================================================================
 * ÜRETİLMİŞ DOSYA; elle düzenlenmez.
 *   scripts/dikte-katalogu-uret.mjs
 *
 * NİYE GÖMÜLÜ: EnglishClub bir konunun alıştırmalarını tek yerde
 * listelemiyor; her sayfa yalnızca bir sonrakine bağlı. Listeyi canlı
 * çıkarmak konu başına zinciri yürümek demekti ve 10-15 saniye sürüyordu.
 * Burada bir kez toplanmış hâli duruyor, liste anında açılıyor.
 *
 * YALNIZCA BAŞLIK VE ADRES var — ses ve cevap metni yok. Onlar alıştırma
 * açıldığında kaynağından geliyor.
 *
 * Toplandığı tarih: 2026-10-15
 * 30 konu, 86 alıştırma.
 */

export interface KatalogAlistirmasi {
  baslik: string;
  url: string;
}

export interface KatalogKonusu {
  baslik: string;
  url: string;
  alistirmalar: KatalogAlistirmasi[];
}

export interface KatalogSeviyesi {
  id: string;
  ad: string;
  konular: KatalogKonusu[];
}

export const DIKTE_KATALOGU: KatalogSeviyesi[] = [
  {
    "id": "baslangic",
    "ad": "Başlangıç",
    "konular": [
      {
        "baslik": "Questions",
        "url": "https://www.englishclub.com/listening/dictations-s-questions.php",
        "alistirmalar": [
          {
            "baslik": "Dictation: Question 1",
            "url": "https://www.englishclub.com/listening/dictations-s-questions.php"
          },
          {
            "baslik": "Dictation: Question 2",
            "url": "https://www.englishclub.com/listening/dictation-s-question-2.php"
          },
          {
            "baslik": "Dictation: Question 3",
            "url": "https://www.englishclub.com/listening/dictation-s-question-3.php"
          },
          {
            "baslik": "Dictation: Question 4",
            "url": "https://www.englishclub.com/listening/dictation-s-question-4.php"
          },
          {
            "baslik": "Dictation: Question 5",
            "url": "https://www.englishclub.com/listening/dictation-s-question-5.php"
          }
        ]
      },
      {
        "baslik": "Numbers and Letters",
        "url": "https://www.englishclub.com/listening/dictations-s-numbers-letters.php",
        "alistirmalar": [
          {
            "baslik": "Dictation: Numbers 1",
            "url": "https://www.englishclub.com/listening/dictations-s-numbers-letters.php"
          },
          {
            "baslik": "Dictation: Numbers 2",
            "url": "https://www.englishclub.com/listening/dictation-s-numbers-2.php"
          },
          {
            "baslik": "Dictation: Numbers 3",
            "url": "https://www.englishclub.com/listening/dictation-s-numbers-3.php"
          },
          {
            "baslik": "Dictation: Numbers 4",
            "url": "https://www.englishclub.com/listening/dictation-s-numbers-4.php"
          },
          {
            "baslik": "Dictation: Letters",
            "url": "https://www.englishclub.com/listening/dictation-s-numbers-5.php"
          }
        ]
      },
      {
        "baslik": "People",
        "url": "https://www.englishclub.com/listening/dictations-s-people.php",
        "alistirmalar": [
          {
            "baslik": "Dictation: People 1",
            "url": "https://www.englishclub.com/listening/dictations-s-people.php"
          },
          {
            "baslik": "Dictation: People 2",
            "url": "https://www.englishclub.com/listening/dictation-s-people-2.php"
          },
          {
            "baslik": "Dictation: People 3",
            "url": "https://www.englishclub.com/listening/dictation-s-people-3.php"
          },
          {
            "baslik": "Dictation: People 4",
            "url": "https://www.englishclub.com/listening/dictation-s-people-4.php"
          },
          {
            "baslik": "Dictation: People 5",
            "url": "https://www.englishclub.com/listening/dictation-s-people-5.php"
          }
        ]
      },
      {
        "baslik": "Places and Weather",
        "url": "https://www.englishclub.com/listening/dictations-s-places-weather.php",
        "alistirmalar": [
          {
            "baslik": "Dictation: Place 1",
            "url": "https://www.englishclub.com/listening/dictations-s-places-weather.php"
          },
          {
            "baslik": "Dictation: Place 2",
            "url": "https://www.englishclub.com/listening/dictation-s-places-2.php"
          },
          {
            "baslik": "Dictation: Place 3",
            "url": "https://www.englishclub.com/listening/dictation-s-places-3.php"
          },
          {
            "baslik": "Dictation: Place 4",
            "url": "https://www.englishclub.com/listening/dictation-s-places-4.php"
          },
          {
            "baslik": "Dictation: Weather",
            "url": "https://www.englishclub.com/listening/dictation-s-places-5.php"
          }
        ]
      },
      {
        "baslik": "Commands and Requests",
        "url": "https://www.englishclub.com/listening/dictations-s-commands-requests.php",
        "alistirmalar": [
          {
            "baslik": "Dictation: Commands and Requests 1",
            "url": "https://www.englishclub.com/listening/dictations-s-commands-requests.php"
          },
          {
            "baslik": "Dictation: Commands and Requests 2",
            "url": "https://www.englishclub.com/listening/dictation-s-commands-requests-2.php"
          },
          {
            "baslik": "Dictation: Commands and Requests 3",
            "url": "https://www.englishclub.com/listening/dictation-s-commands-requests-3.php"
          },
          {
            "baslik": "Dictation: Commands and Requests 4",
            "url": "https://www.englishclub.com/listening/dictation-s-commands-requests-4.php"
          },
          {
            "baslik": "Dictation: Commands and Requests 5",
            "url": "https://www.englishclub.com/listening/dictation-s-commands-requests-5.php"
          }
        ]
      },
      {
        "baslik": "Common Expressions",
        "url": "https://www.englishclub.com/listening/dictations-s-common-expressions.php",
        "alistirmalar": [
          {
            "baslik": "Dictation: Common Expressions 1",
            "url": "https://www.englishclub.com/listening/dictations-s-common-expressions.php"
          },
          {
            "baslik": "Dictation: Common Expressions 2",
            "url": "https://www.englishclub.com/listening/dictation-s-common-expressions-2.php"
          },
          {
            "baslik": "Dictation: Common Expressions 3",
            "url": "https://www.englishclub.com/listening/dictation-s-common-expressions-3.php"
          },
          {
            "baslik": "Dictation: Common Expressions 4",
            "url": "https://www.englishclub.com/listening/dictation-s-common-expressions-4.php"
          },
          {
            "baslik": "Dictation: Common Expressions 5",
            "url": "https://www.englishclub.com/listening/dictation-s-common-expressions-5.php"
          }
        ]
      },
      {
        "baslik": "Quantities",
        "url": "https://www.englishclub.com/listening/dictations-s-quantities.php",
        "alistirmalar": [
          {
            "baslik": "Dictation: Quantities 1",
            "url": "https://www.englishclub.com/listening/dictations-s-quantities.php"
          },
          {
            "baslik": "Dictation: Quantities 2",
            "url": "https://www.englishclub.com/listening/dictation-s-quantities-2.php"
          },
          {
            "baslik": "Dictation: Quantities 3",
            "url": "https://www.englishclub.com/listening/dictation-s-quantities-3.php"
          },
          {
            "baslik": "Dictation: Quantities 4",
            "url": "https://www.englishclub.com/listening/dictation-s-quantities-4.php"
          },
          {
            "baslik": "Dictation: Quantities 5",
            "url": "https://www.englishclub.com/listening/dictation-s-quantities-5.php"
          }
        ]
      },
      {
        "baslik": "Currency",
        "url": "https://www.englishclub.com/listening/dictations-s-currency.php",
        "alistirmalar": [
          {
            "baslik": "Dictation: Currency 1",
            "url": "https://www.englishclub.com/listening/dictations-s-currency.php"
          },
          {
            "baslik": "Dictation: Currency 2",
            "url": "https://www.englishclub.com/listening/dictation-s-currency-2.php"
          },
          {
            "baslik": "Dictation: Currency 3",
            "url": "https://www.englishclub.com/listening/dictation-s-currency-3.php"
          },
          {
            "baslik": "Dictation: Currency 4",
            "url": "https://www.englishclub.com/listening/dictation-s-currency-4.php"
          },
          {
            "baslik": "Dictation: Currency 5",
            "url": "https://www.englishclub.com/listening/dictation-s-currency-5.php"
          }
        ]
      },
      {
        "baslik": "Telephone",
        "url": "https://www.englishclub.com/listening/dictations-s-telephone.php",
        "alistirmalar": [
          {
            "baslik": "Dictation: Telephone 1",
            "url": "https://www.englishclub.com/listening/dictations-s-telephone.php"
          },
          {
            "baslik": "Dictation: Telephone 2",
            "url": "https://www.englishclub.com/listening/dictation-s-telephone-2.php"
          },
          {
            "baslik": "Dictation: Telephone 3",
            "url": "https://www.englishclub.com/listening/dictation-s-telephone-3.php"
          },
          {
            "baslik": "Dictation: Telephone 4",
            "url": "https://www.englishclub.com/listening/dictation-s-telephone-4.php"
          },
          {
            "baslik": "Dictation: Telephone 5",
            "url": "https://www.englishclub.com/listening/dictation-s-telephone-5.php"
          }
        ]
      },
      {
        "baslik": "Quotes",
        "url": "https://www.englishclub.com/listening/dictations-s-quotes.php",
        "alistirmalar": [
          {
            "baslik": "Easy Dictation: Quote 1",
            "url": "https://www.englishclub.com/listening/dictations-s-quotes.php"
          },
          {
            "baslik": "Easy Dictation: Quote 2",
            "url": "https://www.englishclub.com/listening/dictation-s-quotes-2.php"
          },
          {
            "baslik": "Easy Dictation: Quote 3",
            "url": "https://www.englishclub.com/listening/dictation-s-quotes-3.php"
          },
          {
            "baslik": "Easy Dictation: Quote 4",
            "url": "https://www.englishclub.com/listening/dictation-s-quotes-4.php"
          },
          {
            "baslik": "Easy Dictation: Quote 5",
            "url": "https://www.englishclub.com/listening/dictation-s-quotes-5.php"
          }
        ]
      }
    ]
  },
  {
    "id": "orta",
    "ad": "Orta",
    "konular": [
      {
        "baslik": "Appointments",
        "url": "https://www.englishclub.com/listening/dictations-m-appointments.php",
        "alistirmalar": [
          {
            "baslik": "Dictation: Appointment 1",
            "url": "https://www.englishclub.com/listening/dictations-m-appointments.php"
          },
          {
            "baslik": "Dictation: Appointment 2",
            "url": "https://www.englishclub.com/listening/dictation-m-appointment-2.php"
          },
          {
            "baslik": "Dictation: Appointment 3",
            "url": "https://www.englishclub.com/listening/dictation-m-appointment-3.php"
          }
        ]
      },
      {
        "baslik": "Meetings",
        "url": "https://www.englishclub.com/listening/dictations-m-meetings.php",
        "alistirmalar": [
          {
            "baslik": "Dictation: Meeting 1",
            "url": "https://www.englishclub.com/listening/dictations-m-meetings.php"
          },
          {
            "baslik": "Dictation: Meeting 2",
            "url": "https://www.englishclub.com/listening/dictation-m-meeting-2.php"
          },
          {
            "baslik": "Dictation: Meeting 3",
            "url": "https://www.englishclub.com/listening/dictation-m-meeting-3.php"
          }
        ]
      },
      {
        "baslik": "Media",
        "url": "https://www.englishclub.com/listening/dictations-m-media.php",
        "alistirmalar": [
          {
            "baslik": "Dictation: Media 1",
            "url": "https://www.englishclub.com/listening/dictations-m-media.php"
          },
          {
            "baslik": "Dictation: Media 2",
            "url": "https://www.englishclub.com/listening/dictation-m-media-2.php"
          },
          {
            "baslik": "Dictation: Media 3",
            "url": "https://www.englishclub.com/listening/dictation-m-media-3.php"
          }
        ]
      },
      {
        "baslik": "Small Talk",
        "url": "https://www.englishclub.com/listening/dictations-m-small-talk.php",
        "alistirmalar": [
          {
            "baslik": "Dictation: Small Talk 1",
            "url": "https://www.englishclub.com/listening/dictations-m-small-talk.php"
          },
          {
            "baslik": "Dictation: Small Talk 2",
            "url": "https://www.englishclub.com/listening/dictation-m-small-talk-2.php"
          },
          {
            "baslik": "Dictation: Small Talk 3",
            "url": "https://www.englishclub.com/listening/dictation-m-small-talk-3.php"
          }
        ]
      },
      {
        "baslik": "Instructions 1",
        "url": "https://www.englishclub.com/listening/dictations-m-instructions-1.php",
        "alistirmalar": [
          {
            "baslik": "Dictation: Instructions 1.1",
            "url": "https://www.englishclub.com/listening/dictations-m-instructions-1.php"
          }
        ]
      },
      {
        "baslik": "Instructions 2",
        "url": "https://www.englishclub.com/listening/dictations-m-instructions2.php",
        "alistirmalar": [
          {
            "baslik": "Dictation: Instructions 2.1",
            "url": "https://www.englishclub.com/listening/dictations-m-instructions2.php"
          }
        ]
      },
      {
        "baslik": "Requests",
        "url": "https://www.englishclub.com/listening/dictations-m-requests.php",
        "alistirmalar": [
          {
            "baslik": "Dictation: Requests 1",
            "url": "https://www.englishclub.com/listening/dictations-m-requests.php"
          },
          {
            "baslik": "Dictation: Requests 2",
            "url": "https://www.englishclub.com/listening/dictation-m-request-2.php"
          },
          {
            "baslik": "Dictation: Requests 3",
            "url": "https://www.englishclub.com/listening/dictation-m-request-3.php"
          }
        ]
      },
      {
        "baslik": "Directions",
        "url": "https://www.englishclub.com/listening/dictations-m-directions.php",
        "alistirmalar": [
          {
            "baslik": "Dictation: Directions 1",
            "url": "https://www.englishclub.com/listening/dictations-m-directions.php"
          },
          {
            "baslik": "Dictation: Directions 2",
            "url": "https://www.englishclub.com/listening/dictation-m-directions-2.php"
          },
          {
            "baslik": "Dictation: Directions 3",
            "url": "https://www.englishclub.com/listening/dictation-m-directions-3.php"
          }
        ]
      },
      {
        "baslik": "Reviews",
        "url": "https://www.englishclub.com/listening/dictations-m-reviews.php",
        "alistirmalar": [
          {
            "baslik": "Dictation: Reviews 1",
            "url": "https://www.englishclub.com/listening/dictations-m-reviews.php"
          },
          {
            "baslik": "Dictation: Review 2",
            "url": "https://www.englishclub.com/listening/dictation-m-review-2.php"
          },
          {
            "baslik": "Dictation: Review 3",
            "url": "https://www.englishclub.com/listening/dictation-m-review-3.php"
          }
        ]
      },
      {
        "baslik": "Quotes",
        "url": "https://www.englishclub.com/listening/dictations-m-quotes.php",
        "alistirmalar": [
          {
            "baslik": "Dictation: Quote 1",
            "url": "https://www.englishclub.com/listening/dictations-m-quotes.php"
          },
          {
            "baslik": "Dictation: Quote 2",
            "url": "https://www.englishclub.com/listening/dictation-m-quote-2.php"
          },
          {
            "baslik": "Dictation: Quote 3",
            "url": "https://www.englishclub.com/listening/dictation-m-quote-3.php"
          }
        ]
      }
    ]
  },
  {
    "id": "ileri",
    "ad": "İleri",
    "konular": [
      {
        "baslik": "Recorded Message",
        "url": "https://www.englishclub.com/listening/dictations-l-recorded-message.php",
        "alistirmalar": [
          {
            "baslik": "Dictation: Recorded Message",
            "url": "https://www.englishclub.com/listening/dictations-l-recorded-message.php"
          }
        ]
      },
      {
        "baslik": "Automated Recording",
        "url": "https://www.englishclub.com/listening/dictations-l-automated-message.php",
        "alistirmalar": [
          {
            "baslik": "Dictation: Automated Recording",
            "url": "https://www.englishclub.com/listening/dictations-l-automated-message.php"
          }
        ]
      },
      {
        "baslik": "Speech 1",
        "url": "https://www.englishclub.com/listening/dictations-l-speech-1.php",
        "alistirmalar": [
          {
            "baslik": "Advanced Dictation: Speech 1",
            "url": "https://www.englishclub.com/listening/dictations-l-speech-1.php"
          }
        ]
      },
      {
        "baslik": "Speech 2",
        "url": "https://www.englishclub.com/listening/dictations-l-speech-2.php",
        "alistirmalar": [
          {
            "baslik": "Advanced Dictation: Speech 2",
            "url": "https://www.englishclub.com/listening/dictations-l-speech-2.php"
          }
        ]
      },
      {
        "baslik": "Lecture 1",
        "url": "https://www.englishclub.com/listening/dictations-l-lecture-1.php",
        "alistirmalar": [
          {
            "baslik": "Dictation: Lecture 1",
            "url": "https://www.englishclub.com/listening/dictations-l-lecture-1.php"
          }
        ]
      },
      {
        "baslik": "Lecture 2",
        "url": "https://www.englishclub.com/listening/dictations-l-lecture-2.php",
        "alistirmalar": [
          {
            "baslik": "Dictation: Lecture 2",
            "url": "https://www.englishclub.com/listening/dictations-l-lecture-2.php"
          }
        ]
      },
      {
        "baslik": "Literature 1",
        "url": "https://www.englishclub.com/listening/dictations-l-literature-1.php",
        "alistirmalar": [
          {
            "baslik": "Dictation: Literature 1",
            "url": "https://www.englishclub.com/listening/dictations-l-literature-1.php"
          }
        ]
      },
      {
        "baslik": "Literature 2",
        "url": "https://www.englishclub.com/listening/dictations-l-literature-2.php",
        "alistirmalar": [
          {
            "baslik": "Dictation: Literature 2",
            "url": "https://www.englishclub.com/listening/dictations-l-literature-2.php"
          }
        ]
      },
      {
        "baslik": "Presidential Address",
        "url": "https://www.englishclub.com/listening/dictations-l-presidential-address.php",
        "alistirmalar": [
          {
            "baslik": "Dictation: Presidential Address",
            "url": "https://www.englishclub.com/listening/dictations-l-presidential-address.php"
          }
        ]
      },
      {
        "baslik": "Eulogy",
        "url": "https://www.englishclub.com/listening/dictations-l-eulogy.php",
        "alistirmalar": [
          {
            "baslik": "Dictation: Eulogy",
            "url": "https://www.englishclub.com/listening/dictations-l-eulogy.php"
          }
        ]
      }
    ]
  }
];
