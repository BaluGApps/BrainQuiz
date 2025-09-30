import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const SplashScreen = ({ navigation }) => {
  // Initialize animation values
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);
  const rotation = useSharedValue(0);

  useEffect(() => {
    // Start entrance animations
    scale.value = withSequence(
      withTiming(0, { duration: 0 }), // Ensure initial value
      withSpring(1, {
        damping: 15,
        stiffness: 100,
      })
    );

    opacity.value = withSequence(
      withTiming(0, { duration: 0 }), // Ensure initial value
      withTiming(1, {
        duration: 1000,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      })
    );

    translateY.value = withSequence(
      withTiming(50, { duration: 0 }), // Ensure initial value
      withSpring(0, {
        damping: 20,
        stiffness: 100,
      })
    );

    rotation.value = withSequence(
      withTiming(0, { duration: 0 }), // Ensure initial value
      withTiming(360, {
        duration: 1000,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      })
    );

    // Navigation timer with cleanup
    const navigationTimer = setTimeout(() => {
      // Exit animations
      const exitAnimations = async () => {
        scale.value = withTiming(1.2, { duration: 300 });
        opacity.value = withTiming(0, { duration: 300 });
        translateY.value = withTiming(-50, { duration: 300 });

        // Wait for exit animations to complete
        setTimeout(() => {
          navigation.replace('Home');
        }, 300);
      };

      exitAnimations();
    }, 3000);

    return () => {
      clearTimeout(navigationTimer);
    };
  }, [navigation]);

  // Animated styles
  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(opacity.value, [0, 0.5, 1], [0, 0, 1]),
    transform: [
      { 
        translateY: interpolate(
          translateY.value, 
          [50, 0], 
          [20, 0]
        ) 
      },
    ],
  }));

  const rotatingStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${rotation.value}deg` }],
  }));

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <LinearGradient
        colors={['#1F2125', '#2C2F34']} style={styles.container}
      >
        <Animated.View style={[styles.content, containerStyle]}>
          <Animated.View style={[styles.logoContainer, rotatingStyle]}>
            <LottieView
              source={require('../Utils/lottie/Brain-animation.json')}
              style={styles.animation}
              autoPlay
              loop
              speed={1}
              renderMode="HARDWARE"
            />
          </Animated.View>

          <Animated.View style={[styles.textContainer, titleStyle]}>
            <Text style={styles.title}>Brain Quiz</Text>
            <Text style={styles.subtitle}>Train Your Mind</Text>
          </Animated.View>

          <Animated.View style={[styles.taglineContainer, titleStyle]}>
            <Text style={styles.tagline}>Challenge • Learn • Grow</Text>
          </Animated.View>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('4%'),
  },
  animation: {
    width: wp('60%'),
    height: wp('60%'),
  },
  textContainer: {
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  title: {
    fontSize: wp('10%'),
    fontWeight: '800',
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: wp('5%'),
    fontWeight: '600',
    color: '#FFF',
    opacity: 0.9,
    marginTop: hp('1%'),
    letterSpacing: wp('0.3%'),
  },
  taglineContainer: {
    marginTop: hp('4%'),
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1%'),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: wp('5%'),
  },
  tagline: {
    fontSize: wp('4%'),
    color: '#FFF',
    fontWeight: '500',
    letterSpacing: wp('0.2%'),
  },
});

export default SplashScreen;