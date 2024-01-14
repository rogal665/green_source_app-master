const getColorScaleUnit = (min, max) => 1 / (max - min);

const getMaxAndMinCountryDataValues = (countryData) => {
  let min, max;

  Object.keys(countryData).forEach((key) => {
    if (key === "unknown") return;

    const value = countryData[key];

    if (value < min || min === undefined) min = value;
    if (value > max || max === undefined) max = value;
  });

  return { min, max };
};

export const getBaseCss = ({ defaultCountryFillColor, countryStrokeColor }) =>
  `.vue-world-map .land{fill:${defaultCountryFillColor};stroke:${countryStrokeColor};stroke-width:0.1;}`;

export const getDynamicMapCss = (countryData, chromaScale) => {
  const { min, max } = getMaxAndMinCountryDataValues(countryData);
  const colorScaleUnit = getColorScaleUnit(min, max);
  const css = [];

  Object.keys(countryData).forEach((key) => {
    if (key === "unknown") return;

    const value = countryData[key];
    const scaleValue = colorScaleUnit * (value - min);
    const hex = chromaScale(scaleValue).hex();

    css.push(`.vue-world-map #${key} { fill: ${hex}; }`);
  });

  return css;
};

export const getCombinedCssString = (baseCss, dynamicCss) => {
  dynamicCss.push(baseCss);

  return dynamicCss.join(" ");
};
