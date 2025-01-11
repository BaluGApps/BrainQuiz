// import { View, Text } from 'react-native'
// import React from 'react'

// const Addition = () => {
//   return (
//     <View>
//       <Text>Addition</Text>
//     </View>
//   )
// }

// export default Addition

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { FadeInDown, FadeIn, FadeOut } from 'react-native-reanimated';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Local data for addition problems based on difficulty
const problemSets = {
  easy: [
    { id: 1, num1: 5, num2: 3, options: [6, 8, 9, 7] },
    { id: 2, num1: 4, num2: 2, options: [6, 5, 7, 8] },
    { id: 3, num1: 7, num2: 4, options: [11, 10, 12, 9] },
    // Add more problems as needed
  ],
  medium: [
    { id: 1, num1: 15, num2: 26, options: [41, 40, 42, 39] },
    { id: 2, num1: 28, num2: 35, options: [63, 62, 64, 61] },
    { id: 3, num1: 45, num2: 17, options: [62, 61, 63, 60] },
    // Add more problems as needed
  ],
  hard: [
    { id: 1, num1: 123, num2: 456, options: [579, 578, 580, 577] },
    { id: 2, num1: 234, num2: 567, options: [801, 800, 802, 799] },
    { id: 3, num1: 345, num2: 678, options: [1023, 1022, 1024, 1021] },
    // Add more problems as needed
  ],
};

const Addition = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [currentDifficulty, setCurrentDifficulty] = useState('easy');
  const [currentProblem, setCurrentProblem] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [streak, setStreak] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const getCurrentProblem = () => problemSets[currentDifficulty][currentProblem];

  const handleAnswer = (selectedAnswer) => {
    const problem = getCurrentProblem();
    const correctAnswer = problem.num1 + problem.num2;
    const correct = selectedAnswer === correctAnswer;

    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setScore(score + (streak + 1) * 10);
      setStreak(streak + 1);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      setShowResult(false);
      if (currentProblem < problemSets[currentDifficulty].length - 1) {
        setCurrentProblem(currentProblem + 1);
      } else {
        // Handle game completion
        setGameStarted(false);
      }
    }, 1000);
  };

  const startGame = (difficulty) => {
    setCurrentDifficulty(difficulty);
    setCurrentProblem(0);
    setScore(0);
    setStreak(0);
    setGameStarted(true);
  };

  const renderDifficultySelection = () => (
    <Animated.View 
      entering={FadeInDown.delay(200)}
      style={styles.difficultyContainer}
    >
      <Text style={styles.selectText}>Select Difficulty</Text>
      <View style={styles.difficultyButtons}>
        {['easy', 'medium', 'hard'].map((difficulty) => (
          <TouchableOpacity
            key={difficulty}
            onPress={() => startGame(difficulty)}
            style={[styles.difficultyButton]}
          >
            <LinearGradient
              colors={difficulty === 'easy' ? ['#4ECDC4', '#45B7D1'] : 
                     difficulty === 'medium' ? ['#FF6B6B', '#FF8E53'] :
                     ['#9B5DE5', '#F15BB5']}
              style={styles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.difficultyButtonText}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );

  const renderGame = () => {
    const problem = getCurrentProblem();
    
    return (
      <Animated.View 
        entering={FadeIn}
        style={styles.gameContainer}
      >
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>Score: {score}</Text>
          <Text style={styles.streakText}>
            Streak: {streak} {streak > 0 ? '🔥' : ''}
          </Text>
        </View>

        <View style={styles.problemContainer}>
          <Text style={styles.problemText}>
            {problem.num1} + {problem.num2} = ?
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          {problem.options.map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => handleAnswer(option)}
              style={styles.optionButton}
            >
              <LinearGradient
                colors={['#4158D0', '#C850C0']}
                style={styles.gradientButton}
              >
                <Text style={styles.optionText}>{option}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {showResult && (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={[
              styles.resultContainer,
              { backgroundColor: isCorrect ? '#4ECDC4' : '#FF6B6B' },
            ]}
          >
            <Text style={styles.resultText}>
              {isCorrect ? 'Correct! 🎉' : 'Try Again! 💪'}
            </Text>
          </Animated.View>
        )}
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={['#4158D0', '#C850C0']}
        style={styles.header}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={wp('6%')} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Addition Challenge</Text>
      </LinearGradient>

      {!gameStarted ? renderDifficultySelection() : renderGame()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
    borderBottomLeftRadius: wp('5%'),
    borderBottomRightRadius: wp('5%'),
  },
  backButton: {
    padding: wp('2%'),
  },
  headerTitle: {
    color: '#FFF',
    fontSize: wp('5%'),
    fontWeight: '700',
    marginLeft: wp('3%'),
  },
  difficultyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
  },
  selectText: {
    fontSize: wp('6%'),
    fontWeight: '700',
    marginBottom: hp('3%'),
    color: '#333',
  },
  difficultyButtons: {
    width: '100%',
    gap: hp('2%'),
  },
  difficultyButton: {
    width: '100%',
    borderRadius: wp('3%'),
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradientButton: {
    padding: hp('2%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  difficultyButtonText: {
    color: '#FFF',
    fontSize: wp('4.5%'),
    fontWeight: '600',
  },
  gameContainer: {
    flex: 1,
    padding: wp('5%'),
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('3%'),
  },
  scoreText: {
    fontSize: wp('4.5%'),
    fontWeight: '700',
    color: '#333',
  },
  streakText: {
    fontSize: wp('4.5%'),
    fontWeight: '700',
    color: '#FF6B6B',
  },
  problemContainer: {
    backgroundColor: '#FFF',
    padding: hp('3%'),
    borderRadius: wp('5%'),
    alignItems: 'center',
    marginBottom: hp('3%'),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  problemText: {
    fontSize: wp('8%'),
    fontWeight: '700',
    color: '#333',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: hp('2%'),
  },
  optionButton: {
    width: '48%',
    borderRadius: wp('3%'),
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  optionText: {
    color: '#FFF',
    fontSize: wp('5%'),
    fontWeight: '600',
  },
  resultContainer: {
    position: 'absolute',
    bottom: hp('5%'),
    left: wp('5%'),
    right: wp('5%'),
    padding: hp('2%'),
    borderRadius: wp('3%'),
    alignItems: 'center',
  },
  resultText: {
    color: '#FFF',
    fontSize: wp('4.5%'),
    fontWeight: '700',
  },
});

export default Addition;