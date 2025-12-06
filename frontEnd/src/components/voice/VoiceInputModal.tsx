
import { useState, useCallback, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { formatForInput, parseInputDate } from "@/lib/dateUtils";
import { CreateTaskInput, Priority, Status } from "@/types/task";
import { cn } from "@/lib/utils";
import { Mic, MicOff, AlertCircle } from "lucide-react";
import { TaskFormModal } from "../task/TaskFormModal";
import { Button } from "../ui/button";
import {
parseVoice
} from "@/services/taskApi";
interface VoiceInputModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTask: (input: CreateTaskInput) => void;
}

const priorities: Priority[] = ["High", "Medium", "Low", "None"];
const statuses: Status[] = ["To Do", "In Progress", "Done"];

export function VoiceInputModal({ open, onOpenChange, onCreateTask }: VoiceInputModalProps) {
  const [stage, setStage] = useState<"recording" | "preview">("recording");
  const [confidence, setConfidence] = useState(0);
  const [isParsing, setIsParsing] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("None");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<Status>("To Do");
  const [parsedObj,setParsedObj]=useState({})

  const {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    error: speechError,
  } = useSpeechRecognition({ continuous: true, interimResults: true, silenceTimeout: 3000 });

  const handleParse = useCallback(async (textToParse: string) => {
    if (!textToParse.trim()) return;

    setIsParsing(true);
    try {
      const response:any= await parseVoice({ transcript: textToParse })
      if (response.parsed) {
        const parsed = response.parsed;
        // console.log(parsed,"prased checking")

        setTitle(parsed.title || "");
        setDescription(parsed.description || "");
        setPriority(parsed.priority || "None");
        setStatus(parsed.status || "To Do");
        setDueDate(parsed.dueDate ? formatForInput(parsed.dueDate) : "");
     setParsedObj({
          title:parsed.title,
          description:parsed.description ,
          priority:parsed.priority ,
          status:parsed.status ,
          dueDate:parsed.dueDate
        })

        const filledFields = [
          parsed.title,
          parsed.description,
          parsed.priority !== "None",
          parsed.dueDate,
        ].filter(Boolean).length;

        setConfidence(filledFields / 4);

        // 🌟 Auto-switch to preview after parsing
        setStage("preview");
      }
      else{
        alert(1)
      }
    } catch (err) {
      alert("Failed to parse transcript. Try again.");
    } finally {
      setIsParsing(false);
    }
  }, []);

  // reset state when reopened
  useEffect(() => {
    if (open) {
      setStage("recording");
      setConfidence(0);
      setTitle("");
      setDescription("");
      setPriority("None");
      setDueDate("");
      setStatus("To Do");
      resetTranscript();
    } else {
      if (isListening) stopListening();
    }
  }, [open]);

  // automatic stop → parse
  const handleToggleRecording = () => {
    if (isListening) {
      stopListening();
      const finalText = transcript.trim();
      if (finalText) handleParse(finalText);
    } else {
      resetTranscript();
      startListening();
    }
  };

  const handleManualParse = () => {
    const textToParse = transcript.trim();
    if (textToParse) handleParse(textToParse);
  };

  const handleSubmit = () => {
    if (!title.trim()) return;

    onCreateTask({
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: parseInputDate(dueDate),
      status,
    });

    onOpenChange(false);
  };

  const displayText = transcript + (interimTranscript ? " " + interimTranscript : "");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-primary" />
            Voice Task Creation
          </DialogTitle>
          <DialogDescription>
            {stage === "recording" ? "Speak your task" : "Review & edit parsed task"}
          </DialogDescription>
        </DialogHeader>

        {stage === "recording" ? (
          /* -----------------------------------------------------------
             RECORDING VIEW 
          ----------------------------------------------------------- */
          <div className="space-y-4 py-4">
            {!isSupported && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                Speech recognition not supported.
              </div>
            )}

            {speechError && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {speechError}
              </div>
            )}

            {/* MIC BUTTON */}
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={handleToggleRecording}
                disabled={!isSupported}
                className={cn(
                  "relative h-24 w-24 rounded-full transition-all flex items-center justify-center",
                  isListening
                    ? "bg-destructive text-white shadow-lg"
                    : "bg-primary text-white hover:scale-105",
                  !isSupported && "opacity-50 cursor-not-allowed"
                )}
              >
                {isListening ? (
                  <>
                    <MicOff className="h-10 w-10" />
                    <span className="absolute inset-0 rounded-full bg-destructive/50 animate-ping" />
                  </>
                ) : (
                  <Mic className="h-10 w-10" />
                )}
              </button>

              <p className="text-sm text-muted-foreground">
                {isListening ? "Listening... click to stop" : "Click to start recording"}
              </p>
            </div>

            {/* LIVE TRANSCRIPT */}
            <div className="space-y-2">
              <Label>Live Transcript</Label>
              <div className="min-h-[100px] rounded-lg border bg-muted/50 p-3">
                {displayText ? (
                  <p className="text-sm">
                    <span>{transcript}</span>
                    {interimTranscript && <span className="text-muted-foreground"> {interimTranscript}</span>}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Your speech will appear here...
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (



              <TaskFormModal 
                  open={open}
                  onOpenChange={onOpenChange}
                  onSubmit={onCreateTask}
                  mode="create"
                  initialValues={parsedObj}
                />
        )}

        <DialogFooter className="gap-2">
          {stage === "recording" ? (
            <>
              <Button   type="button"
              variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button onClick={handleManualParse} disabled={!transcript.trim() || isParsing || isListening}>
                {isParsing ? "Parsing..." : "Parse Task"}
              </Button>
            </>
          ) : (
            <>
            {/*not requered used create task buttons */}
              {/* <button onClick={() => setStage("recording")}>Back</button>
              <button onClick={handleSubmit} disabled={!title.trim()}>
                Create Task
              </button> */}
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
