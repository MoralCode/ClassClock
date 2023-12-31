import { DateTime } from "luxon";


/**
 * An object that knows when it was last updated
 *
 * @export
 * @class UpdateTimestampedObject
 */
export default class UpdateTimestampedObject {
	protected lastUpdatedDate?: DateTime;

	constructor(lastUpdatedDate?:DateTime){
		this.lastUpdatedDate = lastUpdatedDate;
	}

	public lastUpdated() {
		return this.lastUpdatedDate;
	}

	public hasChangedSince(date: DateTime) {
		// date = date.toUTC();
		if (this.lastUpdatedDate !== undefined) {
			return date.toMillis() < this.lastUpdatedDate.toMillis();
		} else {
			return undefined;
		}
	}
}