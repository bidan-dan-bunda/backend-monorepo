export function toArray(thing: any) {
  if (!thing || Array.isArray(thing)) {
    return thing;
  }
  return [thing];
}
