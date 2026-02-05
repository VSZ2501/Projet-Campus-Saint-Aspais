import "./style.css";
import React, { useState } from "react";
import logoSa from "./logo_sa.png";
import planSa from "./plan_sa.jpg";

//Modélisation du Campus
const grapheCampus = {
  S: { P: 16, T: 46 },
  P: { S: 16, D: 18, T: 40 },
  D: { P: 18, L: 12, T: 36 },
  L: { D: 12, R: 10, C: 22 },
  R: { L: 10, GYM: 30, B: 18, C: 14 },
  GYM: { R: 30, A: 20 },
  A: { GYM: 20, B: 16 },
  B: { A: 16, C: 16, R: 18 },
  C: { B: 16, R: 14, L: 22, G: 30 },
  T: { D: 36, P: 40, S: 46, Resto: 12 },
  Resto: { T: 12, G: 20 },
  G: { Resto: 20, C: 30 },
};

const nomsLieux = {
  S: "Bâtiment S (Campus)",
  P: "Bâtiment P (Esthétique)",
  D: "Bâtiment D (Lycée)",
  L: "Bâtiment L (Amphi/CDI)",
  R: "Bâtiment R (Conférence)",
  GYM: "Gymnase",
  A: "Bâtiment A (Infirmerie)",
  B: "Bâtiment B (Administration)",
  C: "Bâtiment C (Accueil)",
  T: "Terrain de Sport",
  Resto: "Restaurant",
  G: "Chapelle",
};

//Cordonnées réelles
const COORDS = {
  S: { x: 241, y: 720 },
  P: { x: 376, y: 710 },
  D: { x: 525, y: 689 },
  L: { x: 648, y: 624 },
  R: { x: 764, y: 600 },
  GYM: { x: 978, y: 578 },
  A: { x: 961, y: 486 },
  B: { x: 854, y: 488 },
  C: { x: 768, y: 418 },
  T: { x: 479, y: 284 },
  Resto: { x: 315, y: 213 },
  G: { x: 530, y: 75 },
};

//Dijkstra
export default function App() {
  const [depart, setDepart] = useState("S");
  const [arrivee, setArrivee] = useState("Resto");
  const [resultat, setResultat] = useState(null);

  const calculerItineraire = () => {
    let distances = {};
    let parents = {};
    let file = new Set(Object.keys(grapheCampus));

    for (let noeud in grapheCampus) {
      distances[noeud] = Infinity;
    }
    distances[depart] = 0;

    while (file.size > 0) {
      let actuel = [...file].reduce((min, n) =>
        distances[n] < distances[min] ? n : min
      );
      file.delete(actuel);
      if (actuel === arrivee) break;

      for (let voisin in grapheCampus[actuel]) {
        let alt = distances[actuel] + grapheCampus[actuel][voisin];
        if (alt < distances[voisin]) {
          distances[voisin] = alt;
          parents[voisin] = actuel;
        }
      }
    }

    let chemin = [];
    let etape = arrivee;
    while (etape) {
      chemin.unshift(etape);
      etape = parents[etape];
    }
    setResultat({ chemin, distanceTotal: distances[arrivee] });
  };

  return (
    <div className="app-container">
      <div className="app-card">
        <div className="header">
          <div className="title-container">
            <img src={logoSa} alt="Logo" className="logo" />
            <h1 className="title">Plan Campus St-Aspais</h1>
          </div>
          <p className="subtitle">
            Algorithme de Dijkstra - Campus Saint-Aspais
          </p>
        </div>

        {/*SÉLECTION*/}
        <div className="form-group">
          <label className="label">📍 Point de départ</label>
          <select
            value={depart}
            onChange={(e) => setDepart(e.target.value)}
            className="select-input"
          >
            {Object.keys(nomsLieux).map((k) => (
              <option key={k} value={k}>
                {nomsLieux[k]}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="label">🎯 Destination</label>
          <select
            value={arrivee}
            onChange={(e) => setArrivee(e.target.value)}
            className="select-input"
          >
            {Object.keys(nomsLieux).map((k) => (
              <option key={k} value={k}>
                {nomsLieux[k]}
              </option>
            ))}
          </select>
        </div>

        <button onClick={calculerItineraire} className="btn-primary">
          🚀 Calculer l'itinéraire
        </button>

        {/*RÉSULTATS*/}
        {resultat && (
          <div className="result-card">
            <h2 className="result-main-title">✅ Itinéraire trouvé</h2>

            <div
              className="distance-badge"
              style={{ position: "relative", marginTop: "30px" }}
            >
              📏 Distance totale : <strong>{resultat.distanceTotal} m</strong>
            </div>

            {/*DÉTAILS DU CHEMIN*/}
            <div
              className="path-section"
              style={{ position: "relative", marginTop: "30px" }}
            >
              <h3 className="section-title">📊 Détails de votre trajet</h3>
              <div
                className="path-list"
                style={{ position: "relative", marginTop: "30px" }}
              >
                {resultat.chemin.map((node, i) => {
                  const nextNode = resultat.chemin[i + 1];
                  const distEtape = nextNode
                    ? grapheCampus[node][nextNode]
                    : null;

                  return (
                    <div key={i} className="path-step-container">
                      <div className="path-item">
                        <span className="path-number">{i + 1}</span>
                        <span className="path-name">{nomsLieux[node]}</span>
                      </div>
                      {distEtape && (
                        <div className="path-segment-info">
                          <span className="path-arrow">↓</span>
                          <span className="step-distance">
                            {distEtape} mètres
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/*VISUALISATION*/}
            <div
              className="plan-section"
              style={{ position: "relative", marginTop: "30px" }}
            >
              <h3 className="section-title">🗺️ Visualisation sur le plan</h3>
              <div
                style={{
                  position: "relative",
                  marginTop: "30px",
                  width: "100%",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <img
                  src={planSa}
                  alt="Plan"
                  style={{ width: "100%", display: "block" }}
                />

                <svg
                  viewBox="0 0 1388 1088"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                  }}
                >
                  <defs>
                    <marker
                      id="arrowhead"
                      markerWidth="10"
                      markerHeight="7"
                      refX="9"
                      refY="3.5"
                      orient="auto"
                    >
                      <polygon points="0 0, 10 3.5, 0 7" fill="#ff4757" />
                    </marker>
                  </defs>

                  {/* Lignes du chemin */}
                  {resultat.chemin.map((node, i) => {
                    if (i === 0) return null;
                    const start = COORDS[resultat.chemin[i - 1]];
                    const end = COORDS[node];
                    return (
                      <line
                        key={i}
                        x1={start.x}
                        y1={start.y}
                        x2={end.x}
                        y2={end.y}
                        stroke="#ff4757"
                        strokeWidth="6"
                        strokeLinecap="round"
                        markerEnd="url(#arrowhead)"
                      />
                    );
                  })}

                  {/* Points du chemin */}
                  {resultat.chemin.map((node, i) => (
                    <circle
                      key={i}
                      cx={COORDS[node].x}
                      cy={COORDS[node].y}
                      r="15"
                      fill={
                        i === 0
                          ? "#2ed573"
                          : i === resultat.chemin.length - 1
                          ? "#3742fa"
                          : "#ff4757"
                      }
                      stroke="white"
                      strokeWidth="2"
                    />
                  ))}
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
