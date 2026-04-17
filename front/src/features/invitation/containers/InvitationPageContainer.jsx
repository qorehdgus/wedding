import { useEffect, useMemo, useRef, useState } from "react";
import "ol/ol.css";
import Feature from "ol/Feature.js";
import Map from "ol/Map.js";
import View from "ol/View.js";
import Point from "ol/geom/Point.js";
import TileLayer from "ol/layer/Tile.js";
import VectorLayer from "ol/layer/Vector.js";
import XYZ from "ol/source/XYZ.js";
import Cluster from "ol/source/Cluster.js";
import VectorSource from "ol/source/Vector.js";
import { fromLonLat } from "ol/proj.js";
import { boundingExtent } from "ol/extent.js";
import CircleStyle from "ol/style/Circle.js";
import Fill from "ol/style/Fill.js";
import Icon from "ol/style/Icon.js";
import Stroke from "ol/style/Stroke.js";
import Style from "ol/style/Style.js";
import Text from "ol/style/Text.js";
import InvitationPageView from "../components/InvitationPageView";
import { vworldApiKey } from "../config";
import { FILTER_CHIPS } from "../constants";
import venuesData from "../data/venues.json";

const koreaCenter3857 = fromLonLat([127.8, 36.3]);
const PAGE_SIZE = 5;

