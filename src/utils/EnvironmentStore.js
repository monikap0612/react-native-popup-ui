
var EnvironmentStore = {
    getApiHost: function (name) {
        switch (name) {

            // place your baseURL according it's environment
            case 'test':
                return 'https://demo-v1.voltpanda.in/api/app/v1';
            case 'live':
                return 'https://demo-v1.voltpanda.in/api/app/v1';
            default:
                throw ("Unknown Environment.getApiHost: " + name)
        }
    }
}

export default EnvironmentStore;