export type GuideFAQ = {
  question: string;
  answer: string;
};

export type SwitcherPoint = {
  subtitle: string;
  description: string;
};

export type Guide = {
  slug: string;
  title: string;
  description: string;
  image?: string;
  content: string;
  switcher: {
    standard: { 
      title: string; 
      points: SwitcherPoint[];
    };
    expert: { 
      title: string; 
      points: SwitcherPoint[];
    };
  };
  faq: GuideFAQ[];
  expertChoiceSlugs: string[];
};

export const GUIDES: Guide[] = [
  {
    slug: 'peindre-plastique-metal-sans-ecaillement',
    title: 'Peindre du plastique ou du métal : le guide anti-coulures',
    description: 'Marre des peintures de grande surface qui pèlent au premier frottement ? Découvrez le protocole pro Eightyone pour une accroche définitive sur bois, métal ou verre.',
    image: '/bandeau-spray-global.webp',
    switcher: {
      standard: {
        title: "Le piège des grandes surfaces",
        points: [
          { subtitle: "La fausse promesse 'Multisupport'", description: "Pulvériser une bombe acrylique classique directement sur du plastique. Résultat : la peinture n'accroche pas et part en lambeaux." },
          { subtitle: "Incompatibilité chimique", description: "Utiliser des solvants agressifs de bricolage qui font fondre instantanément le polystyrène ou déforment le PVC souple." }
        ]
      },
      expert: {
        title: "Le protocole Eightyone",
        points: [
          { subtitle: "Préparation chirurgicale", description: "Dégraissage intensif à l'alcool et ponçage fin (grain 400) pour casser la tension de surface du support." },
          { subtitle: "Le secret : l'apprêt spécifique", description: "Application d'un primaire adapté (Plastique, Alu, Zinc) pour créer une véritable fusion moléculaire avec votre peinture." }
        ]
      }
    },
    expertChoiceSlugs: ['appret-plastique-montana', 'appret-universel', 'nettoyant-degraissant', 'masque-protection'],
    faq: [
      { question: "Pourquoi la peinture de mon supermarché coule tout le temps ?", answer: "Les bombes grand public utilisent des valves basse qualité rigides et des gaz instables. Nos aérosols (MTN, Molotow) utilisent des valves modulables pour un contrôle total du débit." },
      { question: "Peut-on peindre du polystyrène sans le faire fondre ?", answer: "Oui, mais uniquement avec un apprêt 'Polystyrene Primer' ou une gamme Water Based (à l'eau). Les solvants des bombes classiques le rongent instantanément." }
    ],
    content: `
      <h2>Arrêtez de gâcher votre matériel</h2>
      <p>On voit trop souvent au shop des clients venir rattraper un projet ruiné par une bombe "tout support" achetée chez Casto ou Leroy Merlin. La vérité ? <strong>La peinture miracle qui accroche partout sans préparation n'existe pas.</strong> Pour un rendu d'usine, la préparation fait 80% du travail.</p>
      
      <h2>Le tuto étape par étape pour une accroche à vie</h2>
      <ol>
        <li><strong>Dégraissage extrême :</strong> Oubliez l'eau et le savon. Utilisez un dégraissant industriel ou de l'alcool isopropylique. Le moindre résidu de sébum laissé par vos doigts empêchera la peinture de mordre.</li>
        <li><strong>Ponçage (L'accroche mécanique) :</strong> Sur les plastiques lisses ou le métal, passez un léger coup de papier de verre (grain 400 à 600) ou de Scotch-Brite. Vous créez des micro-rayures où l'apprêt va s'ancrer.</li>
        <li><strong>Le pont d'adhérence (L'apprêt) :</strong> C'est la règle d'or. Un apprêt plastique va fondre la première couche de PVC pour s'y greffer. Un apprêt métal va bloquer l'oxydation. Appliquez en 2 voiles très fins.</li>
        <li><strong>La peinture finale :</strong> Une fois le primaire sec, votre bombe de couleur (MTN 94, Molotow Premium) fusionnera avec la sous-couche. Résultat garanti sans coulures ni écaillement.</li>
      </ol>

      <h2>Le mot de l'expert sur les surfaces complexes</h2>
      <p>Attention aux plastiques mous (type coque de téléphone en silicone ou semelles de sneakers) : une peinture rigide finira toujours par craqueler avec les torsions. Privilégiez des teintures pénétrantes ou des peintures cuir/tissu spécifiques.</p>
    `
  },
  {
    slug: 'proteger-peinture-bombe-vernis-anti-uv',
    title: 'Vernir sa peinture : Éviter le jaunissement et les rayures',
    description: 'Votre création s\'écaille ou perd son éclat au soleil ? Oubliez les vernis bas de gamme. Apprenez à sceller votre travail comme un carrossier avec les vernis 2K et acryliques.',
    image: '/bandeau-techniques.webp',
    switcher: {
      standard: {
        title: "L'erreur fatale",
        points: [
          { subtitle: "Le vernis premier prix", description: "Utiliser un vernis générique qui n'a pas de filtre UV. Au bout de 3 mois au soleil, votre blanc devient jaune pisseux." },
          { subtitle: "Le conflit chimique", description: "Appliquer un vernis agressif trop tôt. Il agit comme un diluant, fait friser la peinture fraîche en dessous et ruine votre travail." }
        ]
      },
      expert: {
        title: "La finition Carrosserie",
        points: [
          { subtitle: "Technologie Anti-UV", description: "Utilisation exclusive de vernis acryliques haut de gamme avec filtres UV. Les pigments de votre MTN ou Molotow restent éclatants des années." },
          { subtitle: "Protection Extrême 2K", description: "Application d'un vernis bi-composant (durcisseur percutable) créant un bouclier impénétrable contre l'essence et les rayures." }
        ]
      }
    },
    expertChoiceSlugs: ['vernis-mtn-2k', 'vernis-acrylique-mat', 'vernis-satin-94', 'vernis-brillant-lux'],
    faq: [
      { question: "Combien de temps attendre avant de vernir ?", answer: "La règle du shop : soit dans l'heure qui suit votre dernière couche de peinture (frais sur frais), soit vous attendez 48h que les solvants soient totalement évaporés. Entre les deux, vous risquez la catastrophe." },
      { question: "C'est quoi exactement un vernis 2K ?", answer: "2K signifie bi-composant. La bombe contient une capsule de durcisseur qu'on percute avant usage. La réaction chimique rend le vernis dur comme du verre. Idéal pour les cadres de vélo, motos ou skateboards." }
    ],
    content: `
      <h2>Le vernis n'est pas une option, c'est un bouclier</h2>
      <p>Vous avez passé des heures sur votre customisation ou votre restauration. S'arrêter à la peinture est une erreur de débutant. Le vernis protège des frottements mécaniques, de l'humidité et surtout des ultra-violets qui crament les pigments.</p>
      
      <h2>Comment choisir la bonne finition ?</h2>
      <ul>
        <li><strong>Le Mat (Absorbe la lumière) :</strong> Donne un aspect industriel, moderne et masque parfaitement les petits défauts du support. Très apprécié dans la culture urbaine.</li>
        <li><strong>Le Satiné (Le compromis) :</strong> Reflète légèrement la lumière sans éblouir. Facile d'entretien, c're le choix numéro 1 pour la restauration de meubles ou d'objets déco.</li>
        <li><strong>Le Brillant (Effet mouillé) :</strong> Accentue la profondeur des couleurs. Exige un support parfaitement poncé, car le brillant révèle la moindre poussière ou rayure en dessous.</li>
      </ul>

      <h2>La technique d'application : Les voiles croisés</h2>
      <p>Ne cherchez jamais à faire briller du premier coup. Appliquez un premier "voile d'accroche" très léger de loin. Attendez 5 à 10 minutes que ça poisse, puis appliquez une deuxième couche plus chargée, à vitesse constante, en croisant vos mouvements. C'est comme ça qu'on évite la coulure.</p>
    `
  },
  {
    slug: 'eviter-coulures-bombe-peinture-choix-caps',
    title: 'Zéro coulure : Le secret des caps et de la pression',
    description: 'Ne subissez plus le jet cracheur des bombes de supermarché. Apprenez à dompter le débit de votre aérosol avec les skinny et fat caps pour un trait chirurgical.',
    image: '/caps.webp',
    switcher: {
      standard: {
        title: "Le jet aléatoire",
        points: [
          { subtitle: "L'embout unique", description: "Garder le cap d'origine large pour tout faire. Résultat : un brouillard incontrôlable, du gaspillage et l'impossibilité de faire un détail propre." },
          { subtitle: "Valve haute pression rigide", description: "Appuyer sur une bombe de grande surface : c'est du ON/OFF. Vous inondez la surface et provoquez des coulures immédiates." }
        ]
      },
      expert: {
        title: "Le contrôle absolu",
        points: [
          { subtitle: "L'arsenal adapté", description: "Changer de cap selon l'action : Skinny Pro pour les contours chirurgicaux, Fat Cap pour un remplissage opaque instantané." },
          { subtitle: "Valve Basse Pression (Low Pressure)", description: "Utiliser une gamme comme la MTN 94 qui réagit à la pression du doigt, permettant de moduler le débit en direct." }
        ]
      }
    },
    expertChoiceSlugs: ['pack-mix-caps', 'skinny-pro-cap', 'fat-cap-pink', 'astro-fat-cap'],
    faq: [
      { question: "Pourquoi ma bombe 'crache' des gouttelettes ?", answer: "Soit vous n'avez pas secoué assez longtemps (comptez 2 vraies minutes à partir du bruit des billes), soit votre cap est à moitié bouché. Changez de cap pour vérifier." },
      { question: "Comment déboucher un cap ?", answer: "Le meilleur réflexe : purger à la fin de chaque session. Retournez la bombe tête en bas et appuyez jusqu'à ce que seul du gaz sorte. Si c'est déjà sec, laissez tremper dans un diluant ou changez-le (ça coûte quelques centimes)." }
    ],
    content: `
      <h2>Votre bombe est un instrument de précision</h2>
      <p>La plus grosse erreur des néophytes est de penser que la bombe fait le travail toute seule. Dans le graffiti et la customisation, on ne peint pas avec la bombe, on peint avec le cap et la valve. C'est l'équivalent de vos pinceaux.</p>
      
      <h2>L'arsenal du shop : Connaître ses caps</h2>
      <ul>
        <li><strong>Skinny Caps (Trait fin) :</strong> Réduit le débit. Parfait pour les contours, les petits objets ou le travail d'ombre. Gardez la bombe très proche du support (2 à 5 cm) et allez vite.</li>
        <li><strong>Soft / Transversal Caps (Le biseauté) :</strong> Un jet plat en forme d'éventail, comme les pistolets de carrossier. C'est l'arme absolue pour peindre une surface plane sans laisser de "lignes" de passage.</li>
        <li><strong>Fat Caps (Le remplissage massif) :</strong> Un débit surpuissant (jusqu'à 15cm de large). Consomme beaucoup de peinture mais couvre instantanément les grandes surfaces sans effort.</li>
      </ul>

      <h2>La règle d'or du mouvement</h2>
      <p>Ne commencez jamais à pulvériser en visant l'objet. <strong>Votre bras doit être en mouvement avant d'appuyer sur le cap</strong>, et vous devez relâcher la pression avant de stopper votre geste à la fin de la ligne. C'est la seule façon d'éviter l'amas de peinture au point de départ et d'arrivée.</p>
    `
  }
];