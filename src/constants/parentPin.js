/** Factory default — must be changed before parent zone is fully usable in production. */
export const DEFAULT_PARENT_PIN = "1234";

export function isDefaultParentPin(pin) {
  return pin === DEFAULT_PARENT_PIN;
}
