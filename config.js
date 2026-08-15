/**
 * 💖 Anniversary Web App Configuration - Real Rose Experience
 */

const ANNIVERSARY_CONFIG = {
  // Relationship Start Date (March 15, 2026 represents 5 months from August 15, 2026)
  startDate: new Date(2026, 2, 15, 0, 0, 0),

  // Next Milestone Date: September 15th, 2026
  nextChapterDate: new Date(2026, 8, 15, 0, 0, 0),

  // Spotify Player Configuration (The Weeknd Playlist)
  spotifyPlaylistUrl: "https://open.spotify.com/embed/playlist/5gFyFkogxMCbcOOhsm54ME?utm_source=generator&theme=0",
  spotifyArtistName: "The Weeknd",
  spotifyTrackName: "The Weeknd Playlist",

  // Real Rose Assets
  realRoseImage: "./assets/real_rose.png",
  realPetalImage: "./assets/real_petal.png",

  // Names & Hero Titles
  partnerName: "My Favorite Person",
  heroTitle: "For My Favorite Person, <br><span>My Favorite Chapter.</span>",
  heroSubtitle: "Scroll down to watch our real rose bloom and reveal each falling petal chapter...",

  // Timeline Stories (Displayed ON the falling real petals!)
  timeline: [
    {
      monthNum: 1,
      title: "Month 1: The Spark & First Conversations",
      date: "March 15 - April 15",
      subtitle: "Butterflies, Late Night Chats & Coffee",
      image: "./assets/month1.png",
      story: "Everything felt so magical from the very first day. We started talking and couldn't stop. Every notification from you brought the biggest smile to my face, and long chats quickly became my favorite part of every single day."
    },
    {
      monthNum: 2,
      title: "Month 2: Stargazing & Inside Jokes",
      date: "April 15 - May 15",
      subtitle: "Finding My Favorite Person",
      image: "./assets/month2.png",
      story: "By month two, we had our inside jokes and secret code words. Staying up late just to talk under the night sky made me realize how rare and special you are. You became my safest space and my happiest thought."
    },
    {
      monthNum: 3,
      title: "Month 3: Playlists & Shared Moments",
      date: "May 15 - June 15",
      subtitle: "The Soundtrack to Our Days",
      image: "./assets/month3.png",
      story: "Sharing songs, recommending movies, and laughing until our stomachs hurt. Month three proved that no matter how busy or hard the days got, one call with you made everything peaceful and right again."
    },
    {
      monthNum: 4,
      title: "Month 4: Deep Conversations & Unconditional Care",
      date: "June 15 - July 15",
      subtitle: "Growing Closer Every Day",
      image: "./assets/month4.png",
      story: "We learned so much more about each other's dreams, fears, and little quirks. Being there for you through everything became second nature. I loved you more each day, knowing we can overcome anything together."
    },
    {
      monthNum: 5,
      title: "Month 5: Happy 5th Month Anniversary!",
      date: "July 15 - August 15",
      subtitle: "To Us & To Forever",
      image: "./assets/month5.png",
      story: "Five wonderful months together, and my heart still skips a beat whenever I see your name on my phone screen. Thank you for being my comfort, my joy, and my favorite person. Here's to many more chapters together!"
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
      backNote: "How caring, empathetic, and kind you are to everyone around you. You inspire me every day. 🌸"
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
      content: `Happy 5th Month Anniversary, my love!\n\nThese past 5 months have been the happiest months of my life. Thank you for your warmth, your smile, and for choosing to share your heart with me every single day.\n\nNo matter what obstacles come our way, I will always be right here holding your hand, listening to your stories, and making sure you feel loved and cherished.\n\nI love you more than words can express! 💕`
    },
    {
      id: "env-miss-me",
      title: "Open When You Miss Me",
      subtitle: "When distance feels a bit long 🥺",
      icon: "💌",
      content: `If you're reading this, know that I'm probably thinking of you right now too.\n\nClose your eyes for 5 seconds and take a deep breath. Imagine me wrapping my arms tightly around you and kissing your forehead.\n\nDistance is only temporary, but my love for you is constant and permanent. Text me right now: "I miss you!" and I'll call you as soon as I can! 💖`
    },
    {
      id: "env-smile",
      title: "Open When You Need a Smile",
      subtitle: "Instant mood booster 🌸",
      icon: "😊",
      content: `Remember: You are incredibly smart, beautiful, kind, and capable of amazing things!\n\nAlso remember that somewhere out there, there's a guy (me!) who falls in love with you all over again every single day.\n\nYour smile is my absolute favorite sight in the entire world, so please wear it proudly today! ✨`
    },
    {
      id: "env-sleep",
      title: "Open When You Can't Sleep",
      subtitle: "Sweet dreams & warm thoughts 🌙",
      icon: "💤",
      content: `Put your phone down, pull the blanket up cozy, and remember that you are safe and loved.\n\nLet go of all the thoughts of today. Sleep peacefully knowing that tomorrow morning, I'll be right here waiting to say good morning to you.\n\nGoodnight my sweet angel. Dreams of us! 🌌`
    }
  ],

  // Redeemable Love Coupons
  coupons: [
    {
      id: "c-coffee",
      title: "1 Free Coffee & Treat Date",
      description: "Redeemable for your favorite coffee/tea & snack whenever you want!",
      code: "LOVE-COFFEE-01",
      icon: "☕",
      tag: "Food & Drink"
    },
    {
      id: "c-call",
      title: "Late Night Call on Demand",
      description: "No matter how late or tired I am, I will stay up and talk to you.",
      code: "LOVE-CALL-02",
      icon: "📞",
      tag: "Quality Time"
    },
    {
      id: "c-movie",
      title: "Movie Night Choice Veto",
      description: "You get total control to pick any movie/show without any debate!",
      code: "LOVE-MOVIE-03",
      icon: "🍿",
      tag: "Entertainment"
    },
    {
      id: "c-comfort",
      title: "Unlimited Venting & Hug Session",
      description: "100% judgment-free listening, extra warm hugs, and all the pampering.",
      code: "LOVE-HUG-04",
      icon: "🤗",
      tag: "Care & Warmth"
    }
  ]
};
