export const naiveRound = (num, decimalPlaces = 2) => {
  var p = Math.pow(10, decimalPlaces);
  return Math.round(num * p) / p;
}

export const transformPercentToText = (ratio) => {
  if (ratio < 10) {
    return {
      label: 'VERY LOW',
      color: '#d6400d'
    };
  } else if (ratio < 30) {
    return {
      label: 'LOW',
      color: '#d68a0d'
    };
  } else if (ratio < 50) {
    return {
      label: 'MEDIUM',
      color: '#d6c60d'
    };
  } else if (ratio < 70) {
    return {
      label: 'HIGH',
      color: '#a2d60d'
    };
  } else {
    return {  
      label: 'VERY HIGH',
      color: '#4bd00d'
    };
  }
}