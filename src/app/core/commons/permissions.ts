export const Admin = 'Admin';
export const Manager = 'Manager';
export const User = 'User';

export const ADMIN_ACL = 'ADMIN_ACL';
export const MANAGER_ACL = 'MANAGER_ACL';
export const USER_ACL = 'USER_ACL';

export const ANY_ACL = 'ANY_ACL';

export class Permissions {
	public static get acls(): Map<string, string[]> {
		return new Map<string, string[]>()
			.set(ADMIN_ACL, [Admin])
			.set(MANAGER_ACL, [Admin, Manager])
			.set(USER_ACL, [Admin, Manager, User])
			.set(ANY_ACL, [Admin, Manager, User]);
	}
}
