export function getSchemaType(typ: string | Array<string>): Array<string> {
  if (Array.isArray(typ)) {
    return typ;
  } else {
    return new Array(typ);
  }
}
