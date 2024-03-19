const getColorScaleUnit = (min, max) => 1 / (max - min);

const getMaxAndMinCountryDataValues = (totalCapacities, countryKey) => {
  let min = 0
  let max = totalCapacities && totalCapacities[countryKey] ? totalCapacities[countryKey] * 1000 : 0;
  
  // Object.keys(countryData).forEach((key) => {
  //   if (key === "unknown") return;

  //   const value = countryData[key];

  //   if (value < min || min === undefined) min = value;
  //   if (value > max || max === undefined) max = value;
  // });
  
  return { min, max };
};

export const getBaseCss = ({ defaultCountryFillColor, countryStrokeColor }) =>
  `.vue-world-map .land{fill:${defaultCountryFillColor};stroke:${countryStrokeColor};stroke-width:0.1;}`;

export const getDynamicMapCss = (countryData, chromaScale, totalCapacities) => {
  const css = [];

  Object.keys(countryData).forEach((key) => {
    if (key === "unknown") return;

    const { min, max } = getMaxAndMinCountryDataValues(totalCapacities, key);
    const colorScaleUnit = getColorScaleUnit(min, max);
    // debugger;
    const value = countryData[key] > 0 ? countryData[key] : 0;
    const scaleValue = value / max;
    const hex = chromaScale(scaleValue).hex();
    
    css.push(`.vue-world-map #${key} { fill: ${hex}; }`);
  });

  return css;
};

export const getCombinedCssString = (baseCss, dynamicCss) => {
  dynamicCss.push(baseCss);

  return dynamicCss.join(" ");
};
