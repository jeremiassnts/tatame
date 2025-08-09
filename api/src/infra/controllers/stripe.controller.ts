import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  SetMetadata,
  UsePipes,
} from '@nestjs/common';
import { StripeService } from '../services/stripe';
import { StripePresenter } from '../presenters/stripe-presenter';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { z } from 'zod';

const StripeSubscribeBodySchema = z.object({
  customerId: z.string(),
  priceId: z.string(),
});
type StripeSubscribeBodyType = z.infer<typeof StripeSubscribeBodySchema>;

const createCustomerBodySchema = z.object({
  email: z.string().email(),
  name: z.string(),
  address: z.object({
    city: z.string(),
    state: z.string(),
    postal_code: z.string(),
    country: z.string(),
    line1: z.string(),
  }),
});
type CreateCustomerBodyType = z.infer<typeof createCustomerBodySchema>;
@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Get('products')
  @HttpCode(200)
  @SetMetadata('isPublic', true)
  async fetchProducts() {
    const { data } = await this.stripeService.getProducts();
    return {
      products: data.map((product) => StripePresenter.productToHttp(product)),
    };
  }

  @Post('subscribe')
  @HttpCode(201)
  @SetMetadata('isPublic', true)
  @UsePipes(new ZodValidationPipe(StripeSubscribeBodySchema))
  async subscribe(@Body() body: StripeSubscribeBodyType) {
    const { customerId, priceId } = body;
    const subscription = await this.stripeService.createSubscription(
      customerId,
      priceId,
    );
    return {
      subscriptionId: subscription.id,
      // @ts-expect-error: expand subscription
      secret: subscription.latest_invoice?.confirmation_secret?.client_secret,
    };
  }

  @Post('customer')
  @HttpCode(201)
  @SetMetadata('isPublic', true)
  @UsePipes(new ZodValidationPipe(createCustomerBodySchema))
  async createCustomer(@Body() body: CreateCustomerBodyType) {
    const { email, name, address } = body;
    const customer = await this.stripeService.createCustomer({
      email,
      name,
      address,
    });
    return { customerId: customer.id };
  }
}
