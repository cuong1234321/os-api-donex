import LookBookMediaInterface from './lookBookMedias';

interface LookBookInterface {
  id: number,
  title: string,
  description: string,
  thumbnail: string,
  slug: string,
  status: boolean,
  parentId: number,
  createdAt?: Date,
  updatedAt?: Date,

  medias?: LookBookMediaInterface[],
  children?: LookBookInterface[],
};

export default LookBookInterface;
