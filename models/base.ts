export interface IBase {
  id: string;
  createdAt?: string | null;
  createdBy?: string | null;
  updatedAt?: string | null;
  updatedBy?: string | null;
  deletedAt?: string | null;
  deletedBy?: string | null;
  isDeleted: boolean;
}

export class Base implements IBase {
  id: string;
  createdAt?: string | null;
  createdBy?: string | null;
  updatedAt?: string | null;
  updatedBy?: string | null;
  deletedAt?: string | null;
  deletedBy?: string | null;
  isDeleted: boolean;

  constructor(data?: Partial<IBase>) {
    this.id = data?.id ?? "";
    this.createdAt = data?.createdAt ?? null;
    this.createdBy = data?.createdBy ?? null;
    this.updatedAt = data?.updatedAt ?? null;
    this.updatedBy = data?.updatedBy ?? null;
    this.deletedAt = data?.deletedAt ?? null;
    this.deletedBy = data?.deletedBy ?? null;
    this.isDeleted = data?.isDeleted ?? false;
  }
}
