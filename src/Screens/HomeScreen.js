// import React, { useEffect } from 'react';
// import { View, Text, ScrollView, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import Animated, { 
//   FadeIn,
//   FadeInDown
// } from 'react-native-reanimated';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import LottieView from 'lottie-react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp
// } from 'react-native-responsive-screen';

// const { width } = Dimensions.get('window');
// const CARD_WIDTH = wp('44%');

// const sections = [
//   { id: 1, title: 'Addition', icon: 'plus', color: '#FF6B6B', description: 'Master basic addition' },
//   { id: 2, title: 'Subtraction', icon: 'minus', color: '#4ECDC4', description: 'Practice subtraction skills' },
//   { id: 3, title: 'Multiplication', icon: 'multiplication', color: '#45B7D1', description: 'Learn multiplication tables' },
//   { id: 4, title: 'Division', icon: 'division', color: '#96CEB4', description: 'Divide with confidence' },
//   { id: 5, title: 'PEMDAS', icon: 'calculator', color: '#D4A5A5', description: 'Order of operations' },
//   { id: 6, title: 'Word Problems', icon: 'book-open-variant', color: '#9B5DE5', description: 'Solve real-world problems' },
//   { id: 7, title: 'Number Series', icon: 'numeric', color: '#F15BB5', description: 'Find number patterns' },
//   { id: 8, title: 'Speed Math', icon: 'lightning-bolt', color: '#FEE440', description: 'Quick calculations' },
//   { id: 9, title: 'Logic Puzzles', icon: 'puzzle', color: '#00BBF9', description: 'Challenge your mind' },
// ];

// const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

// const HomeScreen = ({ navigation }) => {
//   const insets = useSafeAreaInsets();
  
//   const renderSectionCard = (item, index) => (
//     <AnimatedTouchableOpacity
//       key={item.id}
//       entering={FadeInDown.delay(index * 100).springify().mass(0.5)}
//       onPress={() => navigation.navigate(item.title.replace(' ', ''))}
//       style={styles.cardContainer}
//       activeOpacity={0.9}
//     >
//       <LinearGradient
//         colors={[item.color, `${item.color}88`]}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 1 }}
//         style={styles.cardGradient}
//       >
//         <View style={styles.iconContainer}>
//           <Icon name={item.icon} size={wp('8%')} color="#FFF" />
//         </View>
//         <Text style={styles.cardTitle}>{item.title}</Text>
//         <Text style={styles.cardDescription}>{item.description}</Text>
//       </LinearGradient>
//     </AnimatedTouchableOpacity>
//   );

//   const AnimatedHeader = () => (
//     <Animated.View 
//       entering={FadeIn.delay(100).springify()}
//       style={styles.headerContent}
//     >
//       <Text style={styles.title}>Brain Quiz</Text>
//       <Text style={styles.subtitle}>Challenge yourself with math puzzles</Text>
//       <View style={styles.statsContainer}>
//         <View style={styles.statItem}>
//           <Icon name="brain" size={wp('6%')} color="#FFF" />
//           <Text style={styles.statText}>Train</Text>
//         </View>
//         <View style={styles.statItem}>
//           <Icon name="trophy" size={wp('6%')} color="#FFF" />
//           <Text style={styles.statText}>Compete</Text>
//         </View>
//         <View style={styles.statItem}>
//           <Icon name="trending-up" size={wp('6%')} color="#FFF" />
//           <Text style={styles.statText}>Improve</Text>
//         </View>
//       </View>
//     </Animated.View>
//   );

//   return (
//     <View style={styles.container}>
//       <LinearGradient
//         colors={['#4158D0', '#C850C0']}
//         style={[styles.header, { paddingTop: insets.top + hp('2%') }]}
//       >
//         <AnimatedHeader />
//       </LinearGradient>

//       <ScrollView
//         style={styles.scrollView}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.scrollContent}
//       >
//         <View style={styles.grid}>
//           {sections.map(renderSectionCard)}
//         </View>
//       </ScrollView>

