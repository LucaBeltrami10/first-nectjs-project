import { Body, Controller, Post, UseGuards, Patch, Param, Get, Query } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { ReportDto } from './dto/report.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ApproveReportDto } from './dto/approve-report.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { GetEstimateDto } from './dto/get-estimate.dto';

@Controller('reports')
export class ReportsController {
    constructor(private reportService: ReportsService){}

    @Post()
    @UseGuards(AuthGuard)
    @Serialize(ReportDto)
    createReport(@CurrentUser() user: User, @Body() body: CreateReportDto){
        return this.reportService.create(body, user);
    }

    @Patch('/:id')
    @UseGuards(AdminGuard)
    approveReport(@Param('id') id:string, @Body() body: ApproveReportDto){
        return this.reportService.changeApproval(id, body.approved)
    }

    @Get()
    getEstimate(@Query() query: GetEstimateDto){
        return this.reportService.createEstimate(query);
    }
}
