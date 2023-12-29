import { KimaiApi } from "./lib/api/kimai-api.js";
import { AuthenticationState, BackendProvider } from "./lib/constants.js";

let settings = null;

window.addEventListener("message", ({ data }) => {
  settings = data;

  document.querySelector("#url").value =
    settings?.backendProviderConfig?.[BackendProvider.kimai]?.url ?? "";
  document.querySelector("#user").value =
    settings?.backendProviderConfig?.[BackendProvider.kimai]?.user ?? "";
  document.querySelector("#password").value =
    settings?.backendProviderConfig?.[BackendProvider.kimai]?.password ?? "";

  updateState();
});

document.querySelector("#login").addEventListener("click", async () => {
  const url = document.querySelector("#url").value.replace(/\/$/, "") + "/";
  const user = document.querySelector("#user").value;
  const password = document.querySelector("#password").value;

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

document.querySelector("#save").addEventListener("click", async () => {
  window.opener.postMessage(settings);
});

function updateState() {
  document.querySelectorAll("#loginState [data-status]").forEach((el) => {
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
