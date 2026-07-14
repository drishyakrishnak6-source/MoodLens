// crisisDetection.js
// -----------------------------------------------------------------------------
// Runs before normal emotion analysis. If the text matches crisis-level
// language, the app must NOT try to tag it as a "mood" with an emoji and
// generic self-care tips -- it should hand the person real resources instead.
// -----------------------------------------------------------------------------

const CRISIS_PATTERNS = {
  en: ["want to die", "wanna die", "wanted to die", "kill myself", "killing myself", "end my life", "ending my life", "end it all", "suicidal", "suicide", "no reason to live", "better off dead", "don't want to be alive", "dont want to be alive", "don't want to live", "dont want to live", "can't go on", "cant go on", "take my own life", "hurt myself", "harm myself", "self harm", "self-harm", "cutting myself", "not worth living", "world without me"],
  es: ["quiero morir", "quiero morirme", "matarme", "suicidio", "suicidarme", "acabar con mi vida", "no quiero vivir", "ya no quiero vivir"],
  fr: ["je veux mourir", "me suicider", "suicide", "je ne veux plus vivre", "en finir avec ma vie"],
  hi: ["मरना चाहता", "मरना चाहती", "आत्महत्या", "जीना नहीं चाहता", "जीना नहीं चाहती", "खुद को नुकसान"],
  ml: ["മരിക്കണം", "മരിക്കാൻ ആഗ്രഹി", "ആത്മഹത്യ", "ജീവിക്കാൻ തോന്നുന്നില്ല"],
};

export function detectCrisis(text, lang = "en") {
  const lower = " " + (text || "").toLowerCase() + " ";
  const patterns = (CRISIS_PATTERNS[lang] || []).concat(CRISIS_PATTERNS.en);
  return patterns.some((p) => lower.includes(p.toLowerCase()));
}

// Separate from self-harm detection above: this flags language about hurting
// OTHER people. It doesn't override the mood card (the person asked for this
// to still show as "Angry"), but it upgrades the advice given alongside it
// from generic anger tips to something more serious.
const VIOLENCE_PATTERNS = [
  "kill someone", "kill him", "kill her", "kill them", "want to kill", "going to kill",
  "hurt someone", "want to hurt", "beat someone up", "going to hurt",
];

export function detectViolentIdeation(text) {
  const lower = " " + (text || "").toLowerCase() + " ";
  return VIOLENCE_PATTERNS.some((p) => lower.includes(p));
}

export const VIOLENCE_NOTE = {
  summary: "There's real anger in what you wrote, and it's pointed at hurting someone else. That's serious -- please talk to someone before acting on it.",
  selfCare: [
    "Step away from the situation right now, physically if you can",
    "Call a crisis line or talk to someone you trust before doing anything",
    "If you're worried you might act on this, contact local emergency services",
  ],
};

export const CRISIS_RESOURCES = [
  { label: "🇮🇳 KIRAN Mental Health Helpline (24/7)", value: "1800-599-0019", tel: "18005990019" },
  { label: "🇮🇳 Vandrevala Foundation (24/7)", value: "1860-2662-345", tel: "18602662345" },
  { label: "🌍 International / US", value: "988", tel: "988" },
];