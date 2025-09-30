import React, {useState, useEffect, useRef} from 'react';
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
const FEEDBACK_DELAY = 600; 
const TIMER_DURATION = 12; // A bit of time to think

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
const NumberSeries = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);

  // For sound effects
  const correctSound = useRef(loadSound('correct.mp3')).current;
  const incorrectSound = useRef(loadSound('incorrect.mp3')).current;
  const timerTickSound = useRef(loadSound('tick.mp3')).current;

  // For animations
  const progress = useSharedValue(0);
  const questionKey = useSharedValue(0);
  const timerProgress = useSharedValue(100);
  const timerId = useRef(null);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  const timerProgressStyle = useAnimatedStyle(() => ({
    width: `${timerProgress.value}%`,
  }));

  // --- GAME LOGIC ---
  useEffect(() => {
    generateQuestions();
  }, []);

  useEffect(() => {
    if (isGameOver || selectedAnswer !== null) {
      if (timerId.current) clearInterval(timerId.current);
      return;
    }
    
    setTimeLeft(TIMER_DURATION);
    timerProgress.value = 100;
    timerProgress.value = withTiming(0, { duration: TIMER_DURATION * 1000 });

    timerId.current = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (newTime <= 4 && newTime > 0) {
            timerTickSound?.play();
        }
        if (newTime <= 0) {
          clearInterval(timerId.current);
          handleTimeOut();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timerId.current);
  }, [currentQuestionIndex, isGameOver, selectedAnswer]);

  const generateQuestions = () => {
    let newQuestions = [];
    const seriesTypes = ['arithmetic', 'geometric', 'squares', 'fibonacci', 'alternating'];

    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
        const type = seriesTypes[Math.floor(Math.random() * seriesTypes.length)];
        let series = [];
        let answer;

        // --- Series Generation Logic ---
        switch (type) {
            case 'arithmetic':
                const startA = Math.floor(Math.random() * 10) + 1;
                const diff = Math.floor(Math.random() * 5) + 2 + Math.floor(i / 10); // Difficulty scales
                for(let j=0; j<4; j++) series.push(startA + j * diff);
                answer = startA + 4 * diff;
                break;
            case 'geometric':
                const startG = Math.floor(Math.random() * 3) + 2;
                const ratio = Math.floor(Math.random() * 2) + 2;
                for(let j=0; j<3; j++) series.push(startG * Math.pow(ratio, j));
                answer = startG * Math.pow(ratio, 3);
                break;
            case 'squares':
                const startS = Math.floor(Math.random() * 5) + 1 + Math.floor(i / 10);
                for(let j=0; j<4; j++) series.push(Math.pow(startS + j, 2));
                answer = Math.pow(startS + 4, 2);
                break;
            case 'fibonacci':
                let n1 = Math.floor(Math.random() * 4) + 1;
                let n2 = Math.floor(Math.random() * 4) + 1;
                series.push(n1, n2);
                for(let j=0; j<3; j++) series.push(series[j] + series[j+1]);
                answer = series[3] + series[4];
                break;
            case 'alternating':
                const startAlt1 = Math.floor(Math.random() * 10) + 1;
                const diffAlt1 = Math.floor(Math.random() * 3) + 1;
                const startAlt2 = Math.floor(Math.random() * 10) + 20;
                const diffAlt2 = Math.floor(Math.random() * 3) + 1;
                series = [startAlt1, startAlt2, startAlt1 + diffAlt1, startAlt2 + diffAlt2, startAlt1 + 2 * diffAlt1];
                answer = startAlt2 + 2 * diffAlt2;
                break;
        }

        let options = new Set([answer]);
        while (options.size < OPTIONS_COUNT) {
            const randomOffset = Math.floor(Math.random() * 10) - 5 || 1;
            const wrongAnswer = answer + randomOffset;
            if (wrongAnswer > 0) options.add(wrongAnswer);
        }

        newQuestions.push({
            question: `${series.join(',  ')}...`,
            answer: answer,
            options: shuffleArray(Array.from(options)),
        });
    }
    setQuestions(newQuestions);
  };


  const handleAnswerPress = (answer) => {
    if (selectedAnswer !== null) return;
    
    clearInterval(timerId.current);
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

    moveToNextQuestion();
  };

  const handleTimeOut = () => {
    incorrectSound?.play();
    HapticFeedback.trigger('notificationError');
    setIsCorrect(false);
    setSelectedAnswer('timeout');
    moveToNextQuestion();
  };

  const moveToNextQuestion = () => {
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

  const renderProgressBars = () => (
    <View>
       <View style={styles.progressHeader}>
         <Text style={styles.progressText}>
           Question {currentQuestionIndex + 1}/{TOTAL_QUESTIONS}
         </Text>
         <View style={styles.timerContainer}>
            <Icon name="clock-fast" size={wp('4%')} color={timeLeft <= 4 ? '#FF6B6B' : '#A9A9A9'} />
            <Text style={[styles.timerText, timeLeft <= 4 && {color: '#FF6B6B'}]}>{timeLeft}s</Text>
         </View>
       </View>
      <View style={styles.progressBarBackground}>
        <Animated.View style={[styles.progressBar, progressStyle]} />
      </View>
      <View style={[styles.progressBarBackground, styles.timerBarContainer]}>
        <Animated.View style={[styles.timerBar, timerProgressStyle, timeLeft <= 4 && {backgroundColor: '#FF6B6B'}]} />
      </View>
    </View>
  );

  const renderQuestion = () => (
    <Animated.View key={questionKey.value} entering={FadeInDown.duration(400)} style={styles.questionContainer}>
      <Text style={styles.questionPrompt}>What comes next in the sequence?</Text>
      <Text style={styles.questionText}>
        {questions[currentQuestionIndex]?.question}
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
          if (selectedAnswer !== null && isTheCorrectAnswer) {
            return '#4ECDC4';
          }
          return '#3A3D42';
        };
        
        return (
          <Animated.View key={index} entering={FadeInDown.delay(100 * index).duration(300)}>
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
            {renderProgressBars()}
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
  container: { flex: 1 },
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
  scoreText: { color: '#FFF', fontSize: wp('5%'), fontWeight: 'bold', marginLeft: wp('2%') },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1%'),
    paddingHorizontal: wp('1%')
  },
  progressText: { color: '#A9A9A9', fontSize: wp('4%') },
  timerContainer: { flexDirection: 'row', alignItems: 'center' },
  timerText: { color: '#A9A9A9', fontSize: wp('4%'), fontWeight: 'bold', marginLeft: wp('1.5%') },
  progressBarBackground: {
    height: hp('1.5%'),
    backgroundColor: '#3A3D42',
    borderRadius: hp('1%'),
    overflow: 'hidden',
  },
  progressBar: { height: '100%', backgroundColor: '#4ECDC4', borderRadius: hp('1%') },
  timerBarContainer: { height: hp('0.7%'), marginTop: hp('1%') },
  timerBar: { height: '100%', backgroundColor: '#45B7D1', borderRadius: hp('1%') },
  questionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: wp('2%') },
  questionPrompt: {
    color: '#A9A9A9',
    fontSize: wp('4.5%'),
    textAlign: 'center',
    marginBottom: hp('2%'),
  },
  questionText: { color: '#FFF', fontSize: wp('9%'), fontWeight: '600', textAlign: 'center' },
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
    padding: wp('2%'),
  },
  selectedOption: {
    transform: [{ scale: 1.05 }],
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  optionText: { color: '#FFF', fontSize: wp('7%'), fontWeight: 'bold', textAlign: 'center' },
  gameOverContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  gameOverTitle: { fontSize: wp('8%'), color: '#FFF', fontWeight: 'bold', marginTop: hp('2%') },
  gameOverSubtitle: { fontSize: wp('5%'), color: '#A9A9A9', marginTop: hp('1%') },
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
  secondaryButton: { backgroundColor: '#3A3D42', marginTop: hp('1.5%') },
  actionButtonText: { color: '#FFF', fontSize: wp('5%'), fontWeight: 'bold' },
  buttonIcon: { marginRight: wp('3%') }
});

export default NumberSeries;
