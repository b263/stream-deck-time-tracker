import { KimaiApi } from "./lib/api/kimai-api";
import { AuthenticationState } from "./lib/constants";
import { GlobalSettings } from "./lib/types";

let settings: GlobalSettings;

window.addEventListener("message", ({ data }) => {
  settings = data;

  document.querySelector<HTMLInputElement>("#url")!.value =
    settings?.backendProviderConfig?.["kimai"]?.url ?? "";
  document.querySelector<HTMLInputElement>("#user")!.value =
    settings?.backendProviderConfig?.["kimai"]?.user ?? "";
  document.querySelector<HTMLInputElement>("#token")!.value =
    settings?.backendProviderConfig?.["kimai"]?.token ?? "";

  updateState();
});

document.querySelector("#login")!.addEventListener("click", async () => {
  const url =
    document
      .querySelector<HTMLInputElement>("#url")!
      .value.replace(/\/(api)?$/, "") + "/";
  const user = document.querySelector<HTMLInputElement>("#user")!.value;
  const token = document.querySelector<HTMLInputElement>("#token")!.value;

  const response = await KimaiApi.getCurrentUser(url, user, token);

  settings = {
    backendProviderConfig: {
      ["kimai"]: {
        authenticationState: response?.id
          ? AuthenticationState.loggedIn
          : AuthenticationState.error,
        url,
        user,
        token,
        userId: response.id,
      },
    },
  };

  updateState();
});

document.querySelector("#save")?.addEventListener("click", async () => {
  window.opener.postMessage(settings);
});

function updateState() {
  document
    .querySelectorAll<HTMLElement>("#loginState [data-status]")
    .forEach((el: HTMLElement) => {
      if (
        el.dataset.status ===
        settings?.backendProviderConfig?.["kimai"]?.authenticationState
      ) {
        el.style.display = "block";
      } else {
        el.style.display = "none";
      }
    });
}
