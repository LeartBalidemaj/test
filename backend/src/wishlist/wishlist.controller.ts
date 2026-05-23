import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import type { AuthUser } from '../auth/types/jwt-payload.interface';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AddWishlistItemDto } from './dto/add-wishlist-item.dto';
import { WishlistService } from './wishlist.service';

@ApiTags('Wishlist')
@ApiBearerAuth()
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  @ApiOperation({ summary: 'Get the current user wishlist' })
  getWishlist(@CurrentUser() user: AuthUser) {
    return this.wishlistService.getWishlist(user.tenantId, user.userId);
  }

  @Post('items')
  @ApiOperation({ summary: 'Add a product to the wishlist' })
  addItem(@CurrentUser() user: AuthUser, @Body() dto: AddWishlistItemDto) {
    return this.wishlistService.addItem(user.tenantId, user.userId, dto);
  }

  @Delete('items/:productId')
  @ApiOperation({ summary: 'Remove a product from the wishlist' })
  @ApiParam({ name: 'productId', type: Number })
  removeItem(
    @CurrentUser() user: AuthUser,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.wishlistService.removeItem(
      user.tenantId,
      user.userId,
      productId,
    );
  }
}
