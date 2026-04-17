import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import venuesData from "../features/invitation/data/venues.json";

const chartSeries = [
  { month: "11월", amount: 3200 },
  { month: "12월", amount: 3400 },
  { month: "1월", amount: 3350 },
  { month: "2월", amount: 3600 },
  { month: "3월", amount: 3480 },
  { month: "4월", amount: 3720 }
];

const photoSamples = [
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80"
];

function PopupPage() {
  const [searchParams] = useSearchParams();
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const venueId = searchParams.get("venueId");

  const venue = useMemo(
    () => venuesData.find((item) => item.id === venueId) ?? venuesData[0],
    [venueId]
  );

  const maxAmount = Math.max(...chartSeries.map((item) => item.amount));

  const handlePrevPhoto = () => {
    setCurrentPhotoIndex((current) => (current === 0 ? photoSamples.length - 1 : current - 1));
  };

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((current) => (current === photoSamples.length - 1 ? 0 : current + 1));
  };

  return (
    <main className="popup-page">
      <section className="popup-shell">
        <header className="popup-header">
          <div>
            <p className="popup-eyebrow">상세정보 조회</p>
            <h1>{venue.name}</h1>
            <p className="popup-subtitle">
              {venue.meta} · {venue.price}
            </p>
          </div>
          <div className="popup-score-card">
            <span>{venue.rating}</span>
            <strong>{venue.badge || "상담 가능"}</strong>
          </div>
        </header>

        <section className="popup-grid">
          <article className="popup-panel">
            <div className="popup-panel-head">
              <h2>최근 6개월 실계약 정보</h2>
              <span>실계약 평균가 기준</span>
            </div>
            <div className="popup-chart">
              {chartSeries.map((item) => (
                <div key={item.month} className="popup-chart-item">
                  <span className="popup-chart-value">{item.amount.toLocaleString()}만</span>
                  <div className="popup-chart-bar-wrap">
                    <div
                      className="popup-chart-bar"
                      style={{ height: `${(item.amount / maxAmount) * 100}%` }}
                    />
                  </div>
                  <span className="popup-chart-label">{item.month}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="popup-panel">
            <div className="popup-panel-head">
              <h2>웨딩홀 사진</h2>
              <span>샘플 이미지 3장</span>
            </div>
            <div className="popup-gallery-slider">
              <button type="button" className="popup-gallery-nav" onClick={handlePrevPhoto} aria-label="이전 사진">
                ‹
              </button>
              <div className="popup-gallery-viewport">
                <div
                  className="popup-gallery-track"
                  style={{ transform: `translateX(-${currentPhotoIndex * 100}%)` }}
                >
                  {photoSamples.map((src, index) => (
                    <figure key={src} className="popup-photo-card">
                      <img src={src} alt={`${venue.name} 샘플 이미지 ${index + 1}`} />
                    </figure>
                  ))}
                </div>
              </div>
              <button type="button" className="popup-gallery-nav" onClick={handleNextPhoto} aria-label="다음 사진">
                ›
              </button>
            </div>
            <div className="popup-gallery-dots">
              {photoSamples.map((src, index) => (
                <button
                  key={src}
                  type="button"
                  className={index === currentPhotoIndex ? "popup-gallery-dot popup-gallery-dot-active" : "popup-gallery-dot"}
                  onClick={() => setCurrentPhotoIndex(index)}
                  aria-label={`${index + 1}번 사진 보기`}
                />
              ))}
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}

export default PopupPage;
