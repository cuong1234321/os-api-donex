import PermissionGroupInterface from './permissionGroups';

interface PermissionInterface {
  id: number;
  groupId: number;
  title: string;
  key: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  group?: PermissionGroupInterface;
};

export default PermissionInterface;
