let IncidentsProcess = require('../obj/src/container/IncidentsProcess').IncidentsProcess;

try {
    new IncidentsProcess().run(process.argv);
} catch (ex) {
    console.error(ex);
}
