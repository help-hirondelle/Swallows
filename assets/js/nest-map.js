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
  var radiusGameNode = root.querySelector("[data-radius-game]");
  var radiusMapNode = root.querySelector("[data-radius-map-canvas]");
  var radiusSubmitNode = root.querySelector("[data-radius-submit]");
  var radiusResetNode = root.querySelector("[data-radius-reset]");
  var radiusFeedbackNode = root.querySelector("[data-radius-feedback]");

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
      imageCaption: "Chaque station relie un lieu local à un besoin concret des hirondelles.",
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
      imageCaption: "Jede Station verbindet einen lokalen Ort mit einem konkreten Bedürfnis der Schwalben.",
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
        area: "Near Theatre Vidy-Lausanne (open lake view), 46.5123 N, 6.6111 E",
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
        area: "Eastern edge of Parc Louis Bourget (tree lines and marshier zones), 46.5152 N, 6.5986 E",
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
        area: "Wooded trails inland toward Chemin du Bois-de-Vaux, 46.5190 N, 6.6035 E",
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
        area: "Ecole De Montoie, Avenue de Montoie 19, 46.5218 N, 6.6095 E",
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
        area: "Pres du Theatre Vidy-Lausanne (vue ouverte sur le lac), 46.5123 N, 6.6111 E",
        lat: 46.5123,
        lng: 6.6111,
        story:
          "Contemplez le lac Léman et imaginez l'immensité de l'horizon. Chaque automne, les hirondelles entament un voyage incroyable depuis l'Europe, traversant la mer Méditerranée et le vaste désert du Sahara pour rejoindre l'Afrique subsaharienne. Jeu - Pack Your Bags: Devinez sur notre site combien de kilomètres ces petits oiseaux peuvent parcourir en une seule journée. Regardez la carte de suivi pour voir leurs routes migratoires.",
        mapHint: "Depart pres du Theatre Vidy-Lausanne",
        videoUrl: ""
      },
      {
        id: "food",
        title: "Le Buffet du Lac (Regime et Chasse)",
        area: "Bord est du Parc Louis Bourget (arbres et zones plus humides), 46.5152 N, 6.5986 E",
        lat: 46.5152,
        lng: 6.5986,
        story:
          "En vous promenant au bord du parc, observez les arbres et la végétation humide. C'est le buffet aérien idéal ! Les hirondelles sont des insectivores aériens, ce qui signifie qu'elles chassent et capturent toutes leurs proies en plein vol à grande vitesse. Jeu - Beak Snapshot: Essayez de claquer des doigts le plus vite possible. Pouvez-vous claquer des doigts assez vite pour attraper un moustique ? Les hirondelles volent la bouche grande ouverte comme de petits filets pour capturer des milliers d'insectes chaque jour.",
        mapHint: "Couloir d'alimentation au bord du lac",
        videoUrl: "https://www.youtube.com/watch?v=ku_rMIjIFfE"
      },
      {
        id: "materials",
        title: "Collecter la Boue (Materiaux du Nid)",
        area: "Sentiers boises vers le Chemin du Bois-de-Vaux, 46.5190 N, 6.6035 E",
        lat: 46.519,
        lng: 6.6035,
        story:
          "En vous enfonçant dans les terres vers des sentiers plus calmes, remarquez les zones boueuses et le sol humide. C'est ici que le travail d'ingénierie commence. Les hirondelles de fenêtre collectent de minuscules boulettes de boue humide, les mélangent à leur salive collante et les assemblent sur les façades. Jeu - Count the Pellets: Devinez combien de boulettes de boue individuelles sont nécessaires pour construire un seul nid. Il faut plus de 1 000 allers-retours ! Regardez la vidéo ci-dessous pour voir ce travail d'équipe architectural incroyable.",
        mapHint: "Zone de collecte de boue",
        videoUrl: "https://www.youtube.com/watch?v=xk_LBGByssY"
      },
      {
        id: "nest",
        title: "Le Toit Partage (Cohabitation et Nids Artificiels)",
        area: "Ecole De Montoie, Avenue de Montoie 19, 46.5218 N, 6.6095 E",
        lat: 46.5218,
        lng: 6.6095,
        story:
          "Bienvenue à l'Ecole De Montoie ! Regardez attentivement les façades de l'école. Les bâtiments modernes ont souvent des murs lisses où la boue n'adhère pas, ou la boue se fait rare en ville. Pour les aider, les humains installent des nids artificiels. Jeu - Spot the Difference: Comptez combien de nids artificiels vous pouvez voir sur les murs. Pouvez-vous repérer des hirondelles actives ou entendre leurs gazouillis ? Écoutez le clip audio ci-dessous pour reconnaître le chant distinct de l'hirondelle de fenêtre.",
        mapHint: "Arrivee a l'Ecole De Montoie",
        videoUrl: "https://www.youtube.com/watch?v=rV5SaQk7_5I"
      }
    ],
    de: [
      {
        id: "migration",
        title: "Die Grosse Reise (Migration)",
        area: "Nahe Theatre Vidy-Lausanne (offener Seeblick), 46.5123 N, 6.6111 E",
        lat: 46.5123,
        lng: 6.6111,
        story:
          "Blicken Sie über den Genfersee und stellen Sie sich den weiten Horizont vor. Jeden Herbst begeben sich Schwalben auf eine unglaubliche Reise von Europa über das Mittelmeer und die Sahara bis nach Subsahara-Afrika. Spiel - Pack Your Bags: Ratet auf unserer Website, wie viele Kilometer diese winzigen Vögel an einem einzigen Tag fliegen können. Schaut auf die interaktive Karte, um ihre globalen Routen zu verfolgen.",
        mapHint: "Start nahe Theatre Vidy-Lausanne",
        videoUrl: ""
      },
      {
        id: "food",
        title: "Das Ufer-Buffet (Nahrung und Jagd)",
        area: "Oestlicher Rand des Parc Louis Bourget (Baumlinien und feuchtere Zonen), 46.5152 N, 6.5986 E",
        lat: 46.5152,
        lng: 6.5986,
        story:
          "Während Sie am Rand des Parks entlanggehen, beobachten Sie die Bäume und die feuchte Ufervegetation. Dies ist das perfekte Luft-Buffet! Schwalben sind Luft-Insektenjaeger, was bedeutet, dass sie all ihre Beute im Hochgeschwindigkeitsflug fangen. Spiel - Beak Snapshot: Versucht, so schnell wie möglich mit den Fingern zu schnipsen. Könnt ihr schnell genug schnipsen, um eine Mücke zu fangen? Schwalben fliegen mit weit geöffnetem Schnabel wie kleine Netze, um jeden Tag Tausende von Insekten aufzusaugen.",
        mapHint: "Nahrungskorridor am Ufer",
        videoUrl: "https://www.youtube.com/watch?v=ku_rMIjIFfE"
      },
      {
        id: "materials",
        title: "Schlamm Sammeln (Baumaterial)",
        area: "Bewaldete Wege Richtung Chemin du Bois-de-Vaux, 46.5190 N, 6.6035 E",
        lat: 46.519,
        lng: 6.6035,
        story:
          "Wenn Sie landeinwärts auf die ruhigeren Pfade gehen, achten Sie auf die schlammigen Stellen und die feuchte Erde. Hier findet die große Ingenieursarbeit statt. Mehlschwalben sammeln winzige Kügelchen aus feuchtem Schlamm, mischen sie mit ihrem klebrigen Speichel und kleben sie an Hauswände. Spiel - Count the Pellets: Ratet, wie viele einzelne Schlammkugeln man braucht, um nur ein einziges Nest zu bauen. Es braucht mehr als 1.000 Hin- und Rückflüge! Schaut euch das Video unten an, um einen Zeitraffer dieser unglaublichen architektonischen Teamarbeit zu sehen.",
        mapHint: "Zone fuer Baumaterial",
        videoUrl: "https://www.youtube.com/watch?v=xk_LBGByssY"
      },
      {
        id: "nest",
        title: "Das Geteilte Dach (Koexistenz und Kunstnester)",
        area: "Ecole De Montoie, Avenue de Montoie 19, 46.5218 N, 6.6095 E",
        lat: 46.5218,
        lng: 6.6095,
        story:
          "Willkommen an der Ecole De Montoie! Schaut euch die Schulfassaden ganz genau an. Moderne Gebäude haben oft glatte Wände, an denen Schlamm nicht haftet, oder Schlamm ist in Städten selten. Um ihnen zu helfen, installieren Menschen künstliche Nisthilfen. Spiel - Spot the Difference: Zählt, wie viele Kunstnester ihr an den Wänden entdecken könnt. Könnt ihr echte Schwalben sehen oder ihr wunderschönes Zwitschern hören? Hört euch den Audioclip unten an, um den typischen Mehlschwalbengesang zu erkennen.",
        mapHint: "Finale Station Ecole De Montoie",
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
        de: "Rückkehr über weite Strecken"
      },
      caption: {
        en: "Swallows return each spring to familiar breeding areas and nesting sites.",
        fr: "Les hirondelles reviennent chaque printemps vers des zones de reproduction connues.",
        de: "Schwalben kehren im Frühling zu vertrauten Brutgebieten zurück."
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
        fr: "Les espaces verts et humides soutiennent les insectes capturés en vol.",
        de: "Grüne und feuchte Flächen fördern Insekten, die Schwalben im Flug fangen."
      }
    },
    materials: {
      src: "../assets/images/house-martin-mud-collecting.jpg",
      title: {
        en: "Mud for Nest Building",
        fr: "Boue pour construire les nids",
        de: "Lehm für den Nestbau"
      },
      caption: {
        en: "Clay-rich mud near colonies helps house martins build and repair nests.",
        fr: "Une boue argileuse proche des colonies aide à construire et réparer les nids.",
        de: "Tonreicher Lehm nahe Kolonien hilft beim Bau und bei der Reparatur von Nestern."
      }
    },
    nest: {
      src: "../assets/images/common-house-martin-nest.jpg",
      title: {
        en: "Shared Buildings",
        fr: "Bâtiments partagés",
        de: "Geteilte Gebäude"
      },
      caption: {
        en: "Nests under roofs show why coexistence depends on building design and tolerance.",
        fr: "Les nids sous les toits montrent que la cohabitation dépend du bâti et de la tolérance.",
        de: "Nester unter Dächern zeigen, wie sehr Koexistenz von Bauweise und Toleranz abhängt."
      }
    }
  };

  var labels = copy[lang] || copy.en;
  var stations = stationData[lang] || stationData.en;
  var stationById = {};
  stations.forEach(function (station, index) {
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
  var routeLine = null;
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

    if (routeLine) {
      map.removeLayer(routeLine);
      routeLine = null;
    }

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

    routeLine = L.polyline(
      [
        [station.lat, station.lng],
        [nextStation.lat, nextStation.lng]
      ],
      {
        color: "#cf6f3c",
        weight: 4,
        opacity: 0.9,
        dashArray: "8 8"
      }
    ).addTo(map);
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

    if (radiusGameNode) {
      if (station.id === "migration") {
        radiusGameNode.removeAttribute("hidden");
        if (radiusMap) {
          window.setTimeout(function () {
            radiusMap.invalidateSize();
          }, 0);
        }
      } else {
        radiusGameNode.setAttribute("hidden", "hidden");
        if (radiusMap) {
          clearRadiusGuess();
        }
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
