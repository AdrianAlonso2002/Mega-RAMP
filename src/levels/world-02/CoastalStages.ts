import type { LevelData, LevelObjectData } from "../LevelTypes";

/** One-time migration also updates saved stages, while retaining unrelated editor additions. */
export function applyCoastalStageUpdates(data: LevelData): LevelData {
  if(data.world===2&&data.level===2&&data.stage===10&&data.properties?.coastalPierRevision!==1){
    // Millimetre-scale deck layering removes flicker at the original overlapping dock joints.
    for(const object of data.objects){
      if(object.id==='w2s10-main-spine')object.position.y+=.012;
      else if(/^w2s10-e[123]-outer$/.test(object.id))object.position.y+=.006;
    }
    data.properties={...data.properties,coastalPierRevision:1};
  }
  if (
    data.world !== 2 ||
    data.level !== 2 ||
    ![8, 9].includes(data.stage) ||
    data.properties?.coastalInteriorRevision === 2
  )
    return data;
  const shop = data.stage === 8;
  if (shop)
    data.objects = data.objects.filter(
      (obj) => !obj.id.startsWith("w2s8-dec-"),
    );
  const stores = data.objects.filter(
    (obj) => obj.properties?.variant === (shop ? "shop" : "market_stall"),
  );
  const place = (
    item: LevelObjectData,
    store: LevelObjectData,
    x: number,
    z: number,
  ) => {
    const a = store.rotation.y,
      round = (value: number) => Math.round(value * 100000) / 100000;
    item.position = {
      x: round(store.position.x + Math.cos(a) * x + Math.sin(a) * z),
      y: round(store.position.y + 1.2),
      z: round(store.position.z - Math.sin(a) * x + Math.cos(a) * z),
    };
  };
  for (const store of stores) {
    store.rotation.y = store.position.x < 0 ? Math.PI / 2 : -Math.PI / 2;
    if (!shop && store.properties?.stallType === "goal")
      store.properties = {
        ...store.properties,
        stallType: "pottery",
        customColor: "#537e8b",
        stripeColor: "#f1e7ce",
      };
    const suffix = store.id.split("-").pop();
    const prize = data.objects.find(
      (item) =>
        item.id === (shop ? `w2s8-col-shop${suffix}` : `w2s9-col-${suffix}`),
    );
    if (prize) place(prize, store, shop ? 0 : 1.48, shop ? -1.85 : -1.05);
  }
  const goal = data.objects.find(
    (obj) => obj.id === (shop ? "w2s8-hidden-goal" : "w2s9-hidden-goal"),
  );
  const target = stores.find(
    (obj) => obj.id === (shop ? "w2s8-shop-6" : "w2s9-stall-12"),
  );
  if (goal && target) {
    place(goal, target, 0, shop ? -1.85 : -1.13);
    goal.position.y=target.position.y+.4;
    goal.rotation.y = target.rotation.y;
    goal.scale = { x: shop ? 1 : 0.65, y: shop ? 1 : 0.65, z: 1 };
    goal.properties = { ...goal.properties, searchHidden: true };
  }
  data.timeLimit = Math.max(data.timeLimit, 90);
  data.properties = { ...data.properties, coastalInteriorRevision: 2 };
  return data;
}
