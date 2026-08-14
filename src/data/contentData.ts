export interface Article {
  id: string;
  category: "Sen" | "Stres" | "Nawyki" | "Uważność";
  title: string;
  readTime: string;
  summary: string;
  content: string;
  icon: string;
}

export const ARTICLES: Article[] = [
  {
    id: "1",
    category: "Sen",
    title: "Zasada 90 minut – jak wstać wypoczętym",
    readTime: "3 min",
    summary:
      "Ludzki sen składa się z cykli trwających około 90 minut. Dowiedz się, jak planować budzik.",
    content:
      "Kluczem do porannego orzeźwienia nie jest wyłącznie liczba godzin, ale moment wybudzenia. Każdy cykl snu przechodzi przez fazę lekką, głęboką oraz REM. Wybudzenie w trakcie snu głębokiego powoduje tzw. bezwładność śpieniową. Celuj w wielokrotność 90 minut (np. 6h lub 7.5h) i daj sobie 15 minut na zaśnięcie.",
    icon: "moon-outline",
  },
  {
    id: "2",
    category: "Stres",
    title: "Technika Fizjologicznego Wzdychania",
    readTime: "2 min",
    summary:
      "Najszybsza biologiczna metoda na obniżenie tętna i poziomu kortyzolu w mniej niż minutę.",
    content:
      "Odkryty przez neurobiologów mechanizm polega na zrobieniu dwóch szybkich wdechów nosowo (jeden głęboki, drugi dociągający powietrze), a następnie długim, spokojnym wydechu ustami. Powtórz ten cykl 3-5 razy w momencie nagłego stresu.",
    icon: "leaf-outline",
  },
  {
    id: "3",
    category: "Nawyki",
    title: "Metoda 2 minut wg Jamesa Cleara",
    readTime: "3 min",
    summary:
      "Jak przestać odwlekać budowanie nowych zwyczajów i oszukać opór mózgu.",
    content:
      "Gdy zaczynasz nowy nawyk, nie powinien on zajmować więcej niż dwie minuty. Zamiast „Przeczytam rozdział książki”, zacznij od „Otworzę książkę na stronie 1”. Zamiast „Zrobię trening”, „Założę buty sportowe”. Celem jest utrwalenie obecności, a nie perfekcja wykonania.",
    icon: "flash-outline",
  },
  {
    id: "4",
    category: "Uważność",
    title: "Kotwiczenie w zmysłach (Metoda 5-4-3-2-1)",
    readTime: "4 min",
    summary:
      "Proste ćwiczenie uziemiające przy przebodźcowaniu i natłoku myśli.",
    content:
      "Rozejrzyj się wokół i nazwij w myślach:\n• 5 rzeczy, które widzisz\n• 4 rzeczy, które możesz dotknąć\n• 3 dźwięki, które słyszysz\n• 2 zapachy, które czujesz\n• 1 smak, który czujesz w ustach.\nTo pozwala natychmiast powrócić do chwili obecnej.",
    icon: "compass-outline",
  },
];

export const JOURNAL_PROMPTS = [
  "Co dzisiaj sprawiło, że choć na chwilę uśmiechnąłeś się do siebie?",
  "Jaka była najtrudniejsza decyzja, którą dzisiaj podjąłeś i co z niej wyciągasz?",
  "Za jaką małą, niedostrzegalną na co dzień rzecz jesteś dziś wdzięczny?",
  "Gdybyś mógł zmienić jedną reakcję na dzisiejsze wydarzenie, co by to było?",
  "Co dobrego zrobiłeś dzisiaj dla swojego ciała lub umysłu?",
  "Jaki drobny sukces przeszedł dzisiaj bez świętowania?",
];
