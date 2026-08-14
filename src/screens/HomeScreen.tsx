import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { MOODS, INITIAL_HABITS } from "../constants";
import { LogEntry, Habit } from "../types";

export default function HomeScreen() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);
  const [note, setNote] = useState<string>("");
  const [waterMl, setWaterMl] = useState<number>(0);

  const [allHabits, setAllHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [newHabitTitle, setNewHabitTitle] = useState<string>("");

  const todayDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    loadTodayData();
    loadCustomHabits();
  }, []);

  const loadTodayData = async () => {
    try {
      const storedData = await AsyncStorage.getItem(`@mindlog_${todayDate}`);
      if (storedData) {
        const parsed: LogEntry = JSON.parse(storedData);
        setSelectedMood(parsed.mood);
        setCompletedHabits(parsed.habits || []);
        setNote(parsed.note || "");
        setWaterMl(parsed.waterMl || 0);
      }
    } catch (e) {
      console.error("Błąd ładowania danych:", e);
    }
  };

  const loadCustomHabits = async () => {
    try {
      const storedHabits = await AsyncStorage.getItem("@custom_habits");
      if (storedHabits) {
        const customHabits: Habit[] = JSON.parse(storedHabits);
        setAllHabits([...INITIAL_HABITS, ...customHabits]);
      }
    } catch (e) {
      console.error("Błąd ładowania nawyków:", e);
    }
  };

  const addCustomHabit = async () => {
    if (!newHabitTitle.trim()) {
      Alert.alert("Uwaga", "Wpisz nazwę nawyku!");
      return;
    }

    const newHabit: Habit = {
      id: Date.now().toString(),
      title: `✨ ${newHabitTitle.trim()}`,
      isCustom: true,
    };

    try {
      const existingCustom = allHabits.filter((h) => h.isCustom);
      const updatedCustom = [...existingCustom, newHabit];

      await AsyncStorage.setItem(
        "@custom_habits",
        JSON.stringify(updatedCustom),
      );

      setAllHabits([...INITIAL_HABITS, ...updatedCustom]);
      setNewHabitTitle("");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      Alert.alert("Błąd", "Nie udało się dodać nawyku.");
    }
  };

  const deleteCustomHabit = async (id: string) => {
    try {
      const existingCustom = allHabits.filter((h) => h.isCustom && h.id !== id);
      await AsyncStorage.setItem(
        "@custom_habits",
        JSON.stringify(existingCustom),
      );

      setAllHabits([...INITIAL_HABITS, ...existingCustom]);
      setCompletedHabits((prev) => prev.filter((hId) => hId !== id));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {
      Alert.alert("Błąd", "Nie udało się usunąć nawyku.");
    }
  };

  const toggleHabit = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (completedHabits.includes(id)) {
      setCompletedHabits(completedHabits.filter((hId) => hId !== id));
    } else {
      setCompletedHabits([...completedHabits, id]);
    }
  };

  const addWater = (amount: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setWaterMl((prev) => Math.min(prev + amount, 3000));
  };

  const saveEntry = async () => {
    if (selectedMood === null) {
      Alert.alert("Uwaga", "Wybierz swój nastrój przed zapisaniem!");
      return;
    }

    const logEntry: LogEntry = {
      date: todayDate,
      mood: selectedMood,
      habits: completedHabits,
      note: note,
      waterMl: waterMl,
    };

    try {
      await AsyncStorage.setItem(
        `@mindlog_${todayDate}`,
        JSON.stringify(logEntry),
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Sukces! 🎉", "Twój wpis na dzisiaj został zapisany.");
    } catch (e) {
      Alert.alert("Błąd", "Nie udało się zapisać danych.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>MindLog </Text>
          <Text style={styles.subtitle}>Dzisiaj: {todayDate}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Jak się dzisiaj czujesz?</Text>
          <View style={styles.moodContainer}>
            {MOODS.map((m) => (
              <TouchableOpacity
                key={m.score}
                style={[
                  styles.moodButton,
                  selectedMood === m.score && styles.moodButtonSelected,
                ]}
                onPress={() => setSelectedMood(m.score)}
              >
                <Text style={styles.moodEmoji}>{m.emoji}</Text>
                <Text style={styles.moodLabel}>{m.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Codzienne nawyki</Text>
          {allHabits.map((habit) => {
            const isDone = completedHabits.includes(habit.id);
            return (
              <View key={habit.id} style={styles.habitRowContainer}>
                <TouchableOpacity
                  style={[styles.habitRow, isDone && styles.habitRowDone]}
                  onPress={() => toggleHabit(habit.id)}
                >
                  <Text
                    style={[styles.habitText, isDone && styles.habitTextDone]}
                  >
                    {habit.title}
                  </Text>
                  <Ionicons
                    name={isDone ? "checkmark-circle" : "ellipse-outline"}
                    size={24}
                    color={isDone ? "#4CAF50" : "#888"}
                  />
                </TouchableOpacity>

                {habit.isCustom && (
                  <TouchableOpacity
                    style={styles.deleteHabitBtn}
                    onPress={() => deleteCustomHabit(habit.id)}
                  >
                    <Ionicons name="trash-outline" size={18} color="#E53E3E" />
                  </TouchableOpacity>
                )}
              </View>
            );
          })}

          <View style={styles.addHabitContainer}>
            <TextInput
              style={styles.addHabitInput}
              placeholder="Dodaj własny nawyk..."
              value={newHabitTitle}
              onChangeText={setNewHabitTitle}
            />
            <TouchableOpacity
              style={styles.addHabitButton}
              onPress={addCustomHabit}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Myśl dnia / Notatka</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={4}
            placeholder="Co wartościowego wydarzyło się dzisiaj?"
            value={note}
            onChangeText={setNote}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={saveEntry}>
          <Text style={styles.saveButtonText}>Zapisz dzisiejszy log</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <View style={styles.waterHeader}>
            <Text style={styles.cardTitle}>Nawodnienie dzisiaj 💧</Text>
            <Text style={{ fontWeight: "bold", color: "#3182CE" }}>
              {waterMl} / 2000 ml
            </Text>
          </View>
          <View style={styles.waterProgressBarBg}>
            <View
              style={[
                styles.waterProgressBarFill,
                { width: `${Math.min((waterMl / 2000) * 100, 100)}%` },
              ]}
            />
          </View>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              style={styles.waterBtn}
              onPress={() => addWater(250)}
            >
              <Text style={styles.waterBtnText}>+250 ml 🥤</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.waterBtn}
              onPress={() => addWater(500)}
            >
              <Text style={styles.waterBtnText}>+500 ml 🍾</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  scrollContent: { padding: 20, paddingTop: 40 },
  header: { marginBottom: 20 },
  title: { fontSize: 28, fontWeight: "bold", color: "#1A1A1A" },
  subtitle: { fontSize: 14, color: "#666", marginTop: 4 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  moodContainer: { flexDirection: "row", justifyContent: "space-between" },
  moodButton: {
    alignItems: "center",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    width: "22%",
  },
  moodButtonSelected: {
    backgroundColor: "#EBF8FF",
    borderColor: "#3182CE",
  },
  moodEmoji: { fontSize: 28 },
  moodLabel: { fontSize: 12, color: "#4A5568", marginTop: 4 },

  habitRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 8,
  },
  habitRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
  },
  habitRowDone: { backgroundColor: "#F0FDF4" },
  habitText: { fontSize: 15, color: "#2D3748" },
  habitTextDone: { textDecorationLine: "line-through", color: "#818CF8" },
  deleteHabitBtn: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  addHabitContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#EDF2F7",
  },
  addHabitInput: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    fontSize: 14,
  },
  addHabitButton: {
    backgroundColor: "#3182CE",
    borderRadius: 8,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  textArea: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    padding: 12,
    height: 90,
    textAlignVertical: "top",
    borderColor: "#E2E8F0",
    borderWidth: 1,
  },
  saveButton: {
    backgroundColor: "#3182CE",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  saveButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },

  waterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  waterProgressBarBg: {
    height: 10,
    backgroundColor: "#EDF2F7",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 14,
  },
  waterProgressBarFill: { height: "100%", backgroundColor: "#3182CE" },
  waterBtn: {
    flex: 1,
    backgroundColor: "#EBF8FF",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  waterBtnText: { color: "#3182CE", fontWeight: "bold" },
});
