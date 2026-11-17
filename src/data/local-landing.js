export const defaultProjects = ['agencja-ubezpieczeniowa', 'zdalny-asystent', 'centrum-rehabilitacji'];
export const localQuestions = [
  { title: 'Jak uzyskać wycenę?', answer: 'Wypełnij formularz na tej stronie. Napisz, czym zajmuje się firma i czego potrzebujesz. Pierwsza wycena jest bezpłatna; nie potrzebujesz gotowego briefu ani wiedzy technicznej.' },
  { title: 'Czy potrzebuję gotowych tekstów i zdjęć?', answer: 'Nie musisz mieć wszystkich materiałów przed pierwszym kontaktem. Ustalimy, co już masz — na przykład logo, zdjęcia i opisy oferty — oraz jakie materiały trzeba przygotować i kto się tym zajmie.' },
  { title: 'Od czego zależy termin?', answer: 'Od liczby podstron, funkcji, dostępności materiałów oraz czasu potrzebnego na uwagi i akceptację projektu. Termin uzgodnimy razem z zakresem i wyceną, przed rozpoczęciem prac.' },
  { title: 'Czy strona będzie działać na telefonie?', answer: 'Tak. Projektuję i wdrażam strony dopasowane do telefonów i komputerów. Przed publikacją sprawdzam czytelność treści, nawigację i formularze na różnych szerokościach ekranu.' },
  { title: 'Jak wygląda kontakt podczas projektu?', answer: 'Rozmawiasz bezpośrednio ze mną — osobą wykonującą stronę. Kontaktujemy się telefonicznie lub mailowo, uzgadniamy kolejne etapy i omawiamy uwagi do projektu.' },
  { title: 'Czy można przebudować istniejącą stronę?', answer: 'Tak. Prześlij adres obecnej strony i opisz, co chcesz zmienić. Sprawdzę możliwości przebudowy i zaproponuję zakres prac do wyceny.' },
];
export function localHeading(town) {
  return `Strony internetowe dla firm z ${town.trim()} i okolic`;
}
export function landingProjects(projects) {
  return Array.isArray(projects) && projects.length ? [...new Set([...projects, ...defaultProjects])] : defaultProjects;
}
export function landingQuestions(questions) {
  const valid = Array.isArray(questions) ? questions.filter((item) => item && typeof item.title === 'string' && item.title.trim() && typeof item.answer === 'string' && item.answer.trim()) : [];
  return [...valid, ...localQuestions.filter((item) => !valid.some((local) => local.title === item.title))];
}

