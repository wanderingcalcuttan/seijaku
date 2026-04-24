// Default bridge-page assignment rule: when an admin creates a new product,
// the `POST /admin/products` handler looks up the bridge slug returned here
// for the product's `type` and auto-creates a ShopBridgePageProduct link.
//
// Admins can remove or add links manually via /admin/bridge-pages after
// creation. This mapping is only consulted at create time — subsequent
// `type` edits do NOT re-route the product.
//
// Free-text types that don't match a case here (including Program, Retreat,
// and any future unmapped entries) return null and skip auto-assignment.
//
// Mirrored on the frontend at frontend/src/lib/shop-taxonomy.ts
// (defaultBridgeSlugForProductType) for the admin form's pre-save notice.
// Keep them in sync — if you add a rule, update both sites.
export function defaultBridgeSlugForProductType(type: string): string | null {
  switch (type) {
    case "Perfume":
    case "Fragrance Oil":
      return "perfumes";
    case "Scarf / Square":
      return "scarves-and-squares";
    case "Diffuser":
    case "Wax Melt":
      return "diffusers";
    case "Dokra Ornament":
      return "dokra-ornaments";
    case "Ritual Box":
      return "lifestyle";
    default:
      return null;
  }
}
