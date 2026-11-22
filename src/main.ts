import "./styles/main.css";
import "./styles/menu.css";
import "./styles/world-map.css";
import "./styles/cloud-transition.css";

import { Game } from "./game/Game";

const root = document.querySelector<HTMLDivElement>("#app");

if (!root) {
  throw new Error("Application root was not found.");
}

const game = new Game(root);

game.start();

window.addEventListener("beforeunload", () => {
  game.destroy();
});
