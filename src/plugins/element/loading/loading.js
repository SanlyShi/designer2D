import { Loading } from "element-ui";

let loadingCount = 0;
let loading;

const startLoading = () => {
  loading = Loading.service({
    background: "rgba(0, 0, 0, 0.3)",
    customClass: "ZWLoading",
  });
};

const endLoading = () => {
  loading.close();
};

const showLoading = () => {
  if (loadingCount === 0) {
    startLoading();
  }
  loadingCount += 1;
};

const hideLoading = (show) => {
  if (show) {
    return endLoading();
  }
  if (loadingCount <= 0) {
    return;
  }
  loadingCount -= 1;
  if (loadingCount === 0) {
    endLoading();
  }
};

export { showLoading, hideLoading };
