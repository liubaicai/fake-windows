const defState = {
  open: false,
  kind: null,
  title: "",
  message: "",
  confirmText: "确定",
  cancelText: "取消",
  itemId: null,
  initialValue: "",
  icon: null,
  name: "",
  details: [],
  metaText: "",
};

const dialogReducer = (state = defState, action) => {
  if (action.type == "DIALOG_SHOW") {
    return {
      ...defState,
      ...action.payload,
      open: true,
    };
  }

  if (action.type == "DIALOG_HIDE") {
    return { ...defState };
  }

  return state;
};

export default dialogReducer;