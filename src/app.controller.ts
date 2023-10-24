import { Controller, Get, Render, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(private configService: ConfigService) {}

  @Public()
  @Get('prisma-studio')
  @Render('prisma')
  prismaStudio(@Res() res: Response): { prisma_studio_port: number } {
    const prisma_studio_port =
      this.configService.get<number>('PRISMA_STUDIO_PORT');

    res.setHeader(
      'Content-Security-Policy',
      `default-src 'self' http://localhost:${prisma_studio_port}/; frame-src http://localhost:${prisma_studio_port}/;`
    );

    return {
      prisma_studio_port
    };
  }
}
