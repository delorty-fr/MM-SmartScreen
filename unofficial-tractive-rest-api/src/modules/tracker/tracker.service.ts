import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { NotAuthenticatedException } from '../../exceptions/NotAuthenticated.exception';
import { AuthenticationStore } from '../store/authentication.store';
import {
  TractiveTracker,
} from '../../interfaces/tractive-tracker.interface';
import { TractivePositionHistory } from '../../interfaces/tractive-position-history.interface';
import { TractiveApi } from '../../constants';
import { TrackerHistoryDto } from '../../dto/tracker-history.dto';

/**
 * Service for tracker information and history from Tractive.
 */
@Injectable()
export class TrackerService {
  private readonly logger = new Logger(TrackerService.name);

  constructor(private readonly authenticationStore: AuthenticationStore) {}

  /**
   * Get all trackers on the account
   */
  public async getAllTrackers(): Promise<TractiveTracker[]> {
    this.logger.log(`Get all trackers`);

    const bearer = this.authenticationStore.accessToken;
    const userId = this.authenticationStore.lastAuthenticationCache.user_id;
    if (!bearer || !userId) {
      throw new NotAuthenticatedException();
    }

    try {
      const url = `${TractiveApi.BASE_URL}/user/${userId}/trackers`;
      const response = await axios.get(url, {
        headers: {
          'X-Tractive-Client': TractiveApi.CLIENT_ID,
          'Content-Type': 'application/json',
          Authorization: `Bearer ${bearer}`,
        },
      });
      return response.data;
    } catch (e) {
      this.logger.error(`Error while getting all trackers: ${e.message}`);
      throw e;
    }
  }

  /**
   * Get a specific tracker by ID
   */
  public async getTracker(trackerID: string): Promise<TractiveTracker> {
    this.logger.log(`Get tracker: ${trackerID}`);

    const bearer = this.authenticationStore.accessToken;
    if (!bearer) {
      throw new NotAuthenticatedException();
    }

    try {
      const url = `${TractiveApi.BASE_URL}/tracker/${trackerID}`;
      const response = await axios.get(url, {
        headers: {
          'X-Tractive-Client': TractiveApi.CLIENT_ID,
          'Content-Type': 'application/json',
          Authorization: `Bearer ${bearer}`,
        },
      });
      return response.data;
    } catch (e) {
      this.logger.error(`Error while getting tracker: ${e.message}`);
      throw e;
    }
  }

  /**
   * Get location history for a tracker between two timestamps
   */
  public async getTrackerHistory(
    dto: TrackerHistoryDto,
  ): Promise<TractivePositionHistory[]> {
    this.logger.log(
      `Get tracker history for ${dto.trackerID} from ${dto.from} to ${dto.to}`,
    );

    const bearer = this.authenticationStore.accessToken;
    if (!bearer) {
      throw new NotAuthenticatedException();
    }

    try {
      // Convert dates if they're objects (Date instances)
      const from = dto.from as any;
      const to = dto.to as any;
      
      let calcFrom = typeof from === 'object' && from?.getTime
        ? (from.getTime() / 1000).toFixed(0)
        : String(from);
      let calcTo = typeof to === 'object' && to?.getTime
        ? (to.getTime() / 1000).toFixed(0)
        : String(to);

      const url = `${TractiveApi.BASE_URL}/tracker/${encodeURIComponent(
        dto.trackerID,
      )}/positions?time_from=${encodeURIComponent(
        calcFrom,
      )}&time_to=${encodeURIComponent(
        calcTo,
      )}&format=json_segments`;

      const response = await axios.get(url, {
        headers: {
          'X-Tractive-Client': TractiveApi.CLIENT_ID,
          'Content-Type': 'application/json',
          Authorization: `Bearer ${bearer}`,
        },
      });

      // The API returns data in segments, extract the first segment
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data[0];
      }

      return response.data;
    } catch (e) {
      this.logger.error(`Error while getting tracker history: ${e.message}`);
      throw e;
    }
  }
}
