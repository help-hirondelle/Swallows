(function () {
  var root = document.querySelector("[data-nest-map-root]");
  if (!root || !window.L) {
    return;
  }

  var lang = window.SITE_LANG || "en";
  if (lang !== "fr" && lang !== "de" && lang !== "en") {
    lang = "en";
  }

  var mapNode = root.querySelector("[data-nest-map-canvas]");
  var titleNode = root.querySelector("[data-site-title]");
  var areaNode = root.querySelector("[data-site-area]");
  var statusNode = root.querySelector("[data-site-status]");
  var storyNode = root.querySelector("[data-site-story]");
  var qrLinkNode = root.querySelector("[data-site-note]");
  var nextDirectionNode = root.querySelector("[data-next-direction]");
  var nextLinkNode = root.querySelector("[data-next-link]");
  var stationVideoNode = root.querySelector("[data-station-video]");
  var stationVideoWrapNode = root.querySelector(".trail-video");
  var stationImageNode = root.querySelector("[data-station-image]");
  var stationImageArtNode = root.querySelector(".trail-image-art");
  var stationImageTitleNode = root.querySelector("[data-image-title]");
  var stationImageCaptionNode = root.querySelector("[data-image-caption]");
  var radiusGameNode = document.querySelector("[data-radius-game]");
  var radiusMapNode = document.querySelector("[data-radius-map-canvas]");
  var radiusSubmitNode = document.querySelector("[data-radius-submit]");
  var radiusResetNode = document.querySelector("[data-radius-reset]");
  var radiusFeedbackNode = document.querySelector("[data-radius-feedback]");

  if (
    !mapNode ||
    !titleNode ||
    !areaNode ||
    !statusNode ||
    !storyNode ||
    !qrLinkNode ||
    !nextDirectionNode ||
    !nextLinkNode ||
    !stationVideoNode
  ) {
    return;
  }

  var copy = {
    en: {
      progress: "Stop",
      of: "of",
      thisIsLast: "Final stop reached.",
      directionsLabel: "Open walking directions",
      qrPrefix: "QR destination:",
      noNextDirection: "You reached the final station at Ecole De Montoie in Lausanne.",
      directionIntro: "Walk",
      towardsWord: "towards",
      nextWord: "Next",
      storyLabels: {
        stopTheme: "Theme",
        activity: "Kid-Friendly Activity",
        digital: "Digital Content Idea",
        details: "At This Stop"
      },
      imageTitle: "Trail visual",
      imageCaption: "Each station connects a local place with one concrete swallow need.",
      radius: {
        defaultFeedback: "Drag from the center marker to set your estimate.",
        needGuess: "Draw a guess circle first.",
        guessSaved: "Guess saved. Click submit to reveal both circles.",
        revealPrefix: "Actual radius: 300 km. Your difference:",
        centerLabel: "Reference center (Lausanne)"
      }
    },
    fr: {
      progress: "Etape",
      of: "sur",
      thisIsLast: "Derniere etape atteinte.",
      directionsLabel: "Itineraire a pied",
      qrPrefix: "Destination QR:",
      noNextDirection: "Vous etes a la derniere station a l'Ecole De Montoie a Lausanne.",
      directionIntro: "Marchez",
      towardsWord: "vers",
      nextWord: "Suivante",
      storyLabels: {
        stopTheme: "Theme",
        activity: "Activite Enfant",
        digital: "Idee Numerique",
        details: "A Cette Station"
      },
      imageTitle: "Visuel du parcours",
      imageCaption: "Chaque station relie un lieu local a un besoin concret des hirondelles.",
      radius: {
        defaultFeedback: "Faites glisser depuis le marqueur central pour definir votre estimation.",
        needGuess: "Dessinez d'abord un cercle estime.",
        guessSaved: "Estimation enregistree. Validez pour reveler les deux cercles.",
        revealPrefix: "Rayon reel: 300 km. Ecart:",
        centerLabel: "Centre de reference (Lausanne)"
      }
    },
    de: {
      progress: "Station",
      of: "von",
      thisIsLast: "Letzte Station erreicht.",
      directionsLabel: "Gehroute oeffnen",
      qrPrefix: "QR-Ziel:",
      noNextDirection: "Sie sind an der letzten Station bei der Ecole De Montoie in Lausanne angekommen.",
      directionIntro: "Gehen Sie",
      towardsWord: "Richtung",
      nextWord: "Naechste",
      storyLabels: {
        stopTheme: "Thema",
        activity: "Kinderaktivitaet",
        digital: "Digitale Idee",
        details: "An Dieser Station"
      },
      imageTitle: "Pfadbild",
      imageCaption: "Jede Station verbindet einen lokalen Ort mit einem konkreten Beduerfnis der Schwalben.",
      radius: {
        defaultFeedback: "Ziehen Sie vom zentralen Marker, um Ihren Radius zu schaetzen.",
        needGuess: "Zeichnen Sie zuerst einen Schaetzwert-Kreis.",
        guessSaved: "Schaetzung gespeichert. Senden zum Anzeigen beider Kreise.",
        revealPrefix: "Tatsaechlicher Radius: 300 km. Abweichung:",
        centerLabel: "Referenzzentrum (Lausanne)"
      }
    }
  };

  var stationData = {
    en: [
      {
        id: "migration",
        title: "The Great Journey (Migration)",
        area: "Near Theatre Vidy-Lausanne (open lake view), 46.5146 N, 6.5992 E",
        lat: 46.5123,
        lng: 6.6111,
        storyLead:
          "Start at the lakefront and look at the open horizon. It mirrors the huge distances these birds cross each year.",
        storyTheme:
          "Seasonal migration from Europe across the Mediterranean and Sahara Desert to Sub-Saharan Africa.",
        storyActivity:
          "Pack Your Bags game: estimate how far a swallow can fly in one day.",
        storyDigital:
          "Use an animated migration route or an interactive tracking map of tagged swallows.",
        mapHint: "Start near Theatre Vidy-Lausanne",
        videoUrl: ""
      },
      {
        id: "food",
        title: "The Lakeside Buffet (Diet and Hunting)",
        area: "Eastern edge of Parc Louis Bourget (tree lines and marshier zones), 46.5169 N, 6.6014 E",
        lat: 46.5152,
        lng: 6.5986,
        storyLead:
          "Move west along the shoreline where open water meets vegetation, trees, and moist insect-rich zones.",
        storyTheme: "Swallows are aerial insectivores and catch their food entirely in flight.",
        storyActivity:
          "Beak Snapshot: try snapping your fingers as fast as possible and compare that to swallow hunting speed.",
        storyDigital:
          "Show a slow-motion clip of a swallow catching insects mid-air to highlight aerodynamic precision.",
        mapHint: "Shoreline feeding corridor",
        videoUrl: "https://www.youtube.com/watch?v=ku_rMIjIFfE"
      },
      {
        id: "materials",
        title: "Gathering the Mud (Building Material)",
        area: "Wooded trails inland toward Chemin du Bois-de-Vaux, 46.5210 N, 6.6058 E",
        lat: 46.519,
        lng: 6.6035,
        storyLead:
          "Head inland toward quieter wooded trails and look for damp earth and muddy patches near the ground.",
        storyTheme:
          "House martins build enclosed mud-cup nests from tiny mud pellets mixed with saliva.",
        storyActivity:
          "Count the Pellets: estimate how many mud balls are needed for one nest (more than 1,000).",
        storyDigital:
          "Play a nest-building time-lapse to show pellet-by-pellet construction and teamwork.",
        mapHint: "Inland mud-collection zone",
        videoUrl: "https://www.youtube.com/watch?v=xk_LBGByssY"
      },
      {
        id: "nest",
        title: "The Shared Roof (Coexistence and Artificial Nests)",
        area: "Ecole De Montoie, Avenue de Montoie 19, 46.5190 N, 6.6121 E",
        lat: 46.5218,
        lng: 6.6095,
        storyLead:
          "At Ecole De Montoie, the story ends with coexistence: people and birds sharing built space.",
        storyTheme:
          "Conservation through architecture: artificial nests help when modern facades and scarce mud limit natural nesting.",
        storyActivity:
          "Spot the Difference: count artificial nests and look for active use by swallows bringing food.",
        storyDigital:
          "Add a nest-cam stream or a chick-feeding clip showing nest activity up close.",
        mapHint: "Final stop at Ecole De Montoie",
        videoUrl: "https://www.youtube.com/watch?v=rV5SaQk7_5I"
      }
    ],
    fr: [
      {
        id: "migration",
        title: "Le Grand Voyage (Migration)",
        area: "Pres du Theatre Vidy-Lausanne (vue ouverte sur le lac), 46.5146 N, 6.5992 E",
        lat: 46.5123,
        lng: 6.6111,
        storyLead:
          "Commencez au bord du lac et regardez l'horizon ouvert. Il rappelle les grandes distances parcourues chaque annee.",
        storyTheme:
          "Migration saisonniere depuis l'Europe, au-dela de la Mediterranee et du Sahara, vers l'Afrique subsaharienne.",
        storyActivity:
          "Jeu Pack Your Bags: estimez la distance qu'une hirondelle peut voler en une journee.",
        storyDigital:
          "Affichez une carte de migration animee ou un suivi interactif d'hirondelles balisees.",
        mapHint: "Depart pres du Theatre Vidy-Lausanne",
        videoUrl: ""
      },
      {
        id: "food",
        title: "Le Buffet du Lac (Regime et Chasse)",
        area: "Bord est du Parc Louis Bourget (arbres et zones plus humides), 46.5169 N, 6.6014 E",
        lat: 46.5152,
        lng: 6.5986,
        storyLead:
          "Marchez le long de la rive la ou l'eau, la vegetation et les arbres creent des zones riches en insectes.",
        storyTheme:
          "Les hirondelles sont insectivores aeriennes et attrapent leur nourriture entierement en vol.",
        storyActivity:
          "Jeu Beak Snapshot: claquez des doigts le plus vite possible et comparez avec la chasse des hirondelles.",
        storyDigital:
          "Montrez une video au ralenti d'une hirondelle capturant des insectes en plein air.",
        mapHint: "Couloir d'alimentation au bord du lac",
        videoUrl: "https://www.youtube.com/watch?v=ku_rMIjIFfE"
      },
      {
        id: "materials",
        title: "Collecter la Boue (Materiaux du Nid)",
        area: "Sentiers boises vers le Chemin du Bois-de-Vaux, 46.5210 N, 6.6058 E",
        lat: 46.519,
        lng: 6.6035,
        storyLead:
          "En allant vers des sentiers plus calmes, reperez les zones humides et la boue proche du sol.",
        storyTheme:
          "Les hirondelles de fenetre construisent des nids en coupelle avec de petites boulettes de boue melangees a la salive.",
        storyActivity:
          "Jeu Count the Pellets: estimez combien de boulettes de boue sont necessaires pour un nid (plus de 1 000).",
        storyDigital:
          "Lancez un time-lapse de construction pour voir le travail boulette par boulette.",
        mapHint: "Zone de collecte de boue dans les terres",
        videoUrl: "https://www.youtube.com/watch?v=xk_LBGByssY"
      },
      {
        id: "nest",
        title: "Le Toit Partage (Coexistence et Nids Artificiels)",
        area: "Ecole De Montoie, Avenue de Montoie 19, 46.5190 N, 6.6121 E",
        lat: 46.5218,
        lng: 6.6095,
        storyLead:
          "A l'Ecole De Montoie, le parcours se termine sur la coexistence entre humains et hirondelles.",
        storyTheme:
          "La conservation passe aussi par l'architecture: les nids artificiels aident quand les facades modernes et la boue rare limitent la nidification.",
        storyActivity:
          "Jeu Spot the Difference: comptez les nids artificiels et cherchez des hirondelles actives.",
        storyDigital:
          "Ajoutez un flux nest-cam ou un clip d'alimentation des poussins pour observer le nid de pres.",
        mapHint: "Arret final a l'Ecole De Montoie",
        videoUrl: "https://www.youtube.com/watch?v=rV5SaQk7_5I"
      }
    ],
    de: [
      {
        id: "migration",
        title: "Die Grosse Reise (Migration)",
        area: "Nahe Theatre Vidy-Lausanne (freier Blick auf den See), 46.5146 N, 6.5992 E",
        lat: 46.5123,
        lng: 6.6111,
        storyLead:
          "Starten Sie am Seeufer und schauen Sie auf den offenen Horizont. Er zeigt die grossen Distanzen dieser Voegel.",
        storyTheme:
          "Saisonale Migration von Europa ueber Mittelmeer und Sahara nach Subsahara-Afrika.",
        storyActivity:
          "Pack Your Bags Spiel: Schaetzen Sie, wie weit eine Schwalbe an einem Tag fliegen kann.",
        storyDigital:
          "Nutzen Sie eine animierte Migrationsroute oder eine interaktive Tracking-Karte markierter Schwalben.",
        mapHint: "Start nahe Theatre Vidy-Lausanne",
        videoUrl: ""
      },
      {
        id: "food",
        title: "Das Seeufer-Buffet (Nahrung und Jagd)",
        area: "Oestlicher Rand des Parc Louis Bourget (Baumlinien und feuchtere Zonen), 46.5169 N, 6.6014 E",
        lat: 46.5152,
        lng: 6.5986,
        storyLead:
          "Gehen Sie entlang der Uferzone, wo Wasser, Vegetation und Baeume viele Insekten anziehen.",
        storyTheme:
          "Schwalben sind Luftinsektenfresser und fangen ihre Nahrung vollstaendig im Flug.",
        storyActivity:
          "Beak Snapshot Spiel: Schnipsen Sie so schnell wie moeglich und vergleichen Sie das mit der Jagdgeschwindigkeit der Schwalben.",
        storyDigital:
          "Zeigen Sie eine Zeitlupenaufnahme einer Schwalbe beim Insektenfang in der Luft.",
        mapHint: "Futterkorridor am Ufer",
        videoUrl: "https://www.youtube.com/watch?v=ku_rMIjIFfE"
      },
      {
        id: "materials",
        title: "Lehm Sammeln (Nistmaterial)",
        area: "Bewaldete Wege landeinwaerts Richtung Chemin du Bois-de-Vaux, 46.5210 N, 6.6058 E",
        lat: 46.519,
        lng: 6.6035,
        storyLead:
          "Auf ruhigeren Wegen landeinwaerts sehen Sie feuchte Erde und schlammige Stellen am Boden.",
        storyTheme:
          "Mehlschwalben bauen geschlossene Lehmnester aus kleinen Schlammkugeln, gemischt mit Speichel.",
        storyActivity:
          "Count the Pellets Spiel: Schaetzen Sie, wie viele Schlammkugeln fuer ein Nest noetig sind (mehr als 1.000).",
        storyDigital:
          "Zeigen Sie einen Nestbau-Zeitraffer, um die Teamarbeit Kugel fuer Kugel sichtbar zu machen.",
        mapHint: "Landeinwaertige Lehm-Sammelzone",
        videoUrl: "https://www.youtube.com/watch?v=xk_LBGByssY"
      },
      {
        id: "nest",
        title: "Das Geteilte Dach (Koexistenz und Kunstnester)",
        area: "Ecole De Montoie, Avenue de Montoie 19, 46.5190 N, 6.6121 E",
        lat: 46.5218,
        lng: 6.6095,
        storyLead:
          "An der Ecole De Montoie endet der Pfad mit Koexistenz: Menschen und Schwalben teilen gebaute Raeume.",
        storyTheme:
          "Schutz durch Architektur: Kunstnester helfen, wenn moderne Fassaden und wenig Lehm natuerliche Nester begrenzen.",
        storyActivity:
          "Spot the Difference Spiel: Zaehlen Sie Kunstnester und achten Sie auf aktive Nutzung durch Schwalben.",
        storyDigital:
          "Ergaenzen Sie einen Nest-Cam-Stream oder einen Futterclip mit Jungvoegeln aus der Naehe.",
        mapHint: "Letzte Station an der Ecole De Montoie",
        videoUrl: "https://www.youtube.com/watch?v=rV5SaQk7_5I"
      }
    ]
  };
  var stationVisuals = {
    migration: {
      src: "../assets/images/house-martin-returning-nest.jpg",
      title: {
        en: "Long-Distance Return",
        fr: "Retour longue distance",
        de: "Rueckkehr ueber weite Strecken"
      },
      caption: {
        en: "Swallows return each spring to familiar breeding areas and nesting sites.",
        fr: "Les hirondelles reviennent chaque printemps vers des zones de reproduction connues.",
        de: "Schwalben kehren im Fruehling zu vertrauten Brutgebieten zurueck."
      }
    },
    food: {
      src: "../assets/icons/Barn-Swallow-mayfly-800-I-have-some-egrets-bawk-bawk-CC.jpg",
      title: {
        en: "Flying Insect Food",
        fr: "Insectes volants",
        de: "Fliegende Insekten"
      },
      caption: {
        en: "Healthy green and wet areas support the insects swallows catch in flight.",
        fr: "Les espaces verts et humides soutiennent les insectes captures en vol.",
        de: "Gruene und feuchte Flaechen foerdern Insekten, die Schwalben im Flug fangen."
      }
    },
    materials: {
      src: "../assets/images/house-martin-mud-collecting.jpg",
      title: {
        en: "Mud for Nest Building",
        fr: "Boue pour construire les nids",
        de: "Lehm fuer den Nestbau"
      },
      caption: {
        en: "Clay-rich mud near colonies helps house martins build and repair nests.",
        fr: "Une boue argileuse proche des colonies aide a construire et reparer les nids.",
        de: "Tonreicher Lehm nahe Kolonien hilft beim Bau und bei der Reparatur von Nestern."
      }
    },
    nest: {
      src: "../assets/images/common-house-martin-nest.jpg",
      title: {
        en: "Shared Buildings",
        fr: "Batiments partages",
        de: "Geteilte Gebaeude"
      },
      caption: {
        en: "Nests under roofs show why coexistence depends on building design and tolerance.",
        fr: "Les nids sous les toits montrent que la cohabitation depend du bati et de la tolerance.",
        de: "Nester unter Daechern zeigen, wie sehr Koexistenz von Bauweise und Toleranz abhaengt."
      }
    }
  };

  var labels = copy[lang] || copy.en;
  var stations = stationData[lang] || stationData.en;
  var stationTrailCoords = {
    migration: { lat: 46.514528, lng: 6.599111 },
    food: { lat: 46.517134, lng: 6.601525 },
    materials: { lat: 46.521111, lng: 6.605778 },
    nest: { lat: 46.519099, lng: 6.611513 }
  };
  var sketchedTrailWaypoints = [
    [46.514528, 6.599111 ],
    [46.515, 6.599333 ],
    [46.515417, 6.599361 ],
    [46.515806, 6.599083 ],
    [46.516222, 6.598889 ],
    [46.516972, 6.599639 ],
    [46.51725, 6.599778 ],
    [46.517, 6.600361 ],
    [46.517, 6.601167 ],
    [46.517134, 6.601525 ],
    [46.517083, 6.602111 ],
    [46.517417, 6.602333 ],
    [46.517861, 6.602806 ],
    [46.517944, 6.6025 ],
    [46.518139, 6.602722 ],
    [46.518222, 6.602944 ],
    [46.518139, 6.603083 ],
    [46.518278, 6.603417 ],
    [46.518222, 6.603778 ],
    [46.518278, 6.604056 ],
    [46.518333, 6.604222 ],
    [46.518472, 6.604417 ],
    [46.518611, 6.604472 ],
    [46.518806, 6.604389 ],
    [46.519083, 6.604333 ],
    [46.519278, 6.604417 ],
    [46.519667, 6.604917 ],
    [46.519833, 6.605028 ],
    [46.520056, 6.605139 ],
    [46.520222, 6.605389 ],
    [46.520361, 6.605583 ],
    [46.520722, 6.605722 ],
    [46.521111, 6.605778 ],
    [46.521028, 6.605861 ],
    [46.520944, 6.605889 ],
    [46.5205, 6.605917 ],
    [46.520472, 6.605944 ],
    [46.520417, 6.606111 ],
    [46.520306, 6.606083 ],
    [46.519917, 6.607222 ],
    [46.519658, 6.607751 ],
    [46.51915, 6.608855 ],
    [46.519135, 6.608888 ],
    [46.519088, 6.60895 ],
    [46.519078, 6.609054 ],
    [46.519217, 6.609436 ],
    [46.519261, 6.609548 ],
    [46.519275, 6.609589 ],
    [46.51934, 6.609783 ],
    [46.519348, 6.609819 ],
    [46.51937, 6.609917 ],
    [46.519404, 6.610129 ],
    [46.519441, 6.610657 ],
    [46.519409, 6.61067 ],
    [46.519319, 6.610707 ],
    [46.519227, 6.610756 ],
    [46.519176, 6.610818 ],
    [46.519166, 6.610848 ],
    [46.518905, 6.611204 ],
    [46.519099, 6.611513 ]
  ];
  var stationWaypointIndexById = {
    migration: 0,
    food: 9,
    materials: 32,
    nest: 59
  };
  var stationById = {};
  stations.forEach(function (station, index) {
    var trailCoord = stationTrailCoords[station.id];
    if (trailCoord) {
      station.lat = trailCoord.lat;
      station.lng = trailCoord.lng;
    }
    station.order = index + 1;
    stationById[station.id] = station;
  });

  var map = L.map(mapNode, {
    scrollWheelZoom: true
  }).setView([46.517, 6.605], 14);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  var markerNodes = [];
  var activeId = "";
  var fullTrailLine = null;
  var nextTrailLine = null;
  var radiusMap = null;
  var radiusCenter = L.latLng(46.5197, 6.6323);
  var radiusGuessCircle = null;
  var radiusActualCircle = null;
  var radiusGuessMeters = 0;
  var radiusDragging = false;

  function toAbsoluteStationUrl(stationId) {
    var url = new URL(window.location.href);
    url.searchParams.set("station", stationId);
    url.hash = "station-" + stationId;
    return url.toString();
  }

  function distanceKm(origin, target) {
    var toRad = Math.PI / 180;
    var dLat = (target.lat - origin.lat) * toRad;
    var dLng = (target.lng - origin.lng) * toRad;
    var lat1 = origin.lat * toRad;
    var lat2 = target.lat * toRad;

    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return 6371 * c;
  }

  function headingText(origin, target) {
    var dy = target.lat - origin.lat;
    var dx = target.lng - origin.lng;
    var angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    var normalized = (450 - angle) % 360;
    var directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    return directions[Math.round(normalized / 45) % 8];
  }

  function popupHtml(station) {
    return "<strong>" + station.title + "</strong><br />" + station.area + "<br />" + station.mapHint;
  }

  function stationRouteLatLng(station) {
    return [station.lat, station.lng];
  }

  function segmentPathBetweenStations(originStation, nextStation) {
    if (!originStation || !nextStation) {
      return [];
    }

    var startIndex = stationWaypointIndexById[originStation.id];
    var endIndex = stationWaypointIndexById[nextStation.id];

    if (typeof startIndex === "number" && typeof endIndex === "number" && endIndex > startIndex) {
      return sketchedTrailWaypoints.slice(startIndex, endIndex + 1);
    }

    return [stationRouteLatLng(originStation), stationRouteLatLng(nextStation)];
  }

  function fullTrailPath() {
    if (sketchedTrailWaypoints && sketchedTrailWaypoints.length > 1) {
      return sketchedTrailWaypoints;
    }
    return stations.map(function (station) {
      return stationRouteLatLng(station);
    });
  }

  function drawTrail(currentStation, nextStation) {
    if (fullTrailLine) {
      map.removeLayer(fullTrailLine);
      fullTrailLine = null;
    }

    if (nextTrailLine) {
      map.removeLayer(nextTrailLine);
      nextTrailLine = null;
    }

    fullTrailLine = L.polyline(
      fullTrailPath(),
      {
        color: "#2f6b4a",
        weight: 5,
        opacity: 0.55
      }
    ).addTo(map);

    if (!nextStation) {
      return;
    }

    nextTrailLine = L.polyline(
      segmentPathBetweenStations(currentStation, nextStation),
      {
        color: "#cf6f3c",
        weight: 6,
        opacity: 0.95
      }
    ).addTo(map);
  }

  function extractYouTubeId(url) {
    if (!url) {
      return "";
    }

    try {
      var parsed = new URL(url);
      if (parsed.hostname.indexOf("youtu.be") !== -1) {
        return parsed.pathname.replace("/", "").split("/")[0];
      }

      if (parsed.pathname.indexOf("/embed/") !== -1) {
        return parsed.pathname.split("/embed/")[1].split("/")[0];
      }

      var directId = parsed.searchParams.get("v");
      if (directId) {
        return directId;
      }
    } catch (error) {
      // fall through to regex
    }

    var matched = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    return matched ? matched[1] : "";
  }

  function clearNode(node) {
    while (node && node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }

  function appendStoryBlock(label, text) {
    if (!storyNode || !text) {
      return;
    }

    var block = document.createElement("section");
    block.className = "trail-story-block";

    var heading = document.createElement("strong");
    heading.textContent = label;
    block.appendChild(heading);

    var body = document.createElement("p");
    body.textContent = text;
    block.appendChild(body);

    storyNode.appendChild(block);
  }

  function renderStory(station) {
    var storyLabels = labels.storyLabels || copy.en.storyLabels;
    clearNode(storyNode);

    if (station.storyLead) {
      appendStoryBlock(storyLabels.details, station.storyLead);
    }
    if (station.storyTheme) {
      appendStoryBlock(storyLabels.stopTheme, station.storyTheme);
    }
    if (station.storyActivity) {
      appendStoryBlock(storyLabels.activity, station.storyActivity);
    }
    if (station.storyDigital) {
      appendStoryBlock(storyLabels.digital, station.storyDigital);
    }

    if (storyNode.childNodes.length === 0 && station.story) {
      appendStoryBlock(storyLabels.details, station.story);
    }
  }

  function renderStationImage(station) {
    if (!stationImageNode || !stationImageTitleNode || !stationImageCaptionNode) {
      return;
    }

    var visual = stationVisuals[station.id] || {};
    if (stationImageArtNode && visual.src) {
      stationImageArtNode.style.backgroundImage =
        'linear-gradient(180deg, rgba(12, 35, 24, 0.08), rgba(12, 35, 24, 0.28)), url("' + visual.src + '")';
      stationImageArtNode.style.backgroundSize = "cover";
      stationImageArtNode.style.backgroundPosition = "center";
    }

    stationImageTitleNode.textContent =
      station.imageTitle || (visual.title && visual.title[lang]) || labels.imageTitle || copy.en.imageTitle;
    stationImageCaptionNode.textContent =
      station.imageCaption || (visual.caption && visual.caption[lang]) || labels.imageCaption || copy.en.imageCaption;
  }

  function formatKm(valueKm) {
    if (valueKm < 10) {
      return valueKm.toFixed(1) + " km";
    }
    return Math.round(valueKm) + " km";
  }

  function updateRadiusFeedback(message) {
    if (radiusFeedbackNode) {
      radiusFeedbackNode.textContent = message;
    }
  }

  function clearRadiusGuess() {
    radiusGuessMeters = 0;
    radiusDragging = false;
    if (radiusGuessCircle && radiusMap) {
      radiusMap.removeLayer(radiusGuessCircle);
      radiusGuessCircle = null;
    }
    if (radiusActualCircle && radiusMap) {
      radiusMap.removeLayer(radiusActualCircle);
      radiusActualCircle = null;
    }
    if (radiusSubmitNode) {
      radiusSubmitNode.disabled = true;
    }
    updateRadiusFeedback(labels.radius.defaultFeedback);
  }

  function setGuessFromLatLng(targetLatLng) {
    if (!radiusMap) {
      return;
    }

    if (radiusGuessCircle) {
      radiusMap.removeLayer(radiusGuessCircle);
      radiusGuessCircle = null;
    }
    if (radiusActualCircle) {
      radiusMap.removeLayer(radiusActualCircle);
      radiusActualCircle = null;
    }

    radiusGuessMeters = Math.max(1000, Math.min(700000, radiusMap.distance(radiusCenter, targetLatLng)));

    radiusGuessCircle = L.circle(radiusCenter, {
      radius: radiusGuessMeters,
      color: "#2f6b4a",
      fillColor: "#4b8f67",
      fillOpacity: 0.12,
      dashArray: "5 5",
      weight: 2
    }).addTo(radiusMap);

    if (radiusSubmitNode) {
      radiusSubmitNode.disabled = false;
    }

    updateRadiusFeedback(labels.radius.guessSaved);
  }

  function revealActualRadius() {
    if (!radiusMap) {
      return;
    }

    if (!radiusGuessMeters) {
      updateRadiusFeedback(labels.radius.needGuess);
      return;
    }

    if (radiusActualCircle) {
      radiusMap.removeLayer(radiusActualCircle);
      radiusActualCircle = null;
    }

    if (radiusGuessCircle) {
      radiusMap.removeLayer(radiusGuessCircle);
      radiusGuessCircle = null;
    }

    radiusGuessCircle = L.circle(radiusCenter, {
      radius: radiusGuessMeters,
      color: "#2f6b4a",
      fillColor: "#4b8f67",
      fillOpacity: 0.18,
      weight: 2
    }).addTo(radiusMap);

    radiusActualCircle = L.circle(radiusCenter, {
      radius: 300000,
      color: "#bf3f2b",
      fillColor: "#d7654b",
      fillOpacity: 0.12,
      dashArray: "8 7",
      weight: 3
    }).addTo(radiusMap);

    var diffKm = Math.abs(radiusGuessMeters - 300000) / 1000;
    var playfulDiffKm = Math.round(diffKm) + 0.67;
    updateRadiusFeedback(labels.radius.revealPrefix + " " + playfulDiffKm.toFixed(2) + " km.");
  }

  function initRadiusMap() {
    if (!radiusGameNode || !radiusMapNode || !radiusSubmitNode || !radiusResetNode || !radiusFeedbackNode) {
      return;
    }

    radiusMap = L.map(radiusMapNode, {
      scrollWheelZoom: true,
      zoomControl: true,
      touchZoom: true,
      doubleClickZoom: true,
      boxZoom: true,
      keyboard: true,
      dragging: false
    }).setView([46.5197, 6.6323], 8);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(radiusMap);

    L.marker(radiusCenter).addTo(radiusMap).bindPopup(labels.radius.centerLabel);

    function clientToLatLng(clientX, clientY) {
      var rect = radiusMapNode.getBoundingClientRect();
      var x = clientX - rect.left;
      var y = clientY - rect.top;
      return radiusMap.containerPointToLatLng(L.point(x, y));
    }

    function onMouseDown(event) {
      radiusDragging = true;
      setGuessFromLatLng(clientToLatLng(event.clientX, event.clientY));
      event.preventDefault();
    }

    function onMouseMove(event) {
      if (!radiusDragging) {
        return;
      }
      setGuessFromLatLng(clientToLatLng(event.clientX, event.clientY));
      event.preventDefault();
    }

    function onMouseUp(event) {
      if (!radiusDragging) {
        return;
      }
      radiusDragging = false;
      setGuessFromLatLng(clientToLatLng(event.clientX, event.clientY));
    }

    function onTouchStart(event) {
      if (!event.touches || !event.touches.length) {
        return;
      }
      var touch = event.touches[0];
      radiusDragging = true;
      setGuessFromLatLng(clientToLatLng(touch.clientX, touch.clientY));
      event.preventDefault();
    }

    function onTouchMove(event) {
      if (!radiusDragging || !event.touches || !event.touches.length) {
        return;
      }
      var touch = event.touches[0];
      setGuessFromLatLng(clientToLatLng(touch.clientX, touch.clientY));
      event.preventDefault();
    }

    function onTouchEnd() {
      radiusDragging = false;
    }

    radiusMapNode.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    radiusMapNode.addEventListener("touchstart", onTouchStart, { passive: false });
    radiusMapNode.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onTouchEnd, { passive: true });
    document.addEventListener("touchcancel", onTouchEnd, { passive: true });

    radiusSubmitNode.addEventListener("click", revealActualRadius);
    radiusResetNode.addEventListener("click", clearRadiusGuess);
    clearRadiusGuess();
  }

  function setNextDirections(station) {
    var nextStation = stations[station.order] || null;
    drawTrail(station, nextStation);

    if (!nextStation) {
      nextDirectionNode.textContent = labels.thisIsLast + " " + labels.noNextDirection;
      nextLinkNode.setAttribute("hidden", "hidden");
      return;
    }

    var distance = distanceKm(station, nextStation);
    var distanceText = distance < 1 ? Math.round(distance * 1000) + " m" : distance.toFixed(1) + " km";
    var heading = headingText(station, nextStation);
    var walkLink =
      "https://www.google.com/maps/dir/?api=1&travelmode=walking&origin=" +
      station.lat +
      "," +
      station.lng +
      "&destination=" +
      nextStation.lat +
      "," +
      nextStation.lng;

    nextDirectionNode.textContent =
      labels.nextWord +
      ": " +
      labels.directionIntro +
      " " +
      heading +
      " " +
      labels.towardsWord +
      " " +
      nextStation.title +
      " (" +
      distanceText +
      ").";

    nextLinkNode.textContent = labels.directionsLabel;
    nextLinkNode.href = walkLink;
    nextLinkNode.removeAttribute("hidden");
  }

  function renderStation(station) {
    var stationUrl = toAbsoluteStationUrl(station.id);

    titleNode.textContent = station.title;
    areaNode.textContent = station.area;
    statusNode.textContent = labels.progress + " " + station.order + " " + labels.of + " " + stations.length;
    renderStory(station);
    renderStationImage(station);
    qrLinkNode.textContent = stationUrl;
    qrLinkNode.href = stationUrl;
    qrLinkNode.setAttribute("aria-label", labels.qrPrefix + " " + station.title);

    var videoId = extractYouTubeId(station.videoUrl);
    if (station.videoUrl && videoId) {
      if (stationVideoWrapNode) {
        stationVideoWrapNode.removeAttribute("hidden");
      }
      stationVideoNode.removeAttribute("hidden");
      stationVideoNode.title = station.title;
      if (stationVideoNode.tagName === "IFRAME") {
        stationVideoNode.src = "https://www.youtube.com/embed/" + videoId;
      } else {
        stationVideoNode.href = station.videoUrl;
      }
    } else {
      if (stationVideoWrapNode) {
        stationVideoWrapNode.setAttribute("hidden", "hidden");
      }
      stationVideoNode.setAttribute("hidden", "hidden");
      if (stationVideoNode.tagName === "IFRAME") {
        stationVideoNode.src = "about:blank";
      } else {
        stationVideoNode.href = "#";
      }
    }

    setNextDirections(station);
  }

  function setActive(stationId, shouldFly) {
    activeId = stationId;
    var station = stationById[stationId];

    if (!station) {
      return;
    }

    markerNodes.forEach(function (marker) {
      var isActive = marker.stationId === stationId;
      marker.setStyle({
        radius: isActive ? 10 : 8,
        fillColor: isActive ? "#9f3f2b" : "#2d6f4b",
        color: "#ffffff",
        weight: isActive ? 3 : 2,
        fillOpacity: 0.95
      });

      if (isActive) {
        marker.openPopup();
      }
    });

    renderStation(station);

    if (shouldFly) {
      map.flyTo([station.lat, station.lng], Math.max(map.getZoom(), 14), {
        animate: true,
        duration: 0.7
      });
    }

    var nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("station", station.id);
    nextUrl.hash = "station-" + station.id;
    window.history.replaceState({}, "", nextUrl.toString());
  }

  function createMarker(station) {
    var marker = L.circleMarker([station.lat, station.lng], {
      radius: 8,
      color: "#ffffff",
      weight: 2,
      fillColor: "#2d6f4b",
      fillOpacity: 0.95
    }).addTo(map);

    marker.stationId = station.id;
    marker.bindPopup(popupHtml(station), {
      closeButton: false,
      offset: [0, -8]
    });

    marker.on("click", function () {
      setActive(station.id, true);
    });

    markerNodes.push(marker);
  }

  function stationFromUrl() {
    var parsed = new URL(window.location.href);
    var queryStation = parsed.searchParams.get("station");
    if (queryStation && stationById[queryStation]) {
      return queryStation;
    }

    var hashValue = parsed.hash.replace("#", "").replace("station-", "");
    if (hashValue && stationById[hashValue]) {
      return hashValue;
    }

    return stations[0].id;
  }

  initRadiusMap();

  stations.forEach(function (station) {
    createMarker(station);
  });

  setActive(stationFromUrl(), true);

  window.addEventListener("hashchange", function () {
    var stationId = stationFromUrl();
    if (stationId !== activeId) {
      setActive(stationId, true);
    }
  });

  window.setTimeout(function () {
    map.invalidateSize();
    if (radiusMap) {
      radiusMap.invalidateSize();
    }
  }, 0);
})();
