import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import type { AuthUser } from '../auth/types/jwt-payload.interface';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@ApiTags('Cart')
@ApiBearerAuth()
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get the current user cart' })
  getCart(@CurrentUser() user: AuthUser) {
    return this.cartService.getCart(user.tenantId, user.userId);
  }

  @Post('items')
  @ApiOperation({ summary: 'Add a product to the cart' })
  addItem(@CurrentUser() user: AuthUser, @Body() dto: AddCartItemDto) {
    return this.cartService.addItem(user.tenantId, user.userId, dto);
  }

  @Put('items/:id')
  @ApiOperation({ summary: 'Update a cart item quantity' })
  @ApiParam({ name: 'id', type: Number, description: 'Cart item ID' })
  updateItem(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(user.tenantId, user.userId, id, dto);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Remove a cart item' })
  @ApiParam({ name: 'id', type: Number, description: 'Cart item ID' })
  removeItem(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.cartService.removeItem(user.tenantId, user.userId, id);
  }

  @Delete()
  @ApiOperation({ summary: 'Clear all items from the cart' })
  clearCart(@CurrentUser() user: AuthUser) {
    return this.cartService.clearCart(user.tenantId, user.userId);
  }
}
