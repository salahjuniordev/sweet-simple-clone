import type { Overrides } from "./localize";

/** French content for case studies, keyed by slug. */
export const caseStudiesFr: Overrides = {
  "northwind-saas": {
    title: "Une refonte de marque et de site qui a doublé les demandes de démo",
    summary:
      "Nouvelle identité, nouveau site vitrine et tunnel de démo orienté conversion, livrés en six semaines.",
    industry: "Logiciel B2B",
    services: ["Identité de Marque", "Développement Web", "Design UI/UX"],
    challenge:
      "Northwind ressemblait à un projet secondaire face à des concurrents financés, et son site enterrait la demande de démo à trois clics de profondeur.",
    approach: [
      "Réalisation d'un audit de marque en neuf points et d'une grille concurrentielle pour trouver un territoire visuel libre.",
      "Construction d'un système d'identité complet : gamme de logos, couleurs, typographies et ton de voix.",
      "Reconstruction du site avec un appel à l'action de démo unique et répété, et des pages rendues côté serveur.",
      "Mise en place de l'analytics et du suivi de tunnel pour visualiser les points d'abandon.",
    ],
    results: [
      { label: "Demandes de démo", value: "+108 %" },
      { label: "Temps de chargement", value: "0,9 s" },
      { label: "Taux de rebond", value: "-31 %" },
      { label: "Livraison", value: "6 semaines" },
    ],
    quote: {
      text: "Mario Studio a reconstruit notre site et notre identité en six semaines. Les demandes de démo ont doublé dès le premier mois.",
      name: "Lina Okafor",
      role: "Cofondatrice, Northwind SaaS",
    },
  },
  "verta-foods": {
    title: "Packaging et système de campagne pour un déploiement en magasin",
    summary:
      "Un système de design cohérent sur le packaging, les réseaux sociaux et le print en magasin pour un lancement dans 400 points de vente.",
    industry: "Agroalimentaire",
    services: ["Design Graphique", "Audit de Marque", "Marketing Digital"],
    challenge:
      "Trois ans de travail en agence avaient produit quatre versions de logo différentes et aucune norme colorimétrique, ce que les distributeurs refusaient systématiquement.",
    approach: [
      "Audit de chaque support en circulation et notation de sa cohérence.",
      "Standardisation des couleurs avec des références validées en impression sur chaque support.",
      "Production d'un pack de campagne de 40 visuels et de gabarits sociaux modifiables.",
      "Lancement d'une campagne payante appuyée sur les nouvelles créations.",
    ],
    results: [
      { label: "Magasins au lancement", value: "400" },
      { label: "Délai de production", value: "-60 %" },
      { label: "CTR de campagne", value: "3,4 %" },
      { label: "Refus d'impression", value: "0" },
    ],
    quote: {
      text: "L'audit de marque valait à lui seul l'investissement. Ils ont trouvé trois incohérences que notre agence livrait depuis des années.",
      name: "Marc Delaunay",
      role: "Directeur Marketing, Verta Foods",
    },
  },
  "atlas-studio": {
    title: "Une chaîne de production vidéo qui a réduit les délais à quelques jours",
    summary:
      "Une seule équipe pour le montage, le motion et la livraison, en remplacement de trois prestataires et de beaucoup d'attente.",
    industry: "Agence créative",
    services: ["Montage Vidéo", "Design Graphique", "Design UI/UX"],
    challenge:
      "Chaque vidéo de campagne passait par trois prestataires : les boucles de retour prenaient des semaines et les détails de marque se perdaient à chaque étape.",
    approach: [
      "Création d'un kit de gabarits motion réutilisables, calé sur le système de marque.",
      "Mise en place d'un espace de validation unique avec versions et commentaires horodatés.",
      "Standardisation des préréglages d'export pour chaque plateforme et chaque format.",
    ],
    results: [
      { label: "Délai de livraison", value: "3 jours" },
      { label: "Vidéos / mois", value: "18" },
      { label: "Prestataires", value: "1" },
      { label: "Tours de révision", value: "-45 %" },
    ],
    quote: {
      text: "Une seule équipe pour le design, le développement et la vidéo : plus rien ne se perd entre les prestataires.",
      name: "Sofia Marchetti",
      role: "Directrice de création, Atlas Studio",
    },
  },
  "palmera-retail": {
    title: "Sécuriser et maintenir une boutique réalisant 2 M$ par an",
    summary:
      "Un sprint de remédiation sécurité suivi d'un contrat de maintenance continue avec une vraie supervision.",
    industry: "E-commerce",
    services: ["Sécurité Web", "Maintenance Web", "Développement Web"],
    challenge:
      "Un ensemble d'extensions non mises à jour, aucune sauvegarde testée et aucune supervision sur une boutique traitant des commandes chaque minute.",
    approach: [
      "Scan complet des vulnérabilités et mise à jour de chaque composant obsolète.",
      "Mise en place de la double authentification et suppression des comptes admin dormants.",
      "Sauvegardes à restauration testée, plus supervision de disponibilité, d'intégrité et des erreurs.",
      "Passage à un forfait mensuel couvrant les mises à jour et les petites améliorations.",
    ],
    results: [
      { label: "Disponibilité", value: "99,99 %" },
      { label: "Problèmes critiques", value: "0 ouvert" },
      { label: "Vitesse du paiement", value: "+22 %" },
      { label: "Incidents", value: "Aucun depuis" },
    ],
    quote: {
      text: "Leur forfait maintenance et sécurité a détecté une vulnérabilité avant qu'elle ne devienne un incident.",
      name: "Daniel Reyes",
      role: "Directeur technique, Palmera Retail",
    },
  },
};
