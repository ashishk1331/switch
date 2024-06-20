import { createRoot } from "react-dom/client";
import { get } from "../popup/util";

function addShortcutIcon() {
  const container: HTMLElement | null = document.querySelector(
    "form#search-form > div#container",
  );

  if (container) {
    const element = (
      <kbd
        style={{
          display: "flex",
          gap: "0.6rem",
          fontSize: "1.2rem",
          marginRight: "1.2rem",
        }}
      >
        <span>⇧</span>
        <span>+</span>
        <span>K</span>
      </kbd>
    );
    // Create a new div to hold the React element
    const tempDiv = document.createElement("div");
    container.prepend(tempDiv);
    // Render the React element into the new div
    const root = createRoot(tempDiv);
    root.render(element);
  }
}

function removeShortcutIcon() {
  const container: HTMLElement | null = document.querySelector(
    "form#search-form > div#container",
  );

  if (container) {
    const kbdElement = container.querySelector("div > kbd");
    if (kbdElement) {
      kbdElement.remove();
    }
  }
}

function setFocus() {
  const searchElement: HTMLInputElement | null =
    document.querySelector("input#search");
  if (searchElement) {
    searchElement.focus();
  }
}

function handleKeypress(event: {
  shiftKey: boolean;
  key: string;
  preventDefault: () => void;
}) {
  if (event.shiftKey && event.key === "K") {
    event.preventDefault();
    setFocus();
  }
}

chrome.runtime.onMessage.addListener(function (request) {
  if (request.enable) {
    addShortcutIcon();
    window.addEventListener("keypress", handleKeypress);
  } else {
    removeShortcutIcon();
    window.removeEventListener("keypress", handleKeypress);
  }
});

async function checkForEnable() {
  const { enable } = await chrome.storage.local.get(["enable"]);
  
  if (enable) {
    addShortcutIcon();
    window.addEventListener("keypress", handleKeypress);
  }
}

checkForEnable();
