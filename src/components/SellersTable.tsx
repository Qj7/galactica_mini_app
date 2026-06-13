import { formatMoney } from "@/lib/format";
import {
  parseSellers,
  sellerKey,
  type Seller,
} from "@/lib/sellers";
import type { Product } from "@/lib/types";

function SellerRow({ seller }: { seller: Seller }) {
  const currency = seller.currency === "USD" ? "USD" : "EUR";

  return (
    <tr className="border-t border-slate-800">
      <td className="px-3 py-2 text-sm text-slate-200">{seller.name ?? "—"}</td>
      <td className="px-3 py-2 text-sm text-slate-400">{seller.country ?? "—"}</td>
      <td className="px-3 py-2 text-sm text-slate-300">
        {seller.qty != null ? seller.qty : "—"}
      </td>
      <td className="px-3 py-2 text-sm text-slate-300">
        {formatMoney(seller.price_net, currency)}
      </td>
      <td className="px-3 py-2 text-sm text-slate-300">
        {formatMoney(seller.price_gross, currency)}
      </td>
      <td className="px-3 py-2 text-sm text-slate-400">{seller.currency}</td>
      <td className="px-3 py-2 text-sm">
        {seller.deeplink ? (
          <a
            href={seller.deeplink}
            target="_blank"
            rel="noreferrer"
            className="text-sky-400 hover:text-sky-300"
            title={seller.deeplink}
          >
            Open
          </a>
        ) : (
          <span className="text-slate-500">—</span>
        )}
      </td>
    </tr>
  );
}

export function SellersTable({ product }: { product: Product }) {
  const sellers = parseSellers(product.comment);

  if (sellers.length === 0) {
    return null;
  }

  return (
    <div className="col-span-full">
      <h4 className="text-xs font-medium uppercase tracking-wide text-slate-400">
        Sellers
      </h4>
      <div className="mt-2 overflow-x-auto rounded-lg border border-slate-800">
        <table className="min-w-full text-left">
          <thead className="bg-slate-900/80 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2 font-medium">Seller</th>
              <th className="px-3 py-2 font-medium">Country</th>
              <th className="px-3 py-2 font-medium">Qty</th>
              <th className="px-3 py-2 font-medium">Net</th>
              <th className="px-3 py-2 font-medium">Gross</th>
              <th className="px-3 py-2 font-medium">Currency</th>
              <th className="px-3 py-2 font-medium">Link</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((seller) => (
              <SellerRow key={sellerKey(seller)} seller={seller} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
