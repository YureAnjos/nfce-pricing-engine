import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  measure,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { runOnUISync } from "react-native-worklets";

type Props = {};

const Accordion = (props: Props) => {
  const listRef = useAnimatedRef<Animated.View>();
  const heightValue = useSharedValue(0);
  const open = useSharedValue(false);
  const progress = useDerivedValue(() => (open.value ? withTiming(1) : withTiming(0)));
  const heightAnimationStyle = useAnimatedStyle(() => ({
    height: interpolate(progress.value, [0, 1], [0, heightValue.value], Extrapolate.CLAMP),
  }));

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.titleContainer}
        onPress={() => {
          if (heightValue.value === 0) {
            runOnUISync(() => {
              "worklet";
              heightValue.value = measure(listRef).height;
            });
          }
          open.value = !open.value;
        }}
      >
        <Text style={styles.textTitle}>Title 2</Text>
      </Pressable>

      <Animated.View style={heightAnimationStyle}>
        <Animated.View ref={listRef} style={styles.contentContainer}>
          <Text style={styles.content}>texto texto</Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#e3edfb",
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  titleContainer: {
    padding: 20,
  },
  textTitle: {
    fontSize: 16,
    color: "black",
  },
  contentContainer: {
    position: "absolute",
    top: 0,
    width: "100%",
  },
  content: {
    padding: 20,
    backgroundColor: "#d6e1f0",
  },
});

export default Accordion;
