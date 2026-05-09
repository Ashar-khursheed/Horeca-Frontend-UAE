export type VariantItem = {
  product_id: number;
  sku: string;
  attribute_value: string;
  label: string;
  selected: boolean;
  price: number;
  sale_price: number;
  images: string[];
};

export type AccessoryItem = { id: number; name: string; price: number };

export type Accessory = {
  id: number;
  name: string;
  isRequired: number;
  items: AccessoryItem[];
};

export type Spec = { attribute_name: string; attribute_value: string };
