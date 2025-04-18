import React from "react";
import { Text, Pressable, StyleSheet, ScrollView, View } from "react-native";
import { Box } from "@/components/ui/box";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeIn } from "react-native-reanimated";
import { colors } from "../../utils/colors";

interface CalendarProps {
  allDates: Array<{ fullDate: Date; label: string; keyID: string }>;
  selectedDayIndex: number;
  onSelectDay: (idx: number) => void;
  scrollRef: React.RefObject<ScrollView>;
}

export function Calendar({
  allDates,
  selectedDayIndex,
  onSelectDay,
  scrollRef,
}: CalendarProps) {
  const itemWidth = 64; // width of each day item

  // Add useEffect for initial scroll
  React.useEffect(() => {
    // Find today's index
    const today = new Date();
    const todayIndex = allDates.findIndex(
      (date) =>
        date.fullDate.getDate() === today.getDate() &&
        date.fullDate.getMonth() === today.getMonth() &&
        date.fullDate.getFullYear() === today.getFullYear()
    );

    if (todayIndex !== -1 && scrollRef.current) {
      // Add small delay to ensure the scroll happens after layout
      setTimeout(() => {
        scrollRef.current?.scrollTo({
          x: todayIndex * itemWidth,
          animated: true,
        });
        // Optionally select today's date
        onSelectDay(todayIndex);
      }, 100);
    }
  }, []); // Empty dependency array means this runs once on mount

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <Box style={styles.calendarContainer}>
        <LinearGradient
        colors={[colors.surface.light, "rgba(255, 255, 255, 0.03)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.calendarContent}
        >
          {allDates.map((item, idx) => {
            const isSelected = idx === selectedDayIndex;
            const today = isToday(item.fullDate);
            return (
              <Pressable
                key={item.keyID}
                onPress={() => onSelectDay(idx)}
                style={({ pressed }) => [
                  styles.calendarItem,
                  isSelected && styles.calendarItemSelected,
                  pressed && styles.calendarItemPressed,
                ]}
              >
                <Animated.View
                  entering={FadeIn.duration(200).delay(idx * 50)}
                  style={[
                    styles.calendarInner,
                    isSelected && styles.calendarInnerSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.calendarDay,
                      isSelected && styles.calendarDaySelected,
                    ]}
                  >
                    {item.label.split(" ")[0]}
                  </Text>
                  <Text
                    style={[
                      styles.calendarDate,
                      isSelected && styles.calendarDateSelected,
                      today && styles.todayText,
                    ]}
                  >
                    {item.label.split(" ")[1]}
                  </Text>
                  {today && <Box style={styles.todayDot} />}
                </Animated.View>
              </Pressable>
            );
          })}
        </ScrollView>
      </LinearGradient>
    </Box>
  );
}

const styles = StyleSheet.create({
  calendarContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    paddingVertical: 15,
    marginBottom: 10,
    marginHorizontal: 10,
    backdropFilter: "blur(10px)",
  },
  gradient: {
    paddingVertical: 8,
  },
  calendarContent: {
    paddingHorizontal: 12,
    gap: 8,
  },
  calendarItem: {
    borderRadius: 16,
  },
  calendarInner: {
    width: 54,
    height: 72,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    backgroundColor: colors.surface.light,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  calendarInnerSelected: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[400],
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  calendarItemSelected: {
    transform: [{ scale: 1 }],
  },
  calendarItemPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  calendarDay: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 13,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  calendarDaySelected: {
    color: "#FFFFFF",
  },
  calendarDate: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
  },
  calendarDateSelected: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  todayText: {
    color: colors.status.warning,
    fontWeight: "800",
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.status.warning,
    marginTop: 4,
  },
});
