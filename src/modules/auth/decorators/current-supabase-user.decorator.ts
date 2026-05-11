import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { SupabaseJwtPayload } from '../guards/supabase-jwt.guard';

export const CurrentSupabaseUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): SupabaseJwtPayload => {
    const req = ctx.switchToHttp().getRequest<Request & { user: SupabaseJwtPayload }>();
    return req.user;
  },
);
