// import { View, Text } from 'react-native'
// import React from 'react'

// const Division = () => {
//   return (
//     <View>
//       <Text>Division</Text>
//     </View>
//   )
// }

// export default Division

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
const FEEDBACK_DELAY = 500;

// --- SOUND SETUP ---
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
const Division = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);

  // Sound effects
  const correctSound = useRef(loadSound('correct.mp3')).current;
  const incorrectSound = useRef(loadSound('incorrect.mp3')).current;

  // Animations
  const progress = useSharedValue(0);
  const questionKey = useSharedValue(0); 

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
      // Generate division problems that result in whole numbers
      // by working backwards from multiplication.
      const quotient = Math.floor(Math.random() * 8) + 2; // The answer (2-9)
      const divisor = Math.floor(Math.random() * (5 + i)) + 2; // The number to divide by (2-16)
      const dividend = quotient * divisor; // The number being divided

      const correctAnswer = quotient;

      let options = new Set([correctAnswer]);
      while (options.size < OPTIONS_COUNT) {
        // Generate wrong answers close to the correct one
        const offset = Math.floor(Math.random() * 5) - 2; // -2, -1, 0, 1, 2
        const wrongAnswer = correctAnswer + offset;
        if (offset !== 0 && wrongAnswer > 0) {
            options.add(wrongAnswer);
        }
      }
      newQuestions.push({
        question: `${dividend} ÷ ${divisor}`, // Using division symbol
        answer: correctAnswer,
        options: shuffleArray(Array.from(options)),
      });
    }
    setQuestions(newQuestions);
  };

  const handleAnswerPress = (answer) => {
    if (selectedAnswer !== null) return; 

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
        questionKey.value += 1;
      } else {
        setIsGameOver(true);
      }
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
        
        const getBackgroundColor = () => {
          if (isSelected) {
            return isCorrect ? '#4ECDC4' : '#FF6B6B';
          }
          if (selectedAnswer && isTheCorrectAnswer) {
            return '#4ECDC4';
          }
          return '#3A3D42';
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
      return <View style={styles.container} />; // Loading state
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

// --- STYLESHEET (Themed for Division) ---
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
    backgroundColor: '#96CEB4', // THEME COLOR
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
    color: '#96CEB4', // THEME COLOR
    fontWeight: 'bold',
    marginVertical: hp('2%'),
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: '#96CEB4', // THEME COLOR
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

export default Division;