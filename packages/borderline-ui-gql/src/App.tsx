import { gql } from "apollo-boost";
import * as React from "react";
import { Query } from "react-apollo";

const LOCAL_HELLO = gql`
    query localHello($subject: String) {
        localHello(subject: $subject) @client
    }
`;

const SERVER_HELLO = gql`
    query serverHello($subject: String) {
        hello(subject: $subject)
    }
`;

const LocalHello = () => (
    <Query query={LOCAL_HELLO} variables={{ subject: "UI World" }}>
        {({ loading, error, data }) => {
            if (loading) {
                return (<h2>Loading...</h2>);
            }

            return <h2>Local query: {error ? error.message : data.localHello}</h2>;
        }}
    </Query>
);

const ServerHello = () => (
    <Query query={SERVER_HELLO} variables={{ subject: "Back World" }}>
        {({ loading, error, data }) => {
            if (loading) {
                return <h2>Loading...</h2>;
            }

            return <h2>Server query: {error ? error.message + ". No GraphQL Server running" : data.hello}</h2>;
        }}
    </Query>
);

const App = () => (
    <div>
        <h1>Test GraphQL</h1>
        <LocalHello />
        <ServerHello />
    </div>
);

export default App;
