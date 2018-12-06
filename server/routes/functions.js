const storeInDataBase = (
  pfile,
  pclients,
  pdoctors,
  pgroups,
  poffices,
  pservices,
  porders
) =>
  Promise.all([
    // ejecutar por cada array mejor
    pfile,
    ...pclients,
    ...pdoctors,
    ...pgroups,
    ...poffices,
    ...pservices
    //...porders
  ]).then(() => Promise.all(porders));

const getDataInArrays = rawData => {
  let data = {
    clients: [],
    offices: [],
    orders: [],
    doctors: [],
    groups: [],
    services: []
  };
  //console.log('Como llega la data: ', rawData);
  rawData.map(reg => {
    if (
      reg.hcu &&
      reg.paciente &&
      reg.email &&
      reg.sucursal &&
      reg.orden &&
      reg.fecha &&
      reg.medico &&
      reg.grupo &&
      reg.servicio
    ) {
      data = Object.assign(
        {},
        {
          clients: [
            ...data.clients,
            { hcu: reg.hcu, email: reg.email, name: reg.paciente }
          ],
          offices: [...data.offices, { description: reg.sucursal }],
          orders: [
            ...data.orders,
            {
              ref: reg.orden,
              attended: reg.fecha,
              hcu: reg.hcu,
              doctor: reg.medico,
              group: reg.grupo,
              service: reg.servicio,
              office: reg.sucursal
            }
          ],
          doctors: [...data.doctors, { name: reg.medico }],
          groups: [...data.groups, { description: reg.grupo }], // aqui revisar con lodash
          services: [...data.services, { description: reg.servicio }]
        }
      );
      //console.log("Como se va la data en array: ", data);
    } else {
      return false;
    }
  });
  return data;
};

module.exports = {
  storeInDataBase,
  getDataInArrays
};
