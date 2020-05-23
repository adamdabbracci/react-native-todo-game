// REFERENCE: https://docs.amplify.aws/lib/pubsub/getting-started/q/platform/js

import Amplify, { PubSub } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub/lib/Providers';

Amplify.addPluggable(new AWSIoTProvider({
    aws_pubsub_region: 'us-east-1',
    aws_pubsub_endpoint: 'wss://a30jp8scl2nor2-ats.iot.us-east-1.amazonaws.com/mqtt',
  }));

export default class PubSubService {

    constructor() {
        
    }

    subscribe = () => {
        // TODO, not important right now.
    //    try {
    //     console.log("Setting up pub sub")
    //     PubSub.subscribe('myTopic').subscribe({
    //         next: data => console.log('Message received', data),
    //         error: error => {
    //             console.log("PUBSUB ERROR:")
    //             console.log(error);
    //         },
    //         close: () => console.log('Done'),
    //     });
    //    }
    //    catch(ex) {
    //        console.log(`======= PUSUB FAILED`)
    //        console.log(ex);
    //    }
    }
}