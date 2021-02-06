/* eslint-disable import/no-extraneous-dependencies, import/prefer-default-export */
import { writable } from "svelte/store";

export const user = writable(null);

export const asyncCheckAuthStatus = async () => {
	// this could be a call to Amplify currentUserInfo or another async auth library
	// you could use the response to set user if success
	// or throw an error if user not found
	await new Promise(resolve => setTimeout(resolve, 1000));
};