//       <LottieView
//         source={require('../Utils/lottie/Math-background.json')}
//         style={styles.backgroundAnimation}
//         autoPlay
//         loop
//         speed={0.5}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F8F9FA',
//   },
//   header: {
//     paddingHorizontal: wp('5%'),
//     paddingBottom: hp('4%'),
//     borderBottomLeftRadius: wp('8%'),
//     borderBottomRightRadius: wp('8%'),
//   },
//   headerContent: {
//     alignItems: 'center',
//   },
//   title: {
//     color: '#FFF',
//     fontSize: wp('8%'),
//     fontWeight: '800',
//     textAlign: 'center',
//   },
//   subtitle: {
//     color: '#FFF',
//     opacity: 0.9,
//     marginTop: hp('1%'),
//     fontSize: wp('4%'),
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '100%',
//     marginTop: hp('2%'),
//     paddingHorizontal: wp('5%'),
//   },
//   statItem: {
//     alignItems: 'center',
//     backgroundColor: 'rgba(255,255,255,0.1)',
//     padding: wp('2.5%'),
//     borderRadius: wp('3%'),
//     width: wp('25%'),
//   },
//   statText: {
//     color: '#FFF',
//     marginTop: hp('0.5%'),
//     fontSize: wp('3%'),
//     fontWeight: '600',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingVertical: hp('2%'),
//   },
//   grid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//     paddingHorizontal: wp('2%'),
//   },
//   cardContainer: {
//     width: CARD_WIDTH,
//     margin: wp('2%'),
//     borderRadius: wp('5%'),
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
//   cardGradient: {
//     padding: wp('5%'),
//     height: hp('22%'),
//     borderRadius: wp('5%'),
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   iconContainer: {
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     padding: wp('3%'),
//     borderRadius: wp('4%'),
//     marginBottom: hp('1.5%'),
//   },
//   cardTitle: {
//     color: '#FFF',
//     fontSize: wp('4.5%'),
//     fontWeight: '700',
//     marginBottom: hp('1%'),
//     textAlign: 'center',
//   },
//   cardDescription: {
//     color: '#FFF',
//     fontSize: wp('3%'),
//     opacity: 0.9,
//     textAlign: 'center',
//   },
//   backgroundAnimation: {
//     position: 'absolute',
//     width: wp('100%'),
//     height: wp('100%'),
//     opacity: 0.05,
//     top: hp('30%'),
//   },
// });

// export default HomeScreen;

import React from 'react';
import { View, Text, ScrollView, Pressable, Dimensions, StyleSheet, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeIn, FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import LottieView from 'lottie-react-native';

// --- REDESIGNED SECTIONS DATA ---
// I've updated the color palette to be more cohesive and modern.
// Each section now has a unique gradient for a richer visual effect.
const sections = [
  { id: 1, title: 'Addition', icon: 'plus-circle-outline', colors: ['#FF6B6B', '#FF8E53'], description: 'Mastering the basics' },
  { id: 2, title: 'Subtraction', icon: 'minus-circle-outline', colors: ['#4ECDC4', '#55E6C1'], description: 'Sharpen your skills' },
  { id: 3, title: 'Multiplication', icon: 'close-circle-outline', colors: ['#45B7D1', '#48C6EF'], description: 'Tables and techniques' },
  { id: 4, title: 'Division', icon: 'division-box', colors: ['#96CEB4', '#B2E4DB'], description: 'Divide and conquer' },
  { id: 5, title: 'PEMDAS', icon: 'abacus', colors: ['#D4A5A5', '#E6B5B5'], description: 'Order of operations' },
  { id: 6, title: 'Word Problems', icon: 'book-open-page-variant-outline', colors: ['#9B5DE5', '#B388EB'], description: 'Real-world scenarios' },
  { id: 7, title: 'Number Series', icon: 'chart-timeline-variant', colors: ['#F15BB5', '#F78AE0'], description: 'Find the next number' },
  { id: 8, title: 'Speed Math', icon: 'rocket-launch-outline', colors: ['#FEE440', '#FFDA77'], description: 'Quick calculations' },
  { id: 9, title: 'Logic Puzzles', icon: 'puzzle-outline', colors: ['#00BBF9', '#38C9FF'], description: 'Challenge your mind' },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// --- A NEW, MODERN CARD COMPONENT ---
const SectionCard = ({ item, index, navigation }) => {
  const scale = useSharedValue(1);

  // Animated style for press-in/press-out effect
  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };
  
  // The navigation logic is preserved from your original code
  const handleNavigate = () => {
    navigation.navigate(item.title.replace(' ', ''));
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 100).springify().damping(12).stiffness(100)}>
      <AnimatedPressable
        onPress={handleNavigate}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.cardContainer, animatedCardStyle]}
      >
        <LinearGradient
          colors={item.colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        >
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <Icon name={item.icon} size={wp('7%')} color="#FFF" />
            </View>
          </View>
          <View style={styles.cardFooter}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
          </View>
          <View style={styles.cardGoContainer}>
            <Icon name="arrow-right-circle" size={wp('6%')} color="rgba(255,255,255,0.7)" />
          </View>
        </LinearGradient>
      </AnimatedPressable>
    </Animated.View>
  );
};


