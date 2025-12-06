import { useState, useCallback, useRef, useEffect } from "react";

interface UseSpeechRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
  silenceTimeout?: number;
}

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  interimTranscript: string;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  error: string | null;
}

export function useSpeechRecognition({
  continuous = false,
  interimResults = true,
  lang = "en-US",
  silenceTimeout = 5000,
}: UseSpeechRecognitionOptions = {}): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
  }, []);

  const resetSilenceTimer = useCallback(() => {
    clearSilenceTimer();
    if (silenceTimeout > 0 && isListening) {
      silenceTimerRef.current = setTimeout(() => {
        stopListening();
      }, silenceTimeout);
    }
  }, [clearSilenceTimer, silenceTimeout, isListening]);

  const stopListening = useCallback(() => {
    clearSilenceTimer();
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsListening(false);
  }, [clearSilenceTimer]);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError("Speech recognition not supported in this browser");
      return;
    }

    setError(null);
    setTranscript("");
    setInterimTranscript("");

    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) return;

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = lang;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = "";
      let interim = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) finalTranscript += result[0].transcript;
        else interim += result[0].transcript;
      }

      setTranscript((prev) => (finalTranscript ? prev + finalTranscript : prev));
      setInterimTranscript(interim);

      resetSilenceTimer();
    };

    recognition.onerror = (event: any) => {
      setError(event.error || "Speech recognition error");
      stopListening();
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;

    try {
      recognition.start();
      setIsListening(true);
    } catch (err: any) {
      setError(err.message || "Failed to start speech recognition");
    }
  }, [continuous, interimResults, isSupported, lang, resetSilenceTimer, stopListening]);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    error,
  };
}
