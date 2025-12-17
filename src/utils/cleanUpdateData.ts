export const cleanObject = (array: any) => {
  //* Convierto el objeto en un array clave-valor.
  const valuesArray = Object.entries(array);

  //* Le aplico un filtro para eliminar elementos undefined.
  const cleanValuesArray = valuesArray.filter(
    ([_, value]) => value !== undefined
  );

  //* Lo reconvierto en un objeto.
  const valuesToUpdate = Object.fromEntries(cleanValuesArray);

  return valuesToUpdate;
};