// --- THE REDESIGNED HOME SCREEN ---
const HomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient colors={['#1F2125', '#2C2F34']} style={styles.container}>
      {/* NOTE: I have removed the LottieView because the local file path
          '../Utils/lottie/Math-background.json' is not available.
          You can add it back here if you have the file.
          A subtle, full-screen background animation can look great.
          Example:
          <LottieView
            source={require('../Utils/lottie/Math-background.json')}
            style={styles.backgroundAnimation}
            autoPlay
            loop
            speed={0.3}
          />
      */}
      {/* <LottieView
            source={require('../Utils/lottie/Math-background.json')}
            style={styles.backgroundAnimation}
            autoPlay
            loop
            speed={0.3}
          /> */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + hp('2%'), paddingBottom: insets.bottom }}
      >
        {/* --- NEW HEADER SECTION --- */}
        <Animated.View entering={FadeIn.duration(800)} style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Brain Quiz</Text>
            <Text style={styles.headerSubtitle}>Choose your challenge arena</Text>
          </View>
          <Icon name="brain" size={wp('10%')} color="rgba(255,255,255,0.7)" />
          {/* <Image 
            source={{ uri: `https://placehold.co/100x100/4ECDC4/FFFFFF?text=User&font=raleway` }}
            style={styles.avatar}
          /> */}
        </Animated.View>
        
        {/* --- CARD GRID --- */}
        <View style={styles.grid}>
          {sections.map((item, index) => (
            <SectionCard key={item.id} item={item} index={index} navigation={navigation} />
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};


// --- COMPLETELY REWRITTEN STYLESHEET FOR A MODERN LOOK ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundAnimation: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.05,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp('6%'),
    marginBottom: hp('3%'),
  },
  headerTitle: {
    color: '#FFF',
    fontSize: wp('8%'),
    fontWeight: '800',
  },
  headerSubtitle: {
    color: '#A9A9A9',
    fontSize: wp('4%'),
    marginTop: hp('0.5%'),
  },
  avatar: {
    width: wp('13%'),
    height: wp('13%'),
    borderRadius: wp('13%'),
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: wp('3%'),
  },
  cardContainer: {
    width: wp('44%'), // Card width
    height: hp('24%'), // Card height
    margin: wp('2%'),
    borderRadius: wp('6%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  cardGradient: {
    flex: 1,
    borderRadius: wp('6%'),
    padding: wp('4%'),
    justifyContent: 'space-between',
  },
  cardHeader: {
    alignItems: 'flex-start',
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: wp('2.5%'),
    borderRadius: wp('4%'),
  },
  cardFooter: {
    alignItems: 'flex-start',
  },
  cardTitle: {
    color: '#FFF',
    fontSize: wp('4.8%'),
    fontWeight: '700',
  },
  cardDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: wp('3.2%'),
    marginTop: hp('0.5%'),
  },
  cardGoContainer: {
    position: 'absolute',
    bottom: wp('4%'),
    right: wp('4%'),
  },
});

export default HomeScreen;
