import { Injectable } from '@nestjs/common';
import { EnvService } from 'src/env/env.service';
import Stripe from 'stripe';

interface CreateCustomerParams {
  email: string;
  name: string;
  address: {
    line1: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;
  constructor(private readonly env: EnvService) {
    this.stripe = new Stripe(this.env.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2025-05-28.basil',
      appInfo: {
        name: 'basil-api',
        version: '0.0.1',
        url: 'https://github.com/basil-api',
      },
      typescript: true,
    });
  }

  async getProducts() {
    const products = await this.stripe.products.list({
      active: true,
      expand: ['data.default_price'],
    });
    return products;
  }
  async createCustomer({ email, address, name }: CreateCustomerParams) {
    const customer = await this.stripe.customers.create({
      email,
      name,
      address,
    });
    return customer;
  }
  async createSubscription(customerId: string, priceId: string) {
    const subscription = await this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.confirmation_secret'],
      trial_period_days: 30,
    });
    return subscription;
  }
}
