export const getOrbitOmega = (M, r) => {
  return Math.sqrt(M / (r * r * r));
}

export default {
  getOrbitOmega,
}
