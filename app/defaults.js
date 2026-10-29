// Default (seed) content. Everything here is editable from /admin.
const L = (id, emoji, title, body) => ({ id, emoji, title, body, photoId: '' });
module.exports = {
  seedVersion: 2,
  labels: {
    introHint: 'A little letter is waiting for you…\nTap the envelope to open it 📩', greeting: 'Dear My Love,', signature: 'Forever yours ❤️',
    usTitle: 'This is us 🐻❤️🐼', momentsTitle: 'Our Cute Moments ❤️', momentsBtn: 'Show me more ♥', nextBtn: 'Click for next 📸', letterBtn: 'Open my love letter 💌',
    reasonsTitle: 'Reasons I love you', reasonsBtn: 'Another reason ♡', promisesTitle: 'My Promises to You 🤞', timerTitle: 'Our Love Timer ⏳',
    meterTitle: 'Love Meter ❤️', meterHint: 'Tap to measure how much I love you', meterBtn: 'Check the meter ♥', meterResult: '100% full… and still overflowing! Like Bubu’s love for Dudu ♥',
    hugBtn: 'Send you a hug ♥', msgBtn: 'Send your message 💌', modalTitle: 'Write me a letter 💌', modalSend: 'Send on WhatsApp 💚'
  },
  sitePin: '1234', sitePinOn: true, gateTitle: 'Our little secret 💖', gateHint: 'Enter the PIN to come in',
  galleryTitle: 'Love Gallery 📸', whatsapp: '01794608874', togetherSince: '', togetherLabel: 'of loving you, and counting 💞',
  quick: ['I love you too 💖', 'তোমাকে ভালোবাসি ❤️', 'Miss you so much 🥺', 'Thank you, you made my day 🥰'],
  hubTitle: 'Our Love Universe 💖', hubSubtitle: 'আমাদের ভালোবাসার সব স্পেশাল বক্স — যেটা খুশি খোলো 🎁',
  // Used when a photo has no letter of its own: photo 1 gets letter 1, photo 2 gets letter 2 … (then it repeats)
  photoLetters: [
    { title: 'This moment, forever 📸', body: 'I don’t know what you were thinking in this picture, but I know what I’m thinking: how did I get so lucky? Every time I look at it, my heart does the same silly flip.\n\nএই ছবিটা দেখলেই আমার মন ভালো হয়ে যায়। তুমি আমার সবচেয়ে প্রিয় স্মৃতি। 💞' },
    { title: 'That smile 😍', body: 'That smile should come with a warning: “may cause sudden heartbeat and uncontrollable blushing”. I have fallen for it a thousand times and I will fall a thousand more.\n\nতোমার এই হাসিটার কাছে আমি বারবার হেরে যাই। 😍' },
    { title: 'Look at you 🥺', body: 'Just look at you. How is one person allowed to be this adorable? Come here, I’m going to squish your cheeks and kiss your forehead. No arguments, no excuses.\n\nআমার কাছে এসো তো, তোমাকে একটু আদর করি। 🥺' },
    { title: 'A day I’ll never forget 🌸', body: 'Some days are just days, and some turn into little treasures. This one is a treasure. I keep it in my heart, right next to you.\n\nকিছু দিন সারাজীবন মনে থাকে — এটা তেমনই একটা দিন। 🌸' },
    { title: 'My favourite human 🧸', body: 'Out of eight billion people, my heart picked you without even asking me. I think my heart has great taste. Thank you for being exactly who you are.\n\nআট বিলিয়ন মানুষের মধ্যে আমার মন তোমাকেই বেছে নিয়েছে। 🧸' },
    { title: 'You, me and nothing else ✨', body: 'When I look at this, everything else disappears. No noise, no worries, just you and me and a heart that feels at home.\n\nতুমি পাশে থাকলে আমার আর কিছুই লাগে না। ✨' },
    { title: 'Proof that you’re mine 😏', body: 'Evidence number one that you are the cutest person alive. I have lots more evidence saved, but I’m keeping it secret. Case closed: you are mine, and I am yours.\n\nপ্রমাণ হয়ে গেল, তুমি শুধু আমার। 😏' },
    { title: 'Keep smiling 🌈', body: 'Whenever the world feels heavy, open this picture and remember: someone out there thinks you are the best thing that ever happened to them. That someone is me.\n\nসবসময় হাসিখুশি থেকো, আমি আছি তোমার পাশে। 🌈' }
  ],
  boxes: [
    { id: 'birthday', title: 'Happy Birthday Website', subtitle: 'The birthday surprise made just for you', icon: '🎂', kind: 'birthday', theme: 'rose' },
    { id: 'photos', title: 'Photo Letters', subtitle: 'Every photo has its own little letter', icon: '📸', kind: 'photos', theme: 'peach' },
    { id: 'wishes', title: 'Chirkut', subtitle: 'চিরকুট — ছোট ছোট চিঠি, সাথে ছবি', icon: '📝', kind: 'letters', theme: 'rose', letters: [
      L('w1', '🎂', 'Happy Birthday, my love', 'Today the whole world is smiling because you were born. May every wish you make come true, and may I be part of each one.\n\nজন্মদিনের অনেক অনেক ভালোবাসা! 💖'),
      L('w2', '🕯️', 'Make a wish', 'Close your eyes, take a deep breath and blow out the candles. Whatever you wish for, I will spend my whole life helping it come true. And if you run out of wishes… wish for me, because I’m already yours.\n\nচোখ বন্ধ করে একটা ইচ্ছে করো। আমি জানি তোমার সব ইচ্ছে পূরণ হবে — কারণ আমি তো তোমার সাথেই আছি। 🕯️'),
      L('w3', '🎁', 'Your gift from me', 'My real gift is not in a box. It is every sunrise I wake up grateful for you and every night I fall asleep smiling because of you. Take it — it is yours for life.\n\nআমার সবচেয়ে বড় উপহার তুমি নিজেই, আর সেই উপহারের নাম ভালোবাসা। 🎁'),
      L('w4', '🌟', 'Another year of you', 'Another year older, another year more wonderful. Thank you for being born. The world was just a plain place before you showed up.\n\nআরেকটা বছর পার হলো, আর আমি আরও বেশি তোমার প্রেমে পড়লাম। শুভ জন্মদিন! 🌟'),
      L('w5', '🥳', 'My promise for this year', 'This year I promise more hugs, more laughter, more silly dates and fewer fights. Deal? Seal it with a kiss, my birthday star. 😘\n\nএই বছর আরও বেশি হাসি, আরও বেশি আদর — কথা দিলাম। 🥳')
    ] },
    { id: 'miss', title: 'Miss You Letters', subtitle: 'Open one whenever you miss me', icon: '🥺', kind: 'letters', theme: 'lavender', letters: [
      L('m1', '🥺', 'When the distance feels long', 'Close your eyes. I’m thinking of you right now, exactly like I do all day.\n\nতোমাকে অনেক মিস করছি… খুব তাড়াতাড়ি আমরা একসাথে থাকব। ❤️'),
      L('m2', '🌙', 'At night, when it’s quiet', 'The nights are the hardest. When everything goes silent, my heart gets loud and all it says is your name. If you’re awake too, look at the moon — I’m looking at it right now, and it is carrying my kiss to you.\n\nরাত হলেই তোমার কথা বেশি মনে পড়ে। চাঁদের দিকে তাকাও — আমার ভালোবাসা ওখানেই পাঠিয়েছি। 🌙'),
      L('m3', '📞', 'Call me, silly', 'Don’t just miss me — call me! I would drop everything for your voice. Even if you have nothing to say, just breathe on the phone. That is enough for me.\n\nমিস করলে ফোন করো, বোকা! তোমার গলার আওয়াজ শুনলেই আমার দিন ভালো হয়ে যায়। 📞'),
      L('m4', '🧸', 'Hug me in your head', 'Wrap your arms around your pillow, close your eyes and imagine me squeezing you so tight that all the missing disappears. Feel it? That’s me. I’m hugging you back.\n\nবালিশটা জড়িয়ে ধরো আর ভাবো ওটা আমি — আমি তোমাকে আদর করে জড়িয়ে ধরে আছি। 🧸'),
      L('m5', '⏳', 'Count the days with me', 'Every day apart is one step closer to the day I hold you again. I’m counting. Are you? When we finally meet, I am not letting go for a very long time.\n\nপ্রতিটা দিন আমাদের দেখা হওয়ার আরও কাছে নিয়ে যাচ্ছে। অপেক্ষা করো, আমি আসছি। ⏳')
    ] },
    { id: 'openwhen', title: 'Open When…', subtitle: 'A letter for every mood', icon: '💌', kind: 'letters', theme: 'peach', letters: [
      L('o1', '💌', 'My letter to you', 'My dearest love,\n\nHappy birthday! Every day with you feels like a gift, but today I want to say it out loud: thank you for being you. You make my ordinary days magical and my bad days softer.\n\nআমার প্রিয় মানুষটা, তুমি আছো বলেই আমার সব দিন সুন্দর। ❤️\n\nForever yours,\nYour Bubu 🧸'),
      L('o2', '🥺', 'Open when you miss me', 'Close your eyes and take a deep breath. I’m right here, closer than you think. Hold your pillow tight and imagine my hug around you. 💞'),
      L('o3', '🌙', 'Open when you can’t sleep', 'Hey sleepyhead, count my kisses instead of sheep: one, two, three… oh wait, I’ve lost count already. Sweet dreams, my love. 🌙💤'),
      L('o4', '😤', 'Open when you’re angry with me', 'Okay. Breathe. I know I probably did something silly, and I’m truly sorry. Be angry for five minutes, then come back and let me make it up to you with a big hug and your favourite snack. I can’t stay away from you, so please don’t stay away from me.\n\nরাগ করেছো? জানি, আমারই ভুল। এবার একটু হাসো তো! 😤🥰'),
      L('o5', '😔', 'Open when you’re sad', 'Hey, look at me. You are not alone, not even for one second. Whatever happened today does not change how wonderful you are. Cry if you need to, I’ll hold you. Then we’ll laugh about it together, I promise.\n\nমন খারাপ? আমি আছি তো। সব ঠিক হয়ে যাবে, আর আমি পুরোটা সময় তোমার পাশেই থাকব। 🫂'),
      L('o6', '😄', 'Open when you need a smile', 'Knock knock. Who’s there? Your Bubu. Your Bubu who? Your Bubu who loves you more than chocolate… okay, almost as much. Smile now, that is an order! 😁\n\nএকটু হাসো তো! তোমার হাসিটাই আমার সবচেয়ে প্রিয় জিনিস।')
    ] },
    { id: 'fantasy', title: 'Fantasy Box', subtitle: 'Dark, dreamy love stories — only for you 🔒', icon: '✨', kind: 'letters', theme: 'midnight', pin: '1234', letters: [
      L('f1', '✨', 'A day in our dream world', 'Imagine a small cottage by the sea, rain on the roof, your head on my shoulder and nowhere to be.\n\nআমাদের স্বপ্নের ছোট্ট দুনিয়ায় শুধু তুমি আর আমি। 🌊'),
      L('f2', '🦇', 'The vampire’s confession', 'For centuries I wandered through empty nights, thirsty for something I could not name. Then I saw you, and the darkness finally had a reason to exist: to make your light shine brighter. I would give up eternity for one more heartbeat beside yours. Mine to love, forever.\n\nশত বছর অন্ধকারে ঘুরেছি — তারপর তোমাকে দেখলাম। এখন অনন্তকালও কম মনে হয় তোমার সাথে থাকতে। 🦇'),
      L('f3', '🗡️', 'The knight who betrayed his kingdom', 'They told me to choose: the crown or you. I threw the crown into the fire without looking back. Let the whole kingdom call me a traitor, as long as you call me yours.\n\nরাজ্যের চেয়ে তোমাকে বেছে নিয়েছি — পুরো পৃথিবী বিরুদ্ধে গেলেও আমি তোমারই পাশে থাকব। 🗡️'),
      L('f4', '🥀', 'Black roses', 'They say love is soft. Ours isn’t. Ours is black roses on a stormy night — beautiful, dangerous, impossible to forget. I don’t want a gentle love. I want the kind that ruins every other love for both of us.\n\nআমাদের ভালোবাসা ঝড়ো রাতের কালো গোলাপের মতো — সুন্দর, তীব্র, আর কখনো ভুলে যাওয়ার নয়। 🥀'),
      L('f5', '🔗', 'Bound by fate', 'In every lifetime, in every universe, fate keeps tying my soul to yours. Once, in some life, I tried to run — and found myself standing at your door anyway. You are my doom and my destiny, and I would not change a thing.\n\nনিয়তি বারবার আমাদের একসাথে বেঁধেছে। তুমিই আমার সর্বনাশ, তুমিই আমার স্বর্গ। 🔗'),
      L('f6', '🔥', 'If I must burn', 'If I must burn, let me burn holding your hand. If heaven has no place for you, I don’t want heaven. Keep my heart. I stopped wanting it back the day I met you.\n\nপুড়তেই যদি হয়, তোমার হাত ধরেই পুড়ব। আমার হৃদয়টা তোমার কাছেই থাক। 🔥')
    ] },
    { id: 'iwantyou', title: 'How I Want You', subtitle: 'What I dream of with you 🔒', icon: '💞', kind: 'letters', theme: 'midnight', pin: '1234', letters: [
      L('i1', '💞', 'How I want you', 'I want you on my loudest and my quietest days. I want your laughter in my mornings and your hand in mine at night. I want you, always — exactly as you are.'),
      L('i2', '☀️', 'Every morning', 'I want to wake up to your sleepy face, your messy hair and that tiny grumpy “five more minutes”. I want mornings with you for the rest of my life.\n\nআমি চাই প্রতিটা সকাল তোমার ঘুম-ঘুম মুখ দেখে শুরু হোক। ☀️'),
      L('i3', '🌧️', 'In the rain', 'I want to stand in the rain with you, no umbrella, no plans, no worries — just your laugh and your hand in mine. Let the whole sky pour; I already have everything I need.\n\nবৃষ্টিতে তোমার হাত ধরে ভিজতে চাই। আর কিছু লাগে না। 🌧️'),
      L('i4', '🏠', 'A home with you', 'I want a tiny home with fairy lights, your favourite songs and a couch that is too small, so we have to sit close. I want an ordinary life with you — because with you, ordinary is the most beautiful thing I know.\n\nছোট্ট একটা ঘর, তুমি আর আমি — আমার আর কিছু চাওয়ার নেই। 🏠'),
      L('i5', '💍', 'Until we’re old', 'I want to be the old person who still holds your hand across the street, still steals your fries, still says “I love you” every night. I want you for all my tomorrows — wrinkles, grey hair and all.\n\nবুড়ো হয়েও আমি তোমার হাতটাই ধরে থাকতে চাই। 💍')
    ] }
  ].map(b => ({ subtitle: '', target: '', pin: '', unlockAt: '', lockMessage: '', replies: true, layout: ({ wishes: 'notes', openwhen: 'envelopes' })[b.id] || 'accordion', decor: ({ fantasy: 'stars', iwantyou: 'stars' })[b.id] || 'hearts', letters: [], ...b }))
};
