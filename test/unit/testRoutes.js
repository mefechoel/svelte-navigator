/* eslint-disable import/prefer-default-export */
function shuffle(a) {
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		// eslint-disable-next-line no-param-reassign
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

export const testRoutes = shuffle([
	{
		meta: "MainGroupMe",
		fullPath: "/groups/main/users/me",
	},
	{
		meta: "GroupMe",
		fullPath: "/groups/:groupId/users/me",
	},
	{
		meta: "GroupUser",
		fullPath: "/groups/:groupId/users/:userId",
	},
	{
		meta: "Fiver",
		fullPath: "/:one/:two/:three/:four/:five",
	},
	{
		meta: "GroupUsersSplat",
		fullPath: "/groups/:groupId/users/*",
	},
	{
		meta: "MainGroupUsers",
		fullPath: "/groups/main/users",
	},
	{
		meta: "GroupUsers",
		fullPath: "/groups/:groupId/users",
	},
	{
		meta: "MainGroup",
		fullPath: "/groups/main",
	},
	{
		meta: "Group",
		fullPath: "/groups/:groupId",
	},
	{
		meta: "Groups",
		fullPath: "/groups",
	},
	{
		meta: "FilesDeep",
		fullPath: "/files/*",
	},
	{
		meta: "Files",
		fullPath: "/files",
	},
	{
		meta: "Root",
		fullPath: "/",
	},
	{
		meta: "Default",
		default: true,
	},
]);
