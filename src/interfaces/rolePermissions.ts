import PermissionInterface from './permissions';

interface RolePermissionInterface {
  id: number;
  roleId: number;
  permissionId: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  permission?: PermissionInterface;
};

export default RolePermissionInterface;
