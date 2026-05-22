import { useTranslation } from "react-i18next";
import { DownloadIcon } from "./Icons";

export default function CloseConfirmModal({ count, onConfirm, onCancel }) {
  const { t } = useTranslation();

  return (
    <div className="close-confirm-overlay">
      <div className="close-confirm-modal">
        <div className="close-confirm-icon-wrap">
          <div className="close-confirm-icon-ring">
            <DownloadIcon />
          </div>
        </div>

        <div className="close-confirm-title">
          {t("closeConfirm.title", { s: count > 1 ? "s" : "" })}
        </div>

        <div className="close-confirm-body">
          <span className="close-confirm-count">
            {t("closeConfirm.body", { count, s: count > 1 ? "s" : "" })}
          </span>
        </div>

        <div className="close-confirm-actions">
          <button className="btn close-confirm-btn-cancel" onClick={onCancel}>
            {t("closeConfirm.keepDownloading")}
          </button>
          <button className="btn close-confirm-btn-confirm" onClick={onConfirm}>
            {t("closeConfirm.cancelClose")}
          </button>
        </div>
      </div>
    </div>
  );
}
