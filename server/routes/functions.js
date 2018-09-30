const storeInDataBase = (
  pfile,
  pclients,
  pdoctors,
  pgroups,
  poffices,
  pservices,
  porders
) => {
  Promise.all([
    pfile,
    ...pclients,
    ...pdoctors,
    ...pgroups,
    ...poffices,
    ...pservices,
    ...porders
  ])
    .then(createdArr => "Todo bien")
    .catch(err => "Error storing the data");
};

const getDataInArrays = rawData => {
  let data = {
    clients: [],
    offices: [],
    orders: [],
    doctors: [],
    groups: [],
    services: []
  };
  rawData.map(reg => {
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
        groups: [...data.groups, { description: reg.grupo }],
        services: [...data.services, { description: reg.servicio }]
      }
    );
  });
  return data;
};

module.exports = {
  storeInDataBase,
  getDataInArrays
};
