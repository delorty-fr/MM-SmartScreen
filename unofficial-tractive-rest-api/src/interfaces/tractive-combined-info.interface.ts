import { TractivePet } from './tractive-pet.interface';
import { TractiveTracker } from './tractive-tracker.interface';
import { TractiveHardware } from './tractive-hardware.interface';
import { TractiveLocation } from './tractive-location.interface';

/**
 * Combined interface containing all information for a tracker and its associated pet
 */
export interface TractiveCombinedInfo {
  pet?: TractivePet;
  tracker: TractiveTracker;
  hardware: TractiveHardware;
  location: TractiveLocation;
}
