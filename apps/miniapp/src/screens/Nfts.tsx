import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useWallet } from "../wallet/store.js";
import { useNetwork } from "../context/network.js";
import { api, type NftItem } from "../api.js";

export function Nfts() {
  const { t } = useTranslation();
  const { accounts } = useWallet();
  const { active } = useNetwork();
  const account = accounts.find((a) => a.family === active.family) ?? accounts[0];

  const [nfts, setNfts] = useState<NftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!account) return;
    setLoading(true);
    setError(false);
    api.nfts(active.id, account.address)
      .then((r) => { setNfts(r.nfts); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [active.id, account?.address]);

  const supported = active.family === "evm" || active.family === "ton";

  return (
    <div className="screen">
      <h2 className="nft-title">{t("nfts.title")} · {active.name}</h2>

      {!supported ? (
        <div className="nft-empty">
          <div className="nft-empty-icon">🖼️</div>
          <p className="muted">{t("nfts.notSupported")}</p>
        </div>
      ) : loading ? (
        <div className="nft-grid">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="nft-card skeleton-card">
              <div className="skeleton nft-img-skel" />
              <div className="skeleton" style={{ height: 12, margin: "8px 8px 4px" }} />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="nft-empty">
          <div className="nft-empty-icon">⚠️</div>
          <p className="muted">{t("nfts.loadFailed")}</p>
        </div>
      ) : nfts.length === 0 ? (
        <div className="nft-empty">
          <div className="nft-empty-icon">🖼️</div>
          <p className="muted">{t("nfts.empty")}</p>
        </div>
      ) : (
        <div className="nft-grid">
          {nfts.map((nft) => (
            <NftCard key={nft.id} nft={nft} />
          ))}
        </div>
      )}
    </div>
  );
}

function NftCard({ nft }: { nft: NftItem }) {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="nft-card">
      {nft.imageUrl && !imgError ? (
        <img
          className="nft-image"
          src={nft.imageUrl}
          alt={nft.name}
          loading="lazy"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="nft-image nft-placeholder">🖼️</div>
      )}
      <div className="nft-info">
        <div className="nft-name">{nft.name}</div>
        {nft.collection && <div className="nft-collection">{nft.collection}</div>}
      </div>
    </div>
  );
}
