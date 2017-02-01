class ConstructionPlugin {

    invocation(context) {
        // console.log('Probing DashboardPlugin'); // eslint-disable-line no-console
        // context.declareReducers(dashboardReducers);
        // context.declareEpics(dashboardEpics);
        context.declareLocation();
        context.declareBinding();
    }
}

export default ConstructionPlugin;
