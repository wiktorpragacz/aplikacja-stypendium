import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ARTICLES, JOURNAL_PROMPTS, Article } from "../data/contentData";

export default function ExploreScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Wszystkie");
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [currentPromptIndex, setCurrentPromptIndex] = useState<number>(0);

  const categories = ["Wszystkie", "Sen", "Stres", "Nawyki", "Uważność"];

  const filteredArticles =
    selectedCategory === "Wszystkie"
      ? ARTICLES
      : ARTICLES.filter((a) => a.category === selectedCategory);

  const nextPrompt = () => {
    setCurrentPromptIndex((prev) => (prev + 1) % JOURNAL_PROMPTS.length);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Odkrywaj & Wiedza </Text>
          <Text style={styles.subtitle}>Baza inspiracji, nawyków i porad</Text>
        </View>

        <View style={styles.promptCard}>
          <View style={styles.promptHeader}>
            <Ionicons name="sparkles" size={20} color="#D69E2E" />
            <Text style={styles.promptTag}>Pytanie na dziś</Text>
          </View>
          <Text style={styles.promptText}>
            "{JOURNAL_PROMPTS[currentPromptIndex]}"
          </Text>
          <TouchableOpacity style={styles.nextPromptBtn} onPress={nextPrompt}>
            <Ionicons name="refresh-outline" size={16} color="#3182CE" />
            <Text style={styles.nextPromptText}>Losuj inne pytanie</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Artykuły i Poradniki</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                selectedCategory === cat && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat && styles.categoryTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {filteredArticles.map((article) => (
          <TouchableOpacity
            key={article.id}
            style={styles.articleCard}
            onPress={() => setActiveArticle(article)}
          >
            <View style={styles.articleIconBg}>
              <Ionicons
                name={article.icon as keyof typeof Ionicons.glyphMap}
                size={24}
                color="#3182CE"
              />
            </View>
            <View style={styles.articleInfo}>
              <View style={styles.articleMeta}>
                <Text style={styles.articleCategory}>{article.category}</Text>
                <Text style={styles.articleDot}>•</Text>
                <Text style={styles.articleReadTime}>{article.readTime}</Text>
              </View>
              <Text style={styles.articleTitle}>{article.title}</Text>
              <Text style={styles.articleSummary} numberOfLines={2}>
                {article.summary}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#CBD5E0" />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        visible={!!activeArticle}
        animationType="slide"
        transparent={false}
      >
        {activeArticle && (
          <SafeAreaView style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setActiveArticle(null)}
              >
                <Ionicons name="close" size={28} color="#2D3748" />
              </TouchableOpacity>

              <View style={styles.modalHeader}>
                <Text style={styles.modalCategory}>
                  {activeArticle.category}
                </Text>
                <Text style={styles.modalTitle}>{activeArticle.title}</Text>
                <Text style={styles.modalReadTime}>
                  Czas czytania: {activeArticle.readTime}
                </Text>
              </View>

              <Text style={styles.modalBody}>{activeArticle.content}</Text>
            </ScrollView>
          </SafeAreaView>
        )}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  scrollContent: { padding: 20, paddingTop: 40 },
  header: { marginBottom: 20 },
  title: { fontSize: 28, fontWeight: "bold", color: "#1A1A1A" },
  subtitle: { fontSize: 14, color: "#666", marginTop: 4 },

  promptCard: {
    backgroundColor: "#FEFCBF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#F6E05E",
  },
  promptHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  promptTag: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#744210",
    uppercase: true,
  },
  promptText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2D3748",
    lineHeight: 22,
  },
  nextPromptBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 12,
  },
  nextPromptText: { fontSize: 13, fontWeight: "600", color: "#3182CE" },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2D3748",
    marginBottom: 12,
  },
  categoriesContainer: { flexDirection: "row", marginBottom: 16 },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#EDF2F7",
    marginRight: 8,
  },
  categoryChipActive: { backgroundColor: "#3182CE" },
  categoryText: { fontSize: 13, color: "#4A5568", fontWeight: "500" },
  categoryTextActive: { color: "#FFFFFF", fontWeight: "bold" },

  articleCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    elevation: 2,
  },
  articleIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#EBF8FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  articleInfo: { flex: 1, paddingRight: 8 },
  articleMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2,
  },
  articleCategory: { fontSize: 11, fontWeight: "bold", color: "#3182CE" },
  articleDot: { color: "#A0AEC0" },
  articleReadTime: { fontSize: 11, color: "#A0AEC0" },
  articleTitle: { fontSize: 15, fontWeight: "bold", color: "#2D3748" },
  articleSummary: { fontSize: 12, color: "#718096", marginTop: 2 },

  modalContainer: { flex: 1, backgroundColor: "#FFFFFF" },
  modalContent: { padding: 24 },
  closeBtn: { alignSelf: "flex-end", padding: 8 },
  modalHeader: { marginVertical: 16 },
  modalCategory: { fontSize: 14, fontWeight: "bold", color: "#3182CE" },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A202C",
    marginTop: 4,
  },
  modalReadTime: { fontSize: 13, color: "#A0AEC0", marginTop: 6 },
  modalBody: { fontSize: 16, color: "#2D3748", lineHeight: 26, marginTop: 12 },
});
