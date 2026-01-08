import { Base, IBase } from "./base";

export interface IMultimedia extends IBase{
    url: string;
    cod_tipo_multimedia: "COD_AUDIO" | "COD_IMAGEN" | "COD_VIDEO" | null,
    file_name: string | null
    file?: File | null
}

export class Multimedia extends Base implements IMultimedia {
  url = "";
  cod_tipo_multimedia = null;
  file_name = null;
  file = null;

  constructor(data?: Partial<IMultimedia>) {
    super(data);
    Object.assign(this, data);
  }
}
