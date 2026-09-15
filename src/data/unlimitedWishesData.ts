/**
 * Unlimited Romantic Wishes, Flirty & Sweet Pickup Lines with Emojis,
 * Birthday Promises, and Aesthetic Compliments for Alihaaa♡
 */

export interface GeneratedWish {
  id: string;
  content: string;
  category: 'romantic' | 'pickup_line' | 'promise' | 'compliment' | 'magical';
  categoryLabel: string;
  emoji: string;
  highlightWord: string;
  moodColor: string;
}

export const ROMANTIC_WISHES: string[] = [
  "Alihaaa, on your birthday, my only wish is to be the reason behind your sweetest, most genuine smile forever. 💖✨",
  "They say stars shine brightest in the dark, but none of them can ever compete with the light in your eyes. Happy Birthday my angel! 🌟🥹",
  "Out of 8 billion people on this planet, my heart chose you without a single second of hesitation. You are my forever home. 🏡❤️",
  "May every dream you've whispered to the stars come true this year, because someone as pure as you deserves the whole universe. 🌌🌸",
  "Happy Birthday, Alihaaa! In a world full of ordinary things, you will always be my most extraordinary blessing. 🕊️💫",
  "I don’t just love you for who you are, but for how peaceful and beautiful the world feels every time I look at you. 🥺💖",
  "If I could wrap up the moon, the stars, and all the warm hugs in the world, I'd hand them to you in a gift box today. 🎁🌙",
  "Every single beat of my heart has your name written on it. Happy Birthday to the girl who made my life feel like poetry. 📖🌹",
  "You deserve a life filled with endless laughter, gentle mornings, peaceful nights, and someone who loves you louder than words. (That's me!) 💍✨",
  "Alihaaa, loving you isn’t a choice—it’s the easiest, most natural instinct my soul has ever known. Happy Birthday my queen! 👑💕",
  "May Allah bless your new year with infinite peace, glowing health, and so much happiness that your cheeks hurt from smiling! 🤲✨",
  "Happy Birthday my favorite human! May this year bring you all the warmth and softness your gentle heart brings to everyone else. 🧸💖",
  "No gift in this entire world is precious enough to match what you bring into my life just by existing. 🌍💝",
  "You are my today, my tomorrow, and every single prayer I send up into the quiet night sky. Happy Birthday, Alihaaa! 🌙❤️",
  "To the girl whose laugh is my favorite song and whose eyes are my favorite view—wishing you the happiest birthday ever! 🎶👀✨"
];

export const SWEET_PICKUP_LINES: string[] = [
  "Are you a magician? Because whenever I look at you, everyone else in the room disappears! 🪄👀✨",
  "Do you have a map? Because I keep getting completely lost in those beautiful eyes of yours, Alihaaa. 🗺️🥺💖",
  "Is your name Google? Because you have everything I’ve been searching for my entire life! 🔍💘",
  "If beauty were time, you’d definitely be an eternity. Happy Birthday gorgeous! ⏳🌹🔥",
  "Do you have a band-aid? Because I just scraped my knee falling so head-over-heels in love with you. 🩹🙈❤️",
  "Are you made of copper and tellurium? Because you are seriously Cu-Te! 🧪✨😉",
  "I must be a snowflake, because I’ve fallen for you and have no intention of ever getting back up! ❄️🫀💫",
  "If being breathtaking was a crime, you’d be serving a life sentence right now, Alihaaa! 🚨🚓😍",
  "Did the sun just come out, or did you just smile at me? ☀️✨🥰",
  "I was wondering if you had an extra heart? Because mine was stolen the very first second I saw you. 🫀🔒💓",
  "Is there an airport nearby, or was that just my heart taking off every time you look at me? ✈️💓💨",
  "If kisses were raindrops, I’d send you a whole hurricane today! 🌧️💋🌪️",
  "Are you a camera? Because every single time I see you, I can’t help but smile! 📸😁💕",
  "I think there’s something wrong with my phone... it doesn’t have your picture as its permanent lockscreen yet! 📱🤭❤️",
  "Even if there was zero gravity on earth, I’d still find myself falling for you every single day! 🪐👩‍🚀💖"
];

export const BIRTHDAY_PROMISES: string[] = [
  "I promise to always protect your smile, even on the days when the clouds try to hide the sun. ⛅🛡️💖",
  "I promise to listen to you, cherish you, and remind you how special you are every single day of this year. 👂🌸💫",
  "No matter how busy life gets, you will always be my number one priority and my safest haven. 🕊️🏡❤️",
  "I promise to never let you feel alone in this big world, holding your hand through every high and low. 🤝✨🥺",
  "I promise to celebrate you not just today on your birthday, but in all the little unwritten moments ahead. 🥂🎈💕"
];

