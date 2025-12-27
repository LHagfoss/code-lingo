"use client";

import { useState, useEffect } from "react";
import { AppButton } from "@/components/ui/app-button";
import { saveQuizProgress } from "@/actions/user/progress";
import { useRouter } from "next/navigation";

type Option = {
    id: number;
    text: string;
    correct: boolean;
    image_src?: string | null;
};

type Exercise = {
    id: number;
    question: string;
    type: "SELECT" | "ASSIST" | "CODE_ARRANGE" | "INFO";
    challenge_options: Option[];
};

type QuizCoreProps = {
    lessonId: number;
    initialExercises: Exercise[];
};

export function QuizCore({ lessonId, initialExercises }: QuizCoreProps) {
    const router = useRouter();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // SELECT / ASSIST State
    const [selectedOptionId, setSelectedOptionId] = useState<number | null>(
        null,
    );

    // CODE_ARRANGE State
    // availableOptions: Options currently in the bank
    // solutionOptions: Options currently in the solution area
    const [availableOptions, setAvailableOptions] = useState<Option[]>([]);
    const [solutionOptions, setSolutionOptions] = useState<Option[]>([]);

    const currentExercise = initialExercises[currentIndex];
    const progressPercent = (currentIndex / initialExercises.length) * 100;

    // Reset state when exercise changes
    useEffect(() => {
        setSelectedOptionId(null);
        setStatus("idle");

        if (currentExercise.type === "CODE_ARRANGE") {
            // Shuffle options for the bank
            const shuffled = [...currentExercise.challenge_options].sort(
                () => Math.random() - 0.5,
            );
            setAvailableOptions(shuffled);
            setSolutionOptions([]);
        }
    }, [currentExercise]);

    const handleCheck = () => {
        if (currentExercise.type === "CODE_ARRANGE") {
            // Correct order is assumed to be by ID (creation order)
            const correctOrder = [...currentExercise.challenge_options].sort(
                (a, b) => a.id - b.id,
            );

            const isCorrect =
                solutionOptions.length === correctOrder.length &&
                solutionOptions.every(
                    (opt, index) => opt.id === correctOrder[index].id,
                );

            setStatus(isCorrect ? "correct" : "wrong");
        } else {
            // SELECT / ASSIST
            if (!selectedOptionId) return;

            const selectedOption = currentExercise.challenge_options.find(
                (opt) => opt.id === selectedOptionId,
            );

            if (selectedOption?.correct) {
                setStatus("correct");
            } else {
                setStatus("wrong");
            }
        }
    };

    const handleNext = async () => {
        if (currentIndex < initialExercises.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        } else {
            setIsSubmitting(true);
            await saveQuizProgress(lessonId);
            router.push("/learn");
        }
    };

    // CODE_ARRANGE Helpers
    const onOptionClick = (option: Option, from: "bank" | "solution") => {
        if (status !== "idle") return;

        if (from === "bank") {
            setAvailableOptions((prev) =>
                prev.filter((o) => o.id !== option.id),
            );
            setSolutionOptions((prev) => [...prev, option]);
        } else {
            setSolutionOptions((prev) =>
                prev.filter((o) => o.id !== option.id),
            );
            setAvailableOptions((prev) => [...prev, option]);
        }
    };

    // Renderers
    const renderSelect = () => (
        <div className="grid grid-cols-1 gap-4">
            {currentExercise.challenge_options.map((option) => {
                const isSelected = selectedOptionId === option.id;

                let borderClass = "border-slate-200 hover:bg-slate-50";
                if (isSelected) borderClass = "border-blue-500 bg-blue-50";
                if (status === "correct" && isSelected)
                    borderClass = "border-green-500 bg-green-50";
                if (status === "wrong" && isSelected)
                    borderClass = "border-red-500 bg-red-50";
                // Show correct answer if wrong
                if (status === "wrong" && option.correct)
                    borderClass = "border-green-500 bg-green-50";

                return (
                    <button
                        key={option.id}
                        onClick={() =>
                            status === "idle" && setSelectedOptionId(option.id)
                        }
                        disabled={status !== "idle"}
                        className={`p-4 border-2 border-b-4 rounded-xl text-left transition-all font-bold text-slate-700 ${borderClass}`}
                    >
                        {option.text}
                    </button>
                );
            })}
        </div>
    );

    const renderCodeArrange = () => (
        <div className="flex flex-col gap-8">
            {/* Solution Area */}
            <div className="min-h-[120px] bg-slate-100 rounded-xl p-4 border-2 border-slate-200 space-y-2">
                {solutionOptions.length === 0 && (
                    <p className="text-slate-400 text-center text-sm font-bold pt-8">
                        Tap blocks to arrange the code here
                    </p>
                )}
                {solutionOptions.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => onOptionClick(option, "solution")}
                        disabled={status !== "idle"}
                        className="block w-full text-left p-3 bg-white border-2 border-b-4 border-slate-200 rounded-lg font-mono text-sm md:text-base shadow-sm hover:border-slate-300 active:border-b-2 active:translate-y-[2px] transition-all"
                    >
                        {option.text}
                    </button>
                ))}
            </div>

            {/* Available Options (Bank) */}
            <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase">
                    Tap to move
                </p>
                {availableOptions.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => onOptionClick(option, "bank")}
                        disabled={status !== "idle"}
                        className="block w-full text-left p-3 bg-white border-2 border-b-4 border-slate-200 rounded-lg font-mono text-sm md:text-base shadow-sm hover:border-blue-300 hover:bg-blue-50 active:border-b-2 active:translate-y-[2px] transition-all"
                    >
                        {option.text}
                    </button>
                ))}
            </div>
        </div>
    );

    const canCheck = () => {
        if (currentExercise.type === "CODE_ARRANGE") {
            return (
                solutionOptions.length ===
                currentExercise.challenge_options.length
            );
        }
        return !!selectedOptionId;
    };

    return (
        <div className="flex flex-col h-full w-full max-w-2xl mx-auto p-4">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden">
                    <div
                        className="bg-green-500 h-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
                <span className="text-red-500 font-bold">❤️ 5</span>
            </div>

            <div className="flex-1 flex flex-col justify-center">
                <h2 className="text-2xl font-bold text-center mb-8 text-slate-700">
                    {currentExercise.question}
                </h2>

                {currentExercise.type === "CODE_ARRANGE"
                    ? renderCodeArrange()
                    : renderSelect()}
            </div>

            <div
                className={`mt-8 py-4 border-t-2 ${
                    status === "correct"
                        ? "bg-green-100 border-green-200 -mx-4 px-4"
                        : status === "wrong"
                          ? "bg-red-100 border-red-200 -mx-4 px-4"
                          : "border-transparent"
                }`}
            >
                <div className="flex justify-between items-center max-w-2xl mx-auto w-full">
                    <div className="font-bold flex-1 pr-4">
                        {status === "correct" && (
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">🎉</span>
                                <span className="text-green-700">
                                    Nicely done!
                                </span>
                            </div>
                        )}
                        {status === "wrong" && (
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-2xl">❌</span>
                                    <span className="text-red-700">
                                        Incorrect
                                    </span>
                                </div>
                                {currentExercise.type === "CODE_ARRANGE" && (
                                    <span className="text-red-600 text-sm">
                                        The order was incorrect. Try again!
                                    </span>
                                )}
                                {currentExercise.type !== "CODE_ARRANGE" && (
                                    <span className="text-red-600 text-sm">
                                        Correct answer:{" "}
                                        {
                                            currentExercise.challenge_options.find(
                                                (o) => o.correct,
                                            )?.text
                                        }
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="w-32">
                        {status === "idle" ? (
                            <AppButton
                                fullWidth
                                disabled={!canCheck()}
                                onClick={handleCheck}
                                variant="primary"
                            >
                                Check
                            </AppButton>
                        ) : (
                            <AppButton
                                fullWidth
                                variant={
                                    status === "wrong" ? "danger" : "secondary"
                                }
                                onClick={handleNext}
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? "Saving..."
                                    : currentIndex ===
                                        initialExercises.length - 1
                                      ? "Finish"
                                      : "Next"}
                            </AppButton>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
