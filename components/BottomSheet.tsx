import { useEffect } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const SCREEN_HEIGHT = Dimensions.get("screen").height;
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50;

export default function BottomSheet() {
  const translateY = useSharedValue(0);
  const ctx = useSharedValue({ y: 0 });

  useEffect(() => {
    translateY.value = withSpring(-SCREEN_HEIGHT / 5, { damping: 50 });
  }, []);

  const gesture = Gesture.Pan()
    .onStart(() => {
      ctx.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      translateY.value = event.translationY + ctx.value.y;
      translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
    })
    .onEnd(() => {
      if (translateY.value > -SCREEN_HEIGHT / 3) {
        console.log(translateY.value, SCREEN_HEIGHT);
        translateY.value = withSpring(-SCREEN_HEIGHT / 5, { damping: 50 });
      } else if (translateY.value < -SCREEN_HEIGHT / 3) {
        translateY.value = withSpring(-SCREEN_HEIGHT / 2, { damping: 50 });
      }
    });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.bottomSheetContainer, rStyle]}>
        <View style={styles.line}></View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  bottomSheetContainer: {
    backgroundColor: "#ffffff",
    height: SCREEN_HEIGHT,
    width: "100%",
    position: "absolute",
    top: SCREEN_HEIGHT,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  line: {
    width: "30%",
    height: 6,
    marginHorizontal: "35%",
    marginVertical: 10,
    borderRadius: 3,
    backgroundColor: "#dbdada",
  },
});
