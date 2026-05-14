export interface Address {
  id: number
  label: string
  line1: string
  line2: string
}

export interface CartItem {
  id: number
  name: string
  qty: number
  price: number
  shipping: number
  deliveryDate: string
}

export interface MobileCheckoutProps {
  mobileStep: number
  setMobileStep: (s: number) => void

  addresses: Address[]
  selectedAddress: number
  setSelectedAddress: (id: number) => void

  cartItems: CartItem[]

  coupon: string
  setCoupon: (v: string) => void
  couponApplied: boolean
  setCouponApplied: (v: boolean) => void

  liftGate: boolean
  setLiftGate: (v: boolean) => void
  residential: boolean
  setResidential: (v: boolean) => void
  insideDelivery: boolean
  setInsideDelivery: (v: boolean) => void

  note: string
  setNote: (v: string) => void

  payment: string
  setPayment: (v: string) => void

  cardNum: string
  setCardNum: (v: string) => void
  cardName: string
  setCardName: (v: string) => void
  cardExpiry: string
  setCardExpiry: (v: string) => void
  cardCvv: string
  setCardCvv: (v: string) => void
  cardFlipped: boolean
  setCardFlipped: (v: boolean) => void

  subtotal: number
  shippingTotal: number
  tax: number
  couponDiscount: number
  checkDiscount: number
  total: number
  totalSavings: number
}
