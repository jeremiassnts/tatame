import Stripe from 'stripe';

export class StripePresenter {
  static productToHttp({
    id,
    description,
    images,
    name,
    default_price,
  }: Stripe.Product) {
    let defaultPrice: Stripe.Price | null = null;
    if (default_price) {
      defaultPrice = default_price as Stripe.Price;
    }
    return {
      id,
      description,
      images,
      name,
      default_price: {
        id: defaultPrice?.id,
        currency: defaultPrice?.currency,
        unit_amount: defaultPrice?.unit_amount,
      },
    };
  }
}
