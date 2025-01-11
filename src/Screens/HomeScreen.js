import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring 
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LottieView from 'lottie-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const sections = [
  { id: 1, title: 'Addition', icon: 'plus', color: '#FF6B6B' },
  { id: 2, title: 'Subtraction', icon: 'minus', color: '#4ECDC4' },
  { id: 3, title: 'Multiplication', icon: 'multiplication', color: '#45B7D1' },
  { id: 4, title: 'Division', icon: 'division', color: '#96CEB4' },
  { id: 5, title: 'PEMDAS', icon: 'calculator', color: '#D4A5A5' },
  { id: 6, title: 'Word Problems', icon: 'book-open-variant', color: '#9B5DE5' },
  { id: 7, title: 'Number Series', icon: 'numeric', color: '#F15BB5' },
  { id: 8, title: 'Speed Math', icon: 'lightning-bolt', color: '#FEE440' },
  { id: 9, title: 'Logic Puzzles', icon: 'puzzle', color: '#00BBF9' },
];

const HomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const renderSectionCard = (item) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => navigation.navigate(item.title.replace(' ', ''))}
      style={{
        width: (width - 48) / 2,
        margin: 8,
        borderRadius: 20,
        overflow: 'hidden',
      }}
    >
      <LinearGradient
        colors={[item.color, `${item.color}88`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          padding: 20,
          height: 160,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon name={item.icon} size={40} color="#FFF" />
        <Text
          style={{
            color: '#FFF',
            fontSize: 16,
            fontWeight: '700',
            marginTop: 12,
            textAlign: 'center',
          }}
        >
          {item.title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      <LinearGradient
        colors={['#4158D0', '#C850C0']}
        style={{
          paddingTop: insets.top,
          paddingHorizontal: 20,
          paddingBottom: 30,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ color: '#FFF', fontSize: 28, fontWeight: '800' }}>
              Brain Quiz
            </Text>
            <Text style={{ color: '#FFF', opacity: 0.8, marginTop: 4 }}>
              Train your math skills
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Icon name="account-circle" size={40} color="#FFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <Animated.ScrollView
        style={[{ flex: 1, padding: 12 }, animatedStyle]}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
          {sections.map(renderSectionCard)}
        </View>
      </Animated.ScrollView>

      <LottieView
        source={require('../Utils/lottie/Math-background.json')}
        style={{
          position: 'absolute',
          width: width,
          height: width,
          opacity: 0.1,
        }}
        autoPlay
        loop
      />
    </View>
  );
};

export default HomeScreen;