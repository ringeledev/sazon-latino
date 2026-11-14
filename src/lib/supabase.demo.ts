// DEMO: no Supabase connection at all. Any leftover call resolves to empty data.
const empty = { data: null, error: null };

function chain(): any {
  const target = () => {};
  return new Proxy(target, {
    get(_t, prop) {
      if (prop === "then") return (resolve: (v: unknown) => void) => resolve(empty);
      return () => chain();
    },
    apply() {
      return chain();
    },
  });
}

export const supabase: any = {
  from: () => chain(),
  rpc: () => chain(),
  channel: () => chain(),
  removeChannel: () => {},
  auth: chain(),
};
