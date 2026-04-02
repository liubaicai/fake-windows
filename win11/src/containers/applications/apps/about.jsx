import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

export const AboutWin = () => {
  const { abOpen } = useSelector((state) => state.desktop);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const action = () => {
    dispatch({ type: "DESKABOUT", payload: false });
  };

  return abOpen ? (
    <div className="aboutApp floatTab dpShad">
      <div className="content p-6">
        <div className="text-xl font-semibold">{t("about.title")}</div>
        <p>{t("about.opensource")}</p>
        <p>{t("about.licensed")} {t("about.Creative-Commons")}.</p>
        <p className="pl-4">
          {t("about.contact")} :&nbsp;
          <a target="_blank" href="mailto:blue@win11react.com" rel="noreferrer">
            blue@win11react.com
          </a>
        </p>

        <p>{t("about.notmicrosoft")}</p>
        <p>
          {t("about.alsonot")}&nbsp;
          <a
            target="_blank"
            href="https://www.microsoft.com/en-in/windows-365"
            rel="noreferrer"
          >
            Windows 365 cloud PC
          </a>
          .
        </p>
        <p>{t("about.microsoftcopywrite")}.</p>
      </div>
      <div className="okbtn px-6 py-4">
        <div data-allow={true} onClick={action}>
          {t("about.understand")}
        </div>
      </div>
    </div>
  ) : null;
};
