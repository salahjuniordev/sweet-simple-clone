import type { Overrides } from "./localize";

/** French content for blog posts, keyed by slug. */
export const postsFr: Overrides = {
  "brand-audit-checklist": {
    title: "La checklist d'audit de marque que nous appliquons avant toute refonte",
    excerpt:
      "Avant de toucher au moindre pixel, nous menons un audit en neuf points. Voici la checklist exacte, pour que vous puissiez la mener vous-même.",
    category: "Branding",
    readTime: "6 min de lecture",
    read_time: "6 min de lecture",
    body: [
      "La plupart des refontes échouent parce qu'elles partent du goût plutôt que des faits. Un audit de marque remplace l'opinion par une cartographie de ce que votre marque communique réellement aujourd'hui, sur chaque point de contact client.",
      "Nous commençons par l'inventaire : chaque variante de logo, modèle de présentation, profil social, facture et packaging en circulation. Les équipes sont souvent surprises du nombre de versions existantes et du peu qui respectent la marque.",
      "Vient ensuite la notation de cohérence. Chaque support est évalué sur l'usage du logo, la justesse des couleurs, la typographie et le ton. Tout ce qui passe sous la note minimale rejoint une liste de correction avec un responsable et une date.",
      "Puis nous regardons vers l'extérieur : une grille concurrentielle montrant où votre territoire visuel recoupe celui des autres. Si trois concurrents utilisent le même bleu et la même sans-serif géométrique, la différenciation est un problème de design, pas de budget marketing.",
      "Enfin, nous testons la compréhension. Cinq clients, cinq minutes, une question : que fait cette entreprise et pour qui ? Si les réponses divergent, l'identité ne remplit pas encore son rôle — et c'est exactement ce que la refonte doit corriger.",
    ],
  },
  "website-speed-conversions": {
    title: "Pourquoi une seconde de retard vous coûte discrètement des clients",
    excerpt:
      "La performance est une fonctionnalité de conversion. Voici comment nous passons sous la seconde sans appauvrir le design.",
    category: "Développement Web",
    readTime: "5 min de lecture",
    read_time: "5 min de lecture",
    body: [
      "La vitesse n'est pas une métrique technique de vanité. Chaque seconde supplémentaire avant qu'une page ne devienne utilisable réduit mesurablement le nombre de personnes qui restent assez longtemps pour convertir, et l'effet se cumule sur chaque clic payant acheté.",
      "Les gains les plus importants sont rarement exotiques. Des images correctement dimensionnées dans des formats modernes, des polices chargées sans bloquer le rendu et moins de JavaScript envoyé au navigateur représentent l'essentiel de l'amélioration.",
      "Nous servons des pages rendues côté serveur : la première chose que reçoit le navigateur est du contenu réel, pas une coquille vide en attente d'un bundle. L'interactivité s'ajoute ensuite.",
      "Les scripts tiers méritent une attention particulière. Widgets de chat, heatmaps et gestionnaires de tags sont souvent l'élément le plus lent d'un site vitrine. Nous les chargeons tardivement, ou pas du tout.",
      "Nous traitons la performance comme un budget, pas comme un nettoyage ponctuel : un seuil défini, mesuré à chaque déploiement, pour qu'un site rapide au lancement le soit encore un an plus tard.",
    ],
  },
  "ui-ux-handoff-that-works": {
    title: "Une passation de design que les développeurs apprécient vraiment",
    excerpt:
      "Les design systems cassent au moment de la passation. Ces quatre habitudes gardent design et développement alignés dès le premier jour.",
    category: "Design UI/UX",
    readTime: "4 min de lecture",
    read_time: "4 min de lecture",
    body: [
      "L'échec classique, c'est une belle maquette jetée par-dessus le mur. Ce qui arrive dans le navigateur dérive ensuite, parce que le fichier décrivait une image plutôt qu'un système.",
      "Habitude n° 1 : nommer des tokens, pas des valeurs. Couleurs, espacements et rayons doivent porter dans le fichier de design des noms sémantiques identiques à ceux du code, pour que personne n'ait à traduire des codes hexadécimaux.",
      "Habitude n° 2 : dessiner les états. Vide, chargement, erreur, texte long et plus petit écran supporté. S'ils manquent, les développeurs les inventent, et l'invention devient le produit.",
      "Habitude n° 3 : relire dans le navigateur, pas dans l'outil de design. Le rendu typographique réel, le vrai contenu et l'interaction révèlent des problèmes qu'aucune image fixe ne montrera.",
      "Habitude n° 4 : maintenir une seule liste de composants partagée. Quand design et code s'accordent sur ce qu'est une carte, une refonte devient une mise à jour plutôt qu'une reconstruction.",
    ],
  },
  "small-business-web-security": {
    title: "Les bases de la sécurité web que toute petite entreprise oublie",
    excerpt:
      "Nul besoin d'un budget d'entreprise pour fermer les failles réellement exploitées. Commencez par ces six points.",
    category: "Sécurité Web",
    readTime: "7 min de lecture",
    read_time: "7 min de lecture",
    body: [
      "Les attaques contre les petits sites sont massivement automatisées. Des robots scannent les failles connues à grande échelle, ce qui signifie que le correctif est rarement sophistiqué — c'est une discipline appliquée avec constance.",
      "Maintenez la plateforme et chaque extension à jour. La majorité des sites compromis que nous nettoyons utilisaient un composant dont le correctif public était sorti des mois plus tôt.",
      "Imposez une authentification forte à toute personne disposant d'un accès admin, avec la double authentification activée. Un mot de passe réutilisé sur un seul compte marketing reste la porte d'entrée la plus fréquente.",
      "Faites des sauvegardes que vous avez réellement restaurées. Une sauvegarde non testée est un espoir, pas un plan de reprise ; nous restaurons régulièrement sur un environnement de préproduction pour le prouver.",
      "Ajoutez de la supervision pour l'apprendre d'un système, pas d'un client. Contrôles de disponibilité, alertes d'intégrité des fichiers et suivi des erreurs transforment un incident silencieux en réponse dans l'heure.",
      "Enfin, réduisez la surface : supprimez les extensions inutilisées, retirez les vieux sous-domaines et révoquez les accès des personnes parties. Tout ce qui dort est quelque chose que personne ne surveille.",
    ],
  },
};
