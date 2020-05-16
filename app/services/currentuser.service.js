import {API, Auth} from 'aws-amplify';
import Bank from './bank.model';

let _bank = {
    coins: 500,
    tickets: 27,
}

export default class CurrentUserService {


    getUserDetails = async () => {
        try {
            const user = await Auth.currentAuthenticatedUser();
            const result = user.signInUserSession.idToken.payload;
            return result;
        }
        catch(ex) {
            console.log("Failed to get user details:")
            console.log(ex);
            return null
        }
    }

    getAccessToken = async () => {
        const session = await Auth.currentSession();
        return session.getAccessToken().getJwtToken();
          
    }

    getUserBank = () => {
        const bank = Object.assign(new Bank, _bank);
        return bank;
    }

    addBank = (addBank) => {
        const bank = {
           coins: parseInt(_bank.coins) + parseInt(addBank.coins),
           tickets: parseInt(_bank.tickets) + parseInt(addBank.tickets),
        }

        _bank = bank;

        return _bank;
    }


}