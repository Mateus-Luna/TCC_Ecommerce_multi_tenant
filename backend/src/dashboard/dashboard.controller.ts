import {
  Controller,
  ForbiddenException,
  Get,
  Req,
  UseGuards,
} from "@nestjs/common";

import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { DashboardService } from "./dashboard.service";
import * as tenantRequestInterface from "../common/interfaces/tenant-request.interface";

@UseGuards(JwtAuthGuard)
@Controller("dashboard")
export class DashboardController {

  constructor(
    private readonly dashboardService: DashboardService,
  ) {}

  @Get()
  getDashboard(
    @Req() req: tenantRequestInterface.TenantRequest,
  ) {
    if (req.user?.role !== "ADMIN") {
      throw new ForbiddenException(
        "Apenas administradores podem acessar o dashboard.",
      );
    }

    return this.dashboardService.getMetrics(
      req.user!.storeId,
    );

  }
}
