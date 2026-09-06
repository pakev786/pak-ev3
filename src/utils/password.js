// Password suggestions must come from a cryptographic RNG. Math.random() is a
// fast, seeded PRNG whose output is predictable from a few observed values, so
// passwords built from it are guessable.
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const SPECIAL = "!@#$%^&*()";
const ALL = LOWER + UPPER + DIGITS + SPECIAL;

const randomInt = (max) => {
  const buffer = new Uint32Array(1);
  const limit = Math.floor(0xffffffff / max) * max;
  let value;
  do {
    window.crypto.getRandomValues(buffer);
    value = buffer[0];
  } while (value >= limit); // reject the biased tail
  return value % max;
};

const pick = (alphabet) => alphabet.charAt(randomInt(alphabet.length));

/** Generates a 14 character password containing every required character class. */
export const generateStrongPassword = (length = 14) => {
  const required = [pick(LOWER), pick(UPPER), pick(DIGITS), pick(SPECIAL)];
  const rest = Array.from({ length: Math.max(0, length - required.length) }, () => pick(ALL));
  const chars = [...required, ...rest];

  // Fisher-Yates shuffle with the same CSPRNG.
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.join("");
};

export default generateStrongPassword;
