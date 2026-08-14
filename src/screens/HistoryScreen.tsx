import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { MOODS, INITIAL_HABITS } from "../constants";
import { LogEntry, Habit } from "../types";

export default function HistoryScreen() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const isFocused = useIsFocused();
  const [allHabits, setAllHabits] = useState<Habit[]>(INITIAL_HABITS);

  useEffect(() => {
    if (isFocused) {
      loadHistory();
      loadCustomHabits();
    }
  }, [isFocused]);

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

  const loadHistory = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const logKeys = keys.filter((k) => k.startsWith("@mindlog_"));
      const stores = await AsyncStorage.multiGet(logKeys);

      const loadedLogs: LogEntry[] = stores
        .map(([_, value]) => (value ? JSON.parse(value) : null))
        .filter(Boolean)
        .sort((a, b) => b.date.localeCompare(a.date));

      setLogs(loadedLogs);
    } catch (e) {
      console.error("Błąd ładowania historii:", e);
    }
  };

  const deleteEntry = async (date: string) => {
    Alert.alert(
      "Usuwanie wpisu",
      `Czy na pewno chcesz usunąć wpis z dnia ${date}?`,
      [
        { text: "Anuluj", style: "cancel" },
        {
          text: "Usuń",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem(`@mindlog_${date}`);
            loadHistory();
          },
        },
      ],
    );
  };

  const averageMood =
    logs.length > 0
      ? (logs.reduce((acc, curr) => acc + curr.mood, 0) / logs.length).toFixed(
          1,
        )
      : "0.0";

  const recentLogs = [...logs].reverse().slice(-7);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Analiza i Historia </Text>
          <Text style={styles.subtitle}>Przegląd Twojego samopoczucia</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{logs.length}</Text>
            <Text style={styles.statLabel}>Zapisane dni</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{averageMood} / 4</Text>
            <Text style={styles.statLabel}>Średni nastrój</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ostatnie 7 wpisów</Text>
          {recentLogs.length === 0 ? (
            <Text style={styles.emptyText}>
              Brak wpisów do wyświetlenia wykresu.
            </Text>
          ) : (
            <View style={styles.chartContainer}>
              {recentLogs.map((item) => {
                const moodObj = MOODS.find((m) => m.score === item.mood);
                const heightPercent = (item.mood / 4) * 100;
                return (
                  <View key={item.date} style={styles.barWrapper}>
                    <Text style={styles.barEmoji}>{moodObj?.emoji}</Text>
                    <View style={styles.barBackground}>
                      <View
                        style={[
                          styles.barFill,
                          {
                            height: `${heightPercent}%`,
                            backgroundColor: moodObj?.color || "#3182CE",
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.barDate}>
                      {item.date.split("-").slice(1).join("/")}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        <Text style={[styles.cardTitle, { marginTop: 10, marginBottom: 12 }]}>
          Ostatnie wpisy
        </Text>

        {logs.length === 0 ? (
          <Text style={styles.emptyText}>
            Nie masz jeszcze żadnych zapisanych dni.
          </Text>
        ) : (
          logs.map((item) => {
            const moodObj = MOODS.find((m) => m.score === item.mood);
            return (
              <View key={item.date} style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <View style={styles.historyMoodTag}>
                    <Text style={{ fontSize: 20 }}>{moodObj?.emoji}</Text>
                    <Text style={styles.historyMoodLabel}>
                      {moodObj?.label}
                    </Text>
                  </View>
                  <Text style={styles.historyDate}>{item.date}</Text>
                  <TouchableOpacity onPress={() => deleteEntry(item.date)}>
                    <Ionicons name="trash-outline" size={20} color="#E53E3E" />
                  </TouchableOpacity>
                </View>

                {item.habits && item.habits.length > 0 && (
                  <View style={styles.habitsBadges}>
                    {item.habits.map((hId) => {
                      const hObj = allHabits.find((h) => h.id === hId);
                      return (
                        <View key={hId} style={styles.badge}>
                          <Text style={styles.badgeText}>{hObj?.title}</Text>
                        </View>
                      );
                    })}
                  </View>
                )}

                {item.note ? (
                  <Text style={styles.historyNote}>"{item.note}"</Text>
                ) : null}
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  scrollContent: {
    padding: 20,
    paddingTop: 40,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
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
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    width: "48%",
    alignItems: "center",
    elevation: 2,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3182CE",
  },
  statLabel: {
    fontSize: 12,
    color: "#718096",
    marginTop: 4,
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: 150,
    paddingTop: 20,
  },
  barWrapper: {
    alignItems: "center",
    height: "100%",
    justifyContent: "flex-end",
    width: 30,
  },
  barEmoji: {
    fontSize: 14,
    marginBottom: 4,
  },
  barBackground: {
    width: 12,
    height: 90,
    backgroundColor: "#EDF2F7",
    borderRadius: 6,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barFill: {
    width: "100%",
    borderRadius: 6,
  },
  barDate: {
    fontSize: 10,
    color: "#718096",
    marginTop: 6,
  },
  emptyText: {
    color: "#A0AEC0",
    textAlign: "center",
    marginVertical: 16,
  },
  historyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  historyMoodTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  historyMoodLabel: {
    fontWeight: "600",
    color: "#2D3748",
  },
  historyDate: {
    fontSize: 12,
    color: "#A0AEC0",
  },
  habitsBadges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginVertical: 6,
  },
  badge: {
    backgroundColor: "#EDF2F7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    color: "#4A5568",
  },
  historyNote: {
    fontStyle: "italic",
    color: "#4A5568",
    marginTop: 6,
    fontSize: 13,
  },
});