function createPriceBadgeDataUrl(price, isSelected) {
  const backgroundColor = isSelected ? "#ef5c87" : "#ffffff";
  const textColor = isSelected ? "#ffffff" : "#111111";
  const strokeColor = isSelected ? "#ef5c87" : "#e5e5e5";
  const lineStrokeColor = isSelected ? "#ef5c87" : "#ffffff";
  const width = 92;
  const height = 42;
  const tailHeight = 9;
  const radius = 12;
  const midX = width / 2;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect x="1" y="1" width="${width - 2}" height="${height - tailHeight - 2}" rx="${radius}" ry="${radius}" fill="${backgroundColor}" stroke="${strokeColor}" stroke-width="2" />
      <path d="M ${midX - 7} ${height - tailHeight - 1} L ${midX} ${height - 1} L ${midX + 7} ${height - tailHeight - 1} Z" fill="${backgroundColor}" />
      <path d="M ${midX - 7} ${height - tailHeight - 1} L ${midX + 7} ${height - tailHeight - 1}" fill="none" stroke="${lineStrokeColor}" stroke-width="2" stroke-linecap="round" />
      <path d="M ${midX - 7} ${height - tailHeight - 1} L ${midX} ${height - 1} L ${midX + 7} ${height - tailHeight - 1}" fill="none" stroke="${strokeColor}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
      <text x="50%" y="16" text-anchor="middle" dominant-baseline="middle" font-family="Segoe UI, sans-serif" font-size="${isSelected ? 13 : 12}" font-weight="700" fill="${textColor}">${price}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function createClusterStyle(feature, selectedVenueId) {
  const features = feature.get("features") ?? [];

  if (features.length > 1) {
    return new Style({
      image: new CircleStyle({
        radius: 22,
        fill: new Fill({ color: "#ef5c87" }),
        stroke: new Stroke({ color: "#ffffff", width: 3 })
      }),
      text: new Text({
        text: String(features.length),
        fill: new Fill({ color: "#ffffff" }),
        font: "700 13px Segoe UI"
      })
    });
  }

  const item = features[0];
  const price = item?.get("price") ?? "";
  const isSelected = item?.get("id") === selectedVenueId;

  return [
    new Style({
      image: new CircleStyle({
        radius: isSelected ? 7 : 6,
        fill: new Fill({ color: isSelected ? "#b92d63" : "#ffffff" }),
        stroke: new Stroke({ color: isSelected ? "#ffffff" : "#ef5c87", width: 2.5 })
      }),
      zIndex: 40
    }),
    new Style({
      image: new Icon({
        src: createPriceBadgeDataUrl(price, isSelected),
        anchor: [0.5, 1],
        anchorXUnits: "fraction",
        anchorYUnits: "fraction",
        displacement: [0, 5]
      }),
      zIndex: isSelected ? 30 : 20
    })
  ];
}

function InvitationPageContainer() {
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVenueId, setSelectedVenueId] = useState(venuesData[0]?.id ?? null);
  const mapElementRef = useRef(null);
  const mapRef = useRef(null);
  const clusterLayerRef = useRef(null);
  const featureByIdRef = useRef(new globalThis.Map());
  const selectedVenueIdRef = useRef(selectedVenueId);

  const totalPages = Math.max(1, Math.ceil(venuesData.length / PAGE_SIZE));
  const pagedVenues = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return venuesData.slice(start, start + PAGE_SIZE);
  }, [currentPage]);

  useEffect(() => {
    if (!mapElementRef.current || mapRef.current || !vworldApiKey) {
      return undefined;
    }

    const venueFeatures = venuesData.map((item) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat(item.coordinates))
      });

      feature.set("id", item.id);
      feature.set("name", item.name);
      feature.set("price", item.price);
      featureByIdRef.current.set(item.id, feature);
      return feature;
    });

    const venueSource = new VectorSource({
      features: venueFeatures
    });

    const clusterSource = new Cluster({
      distance: 45,
      minDistance: 20,
      source: venueSource
    });

    const clusterLayer = new VectorLayer({
      source: clusterSource,
      style: (feature) => createClusterStyle(feature, selectedVenueIdRef.current)
    });

    const map = new Map({
      target: mapElementRef.current,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: `https://api.vworld.kr/req/wmts/1.0.0/${vworldApiKey}/Base/{z}/{y}/{x}.png`,
            crossOrigin: "anonymous",
            attributions: '(c) <a href="https://www.vworld.kr/" target="_blank" rel="noreferrer">VWorld</a>'
          })
        }),
        clusterLayer
      ],
      view: new View({
        projection: "EPSG:3857",
        center: koreaCenter3857,
        zoom: 8,
        minZoom: 7,
        maxZoom: 19,
        constrainResolution: true,
        smoothResolutionConstraint: false
      }),
      controls: []
    });

    mapRef.current = map;
    clusterLayerRef.current = clusterLayer;
    setZoomLevel(Math.round(map.getView().getZoom() ?? 8));

    const handleResolutionChange = () => {
      setZoomLevel(Math.round(map.getView().getZoom() ?? 8));
    };

    const handleMapClick = (event) => {
      const clickedFeature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature);

      if (!clickedFeature) {
        return;
      }

      const features = clickedFeature.get("features") ?? [];
      if (features.length > 1) {
        const coordinates = features
          .map((item) => item.getGeometry()?.getCoordinates())
          .filter(Boolean);

        if (coordinates.length > 0) {
          map.getView().fit(boundingExtent(coordinates), {
            padding: [80, 80, 80, 80],
            duration: 350,
            maxZoom: 16
          });
        }
        return;
      }

      if (features.length !== 1) {
        return;
      }

      const selectedId = features[0].get("id");
      if (!selectedId) {
        return;
      }

      setSelectedVenueId(selectedId);
      const index = venuesData.findIndex((item) => item.id === selectedId);
      if (index >= 0) {
        setCurrentPage(Math.floor(index / PAGE_SIZE) + 1);
      }
    };

    const handlePointerMove = (event) => {
      if (event.dragging) {
        return;
      }

      const hit = map.hasFeatureAtPixel(event.pixel);
      map.getTargetElement().style.cursor = hit ? "pointer" : "";
    };

    map.getView().on("change:resolution", handleResolutionChange);
    map.on("singleclick", handleMapClick);
    map.on("pointermove", handlePointerMove);

    return () => {
      map.getView().un("change:resolution", handleResolutionChange);
      map.un("singleclick", handleMapClick);
      map.un("pointermove", handlePointerMove);
      map.setTarget(undefined);
      mapRef.current = null;
      clusterLayerRef.current = null;
      featureByIdRef.current.clear();
    };
  }, []);

  useEffect(() => {
    selectedVenueIdRef.current = selectedVenueId;
    clusterLayerRef.current?.changed();
  }, [selectedVenueId]);

  const handleTogglePanel = () => {
    setIsPanelOpen((current) => !current);
  };

  const handleZoomIn = () => {
    const view = mapRef.current?.getView();
    if (!view) {
      return;
    }

    view.animate({ zoom: (view.getZoom() ?? 8) + 1, duration: 200 });
  };

  const handleZoomOut = () => {
    const view = mapRef.current?.getView();
    if (!view) {
      return;
    }

    view.animate({ zoom: (view.getZoom() ?? 8) - 1, duration: 200 });
  };

  const handleResetMapView = () => {
    const view = mapRef.current?.getView();
    if (!view) {
      return;
    }

    view.animate({
      center: koreaCenter3857,
      zoom: 8,
      duration: 350
    });
  };

  const handleGoToPrevPage = () => {
    setCurrentPage((page) => Math.max(1, page - 1));
  };

  const handleGoToNextPage = () => {
    setCurrentPage((page) => Math.min(totalPages, page + 1));
  };

  const handleSelectVenue = (venueId) => {
    setSelectedVenueId(venueId);

    const index = venuesData.findIndex((item) => item.id === venueId);
    if (index >= 0) {
      setCurrentPage(Math.floor(index / PAGE_SIZE) + 1);
    }

    const feature = featureByIdRef.current.get(venueId);
    const geometry = feature?.getGeometry();
    const center = geometry?.getCoordinates();

    if (center && mapRef.current) {
      mapRef.current.getView().animate({
        center,
        duration: 350,
        zoom: 18
      });
    }
  };

  const handleOpenVenueDetail = (venueId) => {
    const popupUrl = `/popup?venueId=${encodeURIComponent(venueId)}`;
    window.open(
      popupUrl,
      `venue-detail-${venueId}`,
      "width=1100,height=840,resizable=yes,scrollbars=yes"
    );
  };

  return (
    <InvitationPageView
      currentPage={currentPage}
      filterChips={FILTER_CHIPS}
      isPanelOpen={isPanelOpen}
      mapElementRef={mapElementRef}
      onGoToNextPage={handleGoToNextPage}
      onGoToPrevPage={handleGoToPrevPage}
      onOpenVenueDetail={handleOpenVenueDetail}
      onSelectVenue={handleSelectVenue}
      onTogglePanel={handleTogglePanel}
      onZoomIn={handleZoomIn}
      onZoomOut={handleZoomOut}
      onResetMapView={handleResetMapView}
      selectedVenueId={selectedVenueId}
      totalPages={totalPages}
      venues={pagedVenues}
      vworldApiKey={vworldApiKey}
      zoomLevel={zoomLevel}
    />
  );
}

export default InvitationPageContainer;
