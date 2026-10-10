// Contextual word-order and clause-linking practice. Editorial review required before release.
export const wordOrderSentences = [
  {
    "id": "order-001",
    "before": "Ich bleibe heute zu Hause, ",
    "after": " ich krank bin.",
    "options": [
      "weil",
      "denn",
      "trotzdem",
      "deshalb"
    ],
    "answer": "weil",
    "explanation": "„Weil“ introduces a subordinate clause and sends the conjugated verb to the end: „weil ich krank bin“. „Denn“ also means 'because' but requires main-clause word order: „denn ich bin krank“."
  },
  {
    "id": "order-002",
    "before": "Ich bin krank, ",
    "after": " bleibe ich heute zu Hause.",
    "options": [
      "deshalb",
      "weil",
      "obwohl",
      "dass"
    ],
    "answer": "deshalb",
    "explanation": "„Deshalb“ is an adverb meaning 'therefore'. In a main clause, the conjugated verb comes second: „deshalb bleibe ich“. „Weil“ would require the verb at the end."
  },
  {
    "id": "order-003",
    "before": "Sie sagt, ",
    "after": " sie morgen später kommt.",
    "options": [
      "dass",
      "denn",
      "deshalb",
      "trotzdem"
    ],
    "answer": "dass",
    "explanation": "„Dass“ introduces a subordinate clause expressing what she says; the conjugated verb goes to the end: „dass sie ... kommt“. „Denn“ links two main clauses instead."
  },
  {
    "id": "order-004",
    "before": "Obwohl es regnet, ",
    "after": " wir spazieren.",
    "options": [
      "gehen",
      "wir gehen",
      "gegangen",
      "zu gehen"
    ],
    "answer": "gehen",
    "explanation": "After a fronted subordinate clause („Obwohl es regnet“), the conjugated verb comes immediately after the comma: „gehen wir spazieren“. The whole subordinate clause occupies position one."
  },
  {
    "id": "order-005",
    "before": "Wenn du Zeit hast, ",
    "after": " wir uns morgen.",
    "options": [
      "treffen",
      "wir treffen",
      "getroffen",
      "zu treffen"
    ],
    "answer": "treffen",
    "explanation": "When a subordinate clause comes first, the main clause begins with its conjugated verb: „Wenn du Zeit hast, treffen wir uns morgen.“"
  },
  {
    "id": "order-006",
    "before": "Ich frage mich, ",
    "after": " er heute kommt.",
    "options": [
      "ob",
      "dass",
      "denn",
      "deshalb"
    ],
    "answer": "ob",
    "explanation": "„Ob“ introduces an indirect yes/no question ('whether'): „Ich frage mich, ob er heute kommt.“ Unlike „wissen“, „sich fragen“ signals an open question, so „dass“ does not fit this construction."
  },
  {
    "id": "order-007",
    "before": "Kannst du mir sagen, ",
    "after": " der Bahnhof ist?",
    "options": [
      "wo",
      "dort",
      "deshalb",
      "denn"
    ],
    "answer": "wo",
    "explanation": "An indirect location question uses „wo“ and puts the verb at the end: „wo der Bahnhof ist“. „Dort“ means 'there' and cannot introduce this indirect question."
  },
  {
    "id": "order-008",
    "before": "Sie ist müde, ",
    "after": " arbeitet sie weiter.",
    "options": [
      "trotzdem",
      "obwohl",
      "weil",
      "dass"
    ],
    "answer": "trotzdem",
    "explanation": "„Trotzdem“ means 'nevertheless' and introduces a main clause with verb-second order: „trotzdem arbeitet sie“. „Obwohl“ would require a subordinate clause: „obwohl sie müde ist“."
  },
  {
    "id": "order-009",
    "before": "Er hat das Buch gelesen, ",
    "after": " er es zurückgegeben hat.",
    "options": [
      "bevor",
      "denn",
      "deshalb",
      "trotzdem"
    ],
    "answer": "bevor",
    "explanation": "„Bevor“ introduces a subordinate clause meaning 'before'. The conjugated verb moves to the end: „bevor er es zurückgegeben hat“."
  },
  {
    "id": "order-010",
    "before": "Nachdem sie gegessen hatte, ",
    "after": " sie einen Spaziergang.",
    "options": [
      "machte",
      "sie machte",
      "machen",
      "gemacht"
    ],
    "answer": "machte",
    "explanation": "A fronted „Nachdem“ clause occupies position one; the main-clause verb follows immediately: „Nachdem sie gegessen hatte, machte sie ...“"
  },
  {
    "id": "order-011",
    "before": "Ich rufe dich an, ",
    "after": " ich angekommen bin.",
    "options": [
      "sobald",
      "denn",
      "deshalb",
      "trotzdem"
    ],
    "answer": "sobald",
    "explanation": "„Sobald“ means 'as soon as' and introduces a subordinate clause: „sobald ich angekommen bin“. The finite auxiliary „bin“ goes last."
  },
  {
    "id": "order-012",
    "before": "Er spricht leise, ",
    "after": " niemand aufwacht.",
    "options": [
      "damit",
      "denn",
      "deshalb",
      "trotzdem"
    ],
    "answer": "damit",
    "explanation": "„Damit“ introduces a purpose clause ('so that') and sends the conjugated verb to the end: „damit niemand aufwacht“."
  },
  {
    "id": "order-013",
    "before": "Sie lernt jeden Tag, ",
    "after": " die Prüfung zu bestehen.",
    "options": [
      "um",
      "damit",
      "weil",
      "denn"
    ],
    "answer": "um",
    "explanation": "„Um ... zu“ expresses purpose when the implied subject is the same: „um die Prüfung zu bestehen“. „Damit“ would require a finite clause: „damit sie die Prüfung besteht“."
  },
  {
    "id": "order-014",
    "before": "Ich habe keine Zeit, ",
    "after": " ich muss noch arbeiten.",
    "options": [
      "denn",
      "weil",
      "obwohl",
      "damit"
    ],
    "answer": "denn",
    "explanation": "„Denn“ connects two main clauses and keeps normal word order: „denn ich muss ...“. „Weil“ would require „weil ich noch arbeiten muss“."
  },
  {
    "id": "order-015",
    "before": "Er fragte mich, ",
    "after": " ich ihm helfen könnte.",
    "options": [
      "ob",
      "denn",
      "deshalb",
      "trotzdem"
    ],
    "answer": "ob",
    "explanation": "„Ob“ introduces an indirect yes/no question. The finite verb comes at the end: „ob ich ihm helfen könnte“."
  },
  {
    "id": "order-016",
    "before": "Sie hat das Fenster geschlossen, ",
    "after": " es draußen kalt war.",
    "options": [
      "weil",
      "denn",
      "deshalb",
      "trotzdem"
    ],
    "answer": "weil",
    "explanation": "„Weil“ introduces the reason in a subordinate clause, with „war“ at the end. „Denn“ would instead require „denn es war draußen kalt“."
  },
  {
    "id": "order-017",
    "before": "Ich gehe früh schlafen, ",
    "after": " ich morgen fit bin.",
    "options": [
      "damit",
      "denn",
      "deshalb",
      "trotzdem"
    ],
    "answer": "damit",
    "explanation": "„Damit“ means 'so that' and introduces a purpose clause: „damit ich morgen fit bin“. Compare „deshalb“ ('therefore'), which requires main-clause word order."
  },
  {
    "id": "order-018",
    "before": "Während ich koche, ",
    "after": " mein Bruder den Tisch.",
    "options": [
      "deckt",
      "mein Bruder deckt",
      "decken",
      "gedeckt"
    ],
    "answer": "deckt",
    "explanation": "The fronted „Während“ clause takes position one; the main clause begins with the conjugated verb: „deckt mein Bruder den Tisch“."
  },
  {
    "id": "order-019",
    "before": "Sie weiß, ",
    "after": " das Meeting beginnt.",
    "options": [
      "wann",
      "dann",
      "deshalb",
      "denn"
    ],
    "answer": "wann",
    "explanation": "„Wann“ introduces an indirect question about time: „wann das Meeting beginnt“. „Dann“ means 'then' and is not an interrogative conjunction."
  },
  {
    "id": "order-020",
    "before": "Er ist gegangen, ",
    "after": " sich zu verabschieden.",
    "options": [
      "ohne",
      "damit",
      "weil",
      "denn"
    ],
    "answer": "ohne",
    "explanation": "„Ohne ... zu“ expresses doing something without another action: „ohne sich zu verabschieden“. „Damit“ and „weil“ require finite subordinate clauses."
  }
];
