import { Command } from "lucide-react";
import { useEffect, useState } from "react";
import { clsx as cn } from "clsx";
import { motion } from "framer-motion";
import { get, set } from "./util";

export default function App() {
  const [enable, setEnable] = useState<boolean>(false);
  const [wrongSite] = useState(false);

  function handleToggle() {
    setEnable((prev) => !prev);
  }

  useEffect(() => {
    async function getEnable() {
      const value = await get("enable");
      if (value === undefined) {
        set("enable", false);
        setEnable(false);
      }
      setEnable(value);
    }

    getEnable();
  }, []);

  useEffect(() => {
    async function sendEnableToContent() {
      const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
      });

      chrome.tabs.sendMessage(tab.id ?? 0, {
        enable,
      });

    }

    set("enable", enable);
    sendEnableToContent();
  }, [enable]);

  return (
    <main className="flex flex-col items-center gap-3 w-[400px] p-6 rounded">
      <Command size={32} />
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Switch YT
      </h1>

      <p className="text-sm text-muted-foreground">
        Press{" "}
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 uppercase">
          <span className="text-xs">⇧</span> + K
        </kbd>{" "}
        to search youtube
      </p>

      <motion.div
        className={cn(
          "w-full h-32 border rounded p-3 my-3 flex items-center transition-all ",
          enable ? "flex-row-reverse bg-zinc-900" : "bg-white",
        )}
      >
        {wrongSite ? (
          <div className="w-full h-full uppercase rounded text-4xl bg-zinc-900 text-white text-center flex flex-col justify-around">
            Not on YT yet.
          </div>
        ) : (
          <motion.div
            layoutId="underline"
            className={cn(
              "uppercase aspect-square h-full flex rounded cursor-pointer",
              enable ? "bg-white text-primary" : "bg-zinc-900 text-white",
            )}
            onClick={handleToggle}
          >
            <p className="text-4xl m-auto">{enable ? "on" : "off"}</p>
          </motion.div>
        )}
      </motion.div>

      <footer className="w-full text-center flex">
        <p className="flex items-top gap-1 mx-auto leading-7 [&:not(:first-child)]:mt-6">
          made by{" "}
          <a href="https://twitter.com/AshishK1331" className="underline">
            ashishK1331
          </a>
        </p>
      </footer>
    </main>
  );
}
