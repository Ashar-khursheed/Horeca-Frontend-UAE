import {
  type PlaceOrderParams,
  placeOrderWithPayment,
} from "../place-order-api";

export async function placeCodOrder(
  params: Omit<PlaceOrderParams, "paymentMode" | "isCod" | "payment">,
): Promise<number> {
  return placeOrderWithPayment({
    ...params,
    paymentMode: "Cash on Delivery",
    isCod: true,
    payment: null,
  });
}
