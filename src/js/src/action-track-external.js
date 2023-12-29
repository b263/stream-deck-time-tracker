import { KimaiApi } from "./lib/api/kimai-api.js";

document.querySelector("#login").addEventListener("click", async () => {
  const url = document.querySelector("#url").value.replace(/\/$/, "") + "/";
  const user = document.querySelector("#user").value;
  const password = document.querySelector("#password").value;

  const response = await KimaiApi.ping(url, user, password);

  if (response?.message === "pong") {
    window.opener.postMessage({
      url,
      user,
      password,
    });
  } else {
    window.alert("Error logging in");
  }
});
