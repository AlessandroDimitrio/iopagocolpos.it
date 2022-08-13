// API CALLER
import axios from "axios";
import { useStore } from "vuex";

class ApiCallerClass {
  constructor() {
    this.initialized = false;
  }

  init() {
    this.serverUrl = process.env.VUE_APP_SERVER_PATH;
    this.store = useStore();
    this.initialized = true;
  }

  callbackResponse = (response, resolve, reject, showOnSuccess = true) => {
    let result = this.checkResponse(response);
    let message = "Chiamata avvenuta con successo!";

    console.log(result);

    if (result.error_code === 0) {
      message = result.error_desc ? result.error_desc : "Successo";
      this.displaySuccess(message, showOnSuccess);
      resolve(result.response);
    } else {
      message = result.error_desc ? result.error_desc : "Errore chiamata";
      this.displayError(message);
      resolve();
    }
  };

  // axios.get
  aux = async (method, url, payload) => {
    if (!this.initialized) this.init();
    let self = this;
    if (method === "get") self.store.dispatch("loaderShow", 0);
    else self.store.dispatch("loaderShow");
    console.log(url);
    return new Promise(function (resolve, reject) {
      const platform = self.store.getters.currentPlatform.db;
      const tmp = method == "get" ? "params" : "data";
      let body = {};
      body[tmp] = {
        platform,
        ...payload,
      };
      var config = {
        method: method,
        url: self.serverUrl + url,
        ...body,
      };

      axios(config)
        .then((response) => {
          if (method != "get") self.store.dispatch("pendingRefresh");
          self.callbackResponse(response, resolve, reject, method !== "get");
        })
        .catch((err) => {
          if (method != "get") self.store.dispatch("pendingRefresh");
          self.displayError(url + " " + err);
          resolve();
        });
    });
  };

  GET = (...args) => this.aux("get", ...args);
  POST = (...args) => this.aux("post", ...args);
  PUT = (...args) => this.aux("put", ...args);
  DELETE = (...args) => this.aux("delete", ...args);

  checkResponse(response) {
    if (response.statusText === "OK" || response.statusText === "")
      return response.data;
    return false;
  }

  displayError(err) {
    this.store.dispatch("loaderHide");
    this.store.dispatch("pushMessage", {
      title: "Errore",
      description: err,
      type: "error",
    });
  }

  displaySuccess(success, showOnSuccess) {
    this.store.dispatch("loaderHide");
    if (showOnSuccess)
      this.store.dispatch("pushMessage", {
        title: "Successo",
        description: success,
        type: "success",
      });
  }
}

export const ApiCaller = new ApiCallerClass();
