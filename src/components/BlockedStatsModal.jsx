import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CloseIcon, ShieldBlockIcon } from "./Icons";

/**
 * Modal showing which ad/tracker domains were blocked during the current session
 * and the all-time total blocked count.
 */
export default function BlockedStatsModal({
  sessionDomains,
  sessionTotal,
  alltimeTotal,
  onClose,
}) {
  const { t } = useTranslation();

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="blocked-modal-overlay" onClick={onClose}>
      <div className="blocked-modal" onClick={(e) => e.stopPropagation()}>
        <div className="blocked-modal-header">
          <div className="blocked-modal-title">
            <ShieldBlockIcon size={15} />
            {t("blocked.title")}
          </div>
          <button
            className="blocked-modal-close"
            onClick={onClose}
            title="Close"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="blocked-modal-subtitle">
          {sessionTotal > 0
            ? t("blocked.thisSession", { count: sessionTotal, s: sessionTotal === 1 ? "" : "s" })
            : t("blocked.startPlaying")}
        </div>

        <div className="blocked-modal-list">
          {sessionDomains.length === 0 ? (
            <div className="blocked-modal-empty">
              {t("blocked.noneYet")}
            </div>
          ) : (
            sessionDomains.map(([domain, count]) => (
              <div key={domain} className="blocked-modal-row">
                <span className="blocked-modal-domain">{domain}</span>
                <span className="blocked-modal-count">
                  {count.toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="blocked-modal-footer">
          <ShieldBlockIcon size={13} />
          {t("blocked.allTime")}&nbsp;
          <strong>
            {t("blocked.allTimeCount", {
              count: alltimeTotal.toLocaleString(),
              s: alltimeTotal === 1 ? "" : "s",
            })}
          </strong>
        </div>
      </div>
    </div>
  );
}
