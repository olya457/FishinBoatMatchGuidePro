import React, {useCallback, useEffect, useState} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {Screen, useCompactLayout} from '../components/Screen';
import {Button} from '../components/UI';
import {boatImages} from '../assets';
import {quizQuestions} from '../data/catalog';
import {colors} from '../theme';
import type {QuizAnswer} from '../types';

type QuizMode = 'home' | 'playing' | 'result';

const questionSeconds = 15;

export function QuizScreen(): React.JSX.Element {
  const [mode, setMode] = useState<QuizMode>('home');
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(questionSeconds);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const compact = useCompactLayout();
  const question = quizQuestions[index];
  const score = answers.filter(answer => answer.isCorrect).length;
  const locked = selectedAnswer !== null;

  const startQuiz = () => {
    setIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setTimeLeft(questionSeconds);
    setMode('playing');
  };

  const chooseAnswer = useCallback(
    (answer: string) => {
      if (selectedAnswer !== null) {
        return;
      }

      const finalAnswer = answer || 'Time expired';

      setSelectedAnswer(finalAnswer);
      setAnswers(value => [
        ...value,
        {
          questionId: question.id,
          title: question.correctAnswer,
          chosenAnswer: finalAnswer,
          correctAnswer: question.correctAnswer,
          isCorrect: finalAnswer === question.correctAnswer,
        },
      ]);
    },
    [question.correctAnswer, question.id, selectedAnswer],
  );

  useEffect(() => {
    if (mode !== 'playing' || locked) {
      return;
    }

    if (timeLeft <= 0) {
      chooseAnswer('');
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(value => value - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [chooseAnswer, locked, mode, timeLeft]);

  const nextQuestion = () => {
    if (index === quizQuestions.length - 1) {
      setMode('result');
      return;
    }

    setIndex(value => value + 1);
    setSelectedAnswer(null);
    setTimeLeft(questionSeconds);
  };

  if (mode === 'playing') {
    return (
      <Screen>
        <View style={styles.quizTop}>
          <Text style={styles.questionCount}>
            Question {index + 1} of {quizQuestions.length}
          </Text>
          <Text style={[styles.timer, timeLeft <= 5 && styles.timerHot]}>
            ◷ {timeLeft}s
          </Text>
        </View>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressQuestion,
              {width: `${((index + 1) / quizQuestions.length) * 100}%`},
            ]}
          />
        </View>
        <View style={styles.timerTrack}>
          <View
            style={[
              styles.timerFill,
              {width: `${(timeLeft / questionSeconds) * 100}%`},
            ]}
          />
        </View>
        <Image
          source={question.image}
          style={[styles.quizImage, compact && styles.quizImageCompact]}
        />
        <Text style={[styles.quizQuestion, compact && styles.quizQuestionCompact]}>
          {question.question}
        </Text>
        <View style={styles.options}>
          {question.options.map(option => {
            const isChosen = selectedAnswer === option;
            const isCorrect = option === question.correctAnswer;
            const showCorrect = locked && isCorrect;
            const showWrong = locked && isChosen && !isCorrect;

            return (
              <Pressable
                key={option}
                disabled={locked}
                onPress={() => chooseAnswer(option)}
                style={[
                  styles.option,
                  compact && styles.optionCompact,
                  showCorrect && styles.optionCorrect,
                  showWrong && styles.optionWrong,
                  locked && !showCorrect && !showWrong && styles.optionDisabled,
                ]}>
                <Text
                  style={[
                    styles.optionText,
                    showCorrect && styles.optionTextCorrect,
                    showWrong && styles.optionTextWrong,
                  ]}>
                  {option}
                </Text>
                {showCorrect ? <Text style={styles.resultMark}>✓</Text> : null}
                {showWrong ? <Text style={styles.resultMark}>×</Text> : null}
              </Pressable>
            );
          })}
        </View>
        {locked ? (
          <Button
            label={
              index === quizQuestions.length - 1 ? 'See Results' : 'Next question'
            }
            icon="›"
            onPress={nextQuestion}
            style={styles.nextButton}
          />
        ) : null}
      </Screen>
    );
  }

  if (mode === 'result') {
    return (
      <Screen>
        <View style={[styles.resultHero, compact && styles.resultHeroCompact]}>
          <Text style={[styles.trophy, compact && styles.trophyCompact]}>🏆</Text>
          <Text style={styles.resultTitle}>
            {score >= 4 ? 'Great Catch' : 'Keep Learning'}
          </Text>
          <Text style={[styles.score, compact && styles.scoreCompact]}>
            {score}
            <Text style={styles.scoreTotal}>/{quizQuestions.length}</Text>
          </Text>
          <View style={styles.scoreTrack}>
            <View
              style={[
                styles.scoreFill,
                {width: `${(score / quizQuestions.length) * 100}%`},
              ]}
            />
          </View>
          <Text style={styles.percent}>
            {Math.round((score / quizQuestions.length) * 100)}% correct
          </Text>
        </View>
        <Text style={styles.reviewTitle}>Answer Review</Text>
        <View style={styles.reviewList}>
          {answers.map(answer => (
            <View
              key={answer.questionId}
              style={[
                styles.reviewCard,
                answer.isCorrect ? styles.reviewCorrect : styles.reviewWrong,
              ]}>
              <Text style={answer.isCorrect ? styles.reviewIconGood : styles.reviewIconBad}>
                {answer.isCorrect ? '✓' : '×'}
              </Text>
              <View style={styles.reviewCopy}>
                <Text style={styles.reviewAnswer}>{answer.correctAnswer}</Text>
                <Text
                  style={[
                    styles.reviewMeta,
                    answer.isCorrect ? styles.reviewMetaGood : styles.reviewMetaBad,
                  ]}>
                  {answer.isCorrect
                    ? 'Correct!'
                    : `You chose: ${answer.chosenAnswer}`}
                </Text>
              </View>
            </View>
          ))}
        </View>
        <Button label="Try Again" icon="↻" onPress={startQuiz} style={styles.resultButton} />
        <Button
          label="Return Home"
          icon="⌂"
          tone="ghost"
          onPress={() => setMode('home')}
          style={styles.returnButton}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={[styles.homeCenter, compact && styles.homeCenterCompact]}>
        <View style={[styles.quizIcon, compact && styles.quizIconCompact]}>
          <Text style={[styles.quizIconText, compact && styles.quizIconTextCompact]}>
            🏆
          </Text>
        </View>
        <Text style={[styles.homeTitle, compact && styles.homeTitleCompact]}>
          Boat ID Quiz
        </Text>
        <Text style={styles.homeSubtitle}>Test your boat recognition skills</Text>
      </View>
      <View style={styles.featureList}>
        <Feature icon="⛵" title="5 Questions" text="Identify boat types from real photos" />
        <Feature icon="◷" title="15 Seconds Each" text="Timed challenge — think fast!" />
        <Feature icon="🏆" title="4 Answer Choices" text="One correct answer per question" />
      </View>
      <View style={styles.tipCard}>
        <Image
          source={boatImages.bostonWhaler280Outrage}
          style={styles.tipImage}
          resizeMode="cover"
        />
        <View style={styles.tipCopy}>
          <Text style={styles.tipTitle}>Captain Rick’s Tip</Text>
          <Text style={styles.tipText}>
            “Read the expert articles in the Blog section first — they’ll give
            you a real edge in the quiz!”
          </Text>
        </View>
      </View>
      <Button label="Start Quiz" icon="›" onPress={startQuiz} style={styles.startButton} />
    </Screen>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}): React.JSX.Element {
  const compact = useCompactLayout();

  return (
    <View style={[styles.featureCard, compact && styles.featureCardCompact]}>
      <View style={[styles.featureIcon, compact && styles.featureIconCompact]}>
        <Text style={[styles.featureEmoji, compact && styles.featureEmojiCompact]}>
          {icon}
        </Text>
      </View>
      <View style={styles.featureCopy}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureText}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  homeCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 230,
  },
  homeCenterCompact: {
    minHeight: 170,
  },
  quizIcon: {
    width: 82,
    height: 82,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.orange,
    marginBottom: 18,
  },
  quizIconCompact: {
    width: 70,
    height: 70,
    borderRadius: 22,
    marginBottom: 14,
  },
  quizIconText: {
    fontSize: 40,
  },
  quizIconTextCompact: {
    fontSize: 34,
  },
  homeTitle: {
    color: colors.text,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '900',
    textAlign: 'center',
  },
  homeTitleCompact: {
    fontSize: 25,
    lineHeight: 30,
  },
  homeSubtitle: {
    color: '#75a4df',
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '700',
    marginTop: 6,
    textAlign: 'center',
  },
  featureList: {
    gap: 12,
  },
  featureCard: {
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 74,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
  },
  featureCardCompact: {
    minHeight: 64,
    padding: 12,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.surfaceStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureIconCompact: {
    width: 40,
    height: 40,
    borderRadius: 12,
  },
  featureEmoji: {
    fontSize: 23,
  },
  featureEmojiCompact: {
    fontSize: 20,
  },
  featureCopy: {
    flex: 1,
  },
  featureTitle: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '900',
  },
  featureText: {
    color: '#4f83ca',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
    marginTop: 2,
  },
  tipCard: {
    minHeight: 96,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#234d96',
    backgroundColor: '#0e2347',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 26,
    paddingRight: 14,
    overflow: 'hidden',
  },
  tipImage: {
    width: 98,
    height: 74,
    borderRadius: 14,
    marginLeft: 12,
    marginRight: 12,
    backgroundColor: colors.surfaceStrong,
  },
  tipCopy: {
    flex: 1,
  },
  tipTitle: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '900',
  },
  tipText: {
    color: colors.textSoft,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
    marginTop: 5,
  },
  startButton: {
    marginTop: 34,
  },
  quizTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  questionCount: {
    color: '#4f83ca',
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '800',
  },
  timer: {
    color: colors.teal,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '900',
  },
  timerHot: {
    color: colors.orange,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.surfaceStrong,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressQuestion: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  timerTrack: {
    height: 3,
    borderRadius: 2,
    backgroundColor: '#16294a',
    marginTop: 8,
    overflow: 'hidden',
  },
  timerFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: colors.teal,
  },
  quizImage: {
    width: '100%',
    height: 176,
    borderRadius: 16,
    backgroundColor: colors.surfaceStrong,
    marginTop: 24,
  },
  quizImageCompact: {
    height: 130,
    marginTop: 18,
  },
  quizQuestion: {
    color: colors.text,
    fontSize: 25,
    lineHeight: 31,
    fontWeight: '900',
    textAlign: 'center',
    marginVertical: 28,
  },
  quizQuestionCompact: {
    fontSize: 22,
    lineHeight: 27,
    marginVertical: 20,
  },
  options: {
    gap: 10,
  },
  option: {
    minHeight: 54,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionCompact: {
    minHeight: 48,
    borderRadius: 13,
  },
  optionCorrect: {
    borderColor: colors.success,
    backgroundColor: 'rgba(0, 213, 139, 0.14)',
  },
  optionWrong: {
    borderColor: colors.danger,
    backgroundColor: 'rgba(255, 79, 94, 0.14)',
  },
  optionDisabled: {
    opacity: 0.46,
  },
  optionText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  optionTextCorrect: {
    color: colors.success,
  },
  optionTextWrong: {
    color: '#ff6b78',
  },
  resultMark: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '900',
  },
  nextButton: {
    marginTop: 36,
  },
  resultHero: {
    borderRadius: 22,
    backgroundColor: '#14244a',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 24,
    marginTop: 8,
    marginBottom: 26,
  },
  resultHeroCompact: {
    paddingVertical: 22,
    marginBottom: 20,
  },
  trophy: {
    fontSize: 44,
    marginBottom: 10,
  },
  trophyCompact: {
    fontSize: 36,
    marginBottom: 8,
  },
  resultTitle: {
    color: colors.text,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '900',
  },
  score: {
    color: colors.orange,
    fontSize: 48,
    lineHeight: 58,
    fontWeight: '900',
    marginTop: 8,
  },
  scoreCompact: {
    fontSize: 40,
    lineHeight: 48,
  },
  scoreTotal: {
    color: '#5b88ce',
    fontSize: 24,
  },
  scoreTrack: {
    width: '88%',
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primaryDeep,
    overflow: 'hidden',
    marginTop: 8,
  },
  scoreFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: colors.orange,
  },
  percent: {
    color: '#5b88ce',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    marginTop: 8,
  },
  reviewTitle: {
    color: colors.text,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '900',
    marginBottom: 14,
  },
  reviewList: {
    gap: 10,
  },
  reviewCard: {
    borderRadius: 15,
    borderWidth: 1,
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: colors.surface,
  },
  reviewCorrect: {
    borderColor: 'rgba(0, 213, 139, 0.35)',
  },
  reviewWrong: {
    borderColor: 'rgba(255, 79, 94, 0.35)',
  },
  reviewIconGood: {
    color: colors.success,
    fontSize: 24,
    fontWeight: '900',
  },
  reviewIconBad: {
    color: colors.danger,
    fontSize: 24,
    fontWeight: '900',
  },
  reviewCopy: {
    flex: 1,
  },
  reviewAnswer: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '900',
  },
  reviewMeta: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
    marginTop: 3,
  },
  reviewMetaGood: {
    color: colors.success,
  },
  reviewMetaBad: {
    color: '#ff6b78',
  },
  resultButton: {
    marginTop: 20,
  },
  returnButton: {
    marginTop: 10,
  },
});
