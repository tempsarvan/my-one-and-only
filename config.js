/**
 * 💖 Apple HIG Anniversary Configuration - Shivi & Sarvan
 */

const ANNIVERSARY_CONFIG = {
  // Names
  partnerName: "Shivi",
  yourName: "Sarvan",

  // Relationship Start Date (March 15, 2026 represents 5 months from August 15, 2026)
  startDate: new Date(2026, 2, 15, 0, 0, 0),

  // Next Milestone Date: September 15th, 2026
  nextChapterDate: new Date(2026, 8, 15, 0, 0, 0),

  // Spotify Player Configuration (The Weeknd Playlist)
  spotifyPlaylistUrl: "https://open.spotify.com/embed/playlist/5gFyFkogxMCbcOOhsm54ME?utm_source=generator&theme=0",
  spotifyArtistName: "The Weeknd",
  spotifyTrackName: "The Weeknd Playlist",

  // Real Photorealistic Rose Assets
  realRoseImage: "./assets/real_rose.png",
  realPetalImage: "./assets/real_petal.png",

  // Hero Titles
  heroTitle: "For Shivi, <br><span>My Favorite Chapter.</span>",
  heroSubtitle: "5 Months of Laughs, Late Night Calls & Endless Happiness with Sarvan",

  // Swift Playgrounds / Scratch Block Builder Definitions (Game 1)
  scratchBlocks: [
    { id: "sb-1", type: "event", label: "when 🚩 clicked", color: "#FFAB19", icon: "🚩" },
    { id: "sb-2", type: "motion", label: "build love heart 💖", color: "#4C97FF", icon: "💖" },
    { id: "sb-3", type: "sound", label: "play The Weeknd playlist 🎵", color: "#9966FF", icon: "🎵" },
    { id: "sb-4", type: "looks", label: "say [I love you from Sarvan 💖] for 5 secs", color: "#FF6680", icon: "🌸" }
  ],

  // Quiz Questions & Answers (Game 2)
  quiz: [
    {
      id: "q1",
      question: "What is Sarvan's favorite drink?",
      options: ["Coffee", "Monster", "Iced Tea", "Soda"],
      correct: "Monster"
    },
    {
      id: "q2",
      question: "What is Sarvan's favorite food?",
      options: ["Pizza", "Burger", "Shawarma", "Tacos"],
      correct: "Shawarma"
    },
    {
      id: "q3",
      question: "Who is Sarvan's absolute favorite person?",
      options: ["Shivi 💕", "Shivi 💖", "Shivi ✨", "Shivi 🥰"],
      correct: "Shivi 💕"
    },
    {
      id: "q4",
      question: "What does Sarvan plan to become?",
      options: ["Millionaire", "Billionaire 🚀", "Astronaut", "Rockstar"],
      correct: "Billionaire 🚀"
    }
  ],

  // Dream Location Videos (Venice, Paris, Italy, Rome)
  locationVideos: {
    "venice": {
      name: "Venice, Italy 🚣",
      videoUrl: "https://cdn.pixabay.com/video/2019/04/23/23011-332306797_large.mp4",
      description: "Floating through romantic canals and ancient bridges under golden hour..."
    },
    "paris": {
      name: "Paris, France 🗼",
      videoUrl: "https://cdn.pixabay.com/video/2020/05/25/40149-424933906_large.mp4",
      description: "Sparkling Eiffel Tower lights and romantic cobblestone streets..."
    },
    "italy": {
      name: "Amalfi Coast, Italy 🌊",
      videoUrl: "https://cdn.pixabay.com/video/2021/08/13/84931-587285149_large.mp4",
      description: "Cliffside pastel villages over sparkling turquoise Mediterranean waters..."
    },
    "rome": {
      name: "Rome, Italy 🏛️",
      videoUrl: "https://cdn.pixabay.com/video/2017/11/02/12711-241673841_large.mp4",
      description: "Ancient Colosseum sunset and Trevi Fountain wishes..."
    }
  },

  // Personal Timeline Stories (Polaroid Memory Cards)
  timeline: [
    {
      monthNum: 1,
      title: "Month 1: The Spark & Endless Conversations",
      date: "March 15 - April 15",
      subtitle: "Butterflies, Late Night Chats & Warm Smiles",
      image: "./assets/month1.png",
      story: "Everything felt so magical from the very first day we connected. We started talking and couldn't stop. Every notification from you brought the biggest smile to my face, and late-night calls quickly became the best part of my daily routine."
    },
    {
      monthNum: 2,
      title: "Month 2: Inside Jokes & Stargazing Calls",
      date: "April 15 - May 15",
      subtitle: "Finding My Safest Space & Favorite Person",
      image: "./assets/month2.png",
      story: "By month two, we developed our own secret inside jokes and code words that made us laugh until our cheeks hurt. Staying up late talking under the night sky made me realize how rare, special, and incredible you are to me."
    },
    {
      monthNum: 3,
      title: "Month 3: Playlists & Comforting Calls",
      date: "May 15 - June 15",
      subtitle: "The Soundtrack to Our Days",
      image: "./assets/month3.png",
      story: "Sharing songs, recommending movies, and talking about everything under the sun. Month three proved that no matter how busy or stressful the day got, one call with you made everything peaceful, warm, and right again."
    },
    {
      monthNum: 4,
      title: "Month 4: Deep Understanding & Caring Moments",
      date: "June 15 - July 15",
      subtitle: "Growing Closer Every Single Day",
      image: "./assets/month4.png",
      story: "We learned so much more about each other's dreams, fears, and little quirks. Being there for you through everything became second nature. I fell deeper in love with you each day, knowing we make the best team together."
    },
    {
      monthNum: 5,
      title: "Month 5: Happy 5th Month Anniversary, Shivi!",
      date: "July 15 - August 15",
      subtitle: "To Us & To All Our Future Chapters",
      image: "./assets/month5.png",
      story: "Five wonderful months together, and my heart still skips a beat whenever I see your name on my screen. Thank you for being my comfort, my joy, and my favorite person Shivi. Here's to many more chapters together!"
    }
  ],

  // 3D Flip Cards: Reasons I Love You Notes
  flipCards: [
    {
      frontTitle: "Reason #1",
      frontSubtitle: "Your Smile",
      backNote: "Your smile is my absolute favorite sight in the world. It brightens up even my darkest days instantly! ✨"
    },
    {
      frontTitle: "Reason #2",
      frontSubtitle: "Your Voice",
      backNote: "Hearing your voice on the phone makes all my stress melt away. It's my favorite sound in the universe. 📞"
    },
    {
      frontTitle: "Reason #3",
      frontSubtitle: "Inside Jokes",
      backNote: "The silly jokes only we understand, and laughing until our cheeks hurt together! 😂"
    },
    {
      frontTitle: "Reason #4",
      frontSubtitle: "Your Warm Heart",
      backNote: "How caring, empathetic, and kind you are to everyone around you. You inspire me every day Shivi. 🌸"
    },
    {
      frontTitle: "Reason #5",
      frontSubtitle: "Small Details",
      backNote: "How you remember tiny things I told you weeks ago. It shows how deeply you listen and care. 💌"
    },
    {
      frontTitle: "Reason #6",
      frontSubtitle: "Simply You",
      backNote: "Because you are my best friend, my comfort, and my favorite person all wrapped into one. 💖"
    }
  ],

  // "Open When..." Digital Sealed Envelopes
  envelopes: [
    {
      id: "env-anniversary",
      title: "Open on Our 5-Month Anniversary",
      subtitle: "A special note for today ✨",
      icon: "🎉",
      content: `Happy 5th Month Anniversary, Shivi!\n\nThese past 5 months with you have been the happiest months of my life. Thank you for your warmth, your smile, and for choosing to share your heart with me every single day.\n\nNo matter what obstacles come our way, I will always be right here holding your hand, listening to your stories, and making sure you feel loved and cherished.\n\nI love you more than words can express!\n\nForever yours,\nSarvan 💕`
    },
    {
      id: "env-miss-me",
      title: "Open When You Miss Me",
      subtitle: "When distance feels a bit long 🥺",
      icon: "💌",
      content: `If you're reading this, know that I'm probably thinking of you right now too Shivi.\n\nClose your eyes for 5 seconds and take a deep breath. Imagine me wrapping my arms tightly around you and kissing your forehead.\n\nDistance is only temporary, but my love for you is constant and permanent. Text me right now: "I miss you Sarvan!" and I'll call you as soon as I can! 💖`
    },
    {
      id: "env-smile",
      title: "Open When You Need a Smile",
      subtitle: "Instant mood booster 🌸",
      icon: "😊",
      content: `Remember Shivi: You are incredibly smart, beautiful, kind, and capable of amazing things!\n\nAlso remember that somewhere out there, there's a guy named Sarvan who falls in love with you all over again every single day.\n\nYour smile is my absolute favorite sight in the entire world, so please wear it proudly today! ✨`
    },
    {
      id: "env-sleep",
      title: "Open When You Can't Sleep",
      subtitle: "Sweet dreams & warm thoughts 🌙",
      icon: "💤",
      content: `Put your phone down, pull the blanket up cozy, and remember that you are safe and loved.\n\nLet go of all the thoughts of today. Sleep peacefully knowing that tomorrow morning, I'll be right here waiting to say good morning to you.\n\nGoodnight my sweet angel. Dreams of us!\n\nLove, Sarvan 🌌`
    }
  ],

  // Redeemable Love Coupons
  coupons: [
    {
      id: "c-coffee",
      title: "1 Free Coffee & Treat Date",
      description: "Redeemable for your favorite coffee/tea & snack whenever you want!",
      code: "SARVAN-COFFEE-01",
      icon: "☕",
      tag: "Food & Drink"
    },
    {
      id: "c-call",
      title: "Late Night Call on Demand",
      description: "No matter how late or tired I am, I will stay up and talk to you.",
      code: "SARVAN-CALL-02",
      icon: "📞",
      tag: "Quality Time"
    },
    {
      id: "c-movie",
      title: "Movie Night Choice Veto",
      description: "You get total control to pick any movie/show without any debate!",
      code: "SARVAN-MOVIE-03",
      icon: "🍿",
      tag: "Entertainment"
    },
    {
      id: "c-comfort",
      title: "Unlimited Venting & Hug Session",
      description: "100% judgment-free listening, extra warm hugs, and all the pampering.",
      code: "SARVAN-HUG-04",
      icon: "🤗",
      tag: "Care & Warmth"
    }
  ]
};
