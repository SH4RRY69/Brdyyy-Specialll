import React, { useState, useRef } from 'react';
import { 
  Sparkles, Feather, Heart, Copy, Check, Flame, RefreshCw, 
  Bookmark, ChevronLeft, ChevronRight, Share2, BookOpen
} from 'lucide-react';
import { birthdayAudio } from '../utils/audioSynthesizer';
import { triggerRealisticConfetti, triggerHeartShower } from '../utils/confettiFireworks';
import { activityTracker } from '../utils/activityTracker';
import { securityTracker } from '../utils/securityTracker';

interface AntiqueWishesBookProps {
  girlName: string;
}

export interface PoetryPage {
  pageNumber: number;
  chapterTitle: string;
  themeTag: string;
  shayariLines: string[]; // 4 lines of deep Roman Urdu poetry
  englishSoulMeaning: string; // The deep heart-touching emotional essence
  signature: string;
}

export interface BookSpread {
  spreadId: string;
  leftPage: PoetryPage;
  rightPage: PoetryPage;
}

export const AntiqueWishesBook: React.FC<AntiqueWishesBookProps> = ({ girlName }) => {
  const [currentSpreadIndex, setCurrentSpreadIndex] = useState<number>(0);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [favoritedPageId, setFavoritedPageId] = useState<number | null>(null);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Deep, soul-stirring, heart-touching Roman Urdu Shayari Spreads (Left & Right 2-sided pages)
  const [spreads, setSpreads] = useState<BookSpread[]>([
    {
      spreadId: 'spread-1',
      leftPage: {
        pageNumber: 1,
        chapterTitle: 'Safah-e-Awwal: Noor-e-Mujassim',
        themeTag: 'Ishq-e-Haqeeqi 🌹',
        shayariLines: [
          `Hazaar chehron mein sirf ek chehra azeez tha,`,
          `Khuda se maangi hui har dua ka naseeb tha,`,
          `Wo muskura de toh behak jaata hai aalam saara,`,
          `Meri har subah, har shaam ka tu hi toh raqeeb tha.`
        ],
        englishSoulMeaning: `Among thousands of faces in this crowded world, your smile alone became my destined prayer. In your gentle eyes rests my entire peaceful universe.`,
        signature: `Likha tere naam, Sherry 🖋️`
      },
      rightPage: {
        pageNumber: 2,
        chapterTitle: 'Safah-e-Doam: Tashbeeh-e-Wafa',
        themeTag: 'Duaon Ka Asar 💫',
        shayariLines: [
          `Teri aankhon mein thehre hain sitaron ke jahan saare,`,
          `Tere aane se mehke hain meri chahat ke kinaare,`,
          `Tu na ho toh fizaon mein koi rang nahi rehta,`,
          `Tu jo paas ho toh jeet lete hain hum toofan saare.`
        ],
        englishSoulMeaning: `Within your eyes dwell entire galaxies of peace. When you walk beside me, ${girlName}, even the fiercest storm becomes gentle rain.`,
        signature: `Tere khwaabon ka muhafiz, Sherry 💍`
      }
    },
    {
      spreadId: 'spread-2',
      leftPage: {
        pageNumber: 3,
        chapterTitle: 'Safah-e-Sehum: Sukoon-e-Qalb',
        themeTag: 'Jazbaat-e-Dil 🥺',
        shayariLines: [
          `Koi pooche agar mujhse ke sukoon kise kehte hain,`,
          `Hum has ke keh denge ke tere wajood ko kehte hain,`,
          `Duniya ki har khushi feeki lagti hai tere aage,`,
          `Hum toh har saans mein sirf tera he naam lete hain.`
        ],
        englishSoulMeaning: `If anyone ever asks me to define true peace, I will whisper your name without hesitation. Every beat of my heart breathes your remembrance.`,
        signature: `Rooh se chaha hai tujhe, Sherry 📜`
      },
      rightPage: {
        pageNumber: 4,
        chapterTitle: 'Safah-e-Chaharum: Qaul-e-Wafa',
        themeTag: 'Hamesha Ka Saath ♾️',
        shayariLines: [
          `Chahe dhoop ho kadi ya raaton ka andhera ho,`,
          `Mera har aane wala kal sirf aur sirf tera ho,`,
          `Haath thaam ke chalunga tera aakhri saans tak,`,
          `Rab kare meri har dua mein bas tera he basera ho.`
        ],
        englishSoulMeaning: `Through blazing sunshine or quiet midnight shadows, my hand will never let go of yours. An unbreakable vow woven into eternity.`,
        signature: `Har janam mein tera, Sherry ✨`
      }
    },
    {
      spreadId: 'spread-3',
      leftPage: {
        pageNumber: 5,
        chapterTitle: 'Safah-e-Panjum: Shab-e-Wiladat',
        themeTag: 'Salgirah Ka Tohfa 🎂',
        shayariLines: [
          `Aaj ke din zameen pe ek noor sa utra tha,`,
          `Sitare jhuk gaye the jab wo chand nikla tha,`,
          `Mubaarak ho tujhe ye saalgirah ka haseen lamha,`,
          `Khuda ne mere hisse ka har khwaab tujh mein likha tha.`
        ],
        englishSoulMeaning: `On this sacred day, divine light stepped upon the earth and the stars bowed down. God wrote every dream meant for my destiny into your existence.`,
        signature: `Janamdin Mubaarak Meri Jaan, Sherry 🌹`
      },
      rightPage: {
        pageNumber: 6,
        chapterTitle: 'Safah-e-Shashum: Kainaat Ka Raaz',
        themeTag: 'Sitaron Se Aage 🌌',
        shayariLines: [
          `Na aasmaan ki tamanna hai na taaron ki talab,`,
          `Tu muskurati rahe bas itni si hai meri adab,`,
          `Tere aansu meri palkon pe gir jaayein agar,`,
          `Hum jaan b waar dein tere ek tabassum ke sabab.`
        ],
        englishSoulMeaning: `I seek neither the glory of kingdoms nor the stars above; I only pray to keep tears away from your eyes and laughter forever upon your lips.`,
        signature: `Har pal tera he shukarguzar, Sherry 💫`
      }
    },
    {
      spreadId: 'spread-4',
      leftPage: {
        pageNumber: 7,
        chapterTitle: 'Safah-e-Haftum: Chahat Ka Safar',
        themeTag: 'Beshumar Mohabbat 💖',
        shayariLines: [
          `Kitni ajeeb baat hai ke lafz kam pad jaate hain,`,
          `Jab b hum tere husn-o-seerat ko likhne aate hain,`,
          `Tu aisi haseen aadat ban gayi hai meri,`,
          `Ke sajde mein b hum pehle teri khushi maang aate hain.`
        ],
        englishSoulMeaning: `How wondrous that words fall silent whenever I try to pen your grace. In my quietest prayers before God, your happiness is the very first thing I plead for.`,
        signature: `Duaon mein basaya hua, Sherry 🤲`
      },
      rightPage: {
        pageNumber: 8,
        chapterTitle: 'Safah-e-Hashtum: Aakhri Manzil',
        themeTag: 'Manzil-e-Ishq 🕊️',
        shayariLines: [
          `Tujhse shuru hua hai safar aur tujhpe he khatam hoga,`,
          `Mera ishq tere aage kabhi b na kam hoga,`,
          `Log kehte hain waqt sab badal deta hai magar,`,
          `Tere liye mera jazba har din aur gehra he sanam hoga.`
        ],
        englishSoulMeaning: `My journey began with your name, and it shall find its final resting place in your arms. Time will only deepen the reverent ocean of love I carry for you.`,
        signature: `Azal se abad tak, Sherry 💍`
      }
    },
    {
      spreadId: 'spread-5',
      leftPage: {
        pageNumber: 9,
        chapterTitle: 'Safah-e-Nohum: Chashm-e-Siyah',
        themeTag: 'Aankhon Ka Jadu 👁️✨',
        shayariLines: [
          `Teri gehri aankhon mein ek ajeeb sa asar hai,`,
          `In mein doob ke lagta hai ke rooh be-khabar hai,`,
          `Na kisi maikhaane ki zaroorat hai humein ab,`,
          `Tere ek nigaah-e-karam pe he meri nazar hai.`
        ],
        englishSoulMeaning: `In the serene depth of your eyes lies a calm purer than starlight. One gentle glance from you heals every weary thought in my soul.`,
        signature: `Tere noor ka diwana, Sherry 🌹`
      },
      rightPage: {
        pageNumber: 10,
        chapterTitle: 'Safah-e-Dahum: Dhadkan-e-Wajood',
        themeTag: 'Roohani Bandhan 💓',
        shayariLines: [
          `Dil dhadakta hai seene mein magar naam tera leta hai,`,
          `Mera har ehsaas har lamha tujhe paas pa leta hai,`,
          `Faasle laakh b hon darmiyan hamare toh kya hua,`,
          `Mohabbat ka silsila roohon ko aapas mein mila deta hai.`
        ],
        englishSoulMeaning: `My heart beats within my chest, yet it whispers your name with every pulse. Distance fades to dust when two souls are bound together forever.`,
        signature: `Har saans mein shamil, Sherry 💍`
      }
    },
    {
      spreadId: 'spread-6',
      leftPage: {
        pageNumber: 11,
        chapterTitle: 'Safah-e-Yazdahum: Shamil-e-Dua',
        themeTag: 'Tahajjud Ka Khwaab 🤲🌙',
        shayariLines: [
          `Raat ke aakhri pehar mein jab sab so jaate hain,`,
          `Hum haath utha kar sirf tere he ho jaate hain,`,
          `Maangte hain rab se teri lambi umar aur hansi,`,
          `Aur phir tere khayalon ki chaadar mein kho jaate hain.`
        ],
        englishSoulMeaning: `In the quiet hours before dawn when the world rests in silence, I lift my hands and pray for your radiant smile, peaceful life, and safety.`,
        signature: `Duaon ka pehredaar, Sherry 💫`
      },
      rightPage: {
        pageNumber: 12,
        chapterTitle: 'Safah-e-Dawazdahum: Gul-e-Gulzar',
        themeTag: 'Khushboo-e-Wafa 🌺',
        shayariLines: [
          `Tere aane se meri banjar zindagi mein phool khile,`,
          `Kitne shukraane karein ke humein aisi Alihaaa mili,`,
          `Har dard bhula diya teri ek meethi aawaz ne,`,
          `Jaise tapti dhoop ke baad thandi si shabnam mili.`
        ],
        englishSoulMeaning: `Like morning dew touching a parched meadow, your sweet presence revitalized my world. I thank God endlessly for bringing Alihaaa into my life.`,
        signature: `Teri hansi pe qurbaan, Sherry 🕊️`
      }
    },
    {
      spreadId: 'spread-7',
      leftPage: {
        pageNumber: 13,
        chapterTitle: 'Safah-e-Seezdahum: Chandni Raatein',
        themeTag: 'Mahtab-e-Ishq 🌕',
        shayariLines: [
          `Aasmaan ka chaand b tujhe dekh ke sharma jaata hai,`,
          `Tere roop ke aage uska noor b feeka pad jaata hai,`,
          `Wo toh faqat daag liye ghoomta hai falak par,`,
          `Mera chaand toh zameen pe he dil mein utar jaata hai.`
        ],
        englishSoulMeaning: `Even the moon hides behind clouds in shy admiration of your beauty. Heaven's moon carries shadows, but my living moon is flawlessness itself.`,
        signature: `Tujh pe fida, Sherry 🌙`
      },
      rightPage: {
        pageNumber: 14,
        chapterTitle: 'Safah-e-Chahardahum: Muhafiz-e-Jaan',
        themeTag: 'Hifazat Ka Ahed 🛡️',
        shayariLines: [
          `Teri hansi pe aanch b na aane dunga main kabhi,`,
          `Har toofan ke aage khud khada ho jaunga main abhi,`,
          `Sherry ka wada hai ye apni pyaari Alihaaa se,`,
          `Meri jaan b chali jaaye par tujhe khush rakhunga hamesha sabhi.`
        ],
        englishSoulMeaning: `I promise to shield your laughter against every sorrow in this world. Sherry's unbreakable oath is your lifelong happiness, honor, and shelter.`,
        signature: `Tera mukhlis sathi, Sherry 👑`
      }
    },
    {
      spreadId: 'spread-8',
      leftPage: {
        pageNumber: 15,
        chapterTitle: 'Safah-e-Paanj-Dahum: Janam-Janam',
        themeTag: 'Azal Ka Rishta ♾️',
        shayariLines: [
          `Yeh koi is jahan ki baat nahi jo khatam ho jaaye,`,
          `Yeh wo rishta hai jo roohon ke darmayan likh diya jaaye,`,
          `Saath chalenge hum ta-qayamat tak haath pakad kar,`,
          `Khuda kare ke hamara ye ishq har aalam mein misaal ban jaaye.`
        ],
        englishSoulMeaning: `Our bond is not of fleeting days; it was woven into destiny before time. We will walk side by side across lifetimes, an eternal testament to pure devotion.`,
        signature: `Hamesha tera he, Sherry 🖋️`
      },
      rightPage: {
        pageNumber: 16,
        chapterTitle: 'Safah-e-Shanzdahum: Mukammal Jahan',
        themeTag: 'Jannat-e-Qalb 🏰💖',
        shayariLines: [
          `Tu mil gayi toh laga ke saari dunya mil gayi,`,
          `Bhatakte hue musafir ko uski manzil mil gayi,`,
          `Ab kisi aur cheez ki hasrat nahi baqi is dil ko,`,
          `Alihaaa ke roop mein Sherry ko uski jannat mil gayi.`
        ],
        englishSoulMeaning: `In finding you, it felt as though all the treasures of creation were placed into my hands. In Alihaaa, Sherry has discovered his heaven upon earth.`,
        signature: `Azal se abad tak, Sherry 💍`
      }
    },
    {
      spreadId: 'spread-9',
      leftPage: {
        pageNumber: 17,
        chapterTitle: 'Safah-e-Hafdahum: Baraan-e-Rahmat',
        themeTag: 'Barish Aur Khushboo 🌧️🌹',
        shayariLines: [
          `Jab barasti hai barish toh teri yaad aati hai,`,
          `Hawa b mehek ke tera he sandesa laati hai,`,
          `Teri aawaz mein jo khanak hai phoolon jaisi,`,
          `Wo mere thake hue dil ko sukoon de jaati hai.`
        ],
        englishSoulMeaning: `When the monsoon rain cascades from the heavens, every falling droplet echoes your gentle laughter. Your sweet voice brings unshakeable solace to my tired soul.`,
        signature: `Bheegi hawaon mein tera, Sherry 🌧️`
      },
      rightPage: {
        pageNumber: 18,
        chapterTitle: 'Safah-e-Hajdahum: Roshni-e-Qalb',
        themeTag: 'Noor-e-Basirat 💡✨',
        shayariLines: [
          `Andheri raahon mein tu mera chiragh bani,`,
          `Mera har khoya hua khwaab tera sabaq bani,`,
          `Agar dunya humse rooth b jaaye toh gham nahi,`,
          `Kyunke tu mere har aane wale kal ki umeed bani.`
        ],
        englishSoulMeaning: `In the darkest storms of life, your warmth became my guiding beacon. Let the world turn away, for your unwavering trust is all the strength I will ever need.`,
        signature: `Hifazat-e-Jaan, Sherry 🛡️`
      }
    },
    {
      spreadId: 'spread-10',
      leftPage: {
        pageNumber: 19,
        chapterTitle: 'Safah-e-Nuzdahum: Qalb-e-Muztar',
        themeTag: 'Dhadkanon Ka Sukoon 💓',
        shayariLines: [
          `Log kehte hain dil to seene mein basta hai,`,
          `Par mera dil toh teri galiyon mein hansta hai,`,
          `Teri khushi ke aage har daulat feeki hai,`,
          `Yeh aashiq tere har nakhre pe sasta hai.`
        ],
        englishSoulMeaning: `They say the heart resides within the chest, but mine has made its quiet home inside your smile. Your happiness is the only wealth I yearn for.`,
        signature: `Nakhron ka ghulam, Sherry 👑`
      },
      rightPage: {
        pageNumber: 20,
        chapterTitle: 'Safah-e-Bistum: Khwaab-e-Haqeeqat',
        themeTag: 'Sachha Khwaab 💫👑',
        shayariLines: [
          `Main sochta tha ke khwaab sirf aankhon mein rehte hain,`,
          `Par tere aane se haqeeqat b haseen lagte hain,`,
          `Rab ne banaya hoga tujhe fursat se akele mein,`,
          `Tabhi toh farishte b teri tareef mein jhukte hain.`
        ],
        englishSoulMeaning: `I used to believe miracles belonged solely in fairy tales, until your presence proved they walk upon this earth. Angels themselves marvel at your gentle grace.`,
        signature: `Qudrat ka shukriya, Sherry ✨`
      }
    },
    {
      spreadId: 'spread-11',
      leftPage: {
        pageNumber: 21,
        chapterTitle: 'Safah-e-Bist-o-Yakam: Ehed-e-Wafa',
        themeTag: 'Qayamat Tak Ka Wada ♾️',
        shayariLines: [
          `Waqt badal jaaye ga, mausam badal jaayeinge,`,
          `Zameen o aasmaan ke saare silsile badal jaayeinge,`,
          `Magar Sherry ka ishq Alihaaa ke liye kabhi na badlega,`,
          `Chahe hum dono dunya ke kisi b mod pe pohonch jaayeinge.`
        ],
        englishSoulMeaning: `Seasons may wither and centuries may crumble into dust, but the sanctuary of love I hold for Alihaaa will remain steadfast until the end of time.`,
        signature: `Sadaq-e-Dil, Sherry 📜`
      },
      rightPage: {
        pageNumber: 22,
        chapterTitle: 'Safah-e-Bist-o-Doam: Dua-e-Ne\'mat',
        themeTag: 'Rab Ka Shukar 🤲🌸',
        shayariLines: [
          `Har namaz ke baad jo dua hothon pe aati hai,`,
          `Wo teri lambi umar aur sehat ki bahaar laati hai,`,
          `Aye khuda, meri har khushi meri Alihaaa ko de de,`,
          `Kyunke uski ek hasi meri saari thakan mita jaati hai.`
        ],
        englishSoulMeaning: `After every prayer, my quietest plea to the Almighty is for your radiant health, safety, and boundless prosperity. Your laughter washes all sorrow away.`,
        signature: `Dua-go, Sherry 🤲`
      }
    },
    {
      spreadId: 'spread-12',
      leftPage: {
        pageNumber: 23,
        chapterTitle: 'Safah-e-Bist-o-Sehum: Taj-e-Kainat',
        themeTag: 'Malika-e-Dil 👑',
        shayariLines: [
          `Na takht ki chahat, na taaj ki aarzoo hai,`,
          `Meri saltanat toh bas tere rukh ki justuju hai,`,
          `Tu muskurati rahe mere aangan mein hamesha,`,
          `Is se badhkar mere liye koi khush-boo hai?`
        ],
        englishSoulMeaning: `I desire neither emperor crowns nor golden kingdoms; my only empire is the warmth of your smile illuminating our days with eternal spring.`,
        signature: `Tera pehredaar, Sherry 🏰`
      },
      rightPage: {
        pageNumber: 24,
        chapterTitle: 'Safah-e-Bist-o-Chaharum: Aakhri Harf',
        themeTag: 'Abadi Mohabbat 💍🌹',
        shayariLines: [
          `Kitaab-e-ishq ka aakhri lafz b tera he naam hoga,`,
          `Zindagi ki aakhri shaam ka salam b tere naam hoga,`,
          `Alihaaa, tu Sherry ki thi, tu Sherry ki hai,`,
          `Yeh silsila qayamat tak isi tarah aam hoga.`
        ],
        englishSoulMeaning: `The final word inscribed in the book of my soul will forever be Alihaaa. You were, you are, and you shall forever remain my sacred home.`,
        signature: `Azal se ta-qayamat, Sherry 💍💖`
      }
    }
  ]);

  // Deep Roman Urdu Shayari Generator Pool for Endless Spreads
  const SHAYARI_GENERATOR_POOL = [
    {
      left: {
        title: 'Nafs-e-Mohabbat',
        tag: 'Rooh Ka Rishta 🌙',
        lines: [
          'Tere aane se pehle dil faqat ek veeran shahar tha,',
          'Har lamha zindagi ka be-maqsad sa ek qahar tha,',
          'Tune chhua jo rooh ko toh bahaar aa gayi,',
          'Warna is seene mein he dardon ka bahr tha.'
        ],
        soul: 'Before your presence graced my path, life was an aimless wandering. The moment your soul touched mine, spring blossomed inside my chest.'
      },
      right: {
        title: 'Muqaddar Ka Sitara',
        tag: 'Qismat Ka Tohfa 💫',
        lines: [
          'Taqdeer ne likha jo toh sab se aala likha,',
          'Mere andheron mein tera roshan ujaala likha,',
          'Shukar ada kaise karein us rab-e-jahan ka hum,',
          'Jisne meri kismat mein itna pyara hamsafar bana daala likha.'
        ],
        soul: 'When destiny crafted my fortune, it gifted me your radiant light. I bow in infinite gratitude to Heaven for binding our souls together.'
      }
    },
    {
      left: {
        title: 'Tabassum-e-Aliha',
        tag: 'Qeemti Muskurahat 🌸',
        lines: [
          'Teri hansi ki khanak pe fida ho gaya jahan,',
          'Tu muskuraye toh mehek uthta hai saara aasmaan,',
          'Rabb se bas itni iltija hai mere humdum,',
          'Tujhpe kabhi na aaye kisi gham ka b koi nishaan.'
        ],
        soul: 'The world stands breathless before the melody of your laughter. May the Almighty shield your tender heart from even the faintest shadow of sorrow.'
      },
      right: {
        title: 'Wada-e-Wafa',
        tag: 'Dhadkan Ka Ahed 💍',
        lines: [
          'Yeh wada raha ke hum tere saath he rahenge,',
          'Har mushkil ko has ke tere aage he sahenge,',
          'Duniya bhale he laakh dushwariyan laaye saamne,',
          'Hum faqat Alihaaa ke the aur Alihaaa ke he rahenge.'
        ],
        soul: 'Let this vow be etched upon the stone of time: Sherry belongs to Alihaaa alone, in this world and across every realm that follows.'
      }
    },
    {
      left: {
        title: 'Rang-e-Firaaq-o-Wisaal',
        tag: 'Qurbat Ka Nasha 🍷',
        lines: [
          'Tujhe sochna b meri ibadat sa lagta hai,',
          'Teri chahat ka rang sab se juda sa lagta hai,',
          'Log dhoondhte hain khuda ko mandar aur masjid mein,',
          'Mujhe teri aankhon mein noor-e-khuda sa lagta hai.'
        ],
        soul: 'Simply thinking of you feels like sacred prayer. In the gentle innocence of your eyes, I witness the divine compassion of the Creator.'
      },
      right: {
        title: 'Zindagi Ka Gehna',
        tag: 'Anmol Mohabbat 💎',
        lines: [
          'Tu hai toh meri subah mein he heera chamakta hai,',
          'Tu hai toh meri shaam mein gulab mehakta hai,',
          'Tere baghair ek pal b guzarna azaab hai,',
          'Tu paas ho toh mera har khwaab he dehekta hai.'
        ],
        soul: 'You are the morning brilliance and the evening rose. Without you, a single moment feels like exile; with you, every longing turns to gold.'
      }
    },
    {
      left: {
        title: 'Chamakte Khwaab',
        tag: 'Kainati Ishq 🌌',
        lines: [
          'Yeh sitare falak ke sab teri deed ko tarsein,',
          'Abr-e-rehmat banke teri chahat mujhpe barsein,',
          'Hum toh lut gaye tere masoom se lehje par,',
          'Ab kisi aur ki hasrat mein hum kyu tarsein.'
        ],
        soul: 'Even the constellations yearn for a single glimpse of your beauty. In the warmth of your innocence, my soul found its eternal sanctuary.'
      },
      right: {
        title: 'Qalb-e-Sukoon',
        tag: 'Jazba-e-Bemisal 💖',
        lines: [
          'Tera chehra dekh ke aati hai dil ko rahat,',
          'Beshumar hai meri tujhse har pal ye chahat,',
          'Duaon mein rab se jo maanga tha maine,',
          'Tu he hai mere khwaabon ki wo mukammal aayat.'
        ],
        soul: 'Looking upon your face bestows peace upon my soul. You are the sacred verse God granted in answer to all my silent prayers.'
      }
    },
    {
      left: {
        title: 'Safarnama-e-Dil',
        tag: 'Aakhri Manzil 🕊️',
        lines: [
          'Hum toh musafir the be-naam se raaste ke,',
          'Tune roshan kiya safar mohabbat ke waaste se,',
          'Khuda kare hamara ye saath hamesha salamat rahe,',
          'Koi juda na kar sake humein kisi b bahane se.'
        ],
        soul: 'I was a wanderer walking pathless roads until your love illuminated my horizon. May Heaven keep our union protected from all storms.'
      },
      right: {
        title: 'Salgirah Ka Paigham',
        tag: 'Jashn-e-Noor 🎂👑',
        lines: [
          'Mubaarak ho tujhe ye roshan saalgirah ka samaa,',
          'Teri hansi se hamesha mehke ye saara jahan,',
          'Sherry ki har saans sirf tere liye dua-go hai,',
          'Tu sada salamat rahe meri zameen aur aasmaan.'
        ],
        soul: 'Blessed be this radiant birthday hour! Sherry breathes prayers for your lifelong laughter, happiness, and sovereignty, my Queen.'
      }
    }
  ];

  const currentSpread = spreads[currentSpreadIndex] || spreads[0];

  // Flip Page Navigation with 3D animation and sound
  const handleNextSpread = () => {
    if (currentSpreadIndex < spreads.length - 1 && !isFlipping) {
      setIsFlipping(true);
      setFlipDirection('next');
      birthdayAudio.playPageFlip();
      setTimeout(() => {
        setCurrentSpreadIndex(prev => prev + 1);
        setTimeout(() => setIsFlipping(false), 240);
      }, 220);
    }
  };

  const handlePrevSpread = () => {
    if (currentSpreadIndex > 0 && !isFlipping) {
      setIsFlipping(true);
      setFlipDirection('prev');
      birthdayAudio.playPageFlip();
      setTimeout(() => {
        setCurrentSpreadIndex(prev => prev - 1);
        setTimeout(() => setIsFlipping(false), 240);
      }, 220);
    }
  };

  // Touch Swipe detection for mobile natural page swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX - touchEndX;

    if (diffX > 50) {
      // Swiped Left -> Next page
      handleNextSpread();
    } else if (diffX < -50) {
      // Swiped Right -> Previous page
      handlePrevSpread();
    }
    setTouchStartX(null);
  };

  // Endless Unlimited Shayari Spread Generator!
  const handleGenerateEndlessSpreads = () => {
    setIsGenerating(true);
    birthdayAudio.playSparkleChime();
    birthdayAudio.playPageFlip();

    setTimeout(() => {
      const template = SHAYARI_GENERATOR_POOL[Math.floor(Math.random() * SHAYARI_GENERATOR_POOL.length)];
      const nextLeftPageNum = spreads.length * 2 + 1;
      const nextRightPageNum = nextLeftPageNum + 1;

      const newSpread: BookSpread = {
        spreadId: `spread-endless-${Date.now()}`,
        leftPage: {
          pageNumber: nextLeftPageNum,
          chapterTitle: `Safah #${nextLeftPageNum}: ${template.left.title}`,
          themeTag: template.left.tag,
          shayariLines: template.left.lines,
          englishSoulMeaning: template.left.soul,
          signature: `Taza Ash'aar Ba-Qalam Sherry 🖋️📜`
        },
        rightPage: {
          pageNumber: nextRightPageNum,
          chapterTitle: `Safah #${nextRightPageNum}: ${template.right.title}`,
          themeTag: template.right.tag,
          shayariLines: template.right.lines,
          englishSoulMeaning: template.right.soul,
          signature: `Likha Sirf Alihaaa Ke Liye, Sherry 💖`
        }
      };

      setSpreads(prev => [...prev, newSpread]);
      setCurrentSpreadIndex(spreads.length);
      setIsGenerating(false);
      triggerRealisticConfetti();
      triggerHeartShower();
      activityTracker.logEvent('wish', 'Penned New 2-Sided Antique Shayari Spread 🖋️', `Pages ${nextLeftPageNum} & ${nextRightPageNum} for ${girlName}`, 'amber');
    }, 450);
  };

  const handleCopyShayari = (page: PoetryPage) => {
    const textToCopy = `“${page.chapterTitle}”\n\n${page.shayariLines.join('\n')}\n\n— ${page.signature}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedText(`page-${page.pageNumber}`);
    birthdayAudio.playSparkleChime();
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleFavoritePage = (page: PoetryPage) => {
    securityTracker.toggleFavorite({
      id: `burnt-book-p${page.pageNumber}`,
      content: `${page.chapterTitle}:\n${page.shayariLines.join(' | ')}`,
      category: 'romantic',
      categoryLabel: '📜 Deep Antique Shayari',
      emoji: '🌹'
    });
    setFavoritedPageId(page.pageNumber);
    birthdayAudio.playSparkleChime();
    setTimeout(() => setFavoritedPageId(null), 2000);
  };

  return (
    <div 
      className="w-full flex flex-col items-center space-y-6 select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Header Pill & Spread Counter */}
      <div className="w-full max-w-4xl flex items-center justify-between px-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 border border-amber-500/40 font-serif flex items-center gap-1.5 font-bold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
            <span>2-Sided Burnt & Torn Poetry Grimoire</span>
          </span>
          <span className="text-white/60 hidden sm:inline italic">
            Deep Roman Urdu Shayari Spread
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-amber-300 bg-black/60 px-3 py-1 rounded-full border border-amber-500/30 text-[11px]">
            Pages {currentSpread.leftPage.pageNumber} &amp; {currentSpread.rightPage.pageNumber} of {spreads.length * 2}
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 📖 THE 2-SIDED OPEN ANTIQUE BURNT BOOK CONTAINER                           */}
      {/* ========================================================================= */}
      <div className="relative w-full max-w-5xl px-2 sm:px-4">
        {/* Soft fiery ember glow behind the grimoire */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600/25 via-orange-600/30 to-amber-700/25 blur-3xl rounded-[40px] pointer-events-none" />

        {/* Heavy Antique Leather Cover Binding */}
        <div 
          className="relative rounded-[32px] p-2 sm:p-4 bg-gradient-to-b from-[#2a130a] via-[#1a0c06] to-[#0f0502] border-2 border-amber-600/60 shadow-2xl shadow-black/95 overflow-hidden"
          style={{ perspective: '1600px' }}
        >
          {/* Filigree Corner Embellishments */}
          <div className="absolute top-2 left-2 text-amber-500/70 font-serif text-sm select-none">❖</div>
          <div className="absolute top-2 right-2 text-amber-500/70 font-serif text-sm select-none">❖</div>
          <div className="absolute bottom-2 left-2 text-amber-500/70 font-serif text-sm select-none">❖</div>
          <div className="absolute bottom-2 right-2 text-amber-500/70 font-serif text-sm select-none">❖</div>

          {/* Central Leather Spine with Red Velvet Ribbon Bookmark */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-black/80 via-amber-950/60 to-black/80 pointer-events-none hidden md:block z-30 shadow-2xl">
            {/* Thread Stitching on Spine */}
            <div className="h-full w-full flex flex-col justify-around items-center opacity-40">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-4 h-0.5 bg-amber-400/60 rounded-full" />
              ))}
            </div>
            {/* Hanging Crimson Silk Ribbon */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3.5 h-36 bg-gradient-to-b from-red-700 via-rose-800 to-red-950 shadow-md rounded-b-sm border-x border-red-900/50" />
          </div>

          {/* ========================================================================= */}
          {/* 📜 TWO-SIDED OPEN SPREAD (LEFT PAGE & RIGHT PAGE)                          */}
          {/* ========================================================================= */}
          <div 
            className={`grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 relative transition-all duration-300 ease-out ${
              isFlipping
                ? flipDirection === 'next'
                  ? 'opacity-60 scale-[0.985] -rotate-y-3'
                  : 'opacity-60 scale-[0.985] rotate-y-3'
                : 'opacity-100 scale-100 rotate-y-0'
            }`}
          >
            {/* ------------------------------------------------------------- */}
            {/* 👈 LEFT PAGE: SAFAH-E-AWWAL                                    */}
            {/* ------------------------------------------------------------- */}
            <div className="relative rounded-2xl p-5 sm:p-7 md:p-8 bg-gradient-to-b from-[#f7eed9] via-[#efe0be] to-[#e4cea2] text-[#2c150c] shadow-inner border border-[#d6be8c] flex flex-col justify-between min-h-[460px] sm:min-h-[500px] overflow-hidden">
              {/* Torn / Jagged Paper Edge Effect ("Phatti hui") */}
              <div 
                className="absolute left-0 inset-y-0 w-2 pointer-events-none opacity-80"
                style={{
                  background: 'repeating-linear-gradient(to bottom, #d4be8f 0px, #d4be8f 4px, transparent 4px, transparent 8px)',
                  boxShadow: 'inset -2px 0 3px rgba(60, 30, 10, 0.25)'
                }}
              />
              <div 
                className="absolute -top-6 -left-6 w-24 h-24 pointer-events-none rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(20,8,3,0.95) 0%, rgba(90,35,10,0.8) 35%, rgba(190,100,25,0.4) 60%, transparent 80%)',
                  filter: 'blur(2px)'
                }}
              />
              {/* Burnt Corner Flame Embers */}
              <div 
                className="absolute -bottom-6 -left-6 w-24 h-24 pointer-events-none rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(20,8,3,0.95) 0%, rgba(90,35,10,0.8) 35%, rgba(190,100,25,0.4) 60%, transparent 80%)',
                  filter: 'blur(2px)'
                }}
              />

              {/* Watermark / Calligraphic BG Flourish */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-8xl font-serif text-[#996515]/10 pointer-events-none select-none">
                ❦
              </div>

              {/* Page Top Header */}
              <div className="relative z-10 space-y-2">
                <div className="flex items-center justify-between border-b border-[#c8aa74]/60 pb-2">
                  <span className="font-serif text-[11px] font-bold uppercase tracking-widest text-[#7a481c] flex items-center gap-1.5">
                    <Feather className="w-3.5 h-3.5 text-[#a25a21]" />
                    <span>{currentSpread.leftPage.themeTag}</span>
                  </span>
                  <span className="font-mono text-xs font-bold text-[#8a5223] px-2 py-0.5 rounded-md bg-[#e4cf9f]/60 border border-[#c4a66e]">
                    Page {currentSpread.leftPage.pageNumber}
                  </span>
                </div>

                <h4 className="font-['Playfair_Display'] text-lg sm:text-xl font-bold text-[#3d1a0e] text-center pt-1 tracking-wide">
                  {currentSpread.leftPage.chapterTitle}
                </h4>

                <div className="flex items-center justify-center text-[#9f6024] text-xs gap-1 select-none opacity-80">
                  <span>✦</span>
                  <span>❦</span>
                  <span>✦</span>
                </div>
              </div>

              {/* Main Shayari Body (4 lines, deep Roman Urdu) */}
              <div className="relative z-10 my-auto py-6 space-y-4 text-center">
                <div className="space-y-3 font-['Playfair_Display'] text-base sm:text-lg md:text-xl font-semibold text-[#2f140a] leading-relaxed tracking-wide italic">
                  {currentSpread.leftPage.shayariLines.map((line, idx) => (
                    <p key={idx} className="transition-all hover:text-[#8a3312] cursor-default drop-shadow-xs">
                      "{line}"
                    </p>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-center gap-2 text-[#9f6024]/70 select-none text-xs">
                  <span>~ ✦ ~</span>
                </div>
              </div>

              {/* Page Bottom Signature & Controls */}
              <div className="relative z-10 pt-3 border-t border-[#cbb07d]/60 flex items-center justify-between text-xs">
                <div className="font-['Dancing_Script'] text-base sm:text-lg font-bold text-[#703615]">
                  {currentSpread.leftPage.signature}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopyShayari(currentSpread.leftPage)}
                    className="p-1.5 rounded-lg bg-[#ded0ac] hover:bg-[#d0be94] text-[#4a2713] transition-all cursor-pointer"
                    title="Copy Shayari"
                  >
                    {copiedText === `page-${currentSpread.leftPage.pageNumber}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    onClick={() => handleFavoritePage(currentSpread.leftPage)}
                    className="p-1.5 rounded-lg bg-[#ded0ac] hover:bg-[#d0be94] text-[#4a2713] transition-all cursor-pointer"
                    title="Save to Favorites"
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${favoritedPageId === currentSpread.leftPage.pageNumber ? 'fill-red-700 text-red-700' : ''}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* 👉 RIGHT PAGE: SAFAH-E-DOAM                                    */}
            {/* ------------------------------------------------------------- */}
            <div className="relative rounded-2xl p-5 sm:p-7 md:p-8 bg-gradient-to-b from-[#f7eed9] via-[#efe0be] to-[#e4cea2] text-[#2c150c] shadow-inner border border-[#d6be8c] flex flex-col justify-between min-h-[460px] sm:min-h-[500px] overflow-hidden">
              {/* Torn / Jagged Paper Edge Effect Right ("Phatti hui") */}
              <div 
                className="absolute right-0 inset-y-0 w-2 pointer-events-none opacity-80"
                style={{
                  background: 'repeating-linear-gradient(to bottom, #d4be8f 0px, #d4be8f 4px, transparent 4px, transparent 8px)',
                  boxShadow: 'inset 2px 0 3px rgba(60, 30, 10, 0.25)'
                }}
              />
              <div 
                className="absolute -top-6 -right-6 w-24 h-24 pointer-events-none rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(20,8,3,0.95) 0%, rgba(90,35,10,0.8) 35%, rgba(190,100,25,0.4) 60%, transparent 80%)',
                  filter: 'blur(2px)'
                }}
              />
              {/* Burnt Corner Flame Embers */}
              <div 
                className="absolute -bottom-6 -right-6 w-24 h-24 pointer-events-none rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(20,8,3,0.95) 0%, rgba(90,35,10,0.8) 35%, rgba(190,100,25,0.4) 60%, transparent 80%)',
                  filter: 'blur(2px)'
                }}
              />

              {/* Watermark / Calligraphic BG Flourish */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-8xl font-serif text-[#996515]/10 pointer-events-none select-none">
                ❦
              </div>

              {/* Page Top Header */}
              <div className="relative z-10 space-y-2">
                <div className="flex items-center justify-between border-b border-[#c8aa74]/60 pb-2">
                  <span className="font-serif text-[11px] font-bold uppercase tracking-widest text-[#7a481c] flex items-center gap-1.5">
                    <Feather className="w-3.5 h-3.5 text-[#a25a21]" />
                    <span>{currentSpread.rightPage.themeTag}</span>
                  </span>
                  <span className="font-mono text-xs font-bold text-[#8a5223] px-2 py-0.5 rounded-md bg-[#e4cf9f]/60 border border-[#c4a66e]">
                    Page {currentSpread.rightPage.pageNumber}
                  </span>
                </div>

                <h4 className="font-['Playfair_Display'] text-lg sm:text-xl font-bold text-[#3d1a0e] text-center pt-1 tracking-wide">
                  {currentSpread.rightPage.chapterTitle}
                </h4>

                <div className="flex items-center justify-center text-[#9f6024] text-xs gap-1 select-none opacity-80">
                  <span>✦</span>
                  <span>❦</span>
                  <span>✦</span>
                </div>
              </div>

              {/* Main Shayari Body (4 lines, deep Roman Urdu) */}
              <div className="relative z-10 my-auto py-6 space-y-4 text-center">
                <div className="space-y-3 font-['Playfair_Display'] text-base sm:text-lg md:text-xl font-semibold text-[#2f140a] leading-relaxed tracking-wide italic">
                  {currentSpread.rightPage.shayariLines.map((line, idx) => (
                    <p key={idx} className="transition-all hover:text-[#8a3312] cursor-default drop-shadow-xs">
                      "{line}"
                    </p>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-center gap-2 text-[#9f6024]/70 select-none text-xs">
                  <span>~ ✦ ~</span>
                </div>
              </div>

              {/* Page Bottom Signature & Controls */}
              <div className="relative z-10 pt-3 border-t border-[#cbb07d]/60 flex items-center justify-between text-xs">
                <div className="font-['Dancing_Script'] text-base sm:text-lg font-bold text-[#703615]">
                  {currentSpread.rightPage.signature}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopyShayari(currentSpread.rightPage)}
                    className="p-1.5 rounded-lg bg-[#ded0ac] hover:bg-[#d0be94] text-[#4a2713] transition-all cursor-pointer"
                    title="Copy Shayari"
                  >
                    {copiedText === `page-${currentSpread.rightPage.pageNumber}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    onClick={() => handleFavoritePage(currentSpread.rightPage)}
                    className="p-1.5 rounded-lg bg-[#ded0ac] hover:bg-[#d0be94] text-[#4a2713] transition-all cursor-pointer"
                    title="Save to Favorites"
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${favoritedPageId === currentSpread.rightPage.pageNumber ? 'fill-red-700 text-red-700' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🧭 NAVIGATION CONTROLS & ENDLESS SHAYARI GENERATOR                          */}
      {/* ========================================================================= */}
      <div className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-3 px-2">
        {/* Previous Page Turn Button */}
        <button
          onClick={handlePrevSpread}
          disabled={currentSpreadIndex === 0 || isFlipping}
          className={`px-4 sm:px-5 py-2.5 rounded-2xl border text-xs sm:text-sm font-serif font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            currentSpreadIndex === 0 || isFlipping
              ? 'opacity-40 bg-white/5 border-white/10 text-white/40 cursor-not-allowed'
              : 'bg-gradient-to-r from-stone-900 to-amber-950/80 hover:from-stone-800 hover:to-amber-900 text-amber-200 border-amber-600/40 shadow-lg shadow-black/80 hover:scale-105 active:scale-95'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Swipe Prev Pages</span>
        </button>

        {/* Center: Endless & Unlimited Shayari Generator Button */}
        <button
          onClick={handleGenerateEndlessSpreads}
          disabled={isGenerating}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-serif font-bold text-xs sm:text-sm shadow-xl shadow-amber-900/60 flex items-center gap-2.5 cursor-pointer transition-all hover:scale-105 active:scale-95 border border-yellow-300/60"
        >
          <Feather className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? "Inking New Ash'aar..." : "Pen Endless New Shayari 📜✨"}</span>
          <Sparkles className="w-3.5 h-3.5 text-slate-950" />
        </button>

        {/* Next Page Turn Button */}
        <button
          onClick={handleNextSpread}
          disabled={currentSpreadIndex === spreads.length - 1 || isFlipping}
          className={`px-4 sm:px-5 py-2.5 rounded-2xl border text-xs sm:text-sm font-serif font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            currentSpreadIndex === spreads.length - 1 || isFlipping
              ? 'opacity-40 bg-white/5 border-white/10 text-white/40 cursor-not-allowed'
              : 'bg-gradient-to-r from-stone-900 to-amber-950/80 hover:from-stone-800 hover:to-amber-900 text-amber-200 border-amber-600/40 shadow-lg shadow-black/80 hover:scale-105 active:scale-95'
          }`}
        >
          <span>Swipe Next Pages</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Touch Swipe Hint for Mobile */}
      <p className="text-[11px] text-white/40 italic text-center select-none">
        💡 Tip: On touchscreens, you can also swipe left or right to flip the antique burnt pages with 3D animation!
      </p>
    </div>
  );
};
