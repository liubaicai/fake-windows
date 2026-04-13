import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Icon } from "../../utils/general";
import {
  confirmDeleteFsItem,
  hideDialog,
  submitRenameFsItem,
} from "../../actions";
import "./dialog.scss";

const ActionButton = ({ primary, children, onClick }) => {
  return (
    <button
      className={"dialogBtn" + (primary ? " dialogBtnPrimary" : "")}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
};

export const DialogHost = () => {
  const dialog = useSelector((state) => state.dialog);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setValue(dialog.initialValue || "");
    setError("");
  }, [dialog.open, dialog.initialValue, dialog.itemId, dialog.kind]);

  if (!dialog.open) return null;

  const close = () => {
    hideDialog();
  };

  const confirm = () => {
    if (dialog.kind == "rename") {
      var result = submitRenameFsItem(dialog.itemId, value);
      if (!result?.ok) {
        setError(result?.error || "重命名失败。");
      }
      return;
    }

    if (dialog.kind == "delete") {
      confirmDeleteFsItem(dialog.itemId);
      return;
    }

    close();
  };

  return (
    <div
      className="dialogLayer"
      onClick={close}
      onKeyDown={(event) => {
        if (event.key == "Escape") {
          close();
        }
        if (event.key == "Enter" && dialog.kind == "rename") {
          confirm();
        }
      }}
      tabIndex={-1}
    >
      <div
        className="dialogPanel"
        data-kind={dialog.kind}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="dialogHead">
          <div className="dialogTitle">{dialog.title}</div>
          <div className="dialogClose hvdark" onClick={close}>
            <Icon src="close" ui width={12} />
          </div>
        </div>
        <div className="dialogBody">
          {(dialog.icon || dialog.name) && (
            <div className="dialogIconRow">
              {dialog.icon ? <Icon src={`win/${dialog.icon}`} width={30} /> : null}
              <div className="dialogFileName">{dialog.name}</div>
            </div>
          )}

          {dialog.message ? <div className="dialogText">{dialog.message}</div> : null}

          {dialog.kind == "rename" ? (
            <div className="dialogInputWrap">
              <input
                autoFocus
                className="dialogInput"
                value={value}
                onChange={(event) => {
                  setValue(event.target.value);
                  if (error) setError("");
                }}
              />
              {error ? <div className="dialogError">{error}</div> : null}
            </div>
          ) : null}

          {dialog.kind == "properties" ? (
            <div className="dialogProps">
              {dialog.details.map((row, index) => {
                return (
                  <React.Fragment key={index}>
                    <div className="dialogPropLabel">{row.label}</div>
                    <div className="dialogPropValue">{row.value}</div>
                  </React.Fragment>
                );
              })}
            </div>
          ) : null}

          {dialog.metaText ? <div className="dialogMeta">{dialog.metaText}</div> : null}

          <div className="dialogActions">
            {dialog.cancelText ? (
              <ActionButton onClick={close}>{dialog.cancelText}</ActionButton>
            ) : null}
            <ActionButton
              primary={dialog.kind == "rename" || dialog.kind == "delete"}
              onClick={confirm}
            >
              {dialog.confirmText || "确定"}
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DialogHost;