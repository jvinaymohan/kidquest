import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

function uid() {
  return crypto.randomUUID?.() ?? `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export const useLifeExplorerStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: ({ type, title, body = "", meta = {}, shareScope = "private" }) => {
        const item = {
          id: uid(),
          type,
          title,
          body,
          meta,
          shareScope,
          createdAt: new Date().toISOString(),
        };
        set({ items: [item, ...get().items] });
        return item;
      },

      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),

      pins: () => get().items.filter((i) => i.type === "map_pin"),
      journals: (type) => get().items.filter((i) => i.type === type),
      stories: () => get().items.filter((i) => i.type === "story"),

      hydrateFromCloud: (rows) => {
        if (!rows?.length) return;
        const mapped = rows.map((r) => ({
          id: r.id,
          type: r.item_type?.replace("map_pin", "map_pin") ?? r.item_type,
          title: r.title,
          body: r.body ?? "",
          meta: r.meta ?? {},
          shareScope: r.share_scope ?? "private",
          createdAt: r.created_at,
        }));
        set({ items: mapped });
      },
    }),
    { name: "kidquest-life-explorer-v1", storage: createJSONStorage(() => localStorage) }
  )
);
