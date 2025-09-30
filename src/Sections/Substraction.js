// import { View, Text } from 'react-native'
// import React from 'react'

// const Substraction = () => {
//   return (
//     <View>
//       <Text>Substraction</Text>
//     </View>
//   )
// }

// export default Substraction

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeIn,
  FadeInDown,
} from 'react-native-reanimated';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import HapticFeedback from 'react-native-haptic-feedback';
import Sound from 'react-native-sound';

// --- CONSTANTS ---
const TOTAL_QUESTIONS = 100;
const OPTIONS_COUNT = 4;
const FEEDBACK_DELAY = 500; // 0.5 second delay for feedback

// --- SOUND SETUP ---
// Enable playback in silence mode
Sound.setCategory('Playback');

const loadSound = (soundName) => {
  return new Sound(soundName, Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log(`Failed to load the sound ${soundName}`, error);
      return;
    }
  });
};

// --- HELPER FUNCTIONS ---
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// --- MAIN COMPONENT ---
const Subtraction = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);

  // For sound effects
  const correctSound = useRef(loadSound('correct.mp3')).current;
  const incorrectSound = useRef(loadSound('incorrect.mp3')).current;

  // For animations
  const progress = useSharedValue(0);
  const questionKey = useSharedValue(0); // Used to re-trigger animation

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value}%`,
    };
  });

  // --- GAME LOGIC ---
  useEffect(() => {
    generateQuestions();
  }, []);

  const generateQuestions = () => {
    let newQuestions = [];
    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
      // Generate two numbers and ensure num1 is always greater or equal to num2
      // to avoid negative answers.
      const a = Math.floor(Math.random() * (10 + i * 2)) + 1;
      const b = Math.floor(Math.random() * (10 + i * 2)) + 1;
      const num1 = Math.max(a, b);
      const num2 = Math.min(a, b);
      
      const correctAnswer = num1 - num2;

      let options = new Set([correctAnswer]);
      while (options.size < OPTIONS_COUNT) {
        const randomOffset = Math.floor(Math.random() * 10) - 5;
        const wrongAnswer = correctAnswer + randomOffset;
        // Ensure wrong answers are unique and non-negative
        if (wrongAnswer !== correctAnswer && wrongAnswer >= 0) {
          options.add(wrongAnswer);
        }
      }
      newQuestions.push({
        question: `${num1} - ${num2}`,
        answer: correctAnswer,
        options: shuffleArray(Array.from(options)),
      });
    }
    setQuestions(newQuestions);
  };

  const handleAnswerPress = (answer) => {
    if (selectedAnswer !== null) return; // Prevent multiple taps

    setSelectedAnswer(answer);
    const correct = answer === questions[currentQuestionIndex].answer;
    
    HapticFeedback.trigger(correct ? 'impactMedium' : 'notificationError');

    if (correct) {
      setIsCorrect(true);
      setScore((prev) => prev + 1);
      progress.value = withTiming(((score + 1) / TOTAL_QUESTIONS) * 100);
      correctSound?.play();
    } else {
      setIsCorrect(false);
      incorrectSound?.play();
    }

    setTimeout(() => {
      const nextQuestionIndex = currentQuestionIndex + 1;
      if (nextQuestionIndex < TOTAL_QUESTIONS) {
        setCurrentQuestionIndex(nextQuestionIndex);
        questionKey.value += 1; // Trigger re-animation
      } else {
        setIsGameOver(true);
      }
      // Reset for next question
      setSelectedAnswer(null);
      setIsCorrect(null);
    }, FEEDBACK_DELAY);
  };

  const restartGame = () => {
    generateQuestions();
    setScore(0);
    setCurrentQuestionIndex(0);
    setIsGameOver(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    progress.value = withTiming(0);
    questionKey.value += 1;
  };
  
  // --- UI COMPONENTS ---
  const renderHeader = () => (
    <View style={styles.header}>
      <Pressable onPress={() => navigation.goBack()}>
        <Icon name="close" size={wp('8%')} color="#FFF" />
      </Pressable>
      <View style={styles.scoreContainer}>
        <Icon name="star-circle" size={wp('6%')} color="#FFD700" />
        <Text style={styles.scoreText}>{score}</Text>
      </View>
    </View>
  );

  const renderProgressBar = () => (
    <View>
      <Text style={styles.progressText}>
        Question {currentQuestionIndex + 1}/{TOTAL_QUESTIONS}
      </Text>
      <View style={styles.progressBarBackground}>
        <Animated.View style={[styles.progressBar, progressStyle]} />
      </View>
    </View>
  );

  const renderQuestion = () => (
    <Animated.View key={questionKey.value} entering={FadeInDown.duration(500)} style={styles.questionContainer}>
      <Text style={styles.questionText}>
        {questions[currentQuestionIndex]?.question} = ?
      </Text>
    </Animated.View>
  );

  const renderOptions = () => (
    <View style={styles.optionsGrid}>
      {questions[currentQuestionIndex]?.options.map((option, index) => {
        const isSelected = selectedAnswer === option;
        const isTheCorrectAnswer = option === questions[currentQuestionIndex].answer;

        // Determine background color based on state
        const getBackgroundColor = () => {
          if (isSelected) {
            return isCorrect ? '#4ECDC4' : '#FF6B6B'; // Green for correct, Red for incorrect
          }
          if (selectedAnswer && isTheCorrectAnswer) {
            return '#4ECDC4'; // Show correct answer if user was wrong
          }
          return '#3A3D42'; // Default dark grey
        };
        
        return (
          <Animated.View key={option} entering={FadeInDown.delay(100 * index).duration(400)}>
            <Pressable
              onPress={() => handleAnswerPress(option)}
              disabled={selectedAnswer !== null}
              style={[
                styles.optionButton,
                { backgroundColor: getBackgroundColor() },
                isSelected && styles.selectedOption,
              ]}>
              <Text style={styles.optionText}>{option}</Text>
            </Pressable>
          </Animated.View>
        );
      })}
    </View>
  );

  const renderGameOver = () => (
    <Animated.View entering={FadeIn.duration(800)} style={styles.gameOverContainer}>
      <Icon name="trophy-variant" size={wp('30%')} color="#FFD700" />
      <Text style={styles.gameOverTitle}>Challenge Complete!</Text>
      <Text style={styles.gameOverSubtitle}>You scored</Text>
      <Text style={styles.finalScoreText}>
        {score} / {TOTAL_QUESTIONS}
      </Text>
      
      <Pressable style={styles.actionButton} onPress={restartGame}>
        <Icon name="refresh" size={wp('6%')} color="#FFF" style={styles.buttonIcon} />
        <Text style={styles.actionButtonText}>Try Again</Text>
      </Pressable>
      
      <Pressable style={[styles.actionButton, styles.secondaryButton]} onPress={() => navigation.goBack()}>
        <Icon name="home" size={wp('6%')} color="#FFF" style={styles.buttonIcon} />
        <Text style={styles.actionButtonText}>Back to Home</Text>
      </Pressable>
    </Animated.View>
  );
  
  if (questions.length === 0) {
      // Loading state
      return <View style={styles.container} />;
  }

  return (
    <LinearGradient colors={['#1F2125', '#2C2F34']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={{ flex: 1, paddingTop: insets.top, paddingHorizontal: wp('5%') }}>
        {renderHeader()}
        {isGameOver ? (
          renderGameOver()
        ) : (
          <>
            {renderProgressBar()}
            {renderQuestion()}
            {renderOptions()}
          </>
        )}
      </View>
    </LinearGradient>
  );
};

// --- STYLESHEET ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp('2%'),
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1%'),
    borderRadius: wp('5%'),
  },
  scoreText: {
    color: '#FFF',
    fontSize: wp('5%'),
    fontWeight: 'bold',
    marginLeft: wp('2%'),
  },
  progressText: {
    color: '#A9A9A9',
    fontSize: wp('4%'),
    alignSelf: 'center',
    marginBottom: hp('1%'),
  },
  progressBarBackground: {
    height: hp('1.5%'),
    backgroundColor: '#3A3D42',
    borderRadius: hp('1%'),
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4ECDC4',
    borderRadius: hp('1%'),
  },
  questionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionText: {
    color: '#FFF',
    fontSize: wp('12%'),
    fontWeight: '700',
    textAlign: 'center',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: hp('4%'),
  },
  optionButton: {
    width: wp('42%'),
    height: hp('10%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp('5%'),
    marginBottom: hp('2%'),
    borderWidth: 2,
    borderColor: '#4A4E54',
  },
  selectedOption: {
    transform: [{ scale: 1.05 }],
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  optionText: {
    color: '#FFF',
    fontSize: wp('7%'),
    fontWeight: 'bold',
  },
  // Game Over Styles
  gameOverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverTitle: {
    fontSize: wp('8%'),
    color: '#FFF',
    fontWeight: 'bold',
    marginTop: hp('2%'),
  },
  gameOverSubtitle: {
    fontSize: wp('5%'),
    color: '#A9A9A9',
    marginTop: hp('1%'),
  },
  finalScoreText: {
    fontSize: wp('15%'),
    color: '#4ECDC4',
    fontWeight: 'bold',
    marginVertical: hp('2%'),
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: '#45B7D1',
    width: '100%',
    paddingVertical: hp('2%'),
    borderRadius: wp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('3%'),
  },
  secondaryButton: {
    backgroundColor: '#3A3D42',
    marginTop: hp('1.5%'),
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: wp('5%'),
    fontWeight: 'bold',
  },
  buttonIcon: {
      marginRight: wp('3%')
  }
});

export default Subtraction;