/**
 * Text-to-Speech utility for native pronunciations, cultural guides, and audio assistance
 */
export function playPronunciation(text: string, langHint?: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser.');
      resolve(false);
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any pending utterances
      const utterance = new SpeechSynthesisUtterance(text);

      // Attempt to pick an appropriate accent or voice
      const voices = window.speechSynthesis.getVoices();
      if (langHint === 'si' || langHint === 'ta' || langHint?.toLowerCase().includes('sinhala') || langHint?.toLowerCase().includes('tamil')) {
        const regionalVoice = voices.find(
          (v) => v.lang.startsWith('si') || v.lang.startsWith('ta') || v.lang.includes('IN') || v.lang.includes('LK')
        );
        if (regionalVoice) {
          utterance.voice = regionalVoice;
        }
      }

      utterance.rate = 0.9; // Slightly slower for clear traveler pronunciation
      utterance.pitch = 1.0;

      utterance.onend = () => resolve(true);
      utterance.onerror = () => resolve(false);

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Speech synthesis error:', err);
      resolve(false);
    }
  });
}

export function stopPronunciation() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
