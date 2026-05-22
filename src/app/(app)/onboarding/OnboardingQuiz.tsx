"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, BarChart3 } from "lucide-react";
import Link from "next/link";
import { saveProfile, type ProfileData } from "./actions";

// ── Questions ────────────────────────────────────────────────────────────────

type Answer = {
  label: string;
  value: string;
  score: number;
};

type Question = {
  id: keyof Omit<ProfileData, "risk_score" | "profile_type">;
  question: string;
  subtitle: string;
  answers: Answer[];
};

const questions: Question[] = [
  {
    id: "age_range",
    question: "What's your age range?",
    subtitle: "This helps us determine the right investment timeline for you.",
    answers: [
      { label: "Under 25", value: "under_25", score: 5 },
      { label: "25 – 34", value: "25_34", score: 4 },
      { label: "35 – 44", value: "35_44", score: 3 },
      { label: "45 – 54", value: "45_54", score: 2 },
      { label: "55+", value: "55_plus", score: 1 },
    ],
  },
  {
    id: "horizon",
    question: "When do you plan to use this money?",
    subtitle: "Your investment horizon affects how much risk you can take on.",
    answers: [
      { label: "Less than 1 year", value: "less_1_year", score: 1 },
      { label: "1 – 3 years", value: "1_3_years", score: 2 },
      { label: "3 – 5 years", value: "3_5_years", score: 3 },
      { label: "5 – 10 years", value: "5_10_years", score: 4 },
      { label: "10+ years", value: "10_plus_years", score: 5 },
    ],
  },
  {
    id: "monthly_amount",
    question: "How much can you invest monthly?",
    subtitle:
      "Any amount counts. We'll build a portfolio that fits your budget.",
    answers: [
      { label: "R0 – R500", value: "0_500", score: 1 },
      { label: "R500 – R2,000", value: "500_2000", score: 2 },
      { label: "R2,000 – R5,000", value: "2000_5000", score: 3 },
      { label: "R5,000 – R15,000", value: "5000_15000", score: 4 },
      { label: "R15,000+", value: "15000_plus", score: 5 },
    ],
  },
  {
    id: "risk_reaction",
    question: "If your investments dropped 20%, what would you do?",
    subtitle:
      "There are no wrong answers — this tells us about your risk comfort.",
    answers: [
      { label: "Sell everything immediately", value: "sell_all", score: 1 },
      { label: "Sell some to limit losses", value: "sell_some", score: 2 },
      { label: "Hold and wait for recovery", value: "hold", score: 3 },
      { label: "Buy more while it's cheap", value: "buy_more", score: 5 },
    ],
  },
  {
    id: "goal",
    question: "What's your main investment goal?",
    subtitle: "We'll tailor your portfolio to match what matters most to you.",
    answers: [
      { label: "Build an emergency fund", value: "emergency_fund", score: 1 },
      { label: "Save for a short-term goal", value: "short_term", score: 2 },
      {
        label: "Save for a major purchase",
        value: "major_purchase",
        score: 3,
      },
      { label: "Build long-term wealth", value: "long_term_wealth", score: 4 },
      { label: "Retire comfortably", value: "retirement", score: 5 },
    ],
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function classifyRisk(score: number): { type: string; color: string } {
  if (score <= 11) return { type: "Conservative", color: "text-green-600" };
  if (score <= 18) return { type: "Balanced", color: "text-amber-600" };
  return { type: "Aggressive", color: "text-red-600" };
}

// ── Animation variants ───────────────────────────────────────────────────────

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.3, ease: "easeOut" as const },
  }),
};

// ── Component ────────────────────────────────────────────────────────────────

export default function OnboardingQuiz() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [scores, setScores] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentQuestion = questions[step];
  const totalSteps = questions.length;
  const progress = ((step + 1) / totalSteps) * 100;
  const isLastStep = step === totalSteps - 1;
  const selectedAnswer = answers[currentQuestion?.id];

  const handleSelect = useCallback(
    (answer: Answer) => {
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer.value }));
      setScores((prev) => ({ ...prev, [currentQuestion.id]: answer.score }));
    },
    [currentQuestion.id]
  );

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    setError(null);

    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    const { type: profileType } = classifyRisk(totalScore);

    const data: ProfileData = {
      age_range: answers.age_range,
      horizon: answers.horizon,
      monthly_amount: answers.monthly_amount,
      risk_reaction: answers.risk_reaction,
      goal: answers.goal,
      risk_score: totalScore,
      profile_type: profileType,
    };

    try {
      await saveProfile(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again."
      );
      setSubmitting(false);
    }
  }, [answers, scores]);

  const goNext = useCallback(() => {
    if (!selectedAnswer) return;
    if (isLastStep) {
      void handleSubmit();
      return;
    }
    setDirection(1);
    setStep((s) => s + 1);
  }, [selectedAnswer, isLastStep, handleSubmit]);

  const goBack = useCallback(() => {
    if (step === 0) return;
    setDirection(-1);
    setStep((s) => s - 1);
  }, [step]);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl flex-col px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <Link href="/" className="inline-flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-navy" />
          <span className="text-lg font-semibold text-navy">InvestNow</span>
        </Link>
        <h1 className="mt-6 text-2xl font-bold text-navy sm:text-3xl">
          Tell us about yourself
        </h1>
        <p className="mt-2 text-sm text-navy/50">
          Answer 5 quick questions to get your personalized portfolio.
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-navy/50">
          <span>
            Question {step + 1} of {totalSteps}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-grey">
          <motion.div
            className="h-full rounded-full bg-navy"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>

        {/* Step dots */}
        <div className="mt-3 flex justify-center gap-2">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                i === step
                  ? "bg-navy"
                  : i < step
                    ? "bg-navy-light"
                    : "bg-grey"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          {error}
        </div>
      )}

      {/* Question card */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex-1"
        >
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-navy sm:text-2xl">
              {currentQuestion.question}
            </h2>
            <p className="mt-2 text-sm text-navy/50">
              {currentQuestion.subtitle}
            </p>
          </div>

          <div className="space-y-3">
            {currentQuestion.answers.map((answer, i) => {
              const isSelected = selectedAnswer === answer.value;
              return (
                <motion.button
                  key={answer.value}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  onClick={() => handleSelect(answer)}
                  className={`group flex w-full items-center rounded-xl border-2 px-5 py-4 text-left text-sm font-medium transition-all duration-200 sm:text-base ${
                    isSelected
                      ? "border-navy bg-navy text-white shadow-lg shadow-navy/20"
                      : "border-grey bg-white text-navy hover:border-navy-light hover:shadow-md hover:shadow-navy/5"
                  }`}
                >
                  <span className="flex-1">{answer.label}</span>
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                      isSelected
                        ? "border-white/50 bg-white/20"
                        : "border-grey group-hover:border-navy-light"
                    }`}
                  >
                    {isSelected && <Check className="h-3.5 w-3.5" />}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between gap-4">
        {step > 0 ? (
          <button
            onClick={goBack}
            className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-grey-soft"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={goNext}
          disabled={!selectedAnswer || submitting}
          className={`flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 ${
            !selectedAnswer || submitting
              ? "cursor-not-allowed bg-navy/40"
              : "bg-navy shadow-lg shadow-navy/30 hover:bg-navy-light hover:shadow-navy/40"
          }`}
        >
          {submitting ? (
            <>
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Saving...
            </>
          ) : isLastStep ? (
            <>
              Complete
              <Check className="h-4 w-4" />
            </>
          ) : (
            <>
              Next
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
