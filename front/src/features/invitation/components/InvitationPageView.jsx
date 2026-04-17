function parseRatingParts(rating) {
  const [score = "", reviews = ""] = rating.split("·").map((item) => item.trim());
  const reviewCount = reviews.replace("후기", "").replace("개", "").trim();
  return {
    score,
    reviewCount
  };
}

function renderRatingStars(score) {
  const numericScore = Number.parseFloat(score) || 0;

  return Array.from({ length: 5 }, (_, index) => (
    <span key={`star-${index}`} className="venue-card-rating-star" aria-hidden="true">
      <span className="venue-card-rating-star-base">★</span>
      <span
        className="venue-card-rating-star-fill"
        style={{
          width: `${Math.max(0, Math.min(1, numericScore - index)) * 100}%`
        }}
      >
        ★
      </span>
    </span>
  ));
}

function InvitationPageView({
  currentPage,
  filterChips,
  isPanelOpen,
  mapElementRef,
  onGoToNextPage,
  onGoToPrevPage,
  onOpenVenueDetail,
  onSelectVenue,
  onTogglePanel,
  onZoomIn,
  onZoomOut,
  onResetMapView,
  selectedVenueId,
  totalPages,
  venues,
  vworldApiKey,
  zoomLevel
}) {
  return (
    <section className="venue-page">
      <div className="venue-toolbar">
        <div className="venue-brand">웨딩체크</div>
        <div className="venue-search">
          <input type="text" placeholder="지역 또는 예식장명을 검색하세요..." />
          <button type="button">검색</button>
        </div>
        <div className="venue-links">
          <span>웨딩홀</span>
          <span>스튜디오</span>
          <span>드레스</span>
          <span>허니문</span>
          <span className="venue-links-accent">가격 공개</span>
        </div>
      </div>

      <div className="venue-chip-row">
        {filterChips.map((chip, index) => (
          <button
            key={chip}
            type="button"
            className={index === 0 ? "venue-chip venue-chip-active" : "venue-chip"}
          >
            {chip}
          </button>
        ))}
      </div>

      <div className={isPanelOpen ? "venue-content" : "venue-content venue-content-collapsed"}>
        <div className="venue-map-panel">
          <div className="venue-map-canvas">
            <div ref={mapElementRef} className="venue-map-layer" />

            {!vworldApiKey ? (
              <div className="venue-map-openlayers">
                <span>브이월드 API 키가 없습니다</span>
                <small>현재 환경 파일에 `VITE_VWORLD_API_KEY`를 설정해 주세요</small>
              </div>
            ) : null}

            <div className={isPanelOpen ? "venue-map-zoom venue-map-zoom-shifted" : "venue-map-zoom"}>
              <div className="venue-map-zoom-level">{zoomLevel}</div>
              <button type="button" aria-label="확대" onClick={onZoomIn}>
                +
              </button>
              <button type="button" aria-label="축소" onClick={onZoomOut}>
                -
              </button>
              <button type="button" aria-label="초기 위치로 이동" onClick={onResetMapView}>
                ↻
              </button>
            </div>

            <button type="button" className="venue-map-floating">
              현재 지도 기준 재검색
            </button>

            <div className="venue-map-legend">
              <span className="venue-map-dot venue-map-dot-active" />
              선택된 업체
              <span className="venue-map-dot" />
              일반 업체
            </div>
          </div>
        </div>

        <button
          type="button"
          className={isPanelOpen ? "venue-side-handle" : "venue-side-handle venue-side-handle-closed"}
          onClick={onTogglePanel}
          aria-label={isPanelOpen ? "상세 닫기" : "상세 펼치기"}
        >
          {isPanelOpen ? "<" : ">"}
        </button>

        <aside className={isPanelOpen ? "venue-side-panel" : "venue-side-panel venue-side-panel-hidden"}>
          <div className="venue-side-header">
            <div>
              <p className="venue-side-eyebrow">서울 전체 웨딩홀 실시간 가격 데이터를 확인해 보세요</p>
              <h2>계약가 낮은순</h2>
            </div>
          </div>

          <div className="venue-list">
            {venues.map((venue) => (
              (() => {
                const { score, reviewCount } = parseRatingParts(venue.rating);

                return (
                  <article
                    key={venue.id}
                    className={
                      venue.id === selectedVenueId
                        ? "venue-card venue-card-button venue-card-selected"
                        : "venue-card venue-card-button"
                    }
                    role="button"
                    tabIndex={0}
                    onClick={() => onSelectVenue(venue.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onSelectVenue(venue.id);
                      }
                    }}
                  >
                    <div className="venue-card-head">
                      <div>
                        <h3>{venue.name}</h3>
                        {venue.badge ? <span className="venue-card-badge">{venue.badge}</span> : null}
                      </div>
                      <div className="venue-card-price-block">
                        <strong>{venue.price}</strong>
                        <button
                          type="button"
                          className="venue-card-detail-button"
                          onClick={(event) => {
                            event.stopPropagation();
                            onOpenVenueDetail(venue.id);
                          }}
                        >
                          상세정보 조회
                        </button>
                      </div>
                    </div>
                    <p>{venue.meta}</p>
                    <div className="venue-card-rating">
                      <span className="venue-card-rating-stars">{renderRatingStars(score)}</span>
                      <span className="venue-card-rating-score">{score}</span>
                      <span className="venue-card-rating-divider">·</span>
                      <span className="venue-card-rating-count">{reviewCount}건</span>
                    </div>
                    <div className="venue-card-tags">
                      {venue.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </article>
                );
              })()
            ))}
          </div>

          <div className="venue-pagination">
            <button type="button" onClick={onGoToPrevPage} disabled={currentPage === 1}>
              이전
            </button>
            <span>
              {currentPage} / {totalPages}
            </span>
            <button type="button" onClick={onGoToNextPage} disabled={currentPage === totalPages}>
              다음
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default InvitationPageView;
