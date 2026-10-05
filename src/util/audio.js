export const INTERVIEW_VOICES = [
  {
    id: "vinay",
    label: "Vinay",
    gender: "male",
    pitch: 0.8,
    rate: 0.94,
    variant: 0,
  },
  {
    id: "kashi",
    label: "Kashi",
    gender: "male",
    pitch: 0.72,
    rate: 0.9,
    variant: 1,
  },
  {
    id: "bhavana",
    label: "Bhavana",
    gender: "female",
    pitch: 1.18,
    rate: 0.94,
    variant: 0,
  },
  {
    id: "satwika",
    label: "Satwika",
    gender: "female",
    pitch: 1.26,
    rate: 0.9,
    variant: 1,
  },
];

const getAmericanEnglishVoice = (voices, gender, variant) => {
  const englishVoices = voices.filter((voice) => {
    const lang = (voice.lang || "").replace("_", "-").toLowerCase();
    return lang === "en-us" || lang === "en-gb" || lang === "en-au";
  });

  const genderHints = {
    female: /\b(female|woman|samantha|susan|zira|aria|jenny|victoria|aria|samantha|zoe|susan|kimberly|ava|cora|emma|jenny)\b/i,
    male: /\b(male|man|daniel|david|mark|john|alex|james|darren|michael|liam|ryan|russell|thomas|eric)\b/i,
  };

  const genderMatched = englishVoices.filter((voice) =>
    genderHints[gender].test(voice.name)
  );
  const unknownGender = englishVoices.filter((voice) =>
    !genderHints.female.test(voice.name) && !genderHints.male.test(voice.name)
  );
  const candidates = genderMatched.length ? genderMatched : unknownGender.length ? unknownGender : englishVoices;

  return candidates.length ? candidates[variant % candidates.length] : null;
};

const resolveSpeechVoices = (onReady) => {
  const synth = window.speechSynthesis;
  const voices = synth.getVoices();

  if (voices.length) {
    onReady(voices);
    return;
  }

  const handleVoicesChanged = () => {
    const readyVoices = synth.getVoices();
    if (!readyVoices.length) {
      return;
    }

    synth.removeEventListener("voiceschanged", handleVoicesChanged);
    onReady(readyVoices);
  };

  synth.addEventListener("voiceschanged", handleVoicesChanged, { once: true });
};

export const playAudio = (text, onEnd, voiceId = "vinay") => {
  if (!window.speechSynthesis) {
    console.error("Speech Synthesis is not supported in this browser");
    onEnd?.();
    return;
  }

  const selectedVoice =
    INTERVIEW_VOICES.find((voice) => voice.id === voiceId) || INTERVIEW_VOICES[0];

  resolveSpeechVoices((voices) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const preferredVoice = getAmericanEnglishVoice(voices, selectedVoice.gender, selectedVoice.variant);

    utterance.lang = preferredVoice?.lang || "en-US";
    utterance.voice = preferredVoice;
    utterance.rate = selectedVoice.rate;
    utterance.volume = 1;
    utterance.pitch = selectedVoice.pitch;
    utterance.onend = () => {
      onEnd?.();
    };

    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
    }

    window.speechSynthesis.speak(utterance);
  });
};

export const stopAudio = () => {
  window.speechSynthesis?.cancel();
};
