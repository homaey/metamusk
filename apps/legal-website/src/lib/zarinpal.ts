const MERCHANT = process.env.ZARINPAL_MERCHANT_ID ?? "";
const SANDBOX  = process.env.ZARINPAL_SANDBOX === "true";

const BASE = SANDBOX
  ? "https://sandbox.zarinpal.com/pg/v4/payment"
  : "https://api.zarinpal.com/pg/v4/payment";

const GATEWAY = SANDBOX
  ? "https://sandbox.zarinpal.com/pg/StartPay"
  : "https://www.zarinpal.com/pg/StartPay";

export interface ZarinpalRequestResult {
  authority: string;
  paymentUrl: string;
}

export async function zarinpalRequest(
  amount: number,       // به تومان
  description: string,
  callbackUrl: string,
  email?: string,
  mobile?: string
): Promise<ZarinpalRequestResult> {
  const res = await fetch(`${BASE}/request.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      merchant_id: MERCHANT,
      amount: amount * 10, // تبدیل تومان به ریال
      description,
      callback_url: callbackUrl,
      metadata: { email, mobile },
    }),
  });

  const data = await res.json();
  if (data.data?.code !== 100) {
    throw new Error(`Zarinpal error: ${data.errors?.message ?? JSON.stringify(data)}`);
  }

  const authority = data.data.authority as string;
  return { authority, paymentUrl: `${GATEWAY}/${authority}` };
}

export async function zarinpalVerify(
  authority: string,
  amount: number
): Promise<{ refId: string }> {
  const res = await fetch(`${BASE}/verify.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      merchant_id: MERCHANT,
      amount: amount * 10,
      authority,
    }),
  });

  const data = await res.json();
  if (![100, 101].includes(data.data?.code)) {
    throw new Error(`Zarinpal verify error: ${data.errors?.message ?? JSON.stringify(data)}`);
  }

  return { refId: String(data.data.ref_id) };
}
