// errors.ts
// This file contains classes that represent error conditions
// @author Adrian Edwards



/**
 * This custom Error class is intened to be used for passing a minimum wait 
 * time to the .catch() handlers responsible for retrying requests so requests 
 * arent made during a rate-limit coolown period
 * 
 * This class was created with the help of https://javascript.info/custom-errors
 *
 * @export
 * @class RateLimitError
 * @extends {Error}
 */
export class RateLimitError extends Error {
	wait: number;
	constructor(message:string, msToWait: number) {
		super(message);
		this.name = "RateLimitError";
		this.wait = msToWait;
	}
}