import { KimaiApi } from "./lib/api/kimai-api";
import { AuthenticationState, BackendProvider } from "./lib/constants";
import { GlobalSettings } from "./lib/types";

let settings: GlobalSettings;

window.addEventListener("message", ({ data }) => {
  settings = data;

  document.querySelector<HTMLInputElement>("#url")!.value =
    settings?.backendProviderConfig?.[BackendProvider.kimai]?.url ?? "";
  document.querySelector<HTMLInputElement>("#user")!.value =
    settings?.backendProviderConfig?.[BackendProvider.kimai]?.user ?? "";
  document.querySelector<HTMLInputElement>("#password")!.value =
    settings?.backendProviderConfig?.[BackendProvider.kimai]?.password ?? "";

  updateState();
});

document.querySelector("#login")!.addEventListener("click", async () => {
  const url =
    document.querySelector<HTMLInputElement>("#url")!.value.replace(/\/$/, "") +
    "/";
  const user = document.querySelector<HTMLInputElement>("#user")!.value;
  const password = document.querySelector<HTMLInputElement>("#password")!.value;

  const response = await KimaiApi.getCurrentUser(url, user, password);

  settings = {
    backendProviderConfig: {
      [BackendProvider.kimai]: {
        authenticationState: response?.id
          ? AuthenticationState.loggedIn
          : AuthenticationState.error,
        url,
        user,
        password,
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
        settings?.backendProviderConfig?.[BackendProvider.kimai]
          ?.authenticationState
      ) {
        el.style.display = "block";
      } else {
        el.style.display = "none";
      }
    });
}
