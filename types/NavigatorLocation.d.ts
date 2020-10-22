import AnyObject from "./AnyObject";

interface NavigatorLocation<State extends AnyObject = AnyObject> {
	/**
	 * The current normalized pathname. Normalized meaning, that a potential
	 * `basepath` is removed, so your app alway behaves the same, regardeless
	 * if it's running locally without a basepath or in production, served a
	 * subroute of your domain.
	 */
	pathname: string;
	/**
	 * The current search string. Will be `""` if no search string is present.
	 * Otherwise it will begin with a `?`.
	 */
	search: string;
	/**
	 * The current hash. Will be `""` if no hash is present.
	 * Otherwise it will begin with a `#`.
	 */
	hash: string;
	/**
	 * An arbitrary object, that has been pushed to the history stack.
	 */
	state: State;
}

export default NavigatorLocation;
