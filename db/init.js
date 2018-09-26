const cds = require('@sap/cds')
const csv2json = require('csvtojson')

const csv = {
  teched_flight_trip_AircraftCodes: 'aircraftcodes',
  teched_flight_trip_Airlines: 'airlines',
  teched_flight_trip_Airports: 'airports',
  teched_flight_trip_EarthRoutes: 'earthroutes',
  teched_flight_trip_Itineraries: 'itineraries',
  teched_space_trip_AstronomicalBodies: 'astrobodies',
  teched_space_trip_SpaceFlightCompanies: 'spaceflightcompanies',
  teched_space_trip_SpaceRoutes: 'spaceroutes',
  teched_space_trip_SpacePorts: 'spaceports'
}

module.exports = () => {
  let chain = Promise.resolve()

  for (const tableName in csv) {
    chain = chain
      .then(() => {
        return csv2json().fromFile(`./db/src/csv/${csv[tableName]}.csv`)
      })
      .then((values) => {
        return cds.run(INSERT.into(tableName).rows(values))
      })
      .then((rowCount) => {
        console.log(`Inserted successfully ${rowCount} rows in table ${tableName}`)
      })
  }

  return chain
}