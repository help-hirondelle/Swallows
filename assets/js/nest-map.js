(function () {
  var root = document.querySelector("[data-nest-map-root]");
  if (!root) {
    return;
  }

  if (!window.L) {
    return;
  }

  var mapNode = root.querySelector("[data-nest-map-canvas]");
  var titleNode = root.querySelector("[data-site-title]");
  var areaNode = root.querySelector("[data-site-area]");
  var statusNode = root.querySelector("[data-site-status]");
  var detailNests = root.querySelector("[data-site-nests]");
  var detailIssue = root.querySelector("[data-site-issue]");
  var detailAction = root.querySelector("[data-site-action]");
  var detailNote = root.querySelector("[data-site-note]");

  if (!mapNode || !titleNode || !areaNode || !statusNode || !detailNests || !detailIssue || !detailAction || !detailNote) {
    return;
  }

  var sites = [
    {
      id: "ouchy-quay",
      name: "Ouchy Quay Apartments",
      area: "Ouchy waterfront, Lausanne",
      status: "Active colony",
      nests: "Estimated 11 nests",
      issue: "Droppings on pedestrian route below roofline",
      action: "Droppings boards + monthly cleaning plan",
      note: "Invented demo site for map prototype.",
      lat: 46.5053,
      lng: 6.6296
    },
    {
      id: "vidy-sports",
      name: "Vidy Sports Hall",
      area: "Vidy district, Lausanne",
      status: "Mixed occupancy",
      nests: "Estimated 7 nests",
      issue: "Smooth renovated facade reduced attachment points",
      action: "Add artificial nests on roughened support plates",
      note: "Invented demo site for map prototype.",
      lat: 46.5207,
      lng: 6.5956
    },
    {
      id: "flon-block",
      name: "Flon Retrofit Block",
      area: "Flon / central Lausanne",
      status: "Re-colonization attempt",
      nests: "Estimated 4 nests",
      issue: "Frequent nest starts then fall-off from smooth surfaces",
      action: "Facade roughness treatment + sheltered mounting zones",
      note: "Invented demo site for map prototype.",
      lat: 46.5222,
      lng: 6.6268
    },
    {
      id: "sallaz-corridor",
      name: "La Sallaz Tram Corridor",
      area: "La Sallaz, Lausanne",
      status: "Emerging site",
      nests: "Estimated 5 nests",
      issue: "Resident complaints concentrated near entry canopies",
      action: "Targeted droppings shelves and tenant communication",
      note: "Invented demo site for map prototype.",
      lat: 46.5377,
      lng: 6.6532
    },
    {
      id: "chailly-school",
      name: "Chailly School Annex",
      area: "Chailly, Lausanne",
      status: "Small stable cluster",
      nests: "Estimated 6 nests",
      issue: "Low mud access nearby during early nesting",
      action: "Seasonal controlled mud tray near courtyard edge",
      note: "Invented demo site for map prototype.",
      lat: 46.5301,
      lng: 6.6619
    },
    {
      id: "renens-east",
      name: "Renens-East Cooperative",
      area: "Renens border zone",
      status: "Potential expansion",
      nests: "Estimated 3 nests",
      issue: "New overhang-free facades reduce nesting options",
      action: "Add sheltered artificial nests near existing points",
      note: "Invented demo site for map prototype.",
      lat: 46.5373,
      lng: 6.5845
    },
    {
      id: "prilly-slope",
      name: "Prilly Slope Housing",
      area: "Prilly / Lausanne edge",
      status: "Declining",
      nests: "Estimated 2 nests",
      issue: "Anti-nesting spikes installed on former colony facade",
      action: "Pilot redesign with designated nesting strip",
      note: "Invented demo site for map prototype.",
      lat: 46.5364,
      lng: 6.6031
    },
    {
      id: "pully-ridge",
      name: "Pully Ridge Residences",
      area: "Pully near Lausanne",
      status: "Intermittent occupancy",
      nests: "Estimated 4 nests",
      issue: "Nearby dense vegetation may increase predator pressure",
      action: "Reposition future nests to more open urban exposure",
      note: "Invented demo site for map prototype.",
      lat: 46.5108,
      lng: 6.6692
    }
  ];

  var map = L.map(mapNode, {
    scrollWheelZoom: true
  }).setView([46.5197, 6.6323], 12);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  var markerNodes = [];
  var activeId = "";

  function popupHtml(site) {
    return (
      "<strong>" +
      site.name +
      "</strong><br />" +
      site.area +
      "<br />" +
      site.nests +
      "<br />" +
      site.status
    );
  }

  function renderSite(site) {
    titleNode.textContent = site.name;
    areaNode.textContent = site.area;
    statusNode.textContent = site.status;
    detailNests.textContent = site.nests;
    detailIssue.textContent = site.issue;
    detailAction.textContent = site.action;
    detailNote.textContent = site.note;
  }

  function setActive(siteId) {
    activeId = siteId;
    var activeSite = sites.find(function (site) {
      return site.id === siteId;
    });

    if (!activeSite) {
      return;
    }

    markerNodes.forEach(function (marker) {
      var isActive = marker.siteId === siteId;
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

    renderSite(activeSite);
    map.flyTo([activeSite.lat, activeSite.lng], Math.max(map.getZoom(), 13), {
      animate: true,
      duration: 0.75
    });
  }

  function createMarker(site) {
    var marker = L.circleMarker([site.lat, site.lng], {
      radius: 8,
      color: "#ffffff",
      weight: 2,
      fillColor: "#2d6f4b",
      fillOpacity: 0.95
    }).addTo(map);

    marker.siteId = site.id;
    marker.bindPopup(popupHtml(site), {
      closeButton: false,
      offset: [0, -8]
    });

    marker.on("click", function () {
      setActive(site.id);
    });

    markerNodes.push(marker);
  }

  sites.forEach(function (site) {
    createMarker(site);
  });

  setActive(sites[0].id);
  window.setTimeout(function () {
    map.invalidateSize();
  }, 0);
})();
