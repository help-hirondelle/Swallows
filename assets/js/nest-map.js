(function () {
  var root = document.querySelector("[data-nest-map-root]");
  if (!root || !window.maplibregl) {
    return;
  }
  var hasLeaflet = !!window.L;
  // Toggle this to true to re-enable station popups.
  var ENABLE_STATION_POPUPS = true;

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
    !storyNode ||
    !qrLinkNode ||
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
      thisIsLast: "Letzte Station erreicht",
      directionsLabel: "Wegbeschreibung öffnen",
      qrPrefix: "QR-Ziel:",
      noNextDirection: "Sie haben die letzte Station an der Ecole De Montoie in Lausanne erreicht.",
      directionIntro: "Wegbeschreibung",
      towardsWord: "Richtung",
      nextWord: "Nächste",
      storyLabels: {
        stopTheme: "Thema",
        activity: "Aktivität für Kinder",
        digital: "Digitaler Inhalt",
        details: "An dieser Station"
      },
      imageTitle: "Visualisierung",
      imageCaption: "Jede Station verknüpft einen lokalen Ort mit einem spezifischen Bedürfnis der Schwalben.",
      radius: {
        defaultFeedback: "Ziehen Sie den Kreis vom Zentrum aus auf die gewünschte Grösse.",
        needGuess: "Zeichnen Sie zuerst einen geschätzten Kreis ein.",
        guessSaved: "Schätzung gespeichert. Klicken Sie auf Senden, um das Ergebnis zu sehen.",
        revealPrefix: "Tatsächlicher Radius: 300 km. Ihre Abweichung:",
        centerLabel: "Referenzzentrum (Lausanne)"
      }
    }
  };

  var stationData = {
    en: [
      {
        id: "migration",
        title: "The Great Journey (Migration)",
        area: "",
        lat: 46.5123,
        lng: 6.6111,
        story:
          "As you look out over the water, try to imagine the incredible journey of the house martins. Every spring, around April, these small birds arrive here in Switzerland after flying thousands of kilometers all the way from their wintering grounds in Africa. Lakeshores like this one are vital resource zones for them to rest and recover after their long flight. They spend the summer months here to build nests and raise their young. When autumn approaches in September, you might see them gathering in large numbers right here over the water, preparing to fly back south across continents and oceans to escape the cold winter.",
        mapHint: "Start near Theatre Vidy-Lausanne",
        videoUrl: ""
      },
      {
        id: "food",
        title: "The Buffet (Diet and Hunting)",
        area: "",
        lat: 46.5152,
        lng: 6.5986,
        story:
          "Take a moment to look around this park. The open green spaces, trees, and grass are filled with tiny flying insects that you might barely notice. For house martins, however, this park is the perfect buffet. These birds are insectivores, meaning they hunt and eat insects only. They do it while flying at high speeds through the air. To successfully raise just one family of chicks, a pair of swallows must catch up to 150,000 flying insects such as flies and mosquitoes, which equals to about one full kilogram of food. Thanks to their non-stop hunting in spaces like this, they help keep insect population in check, acting as a natural pest control.",
        mapHint: "Shoreline feeding corridor",
        videoUrl: "https://www.youtube.com/watch?v=ku_rMIjIFfE"
      },
      {
        id: "materials",
        title: "Gathering the Mud (Building Material)",
        area: "",
        lat: 46.519,
        lng: 6.6035,
        story:
          "Look down at the ground beneath your feet. In a park like this, especially after a rainy day, you can find puddles and patches of damp earth. This mud is exactly what house martins need. They build their dome-shaped homes entirely out of tiny pellets of wet mud and clay, which they scoop up in their beaks and stick together piece by piece. To save energy, they need to find these materials close to their nesting site, ideally within 200 meters. Unfortunately, because modern towns are increasingly paved over with asphalt and concrete, open muddy areas are disappearing. By preserving natural patches of dirt in parks, we ensure these little architects have the building blocks they need!",
        mapHint: "Inland mud-collection zone",
        videoUrl: "https://www.youtube.com/watch?v=xk_LBGByssY"
      },
      {
        id: "nest",
        title: "The Shared Roof (Coexistence and Artificial Nests)",
        area: "",
        lat: 46.5218,
        lng: 6.6095,
        story:
          "Look up under the roof of the school. Do you see the nests tucked beneath the eaves? For centuries, house martins have lived right alongside humans, sharing our constructions. However, many modern buildings have walls that are too smooth for natural mud nests to stick to. To help them, artificial nests like the ones here can be installed. To ensure that humans and birds coexist happily, a simple wooden board can be placed below the nests. It catches the birds' droppings, keeping the walls and sidewalks clean while allowing the house martins to raise their families safely right above our heads.",
        mapHint: "Final stop at Ecole De Montoie",
        videoUrl: "https://www.youtube.com/watch?v=rV5SaQk7_5I"
      }
    ],
    fr: [
      {
        id: "migration",
        title: "Le Grand Voyage (Migration)",
        area: "",
        lat: 46.5123,
        lng: 6.6111,
        story:
          "En regardant l'eau, essayez d'imaginer l'incroyable voyage des hirondelles de fenêtre. Chaque printemps, vers avril, ces petits oiseaux arrivent ici en Suisse après avoir volé des milliers de kilomètres depuis leurs quartiers d'hiver en Afrique. Les rives de lac comme celle-ci sont des zones de ressources vitales pour se reposer et récupérer après ce long vol. Elles passent les mois d'été ici pour construire leurs nids et élever leurs jeunes. Quand l'automne approche en septembre, vous pouvez les voir se rassembler en grand nombre juste au-dessus de l'eau, se préparant à repartir vers le sud à travers continents et océans pour échapper au froid de l'hiver.",
        mapHint: "Depart pres du Theatre Vidy-Lausanne",
        videoUrl: ""
      },
      {
        id: "food",
        title: "Le Buffet (Regime et Chasse)",
        area: "",
        lat: 46.5152,
        lng: 6.5986,
        story:
          "Prenez un moment pour observer ce parc. Les espaces verts ouverts, les arbres et l'herbe regorgent de minuscules insectes volants que vous remarquez à peine. Pour les hirondelles de fenêtre, pourtant, ce parc est un buffet idéal. Ces oiseaux sont insectivores, ce qui signifie qu'ils chassent et mangent uniquement des insectes. Ils le font tout en volant à grande vitesse. Pour élever une seule nichée, un couple d'hirondelles doit attraper jusqu'à 150 000 insectes volants, comme des mouches et des moustiques, soit environ un kilogramme de nourriture. Grâce à leur chasse incessante dans des espaces comme celui-ci, elles aident à réguler la population d'insectes, agissant ainsi comme un contrôle naturel des nuisibles.",
        mapHint: "Couloir d'alimentation au bord du lac",
        videoUrl: "https://www.youtube.com/watch?v=ku_rMIjIFfE"
      },
      {
        id: "materials",
        title: "Collecter la Boue (Materiaux du Nid)",
        area: "",
        lat: 46.519,
        lng: 6.6035,
        story:
          "Regardez le sol sous vos pieds. Dans un parc comme celui-ci, surtout après la pluie, vous pouvez trouver des flaques et des zones de terre humide. Cette boue est exactement ce dont les hirondelles de fenêtre ont besoin. Elles construisent leurs nids en forme de dôme entièrement avec de petites boulettes de boue et d'argile humide, qu'elles récoltent avec leur bec et assemblent pièce par pièce. Pour économiser leur énergie, elles doivent trouver ces matériaux à proximité du site de nidification, idéalement dans un rayon de 200 mètres. Malheureusement, comme les villes modernes sont de plus en plus goudronnées, les zones de boue disparaissent. En préservant des surfaces naturelles de terre dans les parcs, nous garantissons à ces petites architectes les matériaux dont ils ont besoin !",
        mapHint: "Zone de collecte de boue dans les terres",
        videoUrl: "https://www.youtube.com/watch?v=xk_LBGByssY"
      },
      {
        id: "nest",
        title: "Le Toit Partage (Coexistence et Nids Artificiels)",
        area: "",
        lat: 46.5218,
        lng: 6.6095,
        story:
          "Levez les yeux sous le toit de l'école. Voyez-vous les nids blottis sous les avant-toits ? Depuis des siècles, les hirondelles de fenêtre vivent aux côtés des humains, partageant nos constructions. Cependant, de nombreux bâtiments modernes ont des murs trop lisses pour que les nids de boue puissent y adhérer. Pour les aider, des nids artificiels comme ceux-ci peuvent être installés. Pour assurer une cohabitation harmonieuse, une simple planche en bois peut être placée sous les nids. Elle recueille les fientes, gardant les murs et les trottoirs propres tout en permettant aux hirondelles d'élever leurs familles en toute sécurité juste au-dessus de nos têtes.",
        mapHint: "Arret final a l'Ecole De Montoie",
        videoUrl: "https://www.youtube.com/watch?v=rV5SaQk7_5I"
      }
    ],
    de: [
      {
        id: "migration",
        title: "Die Grosse Reise (Migration)",
        area: "",
        lat: 46.5123,
        lng: 6.6111,
        story:
          "Wenn Sie über das Wasser blicken, stellen Sie sich die unglaubliche Reise der Mehlschwalben vor. Jeden Frühling, etwa im April, kommen diese kleinen Vögel hier in der Schweiz an, nachdem sie Tausende Kilometer aus ihren Überwinterungsgebieten in Afrika geflogen sind. Seeufer wie dieses sind für sie lebenswichtige Rastplätze, um sich nach dem langen Flug zu erholen. Sie verbringen die Sommermonate hier, bauen Nester und ziehen ihre Jungen auf. Wenn sich im September der Herbst nähert, können Sie sie oft in grossen Schwärmen direkt über dem Wasser sehen, wie sie sich auf den Rückflug nach Süden vorbereiten, um dem kalten Winter zu entkommen.",
        mapHint: "Start nahe Theatre Vidy-Lausanne",
        videoUrl: ""
      },
      {
        id: "food",
        title: "Das Buffet (Nahrung und Jagd)",
        area: "",
        lat: 46.5152,
        lng: 6.5986,
        story:
          "Nehmen Sie sich einen Moment Zeit und schauen Sie sich in diesem Park um. Die offenen Grünflächen, Bäume und Wiesen sind voller winziger Fluginsekten, die man kaum bemerkt. Für Mehlschwalben ist dieser Park jedoch das perfekte Buffet. Diese Vögel sind Insektenfresser, das heisst, sie jagen und fressen ausschliesslich Insekten. Dies tun sie im schnellen Flug. Um nur eine einzige Brut erfolgreich aufzuziehen, muss ein Schwalbenpaar bis zu 150.000 Fluginsekten wie Fliegen und Mücken fangen – das entspricht etwa einem Kilogramm Nahrung. Dank ihrer unermüdlichen Jagd in Gebieten wie diesem helfen sie dabei, die Insektenpopulation im Gleichgewicht zu halten, und wirken so als natürliche Schädlingsbekämpfer.",
        mapHint: "Futterkorridor am Ufer",
        videoUrl: "https://www.youtube.com/watch?v=ku_rMIjIFfE"
      },
      {
        id: "materials",
        title: "Lehm Sammeln (Nistmaterial)",
        area: "",
        lat: 46.519,
        lng: 6.6035,
        story:
          "Schauen Sie auf den Boden unter Ihren Füssen. In einem Park wie diesem finden Sie vor allem nach Regentagen Pfützen und feuchte Erdstellen. Dieser Schlamm ist genau das, was Mehlschwalben brauchen. Sie bauen ihre kuppelförmigen Nester vollständig aus kleinen Kügelchen aus nassem Lehm und Ton, die sie mit dem Schnabel aufnehmen und Stück für Stück zusammenfügen. Um Energie zu sparen, müssen sie diese Materialien ganz in der Nähe ihres Nistplatzes finden, idealerweise im Umkreis von 200 Metern. Da moderne Städte zunehmend versiegelt werden, verschwinden offene Schlammstellen leider immer mehr. Indem wir natürliche Erdflächen in Parks erhalten, stellen wir sicher, dass diese kleinen Architekten die nötigen Baustoffe haben!",
        mapHint: "Landeinwaertige Lehm-Sammelzone",
        videoUrl: "https://www.youtube.com/watch?v=xk_LBGByssY"
      },
      {
        id: "nest",
        title: "Das Geteilte Dach (Koexistenz und Kunstnester)",
        area: "",
        lat: 46.5218,
        lng: 6.6095,
        story:
          "Schauen Sie nach oben unter das Dach der Schule. Sehen Sie die Nester, die unter der Traufe sitzen? Seit Jahrhunderten leben Mehlschwalben direkt neben uns Menschen und nutzen unsere Bauwerke. Viele moderne Gebäude haben jedoch Wände, die zu glatt sind, als dass natürliche Lehmnester daran haften könnten. Um ihnen zu helfen, können Kunstnester wie diese hier angebracht werden. Damit Mensch und Vogel harmonisch zusammenleben, kann ein einfaches Holzbrett unter den Nestern montiert werden. Es fängt den Vogelkot auf, hält Wände und Gehwege sauber und ermöglicht es den Mehlschwalben, ihre Jungen sicher direkt über unseren Köpfen aufzuziehen.",
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
        de: "Rückkehr aus der Ferne"
      },
      caption: {
        en: "Swallows return each spring to familiar breeding areas and nesting sites.",
        fr: "Les hirondelles reviennent chaque printemps vers des zones de reproduction connues.",
        de: "Schwalben kehren jeden Frühling zu vertrauten Brutgebieten zurück."
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
        de: "Gesunde Grün- und Feuchtflächen fördern Insekten, die Schwalben im Flug fangen."
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
        fr: "Une boue argileuse proche des colonies aide a construire et reparer les nids.",
        de: "Tonreicher Lehm in der Nähe der Kolonien hilft beim Bau und der Reparatur von Nestern."
      }
    },
    nest: {
      src: "../assets/images/common-house-martin-nest.jpg",
      title: {
        en: "Shared Buildings",
        fr: "Batiments partages",
        de: "Gemeinsame Gebäude"
      },
      caption: {
        en: "Nests under roofs show why coexistence depends on building design and tolerance.",
        fr: "Les nids sous les toits montrent que la cohabitation depend du bati et de la tolerance.",
        de: "Nester unter Dächern zeigen, wie sehr Koexistenz von Bauweise und Toleranz abhängt."
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

  var map = new window.maplibregl.Map({
    container: mapNode,
    style: "https://tiles.openfreemap.org/styles/bright",
    center: [6.605, 46.517],
    zoom: 14,
    bearing: 0,
    pitch: 0
  });
  map.addControl(new window.maplibregl.NavigationControl(), "top-right");

  var markerNodes = [];
  var activeId = "";
  var TRAIL_FULL_SOURCE_ID = "trail-full-source";
  var TRAIL_FULL_LAYER_ID = "trail-full-layer";
  var TRAIL_NEXT_SOURCE_ID = "trail-next-source";
  var TRAIL_NEXT_LAYER_ID = "trail-next-layer";
  var radiusMap = null;
  var radiusCenter = hasLeaflet ? L.latLng(46.5197, 6.6323) : null;
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
    return "<strong>" + station.title + "</strong>";
  }

  function stationRouteLatLng(station) {
    return [station.lat, station.lng];
  }

  function latLngToGeoPoint(latLngPair) {
    return [latLngPair[1], latLngPair[0]];
  }

  function lineFeatureFromLatLngs(latLngList) {
    return {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: (latLngList || []).map(latLngToGeoPoint)
      },
      properties: {}
    };
  }

  function setLineSourceData(sourceId, latLngList) {
    var source = map.getSource(sourceId);
    if (!source) {
      return;
    }
    var features = [];
    if (latLngList && latLngList.length > 1) {
      features.push(lineFeatureFromLatLngs(latLngList));
    }
    source.setData({
      type: "FeatureCollection",
      features: features
    });
  }

  function initTrailLayers() {
    if (map.getSource(TRAIL_FULL_SOURCE_ID) || map.getSource(TRAIL_NEXT_SOURCE_ID)) {
      return;
    }

    map.addSource(TRAIL_FULL_SOURCE_ID, {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [lineFeatureFromLatLngs(fullTrailPath())]
      }
    });
    map.addLayer({
      id: TRAIL_FULL_LAYER_ID,
      type: "line",
      source: TRAIL_FULL_SOURCE_ID,
      paint: {
        "line-color": "#283833",
        "line-width": 5,
        "line-opacity": 0.8
      }
    });

    map.addSource(TRAIL_NEXT_SOURCE_ID, {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: []
      }
    });
    map.addLayer({
      id: TRAIL_NEXT_LAYER_ID,
      type: "line",
      source: TRAIL_NEXT_SOURCE_ID,
      paint: {
        "line-color": "#283833", //#8bc2ba for current segement highlighting 
        "line-width": 5,
        "line-opacity": 0.8
      }
    });
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
    if (!map.getSource(TRAIL_FULL_SOURCE_ID) || !map.getSource(TRAIL_NEXT_SOURCE_ID)) {
      return;
    }
    setLineSourceData(TRAIL_FULL_SOURCE_ID, fullTrailPath());

    if (!nextStation) {
      setLineSourceData(TRAIL_NEXT_SOURCE_ID, []);
      return;
    }
    setLineSourceData(TRAIL_NEXT_SOURCE_ID, segmentPathBetweenStations(currentStation, nextStation));
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

  function appendStoryBlock(text) {
    if (!storyNode || !text) {
      return;
    }

    var block = document.createElement("section");
    block.className = "trail-story-block";

    var body = document.createElement("p");
    body.textContent = text;
    block.appendChild(body);

    storyNode.appendChild(block);
  }

  function renderStory(station) {
    clearNode(storyNode);

    if (station.story) {
      appendStoryBlock(station.story);
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
      stationImageArtNode.style.backgroundRepeat = "no-repeat";
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
    if (!hasLeaflet) {
      return;
    }
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
    if (!hasLeaflet || !radiusMap) {
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
    if (!hasLeaflet || !radiusMap) {
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
    if (!hasLeaflet) {
      if (radiusGameNode) {
        radiusGameNode.setAttribute("hidden", "hidden");
      }
      return;
    }
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
    if (nextDirectionNode) {
      nextDirectionNode.textContent = "";
      nextDirectionNode.setAttribute("hidden", "hidden");
    }
    if (nextLinkNode) {
      nextLinkNode.setAttribute("hidden", "hidden");
    }
  }

  function setRadiusGameVisibility(station) {
    if (!radiusGameNode) {
      return;
    }
    if (station.order === 1) {
      radiusGameNode.removeAttribute("hidden");
      if (radiusMap) {
        window.setTimeout(function () {
          radiusMap.invalidateSize();
        }, 0);
      }
      return;
    }
    radiusGameNode.setAttribute("hidden", "hidden");
  }

  function renderStation(station) {
    var stationUrl = toAbsoluteStationUrl(station.id);

    titleNode.textContent = station.title;
    if (areaNode) {
      areaNode.textContent = "";
      areaNode.setAttribute("hidden", "hidden");
    }
    if (statusNode) {
      statusNode.textContent = "";
      statusNode.setAttribute("hidden", "hidden");
    }
    renderStory(station);
    renderStationImage(station);
    if (qrLinkNode) {
      qrLinkNode.textContent = stationUrl;
      qrLinkNode.href = stationUrl;
      qrLinkNode.setAttribute("aria-label", labels.qrPrefix + " " + station.title);
    }

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
    setRadiusGameVisibility(station);
  }

  function setActive(stationId, shouldFly) {
    activeId = stationId;
    var station = stationById[stationId];

    if (!station) {
      return;
    }

    markerNodes.forEach(function (marker) {
      var isActive = marker.stationId === stationId;
      var popup = marker.instance.getPopup();
      marker.element.classList.toggle("is-active", isActive);

      if (isActive) {
        if (popup && !popup.isOpen()) {
          marker.instance.togglePopup();
        }
      } else if (popup && popup.isOpen()) {
        marker.instance.togglePopup();
      }
    });

    renderStation(station);

    if (shouldFly) {
      map.flyTo({
        center: [station.lng, station.lat],
        zoom: Math.max(map.getZoom(), 14),
        essential: true,
        duration: 700
      });
    }

    var nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("station", station.id);
    nextUrl.hash = "station-" + station.id;
    window.history.replaceState({}, "", nextUrl.toString());
  }

  function createMarker(station) {
    var markerElement = document.createElement("button");
    markerElement.type = "button";
    markerElement.className = "trail-station-marker";
    markerElement.setAttribute("aria-label", station.title);

    var marker = new window.maplibregl.Marker({
      element: markerElement,
      anchor: "center"
    }).setLngLat([station.lng, station.lat]);

    if (ENABLE_STATION_POPUPS) {
      marker.setPopup(
        new window.maplibregl.Popup({
          closeButton: false,
          closeOnClick: false,
          offset: 14
        }).setHTML(popupHtml(station))
      );
    }

    marker.addTo(map);

    markerElement.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      setActive(station.id, true);
    });

    markerNodes.push({
      stationId: station.id,
      instance: marker,
      element: markerElement
    });
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
  map.on("load", function () {
    initTrailLayers();
    stations.forEach(function (station) {
      createMarker(station);
    });
    setActive(stationFromUrl(), true);
  });

  window.addEventListener("hashchange", function () {
    var stationId = stationFromUrl();
    if (stationId !== activeId) {
      setActive(stationId, true);
    }
  });

  window.setTimeout(function () {
    map.resize();
    if (radiusMap) {
      radiusMap.invalidateSize();
    }
  }, 0);
})();
