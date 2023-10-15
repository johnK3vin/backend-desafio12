import { fileURLToPath } from "url";
import { dirname } from "path";

//consultando en nombre del archivo local
const fileName = fileURLToPath(import.meta.url);

export const __dirname = dirname(fileName)//path del archivo