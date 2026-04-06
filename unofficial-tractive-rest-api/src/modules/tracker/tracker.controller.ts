import { Controller, Get, HttpStatus, Logger, Param, Query, Body } from '@nestjs/common';
import { TrackerService } from './tracker.service';
import {
  TractiveTracker,
} from '../../interfaces/tractive-tracker.interface';
import { TractivePositionHistory } from '../../interfaces/tractive-position-history.interface';
import { ApiResponse } from '../../interfaces/api-response';
import { TrackerHistoryDto } from '../../dto/tracker-history.dto';
import { AxiosError } from 'axios';

/**
 * Controller for tracker-related operations.
 */
@Controller({
  path: 'tracker',
})
export class TrackerController {
  private readonly logger = new Logger(TrackerController.name);

  constructor(private readonly trackerService: TrackerService) {}

  /**
   * Get all trackers
   */
  @Get()
  async getAllTrackers(): Promise<ApiResponse<TractiveTracker[]>> {
    try {
      const data = await this.trackerService.getAllTrackers();
      return {
        status: HttpStatus.OK,
        data,
      };
    } catch (e) {
      let status = HttpStatus.INTERNAL_SERVER_ERROR;
      if (e instanceof AxiosError) {
        status = e.response?.status || status;
      }
      this.logger.error(`Error while getting all trackers: ${e.message}`);
      return {
        status,
        data: null,
        message: e.message,
      };
    }
  }

  /**
   * Get a specific tracker
   */
  @Get(':trackerID')
  async getTracker(@Param('trackerID') trackerID: string): Promise<ApiResponse<TractiveTracker>> {
    try {
      const data = await this.trackerService.getTracker(trackerID);
      return {
        status: HttpStatus.OK,
        data,
      };
    } catch (e) {
      let status = HttpStatus.INTERNAL_SERVER_ERROR;
      if (e instanceof AxiosError) {
        status = e.response?.status || status;
      }
      this.logger.error(`Error while getting tracker: ${e.message}`);
      return {
        status,
        data: null,
        message: e.message,
      };
    }
  }

  /**
   * Get tracker history between two timestamps
   * Query params: from (unix timestamp), to (unix timestamp)
   */
  @Get(':trackerID/history')
  async getTrackerHistory(
    @Param('trackerID') trackerID: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ): Promise<ApiResponse<TractivePositionHistory[]>> {
    try {
      const dto: TrackerHistoryDto = {
        trackerID,
        from: isNaN(Number(from)) ? from : Number(from),
        to: isNaN(Number(to)) ? to : Number(to),
      };
      const data = await this.trackerService.getTrackerHistory(dto);
      return {
        status: HttpStatus.OK,
        data,
      };
    } catch (e) {
      let status = HttpStatus.INTERNAL_SERVER_ERROR;
      if (e instanceof AxiosError) {
        status = e.response?.status || status;
      }
      this.logger.error(`Error while getting tracker history: ${e.message}`);
      return {
        status,
        data: null,
        message: e.message,
      };
    }
  }
}