export const POETIC_COMPLIMENTS: string[] = [
  "You walk with a grace that turns the simplest room into a royal palace. 🏰👑🌸",
  "Your voice has a gentleness that can calm the loudest storm inside my head. 🌊🎧🤍",
  "The kindness in your heart shines through your face like morning sunlight through rose petals. 🌹🌅✨",
  "You don’t just look beautiful, Alihaaa—you make everyone around you feel valued and loved. 💎💫",
  "A masterpiece could take a lifetime to paint, yet none could capture the depth of your soul. 🎨🖼️💖"
];

// Dynamic combination templates to generate literally infinite unique wishes
const DYNAMIC_OPENERS = [
  "Alihaaa, my gurll,",
  "Dearest Alihaaa,",
  "To the prettiest girl alive,",
  "My dearest birthday girl,",
  "Sweetest Alihaaa♡,",
  "To my favorite star in the sky,"
];

const DYNAMIC_BODIES = [
  "may your new year be painted in shades of golden joy, pink sunsets, and heart-melting laughter 🌅💖",
  "I hope life treats you as gently and wonderfully as you treat the hearts around you 🌸🧸",
  "every star in tonight's sky is twinkling just to celebrate the day you arrived on earth 🌌✨",
  "your smile is my absolute favorite thing in the universe and I promise to cherish it always 🥹🌹",
  "may every secret wish you make as you blow your candles turn into reality before this year ends 🎂🕯️💫",
  "you deserve oceans of peace, galaxies of blessings, and a heart that is never broken 🌊🪐💕"
];

const DYNAMIC_CLOSINGS = [
  "You are truly one of a kind. Happy Birthday! 💖",
  "Forever cheering for your happiness! 🥂🎉",
  "With all my love and countless prayers, always. 🤲🌹",
  "Keep shining bright, my angel. 👑✨",
  "You own my whole heart today and forever. 🔒❤️"
];

export function generateInfiniteWish(category?: 'romantic' | 'pickup_line' | 'promise' | 'compliment'): GeneratedWish {
  const cat = category || (['romantic', 'pickup_line', 'promise', 'compliment'][Math.floor(Math.random() * 4)] as any);

  let content = '';
  let emoji = '💖';
  let categoryLabel = 'Romantic Wish';
  let highlightWord = 'Love';
  let moodColor = 'from-pink-500/20 to-rose-500/20';

  if (cat === 'romantic') {
    content = ROMANTIC_WISHES[Math.floor(Math.random() * ROMANTIC_WISHES.length)];
    emoji = '🌹';
    categoryLabel = 'Heartfelt Romance';
    highlightWord = 'Soulmate';
    moodColor = 'from-rose-500/25 via-pink-500/20 to-purple-500/20';
  } else if (cat === 'pickup_line') {
    content = SWEET_PICKUP_LINES[Math.floor(Math.random() * SWEET_PICKUP_LINES.length)];
    emoji = '😉';
    categoryLabel = 'Flirty & Cute';
    highlightWord = 'Sweetest';
    moodColor = 'from-amber-500/25 via-pink-500/20 to-rose-500/20';
  } else if (cat === 'promise') {
    content = BIRTHDAY_PROMISES[Math.floor(Math.random() * BIRTHDAY_PROMISES.length)];
    emoji = '💍';
    categoryLabel = 'Birthday Promise';
    highlightWord = 'Forever';
    moodColor = 'from-fuchsia-500/25 via-purple-500/20 to-pink-500/20';
  } else if (cat === 'compliment') {
    content = POETIC_COMPLIMENTS[Math.floor(Math.random() * POETIC_COMPLIMENTS.length)];
    emoji = '✨';
    categoryLabel = 'Poetic Compliment';
    highlightWord = 'Grace';
    moodColor = 'from-purple-500/25 via-indigo-500/20 to-pink-500/20';
  } else {
    // Dynamic generated unique wish
    const op = DYNAMIC_OPENERS[Math.floor(Math.random() * DYNAMIC_OPENERS.length)];
    const bd = DYNAMIC_BODIES[Math.floor(Math.random() * DYNAMIC_BODIES.length)];
    const cl = DYNAMIC_CLOSINGS[Math.floor(Math.random() * DYNAMIC_CLOSINGS.length)];
    content = `${op} ${bd}. ${cl}`;
    emoji = '💫';
    categoryLabel = 'Infinite Starlight Wish';
    highlightWord = 'Magic';
    moodColor = 'from-pink-500/25 via-amber-500/20 to-rose-500/20';
  }

  return {
    id: `wish-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    content,
    category: cat,
    categoryLabel,
    emoji,
    highlightWord,
    moodColor
  };
}
