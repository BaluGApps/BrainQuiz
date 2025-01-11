// import React, { useEffect } from 'react';
// import { View, Text, StyleSheet, Dimensions } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withSpring,
//   withTiming,
//   Easing,
// } from 'react-native-reanimated';
// import LottieView from 'lottie-react-native';

// const { width } = Dimensions.get('window');

// const SplashScreen = () => {
//   const scale = useSharedValue(0);
//   const opacity = useSharedValue(0);

//   useEffect(() => {
//     scale.value = withSpring(1, { damping: 10 });
//     opacity.value = withTiming(1, {
//       duration: 1000,
//       easing: Easing.bezier(0.25, 0.1, 0.25, 1),
//     });
//   }, []);

//   const animatedStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: scale.value }],
//     opacity: opacity.value,
//   }));

//   return (
//     <LinearGradient
//       colors={['#4158D0', '#C850C0', '#FFCC70']}
//       style={styles.container}
//     >
//       <Animated.View style={[styles.content, animatedStyle]}>
//         <LottieView
//           source={require('../assets/animations/brain-animation.json')}
//           style={styles.animation}
//           autoPlay
//           loop
//         />
//         <Text style={styles.title}>Brain Quiz</Text>
//         <Text style={styles.subtitle}>Train Your Mind</Text>
//       </Animated.View>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   content: {
//     alignItems: 'center',
//   },
//   animation: {
//     width: width * 0.6,
//     height: width * 0.6,
//   },
//   title: {
//     fontSize: 36,
//     fontWeight: '800',
//     color: '#FFF',
//     marginTop: 20,
//   },
//   subtitle: {
//     fontSize: 18,
//     color: '#FFF',
//     opacity: 0.8,
//     marginTop: 8,
//   },
// });

// export default SplashScreen;

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native'; // Import navigation

const { width } = Dimensions.get('window');

const SplashScreen = () => {
    const scale = useSharedValue(0);
    const opacity = useSharedValue(0);
    const navigation = useNavigation(); // Initialize navigation

    useEffect(() => {
        scale.value = withSpring(1, { damping: 10 });
        opacity.value = withTiming(1, {
            duration: 1000,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });

        // Navigate after 3 seconds
        const timer = setTimeout(() => {
            navigation.replace('Home'); // Replace SplashScreen with Home
        }, 3000);

        // Clear timeout if component unmounts
        return () => clearTimeout(timer);
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    return (
        <LinearGradient
            colors={['#4158D0', '#C850C0', '#FFCC70']}
            style={styles.container}
        >
            <Animated.View style={[styles.content, animatedStyle]}>
                <LottieView
                    source={require('../Utils/lottie/Brain-animation.json')}
                    style={styles.animation}
                    autoPlay
                    loop
                />
                <Text style={styles.title}>Brain Quiz</Text>
                <Text style={styles.subtitle}>Train Your Mind</Text>
            </Animated.View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
    },
    animation: {
        width: width * 0.6,
        height: width * 0.6,
    },
    title: {
        fontSize: 36,
        fontWeight: '800',
        color: '#FFF',
        marginTop: 20,
    },
    subtitle: {
        fontSize: 18,
        color: '#FFF',
        opacity: 0.8,
        marginTop: 8,
    },
});

export default SplashScreen;