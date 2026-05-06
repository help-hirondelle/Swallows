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
      noNextDirection: "You reached the final station at the primary school in Lausanne.",
      directionIntro: "Walk",
      towardsWord: "towards",
      nextWord: "Next"
    },
    fr: {
      progress: "Etape",
      of: "sur",
      thisIsLast: "Derniere etape atteinte.",
      directionsLabel: "Itineraire a pied",
      qrPrefix: "Destination QR:",
      noNextDirection: "Vous etes a la derniere station a l'ecole primaire de Lausanne.",
      directionIntro: "Marchez",
      towardsWord: "vers",
      nextWord: "Suivante"
    },
    de: {
      progress: "Station",
      of: "von",
      thisIsLast: "Letzte Station erreicht.",
      directionsLabel: "Gehroute oeffnen",
      qrPrefix: "QR-Ziel:",
      noNextDirection: "Sie sind an der letzten Station bei der Primarschule in Lausanne angekommen.",
      directionIntro: "Gehen Sie",
      towardsWord: "Richtung",
      nextWord: "Naechste"
    }
  };

  var stationData = {
    en: [
      {
        id: "migration",
        title: "Migration",
        area: "Lacustre Promenade, Ouchy (Lausanne)",
        lat: 46.5072,
        lng: 6.6247,
        story:
          "Swallows seem to draw invisible lines over the lake and rooftops. At this stop, imagine each pass as a tiny map update: routes are negotiated in real time with wind, weather, and city geometry.",
        mapHint: "Lakeside start point"
      },
      {
        id: "food",
        title: "Food",
        area: "Parc de Milan area, Lausanne",
        lat: 46.5196,
        lng: 6.6228,
        story:
          "This area acts like an open-air buffet in warm weather. Insects cluster in sun pockets, and swallows adapt quickly, changing flight height and speed as food density shifts minute by minute.",
        mapHint: "Urban park feeding zone"
      },
      {
        id: "materials",
        title: "Finding Building Materials",
        area: "La Sallaz slope, Lausanne",
        lat: 46.5369,
        lng: 6.6478,
        story:
          "Nest architecture starts at ground level: mud texture, moisture, and fibers all matter. This station highlights how a few meters of suitable material can influence where a colony settles.",
        mapHint: "Material gathering point"
      },
      {
        id: "nest",
        title: "The Nest",
        area: "Primary School of Villamont, Lausanne",
        lat: 46.5232,
        lng: 6.6393,
        story:
          "Final stop: a shared school environment where people and birds overlap daily. The nest is not just a structure, it is a negotiation between safety, routine, noise, shelter, and coexistence.",
        mapHint: "Primary school destination"
      }
    ],
    fr: [
      {
        id: "migration",
        title: "Migration",
        area: "Promenade lacustre, Ouchy (Lausanne)",
        lat: 46.5072,
        lng: 6.6247,
        story:
          "Les hirondelles semblent tracer des lignes invisibles au-dessus du lac. Ici, chaque passage raconte une adaptation instantanee au vent, a la meteo et a la forme de la ville.",
        mapHint: "Depart au bord du lac"
      },
      {
        id: "food",
        title: "Food",
        area: "Zone du parc de Milan, Lausanne",
        lat: 46.5196,
        lng: 6.6228,
        story:
          "Par temps doux, ce secteur devient un veritable garde-manger aerien. Les insectes se concentrent par zones et les hirondelles modifient rapidement altitude et vitesse.",
        mapHint: "Zone d'alimentation"
      },
      {
        id: "materials",
        title: "Finding Building Materials",
        area: "Pente de la Sallaz, Lausanne",
        lat: 46.5369,
        lng: 6.6478,
        story:
          "La construction du nid commence au sol: humidite, texture de la boue et fibres disponibles. Quelques metres de bon materiau peuvent orienter toute une installation.",
        mapHint: "Point de collecte"
      },
      {
        id: "nest",
        title: "The Nest",
        area: "Ecole primaire de Villamont, Lausanne",
        lat: 46.5232,
        lng: 6.6393,
        story:
          "Station finale: un espace scolaire partage avec les oiseaux. Le nid devient un point d'equilibre entre refuge, activite humaine quotidienne et cohabitation.",
        mapHint: "Destination ecole primaire"
      }
    ],
    de: [
      {
        id: "migration",
        title: "Migration",
        area: "Uferpromenade Ouchy (Lausanne)",
        lat: 46.5072,
        lng: 6.6247,
        story:
          "Schwalben ziehen ueber See und Daecher wie entlang unsichtbarer Linien. Jede Flugbahn ist eine spontane Anpassung an Wind, Wetter und die Form des Stadtraums.",
        mapHint: "Start am See"
      },
      {
        id: "food",
        title: "Food",
        area: "Parc de Milan, Lausanne",
        lat: 46.5196,
        lng: 6.6228,
        story:
          "Bei warmem Wetter wird dieser Bereich zur Luft-Nahrungszone. Insekten sammeln sich punktuell, und Schwalben reagieren sofort mit Hoehe, Tempo und Flugroute.",
        mapHint: "Nahrungsstation"
      },
      {
        id: "materials",
        title: "Finding Building Materials",
        area: "La-Sallaz-Hang, Lausanne",
        lat: 46.5369,
        lng: 6.6478,
        story:
          "Nestbau beginnt am Boden: Feuchtigkeit, Schlammstruktur und Fasern entscheiden viel. Schon kleine geeignete Flaechen koennen die Wahl eines Nistplatzes praegen.",
        mapHint: "Materialstation"
      },
      {
        id: "nest",
        title: "The Nest",
        area: "Primarschule Villamont, Lausanne",
        lat: 46.5232,
        lng: 6.6393,
        story:
          "Letzte Station: ein geteilter Schulraum, in dem Alltag und Brutplatz zusammenkommen. Das Nest steht hier fuer Schutz, Anpassung und gelebte Koexistenz.",
        mapHint: "Ziel Primarschule"
      }
    ]
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
  }).setView([46.5197, 6.6323], 13);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  var markerNodes = [];
  var activeId = "";
  var routeLine = null;

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
    storyNode.textContent = station.story;
    qrLinkNode.textContent = stationUrl;
    qrLinkNode.href = stationUrl;
    qrLinkNode.setAttribute("aria-label", labels.qrPrefix + " " + station.title);
    stationVideoNode.title = station.title;

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
  }, 0);
})();
