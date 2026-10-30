# Love Wrapped 🎧💚

**Your 2026 Love Wrapped is ready.** A Spotify-Wrapped-style love story website you send to your person: story slides with big animated stats, "Top Artist: YOU", your top 5 memories, a "Now Playing: Our Song" music player, and a shareable Wrapped card at the end.

Built with only **HTML, CSS, JavaScript and canvas**. No libraries, no frameworks, no images, no audio files: every vinyl, chart, polaroid, confetti piece and the music itself is drawn and played in code.

🔗 **Live demo:** https://lovewrapped-hackncode.sites.tab.bot/

💌 **Make it for your person:** `https://lovewrapped-hackncode.sites.tab.bot/?name=baby`

▶️ **Auto-play demo:** `https://lovewrapped-hackncode.sites.tab.bot/?demo=1&name=baby`

---

## ✨ Features

- 🎧 **Intro:** "Your 2026 Love Wrapped is ready, *name* 💚" with an equalizer and a big **Tap to start** button
- 📱 **Instagram-story-style slides:** tap right for next, tap left for back, hold to pause, with a progress bar on top
  1. 🧠 **"You lived in my head 525,600 minutes this year"** with a counter that rolls up
  2. 💿 **"Top Artist: YOU"** with a spinning vinyl and a heart label
  3. 🎶 **Top 5 songs:** an animated list of memories ("Our first call – 3:12 AM", "That one smile", "Late night chai"…)
  4. 💗 **Top genre: Pure Love** with an animated genre mix (Butterflies, Inside jokes, Forehead kisses, Chai dates)
  5. ♾️ **Listening personality: The Forever Kind**, a card that flips in
  6. 📊 **"Times I thought of you" by month**, an animated bar chart where December goes to ∞
  7. 📸 **Most replayed moment: the day we met**, with a polaroid that drops in
- 🎵 **Now Playing: Our Song:** a spinning vinyl with a tonearm, an animated waveform, karaoke lyrics that highlight line by line, and play / pause / next / like buttons. Tap ❤️ for a heart burst
- 🎉 **Finale:** a big shareable **Wrapped card** with every stat and the pet name, confetti, then **"Same time next year? Forever. 💚"**
- ⬇️ **Download the Wrapped card as a PNG** (drawn on canvas, 1080×1350)
- 💬 **WhatsApp share** with a personalised `?name=` link
- ✨ **Make your own Wrapped:** type their pet name + your top memory and get your own link
- 🔊 Music on/off: a soft lofi love track synthesized live with the WebAudio API, plus tap and whoosh sounds
- 🔁 Replay
- 📐 **Big, phone-first design:** everything fills the screen, large text and large buttons (tested at 390×844 and 360×640)

## 🛠️ Customise

| Parameter | What it does | Example |
|---|---|---|
| `name` | The pet name everywhere (default "my love") | `?name=Jaan` |
| `memory` | Your #1 memory: the top song and the one on the card | `&memory=Our first trip` |
| `demo=1` | Plays the whole Wrapped automatically | `?demo=1&name=baby` |

## 📁 Files

- `index.html`: the screens (intro, story slides, player, finale, Make-your-own form)
- `style.css`: the dark music-app look, neon gradients and animations
- `app.js`: the story engine, canvas vinyl / waveform / polaroid / confetti, the WebAudio synth, the PNG card and share links

## 🚀 Run it

Open `index.html` in a browser, or host the folder anywhere (GitHub Pages works).

---

Day 5 of 100 💻❤️ · Made by **[@hack.n.code](https://instagram.com/hack.n.code)**
