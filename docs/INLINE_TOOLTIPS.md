INLINE_TOOLBelow are **inline warning tooltips** you can trigger when users type risky phrases. Each tooltip is short, neutral, and offers a **one-tap safer rewrite**. (I’m giving you copy you can drop straight into the UI.)

---

## 1) Diagnoses & mental health labels

**Trigger words:** narcissist, sociopath, bipolar, borderline, psychopath, mentally ill, personality disorder, NPD, BPD

**Tooltip (inline):**
**Avoid diagnoses.** Describe what they did instead.

**One-tap rewrite options:**

* “What happened was…”
* “The behavior I observed was…”
* “It made me feel unsafe when…”

---

## 2) Criminal/violent allegations

**Trigger words:** abusive, rapist, assaulted, predator, grooming, stalker, trafficker, violent, threatening, domestic violence

**Tooltip (inline):**
**Serious allegation.** Please stick to specific actions you personally experienced.

**One-tap rewrite options:**

* “I felt unsafe because…”
* “They did/said ___, so I ended contact.”
* “I’m sharing what happened on [date]…”

---

## 3) Defamatory character attacks / slurs

**Trigger words:** creep, monster, psycho, loser, pathetic, disgusting, trash, evil, scum, freak, incel (as insult)

**Tooltip (inline):**
**Stick to facts.** Insults get removed—actions help others.

**One-tap rewrite options:**

* “The specific issue was…”
* “On our [#] date, they…”
* “A boundary was crossed when…”

---

## 4) Motive/intent mind-reading

**Trigger phrases:** he’s trying to…, he wants to…, he only dates to…, he targets women, he uses women, he manipulates everyone, he’s love bombing, he’s gaslighting (unless described)

**Tooltip (inline):**
**Avoid guessing intent.** Share what you saw or heard.

**One-tap rewrite options:**

* “What I noticed was…”
* “They said ___.”
* “They did ___ after I ___.”

---

## 5) “Everyone knows” / rumor amplification

**Trigger phrases:** everyone knows, I heard, apparently, rumor, people say, my friend said, I was told, supposedly

**Tooltip (inline):**
**No hearsay.** Only post what you directly experienced.

**One-tap rewrite options:**

* “In my own experience…”
* “I can only speak to what happened to me…”
* “I don’t have firsthand info on that.”

---

## 6) Absolute claims & pattern certainty

**Trigger words/phrases:** always, never, every time, all women, he does this to everyone, guaranteed, 100%

**Tooltip (inline):**
**Avoid absolutes.** Keep it time-bound and specific.

**One-tap rewrite options:**

* “In my experience on [date]…”
* “During our [#] interactions…”
* “From what I saw…”

---

## 7) Doxxing / identifying info

**Trigger patterns:** phone numbers, addresses, emails, workplace names, last names + employer, license plate, social handles, full name + city, school

**Tooltip (inline):**
**Personal info isn’t allowed.** Remove identifying details (address, phone, workplace, etc.).

**One-tap rewrite options:**

* “(removed personal details)”
* “We met on [app] in [general area].”
* “I’m not sharing identifying info.”

---

## 8) Calls to action / harassment

**Trigger phrases:** report him, get him fired, message his job, tell his wife, blast him, expose him, ruin him, go comment, spam him, let’s find him

**Tooltip (inline):**
**No harassment.** Don’t encourage others to contact or punish anyone.

**One-tap rewrite options:**

* “I’m sharing for awareness only.”
* “I chose to stop seeing him after…”
* “Use your judgment and stay safe.”

---

## 9) Threats / intimidation

**Trigger phrases:** I’ll ruin him, he’ll pay, I hope he…, kill, hurt, dox, destroy, make sure everyone knows

**Tooltip (inline):**
**Not allowed.** Threats or revenge language will be removed.

**One-tap rewrite options:**

* “I’m posting to share my experience.”
* “I’m not comfortable continuing contact.”
* “This is what happened to me.”

---

## 10) Cheating/relationship status accusations (high-risk)

**Trigger words/phrases:** cheating, married, has a wife, girlfriend, fiancé, affair, pregnant partner, baby mama (as accusation)

**Tooltip (inline):**
**Be careful with relationship claims.** Share only what you personally confirmed.

**One-tap rewrite options:**

* “He told me he was single, but I later saw evidence he wasn’t.”
* “I’m unsure of his status—sharing what I observed.”
* “I ended contact after learning conflicting info.”

---

# Bonus: “Safer phrasing” micro-suggestions (tiny chips)

These can appear as optional suggestion chips above the keyboard whenever risky language is detected:

* “Add a date”
* “Use ‘I experienced…’”
* “Describe actions”
* “Remove labels”
* “Avoid personal info”
* “Keep it time-bound”

---

## Implementation note (practical)

If you’re building the rules engine, structure each tooltip object like:

* **id**
* **triggers** (keywords + regex)
* **message**
* **rewrite_chips** (3–5)
* **severity** (warn vs block)
* **block_conditions** (doxxing/threats)