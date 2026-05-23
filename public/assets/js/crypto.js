async function sha256Hex(text) {
  if (!window.crypto?.subtle) return String(text).split('').reduce((hash, ch) => ((hash << 5) - hash + ch.charCodeAt(0)) | 0, 0).toString(16);
  const bytes = new TextEncoder().encode(text);
  const digest = await window.crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function bytesToBase64(bytes) {
  let binary = '';
  new Uint8Array(bytes).forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}

function getLineupPrivacySecret(wallet) {
  const key = 'skillxi_privacy_secret_' + wallet;
  let secret = window.localStorage.getItem(key);
  if (!secret) {
    const bytes = new Uint8Array(32);
    window.crypto?.getRandomValues?.(bytes);
    secret = bytesToBase64(bytes);
    window.localStorage.setItem(key, secret);
  }
  return secret;
}

async function encryptLineupForStorage(wallet, lineupData) {
  const plaintext = JSON.stringify(lineupData || {});
  const lineupHash = await sha256Hex(plaintext);
  if (!window.crypto?.subtle) return { lineup_encrypted: null, lineup_hash: lineupHash };
  const salt = new TextEncoder().encode(wallet + ':skillxi-lineup-v1');
  const secret = getLineupPrivacySecret(wallet);
  const keyMaterial = await window.crypto.subtle.importKey('raw', new TextEncoder().encode(secret), 'PBKDF2', false, ['deriveKey']);
  const key = await window.crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
  const iv = new Uint8Array(12);
  window.crypto.getRandomValues(iv);
  const ciphertext = await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(plaintext));
  return {
    lineup_encrypted: JSON.stringify({ alg: 'AES-256-GCM', kdf: 'PBKDF2-SHA256', iv: bytesToBase64(iv), ciphertext: bytesToBase64(ciphertext) }),
    lineup_hash: lineupHash
  };
}

